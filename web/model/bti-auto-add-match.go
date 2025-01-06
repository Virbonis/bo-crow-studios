package model

import "github.com/guregu/null"

type BTILeague struct {
	LeagueID   string `json:"league_id" db:"LeagueID"`
	LeagueName string `json:"league_name" db:"LeagueName"`
}

type BTIMatch struct {
	MatchID        string      `json:"match_id" db:"MatchID"`
	SportName      string      `json:"sport_name" db:"SportName"`
	StartEventDate string      `json:"start_event_date" db:"StartEventDate"`
	LeagueID       string      `json:"league_id" db:"LeagueID"`
	LeagueName     string      `json:"league_name" db:"LeagueName"`
	HomeID         string      `json:"home_id" db:"HomeID"`
	HomeName       string      `json:"home_name" db:"HomeName"`
	AwayID         string      `json:"away_id" db:"AwayID"`
	AwayName       string      `json:"away_name" db:"AwayName"`
	No_Partai      int         `json:"m_match_id" db:"No_Partai"`
	MLeagueID      int         `json:"m_league_id" db:"MLeagueID"`
	MleagueName    string      `json:"m_league_name" db:"MleagueName"`
	MHomeID        int         `json:"m_home_id" db:"MHomeID"`
	MHomeName      string      `json:"m_home_name" db:"MHomeName"`
	MAwayID        int         `json:"m_away_id" db:"MAwayID"`
	MAwayName      string      `json:"m_away_name" db:"MAwayName"`
	IsCanceled     bool        `json:"is_canceled" db:"IsCanceled"`
	HomeResult     string      `json:"home_result" db:"HomeResult"`
	AwayResult     string      `json:"away_result" db:"AwayResult"`
	ResultDate     null.String `json:"result_date" db:"ResultDate"`
}
