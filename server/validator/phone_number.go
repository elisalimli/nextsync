package validator

import "regexp"

var phoneRegexp = regexp.MustCompile(`^\+\d{12}$`)

func (v *Validator) IsPhoneNumber(field, phone string) bool {
	if _, ok := v.Errors[field]; ok {
		return false
	}

	if !phoneRegexp.MatchString(phone) {
		v.Errors[field] = "Telefon nömrəsi düzgün daxil edilməyib."
		return false
	}

	return true
}
