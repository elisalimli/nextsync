package models

import (
	"time"
)

type Post struct {
	Id          string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	Title       string
	Description string
	Variant     string
	Type        string
	Language    string
	UserId      string     `bun:"user_id,type:uuid,notnull"`
	Creator     *User      `bun:"rel:belongs-to,join:user_id=id"`
	CreatedAt   *time.Time `bun:"created_at"`
	UpdatedAt   *time.Time `bun:"updated_at"`
	Files       []PostFile `bun:"rel:has-many"`
}

type PostFile struct {
	Id          string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	PostId      string `bun:"post_id,type:uuid,notnull"`
	Post        *Post  `bun:"rel:belongs-to,join:post_id=id"`
	URL         string
	FileSize    int64  `bun:"file_size"`
	ContentType string `bun:"content_type"`
}
