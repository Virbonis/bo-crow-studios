package model

type NegativeBalance struct {
	Username        string  `json:"username" db:"Username"`
	Currency        string  `json:"currency" db:"Currency"`
	Current_Balance float64 `json:"current_balance" db:"Current_Balance"`
}
