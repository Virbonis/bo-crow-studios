package model

import "github.com/guregu/null"

type MemberLogin struct {
	Index_Number  int         `json:"index_number" db:"Index_Number"`
	Customer_ID   int         `json:"customer_id" db:"Customer_ID"`
	Customer_Type string      `json:"customer_type" db:"Customer_Type"`
	Branch_Name   string      `json:"branch_name" db:"Branch_Name"`
	Username      string      `json:"username" db:"Username"`
	AliasName     null.String `json:"alias_name" db:"AliasName"`
	LoginDate     string      `json:"login_date" db:"LoginDate"`
	LogoutDate    null.String `json:"logout_date" db:"LogoutDate"`
	IPAddress     string      `json:"ip_address" db:"IPAddress"`
	Country       null.String `json:"country" db:"Country"`
}
