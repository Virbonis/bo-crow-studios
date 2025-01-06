package model

import "github.com/guregu/null"

type BTIPayoutTracker struct {
	PurchaseID   string      `json:"purchase_id" db:"PurchaseID"`
	UserLogin    string      `json:"user_login" db:"UserLogin"`
	PayoutDate   string      `json:"payout_date" db:"PayoutDate"`
	PayoutAmount float32     `json:"payout_amount" db:"PayoutAmount"`
	PayoutStatus string      `json:"payout_status" db:"PayoutStatus"`
	ProcessID    string      `json:"process_id" db:"ProcessID"`
	ProcessDate  null.String `json:"process_date" db:"ProcessDate"`
	PayoutSeq    int         `json:"payout_seq" db:"PayoutSeq"`
	PayoutTime   null.String `json:"payout_time" db:"PayoutTime"`
}
