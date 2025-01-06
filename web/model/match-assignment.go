package model

import "github.com/guregu/null"

type CounterMatch struct {
	TotalLive     int `json:"total_live"`
	TotalToday    int `json:"total_today"`
	TotalEarly    int `json:"total_early"`
	TotalStarted  int `json:"total_started"`
	TotalOutright int `json:"total_outright"`
	TotalAll      int `json:"total_all"`
}

type MatchAssignmentTrader struct {
	TraderName string `json:"trader_name" db:"Trader_Name"`
	TraderDesc string `json:"trader_desc" db:"Trader_Desc"`
}

type MyMatches struct {
	UserTeamMatches
	TraderName string `json:"trader_name" db:"Co_Trader_Name"`
}
type UserTeamMatches struct {
	MatchID         int         `json:"match_id" db:"No_Partai"`
	MatchDate       string      `json:"match_date" db:"Match_Date"`
	SportName       string      `json:"sport_name" db:"Sport_Name"`
	LeagueName      string      `json:"league_name" db:"League_Name"`
	HomeName        null.String `json:"home_name" db:"Home_Name"`
	AwayName        null.String `json:"away_name" db:"Away_Name"`
	MatchOpenStatus string      `json:"open_status" db:"Match_Open_Status"`
	MatchTimeSlot   string      `json:"match_time_slot" db:"Match_Time_Slot"`
	TraderName      null.String `json:"trader_name" db:"Trader_Name"`
	SportSeq        int         `json:"sport_seq" db:"Sport_Seq"`
	LeagueSeq       int         `json:"league_seq" db:"League_Seq"`
	DbHtft          int         `json:"db_htft" db:"DB_HTFT"`
	RbHtft          int         `json:"rb_htft" db:"RB_HTFT"`
	ProviderName    null.String `json:"provider_name" db:"ProviderName"`
}

type LeagueMatchAssignment struct {
	SportName       string `json:"sport_name" db:"Sport_Name"`
	LeagueID        int    `json:"league_id" db:"League_ID"`
	LeagueName      string `json:"league_name" db:"League_Name"`
	IsSelected      string `json:"is_selected" db:"Is_Selected"`
	CountUnassigned int    `json:"count_unassigned" db:"Count_Unassigned"`
	SportSeq        int    `json:"sport_seq" db:"Sport_Seq"`
	LeagueSeq       int    `json:"league_seq" db:"League_Seq"`
}
type MatchAssignment struct {
	Match_ID        int         `json:"match_id" db:"Match_ID"`
	Match_Date      string      `json:"match_date" db:"Match_Date"`
	Match_Date_Sort string      `json:"match_date_sort" db:"Match_Date_Sort"`
	Sport_Name      string      `json:"sport_name" db:"Sport_Name"`
	No_Events       int         `json:"league_id" db:"No_Events"`
	League_Name     string      `json:"league_name" db:"League_Name"`
	Home_Name       string      `json:"home_name" db:"Home_Name"`
	Away_Name       string      `json:"away_name" db:"Away_Name"`
	Trader_Name     string      `json:"trader_name" db:"Trader_Name"`
	Is_Checked      int         `json:"is_checked" db:"Is_Checked"`
	Match_Time_Slot string      `json:"match_time_slot" db:"Match_Time_Slot"`
	Sport_Seq       int         `json:"sport_seq" db:"Sport_Seq"`
	League_Seq      int         `json:"league_seq" db:"League_Seq"`
	SortIndex       null.String `json:"sortindex" db:"SortIndex"`
	DB_HTFT         null.Int    `json:"db_htft" db:"DB_HTFT"`
	RB_HTFT         null.Int    `json:"rb_htft" db:"RB_HTFT"`
	PickMatch       bool        `json:"pickmatch" db:"PickMatch"`
	No_Sport        int         `json:"no_sport" db:"No_Sport"`
	Sort1           null.Int    `json:"sort1" db:"Sort1"`
	Sort2           string      `json:"sort2" db:"Sort2"`
}
type MatchAssignmentDetail struct {
	User_ID string `json:"user_id" db:"User_ID"`
	Checked bool   `json:"checked" db:"Checked"`
}
type MatchAssignmentLog struct {
	RowID       int    `json:"row_id" db:"RowID"`
	StampUser   string `json:"stamp_user" db:"StampUser"`
	StampDate   string `json:"stamp_date" db:"StampDate"`
	MatchLeague string `json:"match_league" db:"Match_League"`
	DBGame      string `json:"db_game" db:"DB_Game"`
	RBGame      string `json:"rb_game" db:"RB_Game"`
	Status      string `json:"status" db:"Status"`
	TraderName  string `json:"trader_name" db:"TraderName"`
}

type MatchAssignmentPick struct {
	Match_ID        int         `json:"match_id" db:"Match_ID"`
	Match_Date      string      `json:"match_date" db:"Match_Date"`
	Sport_Name      string      `json:"sport_name" db:"Sport_Name"`
	No_Events       int         `json:"league_id" db:"No_Events"`
	League_Name     string      `json:"league_name" db:"League_Name"`
	Home_Name       string      `json:"home_name" db:"Home_Name"`
	Away_Name       string      `json:"away_name" db:"Away_Name"`
	Trader_Name     string      `json:"trader_name" db:"Trader_Name"`
	Is_Checked      int         `json:"is_checked" db:"Is_Checked"`
	Match_Time_Slot string      `json:"match_time_slot" db:"Match_Time_Slot"`
	Sport_Seq       int         `json:"sport_seq" db:"Sport_Seq"`
	League_Seq      int         `json:"league_seq" db:"League_Seq"`
	SortIndex       null.String `json:"sort_index" db:"SortIndex"`
	DB_HTFT         null.Int    `json:"db_htft" db:"DB_HTFT"`
	RB_HTFT         null.Int    `json:"rb_htft" db:"RB_HTFT"`
	PickMatch       bool        `json:"pick_match" db:"PickMatch"`
}

type MatchAssignmentRO struct {
	Match_ID        int         `json:"match_id" db:"Match_ID"`
	Match_Date      string      `json:"match_date" db:"Match_Date"`
	Sport_Name      string      `json:"sport_name" db:"Sport_Name"`
	League_Name     string      `json:"league_name" db:"League_Name"`
	Home_Name       string      `json:"home_name" db:"Home_Name"`
	Away_Name       string      `json:"away_name" db:"Away_Name"`
	Trader_Name     string      `json:"trader_name" db:"Trader_Name"`
	Match_Time_Slot string      `json:"match_time_slot" db:"Match_Time_Slot"`
	Sport_Seq       int         `json:"sport_seq" db:"Sport_Seq"`
	League_Seq      int         `json:"league_seq" db:"League_Seq"`
	SortIndex       null.String `json:"sortindex" db:"SortIndex"`
	SpecialSeq      string      `json:"db_htft" db:"SpecialSeq"`
}
