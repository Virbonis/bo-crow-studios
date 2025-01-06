package model

import "github.com/guregu/null"

type GridOutright struct {
	OutrightID             int         `json:"outright_id" db:"Outright_ID"`
	OutrightDate           string      `json:"outright_date" db:"Outright_Date"`
	LeagueID               int         `json:"league_id" db:"League_ID"`
	LeagueName             string      `json:"league_name" db:"League_Name"`
	OutrightOpenStatus     string      `json:"outright_open_status" db:"Outright_Open_Status"`
	OutrightScoreStatus    string      `json:"outright_score_status" db:"Outright_Score_Status"`
	OutrightScore          null.String `json:"outright_score" db:"Outright_Score"`
	OutrightProcessStatus  string      `json:"outright_process_status" db:"Outright_Process_Status"`
	IsOutrightHasTicket    string      `json:"is_outright_has_ticket" db:"Is_Outright_Has_Ticket"`
	Trader                 null.String `json:"trader" db:"Trader"`
	OutrightDeadHeatStatus string      `json:"outright_dead_heat_status" db:"Outright_DeadHeat_Status"`
	SportID                int         `json:"sport_id" db:"Sport_ID"`
}

type GridOutrightTeam struct {
	TeamID          int         `json:"team_id" db:"Team_ID"`
	TeamSeq         int         `json:"team_seq" db:"Team_Seq"`
	TeamName        string      `json:"team_name" db:"Team_Name"`
	Cancellation    null.String `json:"cancellation" db:"Cancelation"`
	TeamOdds        float64     `json:"team_odds" db:"Team_Odds"`
	TeamOpenStatus  string      `json:"team_open_status" db:"Team_Open_Status"`
	TeamStatusPause string      `json:"team_pause_status" db:"Team_Status_Pause"`
	TeamWLStatus    string      `json:"team_wl_status" db:"Team_WL_Status"`
}

type EditOutright struct {
	OutrightID             int     `json:"outright_id" db:"Outright_ID"`
	OutrightDate           string  `json:"outright_date" db:"Outright_Date"`
	OutrightOpenStatus     string  `json:"outright_open_status" db:"Outright_Open_Status"`
	MaxPayout              float64 `json:"max_payout" db:"Max_Payout"`
	PriceStep              float64 `json:"price_step" db:"Price_Step"`
	LimitChange            float64 `json:"limit_change" db:"Limit_Change"`
	AutoCloseStatus        string  `json:"auto_close_status" db:"Auto_Close_Status"`
	AutoCloseInterval      string  `json:"auto_close_interval" db:"Auto_Close_Interval"`
	OutrightDeadHeatStatus string  `json:"outright_dead_heat_status" db:"Outright_DeadHeat_Status"`
	SportName              string  `json:"sport_name" db:"Sport_Name"`
}

type EditOutrightTeam struct {
	TeamID                 int     `json:"team_id" db:"Team_ID"`
	TeamSeq                int     `json:"team_seq" db:"Team_Seq"`
	TeamName               string  `json:"team_name" db:"Team_Name"`
	TeamOdds               float64 `json:"team_odds" db:"Team_Odds"`
	TeamOpenStatus         string  `json:"team_open_status" db:"Team_Open_Status"`
	TeamStatusPause        string  `json:"team_pause_status" db:"Team_Status_Pause"`
	Sequence               int     `json:"sequence" db:"Sequence"`
	TeamStatusDirectCancel string  `json:"team_direct_cancel" db:"Team_Status_DirectCancel"`
}
