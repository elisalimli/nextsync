package models

import "time"

type Post struct {
	ID          string      `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	Title       string      `gorm:"size:1000;not null"`
	Description string      `gorm:"size:65535;not null"`
	Files       []Post_File `gorm:"foreignKey:PostId"`
	CreatedAt   *time.Time  `gorm:"not null;default:now()"`
	UpdatedAt   *time.Time  `gorm:"not null;default:now()"`
}

type Post_File struct {
	ID     string `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	PostId string
	Url    string `gorm:"not null"`
}
