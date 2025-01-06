package model

type IMMatchList struct {
	MatchIDIM    int    `json:"match_id_im" db:"MatchID"`
	SportIM      string `json:"sport_im" db:"Sport_IM"`
	LeagueNameIM string `json:"league_name_im" db:"LeagueName_IM"`
	HomeNameIM   string `json:"home_name_im" db:"HomeName_IM"`
	AwayNameIM   string `json:"away_name_im" db:"AwayName_IM"`
	MatchDate    string `json:"match_date" db:"MatchDate"`
	Status       string `json:"status" db:"Status"`
	MatchID      int    `json:"match_id" db:"No_Partai"`
	NamaSport    string `json:"sport_name" db:"Nama_Sport"`
	LeagueID     int    `json:"league_id" db:"LeagueID"`
	LeagueName   string `json:"league_name" db:"LeagueName"`
	HomeID       int    `json:"home_id" db:"HomeID"`
	HomeName     string `json:"home_name" db:"HomeName"`
	AwayID       int    `json:"away_id" db:"AwayID"`
	AwayName     string `json:"away_name" db:"AwayName"`
	LiveStream   string `json:"live_stream" db:"LiveStream"`
}

type IMActionLog struct {
	LogDesc string `json:"log_desc" db:"LogDesc"`
	LogDate string `json:"log_date" db:"LogDate"`
}

type IMMarket struct {
	MarketID  int     `json:"market_id" db:"MarketID"`
	GameType  string  `json:"game_type" db:"GameType"`
	Line      int     `json:"line" db:"Line"`
	Handicap  float64 `json:"handicap" db:"Handicap"`
	Odds1     float64 `json:"odds1" db:"Odds1"`
	Odds2     float64 `json:"odds2" db:"Odds2"`
	Odds3     float64 `json:"odds3" db:"Odds3"`
	StampDate string  `json:"stamp_date" db:"StampDate"`
	Status    string  `json:"status" db:"Status"`
	HideOdds  string  `json:"hide_odds" db:"HideOdds"`
}
