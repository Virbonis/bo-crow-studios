package model

type ProviderSelect struct {
	ProviderID   string `json:"provider_id" db:"ProviderID"`
	ProviderName string `json:"provider_name" db:"ProviderName"`
}
