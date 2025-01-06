package repository

import (
	"math"
	"strconv"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/util"
)

// todo convert to abstract class
func CountWL(score, fav string, posHome int, posAway int, gameType int, handicap float64, tHome, tAway, tDraw float64,

// NGHome, NGAway int,
) float64 {
	arrScore := strings.Split(score, "-")
	if len(arrScore) != 2 {
		return 0
	}
	scoreHome, _ := strconv.Atoi(arrScore[0])
	scoreAway, _ := strconv.Atoi(arrScore[1])
	if fav == "A" {
		temp := scoreHome
		scoreHome = scoreAway
		scoreAway = temp
	}

	// AH
	tempArrAH := []int{0, 2, 50}
	listGTAH := []int{1101, 1104, 1107, 1110, 1113}
	listGTGH := []int{1102, 1105, 1108, 1111, 1114}
	if util.Contains(tempArrAH, gameType) ||
		util.Contains(listGTAH, gameType) ||
		util.Contains(listGTGH, gameType) {
		A := handicap + float64(posAway) - float64(posHome) + float64(scoreHome) - float64(scoreAway)

		var X float64
		if math.Abs(A) == 0.125 {
			X = 0.25
		} else if math.Abs(A) == 0.25 {
			X = 0.5
		} else if math.Abs(A) > 0.25 {
			X = 1
		} else {
			X = 0
		}

		if A < 0 {
			return X * tAway
		} else if A > 0 {
			return X * tHome
		} else {
			return 0
		}
	}
	// OU
	tempArrOU := []int{5, 6, 61}
	listGTOU := []int{1103, 1106, 1109, 1112, 1115}
	if util.Contains(tempArrOU, gameType) ||
		util.Contains(listGTOU, gameType) {
		A := float64(scoreHome) + float64(scoreAway) - handicap

		var X float64
		if math.Abs(A) == 0.125 {
			X = 0.25
		} else if math.Abs(A) == 0.25 {
			X = 0.5
		} else if math.Abs(A) > 0.25 {
			X = 1
		} else {
			X = 0
		}

		if A < 0 {
			return X * tAway
		} else if A > 0 {
			return X * tHome
		} else {
			return 0
		}
	}
	// OE
	tempArrOE := []int{3, 16, 62}
	if util.Contains(tempArrOE, gameType) {
		A := scoreHome + scoreAway

		if A%2 != 0 {
			return tHome
		} else {
			return tAway
		}
	}
	// Draw
	GTDraw := 4
	if gameType == GTDraw {
		if scoreHome == scoreAway {
			return tHome
		} else {
			return tAway * 0.5
		}
	}
	// 1X2,ML,DC,DNB
	listGT1X2 := []int{1, 8}
	GTML := 12
	GTDC := 15
	GTDNB := 28
	if util.Contains(listGT1X2, gameType) ||
		gameType == GTML ||
		gameType == GTDC ||
		gameType == GTDNB {
		if scoreHome > scoreAway {
			return tHome
		} else if scoreAway > scoreHome {
			return tAway
		} else if scoreAway == scoreHome {
			return tDraw
		}
	}
	// NGNC
	// todo check
	listGTNGNC := []int{59, 60}
	if util.Contains(listGTNGNC, gameType) {
		// if NGHome == 1 && NGAway == 0 {
		// 	return tHome
		// } else if NGHome == 0 && NGAway == 1 {
		// 	return tAway
		// } else {
		// 	A := posAway - posHome + scoreHome - scoreAway

		// 	if (A < 0) {
		// 		return tAway
		// 	}else if (A > 0){
		// 		return tHome
		// 	}else {
		// 		return 0
		// 	}
		// }
	}
	// CSL
	// todo check
	listGTCSL := []int{1001, 1002}
	if util.Contains(listGTCSL, gameType) {
		// tempScore := 0
		// // var isForcastSingle bool
		// // var curHome, curAway int
		// if isForcastSingle == false {
		// 	if curHome > curAway {
		// 		if scoreHome >= (curHome - curAway) {
		// 			tempScore = curAway
		// 		} else if scoreAway > 0 {
		// 			tempScore = curHome
		// 		}else {
		// 			tempScore = curHome - scoreHome
		// 		}
		// 	} else if curHome < curAway {
		// 		if (scoreAway >= (curAway - curHome)) {
		// 			tempScore = curHome
		// 		}else if scoreHome > 0{
		// 			tempScore = curAway
		// 		}else{
		// 			tempScore = curAway - scoreAway
		// 		}
		// 	} else {
		// 		tempScore = curHome
		// 	}
		// }
		// if (tempScore + scoreHome == NGHome) && (tempScore + scoreAway == NGAway) {
		// 	return tHome
		// } else {
		// 	return tAway
		// }
	}
	// BTTS
	// todo check
	GTBTTS := 20
	if gameType == GTBTTS {
		// _home := 0
		//  _away := 0

		// if (scoreHome > 0) _home = ScoreHome
		// else if (curHome > 0) _home = curHome
		// else if (scoreHome == 0 && scoreAway == 0 && curAway > 0) _home = 1
		// else _home = curHome;

		// if (scoreAway > 0) _away = ScoreAway
		// else if (curAway > 0) _away = curAway
		// else if (scoreHome == 0 && scoreAway == 0 && curHome > 0) _away = 1
		// else _away = curAway;

		// return  (_home > 0 && _away > 0) ? tHome : tAway;
	}
	// TG
	// note: TG is not in the list
	GTTG := 7
	if gameType == GTTG {
		// if (scoreHome == 0 || scoreHome == 1) return tHome;
		// else if (scoreHome == 2 || scoreHome == 3) return tAway;
		// else if (scoreHome >= 4 && scoreHome <= 6) return tDraw;
		// else if (scoreHome >= 7) return tLiab4;
		// return 0
	}
	// FHTG
	// note: FHTG is not in the list
	GTFHTG := 36
	if gameType == GTFHTG {
		// if (scoreHome == 0 || scoreHome == 1) return tHome;
		// else if (scoreHome == 2 || scoreHome == 3) return tAway;
		// else if (scoreHome >= 4) return tDraw;
		// return 0
	}
	// HTFT
	// todo check
	GTHTFT := 9
	if gameType == GTHTFT {
		// int _HT = 0;
		// int _FT = 0;
		// int _scoreFT = 0;

		// if (NG_Home == NG_Away) _HT = 2;
		// else if (NG_Home > NG_Away) _HT = 1;
		// else if (NG_Home < NG_Away) _HT = 3;

		// _scoreFT = NG_Home - NG_Away - ScoreHome + ScoreAway;
		// if (_scoreFT == 0) _FT = 2;
		// else if (_scoreFT <= -1) _FT = 1;
		// else if (_scoreFT >= 1) _FT = 3;

		// if (_HT == 1 && _FT == 1) Result = tHome;
		// else if (_HT == 1 && _FT == 2) Result = tAway;
		// else if (_HT == 1 && _FT == 3) Result = tDraw;
		// else if (_HT == 2 && _FT == 1) Result = tLiab4;
		// else if (_HT == 2 && _FT == 2) Result = tLiab5;
		// else if (_HT == 2 && _FT == 3) Result = tLiab6;
		// else if (_HT == 3 && _FT == 1) Result = tLiab7;
		// else if (_HT == 3 && _FT == 2) Result = tLiab8;
		// else if (_HT == 3 && _FT == 3) Result = tLiab9;
	}
	// HNW
	GTHNW := 63
	if gameType == GTHNW {
		if scoreHome > scoreAway {
			return tHome
		} else {
			return tAway
		}
	}
	// ANW
	GTNWN := 64
	if gameType == GTNWN {
		if scoreAway > scoreHome {
			return tHome
		} else {
			return tAway
		}
	}
	return 0
}
