package model

import "github.com/guregu/null"

type GridPayoutTracker struct {
	NoTxn         int         `json:"no_txn" db:"No_Txn"`
	MemberID      string      `json:"member_id" db:"MemberID"`
	PayoutDate    string      `json:"payout_date" db:"PayoutDate"`
	PayoutAmount  float64     `json:"payout_amount" db:"PayoutAmount"`
	TakenDate     null.String `json:"taken_date" db:"TakenDate"`
	ConfirmDate   null.String `json:"confirm_date" db:"ConfirmDate"`
	ProcessID     string      `json:"process_id" db:"ProcessID"`
	LastError     null.String `json:"last_error" db:"Last_Error"`
	LastErrorDate null.String `json:"last_error_date" db:"Last_ErrorDate"`
	PayoutType    string      `json:"payout_type" db:"PayoutType"`
	ProcessID2    string      `json:"process_id2" db:"ProcessID"`
}
