import React from 'react'

// dont export, local to this file only
const ListGTAH = [0, 2]
const ListGTGAH = [50, 1102, 1105, 1108, 1111, 1114]
const ListGTHandicapBasket = [1241, 1242, 1243, 1244, 1210]
const ListGTHandicap = ListGTAH.concat(ListGTGAH).concat(ListGTHandicapBasket)
const ListGTOverUnderBasket = [1245, 1246, 1247, 1248, 1211, 1212, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290, 1291, 1292, 1293] // prettier-ignore
const ListGTOverUnder = [5, 6, 61, 1103, 1106, 1109, 1112, 1115].concat(ListGTOverUnderBasket) // prettier-ignore
const ListGTOddEvenBasket = [1249, 1250, 1251, 1252]
const ListGTOddEven = [3, 16, 62, 1116, 1117, 1118, 1119, 1120].concat(ListGTOddEvenBasket)
const ListGT1X2 = [1, 8] // 1X2, HT.1X2
const ListGTMoneyLineBasket = [1253, 1254, 1255, 1256]
const ListGTMoneyLine = [12, 17].concat(ListGTMoneyLineBasket)
const ListGTSW = [1101, 1104, 1107, 1110, 1113]

// #region basket
export const MapListSpecialBasket = {
  MainQuarter: [1241, 1242, 1243, 1244, 1245, 1246, 1247, 1248, 1249, 1250, 1251, 1252, 1253, 1254, 1255, 1256], // prettier-ignore
  HT: [1215, 1216, 1217, 1218, 1219, 1220, 1284, 1285, 1221, 1222, 1223, 1224, 1225, 1226, 1227, 1228], // prettier-ignore
  FT: [1201, 1202, 1282, 1283, 1203, 1281, 1204, 1205, 1206],
  Quarter: [1277, 1278, 1279, 1280, 1208, 1209, 1210, 1211, 1212, 1213, 1214],
  Q1: [1229, 1233, 1237, 1257, 1261, 1265, 1269, 1273, 1286, 1287],
  Q2: [1230, 1234, 1238, 1258, 1262, 1266, 1270, 1274, 1288, 1289],
  Q3: [1231, 1235, 1239, 1259, 1263, 1267, 1271, 1275, 1290, 1291],
  Q4: [1232, 1236, 1240, 1260, 1264, 1268, 1272, 1276, 1292, 1293],
}
export const ListGTScoringInput = [
  1210, 1211, 1212, 1282, 1283,
  1241, 1245, 1249, 1253, 1286, 1287,
  1242, 1246, 1247, 1248, 1288, 1289,
  1243, 1250, 1251, 1252, 1290, 1291,
  1244, 1254, 1255, 1256, 1292, 1293,
  1284, 1285
] // prettier-ignore
export const ListGTScoringDropdown = [
  1201, 1202, 1208, 1209, 1215, 1216, 
  1217, 1218, 1219, 1220, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276, 
  1203, 1204, 1205, 1206, 1213, 1214, 1221, 1226, 1227, 1228, 1277, 1279, 1281, 1222, 1223, 1224, 1225, 1278, 
  1229, 1230, 1231, 1232, 1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240, 1257, 1258, 1259, 1260
] // prettier-ignore
export const ListGTScoringCanDraw = [
  1208, 1209, 1215, 1216, 1217, 1218, 1219, 1220,
  1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 
  1270, 1271, 1272, 1273, 1274, 1275, 1276
] // prettier-ignore
// #endregion

