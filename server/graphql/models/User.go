package models

import (
	"context"
	"net/http"
	"os"
	"time"

	myContext "github.com/elisalimli/go_graphql_template/context"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id          string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	Username    string
	Email       string
	Password    string `bun:"type:varchar(100),notnull" json:"-"`
	Verified    bool
	PhoneNumber string
	CreatedAt   *time.Time
	UpdatedAt   *time.Time
	Posts       []*Post `bun:"rel:has-many"`
}

func (u *User) HashPassword(password string) error {
	bytePassword := []byte(password)
	passwordHash, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	u.Password = string(passwordHash)

	return nil
}

func (u *User) GenAccessToken() (*AuthToken, error) {
	// expiredAt := time.Now().Add(time.Hour * 24 * 60) // 2 months
	expiredAt := time.Now().Add(time.Second * 20) // 2 months

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		ExpiresAt: expiredAt.Unix(),
		Id:        u.Id,
		IssuedAt:  time.Now().Unix(),
		Issuer:    "go_graphql",
	})

	accessToken, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return nil, err
	}

	return &AuthToken{
		Token:     accessToken,
		ExpiredAt: expiredAt,
	}, nil
}

func (u *User) GenRefreshToken() (*AuthToken, error) {
	expiredAt := time.Now().Add(time.Hour * 24 * 365) // 1 year

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		ExpiresAt: expiredAt.Unix(),
		Id:        u.Id,
		IssuedAt:  time.Now().Unix(),
		Issuer:    "go_graphql",
	})

	refreshToken, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return nil, err
	}

	return &AuthToken{
		Token:     refreshToken,
		ExpiredAt: expiredAt,
	}, nil
}

func (u *User) SaveRefreshToken(ctx context.Context, refreshToken *AuthToken) {
	rtCookie := http.Cookie{
		Name:    os.Getenv("COOKIE_REFRESH_TOKEN"),
		Path:    "/", // <--- add this line
		Value:   refreshToken.Token,
		Expires: refreshToken.ExpiredAt,
		Secure:  false,
	}

	writer, _ := ctx.Value(myContext.HttpWriterKey).(http.ResponseWriter)
	// saving cookie
	http.SetCookie(writer, &rtCookie)
}

func (u *User) ComparePassword(password string) error {
	bytePassword := []byte(password)
	byteHashedPassword := []byte(u.Password)
	return bcrypt.CompareHashAndPassword(byteHashedPassword, bytePassword)
}
