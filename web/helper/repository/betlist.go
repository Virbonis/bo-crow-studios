package repository

import (
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/util"
)

var (
	arrChoiceHome = []string{"1H", "2H", "11", "21", "ME1", "1ME1", "ML1", "1ML1", "NC1", "NG1", "GH1", "S1G1", "S2G1", "S3G1", "S4G1", "S5G1", "S1W1", "S2W1", "S3W1", "S4W1", "S5W1", "3WHH"}
	arrChoiceAway = []string{"1A", "2A", "12", "22", "ME2", "1ME2", "ML2", "1ML2", "NC2", "NG2", "GH2", "S1G2", "S2G2", "S3G2", "S4G2", "S5G2", "S1W2", "S2W2", "S3W2", "S4W2", "S5W2", "3WHA"}

	arrChoiceOver  = []string{"1O", "2O", "GOU1", "S1O1", "S2O1", "S3O1", "S4O1", "S5O1"}
	arrChoiceUnder = []string{"1U", "2U", "GOU2", "S1O2", "S2O2", "S3O2", "S4O2", "S5O2"}

	arrChoiceOdd         = []string{"OE1", "1OE1", "GOE1", "S1OE1", "S2OE1", "S3OE1", "S4OE1", "S5OE1"}
	arrChoiceEven        = []string{"OE2", "1OE2", "GOE2", "S1OE2", "S2OE2", "S3OE2", "S4OE2", "S5OE2"}
	arrChoiceHomeBasket  = []string{"HQWH", "Q1H", "Q2H", "Q3H", "Q4H", "Q1ML1", "Q2ML1", "Q3ML1", "Q4ML1"}
	arrChoiceAwayBasket  = []string{"AQWH", "Q1A", "Q2A", "Q3A", "Q4A", "Q1ML2", "Q2ML2", "Q3ML2", "Q4ML2"}
	arrChoiceOverBasket  = []string{"HQWO", "AQWO", "2HO", "2AO", "1HO", "1AO", "Q1HO", "Q1AO", "Q2HO", "Q2AO", "Q3HO", "Q3AO", "Q4HO", "Q4AO", "Q1O", "Q2O", "Q3O", "Q4O"}
	arrChoiceUnderBasket = []string{"HQWU", "AQWU", "Q1U", "Q2U", "Q3U", "Q4U", "2HU", "2AU", "1HU", "1AU", "Q1HU", "Q1AU", "Q2HU", "Q2AU", "Q3HU", "Q3AU", "Q4HU", "Q4AU"}
	arrChoiceOddBasket   = []string{"Q1OE1", "Q2OE1", "Q3OE1", "Q4OE1"}
	arrChoiceEvenBasket  = []string{"Q1OE2", "Q2OE2", "Q3OE2", "Q4OE2"}
)

func ConvertToArrayListMOBetListAHOUOE(list []model.BetList) ([]model.BetList, []model.BetList) {
	Home := []model.BetList{}
	Away := []model.BetList{}
	for _, row := range list {
		arrLine := row

		if util.Contains(arrChoiceHome, arrLine.BetChoice) ||
			util.Contains(arrChoiceOver, arrLine.BetChoice) ||
			util.Contains(arrChoiceOdd, arrLine.BetChoice) ||
			util.Contains(arrChoiceHomeBasket, arrLine.BetChoice) ||
			util.Contains(arrChoiceOverBasket, arrLine.BetChoice) ||
			util.Contains(arrChoiceOddBasket, arrLine.BetChoice) {
			Home = append(Home, arrLine)
		} else if util.Contains(arrChoiceAway, arrLine.BetChoice) ||
			util.Contains(arrChoiceUnder, arrLine.BetChoice) ||
			util.Contains(arrChoiceEven, arrLine.BetChoice) ||
			util.Contains(arrChoiceAwayBasket, arrLine.BetChoice) ||
			util.Contains(arrChoiceUnderBasket, arrLine.BetChoice) ||
			util.Contains(arrChoiceEvenBasket, arrLine.BetChoice) {
			Away = append(Away, arrLine)
		}
	}
	return Home, Away
}
func ConvertToArrayListMOBetList1X2(list []model.BetList) ([]model.BetList, []model.BetList, []model.BetList) {
	Home := []model.BetList{}
	Draw := []model.BetList{}
	Away := []model.BetList{}
	for _, row := range list {
		arrLine := row

		if util.Contains([]string{"11", "21"}, arrLine.BetChoice) {
			Home = append(Home, arrLine)
		} else if util.Contains([]string{"12", "22"}, arrLine.BetChoice) {
			Away = append(Away, arrLine)
		} else if util.Contains([]string{"2X", "1X"}, arrLine.BetChoice) {
			Draw = append(Draw, arrLine)
		}
	}
	return Home, Draw, Away
}

func ConvertToArrayListBetListAHOUOE1X2(list []model.BetList) ([]model.BetList, []model.BetList, []model.BetList, []model.BetList, []model.BetList, []model.BetList) {
	Home := []model.BetList{}
	Draw := []model.BetList{}
	Away := []model.BetList{}
	Home1x2 := []model.BetList{}
	Away1x2 := []model.BetList{}
	Draw1x2 := []model.BetList{}
	for _, row := range list {
		arrLine := row

		if util.Contains(arrChoiceHome, arrLine.BetChoice) ||
			util.Contains(arrChoiceOver, arrLine.BetChoice) ||
			util.Contains(arrChoiceOdd, arrLine.BetChoice) {
			Home = append(Home, arrLine)
		} else if util.Contains(arrChoiceAway, arrLine.BetChoice) ||
			util.Contains(arrChoiceUnder, arrLine.BetChoice) ||
			util.Contains(arrChoiceEven, arrLine.BetChoice) {
			Away = append(Away, arrLine)
		}

		if util.Contains([]string{"11", "21"}, arrLine.BetChoice) {
			Home1x2 = append(Home1x2, arrLine)
		} else if util.Contains([]string{"12", "22"}, arrLine.BetChoice) {
			Away1x2 = append(Away1x2, arrLine)
		} else if util.Contains([]string{"2X", "1X"}, arrLine.BetChoice) {
			Draw1x2 = append(Draw1x2, arrLine)
		}
	}
	return Home, Draw, Away, Home1x2, Away1x2, Draw1x2
}
