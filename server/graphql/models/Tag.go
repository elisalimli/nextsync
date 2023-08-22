package models

type Tag struct {
	Id        string `bun:"type:uuid,default:uuid_generate_v4(),pk"`
	Name      string
	Code      string
	Catalog   *Catalog
	CatalogId string `bun:"catalog_id,type:uuid"`
}
