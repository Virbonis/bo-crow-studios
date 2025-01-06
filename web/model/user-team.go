package model

type UserTeam struct {
	UserTeamID   int    `json:"user_team_id" db:"USER_TEAM_ID"`
	UserTeamName string `json:"user_team_name" db:"USER_TEAM_NAME"`
}

type ListUserTeam struct {
	TeamID         int    `json:"team_id" db:"Team_ID"`
	TeamName       string `json:"team_name" db:"Team_Name"`
	IsActive       string `json:"is_active" db:"Is_Active"`
	Username       string `json:"username" db:"Username"`
	League         string `json:"league" db:"League"`
	HasUserTeamSub string `json:"has_user_team_sub" db:"Has_UserTeamSub"`
}

type ListUserUserTeam struct {
	UserID     int    `json:"user_id" db:"User_ID"`
	Username   string `json:"username" db:"Username"`
	IsSelected string `json:"is_selected" db:"Is_Selected"`
}

type ListTeamSub struct {
	UserTeamSubID   int    `json:"user_team_sub_id" db:"USER_TEAM_SUB_ID"`
	UserTeamSubName string `json:"team_name" db:"USER_TEAM_SUB_NAME"`
	Username        string `json:"username" db:"Username"`
	League          string `json:"league" db:"League"`
}

type ListLeagueTeamSub struct {
	LeagueID   int    `json:"league_id" db:"League_ID"`
	League     string `json:"league" db:"League"`
	IsSelected string `json:"is_selected" db:"Is_Selected"`
}
