package model

type SelectSpecialCode struct {
	SpecialID   string `json:"special_id" db:"SpecialID"`
	SpecialName string `json:"special_name" db:"SpecialName"`
	OrderID     int    `json:"order_id" db:"OrderID"`
}
