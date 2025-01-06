package model

type TradingInfo struct {
	LeagueName string `json:"league_name" db:"League_Name"`
	HomeName   string `json:"home_name" db:"Home_Name"`
	AwayName   string `json:"away_name" db:"Away_Name"`
}

type GridTradingInfo struct {
	ID          int    `json:"id" db:"ID"`
	Message     string `json:"message" db:"Message"`
	OrderAH     string `json:"order_ah" db:"Order_AH"`
	OrderOU     string `json:"order_ou" db:"Order_OU"`
	StampDate   string `json:"stamp_date" db:"StampDate"`
	StampUser   string `json:"stamp_user" db:"StampUser"`
	TraderGroup string `json:"trader_group" db:"Trader_Group"`
	HomePosisi  int    `json:"home_posisi" db:"Home_Posisi"`
	AwayPosisi  int    `json:"away_posisi" db:"Away_Posisi"`
}
