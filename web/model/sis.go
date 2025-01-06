package model

type SISActionLog struct {
	EventID string `json:"event_id" db:"EventID"`
	LogDesc string `json:"log_desc" db:"LogDesc"`
	LogDate string `json:"log_date" db:"LogDate"`
	ID      string `json:"id" db:"ID"`
}
type SISMarket struct {
	GameType     string  `json:"game_type" db:"GameType"`
	Line         int     `json:"line" db:"Line"`
	Handicap     float64 `json:"handicap" db:"Handicap"`
	Odds1        float64 `json:"odds1" db:"Odds1"`
	Odds2        float64 `json:"odds2" db:"Odds2"`
	Odds3        float64 `json:"odds3" db:"Odds3"`
	Status       string  `json:"status" db:"Status"`
	Is_Settled   string  `json:"is_settled" db:"Is_Settled"`
	Is_Displayed string  `json:"is_displayed" db:"Is_Displayed"`
	StampDate    string  `json:"stamp_date" db:"StampDate"`
}
type SISMarketLog struct {
	LogDate         string `json:"log_date" db:"LogDate"`
	LogGameType     string `json:"log_game_type" db:"LogGameType"`
	LogGameName     string `json:"log_game_name" db:"LogGameName"`
	LogLine         string `json:"log_line" db:"LogLine"`
	LogMarket       string `json:"log_market" db:"LogMarket"`
	LogStatus       string `json:"log_status" db:"LogStatus"`
	LogIs_Displayed string `json:"log_is_displayed" db:"LogIs_Displayed"`
	LogIs_Settled   string `json:"log_is_settled" db:"LogIs_Settled"`
}
type SISMatchList struct {
	EventID       string `json:"match_id_sis" db:"EventID"`
	SportSIS      string `json:"sport_sis" db:"Sport_SIS"`
	LeagueNameSIS string `json:"league_name_sis" db:"LeagueName_SIS"`
	HomeNameSIS   string `json:"home_name_sis" db:"HomeName_SIS"`
	AwayNameSIS   string `json:"away_name_sis" db:"AwayName_SIS"`
	StartTime     string `json:"match_date" db:"StartTime"`
	MatchStatus   string `json:"match_status" db:"Match_Status"`
	MatchProgress string `json:"match_progress" db:"Match_Progress"`
	NoPartai      string `json:"match_id" db:"No_Partai"`
	NamaSport     string `json:"sport_name" db:"Nama_Sport"`
	LeagueID      string `json:"league_id" db:"LeagueID"`
	League        string `json:"league_name" db:"League"`
	HomeID        string `json:"home_id" db:"HomeID"`
	HomeTeam      string `json:"home_name" db:"Home_Team"`
	AwayID        string `json:"away_id" db:"AwayID"`
	AwayTeam      string `json:"away_name" db:"Away_Team"`
	StreamID      string `json:"stream_id" db:"StreamID"`
	Route         string `json:"route" db:"Route"`
}
