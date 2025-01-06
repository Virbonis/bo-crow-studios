package model

type ListFlag struct {
	FlagID     int    `json:"flag_id" db:"FlagID"`
	FlagName   string `json:"flag_name" db:"FlagName"`
	FlagSource string `json:"flag_source" db:"FlagSource"`
}
