package models

import (
	"encoding/json"
	"time"
)

type Post struct {
	ID          string `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	Title       string `gorm:"size:1000;not null"`
	Description string `gorm:"size:65535;not null"`
	Files       []Post_File
	UserID      string     `gorm:"not null"`
	Creator     User       `gorm:"foreignKey:UserID;references:ID"`
	CreatedAt   *time.Time `gorm:"not null;default:now()"`
	UpdatedAt   *time.Time `gorm:"not null;default:now()"`
}

type Post_File struct {
	ID     string `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	PostId string `gorm:"not null"`
	Post   Post   `gorm:"foreignKey:PostId;references:ID"`
	Url    string `gorm:"not null"`
}

// From standard library `database/sql` package
type Scanner interface {
	Scan(src any) error
}

// Scan implements Scanner interface using our CountryResponseWithAddress struct
func (m *Post) Scan(src any) error {
	val := src.([]byte) // []byte is an alias of []uint8
	return json.Unmarshal(val, &m)
}
