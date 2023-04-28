package validator

import (
	"fmt"

	"github.com/99designs/gqlgen/graphql"
)

// The `UploadFile` type, represents the request for uploading a file with certain payload.
type UploadFile struct {
	ID   int            `json:"id"`
	File graphql.Upload `json:"file"`
}

func (v *Validator) SupportedFiles(field string, value []*UploadFile) bool {

	if _, ok := v.Errors[field]; ok {
		return false
	}

	for _, file := range value {
		fmt.Println(file.File.ContentType)
	}
	if IsEmpty(value) {
		v.Errors[field] = fmt.Sprintf("%s is required", field)
		return false
	}

	return true
}
