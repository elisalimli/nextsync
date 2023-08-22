package domain

import (
	"context"

	"github.com/elisalimli/nextsync/server/validator"
)

func Validation(ctx context.Context, v validator.Validation) (bool, []*validator.FieldError) {
	isValid, errors := v.Validate()
	fieldErrors := []*validator.FieldError{}
	if !isValid {
		for field, message := range errors {
			fieldErrors = append(fieldErrors, &validator.FieldError{Message: message, Field: field})
		}
	}

	return isValid, fieldErrors
}
