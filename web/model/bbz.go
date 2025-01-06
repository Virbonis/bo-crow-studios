package model

type BBZChannelMonitoring struct {
	Channel        string `json:"channel" db:"Channel"`
	StampDate      string `json:"stamp_date" db:"StampDate"`
	LastConnection string `json:"last_connection" db:"LastConnection"`
	ChannelStatus  int    `json:"channel_status" db:"ChannelStatus"`
}
type BBZMatchList struct {
	MatchID            string `json:"match_id_bbz" db:"MatchID"`
	SportBetBazar      string `json:"sport_bbz" db:"Sport_BetBazar"`
	LeagueNameBetBazar string `json:"league_name_bbz" db:"LeagueName_BetBazar"`
	HomeNameBetBazar   string `json:"home_name_bbz" db:"HomeName_BetBazar"`
	AwayNameBetBazar   string `json:"away_name_bbz" db:"AwayName_BetBazar"`
	StartDate          string `json:"start_date" db:"StartDate"`
	Status             string `json:"status" db:"Status"`
	NoPartai           int    `json:"match_id" db:"No_Partai"`
	SportName          string `json:"sport_name" db:"Nama_Sport"`
	LeagueID           int    `json:"league_id" db:"LeagueID"`
	LeagueName         string `json:"league_name" db:"LeagueName"`
	HomeID             int    `json:"home_id" db:"HomeID"`
	HomeTeam           string `json:"home_team" db:"Home_Team"`
	AwayID             int    `json:"away_id" db:"AwayID"`
	AwayTeam           string `json:"away_team" db:"Away_Team"`
	LiveStream         string `json:"live_stream" db:"LiveStream"`
}
type BBZActionLog struct {
	LogDesc string `json:"log_desc" db:"LogDesc"`
	LogDate string `json:"log_date" db:"LogDate"`
}
type BBZMarket struct {
	MarketID  string  `json:"market_id" db:"MarketID"`
	Gametype  string  `json:"game_type" db:"GameType"`
	Line      string  `json:"line" db:"Line"`
	Handicap  string  `json:"handicap" db:"Handicap"`
	Odds1     float64 `json:"odds1" db:"Odds1"`
	Odds2     float64 `json:"odds2" db:"Odds2"`
	Odds3     float64 `json:"odds3" db:"Odds3"`
	StampDate string  `json:"stamp_date" db:"StampDate"`
	Status    string  `json:"status" db:"Status"`
}
type BBZMarketLog struct {
	LogDate      string `json:"log_date" db:"LogDate"`
	LogMarketID  string `json:"log_market_id" db:"LogMarketID"`
	LogGameType  int    `json:"log_game_type" db:"LogGameType"`
	LogGameName  string `json:"log_game_name" db:"LogGameName"`
	LogMarket    string `json:"log_market" db:"LogMarket"`
	LogStatus    string `json:"log_status" db:"LogStatus"`
	CurrentScore string `json:"current_score" db:"CurrentScore"`
}
type BBZIncident struct {
	StartDate     string `json:"start_date" db:"StartDate"`
	MatchIDBBZ    string `json:"match_id_bbz" db:"MatchID"`
	MatchID       int    `json:"match_id" db:"No_Partai"`
	LeagueName    string `json:"league_name" db:"League"`
	HomeTeam      string `json:"home_team" db:"Home_Team"`
	AwayTeam      string `json:"away_team" db:"Away_Team"`
	IncidentName  string `json:"incident_name" db:"IncidentName"`
	IncidentValue string `json:"incident_value" db:"IncidentValue"`
	StampDate     string `json:"stamp_date" db:"StampDate"`
}
