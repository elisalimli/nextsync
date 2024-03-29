package validator

import (
	"fmt"
	"reflect"
)

func (v *Validator) Required(field string, value interface{}, customErrorMessage *string) bool {
	if _, ok := v.Errors[field]; ok {
		return false
	}
	fmt.Println(IsEmpty(value), value)
	if IsEmpty(value) {
		if customErrorMessage != nil {
			v.Errors[field] = *customErrorMessage
		} else {
			v.Errors[field] = fmt.Sprintf("%s is required", field)
		}
		return false
	}

	return true
}

func IsEmpty(value interface{}) bool {
	t := reflect.ValueOf(value)

	switch t.Kind() {
	case reflect.String, reflect.Array, reflect.Slice, reflect.Map:
		return t.Len() == 0
	}

	return false
}
