package model

type Currency struct {
	Currency        string  `json:"currency" db:"Currency"`
	Description     string  `json:"description" db:"Currency_Name"`
	CurrencyRate    float64 `json:"currency_rate" db:"Rate"`
	MinBet          float64 `json:"minbet" db:"Min_Bet"`
	MaxPayoutCS     float64 `json:"max_payout_cs" db:"Max_Payout_CS"`
	MaxPayOutParlay float64 `json:"max_payout_parlay" db:"Max_Payout_Parlay"`
	EffectiveDate   string  `json:"effective_date" db:"Effective_Date"`
	StampUser       string  `json:"stamp_user" db:"Stamp_User"`
	StampDate       string  `json:"stamp_date" db:"Stamp_Date"`
}

type CurrencySelect struct {
	CurrencyID   string `json:"currency_id" db:"Currency_ID"`
	CurrencyName string `json:"currency_name" db:"Currency_Name"`
}
