package model

type GridMappingTeam struct {
	WebsiteName string `json:"website_name" db:"Website_Name"`
	SportName   string `json:"sport_name" db:"Sport_Name"`
	IBCTeamID   int    `json:"ibc_team_id" db:"IBC_Team_ID"`
	IBCTeamName string `json:"ibc_team_name" db:"IBC_Team_Name"`
	OurTeamID   int    `json:"our_team_id" db:"Our_Team_ID"`
	OurTeamName string `json:"our_team_name" db:"Our_Team_Name"`
	OurSportID  int    `json:"our_sport_id" db:"Our_Sport_ID"`
	OurTeam     string `json:"our_team" db:"Our_Team"`
}
