package models

import (
	"time"
)

type Post struct {
	Id          string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	Title       string
	Description string
	UserId      string `bun:"type:uuid,notnull"`
	Creator     *User  `bun:"rel:belongs-to,join:user_id=id"`
	CreatedAt   *time.Time
	UpdatedAt   *time.Time
	Files       []PostFile `bun:"rel:has-many"`
}

type PostFile struct {
	Id          string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	PostId      string `bun:"type:uuid,notnull"`
	Post        *Post  `bun:"rel:belongs-to,join:post_id=id"`
	URL         string
	ContentType string
}
