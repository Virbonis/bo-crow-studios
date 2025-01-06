package model

type GridCancelOutright struct {
	OutrightID          int    `json:"outright_id" db:"Outright_ID"`
	OutrightDate        string `json:"outright_date" db:"Outright_Date"`
	LeagueID            int    `json:"league_id" db:"League_ID"`
	LeagueName          string `json:"league_name" db:"League_Name"`
	OutrightScoreStatus string `json:"outright_score_status" db:"Outright_Score_Status"`
	OutrightScore       string `json:"outright_score" db:"Outright_Score"`
}

type GridCancelOutrightTeam struct {
	NoSequence   int    `json:"no_sequence" db:"No_Sequence"`
	TeamWLStatus string `json:"team_wl_status" db:"Team_WL_Status"`
	TeamName     string `json:"team_name" db:"Team_Name"`
}
