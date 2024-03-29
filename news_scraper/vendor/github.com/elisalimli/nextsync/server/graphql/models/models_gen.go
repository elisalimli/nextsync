// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package models

import (
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/elisalimli/nextsync/server/validator"
)

type IFormResponse interface {
	IsIFormResponse()
	GetOk() bool
	GetErrors() []*validator.FieldError
}

type AuthResponse struct {
	Ok        bool                    `json:"ok"`
	Errors    []*validator.FieldError `json:"errors,omitempty"`
	AuthToken *AuthToken              `json:"authToken,omitempty"`
	User      *User                   `json:"user,omitempty"`
}

func (AuthResponse) IsIFormResponse() {}
func (this AuthResponse) GetOk() bool { return this.Ok }
func (this AuthResponse) GetErrors() []*validator.FieldError {
	if this.Errors == nil {
		return nil
	}
	interfaceSlice := make([]*validator.FieldError, 0, len(this.Errors))
	for _, concrete := range this.Errors {
		interfaceSlice = append(interfaceSlice, concrete)
	}
	return interfaceSlice
}

type AuthToken struct {
	Token     string    `json:"token"`
	ExpiredAt time.Time `json:"expiredAt"`
}

// The `UploadFile` type, represents the request for uploading a file with a certain payload.
type CreatePostInput struct {
	Files       []*UploadFile `json:"files,omitempty"`
	Title       string        `json:"title"`
	Description string        `json:"description"`
}

type CreatePostResponse struct {
	Ok     bool                    `json:"ok"`
	Errors []*validator.FieldError `json:"errors,omitempty"`
	Post   *Post                   `json:"post,omitempty"`
}

func (CreatePostResponse) IsIFormResponse() {}
func (this CreatePostResponse) GetOk() bool { return this.Ok }
func (this CreatePostResponse) GetErrors() []*validator.FieldError {
	if this.Errors == nil {
		return nil
	}
	interfaceSlice := make([]*validator.FieldError, 0, len(this.Errors))
	for _, concrete := range this.Errors {
		interfaceSlice = append(interfaceSlice, concrete)
	}
	return interfaceSlice
}

// The `File` type, represents the response of uploading a file.
type File struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Content     string `json:"content"`
	ContentType string `json:"contentType"`
}

type FormResponse struct {
	Ok     bool                    `json:"ok"`
	Errors []*validator.FieldError `json:"errors,omitempty"`
}

type GoogleLoginOrSignUpInput struct {
	Token       string  `json:"token"`
	Username    *string `json:"username,omitempty"`
	PhoneNumber *string `json:"phoneNumber,omitempty"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type PostsInput struct {
	Cursor      *string  `json:"cursor,omitempty"`
	Limit       *int     `json:"limit,omitempty"`
	SearchQuery *string  `json:"searchQuery,omitempty"`
	TagIds      []string `json:"tagIds,omitempty"`
}

type PostsResponse struct {
	HasMore bool    `json:"hasMore"`
	Posts   []*Post `json:"posts"`
}

type RegisterInput struct {
	Username        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
	FirstName       string `json:"firstName"`
	LastName        string `json:"lastName"`
	PhoneNumber     string `json:"phoneNumber"`
}

type SendOtpInput struct {
	To string `json:"to"`
}

// The `UploadFile` type, represents the request for uploading a file with certain payload.
type UploadFile struct {
	ID   int            `json:"id"`
	File graphql.Upload `json:"file"`
}

type VerifyOtpInput struct {
	To   string `json:"to"`
	Code string `json:"code"`
}
