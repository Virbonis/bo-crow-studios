package model

type ListScoringOutright struct {
	OutrightID          int    `json:"outright_id" db:"Outright_ID"`
	OutrightDate        string `json:"outright_date" db:"Outright_Date"`
	LeagueID            int    `json:"league_id" db:"League_ID"`
	LeagueName          string `json:"league_name" db:"League_Name"`
	OutrightOpenStatus  string `json:"outright_open_status" db:"Outright_Open_Status"`
	OutrightScoreStatus string `json:"outright_score_status" db:"Outright_Score_Status"`
	OutrightScore       string `json:"outright_score" db:"Outright_Score"`
}

type ListScoringOutrightTeam struct {
	TeamID     int    `json:"team_id" db:"Team_ID"`
	TeamName   string `json:"team_name" db:"Team_Name"`
	TeamResult int    `json:"team_result" db:"Team_Result"`
}
