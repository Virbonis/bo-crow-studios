package model

import "github.com/guregu/null"

type GridCancelGame struct {
	RowID      int         `json:"row_id" db:"RowID"`
	RequestID  string      `json:"request_id" db:"RequestID"`
	OperatorID string      `json:"operator_id" db:"OperatorID"`
	LastError  string      `json:"last_error" db:"LastError"`
	LastTry    null.String `json:"last_try" db:"LastTry"`
	Params     string      `json:"params" db:"Params"`
	JobType    string      `json:"job_type" db:"JobType"`
	BranchName string      `json:"branch_name" db:"BranchName"`
	StampDate  string      `json:"stamp_date" db:"Stampdate"`
}
