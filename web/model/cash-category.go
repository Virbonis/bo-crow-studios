package model

type CashCategory struct {
	CashCategoryID        string  `json:"cash_category_id" db:"Cash_Category_ID"`
	PositionTaking        float64 `json:"position_taking" db:"Position_Taking"`
	OddsTriggerAdjustment float64 `json:"odds_trigger_adjustment" db:"Odds_Trigger_Adjustment"`
}
