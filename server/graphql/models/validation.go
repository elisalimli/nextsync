package models

import (
	"github.com/elisalimli/nextsync/server/validator"
)

func (r RegisterInput) Validate() (bool, map[string]string) {
	v := validator.New()

	v.Required("email", r.Email, nil)
	v.IsEmail("email", r.Email)

	v.Required("password", r.Password, nil)
	v.MinLength("password", r.Password, 6)

	v.Required("confirmPassword", r.ConfirmPassword, nil)
	v.EqualToField("confirmPassword", r.ConfirmPassword, "password", r.Password)

	v.Required("username", r.Username, nil)
	v.MinLength("username", r.Username, 2)

	v.Required("firstName", r.FirstName, nil)
	v.MinLength("firstName", r.FirstName, 2)

	v.Required("lastName", r.LastName, nil)
	v.MinLength("lastName", r.LastName, 2)

	v.Required("phoneNumber", r.PhoneNumber, nil)
	v.IsPhoneNumber("phoneNumber", r.PhoneNumber)

	return v.IsValid(), v.Errors
}

func (l LoginInput) Validate() (bool, map[string]string) {
	v := validator.New()

	v.Required("email", l.Email, nil)
	v.IsEmail("email", l.Email)

	v.Required("password", l.Password, nil)

	return v.IsValid(), v.Errors
}

func (l SendOtpInput) Validate() (bool, map[string]string) {
	v := validator.New()

	v.Required("to", l.To, nil)
	v.IsPhoneNumber("to", l.To)

	return v.IsValid(), v.Errors
}

func (l VerifyOtpInput) Validate() (bool, map[string]string) {
	v := validator.New()

	v.Required("to", l.To, nil)
	v.IsPhoneNumber("to", l.To)

	v.Required("code", l.Code, nil)

	return v.IsValid(), v.Errors
}

func (l CreatePostInput) Validate() (bool, map[string]string) {
	v := validator.New()

	v.Required("title", l.Title, nil)
	// v.MinLength("lastName", l.LastName, 2)

	return v.IsValid(), v.Errors
}

func (l GoogleSignUpInput) Validate() (bool, map[string]string) {
	v := validator.New()
	usernameRequiredMessage := "Istifadəçi adı daxil edilməlidir."
	phoneNumberRequiredMessage := "Telefon nömrəsi daxil edilməlidir."

	v.Required("username", l.Username, &usernameRequiredMessage)
	v.Required("phoneNumber", l.PhoneNumber, &phoneNumberRequiredMessage)
	v.IsPhoneNumber("phoneNumber", l.PhoneNumber)

	// v.MinLength("lastName", l.LastName, 2)

	return v.IsValid(), v.Errors
}

func (l GoogleLoginInput) Validate() (bool, map[string]string) {
	v := validator.New()

	v.Required("token", l.Token, nil)

	// v.MinLength("lastName", l.LastName, 2)

	return v.IsValid(), v.Errors
}

func (d DeletePostInput) Validate() (bool, map[string]string) {
	v := validator.New()

	v.Required("id", d.ID, nil)

	return v.IsValid(), v.Errors
}
