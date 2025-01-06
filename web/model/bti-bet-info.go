package model

import "github.com/guregu/null"

type BTIBetInfo struct {
	RequestID         string      `json:"request_id" db:"RequestID"`
	RequestDate       string      `json:"request_date" db:"RequestDate"`
	BetID             int         `json:"bet_id" db:"BetID"`
	UserLogin         string      `json:"user_login" db:"UserLogin"`
	BetAmount         float32     `json:"bet_amount" db:"BetAmount"`
	ReserveID         string      `json:"reserve_id" db:"ReserveID"`
	ReserveDate       null.String `json:"reserve_date" db:"ReserveDate"`
	ReserveStatus     null.String `json:"reserve_status" db:"ReserveStatus"`
	DebitDate         null.String `json:"debit_date" db:"DebitDate"`
	CommitDate        null.String `json:"commit_date" db:"CommitDate"`
	CancelDate        null.String `json:"cancel_date" db:"CancelDate"`
	TransactionStatus string      `json:"transaction_status" db:"TransactionStatus"`
	WaitingID         string      `json:"waiting_id" db:"WaitingID"`
	PurchaseID        string      `json:"purchase_id" db:"PurchaseID"`
	PayoutDate        null.String `json:"payout_date" db:"PayoutDate"`
}
