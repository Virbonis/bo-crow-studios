package model

type MatchList struct {
	Sequence             string  `json:"sequence" db:"Sequence"`
	MatchId              int     `json:"match_id" db:"Match_ID"`
	MatchDate            string  `json:"match_date" db:"Match_Date"`
	CreatedDate          string  `json:"created_date" db:"Match_Create_Date"`
	ProfileId            string  `json:"profile_id" db:"Profile_ID"`
	LeagueName           string  `json:"league_name" db:"League_Name"`
	HomeName             string  `json:"home_name" db:"Home_Name"`
	AwayName             string  `json:"away_name" db:"Away_Name"`
	HTHome               int     `json:"ht_home" db:"HT_Home"`
	HTAway               int     `json:"ht_away" db:"HT_Away"`
	FSHome               int     `json:"fs_home" db:"FS_Home"`
	FSAway               int     `json:"fs_away" db:"FS_Away"`
	FGTeam               int     `json:"fg_team" db:"FG_Team"`
	LGTeam               int     `json:"lg_team" db:"LG_Team"`
	StVoidChoice         int     `json:"st_void_choice" db:"ST_VoidChoice"`
	MatchOpenStatus      string  `json:"match_open_status" db:"Match_Open_Status"`
	MatchLiveStatus      string  `json:"match_live_status" db:"Match_Live_Status"`
	MatchHasLiveStatus   string  `json:"match_has_live_status" db:"Match_Has_Live_Status"`
	HTScoreStatus        string  `json:"ht_score_status" db:"HT_Score_Status"`
	FTScoreStatus        string  `json:"ft_score_status" db:"FT_Score_Status"`
	FGLGScoreStatus      string  `json:"fglg_score_status" db:"FGLG_Score_Status"`
	HTProcessStatus      string  `json:"ht_process_status" db:"HT_Process_Status"`
	FTProcessStatus      string  `json:"ft_process_status" db:"FT_Process_Status"`
	FGLGProcessStatus    string  `json:"fglg_process_status" db:"FGLG_Process_Status"`
	MatchHasFGLGStatus   string  `json:"match_has_fglg_status" db:"Is_Match_Has_FGLG"`
	MatchHasTicketStatus string  `json:"match_has_ticket_status" db:"Is_Match_Has_Ticket"`
	MatchHasParlayStatus string  `json:"match_has_parlay_status" db:"Is_Match_Has_Parlay"`
	MatchConfirmedStatus string  `json:"match_confirmed_status" db:"Is_Match_Confirmed"`
	Trader               string  `json:"trader" db:"Trader"`
	AutoOdds             string  `json:"auto_odds" db:"Auto_Odds"`
	Category             string  `json:"category" db:"Category"`
	IsMatchHasGTSPecial  string  `json:"is_match_has_gt_special" db:"Is_Match_Has_GTSpecial"`
	HTScoreDesc          *string `json:"ht_score_desc" db:"HT_Score_Desc"`
	FTSCoreDesc          *string `json:"ft_score_desc" db:"FT_Score_Desc"`
	IsETPEN              string  `json:"is_etpen" db:"Is_ETPEN"`
	ProviderName         string  `json:"provider_name" db:"ProviderName"`
	IsMatchHasLottery    string  `json:"is_match_has_lottery" db:"Is_Match_Has_Lottery"`
	SportID              int     `json:"sport_id" db:"SportID"`
}

