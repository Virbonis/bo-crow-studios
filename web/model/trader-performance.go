package model

type TraderOptions struct {
	TraderName string `json:"trader_name" db:"Trader_Name"`
}

type LeagueOptions struct {
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
}

type RptTraderPerformance struct {
	MatchID        int     `json:"match_id" db:"Match_ID"`
	MatchDate      string  `json:"match_date" db:"Match_Date"`
	TraderName     string  `json:"trader_name" db:"Trader_Name"`
	MarketTime     string  `json:"market_time" db:"Market_Time"`
	HomeName       string  `json:"home_name" db:"Home_Name"`
	AwayName       string  `json:"away_name" db:"Away_Name"`
	LeagueName     string  `json:"league_name" db:"League_Name"`
	GameType       int     `json:"game_type" db:"GameType"`
	Winloss        float64 `json:"winloss" db:"Winloss"`
	WinlossCompany float64 `json:"winloss_company" db:"WinlossCompany"`
	BetAmount      float64 `json:"bet_amount" db:"BetAmount"`
	Margin1        float64 `json:"margin1" db:"Margin1"`
	Margin2        float64 `json:"margin2" db:"Margin2"`
	StockCompany   float64 `json:"stock_company" db:"StockCompany"`
}
