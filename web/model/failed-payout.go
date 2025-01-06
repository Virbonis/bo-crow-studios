package model

type ListFailedPayout struct {
	ProcessID     string `json:"process_id" db:"ProcessID"`
	TotalTicket   int    `json:"total_ticket" db:"TotalTicket"`
	LastError     string `json:"last_error" db:"Last_Error"`
	LastErrorDate string `json:"last_error_date" db:"LastErrorDate"`
	MatchID       string `json:"match_id" db:"MatchID"`
}
