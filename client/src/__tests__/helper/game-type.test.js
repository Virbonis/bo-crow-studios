import React from 'react'
import {
  GetGameTypeShortNameByIDForParlay,
  ListChoiceBasketByGameType,
  getGameTypeDescriptionShort,
} from 'helper'

describe('game-type', () => {
  describe('ListChoiceBasketByGameType', () => {
    test('GameType is 1215', () => expect(ListChoiceBasketByGameType(1215)).toEqual(['1HH25','1HA25'])) // prettier-ignore
    test('GameType is 1216', () => expect(ListChoiceBasketByGameType(1216)).toEqual(['1HH30','1HA30'])) // prettier-ignore
    test('GameType is 1217', () => expect(ListChoiceBasketByGameType(1217)).toEqual(['1HH35','1HA35'])) // prettier-ignore
    test('GameType is 1218', () => expect(ListChoiceBasketByGameType(1218)).toEqual(['2HH25','2HA25'])) // prettier-ignore
    test('GameType is 1219', () => expect(ListChoiceBasketByGameType(1219)).toEqual(['2HH30','2HA30'])) // prettier-ignore
    test('GameType is 1220', () => expect(ListChoiceBasketByGameType(1220)).toEqual(['2HH35','2HA35'])) // prettier-ignore
    test('GameType is 1221', () => expect(ListChoiceBasketByGameType(1221)).toEqual(['12HH','12HD','12HA','12DH','12DA','12AH','12AD','12AA'])) // prettier-ignore
    test('GameType is 1222', () => expect(ListChoiceBasketByGameType(1222)).toEqual(['13H01','13H06','13H11','13H16','13H21','13H26','13A01','13A06','13A11','13A16','13A21','13A26','13WMD'])) // prettier-ignore
    test('GameType is 1223', () => expect(ListChoiceBasketByGameType(1223)).toEqual(['1LD1','1LD2','1LD3','1LD4','1LD5','1LD6','1LD7','1LD8','1LD9','1LD0'])) // prettier-ignore
    test('GameType is 1224', () => expect(ListChoiceBasketByGameType(1224)).toEqual(['1HLD1','1HLD2','1HLD3','1HLD4','1HLD5','1HLD6','1HLD7','1HLD8','1HLD9','1HLD0'])) // prettier-ignore
    test('GameType is 1225', () => expect(ListChoiceBasketByGameType(1225)).toEqual(['1ALD1','1ALD2','1ALD3','1ALD4','1ALD5','1ALD6','1ALD7','1ALD8','1ALD9','1ALD0'])) // prettier-ignore
    test('GameType is 1226', () => expect(ListChoiceBasketByGameType(1226)).toEqual(['2LD1','2LD2','2LD3','2LD4','2LD5','2LD6','2LD7','2LD8','2LD9','2LD0'])) // prettier-ignore
    test('GameType is 1227', () => expect(ListChoiceBasketByGameType(1227)).toEqual(['2HLD1','2HLD2','2HLD3','2HLD4','2HLD5','2HLD6','2HLD7','2HLD8','2HLD9','2HLD0'])) // prettier-ignore
    test('GameType is 1228', () => expect(ListChoiceBasketByGameType(1228)).toEqual(['2ALD1','2ALD2','2ALD3','2ALD4','2ALD5','2ALD6','2ALD7','2ALD8','2ALD9','2ALD0'])) // prettier-ignore
    test('GameType is 1284', () => expect(ListChoiceBasketByGameType(1284)).toEqual(['1HO','1HU'])) // prettier-ignore
    test('GameType is 1285', () => expect(ListChoiceBasketByGameType(1285)).toEqual(['1AO','1AU'])) // prettier-ignore
    test('GameType is 1201', () => expect(ListChoiceBasketByGameType(1201)).toEqual(['SFBH','SFBA'])) // prettier-ignore
    test('GameType is 1202', () => expect(ListChoiceBasketByGameType(1202)).toEqual(['SLBH','SLBA'])) // prettier-ignore
    test('GameType is 1203', () => expect(ListChoiceBasketByGameType(1203)).toEqual(['12H01','12H06','12H11','12H16','12H21','12H26','12A01','12A06','12A11','12A16','12A21','12A26'])) // prettier-ignore
    test('GameType is 1204', () => expect(ListChoiceBasketByGameType(1204)).toEqual(['LD1','LD2','LD3','LD4','LD5','LD6','LD7','LD8','LD9','LD0'])) // prettier-ignore
    test('GameType is 1205', () => expect(ListChoiceBasketByGameType(1205)).toEqual(['HLD1','HLD2','HLD3','HLD4','HLD5','HLD6','HLD7','HLD8','HLD9','HLD0'])) // prettier-ignore
    test('GameType is 1206', () => expect(ListChoiceBasketByGameType(1206)).toEqual(['ALD1','ALD2','ALD3','ALD4','ALD5','ALD6','ALD7','ALD8','ALD9','ALD0'])) // prettier-ignore
    test('GameType is 1281', () => expect(ListChoiceBasketByGameType(1281)).toEqual(['14H01','14H03','14H07','14H10','14H14','14H17','14H21','14A01','14A03','14A07','14A10','14A14','14A17','14A21'])) // prettier-ignore
    test('GameType is 1282', () => expect(ListChoiceBasketByGameType(1282)).toEqual(['2HO','2HU'])) // prettier-ignore
    test('GameType is 1283', () => expect(ListChoiceBasketByGameType(1283)).toEqual(['2AO','2AU'])) // prettier-ignore
    test('GameType is 1229', () => expect(ListChoiceBasketByGameType(1229)).toEqual(['Q1LD1',"Q1LD2",'Q1LD3','Q1LD4','Q1LD5','Q1LD6','Q1LD7','Q1LD8','Q1LD9','Q1LD0'])) // prettier-ignore
    test('GameType is 1230', () => expect(ListChoiceBasketByGameType(1230)).toEqual(['Q2LD1',"Q2LD2",'Q2LD3','Q2LD4','Q2LD5','Q2LD6','Q2LD7','Q2LD8','Q2LD9','Q2LD0'])) // prettier-ignore
    test('GameType is 1231', () => expect(ListChoiceBasketByGameType(1231)).toEqual(['Q3LD1',"Q3LD2",'Q3LD3','Q3LD4','Q3LD5','Q3LD6','Q3LD7','Q3LD8','Q3LD9','Q3LD0'])) // prettier-ignore
    test('GameType is 1232', () => expect(ListChoiceBasketByGameType(1232)).toEqual(['Q4LD1',"Q4LD2",'Q4LD3','Q4LD4','Q4LD5','Q4LD6','Q4LD7','Q4LD8','Q4LD9','Q4LD0'])) // prettier-ignore
    test('GameType is 1233', () => expect(ListChoiceBasketByGameType(1233)).toEqual(['Q1HD1',"Q1HD2",'Q1HD3','Q1HD4','Q1HD5','Q1HD6','Q1HD7','Q1HD8','Q1HD9','Q1HD0'])) // prettier-ignore
    test('GameType is 1234', () => expect(ListChoiceBasketByGameType(1234)).toEqual(['Q2HD1',"Q2HD2",'Q2HD3','Q2HD4','Q2HD5','Q2HD6','Q2HD7','Q2HD8','Q2HD9','Q2HD0'])) // prettier-ignore
    test('GameType is 1235', () => expect(ListChoiceBasketByGameType(1235)).toEqual(['Q3HD1',"Q3HD2",'Q3HD3','Q3HD4','Q3HD5','Q3HD6','Q3HD7','Q3HD8','Q3HD9','Q3HD0'])) // prettier-ignore
    test('GameType is 1236', () => expect(ListChoiceBasketByGameType(1236)).toEqual(['Q4HD1',"Q4HD2",'Q4HD3','Q4HD4','Q4HD5','Q4HD6','Q4HD7','Q4HD8','Q4HD9','Q4HD0'])) // prettier-ignore
    test('GameType is 1237', () => expect(ListChoiceBasketByGameType(1237)).toEqual(['Q1AD1',"Q1AD2",'Q1AD3','Q1AD4','Q1AD5','Q1AD6','Q1AD7','Q1AD8','Q1AD9','Q1AD0'])) // prettier-ignore
    test('GameType is 1238', () => expect(ListChoiceBasketByGameType(1238)).toEqual(['Q2AD1',"Q2AD2",'Q2AD3','Q2AD4','Q2AD5','Q2AD6','Q2AD7','Q2AD8','Q2AD9','Q2AD0'])) // prettier-ignore
    test('GameType is 1239', () => expect(ListChoiceBasketByGameType(1239)).toEqual(['Q3AD1',"Q3AD2",'Q3AD3','Q3AD4','Q3AD5','Q3AD6','Q3AD7','Q3AD8','Q3AD9','Q3AD0'])) // prettier-ignore
    test('GameType is 1240', () => expect(ListChoiceBasketByGameType(1240)).toEqual(['Q4AD1',"Q4AD2",'Q4AD3','Q4AD4','Q4AD5','Q4AD6','Q4AD7','Q4AD8','Q4AD9','Q4AD0'])) // prettier-ignore
    test('GameType is 1241', () => expect(ListChoiceBasketByGameType(1241)).toEqual(['Q1H','Q1A'])) // prettier-ignore
    test('GameType is 1242', () => expect(ListChoiceBasketByGameType(1242)).toEqual(['Q2H','Q2A'])) // prettier-ignore
    test('GameType is 1243', () => expect(ListChoiceBasketByGameType(1243)).toEqual(['Q3H','Q3A'])) // prettier-ignore
    test('GameType is 1244', () => expect(ListChoiceBasketByGameType(1244)).toEqual(['Q4H','Q4A'])) // prettier-ignore
    test('GameType is 1245', () => expect(ListChoiceBasketByGameType(1245)).toEqual(['Q1O','Q1U'])) // prettier-ignore
    test('GameType is 1246', () => expect(ListChoiceBasketByGameType(1246)).toEqual(['Q2O','Q2U'])) // prettier-ignore
    test('GameType is 1247', () => expect(ListChoiceBasketByGameType(1247)).toEqual(['Q3O','Q3U'])) // prettier-ignore
    test('GameType is 1248', () => expect(ListChoiceBasketByGameType(1248)).toEqual(['Q4O','Q4U'])) // prettier-ignore
    test('GameType is 1249', () => expect(ListChoiceBasketByGameType(1249)).toEqual(['Q1OE1','Q1OE2'])) // prettier-ignore
    test('GameType is 1250', () => expect(ListChoiceBasketByGameType(1250)).toEqual(['Q2OE1','Q2OE2'])) // prettier-ignore
    test('GameType is 1251', () => expect(ListChoiceBasketByGameType(1251)).toEqual(['Q3OE1','Q3OE2'])) // prettier-ignore
    test('GameType is 1252', () => expect(ListChoiceBasketByGameType(1252)).toEqual(['Q4OE1','Q4OE2'])) // prettier-ignore
    test('GameType is 1253', () => expect(ListChoiceBasketByGameType(1253)).toEqual(['Q1ML1','Q1ML2'])) // prettier-ignore
    test('GameType is 1254', () => expect(ListChoiceBasketByGameType(1254)).toEqual(['Q2ML1','Q2ML2'])) // prettier-ignore
    test('GameType is 1255', () => expect(ListChoiceBasketByGameType(1255)).toEqual(['Q3ML1','Q3ML2'])) // prettier-ignore
    test('GameType is 1256', () => expect(ListChoiceBasketByGameType(1256)).toEqual(['Q4ML1','Q4ML2'])) // prettier-ignore
    test('GameType is 1257', () => expect(ListChoiceBasketByGameType(1257)).toEqual(['Q1HW1','Q1HW5','Q1HW9','Q1AW1','Q1AW5','Q1AW9','Q1WMD'])) // prettier-ignore
    test('GameType is 1258', () => expect(ListChoiceBasketByGameType(1258)).toEqual(['Q2HW1','Q2HW5','Q2HW9','Q2AW1','Q2AW5','Q2AW9','Q2WMD'])) // prettier-ignore
    test('GameType is 1259', () => expect(ListChoiceBasketByGameType(1259)).toEqual(['Q3HW1','Q3HW5','Q3HW9','Q3AW1','Q3AW5','Q3AW9','Q3WMD'])) // prettier-ignore
    test('GameType is 1260', () => expect(ListChoiceBasketByGameType(1260)).toEqual(['Q4HW1','Q4HW5','Q4HW9','Q4AW1','Q4AW5','Q4AW9','Q4WMD'])) // prettier-ignore
    test('GameType is 1261', () => expect(ListChoiceBasketByGameType(1261)).toEqual(['Q1H10','Q1A10'])) // prettier-ignore
    test('GameType is 1262', () => expect(ListChoiceBasketByGameType(1262)).toEqual(['Q2H10','Q2A10'])) // prettier-ignore
    test('GameType is 1263', () => expect(ListChoiceBasketByGameType(1263)).toEqual(['Q3H10','Q3A10'])) // prettier-ignore
    test('GameType is 1264', () => expect(ListChoiceBasketByGameType(1264)).toEqual(['Q4H10','Q4A10'])) // prettier-ignore
    test('GameType is 1265', () => expect(ListChoiceBasketByGameType(1265)).toEqual(['Q1H15','Q1A15'])) // prettier-ignore
    test('GameType is 1266', () => expect(ListChoiceBasketByGameType(1266)).toEqual(['Q2H15','Q2A15'])) // prettier-ignore
    test('GameType is 1267', () => expect(ListChoiceBasketByGameType(1267)).toEqual(['Q3H15','Q3A15'])) // prettier-ignore
    test('GameType is 1268', () => expect(ListChoiceBasketByGameType(1268)).toEqual(['Q4H15','Q4A15'])) // prettier-ignore
    test('GameType is 1269', () => expect(ListChoiceBasketByGameType(1269)).toEqual(['Q1H20','Q1A20'])) // prettier-ignore
    test('GameType is 1270', () => expect(ListChoiceBasketByGameType(1270)).toEqual(['Q2H20','Q2A20'])) // prettier-ignore
    test('GameType is 1271', () => expect(ListChoiceBasketByGameType(1271)).toEqual(['Q3H20','Q3A20'])) // prettier-ignore
    test('GameType is 1272', () => expect(ListChoiceBasketByGameType(1272)).toEqual(['Q4H20','Q4A20'])) // prettier-ignore
    test('GameType is 1273', () => expect(ListChoiceBasketByGameType(1273)).toEqual(['Q1H25','Q1A25'])) // prettier-ignore
    test('GameType is 1274', () => expect(ListChoiceBasketByGameType(1274)).toEqual(['Q2H25','Q2A25'])) // prettier-ignore
    test('GameType is 1275', () => expect(ListChoiceBasketByGameType(1275)).toEqual(['Q3H25','Q3A25'])) // prettier-ignore
    test('GameType is 1276', () => expect(ListChoiceBasketByGameType(1276)).toEqual(['Q4H25','Q4A25'])) // prettier-ignore
    test('GameType is 1277', () => expect(ListChoiceBasketByGameType(1277)).toEqual(['EQD0','EQD1'])) // prettier-ignore
    test('GameType is 1278', () => expect(ListChoiceBasketByGameType(1278)).toEqual(['Q12HH','Q12HD','Q12HA','Q12DH','Q12DD','Q12DA','Q12AH','Q12AD','Q12AA'])) // prettier-ignore
    test('GameType is 1279', () => expect(ListChoiceBasketByGameType(1279)).toEqual(['Q34HH','Q34HD','Q34HA','Q34DH','Q34DD','Q34DA','Q34AH','Q34AD','Q34AA'])) // prettier-ignore
    test('GameType is 1280', () => expect(ListChoiceBasketByGameType(1280)).toEqual(['QWH12','QWA12','QWO12','QWH13','QWA13','QWO13','QWH14','QWA14','QWO14','QWH23','QWA23','QWO23','QWH24','QWA24','QWO24','QWH34','QWA34','QWO34'])) // prettier-ignore
    test('GameType is 1286', () => expect(ListChoiceBasketByGameType(1286)).toEqual(['Q1HO','Q1HU'])) // prettier-ignore
    test('GameType is 1287', () => expect(ListChoiceBasketByGameType(1287)).toEqual(['Q1AO','Q1AU'])) // prettier-ignore
    test('GameType is 1288', () => expect(ListChoiceBasketByGameType(1288)).toEqual(['Q2HO','Q2HU'])) // prettier-ignore
    test('GameType is 1289', () => expect(ListChoiceBasketByGameType(1289)).toEqual(['Q2AO','Q2AU'])) // prettier-ignore
    test('GameType is 1290', () => expect(ListChoiceBasketByGameType(1290)).toEqual(['Q3HO','Q3HU'])) // prettier-ignore
    test('GameType is 1291', () => expect(ListChoiceBasketByGameType(1291)).toEqual(['Q3AO','Q3AU'])) // prettier-ignore
    test('GameType is 1292', () => expect(ListChoiceBasketByGameType(1292)).toEqual(['Q4HO','Q4HU'])) // prettier-ignore
    test('GameType is 1293', () => expect(ListChoiceBasketByGameType(1293)).toEqual(['Q4AO','Q4AU'])) // prettier-ignore
    test('GameType is 1208', () => expect(ListChoiceBasketByGameType(1208)).toEqual(['HQWN','AQWN'])) // prettier-ignore
    test('GameType is 1209', () => expect(ListChoiceBasketByGameType(1209)).toEqual(['HQWB','AQWB'])) // prettier-ignore
    test('GameType is 1210', () => expect(ListChoiceBasketByGameType(1210)).toEqual(['HQWH','AQWH'])) // prettier-ignore
    test('GameType is 1211', () => expect(ListChoiceBasketByGameType(1211)).toEqual(['HQWO','HQWU'])) // prettier-ignore
    test('GameType is 1212', () => expect(ListChoiceBasketByGameType(1212)).toEqual(['AQWO','AQWU'])) // prettier-ignore
    test('GameType is 1213', () => expect(ListChoiceBasketByGameType(1213)).toEqual(['QCS21','QCS30','QCS31','QCS40','QCS22','QCS12','QCS03','QCS13','QCS04','QCSOS'])) // prettier-ignore
    test('GameType is 1214', () => expect(ListChoiceBasketByGameType(1214)).toEqual(['OOOO','OOOE','OOEO','OEOO','EOOO','EEEE','EEEO','EEOE','EOEE','OEEE','OOEE','OEOE','EOEO','EEOO','EOOE','OEEO'])) // prettier-ignore
    test('GameType is 0', () => expect(ListChoiceBasketByGameType(0)).toBeNull())
  })

  describe('GetGameTypeDescriptionShort', () => {
    test('Render', () =>
      expect(getGameTypeDescriptionShort(0)).toEqual(<span title="Handicap">HDP</span>))
  })

  describe('GetGameTypeShortNameByIDForParlay', () => {
    test('GameType is Mix Parlay AND ParlayComboTicket is more than 1', () =>
      expect(GetGameTypeShortNameByIDForParlay(-1, 3)).toBe('COM'))
    test('GameType is not Mix Parlay AND ParlayComboTicket is not more than 1', () =>
      expect(GetGameTypeShortNameByIDForParlay(0, 0)).toBe('HDP'))
  })
})
