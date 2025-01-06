package model

type CashFlowTracker struct {
	RefNo           int     `json:"ref_no" db:"Ref_No"`
	TrackID         int     `json:"track_id" db:"Track_ID"`
	TrackDate       string  `json:"track_date" db:"Track_Date"`
	Username        string  `json:"username" db:"Username"`
	AffairName      string  `json:"affair_name" db:"Affair_Name"`
	Currency        string  `json:"currency" db:"Currency"`
	AmountChange    float64 `json:"amount_change" db:"Amount_Change"`
	PreviousBalance float64 `json:"previous_balance" db:"Previous_Balance"`
	CurrentBalance  float64 `json:"current_balance" db:"Current_Balance"`
	DateCreate      string  `json:"date_create" db:"Date_Create"`
}
