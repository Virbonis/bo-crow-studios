package model

type CountryList struct {
	ISOCountryCode *string `json:"iso_country_code" db:"ISOCountryCode"`
	CountryName    string  `json:"country_name" db:"CountryName"`
}
