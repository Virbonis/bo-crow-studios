package model

import (
	"database/sql"

	"github.com/guregu/null"
)

type CashLimitProfile struct {
	ProfileID  string `json:"profile_id" db:"ProfileID"`
	BranchCode string `json:"branch_code" db:"BranchCode"`
	BranchName string `json:"branch_name" db:"ShortName"`
	Currency   string `json:"currency" db:"Currency"`
	CanDelete  bool   `json:"can_delete" db:"canDelete"`
}

type CashLimitProfileLog struct {
	LeagueGroupID string      `json:"league_group" db:"LeagueGroupID"`
	SportName     null.String `json:"sport" db:"SportName"`
	MinBet        float64     `json:"min_bet" db:"MinBet"`
	MaxBet        float64     `json:"max_bet" db:"MaxBet"`
	MatchLimit    float64     `json:"match_limit" db:"MatchLimit"`
	StampDate     string      `json:"stamp_date" db:"Stamp_Date"`
	StampUser     string      `json:"stamp_user" db:"Stamp_User"`
	Desc          string      `json:"desc" db:"Desc"`
}

type CashLimitProfileDetail struct {
	SportID    string         `json:"sport_id" db:"SportID"`
	SportName  string         `json:"sport_name" db:"SportName"`
	MinBet     float64        `json:"min_bet" db:"MinBet"`
	MaxBet     float64        `json:"max_bet" db:"MaxBet"`
	MatchLimit float64        `json:"match_limit" db:"MatchLimit"`
	NoDisplay  sql.NullString `json:"no_display" db:"No_Display"`
}
