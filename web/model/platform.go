package model

type SelectPlatform struct {
	PlatformID   string `json:"platform_id" db:"Platform_ID"`
	PlatformName string `json:"platform_name" db:"Platform_Name"`
}
