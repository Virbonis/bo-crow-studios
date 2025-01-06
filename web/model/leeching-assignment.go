package model

type ListLeechingAssignmentSport struct {
	SportID    int    `json:"sport_id" db:"Sport_ID"`
	SportName  string `json:"sport_name" db:"Sport_Name"`
	DBAutoOdds int    `json:"db_auto_odds" db:"DB_Auto_Odds"`
	RBAutoOdds int    `json:"rb_auto_odds" db:"RB_Auto_Odds"`
}

type ListLeechingAssignmentLeague struct {
	SportName      string `json:"sport_name" db:"SportName"`
	LeagueID       int    `json:"league_id" db:"League_ID"`
	LeagueSequence int    `json:"league_sequence" db:"League_Sequence"`
	LeagueName     string `json:"league_name" db:"League_Name"`
	PriceGroup     int    `json:"price_group" db:"Price_Group"`
	DBAutoOdds     int    `json:"db_auto_odds" db:"DB_Auto_Odds"`
	RBAutoOdds     int    `json:"rb_auto_odds" db:"RB_Auto_Odds"`
}
