package model

import (
	"github.com/shopspring/decimal"
)

type Profile1x2 struct {
	LimitID1x2 string          `json:"limit_id_1x2" db:"LimitID1x2"`
	GameType   int64           `json:"game_type" db:"GameType"`
	HDP        decimal.Decimal `json:"hdp" db:"HDP"`
	OddsHDP    decimal.Decimal `json:"odds_hdp" db:"OddsHDP"`
	OddsFav    decimal.Decimal `json:"odds_fav" db:"OddsFav"`
	OddsDraw   decimal.Decimal `json:"odds_draw" db:"OddsDraw"`
	Odds5      decimal.Decimal `json:"odds_5" db:"Odds5"`
	Odds8      decimal.Decimal `json:"odds_8" db:"Odds8"`
	Odds10     decimal.Decimal `json:"odds_10" db:"Odds10"`
	Odds12     decimal.Decimal `json:"odds_12" db:"Odds12"`
	Odds15     decimal.Decimal `json:"odds_15" db:"Odds15"`
	Odds18     decimal.Decimal `json:"odds_18" db:"Odds18"`
	Odds20     decimal.Decimal `json:"odds_20" db:"Odds20"`
	Odds24     decimal.Decimal `json:"odds_24" db:"Odds24"`
	Odds6      decimal.Decimal `json:"odds_6" db:"Odds6"`
	Odds7      decimal.Decimal `json:"odds_7" db:"Odds7"`
	Odds9      decimal.Decimal `json:"odds_9" db:"Odds9"`
	RowID      int64           `json:"row_id" db:"RowID"`
}
