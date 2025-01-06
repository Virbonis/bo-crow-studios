package model

type LuckyNumber struct {
	NoTxn     string `json:"no_txn" db:"no_txn"`
	UserID    string `json:"user_id" db:"user_id"`
	TransDate string `json:"trans_date" db:"trans_date"`
	Jumlah    string `json:"bet_amount" db:"Jumlah"`
	Currency  string `json:"currency" db:"Currency"`
}
