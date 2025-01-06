package model

type SportsbookSetting struct {
	Is_Maintenance            string  `json:"is_maintenance" db:"Is_Maintenance"`
	Switch_Default_Match      string  `json:"switch_default_match" db:"Switch_Default_Match"`
	IB_Payout_Trigger_Amt     float64 `json:"ib_payout_trigger_amt" db:"IB_Payout_Trigger_Amt"`
	IB_Max_Bet_Trigger_Pct    float64 `json:"ib_max_bet_trigger_pct" db:"IB_Max_Bet_Trigger_Pct"`
	Max_Bet_Pause_Trigger_Pct float64 `json:"max_bet_pause_trigger_pct" db:"Max_Bet_Pause_Trigger_Pct"`
	LAP_Short_Trigger_Pct     float64 `json:"lap_short_trigger_pct" db:"LAP_Short_Trigger_Pct"`
	Auto_Accept_Delay_Home    int     `json:"auto_accept_delay_home" db:"Auto_Accept_Delay_Home"`
	Auto_Accept_Delay_Away    int     `json:"auto_accept_delay_away" db:"Auto_Accept_Delay_Away"`
	Auto_Accept_Delay_Over    int     `json:"auto_accept_delay_over" db:"Auto_Accept_Delay_Over"`
	Auto_Accept_Delay_Under   int     `json:"auto_accept_delay_under" db:"Auto_Accept_Delay_Under"`
	Auto_Accept_Delay_Reject  int     `json:"auto_accept_delay_reject" db:"Auto_Accept_Delay_Reject"`
	Day_Light_Saving          int     `json:"day_light_saving" db:"Day_Light_Saving"`
	Close_Fund_Transfer       int     `json:"close_fund_transfer" db:"Close_Fund_Transfer"`
	Auto_Early_Settlement     int     `json:"auto_early_settlement" db:"Auto_Early_Settlement"`
	Is_Maintenance_Seamless   string  `json:"is_maintenance_seamless" db:"Is_Maintenance_Seamless"`
	BetBazar_Status           bool    `json:"bet_bazar_status" db:"BetBazar_Status"`
	IM_Status                 bool    `json:"im_status" db:"IM_Status"`
	SIS_Status                bool    `json:"sis_status" db:"SIS_Status"`
	BTI_AutoAddMatch          bool    `json:"bti_auto_add_match" db:"BTI_AutoAddMatch"`
}

type DefaultMatchOutright struct {
	SportID            int    `json:"sport_id" db:"No_Sport"`
	SportName          string `json:"sport_name" db:"Nama_Sport"`
	AutoCreateMatch    string `json:"auto_create_match" db:"AutoCreateMatch"`
	AutoCreateOutright string `json:"auto_create_outright" db:"AutoCreateOutright"`
}