type MatchEdit struct {
	Sequence             string `json:"sequence" db:"Sequence"`
	MatchId              int    `json:"match_id" db:"Match_ID"`
	MatchDate            string `json:"match_date" db:"Match_Date"`
	SportName            string `json:"sport_name" db:"Sport_Name"`
	LeagueName           string `json:"league_name" db:"League_Name"`
	HomeName             string `json:"home_name" db:"Home_Name"`
	AwayName             string `json:"away_name" db:"Away_Name"`
	AutoCloseStatus      string `json:"auto_close_status" db:"Auto_Close_Status"`
	AutoCloseInterval    string `json:"auto_close_interval" db:"Auto_Close_Interval"`
	AutoAcceptDelayHome  int    `json:"auto_accept_delay_home" db:"Auto_Accept_Delay_Home"`
	AutoAcceptDelayAway  int    `json:"auto_accept_delay_away" db:"Auto_Accept_Delay_Away"`
	AutoAcceptDelayOver  int    `json:"auto_accept_delay_over" db:"Auto_Accept_Delay_Over"`
	AutoAcceptDelayUnder int    `json:"auto_accept_delay_under" db:"Auto_Accept_Delay_Under"`
	EvOddsStep           int    `json:"ev_odds_step" db:"EvOddsStep"`
	EvOddsStepOU         int    `json:"ev_odds_step_ou" db:"EvOddsStepOU"`
	EvOddsStepTimerHT    int    `json:"ev_odds_step_timer_ht" db:"EvOddsStepTimerHT"`
	EvOddsStepTimerFT    int    `json:"ev_odds_step_timer_ft" db:"EvOddsStepTimerFT"`
	MatchOpenStatus      string `json:"match_open_status" db:"Match_Open_Status"`
	MatchLiveStatus      string `json:"match_live_status" db:"Match_Live_Status"`
	MatchHasLiveStatus   string `json:"match_has_live_status" db:"Match_Has_Live_Status"`
	MatchHiddenTime      int    `json:"match_hidden_time_status" db:"Match_Hidden_Time"`
	MatchNeutralStatus   string `json:"match_neutral_status" db:"Match_Neutral_Status"`
	Category             string `json:"category" db:"Category"`
	LeagueCategory       string `json:"league_category" db:"LeagueCategory"`
	IsProcessed          string `json:"is_processed" db:"Is_Processed"`
	ParentMatchID        int    `json:"parent_match_id" db:"ParentMatchID"`
	ParentMatchIDAction  int    `json:"parent_match_id_action" db:"ParentMatchID_Action"`
	ParentUnNormalStatus int    `json:"match_unnormal_status" db:"Parent_UnNormal_Status"`
	STShowToday          string `json:"match_show_today_status" db:"ST_ShowToday"`
	SpecialCode          string `json:"special_code" db:"Special_Code"`
	SportId              int    `json:"sport_id" db:"Sport_Id"`
	STEarlySettlement    string `json:"match_early_settlement_status" db:"ST_EarlySettlement"`
	STEarlyLock          string `json:"st_early_lock" db:"St_EarlyLock"`
}
type MatchInfo struct {
	MatchId       int    `json:"match_id" db:"Match_ID"`
	SportName     string `json:"sport_name" db:"Sport_Name"`
	LeagueName    string `json:"league_name" db:"League_Name"`
	HomeName      string `json:"home_name" db:"Home_Name"`
	AwayName      string `json:"away_name" db:"Away_Name"`
	STInformation string `json:"st_information" db:"ST_Information"`
	InformationEN string `json:"information_en" db:"InformationDescEN"`
	InformationCH string `json:"information_ch" db:"InformationDescCH"`
	InformationTH string `json:"information_th" db:"InformationDescTH"`
	InformationJP string `json:"information_jp" db:"InformationDescJP"`
	InformationKR string `json:"information_kr" db:"InformationDescKR"`
	InformationVN string `json:"information_vn" db:"InformationDescVN"`
	InformationID string `json:"information_id" db:"InformationDescID"`
}

