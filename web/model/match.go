package model

import (
	"time"

	"github.com/guregu/null"
)

type Match struct {
	SportName       string    `json:"sport_name"`
	LeagueName      string    `json:"league_name"`
	MatchID         int       `json:"match_id"`
	HomeName        string    `json:"home_name"`
	AwayName        string    `json:"away_name"`
	IsSelected      string    `json:"is_selected"`
	NoDisplay       int       `json:"no_display"`
	MatchDate       time.Time `json:"match_date"`
	NoDisplayMatch  int       `json:"no_display_match"`
	DBGame          null.Int  `json:"db_game"`
	RBGame          null.Int  `json:"rb_game"`
	DBGameAvailable int       `json:"db_game_available"`
	RBGameAvailable int       `json:"rb_game_available"`
}

type MatchMO struct {
	SportSequence  int    `json:"sport_sequence" db:"Sport_Sequence"`
	LeagueSequence int    `json:"league_sequence" db:"League_Sequence"`
	MatchID        int    `json:"match_id" db:"Match_ID"`
	MatchDate      string `json:"match_date" db:"Match_Date"`
	MatchSequence  int    `json:"match_sequence" db:"Match_Sequence"`
	HomeName       string `json:"home_name" db:"Home_Name"`
	AwayName       string `json:"away_name" db:"Away_Name"`
	SortIndex      string `json:"sortindex" db:"SortIndex"`
}

type MatchBetList struct {
	SportSequence  int    `json:"sport_sequence" db:"Sport_Sequence"`
	LeagueSequence int    `json:"league_sequence" db:"League_Sequence"`
	LeagueName     string `json:"league_name" db:"League_Name"`
	MatchID        int    `json:"match_id" db:"Match_ID"`
	Team           string `json:"team" db:"Team"`
	MatchSequence  int    `json:"match_sequence" db:"Match_Sequence"`
	SortIndex      string `json:"sortindex" db:"SortIndex"`
}

type InstantBetMatch struct {
	MatchID   string `json:"match_id" db:"Match_ID"`
	MatchName string `json:"match_name" db:"Match_Name"`
}

type MatchAutoAdd struct {
	LeagueID   int         `json:"league_id" db:"LeagueID"`
	LeagueName null.String `json:"league_name" db:"LeagueName"`
}

type ListMatchAutoAdd struct {
	SportId     int       `json:"sport_id" db:"SportID"`
	LeagueId    int       `json:"league_id" db:"LeagueID"`
	SportName   string    `json:"sport_name" db:"SportName"`
	HomeId      int       `json:"home_id" db:"HomeID"`
	AwayId      int       `json:"away_id" db:"AwayID"`
	GameType    int       `json:"game_type" db:"GameType"`
	Handicap    int       `json:"handicap" db:"Handicap"`
	HomeOdd     int       `json:"home_odd" db:"HomeOdd"`
	AwayOdd     int       `json:"away_odd" db:"AwayOdd"`
	DisplayLine int       `json:"display_line" db:"DisplayLine"`
	LeagueName  string    `json:"league_name" db:"LeagueName"`
	MatchStart  time.Time `json:"match_start" db:"Match_Start"`
	HomeName    string    `json:"home_name" db:"HomeName"`
	AwayName    string    `json:"away_name" db:"AwayName"`
}

type MatchSequence struct {
	SpecialSequence string  `json:"special_sequence" db:"SpecialSeq"`
	Sequence        *string `json:"sequence" db:"Sequence"`
	MatchID         int     `json:"match_id" db:"Match_ID"`
	MatchDate       string  `json:"match_date" db:"Match_Date"`
	LeagueName      string  `json:"league_name" db:"League_Name"`
	Team            string  `json:"team" db:"Team"`
	AutoOdds        string  `json:"auto_odds" db:"Auto_Odds"`
}
