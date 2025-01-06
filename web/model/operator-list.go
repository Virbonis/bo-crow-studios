package model

import "github.com/guregu/null"

type OperatorList struct {
	BranchID    string      `json:"branch_id" db:"Branch_ID"`
	BranchName  string      `json:"branch_name" db:"Branch_Name"`
	Prefix      null.String `json:"prefix" db:"Prefix"`
	OperatorID  null.String `json:"operator_id" db:"Operator_ID"`
	UserName    null.String `json:"user_name" db:"User_Name"`
	AppID       int         `json:"app_id" db:"App_ID"`
	SecretKey   null.String `json:"secret_key" db:"SecretKey"`
	ValidateURL null.String `json:"validate_url" db:"Validate_URL"`
	STSeamless  null.String `json:"st_seamless" db:"ST_Seamless"`
}
