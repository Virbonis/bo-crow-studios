package model

type SettledMatchCount struct {
	No_Sport             int    `json:"no_sport" db:"No_Sport"`
	Nama_Sport           string `json:"sport_name" db:"Nama_Sport"`
	Entered_2DaysBf      int    `json:"entered_2daysbf" db:"Entered_2DaysBf"`
	NonEntered_2DaysBf   int    `json:"nonentered_2daysbf" db:"NonEntered_2DaysBf"`
	Entered_Yesterday    int    `json:"entered_yesterday" db:"Entered_Yesterday"`
	NonEntered_Yesterday int    `json:"nonentered_yesterday" db:"NonEntered_Yesterday"`
	Entered_Today        int    `json:"entered_today" db:"Entered_Today"`
	NonEntered_Today     int    `json:"nonentered_today" db:"NonEntered_Today"`
}
