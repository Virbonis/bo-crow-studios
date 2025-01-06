package model

type ListCountryRestriction struct {
	CustomerID              int    `json:"customer_id" db:"Customer_ID"`
	CustomerType            string `json:"customer_type" db:"Customer_Type"`
	CustomerLevel           string `json:"customer_level" db:"Customer_Level"`
	BranchName              string `json:"branch_name" db:"Branch_Name"`
	Username                string `json:"username" db:"Username"`
	Currency                string `json:"currency" db:"Currency"`
	JoinDate                string `json:"join_date" db:"Join_Date"`
	CustomerActiveStatus    int    `json:"active" db:"Customer_Active_Status"`
	CustomerAccessStatus    int    `json:"access" db:"Customer_Access_Status"`
	CountryName             string `json:"country_name" db:"Country_Name"`
	IsHasDownline           int    `json:"has_downline" db:"Is_Has_Downline"`
	CustomerTreeGetDownline string `json:"customer_tree_get_downline" db:"Customer_Tree_Get_Downline"`
}

type EditCountryRestriction struct {
	Sort             int    `json:"sort" db:"Sort"`
	ID               string `json:"id" db:"ID"`
	CountryContinent string `json:"country_continent" db:"Country_Continent"`
	CountryRegion    string `json:"country_region" db:"Country_Region"`
	CountryName      string `json:"country_name" db:"Country_Name"`
	CountryISO       string `json:"country_iso" db:"Country_ISO"`
	IsSelected       int    `json:"is_selected" db:"Is_Selected"`
}
