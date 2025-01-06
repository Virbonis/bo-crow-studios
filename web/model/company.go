package model

type CompanyBuyFrom struct {
	CompanyID   int    `json:"company_id" db:"Company_ID"`
	CompanyName string `json:"company_name" db:"Company_Name"`
}
