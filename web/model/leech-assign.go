package model

type LeagueLeechAssign struct {
	SportName  string `json:"sport_name" db:"Sport_Name"`
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
	IsSelected string `json:"is_selected" db:"Is_Selected"`
	SportSeq   int    `json:"sport_seq" db:"Sport_Seq"`
}

type MatchLeechAssign struct {
	MatchID               int    `json:"match_id" db:"Match_ID"`
	MatchDate             string `json:"match_date" db:"Match_Date"`
	SportName             string `json:"sport_name" db:"Sport_Name"`
	LeagueName            string `json:"league_name" db:"League_Name"`
	HomeName              string `json:"home_name" db:"Home_Name"`
	AwayName              string `json:"away_name" db:"Away_Name"`
	AutoOdds              int    `json:"auto_odds" db:"Auto_Odds"`
	IsChecked             int    `json:"is_checked" db:"Is_Checked"`
	IsSBOExist            int    `json:"is_sbo_exist" db:"Is_SBO_Exist"`
	IsIBCExist            int    `json:"is_ibc_exist" db:"Is_IBC_Exist"`
	RBStatus              string `json:"rb_status" db:"RBStatus"`
	BGStatus              string `json:"bg_status" db:"BGStatus"`
	STSportsTicker        string `json:"st_sports_ticker" db:"ST_SportsTicker"`
	RBLeagueName          string `json:"rb_league_name" db:"RB_League_Name"`
	RBHomeName            string `json:"rb_home_name" db:"RB_Home_Name"`
	RBAwayName            string `json:"rb_away_name" db:"RB_Away_Name"`
	BGLeagueName          string `json:"bg_league_name" db:"BG_League_Name"`
	BGHomeName            string `json:"bg_home_name" db:"BG_Home_Name"`
	BGAwayName            string `json:"bg_away_name" db:"BG_Away_Name"`
	SportSeq              int    `json:"sport_seq" db:"Sport_Seq"`
	LeagueSeq             int    `json:"league_seq" db:"League_Seq"`
	IsReverseCheckedBG    string `json:"is_reverse_checked_bg" db:"Is_Reverse_Checked_BG"`
	IsReverseCheckedRBall string `json:"is_reverse_checked_rball" db:"Is_Reverse_Checked_RBall"`
	IsDisabledSyncMarket  string `json:"is_disabled_sync_market" db:"Is_Disabled_SyncMarket"`
}

type AuditTrailLeechAssignUpdateMatch struct {
	Username    string `json:"username" db:"Username"`
	StartDate   string `json:"start_date" db:"StartDate"`
	LeechAssign string `json:"leech_assign" db:"LeechAssign"`
	SeverityID  int    `json:"severity_id" db:"SeverityID"`
}
