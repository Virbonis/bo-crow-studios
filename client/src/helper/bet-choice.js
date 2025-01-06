import { choiceOptions } from 'helper'

const arrChoice_Home_Basket = 'HQWH,Q1H,Q2H,Q3H,Q4H,Q1ML1,Q2ML1,Q3ML1,Q4ML1'.split(',') // prettier-ignore
const arrChoice_Home = '1H,2H,11,21,ME1,1ME1,ML1,1ML1,NC1,NG1,GH1,S1G1,S2G1,S3G1,S4G1,S5G1,S1W1,S2W1,S3W1,S4W1,S5W1,3WHH'.split(',').concat(arrChoice_Home_Basket) // prettier-ignore
const arrChoice_Away_Basket = 'AQWH,Q1A,Q2A,Q3A,Q4A,Q1ML2,Q2ML2,Q3ML2,Q4ML2'.split(',') // prettier-ignore
const arrChoice_Away = '1A,2A,12,22,ME2,1ME2,ML2,1ML2,NC2,NG2,GH2,S1G2,S2G2,S3G2,S4G2,S5G2,S1W2,S2W2,S3W2,S4W2,S5W2,3WHA'.split(',').concat(arrChoice_Away_Basket) // prettier-ignore
const arrChoice_Draw = '1X,2X,3WHD'.split(',')

const arrChoice_Over_Basket = 'HQWO,AQWO,2HO,2AO,1HO,1AO,Q1HO,Q1AO,Q2HO,Q2AO,Q3HO,Q3AO,Q4HO,Q4AO,Q1O,Q2O,Q3O,Q4O'.split(',') // prettier-ignore
const arrChoice_Over = '1O,2O,GOU1,S1O1,S2O1,S3O1,S4O1,S5O1'.split(',').concat(arrChoice_Over_Basket) // prettier-ignore
const arrChoice_Under_Basket = 'HQWU,AQWU,Q1U,Q2U,Q3U,Q4U,2HU,2AU,1HU,1AU,Q1HU,Q1AU,Q2HU,Q2AU,Q3HU,Q3AU,Q4HU,Q4AU'.split(',') // prettier-ignore
const arrChoice_Under = '1U,2U,GOU2,S1O2,S2O2,S3O2,S4O2,S5O2'.split(',').concat(arrChoice_Under_Basket) // prettier-ignore
const arrChoice_Odd_Basket = 'Q1OE1,Q2OE1,Q3OE1,Q4OE1'.split(',') // prettier-ignore
const arrChoice_Odd = 'OE1,1OE1,GOE1,S1OE1,S2OE1,S3OE1,S4OE1,S5OE1'.split(',').concat(arrChoice_Odd_Basket) // prettier-ignore
const arrChoice_Even_Basket = 'Q1OE2,Q2OE2,Q3OE2,Q4OE2'.split(',') // prettier-ignore
const arrChoice_Even = 'OE2,1OE2,GOE2,S1OE2,S2OE2,S3OE2,S4OE2,S5OE2'.split(',').concat(arrChoice_Even_Basket) // prettier-ignore

export const getShortBetChoice = betChoice => {
  if (arrChoice_Home.includes(betChoice)) return 'H'
  if (arrChoice_Away.includes(betChoice)) return 'A'
  if (arrChoice_Draw.includes(betChoice)) return 'X'
  if (arrChoice_Over.includes(betChoice)) return 'O'
  if (arrChoice_Under.includes(betChoice)) return 'U'
  if (arrChoice_Odd.includes(betChoice)) return 'O'
  if (arrChoice_Even.includes(betChoice)) return 'E'

  switch (betChoice) {
    case 'NOG':
      return 'NG'
    case 'FG1':
      return 'FG.H'
    case 'FG2':
      return 'FG.A'
    case 'LG1':
      return 'LG.H'
    case 'LG2':
      return 'LG.A'

    case '1T01':
    case 'TG01':
      return '0-1'
    case '1T23':
    case 'TG23':
      return '2-3'
    case 'TG46':
      return '4-6'
    case '1T4':
      return '>=4'
    case 'TG7':
      return '>=7'

    default:
      return betChoice
  }
}