type SubMatchSpecial struct {
	MatchID    int    `json:"match_id" db:"Match_ID"`
	MatchDate  string `json:"match_date" db:"Match_Date"`
	LeagueName string `json:"league_name" db:"League_Name"`
	HomeName   string `json:"home_name" db:"Home_Name"`
	AwayName   string `json:"away_name" db:"Away_Name"`
}
type ListGridAHOU struct {
	SubMatchId              int     `json:"sub_match_id" db:"Sub_Match_ID"`
	GameType                int     `json:"game_type" db:"GameType"`
	SubMatchOpenStatus      string  `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchParlayStatus    string  `json:"sub_match_parlay_status" db:"Sub_Match_Parlay_Status"`
	SubMatchPauseStatus     string  `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchHasTicketStatus string  `json:"sub_match_has_ticket_status" db:"Is_SubMatch_Has_Ticket"`
	Handicap                float32 `json:"handicap" db:"Handicap"`
	Odds1                   float32 `json:"odds1" db:"Odds1"`
	Odds2                   float32 `json:"odds2" db:"Odds2"`
}
type ListGrid1X2 struct {
	SubMatchId              int     `json:"sub_match_id" db:"Sub_Match_ID"`
	GameType                int     `json:"game_type" db:"GameType"`
	SubMatchOpenStatus      string  `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchParlayStatus    string  `json:"sub_match_parlay_status" db:"Sub_Match_Parlay_Status"`
	SubMatchPauseStatus     string  `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchHasTicketStatus string  `json:"sub_match_has_ticket_status" db:"Is_SubMatch_Has_Ticket"`
	Odds1                   float32 `json:"odds1" db:"Odds1"`
	Odds2                   float32 `json:"odds2" db:"Odds2"`
	Odds3                   float32 `json:"odds3" db:"Odds3"`
}
type ListGridHTFT struct {
	SubMatchId              int     `json:"sub_match_id" db:"Sub_Match_ID"`
	GameType                int     `json:"game_type" db:"GameType"`
	SubMatchOpenStatus      string  `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchParlayStatus    string  `json:"sub_match_parlay_status" db:"Sub_Match_Parlay_Status"`
	SubMatchPauseStatus     string  `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchHasTicketStatus string  `json:"sub_match_has_ticket_status" db:"Is_SubMatch_Has_Ticket"`
	Odds1                   float32 `json:"odds1" db:"Odds1"`
	Odds2                   float32 `json:"odds2" db:"Odds2"`
	Odds3                   float32 `json:"odds3" db:"Odds3"`
	Odds4                   float32 `json:"odds4" db:"Odds4"`
	Odds5                   float32 `json:"odds5" db:"Odds5"`
	Odds6                   float32 `json:"odds6" db:"Odds6"`
	Odds7                   float32 `json:"odds7" db:"Odds7"`
	Odds8                   float32 `json:"odds8" db:"Odds8"`
	Odds9                   float32 `json:"odds9" db:"Odds9"`
}
type ListGridTG struct {
	SubMatchId              int     `json:"sub_match_id" db:"Sub_Match_ID"`
	GameType                int     `json:"game_type" db:"GameType"`
	SubMatchOpenStatus      string  `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchParlayStatus    string  `json:"sub_match_parlay_status" db:"Sub_Match_Parlay_Status"`
	SubMatchPauseStatus     string  `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchHasTicketStatus string  `json:"sub_match_has_ticket_status" db:"Is_SubMatch_Has_Ticket"`
	Odds1                   float32 `json:"odds1" db:"Odds1"`
	Odds2                   float32 `json:"odds2" db:"Odds2"`
	Odds3                   float32 `json:"odds3" db:"Odds3"`
	Odds4                   float32 `json:"odds4" db:"Odds4"`
}
type ListGridFGLG struct {
	SubMatchId              int     `json:"sub_match_id" db:"Sub_Match_ID"`
	GameType                int     `json:"game_type" db:"GameType"`
	SubMatchOpenStatus      string  `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchParlayStatus    string  `json:"sub_match_parlay_status" db:"Sub_Match_Parlay_Status"`
	SubMatchPauseStatus     string  `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchHasTicketStatus string  `json:"sub_match_has_ticket_status" db:"Is_SubMatch_Has_Ticket"`
	Odds1                   float32 `json:"odds1" db:"Odds1"`
	Odds2                   float32 `json:"odds2" db:"Odds2"`
	Odds3                   float32 `json:"odds3" db:"Odds3"`
	Odds4                   float32 `json:"odds4" db:"Odds4"`
	Odds5                   float32 `json:"odds5" db:"Odds5"`
}
type ListGridCS struct {
	SubMatchId              int     `json:"sub_match_id" db:"Sub_Match_ID"`
	GameType                int     `json:"game_type" db:"GameType"`
	SubMatchOpenStatus      string  `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchParlayStatus    string  `json:"sub_match_parlay_status" db:"Sub_Match_Parlay_Status"`
	SubMatchPauseStatus     string  `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchHasTicketStatus string  `json:"sub_match_has_ticket_status" db:"Is_SubMatch_Has_Ticket"`
	Odds1                   float32 `json:"odds1" db:"Odds01"`
	Odds2                   float32 `json:"odds2" db:"Odds02"`
	Odds3                   float32 `json:"odds3" db:"Odds03"`
	Odds4                   float32 `json:"odds4" db:"Odds04"`
	Odds5                   float32 `json:"odds5" db:"Odds05"`
	Odds6                   float32 `json:"odds6" db:"Odds06"`
	Odds7                   float32 `json:"odds7" db:"Odds07"`
	Odds8                   float32 `json:"odds8" db:"Odds08"`
	Odds9                   float32 `json:"odds9" db:"Odds09"`
	Odds10                  float32 `json:"odds10" db:"Odds10"`
	Odds11                  float32 `json:"odds11" db:"Odds11"`
	Odds12                  float32 `json:"odds12" db:"Odds12"`
	Odds13                  float32 `json:"odds13" db:"Odds13"`
	Odds14                  float32 `json:"odds14" db:"Odds14"`
	Odds15                  float32 `json:"odds15" db:"Odds15"`
	Odds16                  float32 `json:"odds16" db:"Odds16"`
	Odds17                  float32 `json:"odds17" db:"Odds17"`
	Odds18                  float32 `json:"odds18" db:"Odds18"`
	Odds19                  float32 `json:"odds19" db:"Odds19"`
	Odds20                  float32 `json:"odds20" db:"Odds20"`
	Odds21                  float32 `json:"odds21" db:"Odds21"`
	Odds22                  float32 `json:"odds22" db:"Odds22"`
	Odds23                  float32 `json:"odds23" db:"Odds23"`
	Odds24                  float32 `json:"odds24" db:"Odds24"`
	Odds25                  float32 `json:"odds25" db:"Odds25"`
	Odds26                  float32 `json:"odds26" db:"Odds26"`
	Odds27                  float32 `json:"odds27" db:"Odds27"`
}
type ListGridCSLive struct {
	SubMatchId              int     `json:"sub_match_id" db:"Sub_Match_ID"`
	GameType                int     `json:"game_type" db:"GameType"`
	GameTypeName            string  `json:"game_type_name" db:"GameTypeName"`
	Score                   string  `json:"score" db:"Score"`
	SubMatchOpenStatus      string  `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchParlayStatus    string  `json:"sub_match_parlay_status" db:"Sub_Match_Parlay_Status"`
	SubMatchPauseStatus     string  `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchHasTicketStatus string  `json:"sub_match_has_ticket_status" db:"Is_SubMatch_Has_Ticket"`
	Odds                    float32 `json:"odds" db:"Odds"`
}
type ResultListMatchList struct {
	ListSpecial []SubMatchSpecial `json:"data_special"`
	ListAHOU    []ListGridAHOU    `json:"data_ahou"`
	List1X2     []ListGrid1X2     `json:"data_1x2"`
	ListHTFT    []ListGridHTFT    `json:"data_htft"`
	ListTG      []ListGridTG      `json:"data_tg"`
	ListFGLG    []ListGridFGLG    `json:"data_fglg"`
	ListCS      []ListGridCS      `json:"data_cs"`
	ListCSLive  []ListGridCSLive  `json:"data_cs_live"`
}

