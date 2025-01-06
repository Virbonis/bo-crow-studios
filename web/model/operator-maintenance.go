package model

type OperatorMaintenance struct {
	BranchID      string `json:"branch_id" db:"Branch_ID"`
	BranchName    string `json:"branch_name" db:"Branch_Name"`
	Prefix        string `json:"prefix" db:"prefix"`
	OperatorID    string `json:"operator_id" db:"Operator_ID"`
	OperatorName  string `json:"operator_name" db:"OperatorName"`
	STMaintenance int    `json:"st_maintenance" db:"ST_Maintenance"`
}
