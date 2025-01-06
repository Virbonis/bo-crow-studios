package model

type Application struct {
	ApplicationID int    `json:"application_id" db:"ApplicationID"`
	Name          string `json:"name" db:"Name"`
	Roles         string `json:"roles" db:"Roles"`
	Menus         string `json:"menus" db:"Menus"`
	IsActive      bool   `json:"is_active" db:"IsActive"`
}

type ApplicationMenu struct {
	MenuID      int    `json:"menu_id" db:"MenuID"`
	Title       string `json:"title" db:"Title"`
	ParentTitle string `json:"parent_title" db:"ParentTitle"`
	Status      int    `json:"status" db:"STATUS"`
}
