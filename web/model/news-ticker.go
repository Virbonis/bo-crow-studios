package model

import "github.com/guregu/null"

type NewsTicker struct {
	News_ID             int         `json:"news_id" db:"News_ID"`
	News_Sequence       int         `json:"news_sequence" db:"News_Sequence"`
	News_From_Date      string      `json:"news_from_date" db:"News_From_Date"`
	News_To_Date        string      `json:"news_to_date" db:"News_To_Date"`
	Website_Name        null.String `json:"website_name" db:"Website_Name"`
	Lang                string      `json:"lang" db:"Lang"`
	News                string      `json:"news" db:"News"`
	News_Display_Status string      `json:"news_display_status" db:"News_Display_Status"`
	IsStarted           string      `json:"is_started" db:"IsStarted"`
	IsStraight          string      `json:"is_straight" db:"IsStraight"`
	IsEarly             string      `json:"is_early" db:"IsEarly"`
	Username            string      `json:"username" db:"Username"`
}

type SelectWesbite struct {
	Website_ID   int    `json:"website_id" db:"Website_ID"`
	Website_Name string `json:"website_name" db:"Website_Name"`
}
