package model

type ListBetSummaryFT struct {
	Score    string  `json:"score" db:"Score"`
	HdpAH    float64 `json:"hdp_ah" db:"HDP_AH"`
	Home     float64 `json:"home" db:"Home"`
	Away     float64 `json:"away" db:"Away"`
	TotalHDP float64 `json:"total_hdp" db:"TotalHDP"`
	TotalAH  float64 `json:"total_ah" db:"TotalAH"`
	HdpOU    float64 `json:"hdp_ou" db:"HDP_OU"`
	Over     float64 `json:"over" db:"Over"`
	Under    float64 `json:"under" db:"Under"`
	TotalOU  float64 `json:"total_ou" db:"TotalOU"`
	SportID  int     `json:"sport_id" db:"SportID"`
}

type ListBetSummaryHT struct {
	Score    string  `json:"Score"`
	HdpAH    float64 `json:"HDP_AH"`
	Home     float64 `json:"Home"`
	Away     float64 `json:"Away"`
	TotalHDP float64 `json:"TotalHDP"`
	TotalAH  float64 `json:"TotalAH"`
	HdpOU    float64 `json:"HDP_OU"`
	Over     float64 `json:"Over"`
	Under    float64 `json:"Under"`
	TotalOU  float64 `json:"TotalOU"`
	SportID  int     `json:"SportID"`
}

type ListMatrix struct {
	GameType int     `json:"game_type" db:"GameType"`
	Handicap float64 `json:"handicap" db:"Handicap"`
	Score    string  `json:"score" db:"Score"`
	SportID  int     `json:"sport_id" db:"SportID"`
}
