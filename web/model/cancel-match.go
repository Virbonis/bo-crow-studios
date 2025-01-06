package model

import "github.com/guregu/null"

type GridCancelMatch struct {
	MatchID            int    `json:"match_id" db:"Match_ID"`
	MatchDate          string `json:"match_date" db:"Match_Date"`
	LeagueName         string `json:"league_name" db:"League_Name"`
	HomeName           string `json:"home_name" db:"Home_Name"`
	AwayName           string `json:"away_name" db:"Away_Name"`
	HTHome             int    `json:"ht_home" db:"HT_Home"`
	HTAway             int    `json:"ht_away" db:"HT_Away"`
	FSHome             int    `json:"fs_home" db:"FS_Home"`
	FSAway             int    `json:"fs_away" db:"FS_Away"`
	FGTeam             int    `json:"fg_team" db:"FG_Team"`
	LGTeam             int    `json:"lg_team" db:"LG_Team"`
	MatchScoreStatus   string `json:"match_score_status" db:"Match_Score_Status"`
	HTProcessStatus    string `json:"ht_process_status" db:"HT_Process_Status"`
	SpecialScoreStatus string `json:"special_score_status" db:"Special_Score_Status"`
	SportID            int    `json:"sport_id" db:"SportID"`
}

type GridCancelMatchSpecial struct {
	GameType   int         `json:"game_type" db:"GameType"`
	HTHome     int         `json:"ht_home" db:"HT_Home"`
	HTAway     int         `json:"ht_away" db:"HT_Away"`
	FSHome     int         `json:"fs_home" db:"FS_Home"`
	FSAway     int         `json:"fs_away" db:"FS_Away"`
	VoidID     null.Int    `json:"void_id" db:"Void_ID"`
	VoidDesc   null.String `json:"void_desc" db:"Void_Desc"`
	VoidChoice null.String `json:"void_choice" db:"Void_Choice"`
	Cancelled  null.String `json:"is_cancelled" db:"isCancelled"`
	CancelType null.String `json:"cancel_type" db:"CancelType"`
}
