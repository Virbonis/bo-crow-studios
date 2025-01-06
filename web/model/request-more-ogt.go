package model

import "github.com/guregu/null"

type ListGridRequestMoreOGT struct {
	SportID            int         `json:"sport_id" db:"Sport_ID"`
	SportSequence      int         `json:"sport_sequence" db:"Sport_Sequence"`
	LeagueID           int         `json:"league_id" db:"League_ID"`
	LeagueName         string      `json:"league_name" db:"League_Name"`
	LeagueSequence     int         `json:"league_sequence" db:"League_Sequence"`
	ProfileID          string      `json:"profile_id" db:"Profile_ID"`
	MatchID            int         `json:"match_id" db:"Match_ID"`
	MatchDate          string      `json:"match_date" db:"Match_Date"`
	MatchNeutralStatus string      `json:"match_neutral_status" db:"Match_Neutral_Status"`
	MatchSequence      int         `json:"match_sequence" db:"Match_Sequence"`
	HomeID             int         `json:"home_id" db:"Home_ID"`
	HomeName           string      `json:"home_name" db:"Home_Name"`
	AwayID             int         `json:"away_id" db:"Away_ID"`
	AwayName           string      `json:"away_name" db:"Away_Name"`
	SortIndex          string      `json:"sort_index" db:"SortIndex"`
	MoreGT             int         `json:"more_gt" db:"MoreGT"`
	LastRequestDate    null.String `json:"last_request_date" db:"LastRequestDate"`
	MatchStart         null.String `json:"match_start" db:"Match_Start"`
	League             string      `json:"league" db:"League"`
	HomeTeam           string      `json:"home_team" db:"Home_Team"`
	AwayTeam           string      `json:"away_team" db:"Away_Team"`
	MatchIDStatus      string      `json:"match_id_status"`
}

type GetStatusMatchRequestMoreOGT struct {
	MoreGT          int         `json:"more_gt" db:"MoreGT"`
	LastRequestDate null.String `json:"last_request_date" db:"LastRequestDate"`
	MatchIDStatus   string      `json:"match_id_status" db:"MatchID"`
	MatchStart      null.String `json:"match_start" db:"Match_Start"`
	League          string      `json:"league" db:"League"`
	HomeTeam        string      `json:"home_team" db:"Home_Team"`
	AwayTeam        string      `json:"away_team" db:"Away_Team"`
}
