package model

import (
	"github.com/guregu/null"
	"github.com/shopspring/decimal"
)

type AutoAddSubMatch struct {
	SportID     int             `json:"sport_id" db:"SportID"`
	SportName   string          `json:"sport_name" db:"SportName"`
	LeagueID    int             `json:"league_id" db:"LeagueID"`
	LeagueName  string          `json:"league_name" db:"LeagueName"`
	Match_Start string          `json:"match_start" db:"Match_Start"`
	HomeID      int             `json:"home_id" db:"HomeID"`
	HomeName    string          `json:"home_name" db:"HomeName"`
	AwayID      int             `json:"away_id" db:"AwayID"`
	AwayName    string          `json:"away_name" db:"AwayName"`
	GameType    int             `json:"game_type" db:"GameType"`
	Handicap    decimal.Decimal `json:"handicap" db:"Handicap"`
	OddsHome    decimal.Decimal `json:"odds_home" db:"HomeOdd"`
	OddsAway    decimal.Decimal `json:"odds_away" db:"AwayOdd"`
	DisplayLine null.Int        `json:"display_line" db:"DisplayLine"`
	ST_Fav      int             `json:"st_fav" db:"ST_Fav"`
}

type AutoAddMatchSyncLeague struct {
	SportID              int    `json:"sport_id" db:"SportID"`
	MatchID              int    `json:"match_id" db:"MatchID"`
	LeagueID             int    `json:"league_id" db:"LeagueID"`
	HomeID               int    `json:"home_id" db:"HomeID"`
	AwayID               int    `json:"away_id" db:"AwayID"`
	MatchDate            string `json:"match_date" db:"MatchDate"`
	IsDisabledSyncMarket string `json:"is_disabled_sync_market" db:"Is_Disabled_SyncMarket"`
}
