package model

import "github.com/guregu/null"

type LastBet struct {
	Pending_Bet_ID int         `json:"pending_bet_id" db:"Pending_Bet_ID"`
	Username       string      `json:"username" db:"Username"`
	BranchAlias    string      `json:"branch_alias" db:"BranchAlias"`
	GameType       int         `json:"game_type" db:"GameType"`
	Handicap       float64     `json:"handicap" db:"Handicap"`
	BetCode        string      `json:"bet_choice" db:"BetCode"`
	ST_Fav         int         `json:"st_fav" db:"ST_Fav"`
	League_Name    string      `json:"league_name" db:"League_Name"`
	Home_Name      string      `json:"home_name" db:"Home_Name"`
	Away_Name      string      `json:"away_name" db:"Away_Name"`
	Odds           float64     `json:"odds" db:"Odds"`
	Currency       string      `json:"currency" db:"Currency"`
	Amount         float64     `json:"amount" db:"Amount"`
	Company_Amount float64     `json:"company_amount" db:"Company_Amount"`
	CompanyShare   float64     `json:"company_share" db:"CompanyShare"`
	Trans_Date     string      `json:"trans_date" db:"Trans_Date"`
	StampDate      null.String `json:"stamp_date" db:"StampDate"`
	StampUser      null.String `json:"stamp_user" db:"StampUser"`
	Status         int         `json:"status" db:"Status"`
	LeagueID       int         `json:"league_id" db:"LeagueID"`
}
