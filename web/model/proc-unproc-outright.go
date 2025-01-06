package model

type ProcessOutright struct {
	OutrightID            int    `json:"outright_id" db:"Outright_ID"`
	OutrightDate          string `json:"outright_date" db:"Outright_Date"`
	LeagueID              int    `json:"league_id" db:"League_ID"`
	LeagueName            string `json:"league_name" db:"League_Name"`
	OutrightScoreStatus   string `json:"outright_score_status" db:"Outright_Score_Status"`
	OutrightScore         string `json:"outright_score" db:"Outright_Score"`
	OutrightProcessStatus string `json:"outright_process_status" db:"Outright_Process_Status"`
}