export const getBetChoice = (betChoice, homeName = '', awayName = '') => {
  if (arrChoice_Home.includes(betChoice)) return `(H)${homeName}`
  if (arrChoice_Away.includes(betChoice)) return `(A)${awayName}`
  if (arrChoice_Draw.includes(betChoice)) return 'Draw'
  if (arrChoice_Over.includes(betChoice)) return 'Over'
  if (arrChoice_Under.includes(betChoice)) return 'Under'
  if (arrChoice_Odd.includes(betChoice)) return 'Odd'
  if (arrChoice_Even.includes(betChoice)) return 'Even'

  switch (betChoice) {
    case 'DC12':
      return 'Home/Away (12)'
    case 'DC1X':
      return 'Home/Draw (1X)'
    case 'DCX2':
      return 'Draw/Away (X2)'

    case 'NOG':
      return 'No Goal'
    case 'FG1':
      return 'FG.H'
    case 'FG2':
      return 'FG.A'
    case 'LG1':
      return 'LG.H'
    case 'LG2':
      return 'LG.A'

    case 'TG01':
    case '1T01':
      return 'Total Goal (0-1)'
    case 'TG23':
    case '1T23':
      return 'Total Goal (2-3)'
    case 'TG46':
      return 'Total Goal (4-6)'
    case '1T4':
      return 'Total Goal >=4'
    case 'TG7':
      return 'Total Goal >=7'

    case 'CS00':
    case '1C00':
      return '(0:0)'
    case 'CS01':
    case '1C01':
      return '(0:1)'
    case 'CS02':
    case '1C02':
      return '(0:2)'
    case 'CS03':
    case '1C03':
      return '(0:3)'
    case 'CS04':
    case '1C04':
      return '(0:4)'
    case 'CS10':
    case '1C10':
      return '(1:0)'
    case 'CS11':
    case '1C11':
      return '(1:1)'
    case 'CS12':
    case '1C12':
      return '(1:2)'
    case 'CS13':
    case '1C13':
      return '(1:3)'
    case 'CS14':
    case '1C14':
      return '(1:4)'
    case 'CS20':
    case '1C20':
      return '(2:0)'
    case 'CS21':
    case '1C21':
      return '(2:1)'
    case 'CS22':
    case '1C22':
      return '(2:2)'
    case 'CS23':
    case '1C23':
      return '(2:3)'
    case 'CS24':
    case '1C24':
      return '(2:4)'
    case 'CS30':
    case '1C30':
      return '(3:0)'
    case 'CS31':
    case '1C31':
      return '(3:1)'
    case 'CS32':
    case '1C32':
      return '(3:2)'
    case 'CS33':
    case '1C33':
      return '(3:3)'
    case 'CS34':
    case '1C34':
      return '(3:4)'
    case 'CS40':
    case '1C40':
      return '(4:0)'
    case 'CS41':
    case '1C41':
      return '(4:1)'
    case 'CS42':
    case '1C42':
      return '(4:2)'
    case 'CS43':
    case '1C43':
      return '(4:3)'
    case 'CS44':
    case '1C44':
      return '(4:4)'
    case 'CS05':
    case '1C05':
      return 'Up5(A)'
    case 'CS50':
    case '1C50':
      return 'Up5(H)'
    case 'CS0S':
    case '1C0S':
      return 'AOS'
    case 'HH':
      return '(H/H)'
    case 'HA':
      return '(H/A)'
    case 'HD':
      return '(H/D)'
    case 'AH':
      return '(A/H)'
    case 'AA':
      return '(A/A)'
    case 'AD':
      return '(A/D)'
    case 'DH':
      return '(D/H)'
    case 'DA':
      return '(D/A)'
    case 'DD':
      return '(D/D)'
    case 'ANBH':
    case 'DNBH':
    case 'SBH':
      return 'Home Team'
    case 'DNBA':
    case 'HNBA':
    case 'SBA':
      return 'Away Team'
    case 'ANBD':
    case 'HNBD':
      return 'Draw'
    case '2BTN':
    case 'ASBN':
    case 'AWBN':
    case 'AWHN':
    case 'BTSN':
    case 'HSBN':
    case 'HWBN':
    case 'HWHN':
      return 'No'
    case '2BTY':
    case 'ASBY':
    case 'AWBY':
    case 'AWHY':
    case 'BTSY':
    case 'HSBY':
    case 'HWBY':
    case 'HWHY':
      return 'Yes'

    case 'HHA1':
    case 'HHH1':
    case 'HMC1':
    case 'HMG1':
      return '1st Half'
    case 'HHA2':
    case 'HHH2':
    case 'HMC2':
    case 'HMG2':
      return '2nd Half'
    case 'HHAX':
    case 'HHHX':
    case 'HMCX':
    case 'HMGX':
      return 'Draw'

    case 'R2GA':
    case 'R3GA':
    case 'WFB2':
    case 'WN2':
      return 'Away Team'
    case 'CSAY':
      return 'Away Yes'
    case 'CSAN':
      return 'Away No'
    case 'R2GH':
    case 'R3GH':
    case 'WFB1':
    case 'WN1':
      return 'Home Team'
    case 'CSHY':
      return 'Home Yes'
    case 'CSHN':
      return 'Home No'

    case 'PENN':
      return 'No'
    case 'PENY':
      return 'Yes'

    case 'FGM1':
      return 'Free Kick'
    case 'FGM2':
      return 'Header'
    case 'FGM3':
      return 'No Goal'
    case 'FGM4':
      return 'Own Goal'
    case 'FGM5':
      return 'Penalty'
    case 'FGM6':
      return 'Shot'
    case 'INJ1':
      return '1 minute'
    case 'INJ2':
      return '2 minute'
    case 'INJ3':
      return '3 minute'
    case 'INJ4':
      return '4 minute'
    case 'INJ5':
      return '5 minutes or More'
    case 'INJ0':
      return 'None'
    case 'T1G1':
      return '27th Minute Onwards'
    case 'T1G2':
      return 'Up To And Including The 26th Minute'
    case 'T1G3':
      return 'No Goal'
    case 'WMX':
      return 'Any Goal Score Draw'
    case 'WMH1':
      return 'Home Team To Win By 1 Goal'
    case 'WMH2':
      return 'Home Team To Win By 2 Goal'
    case 'WMH3':
      return 'Home Team To Win By 3 Goal'
    case 'WMH4':
      return 'Home Team To Win By 4 Goal'
    case 'WMA1':
      return 'Away Team To Win By 1 Goal'
    case 'WMA2':
      return 'Away Team To Win By 2 Goal'
    case 'WMA3':
      return 'Away Team To Win By 3 Goal'
    case 'WMA4':
      return 'Away Team To Win By 4 Goal'
    case 'WM0':
      return 'No Goal'

    // basket
    // HT
    case '1HH25':
    case '1HH30':
    case '1HH35':
    case '2HH25':
    case '2HH30':
    case '2HH35':
      return 'Home Team'
    case '1HA25':
    case '1HA30':
    case '1HA35':
    case '2HA25':
    case '2HA30':
    case '2HA35':
      return 'Away Team'
    case '12HH':
      return 'Home/Home'
    case '12HD':
      return 'Home/Draw'
    case '12HA':
      return 'Home/Away'
    case '12DH':
      return 'Draw/Home'
    case '12DA':
      return 'Draw/Away'
    case '12AH':
      return 'Away/Home'
    case '12AD':
      return 'Away/Draw'
    case '12AA':
      return 'Away/Away'
    case '13H01':
      return 'Home Win by 1-5'
    case '13H06':
      return 'Home Win by 6-10'
    case '13H11':
      return 'Home Win by 11-15'
    case '13H16':
      return 'Home Win by 16-20'
    case '13H21':
      return 'Home Win by 21-25'
    case '13H26':
      return 'Home Win by 26+'
    case '13A01':
      return 'Away Win by 1-5'
    case '13A06':
      return 'Away Win by 6-10'
    case '13A11':
      return 'Away Win by 11-15'
    case '13A16':
      return 'Away Win by 16-20'
    case '13A21':
      return 'Away Win by 21-25'
    case '13A26':
      return 'Away Win by +26'
    case '13WMD':
      return 'Draw'
    case '1LD1':
    case '1HLD1':
    case '1ALD1':
    case '2LD1':
    case '2HLD1':
    case '2ALD1':
      return '1'
    case '1LD2':
    case '1HLD2':
    case '1ALD2':
    case '2LD2':
    case '2HLD2':
    case '2ALD2':
      return '2'
    case '1LD3':
    case '1HLD3':
    case '1ALD3':
    case '2LD3':
    case '2HLD3':
    case '2ALD3':
      return '3'
    case '1LD4':
    case '1HLD4':
    case '1ALD4':
    case '2LD4':
    case '2HLD4':
    case '2ALD4':
      return '4'
    case '1LD5':
    case '1HLD5':
    case '1ALD5':
    case '2LD5':
    case '2HLD5':
    case '2ALD5':
      return '5'
    case '1LD6':
    case '1HLD6':
    case '1ALD6':
    case '2LD6':
    case '2HLD6':
    case '2ALD6':
      return '6'
    case '1LD7':
    case '1HLD7':
    case '1ALD7':
    case '2LD7':
    case '2HLD7':
    case '2ALD7':
      return '7'
    case '1LD8':
    case '1HLD8':
    case '1ALD8':
    case '2LD8':
    case '2HLD8':
    case '2ALD8':
      return '8'
    case '1LD9':
    case '1HLD9':
    case '1ALD9':
    case '2LD9':
    case '2HLD9':
    case '2ALD9':
      return '9'
    case '1LD0':
    case '1HLD0':
    case '1ALD0':
    case '2LD0':
    case '2HLD0':
    case '2ALD0':
      return '0'
    // case '1HO':
    //   return '1H Home Team Over'
    // case '1HU':
    //   return '1H Home Team Under'
    // case '1AO':
    //   return '1H Away Team Over'
    // case '1AU':
    //   return '1H Away Team Under'

    // FT
    case 'SFBH':
      return 'Home Team'
    case 'SFBA':
      return 'Away Team'
    case 'SLBH':
      return 'Home Team'
    case 'SLBA':
      return 'Away Team'
    case '12H01':
      return 'Home Win by 1-5'
    case '12H06':
      return 'Home Win by 6-10'
    case '12H11':
      return 'Home Win by 11-15'
    case '12H16':
      return 'Home Win by 16-20'
    case '12H21':
      return 'Home Win by 21-25'
    case '12H26':
      return 'Home Win by 26+'
    case '12A01':
      return 'Away Win by 1-5'
    case '12A06':
      return 'Away Win by 6-10'
    case '12A11':
      return 'Away Win by 11-15'
    case '12A16':
      return 'Away Win by 16-20'
    case '12A21':
      return 'Away Win by 21-25'
    case '12A26':
      return 'Away Win by +26'
    case 'LD1':
      return '1'
    case 'LD2':
      return '2'
    case 'LD3':
      return '3'
    case 'LD4':
      return '4'
    case 'LD5':
      return '5'
    case 'LD6':
      return '6'
    case 'LD7':
      return '7'
    case 'LD8':
      return '8'
    case 'LD9':
      return '9'
    case 'LD0':
      return '0'
    case 'HLD1':
      return '1'
    case 'HLD2':
      return '2'
    case 'HLD3':
      return '3'
    case 'HLD4':
      return '4'
    case 'HLD5':
      return '5'
    case 'HLD6':
      return '6'
    case 'HLD7':
      return '7'
    case 'HLD8':
      return '8'
    case 'HLD9':
      return '9'
    case 'HLD0':
      return '0'
    case 'ALD1':
      return '1'
    case 'ALD2':
      return '2'
    case 'ALD3':
      return '3'
    case 'ALD4':
      return '4'
    case 'ALD5':
      return '5'
    case 'ALD6':
      return '6'
    case 'ALD7':
      return '7'
    case 'ALD8':
      return '8'
    case 'ALD9':
      return '9'
    case 'ALD0':
      return '0'
    case '2H2O':
      return 'Home & Over'
    case '2H2U':
      return 'Home & Under'
    case '2A2O':
      return 'Away & Over'
    case '2A2U':
      return 'Away & Under'
    case '14H01':
      return 'Home Win By 1-2'
    case '14H03':
      return 'Home Win By 3-6'
    case '14H07':
      return 'Home Win By 7-9'
    case '14H10':
      return 'Home Win By 10-13'
    case '14H14':
      return 'Home Win By 14-16'
    case '14H17':
      return 'Home Win By 17-20'
    case '14H21':
      return 'Home Win By 21+'
    case '14A01':
      return 'Away Win By 1-2'
    case '14A03':
      return 'Away Win By 3-6'
    case '14A07':
      return 'Away Win By 7-9'
    case '14A10':
      return 'Away Win By 10-13'
    case '14A14':
      return 'Away Win By 14-16'
    case '14A17':
      return 'Away Win By 17-20'
    case '14A21':
      return 'Away Win By 21+'
    // case '2HO':
    //   return 'Home Team Over'
    // case '2HU':
    //   return 'Home Team Under'
    // case '2AO':
    //   return 'Away Team Over'
    // case '2AU':
    //   return 'Away Team Under'

    // Quarter
    case 'Q1LD1':
      return '1'
    case 'Q1LD2':
      return '2'
    case 'Q1LD3':
      return '3'
    case 'Q1LD4':
      return '4'
    case 'Q1LD5':
      return '5'
    case 'Q1LD6':
      return '6'
    case 'Q1LD7':
      return '7'
    case 'Q1LD8':
      return '8'
    case 'Q1LD9':
      return '9'
    case 'Q1LD0':
      return '0'
    case 'Q2LD1':
      return '1'
    case 'Q2LD2':
      return '2'
    case 'Q2LD3':
      return '3'
    case 'Q2LD4':
      return '4'
    case 'Q2LD5':
      return '5'
    case 'Q2LD6':
      return '6'
    case 'Q2LD7':
      return '7'
    case 'Q2LD8':
      return '8'
    case 'Q2LD9':
      return '9'
    case 'Q2LD0':
      return '0'
    case 'Q3LD1':
      return '1'
    case 'Q3LD2':
      return '2'
    case 'Q3LD3':
      return '3'
    case 'Q3LD4':
      return '4'
    case 'Q3LD5':
      return '5'
    case 'Q3LD6':
      return '6'
    case 'Q3LD7':
      return '7'
    case 'Q3LD8':
      return '8'
    case 'Q3LD9':
      return '9'
    case 'Q3LD0':
      return '0'
    case 'Q4LD1':
      return '1'
    case 'Q4LD2':
      return '2'
    case 'Q4LD3':
      return '3'
    case 'Q4LD4':
      return '4'
    case 'Q4LD5':
      return '5'
    case 'Q4LD6':
      return '6'
    case 'Q4LD7':
      return '7'
    case 'Q4LD8':
      return '8'
    case 'Q4LD9':
      return '9'
    case 'Q4LD0':
      return '0'
    case 'Q1HD1':
      return '1'
    case 'Q1HD2':
      return '2'
    case 'Q1HD3':
      return '3'
    case 'Q1HD4':
      return '4'
    case 'Q1HD5':
      return '5'
    case 'Q1HD6':
      return '6'
    case 'Q1HD7':
      return '7'
    case 'Q1HD8':
      return '8'
    case 'Q1HD9':
      return '9'
    case 'Q1HD0':
      return '0'
    case 'Q2HD1':
      return '1'
    case 'Q2HD2':
      return '2'
    case 'Q2HD3':
      return '3'
    case 'Q2HD4':
      return '4'
    case 'Q2HD5':
      return '5'
    case 'Q2HD6':
      return '6'
    case 'Q2HD7':
      return '7'
    case 'Q2HD8':
      return '8'
    case 'Q2HD9':
      return '9'
    case 'Q2HD0':
      return '0'
    case 'Q3HD1':
      return '1'
    case 'Q3HD2':
      return '2'
    case 'Q3HD3':
      return '3'
    case 'Q3HD4':
      return '4'
    case 'Q3HD5':
      return '5'
    case 'Q3HD6':
      return '6'
    case 'Q3HD7':
      return '7'
    case 'Q3HD8':
      return '8'
    case 'Q3HD9':
      return '9'
    case 'Q3HD0':
      return '0'
    case 'Q4HD1':
      return '1'
    case 'Q4HD2':
      return '2'
    case 'Q4HD3':
      return '3'
    case 'Q4HD4':
      return '4'
    case 'Q4HD5':
      return '5'
    case 'Q4HD6':
      return '6'
    case 'Q4HD7':
      return '7'
    case 'Q4HD8':
      return '8'
    case 'Q4HD9':
      return '9'
    case 'Q4HD0':
      return '0'
    case 'Q1AD1':
      return '1'
    case 'Q1AD2':
      return '2'
    case 'Q1AD3':
      return '3'
    case 'Q1AD4':
      return '4'
    case 'Q1AD5':
      return '5'
    case 'Q1AD6':
      return '6'
    case 'Q1AD7':
      return '7'
    case 'Q1AD8':
      return '8'
    case 'Q1AD9':
      return '9'
    case 'Q1AD0':
      return '0'
    case 'Q2AD1':
      return '1'
    case 'Q2AD2':
      return '2'
    case 'Q2AD3':
      return '3'
    case 'Q2AD4':
      return '4'
    case 'Q2AD5':
      return '5'
    case 'Q2AD6':
      return '6'
    case 'Q2AD7':
      return '7'
    case 'Q2AD8':
      return '8'
    case 'Q2AD9':
      return '9'
    case 'Q2AD0':
      return '0'
    case 'Q3AD1':
      return '1'
    case 'Q3AD2':
      return '2'
    case 'Q3AD3':
      return '3'
    case 'Q3AD4':
      return '4'
    case 'Q3AD5':
      return '5'
    case 'Q3AD6':
      return '6'
    case 'Q3AD7':
      return '7'
    case 'Q3AD8':
      return '8'
    case 'Q3AD9':
      return '9'
    case 'Q3AD0':
      return '0'
    case 'Q4AD1':
      return '1'
    case 'Q4AD2':
      return '2'
    case 'Q4AD3':
      return '3'
    case 'Q4AD4':
      return '4'
    case 'Q4AD5':
      return '5'
    case 'Q4AD6':
      return '6'
    case 'Q4AD7':
      return '7'
    case 'Q4AD8':
      return '8'
    case 'Q4AD9':
      return '9'
    case 'Q4AD0':
      return '0'
    // case 'Q1H':
    // return 'Home'
    // case 'Q1A':
    // return 'Away'
    // case 'Q2H':
    // return 'Home'
    // case 'Q2A':
    // return 'Away'
    // case 'Q3H':
    // return 'Home'
    // case 'Q3A':
    // return 'Away'
    // case 'Q4H':
    // return 'Home'
    // case 'Q4A':
    // return 'Away'
    // case 'Q1O':
    //   return 'Q1 Over'
    // case 'Q1U':
    //   return 'Q1 Under'
    // case 'Q2O':
    //   return 'Q2 Over'
    // case 'Q2U':
    //   return 'Q2 Under'
    // case 'Q3O':
    //   return 'Q3 Over'
    // case 'Q3U':
    //   return 'Q3 Under'
    // case 'Q4O':
    //   return 'Q4 Over'
    // case 'Q4U':
    //   return 'Q4 Under'
    // case 'Q1OE1':
    // return 'Odd'
    // case 'Q1OE2':
    // return 'Even'
    // case 'Q2OE1':
    // return 'Odd'
    // case 'Q2OE2':
    // return 'Even'
    // case 'Q3OE1':
    // return 'Odd'
    // case 'Q3OE2':
    // return 'Even'
    // case 'Q4OE1':
    // return 'Odd'
    // case 'Q4OE2':
    // return 'Even'
    // case 'Q1ML1':
    // return 'Home'
    // case 'Q1ML2':
    // return 'Away'
    // case 'Q2ML1':
    // return 'Home'
    // case 'Q2ML2':
    // return 'Away'
    // case 'Q3ML1':
    // return 'Home'
    // case 'Q3ML2':
    // return 'Away'
    // case 'Q4ML1':
    // return 'Home'
    // case 'Q4ML2':
    // return 'Away'
    case 'Q1HW1':
      return 'Home Win by 1-4'
    case 'Q1HW5':
      return 'Home Win by 5-8'
    case 'Q1HW9':
      return 'Home Win by 9+'
    case 'Q1AW1':
      return 'Away Win by 1-4'
    case 'Q1AW5':
      return 'Away Win by 5-8'
    case 'Q1AW9':
      return 'Away Win by 9+'
    case 'Q1WMD':
      return 'Draw'
    case 'Q2HW1':
      return 'Home Win by 1-4'
    case 'Q2HW5':
      return 'Home Win by 5-8'
    case 'Q2HW9':
      return 'Home Win by 9+'
    case 'Q2AW1':
      return 'Away Win by 1-4'
    case 'Q2AW5':
      return 'Away Win by 5-8'
    case 'Q2AW9':
      return 'Away Win by 9+'
    case 'Q2WMD':
      return 'Draw'
    case 'Q3HW1':
      return 'Home Win by 1-4'
    case 'Q3HW5':
      return 'Home Win by 5-8'
    case 'Q3HW9':
      return 'Home Win by 9+'
    case 'Q3AW1':
      return 'Away Win by 1-4'
    case 'Q3AW5':
      return 'Away Win by 5-8'
    case 'Q3AW9':
      return 'Away Win by 9+'
    case 'Q3WMD':
      return 'Draw'
    case 'Q4HW1':
      return 'Home Win by 1-4'
    case 'Q4HW5':
      return 'Home Win by 5-8'
    case 'Q4HW9':
      return 'Home Win by 9+'
    case 'Q4AW1':
      return 'Away Win by 1-4'
    case 'Q4AW5':
      return 'Away Win by 5-8'
    case 'Q4AW9':
      return 'Away Win by 9+'
    case 'Q4WMD':
      return 'Draw'
    case 'Q1H10':
      return 'Home'
    case 'Q1A10':
      return 'Away'
    case 'Q2H10':
      return 'Home'
    case 'Q2A10':
      return 'Away'
    case 'Q3H10':
      return 'Home'
    case 'Q3A10':
      return 'Away'
    case 'Q4H10':
      return 'Home'
    case 'Q4A10':
      return 'Away'
    case 'Q1H15':
      return 'Home'
    case 'Q1A15':
      return 'Away'
    case 'Q2H15':
      return 'Home'
    case 'Q2A15':
      return 'Away'
    case 'Q3H15':
      return 'Home'
    case 'Q3A15':
      return 'Away'
    case 'Q4H15':
      return 'Home'
    case 'Q4A15':
      return 'Away'
    case 'Q1H20':
      return 'Home'
    case 'Q1A20':
      return 'Away'
    case 'Q2H20':
      return 'Home'
    case 'Q2A20':
      return 'Away'
    case 'Q3H20':
      return 'Home'
    case 'Q3A20':
      return 'Away'
    case 'Q4H20':
      return 'Home'
    case 'Q4A20':
      return 'Away'
    case 'Q1H25':
      return 'Home'
    case 'Q1A25':
      return 'Away'
    case 'Q2H25':
      return 'Home'
    case 'Q2A25':
      return 'Away'
    case 'Q3H25':
      return 'Home'
    case 'Q3A25':
      return 'Away'
    case 'Q4H25':
      return 'Home'
    case 'Q4A25':
      return 'Away'
    case 'EQD0':
      return '0'
    case 'EQD1':
      return '1+'
    case 'Q12HH':
      return 'Home/Home'
    case 'Q12HD':
      return 'Home/Draw'
    case 'Q12HA':
      return 'Home/Away'
    case 'Q12DH':
      return 'Draw/Home'
    case 'Q12DD':
      return 'Draw/Draw'
    case 'Q12DA':
      return 'Draw/Away'
    case 'Q12AH':
      return 'Away/Home'
    case 'Q12AD':
      return 'Away/Draw'
    case 'Q12AA':
      return 'Away/Away'
    case 'Q34HH':
      return 'Home/Home'
    case 'Q34HD':
      return 'Home/Draw'
    case 'Q34HA':
      return 'Home/Away'
    case 'Q34DH':
      return 'Draw/Home'
    case 'Q34DD':
      return 'Draw/Draw'
    case 'Q34DA':
      return 'Draw/Away'
    case 'Q34AH':
      return 'Away/Home'
    case 'Q34AD':
      return 'Away/Draw'
    case 'Q34AA':
      return 'Away/Away'
    case 'QWH12':
      return 'Home Win Q1 & Q2'
    case 'QWA12':
      return 'Away Win Q1 & Q2'
    case 'QWO12':
      return 'AOS For Q1 & Q2'
    case 'QWH13':
      return 'Home Win Q1 & Q3'
    case 'QWA13':
      return 'Away Win Q1 & Q3'
    case 'QWO13':
      return 'AOS For Q1 & Q3'
    case 'QWH14':
      return 'Home Win Q1 & Q4'
    case 'QWA14':
      return 'Away Win Q1 & Q4'
    case 'QWO14':
      return 'AOS For Q1 & Q4'
    case 'QWH23':
      return 'Home Win Q2 & Q3'
    case 'QWA23':
      return 'Away Win Q2 & Q3'
    case 'QWO23':
      return 'AOS For Q2 & Q3'
    case 'QWH24':
      return 'Home Win Q2 & Q4'
    case 'QWA24':
      return 'Away Win Q2 & Q4'
    case 'QWO24':
      return 'AOS For Q2 & Q4'
    case 'QWH34':
      return 'Home Win Q3 & Q4'
    case 'QWA34':
      return 'Away Win Q3 & Q4'
    case 'QWO34':
      return 'AOS For Q3 & Q4'
    // case 'Q1HO':
    // return 'Q1 Home Team Over'
    // case 'Q1HU':
    // return 'Q1 Home Team Under'
    // case 'Q1AO':
    // return 'Q1 Away Team Over'
    // case 'Q1AU':
    // return 'Q1 Away Team Under'
    // case 'Q2HO':
    // return 'Q2 Home Team Over'
    // case 'Q2HU':
    // return 'Q2 Home Team Under'
    // case 'Q2AO':
    // return 'Q2 Away Team Over'
    // case 'Q2AU':
    // return 'Q2 Away Team Under'
    // case 'Q3HO':
    // return 'Q3 Home Team Over'
    // case 'Q3HU':
    // return 'Q3 Home Team Under'
    // case 'Q3AO':
    // return 'Q3 Away Team Over'
    // case 'Q3AU':
    // return 'Q3 Away Team Under'
    // case 'Q4HO':
    // return 'Q4 Home Team Over'
    // case 'Q4HU':
    // return 'Q4 Home Team Under'
    // case 'Q4AO':
    // return 'Q4 Away Team Over'
    // case 'Q4AU':
    // return 'Q4 Away Team Under'
    case 'HQWN':
      return 'Home Team'
    case 'AQWN':
      return 'Away Team'
    case 'HQWB':
      return 'Home Team'
    case 'AQWB':
      return 'Away Team'
    // case 'HQWH':
    //   return 'Home Team'
    // case 'AQWH':
    //   return 'Away Team'
    // case 'HQWO':
    //   return 'Over'
    // case 'HQWU':
    //   return 'Under'
    // case 'AQWO':
    //   return 'Over'
    // case 'AQWU':
    //   return 'Under'
    case 'QCS21':
      return '2-1'
    case 'QCS30':
      return '3-0'
    case 'QCS31':
      return '3-1'
    case 'QCS40':
      return '4-0'
    case 'QCS22':
      return '2-2'
    case 'QCS12':
      return '1-2'
    case 'QCS03':
      return '0-3'
    case 'QCS13':
      return '1-3'
    case 'QCS04':
      return '0-4'
    case 'QCSOS':
      return 'AOS'
    case 'OOOO':
      return 'Odd/Odd/Odd/Odd'
    case 'OOOE':
      return 'Odd/Odd/Odd/Even'
    case 'OOEO':
      return 'Odd/Odd/Even/Odd'
    case 'OEOO':
      return 'Odd/Even/Odd/Odd'
    case 'EOOO':
      return 'Even/Odd/Odd/Odd'
    case 'EEEE':
      return 'Even/Even/Even/Even'
    case 'EEEO':
      return 'Even/Even/Even/Odd'
    case 'EEOE':
      return 'Even/Even/Odd/Even'
    case 'EOEE':
      return 'Even/Odd/Even/Even'
    case 'OEEE':
      return 'Odd/Even/Even/Even'
    case 'OOEE':
      return 'Odd/Odd/Even/Even'
    case 'OEOE':
      return 'Odd/Even/Odd/Even'
    case 'EOEO':
      return 'Even/Odd/Even/Odd'
    case 'EEOO':
      return 'Even/Even/Odd/Odd'
    case 'EOOE':
      return 'Even/Odd/Odd/Even'
    case 'OEEO':
      return 'Odd/Even/Even/Odd'

    default:
      return betChoice
  }
}

