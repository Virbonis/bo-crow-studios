package model

type VIP struct {
	VIPCode int    `json:"vip_code" db:"VIPCode"`
	VIPDesc string `json:"vip_desc" db:"VIPDesc"`
}