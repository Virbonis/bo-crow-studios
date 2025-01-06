package model

type OperatorSetting struct {
	BranchID          string `json:"branch_id" db:"branchcode"`
	BranchName        string `json:"branch_name" db:"BranchName"`
	Prefix            string `json:"prefix" db:"prefix"`
	OperatorID        string `json:"operator_id" db:"operatorid"`
	OddsType          int    `json:"odds_type" db:"OddsType"`
	DefaultLanguage   string `json:"default_language" db:"DefaultLanguage"`
	SupportedLanguage string `json:"supported_language" db:"SupportedLanguage"`
	PortalURL         string `json:"portal_url" db:"PortalURL"`
	IsSubDomain       bool   `json:"is_sub_domain" db:"IsSubDomain"`
}