export const listGT = {
  Handicap: ListGTHandicap,
  OverUnder: ListGTOverUnder,
  OddEven: ListGTOddEven,
  MoneyLine: ListGTMoneyLine,
  SetWinner: ListGTSW,
  // AH: [0, 2, 1101, 1104, 1107, 1110, 1113],
  // ↓ dipake di bet-list, mo
  AHSW: ListGTAH.concat(ListGTHandicapBasket).concat(ListGTSW),
  GAH: ListGTGAH,
  OUGOU: ListGTOverUnder,
  OEGOE: ListGTOddEven,
  ML: ListGTMoneyLine,

  // AH: [0,2],
  // SW: [1101, 1104, 1107, 1110, 1113],
  // OU: [5, 6, 61, 1103, 1106, 1109, 1112, 1115],
  // OE: [3, 16, 62, 1116, 1117, 1118, 1119, 1120],
  // ML: [12, 18, 17],
  NGNC: [59, 60],
  '1X2': ListGT1X2,
  DC: [15],
  TG: [7],
  FHTG: [36],
  FGLG: [14],
  HTFT: [9],
  CS: [10],
  FHCS: [13],
  FGM: [21],
  TOTFG: [25],
  ITA: [27],
  WM: [35],
  HNB: [37],
  ANB: [38],
  // DNB: [28], // move to HA (mo other game type)
  '3WH': [39],
  CSH: [40],
  YN: [1231, 20, 41, 22, 42, 43, 44, 45, 46, 47, 26], // 26(TSBH)
  HA: [23, 24, 33, 34, 28],
  '12HD': [48, 49, 30, 29],
  WNW: [63, 64],
  HWNW: [63],
  AWNW: [64],
  // CSlive
  CSLive: [1001],
  FHCSLive: [1002],
  S1: [1101, 1102, 1103, 1116],
  S2: [1104, 1105, 1106, 1117],
  S3: [1107, 1108, 1109, 1118],
  S4: [1110, 1111, 1112, 1119],
  S5: [1113, 1114, 1115, 1120],
}

