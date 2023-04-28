package models

import (
	"time"
)

type Post struct {
	ID          string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	Title       string
	Description string
	UserID      string `bun:"type:uuid,notnull"`
	Creator     *User  `bun:"rel:belongs-to,join:user_id=id"`
	CreatedAt   *time.Time
	UpdatedAt   *time.Time
	Files       []PostFile `bun:"rel:has-many"`
}

type PostFile struct {
	ID     string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	PostID string `bun:"type:uuid,notnull"`
	Post   *Post  `bun:"rel:belongs-to,join:post_id=id"`
	URL    string
}
