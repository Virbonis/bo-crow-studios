package model

type MappingLotteryMatch struct {
	MatchID    int    `json:"match_id" db:"MatchID"`
	MatchDate  string `json:"match_date" db:"MatchDate"`
	LeagueID   int    `json:"league_id" db:"LeagueID"`
	LeagueName string `json:"league_name" db:"LeagueName"`
	TeamIDHome int    `json:"team_id_home" db:"TeamIDHome"`
	HomeName   string `json:"home_name" db:"HomeName"`
	TeamIDAway int    `json:"team_id_away" db:"TeamIDAway"`
	AwayName   string `json:"away_name" db:"AwayName"`
	Status     string `json:"status" db:"Status"`
}
