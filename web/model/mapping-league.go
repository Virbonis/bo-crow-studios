package model

type MappingLeague struct {
	Website_Name    string `json:"website_name" db:"Website_Name"`
	Sport_Name      string `json:"sport_name" db:"Sport_Name"`
	IBC_League_ID   int    `json:"ibc_league_id" db:"IBC_League_ID"`
	IBC_League_Name string `json:"ibc_league_name" db:"IBC_League_Name"`
	Our_League_ID   int    `json:"our_league_id" db:"Our_League_ID"`
	Our_League_Name string `json:"our_league_name" db:"Our_League_Name"`
	Our_Sport_ID    int    `json:"our_sport_id" db:"Our_Sport_ID"`
	Our_League      string `json:"our_league" db:"Our_League"`
}
