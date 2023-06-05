package models

import (
	"time"

	"github.com/uptrace/bun"
)

type Post struct {
	Id          string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	Title       string
	Description *string
	UserId      string     `bun:"user_id,type:uuid,notnull"`
	Creator     *User      `bun:"rel:belongs-to,join:user_id=id"`
	CreatedAt   *time.Time `bun:"created_at"`
	UpdatedAt   *time.Time `bun:"updated_at"`
	Files       []PostFile `bun:"rel:has-many"`
	Tags        []Tag      `bun:"m2m:post_tags,join:Post=Tag"`
}

type PostFile struct {
	Id          string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	PostId      string `bun:"post_id,type:uuid,notnull"`
	Post        *Post  `bun:"rel:belongs-to,join:post_id=id"`
	URL         string
	FileSize    int64  `bun:"file_size"`
	FileName    string `bun:"file_name"`
	ContentType string `bun:"content_type"`
}

type PostTag struct {
	bun.BaseModel `bun:"table:post_tags,alias:pt"`
	PostId        string `bun:",pk"`
	TagId         string `bun:",pk"`
	Tag           *Tag   `bun:"rel:belongs-to,join:tag_id=id"`
	Post          *Post  `bun:"rel:belongs-to,join:post_id=id"`
}