export const gameTypeDescription = {
  '-1': { short: 'PAR', long: 'Mix Parlay' },
  0: { short: 'HDP', long: 'Handicap' },
  1: { short: '1X2', long: '1X2' },
  2: { short: '1h.HDP', long: 'FH. Handicap' },
  3: { short: 'OE', long: 'Odd/Even' },
  4: { short: 'DW', long: 'Draw' },
  5: { short: 'OU', long: 'Over/Under' },
  6: { short: '1h.OU', long: 'FH. Over/Under' },
  7: { short: 'TG', long: 'Total Goal' },
  36: { short: '1h.TG', long: 'FH. Total Goal' },
  8: { short: '1h.1X2', long: 'FH. 1X2' },
  9: { short: 'HTFT', long: 'Half Time/Full Time' },
  10: { short: 'CS', long: 'Correct Score' },
  11: { short: 'OUT', long: 'Outright' },
  12: { short: 'ML', long: 'Money Line' },
  18: { short: 'ML', long: 'Money Line' },
  17: { short: '1h.ML', long: 'FH. Money Line' },
  13: { short: '1h.CS', long: 'FH. Correct Score' },
  14: { short: 'FGLG', long: 'First Goal/Last Goal' },
  15: { short: 'DC', long: 'Double Chance' },
  16: { short: '1h.OE', long: 'FH. Odd/Even' },

  20: { short: 'BTTS', long: 'BTTS - Both Teams To Score' },
  21: { short: 'FGM', long: 'FGM - First Goal Method' },
  22: { short: 'PA', long: 'PA - Penalty Awarded' },
  23: { short: 'RT2G', long: 'RT2G - Race To 2 Goals' },
  24: { short: 'RT3G', long: 'RT3G - Race To 3 Goals' },
  25: { short: 'TOTFG', long: 'TOTFG - Time Of The First Goal' },
  26: { short: 'TSBH', long: 'TSBH - To Score Both Halves' },
  27: { short: 'ITA', long: 'ITA2H - Injury Time Awarded At End Of 2nd Half' },
  28: { short: 'DNB', long: 'DNB - Draw No Bet' },
  29: { short: 'HWMC', long: 'HWMC - Half With Most Corners' },
  30: { short: 'HSH', long: 'HSH - Highest Scoring Half' },
  33: { short: 'TWFB', long: 'TWFB - To Win From Behind' },
  34: { short: 'TWTN', long: 'TWTN - To Win To Nil' },
  35: { short: 'WM', long: 'WM - Winning Margin' },
  37: { short: 'HNB', long: 'HNB - Home No Bet' },
  38: { short: 'ANB', long: 'ANB - Away No Bet' },
  39: { short: '3WH', long: '3WH - 3 Way Handicap' },
  40: { short: 'CSH', long: 'CSH - Clean Sheet' },
  41: { short: '2BTTS', long: '2BTTS - 2nd Half Both Team to Score' },
  42: { short: 'HWEH', long: 'HWEH - Home to Win Either Half' },
  43: { short: 'AWEH', long: 'AWEH - Away to Win Either Half' },
  44: { short: 'HWBH', long: 'HWBH - Home to Win Both Halves' },
  45: { short: 'AWBH', long: 'AWBH - Away to Win Both Halves' },
  46: { short: 'HSBH', long: 'HSBH - Home to Score Both Halves' },
  47: { short: 'ASBH', long: 'ASBH - Away to Score Both Halves' },
  48: { short: 'HSHHT', long: 'HSHHT - Highest Scoring Half Home Team' },
  49: { short: 'HSHAT', long: 'HSHAT - Highest Scoring Half Away Team' },

  50: { short: 'G.AH', long: 'Game Handicap' },
  59: { short: 'NC', long: 'Next Corner' },
  60: { short: 'NG', long: 'Next Goal' },
  61: { short: 'G.OU', long: 'Game Over/Under' },
  62: { short: 'G.OE', long: 'Game Odd/Even' },
  63: { short: 'HWNW', long: 'Home Win/Not Win' },
  64: { short: 'AWNW', long: 'Away Win/Not Win' },

  // CS-LIVE
  1001: { short: 'CS', long: 'Correct Score (Live)' },
  1002: { short: '1h.CS', long: 'FH. Correct Score (Live)' },
  1101: { short: 'S1.W', long: 'Set 1 Winner' },
  1102: { short: 'S1.GH', long: 'Set 1 Game Handicap' },
  1103: { short: 'S1.OU', long: 'Set 1 Game Handicap OU' },
  1104: { short: 'S2.W', long: 'Set 2 Winner' },
  1105: { short: 'S2.GH', long: 'Set 2 Game Handicap' },
  1106: { short: 'S2.OU', long: 'Set 2 Game Handicap OU' },
  1107: { short: 'S3.W', long: 'Set 3 Winner' },
  1108: { short: 'S3.GH', long: 'Set 3 Game Handicap' },
  1109: { short: 'S3.OU', long: 'Set 3 Game Handicap OU' },
  1110: { short: 'S4.W', long: 'Set 4 Winner' },
  1111: { short: 'S4.GH', long: 'Set 4 Game Handicap' },
  1112: { short: 'S4.OU', long: 'Set 4 Game Handicap OU' },
  1113: { short: 'S5.W', long: 'Set 5 Winner' },
  1114: { short: 'S5.GH', long: 'Set 5 Game Handicap' },
  1115: { short: 'S5.OU', long: 'Set 5 Game Handicap OU' },

  1116: { short: 'S1.OE', long: 'Set 1 Game OE' },
  1117: { short: 'S2.OE', long: 'Set 2 Game OE' },
  1118: { short: 'S3.OE', long: 'Set 3 Game OE' },
  1119: { short: 'S4.OE', long: 'Set 4 Game OE' },
  1120: { short: 'S5.OE', long: 'Set 5 Game OE' },

  // #region BASKET
  1201: { short: 'WTSFB', long: 'Which Team to Score The First Basket' },
  1202: { short: 'WTSLB', long: 'Which Team to Score The Last Basket' },
  1203: { short: 'WM12W', long: 'Winning Margin 12 Way' },
  1204: { short: 'LDS', long: 'Last Digit Score' },
  1205: { short: 'HLDS', long: 'Home Last Digit Score' },
  1206: { short: 'ALDS', long: 'Away Last Digit Score' },
  1207: { short: 'MHT', long: 'Match Handicap & Total' },
  1208: { short: 'QTWN', long: 'Quarter To Win Nil' },
  1209: { short: 'QTWFB', long: 'Quarter To Win From Behind' },
  1210: { short: 'QWH', long: 'Quarter Winners Handicap' },
  1211: { short: 'HQW OU', long: 'Home Quarters Win Over/Under' },
  1212: { short: 'AQW OU', long: 'Away Quarters Win Over/Under' },
  1213: { short: 'QCS', long: 'Quarter Correct Score' },
  1214: { short: 'CQOE', long: 'Correct Quarter Odd/Even' },
  1215: { short: '1HR25P', long: '1H Race to 25 Points' },
  1216: { short: '1HR30P', long: '1H Race to 30 Points' },
  1217: { short: '1HR35P', long: '1H Race to 35 Points' },
  1218: { short: '2HR25P', long: '2H Race to 25 Points' },
  1219: { short: '2HR30P', long: '2H Race to 30 Points' },
  1220: { short: '2HR35P', long: '2H Race to 35 Points' },
  1221: { short: '1H2H', long: '1H/2H result' },
  1222: { short: '1H WM13W', long: '1H Winning Margin 13 Way' },
  1223: { short: '1LDS', long: '1H Last Digit Score' },
  1224: { short: '1HLDS', long: '1H Home Last Digit Score' },
  1225: { short: '1ALDS', long: '1H Away Last Digit Score' },
  1226: { short: '2LDS', long: '2H Last Digit Score' },
  1227: { short: '2HLDS', long: '2H Home Last Digit Score' },
  1228: { short: '2ALDS', long: '2H Away Last Digit Score' },
  1229: { short: 'Q1LDS', long: 'Quarter 1 Last Digit Score' },
  1230: { short: 'Q2LDS', long: 'Quarter 2 Last Digit Score' },
  1231: { short: 'Q3LDS', long: 'Quarter 3 Last Digit Score' },
  1232: { short: 'Q4LDS', long: 'Quarter 4 Last Digit Score' },
  1233: { short: 'Q1HLDS', long: 'Quarter 1 Home Last Digit Score' },
  1234: { short: 'Q2HLDS', long: 'Quarter 2 Home Last Digit Score' },
  1235: { short: 'Q3HLDS', long: 'Quarter 3 Home Last Digit Score' },
  1236: { short: 'Q4HLDS', long: 'Quarter 4 Home Last Digit Score' },
  1237: { short: 'Q1ALDS', long: 'Quarter 1 Away Last Digit Score' },
  1238: { short: 'Q2ALDS', long: 'Quarter 2 Away Last Digit Score' },
  1239: { short: 'Q3ALDS', long: 'Quarter 3 Away Last Digit Score' },
  1240: { short: 'Q4ALDS', long: 'Quarter 4 Away Last Digit Score' },
  1241: { short: 'Q1AH', long: 'Quarter 1 Handicap' },
  1242: { short: 'Q2AH', long: 'Quarter 2 Handicap' },
  1243: { short: 'Q3AH', long: 'Quarter 3 Handicap' },
  1244: { short: 'Q4AH', long: 'Quarter 4 Handicap' },
  1245: { short: 'Q1OU', long: 'Quarter 1 Over/Under' },
  1246: { short: 'Q2OU', long: 'Quarter 2 Over/Under' },
  1247: { short: 'Q3OU', long: 'Quarter 3 Over/Under' },
  1248: { short: 'Q4OU', long: 'Quarter 4 Over/Under' },
  1249: { short: 'Q1OE', long: 'Quarter 1 Odd/Even' },
  1250: { short: 'Q2OE', long: 'Quarter 2 Odd/Even' },
  1251: { short: 'Q3OE', long: 'Quarter 3 Odd/Even' },
  1252: { short: 'Q4OE', long: 'Quarter 4 Odd/Even' },
  1253: { short: 'Q1ML', long: 'Quarter 1 Money Line' },
  1254: { short: 'Q2ML', long: 'Quarter 2 Money Line' },
  1255: { short: 'Q3ML', long: 'Quarter 3 Money Line' },
  1256: { short: 'Q4ML', long: 'Quarter 4 Money Line' },
  1257: { short: 'Q1WM7', long: 'Quarter 1 Winning Margin 7 Way' },
  1258: { short: 'Q2WM7', long: 'Quarter 2 Winning Margin 7 Way' },
  1259: { short: 'Q3WM7', long: 'Quarter 3 Winning Margin 7 Way' },
  1260: { short: 'Q4WM7', long: 'Quarter 4 Winning Margin 7 Way' },
  1261: { short: 'Q1RT10', long: 'Quarter 1 Race to 10' },
  1262: { short: 'Q2RT10', long: 'Quarter 2 Race to 10' },
  1263: { short: 'Q3RT10', long: 'Quarter 3 Race to 10' },
  1264: { short: 'Q4RT10', long: 'Quarter 4 Race to 10' },
  1265: { short: 'Q1RT15', long: 'Quarter 1 Race to 15' },
  1266: { short: 'Q2RT15', long: 'Quarter 2 Race to 15' },
  1267: { short: 'Q3RT15', long: 'Quarter 3 Race to 15' },
  1268: { short: 'Q4RT15', long: 'Quarter 4 Race to 15' },
  1269: { short: 'Q1RT20', long: 'Quarter 1 Race to 20' },
  1270: { short: 'Q2RT20', long: 'Quarter 2 Race to 20' },
  1271: { short: 'Q3RT20', long: 'Quarter 3 Race to 20' },
  1272: { short: 'Q4RT20', long: 'Quarter 4 Race to 20' },
  1273: { short: 'Q1RT25', long: 'Quarter 1 Race to 25' },
  1274: { short: 'Q2RT25', long: 'Quarter 2 Race to 25' },
  1275: { short: 'Q3RT25', long: 'Quarter 3 Race to 25' },
  1276: { short: 'Q4RT25', long: 'Quarter 4 Race to 25' },
  1277: { short: 'EQD', long: 'Exact Quarter Draw' },
  1278: { short: 'Q1Q2R', long: 'Quarter 1/Quarter 2 Result' },
  1279: { short: 'Q3Q4R', long: 'Quarter 3/Quarter 4 Result' },
  1280: { short: 'DQW', long: 'Double Quarter Winner' },
  1281: { short: 'WM14W', long: 'Winning Margin 14 Way' },
  1282: { short: 'HOU', long: 'Home Team Over/Under' },
  1283: { short: 'AOU', long: 'Away Team Over/Under' },
  1284: { short: 'HTHOU', long: 'First Half Home Team Over/Under' },
  1285: { short: 'HTAOU', long: 'First Half Away Team Over/Under' },
  1286: { short: 'Q1HOU', long: 'Quarter 1 Home Team Over/Under' },
  1287: { short: 'Q1AOU', long: 'Quarter 1 Away Team Over/Under' },
  1288: { short: 'Q2HOU', long: 'Quarter 2 Home Team Over/Under' },
  1289: { short: 'Q2AOU', long: 'Quarter 2 Away Team Over/Under' },
  1290: { short: 'Q3HOU', long: 'Quarter 3 Home Team Over/Under' },
  1291: { short: 'Q3AOU', long: 'Quarter 3 Away Team Over/Under' },
  1292: { short: 'Q4HOU', long: 'Quarter 4 Home Team Over/Under' },
  1293: { short: 'Q4AOU', long: 'Quarter 4 Away Team Over/Under' },
  // #endregion

  3000: { short: 'MCH PAR', long: 'Bet Builder' },
  77: { short: 'VS', long: 'Virtual Sport' },
  4000: { short: 'LOT', long: 'Lottery' },
  5000: { short: 'BTI', long: 'BTI' },
}

