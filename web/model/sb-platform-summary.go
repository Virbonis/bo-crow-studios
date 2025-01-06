package model

type GridSBPlatformSummary struct {
	BetDate   string  `json:"bet_date" db:"BetDate"`
	Txn_Type  string  `json:"txn_type" db:"Txn_Type"`
	Currency  string  `json:"currency" db:"Currency"`
	BetAmount float64 `json:"bet_amount" db:"BetAmount"`
	Ticket    int     `json:"ticket" db:"Ticket"`
	Users     int     `json:"users" db:"Users"`
}
