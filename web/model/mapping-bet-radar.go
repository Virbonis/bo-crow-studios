package model

type MappingBetRadar struct {
	UpdateType   string `json:"update_type" db:"UpdateType"`
	StampDate    string `json:"stamp_date" db:"StampDate"`
	SportRadarID int    `json:"sport_radar_id" db:"SportRadarID"`
}
