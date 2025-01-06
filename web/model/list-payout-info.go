package model

import "github.com/guregu/null"

type GridPayoutInfo struct {
	LogID        int         `json:"log_id" db:"LogID"`
	No_Txn       int         `json:"no_txn" db:"No_Txn"`
	PayoutDate   null.String `json:"payout_date" db:"PayoutDate"`
	PayoutType   string      `json:"payout_type" db:"PayoutType"`
	PayoutAmount float64     `json:"payout_amount" db:"PayoutAmount"`
	TicketStatus string      `json:"ticket_status" db:"TicketStatus"`
	ProcessID    string      `json:"process_id" db:"ProcessID"`
	Retries      int         `json:"retries" db:"Retries"`
	Last_Error   string      `json:"last_error" db:"Last_Error"`
	ConfirmDate  null.String `json:"confirm_date" db:"ConfirmDate"`
}
