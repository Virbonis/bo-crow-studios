package model

type LeagueHidden struct {
	RowID       int    `json:"row_id" db:"RowID"`
	BranchCode  string `json:"branch_code" db:"BranchCode"`
	BranchAlias string `json:"branch_alias" db:"BranchAlias"`
	Currency    string `json:"currency" db:"Currency"`
	SportID     int    `json:"sport_id" db:"SportID"`
	SportName   string `json:"sport_name" db:"SportName"`
	LeagueID    int    `json:"league_id" db:"LeagueID"`
	LeagueName  string `json:"league_name" db:"LeagueName"`
}
