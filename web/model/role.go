package model

type Role struct {
	RoleID      int    `json:"role_id" db:"RoleID"`
	Name        string `json:"name" db:"Name"`
	Description string `json:"description" db:"Description"`
	Users       string `json:"users" db:"User"`
	TraderGroup string `json:"trader_group" db:"TraderGroup"`
	Menus       string `json:"menus" db:"Menu"`
}

type RoleUser struct {
	UserID   int    `json:"user_id" db:"UserID"`
	Username string `json:"username" db:"USER_NAME"`
	Name     string `json:"name" db:"FullName"`
	Status   int    `json:"status" db:"STATUS"`
}

type RoleMenu struct {
	MenuID      int    `json:"menu_id" db:"MenuID"`
	Title       string `json:"title" db:"Title"`
	ParentTitle string `json:"parent_title" db:"ParentTitle"`
	Status      int    `json:"status" db:"STATUS"`
	IsDisabled  string `json:"is_disabled" db:"Is_Disabled"`
}

type RolePermission struct {
	PermissionID int    `json:"permission_id" db:"PermissionID"`
	Description  string `json:"description" db:"Description"`
	Group        string `json:"group" db:"Group"`
	Status       int    `json:"status" db:"STATUS"`
}