export const getGameTypeDescriptionShort = game_type => {
  const gameType = gameTypeDescription[game_type]
  return <span title={gameType?.long}>{gameType?.short}</span>
}

export const ListChoiceBasketByGameType = game_type => {
  switch (game_type) {
    case 1215:
      return '1HH25,1HA25'.split(',')
    case 1216:
      return '1HH30,1HA30'.split(',')
    case 1217:
      return '1HH35,1HA35'.split(',')
    case 1218:
      return '2HH25,2HA25'.split(',')
    case 1219:
      return '2HH30,2HA30'.split(',')
    case 1220:
      return '2HH35,2HA35'.split(',')
    case 1221:
      return '12HH,12HD,12HA,12DH,12DA,12AH,12AD,12AA'.split(',')
    case 1222:
      return '13H01,13H06,13H11,13H16,13H21,13H26,13A01,13A06,13A11,13A16,13A21,13A26,13WMD'.split(',') // prettier-ignore
    case 1223:
      return '1LD1,1LD2,1LD3,1LD4,1LD5,1LD6,1LD7,1LD8,1LD9,1LD0'.split(',')
    case 1224:
      return '1HLD1,1HLD2,1HLD3,1HLD4,1HLD5,1HLD6,1HLD7,1HLD8,1HLD9,1HLD0'.split(',')
    case 1225:
      return '1ALD1,1ALD2,1ALD3,1ALD4,1ALD5,1ALD6,1ALD7,1ALD8,1ALD9,1ALD0'.split(',')
    case 1226:
      return '2LD1,2LD2,2LD3,2LD4,2LD5,2LD6,2LD7,2LD8,2LD9,2LD0'.split(',')
    case 1227:
      return '2HLD1,2HLD2,2HLD3,2HLD4,2HLD5,2HLD6,2HLD7,2HLD8,2HLD9,2HLD0'.split(',')
    case 1228:
      return '2ALD1,2ALD2,2ALD3,2ALD4,2ALD5,2ALD6,2ALD7,2ALD8,2ALD9,2ALD0'.split(',')
    case 1284:
      return '1HO,1HU'.split(',')
    case 1285:
      return '1AO,1AU'.split(',')
    // FT
    case 1201:
      return 'SFBH,SFBA'.split(',')
    case 1202:
      return 'SLBH,SLBA'.split(',')
    case 1203:
      return '12H01,12H06,12H11,12H16,12H21,12H26,12A01,12A06,12A11,12A16,12A21,12A26'.split(',')
    case 1204:
      return 'LD1,LD2,LD3,LD4,LD5,LD6,LD7,LD8,LD9,LD0'.split(',')
    case 1205:
      return 'HLD1,HLD2,HLD3,HLD4,HLD5,HLD6,HLD7,HLD8,HLD9,HLD0'.split(',')
    case 1206:
      return 'ALD1,ALD2,ALD3,ALD4,ALD5,ALD6,ALD7,ALD8,ALD9,ALD0'.split(',')
    case 1281:
      return '14H01,14H03,14H07,14H10,14H14,14H17,14H21,14A01,14A03,14A07,14A10,14A14,14A17,14A21'.split(',') // prettier-ignore
    case 1282:
      return '2HO,2HU'.split(',')
    case 1283:
      return '2AO,2AU'.split(',')
    // Quarter
    case 1229:
      return 'Q1LD1,Q1LD2,Q1LD3,Q1LD4,Q1LD5,Q1LD6,Q1LD7,Q1LD8,Q1LD9,Q1LD0'.split(',')
    case 1230:
      return 'Q2LD1,Q2LD2,Q2LD3,Q2LD4,Q2LD5,Q2LD6,Q2LD7,Q2LD8,Q2LD9,Q2LD0'.split(',')
    case 1231:
      return 'Q3LD1,Q3LD2,Q3LD3,Q3LD4,Q3LD5,Q3LD6,Q3LD7,Q3LD8,Q3LD9,Q3LD0'.split(',')
    case 1232:
      return 'Q4LD1,Q4LD2,Q4LD3,Q4LD4,Q4LD5,Q4LD6,Q4LD7,Q4LD8,Q4LD9,Q4LD0'.split(',')
    case 1233:
      return 'Q1HD1,Q1HD2,Q1HD3,Q1HD4,Q1HD5,Q1HD6,Q1HD7,Q1HD8,Q1HD9,Q1HD0'.split(',')
    case 1234:
      return 'Q2HD1,Q2HD2,Q2HD3,Q2HD4,Q2HD5,Q2HD6,Q2HD7,Q2HD8,Q2HD9,Q2HD0'.split(',')
    case 1235:
      return 'Q3HD1,Q3HD2,Q3HD3,Q3HD4,Q3HD5,Q3HD6,Q3HD7,Q3HD8,Q3HD9,Q3HD0'.split(',')
    case 1236:
      return 'Q4HD1,Q4HD2,Q4HD3,Q4HD4,Q4HD5,Q4HD6,Q4HD7,Q4HD8,Q4HD9,Q4HD0'.split(',')
    case 1237:
      return 'Q1AD1,Q1AD2,Q1AD3,Q1AD4,Q1AD5,Q1AD6,Q1AD7,Q1AD8,Q1AD9,Q1AD0'.split(',')
    case 1238:
      return 'Q2AD1,Q2AD2,Q2AD3,Q2AD4,Q2AD5,Q2AD6,Q2AD7,Q2AD8,Q2AD9,Q2AD0'.split(',')
    case 1239:
      return 'Q3AD1,Q3AD2,Q3AD3,Q3AD4,Q3AD5,Q3AD6,Q3AD7,Q3AD8,Q3AD9,Q3AD0'.split(',')
    case 1240:
      return 'Q4AD1,Q4AD2,Q4AD3,Q4AD4,Q4AD5,Q4AD6,Q4AD7,Q4AD8,Q4AD9,Q4AD0'.split(',')
    case 1241:
      return 'Q1H,Q1A'.split(',')
    case 1242:
      return 'Q2H,Q2A'.split(',')
    case 1243:
      return 'Q3H,Q3A'.split(',')
    case 1244:
      return 'Q4H,Q4A'.split(',')
    case 1245:
      return 'Q1O,Q1U'.split(',')
    case 1246:
      return 'Q2O,Q2U'.split(',')
    case 1247:
      return 'Q3O,Q3U'.split(',')
    case 1248:
      return 'Q4O,Q4U'.split(',')
    case 1249:
      return 'Q1OE1,Q1OE2'.split(',')
    case 1250:
      return 'Q2OE1,Q2OE2'.split(',')
    case 1251:
      return 'Q3OE1,Q3OE2'.split(',')
    case 1252:
      return 'Q4OE1,Q4OE2'.split(',')
    case 1253:
      return 'Q1ML1,Q1ML2'.split(',')
    case 1254:
      return 'Q2ML1,Q2ML2'.split(',')
    case 1255:
      return 'Q3ML1,Q3ML2'.split(',')
    case 1256:
      return 'Q4ML1,Q4ML2'.split(',')
    case 1257:
      return 'Q1HW1,Q1HW5,Q1HW9,Q1AW1,Q1AW5,Q1AW9,Q1WMD'.split(',')
    case 1258:
      return 'Q2HW1,Q2HW5,Q2HW9,Q2AW1,Q2AW5,Q2AW9,Q2WMD'.split(',')
    case 1259:
      return 'Q3HW1,Q3HW5,Q3HW9,Q3AW1,Q3AW5,Q3AW9,Q3WMD'.split(',')
    case 1260:
      return 'Q4HW1,Q4HW5,Q4HW9,Q4AW1,Q4AW5,Q4AW9,Q4WMD'.split(',')
    case 1261:
      return 'Q1H10,Q1A10'.split(',')
    case 1262:
      return 'Q2H10,Q2A10'.split(',')
    case 1263:
      return 'Q3H10,Q3A10'.split(',')
    case 1264:
      return 'Q4H10,Q4A10'.split(',')
    case 1265:
      return 'Q1H15,Q1A15'.split(',')
    case 1266:
      return 'Q2H15,Q2A15'.split(',')
    case 1267:
      return 'Q3H15,Q3A15'.split(',')
    case 1268:
      return 'Q4H15,Q4A15'.split(',')
    case 1269:
      return 'Q1H20,Q1A20'.split(',')
    case 1270:
      return 'Q2H20,Q2A20'.split(',')
    case 1271:
      return 'Q3H20,Q3A20'.split(',')
    case 1272:
      return 'Q4H20,Q4A20'.split(',')
    case 1273:
      return 'Q1H25,Q1A25'.split(',')
    case 1274:
      return 'Q2H25,Q2A25'.split(',')
    case 1275:
      return 'Q3H25,Q3A25'.split(',')
    case 1276:
      return 'Q4H25,Q4A25'.split(',')
    case 1277:
      return 'EQD0,EQD1'.split(',')
    case 1278:
      return 'Q12HH,Q12HD,Q12HA,Q12DH,Q12DD,Q12DA,Q12AH,Q12AD,Q12AA'.split(',')
    case 1279:
      return 'Q34HH,Q34HD,Q34HA,Q34DH,Q34DD,Q34DA,Q34AH,Q34AD,Q34AA'.split(',')
    case 1280:
      return 'QWH12,QWA12,QWO12,QWH13,QWA13,QWO13,QWH14,QWA14,QWO14,QWH23,QWA23,QWO23,QWH24,QWA24,QWO24,QWH34,QWA34,QWO34'.split(',') // prettier-ignore
    case 1286:
      return 'Q1HO,Q1HU'.split(',')
    case 1287:
      return 'Q1AO,Q1AU'.split(',')
    case 1288:
      return 'Q2HO,Q2HU'.split(',')
    case 1289:
      return 'Q2AO,Q2AU'.split(',')
    case 1290:
      return 'Q3HO,Q3HU'.split(',')
    case 1291:
      return 'Q3AO,Q3AU'.split(',')
    case 1292:
      return 'Q4HO,Q4HU'.split(',')
    case 1293:
      return 'Q4AO,Q4AU'.split(',')
    case 1208:
      return 'HQWN,AQWN'.split(',')
    case 1209:
      return 'HQWB,AQWB'.split(',')
    case 1210:
      return 'HQWH,AQWH'.split(',')
    case 1211:
      return 'HQWO,HQWU'.split(',')
    case 1212:
      return 'AQWO,AQWU'.split(',')
    case 1213:
      return 'QCS21,QCS30,QCS31,QCS40,QCS22,QCS12,QCS03,QCS13,QCS04,QCSOS'.split(',')
    case 1214:
      return 'OOOO,OOOE,OOEO,OEOO,EOOO,EEEE,EEEO,EEOE,EOEE,OEEE,OOEE,OEOE,EOEO,EEOO,EOOE,OEEO'.split(',') // prettier-ignore
    default:
      return null
  }
}

export const GetGameTypeShortNameByIDForParlay = (game_type, parlayComboTicket) => {
  if (game_type === -1 && parlayComboTicket > 1) return 'COM'
  return gameTypeDescription[game_type].short
}

export default listGT
