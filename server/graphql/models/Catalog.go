package models

type Catalog struct {
	Id   string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	Name string
	Code string
}
