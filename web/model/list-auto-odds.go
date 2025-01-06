package model

type ListAutoOdds struct {
	MatchIDIBC    int    `json:"match_id_ibc" db:"MatchID_IBC"`
	MatchDateIBC  string `json:"match_date_ibc" db:"MatchDate_IBC"`
	LeagueNameIBC string `json:"league_name_ibc" db:"LeagueName_IBC"`
	HomeNameIBC   string `json:"home_name_ibc" db:"HomeName_IBC"`
	AwayNameIBC   string `json:"away_name_ibc" db:"AwayName_IBC"`
	MatchID       int    `json:"match_id" db:"MatchID"`
	LeagueName    string `json:"league_name" db:"LeagueName"`
	HomeName      string `json:"home_name" db:"HomeName"`
	AwayName      string `json:"away_name" db:"AwayName"`
}
