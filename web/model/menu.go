package model

import (
	"github.com/guregu/null"
)

type Menu struct {
	MenuID      int         `json:"menu_id" db:"MenuID"`
	MenuNo      int         `json:"menu_number" db:"MenuNo"`
	Title       string      `json:"title" db:"Title"`
	Key         null.String `json:"key" db:"Key"`
	URL         null.String `json:"url" db:"Url"`
	Icon        null.String `json:"icon" db:"Icon"`
	Category    bool        `json:"category" db:"Category"`
	ParentID    null.Int    `json:"parent_id" db:"ParentID"`
	ParentTitle null.String `json:"parent_title" db:"ParentTitle"`
	IsMulticomp bool        `json:"is_multicomp" db:"IsMulticomp"`
	IsForTrader bool        `json:"is_for_trader" db:"Is_ForTrader"`
	RoleIDs     null.String `json:"role_ids" db:"RoleIDs"`
	Roles       null.String `json:"roles" db:"Roles"`
}