type MatchSpecial struct {
	GameType        int     `json:"game_type" db:"GameType"`
	HTHome          int     `json:"ht_home" db:"HT_Home"`
	HTAway          int     `json:"ht_away" db:"HT_Away"`
	FSHome          int     `json:"fs_home" db:"FS_Home"`
	FSAway          int     `json:"fs_away" db:"FS_Away"`
	VoidId          *string `json:"void_id" db:"Void_Id"`
	VoidDesc        *string `json:"void_desc" db:"Void_Desc"`
	VoidChoice      string  `json:"void_choice" db:"Void_Choice"`
	Status          string  `json:"status" db:"Status"`
	IsProcessed     string  `json:"is_processed" db:"isProcessed"`
	CancelType      string  `json:"cancel_type" db:"CancelType"`
	IsAllowedDelete string  `json:"is_allowed_delete" db:"isAllowedDelete"`
	Selection       int     `json:"selection" db:"Selection"`
	HomeScore       int     `json:"home_score" db:"Home_Score"`
	AwayScore       int     `json:"away_score" db:"Away_Score"`
}

type SelectedAddSpecial struct {
	NoPartai    int    `json:"no_partai" db:"No_Partai"`
	SpecialCode string `json:"special_code" db:"SpecialCode"`
	LeagueName  string `json:"league_name" db:"LeagueName"`
	HomeName    string `json:"home_name" db:"HomeName"`
	AwayName    string `json:"away_name" db:"AwayName"`
}

// type ResultWithSelectedSpecialMore struct {
// 	Result              ListDataEdit `json:"result"`
// 	SelectedSpecialMore []string     `json:"selected_special_more"`
// }
