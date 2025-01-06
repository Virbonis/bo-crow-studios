package model

import "github.com/guregu/null"

type CustomerBuybackList struct {
	CustomerID              int         `json:"customer_id" db:"Customer_ID"`
	CustomerType            string      `json:"customer_type" db:"Customer_Type"`
	CustomerLevel           string      `json:"customer_level" db:"Customer_Level"`
	CompanyName             string      `json:"company_name" db:"Company_Name"`
	Username                string      `json:"username" db:"Username"`
	AliasName               null.String `json:"alias_name" db:"AliasName"`
	Currency                string      `json:"currency" db:"Currency"`
	CommPct                 float64     `json:"comm_pct" db:"Comm_Pct"`
	CommPctOthers           float64     `json:"comm_pct_others" db:"Comm_Pct_Others"`
	PTShare                 float64     `json:"pt_share" db:"PT_Share"`
	IsHasDownline           string      `json:"is_has_downline" db:"Is_Has_Downline"`
	CustomerTreeGetDownline string      `json:"customer_tree_get_downline" db:"Customer_Tree_Get_Downline"`
}

type UplineCustomerBuyBack struct {
	CustomerID int         `json:"customer_id" db:"CustomerID"`
	Username   null.String `json:"username" db:"Username"`
}
