package model

import "github.com/guregu/null"

type ProcessMatch struct {
	MatchID            int    `json:"match_id" db:"Match_ID"`
	MatchDate          string `json:"match_date" db:"Match_Date"`
	LeagueName         string `json:"league_name" db:"League_Name"`
	HomeName           string `json:"home_name" db:"Home_Name"`
	AwayName           string `json:"away_name" db:"Away_Name"`
	HTHome             string `json:"ht_home" db:"HT_Home"`
	HTAway             string `json:"ht_away" db:"HT_Away"`
	FSHome             string `json:"fs_home" db:"FS_Home"`
	FSAway             string `json:"fs_away" db:"FS_Away"`
	FGTeam             int    `json:"fg_team" db:"FG_Team"`
	LGTeam             int    `json:"lg_team" db:"LG_Team"`
	STVoidChoice       int    `json:"st_void_choice" db:"ST_VoidChoice"`
	MatchStatus        string `json:"match_status" db:"Match_Score_Status"`
	HTScoreStatus      string `json:"ht_score_status" db:"HT_Score_Status"`
	FTScoreStatus      string `json:"ft_score_status" db:"FT_Score_Status"`
	FGLGScoreStatus    string `json:"fglg_score_status" db:"FGLG_Score_Status"`
	SpecialScoreStatus string `json:"special_score_status" db:"Special_Score_Status"`
	HTProcessStatus    string `json:"ht_process_status" db:"HT_Process_Status"`
	FTProcessStatus    string `json:"ft_process_status" db:"FT_Process_Status"`
	FGLGProcessStatus  string `json:"fglg_process_status" db:"FGLG_Process_Status"`
	MatchHasFGLGStatus string `json:"match_has_fglg_status" db:"Is_HasFGLG"`
	SportID            int    `json:"sport_id" db:"SportID"`
}

type ProcessMatchSpecial struct {
	GameType    int         `json:"game_type" db:"GameType"`
	HTHome      int         `json:"ht_home" db:"HT_Home"`
	HTAway      int         `json:"ht_away" db:"HT_Away"`
	FSHome      int         `json:"fs_home" db:"FS_Home"`
	FSAway      int         `json:"fs_away" db:"FS_Away"`
	STFS        string      `json:"stfs"`
	VoidID      null.Int    `json:"void_id" db:"Void_ID"`
	VoidDesc    null.String `json:"void_desc" db:"Void_Desc"`
	VoidChoice  null.String `json:"void_choice" db:"Void_Choice"`
	IsCancelled string      `json:"is_cancelled" db:"isCancelled"`
}

type ProcessMatchNextGoal struct {
	GameType    int    `json:"game_type" db:"GameType"`
	Selection   int    `json:"selection" db:"Selection"`
	HomeScore   int    `json:"home_score" db:"HomeScore"`
	AwayScore   int    `json:"away_score" db:"AwayScore"`
	VoidID      int    `json:"void_id" db:"Void_ID"`
	VoidDesc    string `json:"void_desc" db:"Void_Desc"`
	IsCancelled string `json:"is_cancelled" db:"isCancelled"`
	FSHome      int    `json:"fs_home" db:"FS_Home"`
	FSAway      int    `json:"fs_away" db:"FS_Away"`
}

type UprocessMatchNextGoal struct {
	GameType    int    `json:"game_type" db:"GameType"`
	Selection   int    `json:"selection" db:"Selection"`
	HomeScore   int    `json:"home_score" db:"HomeScore"`
	AwayScore   int    `json:"away_score" db:"AwayScore"`
	STFS        string `json:"stfs" db:"ST_FS"`
	VoidID      int    `json:"void_id" db:"Void_ID"`
	VoidDesc    string `json:"void_desc" db:"Void_Desc"`
	IsCancelled string `json:"is_cancelled" db:"isCancelled"`
	FSHome      int    `json:"fs_home" db:"FS_Home"`
	FSAway      int    `json:"fs_away" db:"FS_Away"`
}