// used in deadball, running ball, mixparlay
export const getBetChoiceTrading = (game_type, direction) => {
  switch (game_type) {
    // 1X2
    case 1:
      if (direction === 'H') return '21'
      if (direction === 'A') return '22'
      if (direction === 'D') return '2X'
      break
    case 8:
      if (direction === 'H') return '11'
      if (direction === 'A') return '12'
      if (direction === 'D') return '1X'
      break
    // HDP
    case 0:
      if (direction === 'H') return '2H'
      if (direction === 'A') return '2A'
      break
    case 2:
      if (direction === 'H') return '1H'
      if (direction === 'A') return '1A'
      break
    // OU
    case 5:
      if (direction === 'H') return '2O'
      if (direction === 'A') return '2U'
      break
    case 6:
      if (direction === 'H') return '1O'
      if (direction === 'A') return '1U'
      break
    // OE
    case 3:
      if (direction === 'H') return 'OE1'
      if (direction === 'A') return 'OE2'
      break
    case 16:
      if (direction === 'H') return '1OE1'
      if (direction === 'A') return '1OE2'
      break
    // WNW
    case 63:
      if (direction === 'H') return 'HW'
      if (direction === 'A') return 'HNW'
      break
    case 64:
      if (direction === 'H') return 'AW'
      if (direction === 'A') return 'ANW'
      break
    // DC
    case 15:
      if (direction === 'H') return 'DC1X'
      if (direction === 'A') return 'DCX2'
      if (direction === 'D') return 'DC12'
      break
    case 12:
      if (direction === 'H') return 'ML1'
      if (direction === 'A') return 'ML2'
      break
    case 17:
      if (direction === 'H') return '1ML1'
      if (direction === 'A') return '1ML2'
      break
    default:
      break
  }
  const options = choiceOptions[game_type]
  switch (direction) {
    case 'H':
      return options[0]?.value
    case 'A':
      return options[1]?.value
    case 'D':
      return options[2]?.value
    default:
      break
  }
  return direction
}

export default getBetChoice
