export function getInfoSoccer(info, dataHeader) {
  switch (info) {
    case 'CORNERS':
      return `${dataHeader.league_name} - CORNERS
              ${dataHeader.home_name} No.of Corners vs ${dataHeader.away_name} No.of Corners`
    case 'TEAM TOTAL GOALS':
      return `${dataHeader.league_name}-TEAM TOTAL GOALS
              ${dataHeader.home_name} - Over vs ${dataHeader.home_name} - Under
              
              ${dataHeader.league_name}-TEAM TOTAL GOALS
              ${dataHeader.away_name} - Over vs ${dataHeader.away_name} - Under`
    case 'SINGLE TEAM OVER/UNDER':
      return `${dataHeader.league_name} - SINGLE TEAM OVER/UNDER
              ${dataHeader.home_name} - Over vs ${dataHeader.home_name} - Under

              ${dataHeader.league_name} - SINGLE TEAM OVER/UNDER
              ${dataHeader.away_name} - Over vs ${dataHeader.away_name} - Under`
    case 'SINGLE TEAM ODD/EVEN':
      return `${dataHeader.league_name} - SINGLE TEAM ODD/EVEN
              ${dataHeader.home_name} - Over vs ${dataHeader.home_name} - Under

              ${dataHeader.league_name} - SINGLE TEAM ODD/EVEN
              ${dataHeader.away_name} - Over vs ${dataHeader.away_name} - Under`
    case 'SPECIAL':
      return `${dataHeader.league_name} - SPECIAL
              ${dataHeader.home_name} - Clean Sheet vs ${dataHeader.home_name} - No Clean Sheet

              ${dataHeader.league_name} - SPECIAL
              ${dataHeader.away_name} - Clean Sheet vs ${dataHeader.away_name} - Clean Sheet`
    case 'SPECIALS':
      return `${dataHeader.league_name} - SPECIALS
              ${dataHeader.home_name} - To Kick Off vs ${dataHeader.away_name} - To Kick Off`
    case 'BOOKINGS':
      return `${dataHeader.league_name} - BOOKINGS
              ${dataHeader.home_name} Total Bookings vs ${dataHeader.away_name} Total Bookings `
    case 'ET & PEN':
      return `${dataHeader.league_name}
              ${dataHeader.home_name} (ET) vs ${dataHeader.away_name} (ET) 

              ${dataHeader.league_name}
              ${dataHeader.home_name} (PEN)(HDP) vs ${dataHeader.away_name} (PEN)(HDP)

              ${dataHeader.league_name}
              ${dataHeader.home_name} (PEN)(OU) vs ${dataHeader.away_name} (PEN)(OU)`
    case 'PENALTY SHOOT-OUT':
      return `${dataHeader.league_name} - PENALTY SHOOT-OUT
              ${dataHeader.home_name} 1st Penalty - Goal vs ${dataHeader.home_name} 1st Penalty - No Goal

              ${dataHeader.league_name} - PENALTY SHOOT-OUT
              ${dataHeader.away_name} 1st Penalty - Goal vs ${dataHeader.away_name} 1st Penalty - No Goal`
    case 'SPECIALS GOAL':
      return `${dataHeader.league_name} - SPECIALS GOAL
        ${dataHeader.home_name} 1st Goal vs ${dataHeader.away_name} 1st Goal

        ${dataHeader.league_name} - SPECIALS GOAL
        ${dataHeader.home_name} 2nd Goal vs ${dataHeader.away_name} 2nd Goal`
    case 'SPECIFIC 15 MINS':
      return `${dataHeader.league_name} - SPECIFIC 15 MINS
              ${dataHeader.home_name} 00:00-15:00 vs ${dataHeader.away_name} 00:00-15:00`
    case 'SPECIFIC 15 MINS NUMBER OF CORNERS':
      return `${dataHeader.league_name} - SPECIFIC 15 MINS NUMBER OF CORNERS
              ${dataHeader.home_name} No.of Corners 00:00-15:00 vs ${dataHeader.away_name} No.of Corners 00:00-15:00`
    case 'SPECIFIC 10 MINS':
      return `${dataHeader.league_name} - SPECIFIC 10 MINS
              ${dataHeader.home_name} No.of Corners 00:00-10:00 vs ${dataHeader.away_name} No.of Corners 00:00-10:00`
    case 'SPECIFIC 15 MINS TOTAL BOOKINGS':
      return `${dataHeader.league_name} - SPECIFIC 15 MINS TOTAL BOOKINGS
              ${dataHeader.home_name} No.of Corners 15:01-30:00 vs ${dataHeader.away_name} No.of Corners 15:01-30:00`
    case 'GOAL KICK':
      return `${dataHeader.league_name} - GOAL KICK
              ${dataHeader.home_name} 1st Goal Kick vs ${dataHeader.away_name} 1st Goal Kick`
    case 'FREE KICK':
      return `${dataHeader.league_name} - FREE KICK
              ${dataHeader.home_name} 1st Free Kick vs ${dataHeader.away_name} 1st Free Kick`
    case 'OFFSIDE':
      return `${dataHeader.league_name} - OFFSIDE
              ${dataHeader.home_name} 1st Offside vs ${dataHeader.away_name} 1st Offside`
    default:
      return ''
  }
}
export const soccerOptionList = {
  'TEAM TOTAL GOALS': {
    name: 'team_total_goals',
    options: [{ value: 'Over/Under', label: 'Over/Under' }],
  },
  'SINGLE TEAM OVER/UNDER': {
    name: 'single_team_over_under',
    options: [{ value: 'Over/Under', label: 'Over/Under' }],
  },
  'SINGLE TEAM ODD/EVEN': {
    name: 'single_team_odd_even',
    options: [{ value: 'Odd/Even', label: 'Odd/Even' }],
  },
  SPECIALS: {
    name: 'specials',
    options: [{ value: 'Clean Sheet/No Clean Sheet', label: 'Clean Sheet/No Clean Sheet' }],
  },
  'SPECIFIC 10 MINS': {
    name: 'specific_10_mins',
    options: [
      { value: '00:00-10:00', label: '00:00-10:00' },
      { value: '10:01-20:00', label: '10:01-20:00' },
      { value: '20:01-30:00', label: '20:01-30:00' },
      { value: '30:01-40:00', label: '30:01-40:00' },
      { value: '40:01-50:00', label: '40:01-50:00' },
      { value: '50:01-60:00', label: '50:01-60:00' },
      { value: '60:01-70:00', label: '60:01-70:00' },
      { value: '70:01-80:00', label: '70:01-80:00' },
      { value: '80:01-90:00', label: '80:01-90:00' },
    ],
  },
  'SPECIFIC 15 MINS': {
    name: 'specific_15_mins',
    options: [
      { value: '00:00-15:00', label: '00:00-15:00' },
      { value: '15:01-30:00', label: '15:01-30:00' },
      { value: '30:01-45:00', label: '30:01-45:00' },
      { value: '40:01-55:00', label: '40:01-55:00' },
      { value: '45:01-60:00', label: '45:01-60:00' },
      { value: '55:01-70:00', label: '55:01-70:00' },
      { value: '60:01-75:00', label: '60:01-75:00' },
      { value: '75:01-90:00', label: '75:01-90:00' },
    ],
  },
  'SPECIFIC 15 MINS NUMBER OF CORNERS': {
    name: 'specific_15_mins_number_of_corners',
    options: [
      { value: 'No.of Corners 00:00-15:00', label: 'No.of Corners 00:00-15:00' },
      { value: 'No.of Corners 15:01-30:00', label: 'No.of Corners 15:01-30:00' },
      { value: 'No.of Corners 30:01-45:00', label: 'No.of Corners 30:01-45:00' },
      { value: 'No.of Corners 45:01-60:00', label: 'No.of Corners 45:01-60:00' },
      { value: 'No.of Corners 60:01-75:00', label: 'No.of Corners 60:01-75:00' },
      { value: 'No.of Corners 75:01-90:00', label: 'No.of Corners 75:01-90:00' },
    ],
  },
  'SPECIFIC 15 MINS TOTAL BOOKINGS': {
    name: 'specific_15_mins_total_bookings',
    options: [
      { value: 'Total Bookings 00:00-15:00', label: 'Total Bookings 00:00-15:00' },
      { value: 'Total Bookings 15:01-30:00', label: 'Total Bookings 15:01-30:00' },
      { value: 'Total Bookings 30:01-45:00', label: 'Total Bookings 30:01-45:00' },
      { value: 'Total Bookings 45:01-60:00', label: 'Total Bookings 45:01-60:00' },
      { value: 'Total Bookings 60:01-75:00', label: 'Total Bookings 60:01-75:00' },
      { value: 'Total Bookings 75:01-90:00', label: 'Total Bookings 75:01-90:00' },
    ],
  },
  CORNERS: {
    name: 'corners',
    options: [
      { value: 'No.of Corners', label: 'No.of Corners' },
      { value: '1st Corner', label: '1st Corner' },
      { value: '2nd Corner', label: '2nd Corner' },
      { value: '3rd Corner', label: '3rd Corner' },
      { value: '4th Corner', label: '4th Corner' },
      { value: '5th Corner', label: '5th Corner' },
      { value: '6th Corner', label: '6th Corner' },
      { value: '7th Corner', label: '7th Corner' },
      { value: '8th Corner', label: '8th Corner' },
      { value: '9th Corner', label: '9th Corner' },
      { value: '10th Corner', label: '10th Corner' },
      { value: '11th Corner', label: '11th Corner' },
      { value: '12th Corner', label: '12th Corner' },
      { value: '13th Corner', label: '13th Corner' },
      { value: '14th Corner', label: '14th Corner' },
      { value: '15th Corner', label: '15th Corner' },
      { value: '16th Corner', label: '16th Corner' },
      { value: '17th Corner', label: '17th Corner' },
      { value: '18th Corner', label: '18th Corner' },
      { value: '19th Corner', label: '19th Corner' },
      { value: '20th Corner', label: '20th Corner' },
    ],
  },
  'SPECIALS GOAL': {
    name: 'specials_goal',
    options: [
      { value: '1st Goal', label: '1st Goal' },
      { value: '2nd Goal', label: '2nd Goal' },
      { value: '3rd Goal', label: '3rd Goal' },
      { value: '4th Goal', label: '4th Goal' },
      { value: '5th Goal', label: '5th Goal' },
      { value: '6th Goal', label: '6th Goal' },
      { value: '7th Goal', label: '7th Goal' },
      { value: '8th Goal', label: '8th Goal' },
      { value: '9th Goal', label: '9th Goal' },
      { value: '10th Goal', label: '10th Goal' },
    ],
  },
  BOOKINGS: {
    name: 'bookings',
    options: [
      { value: 'Total Bookings', label: 'Total Bookings' },
      { value: '1st Booking', label: '1st Booking' },
      { value: '2nd Booking', label: '2nd Booking' },
      { value: '3rd Booking', label: '3rd Booking' },
      { value: '4th Booking', label: '4th Booking' },
      { value: '5th Booking', label: '5th Booking' },
      { value: '6th Booking', label: '6th Booking' },
      { value: '7th Booking', label: '7th Booking' },
      { value: '8th Booking', label: '8th Booking' },
      { value: '9th Booking', label: '9th Booking' },
      { value: '10th Booking', label: '10th Booking' },
    ],
  },
  'GOAL KICK': {
    name: 'goal_kick',
    options: [
      { value: '1st Goal Kick', label: '1st Goal Kick' },
      { value: '2nd Goal Kick', label: '2nd Goal Kick' },
      { value: '3rd Goal Kick', label: '3rd Goal Kick' },
      { value: '4th Goal Kick', label: '4th Goal Kick' },
      { value: '5th Goal Kick', label: '5th Goal Kick' },
      { value: '6th Goal Kick', label: '6th Goal Kick' },
      { value: '7th Goal Kick', label: '7th Goal Kick' },
      { value: '8th Goal Kick', label: '8th Goal Kick' },
      { value: '9th Goal Kick', label: '9th Goal Kick' },
      { value: '10th Goal Kick', label: '10th Goal Kick' },
      { value: '11th Goal Kick', label: '11th Goal Kick' },
      { value: '12th Goal Kick', label: '12th Goal Kick' },
      { value: '13th Goal Kick', label: '13th Goal Kick' },
      { value: '14th Goal Kick', label: '14th Goal Kick' },
      { value: '15th Goal Kick', label: '15th Goal Kick' },
      { value: '16th Goal Kick', label: '16th Goal Kick' },
      { value: '17th Goal Kick', label: '17th Goal Kick' },
      { value: '18th Goal Kick', label: '18th Goal Kick' },
      { value: '19th Goal Kick', label: '19th Goal Kick' },
      { value: '20th Goal Kick', label: '20th Goal Kick' },
    ],
  },
  'FREE KICK': {
    name: 'free_kick',
    options: [
      { value: '1st Free Kick', label: '1st Free Kick' },
      { value: '2nd Free Kick', label: '2nd Free Kick' },
      { value: '3rd Free Kick', label: '3rd Free Kick' },
      { value: '4th Free Kick', label: '4th Free Kick' },
      { value: '5th Free Kick', label: '5th Free Kick' },
      { value: '6th Free Kick', label: '6th Free Kick' },
      { value: '7th Free Kick', label: '7th Free Kick' },
      { value: '8th Free Kick', label: '8th Free Kick' },
      { value: '9th Free Kick', label: '9th Free Kick' },
      { value: '10th Free Kick', label: '10th Free Kick' },
      { value: '11th Free Kick', label: '11th Free Kick' },
      { value: '12th Free Kick', label: '12th Free Kick' },
      { value: '13th Free Kick', label: '13th Free Kick' },
      { value: '14th Free Kick', label: '14th Free Kick' },
      { value: '15th Free Kick', label: '15th Free Kick' },
      { value: '16th Free Kick', label: '16th Free Kick' },
      { value: '17th Free Kick', label: '17th Free Kick' },
      { value: '18th Free Kick', label: '18th Free Kick' },
      { value: '19th Free Kick', label: '19th Free Kick' },
      { value: '20th Free Kick', label: '20th Free Kick' },
    ],
  },
  OFFSIDE: {
    name: 'offside',
    options: [
      { value: '1st Offside', label: '1st Offside' },
      { value: '2nd Offside', label: '2nd Offside' },
      { value: '3rd Offside', label: '3rd Offside' },
      { value: '4th Offside', label: '4th Offside' },
      { value: '5th Offside', label: '5th Offside' },
      { value: '6th Offside', label: '6th Offside' },
      { value: '7th Offside', label: '7th Offside' },
      { value: '8th Offside', label: '8th Offside' },
      { value: '9th Offside', label: '9th Offside' },
      { value: '10th Offside', label: '10th Offside' },
      { value: '11th Offside', label: '11th Offside' },
      { value: '12th Offside', label: '12th Offside' },
      { value: '13th Offside', label: '13th Offside' },
      { value: '14th Offside', label: '14th Offside' },
      { value: '15th Offside', label: '15th Offside' },
      { value: '16th Offside', label: '16th Offside' },
      { value: '17th Offside', label: '17th Offside' },
      { value: '18th Offside', label: '18th Offside' },
      { value: '19th Offside', label: '19th Offside' },
      { value: '20th Offside', label: '20th Offside' },
    ],
  },
  'ET & PEN': {
    name: 'et_pen',
    options: [
      { value: 'et', label: 'ET' },
      { value: 'pen', label: 'PEN' },
    ],
  },
  'PENALTY SHOOT-OUT': {
    name: 'penalty_shootout',
    options: [
      { value: '1st', label: '1st Penalty - Goal/No Goal' },
      { value: '2nd', label: '2nd Penalty - Goal/No Goal' },
      { value: '3rd', label: '3rd Penalty - Goal/No Goal' },
      { value: '4th', label: '4th Penalty - Goal/No Goal' },
      { value: '5th', label: '5th Penalty - Goal/No Goal' },
      { value: '6th', label: '6th Penalty - Goal/No Goal' },
      { value: '7th', label: '7th Penalty - Goal/No Goal' },
      { value: '8th', label: '8th Penalty - Goal/No Goal' },
      { value: '9th', label: '9th Penalty - Goal/No Goal' },
      { value: '10th', label: '10th Penalty - Goal/No Goal' },
    ],
  },
  'SPECIAL MORE': [
    { label: 'NG - Next Goal', value: '60' },
    { label: 'CSL - Correct Score (Live)', value: '1001' },
    { label: '1CSL - FH. Correct Score (Live)', value: '1002' },
    { label: 'BTTS - Both Team To Score', value: '20' },
    { label: '2BTTS - 2nd Half Both Team to Score', value: '41' },
    { label: 'HNB - Home No Bet', value: '37' },
    { label: 'ANB - Away No Bet', value: '38' },
    { label: 'DNB - Draw No Bet', value: '28' },
    { label: 'HWEH - Home to Win Either Half', value: '42' },
    { label: 'AWEH - Away to Win Either Half', value: '43' },
    { label: 'HWBH - Home to Win Both Halves', value: '44' },
    { label: 'AWBH - Away to Win Both Halves', value: '45' },
    { label: 'TSBH - To Score Both Halves', value: '26' },
    { label: 'HSBH - Home to Score Both Halves', value: '46' },
    { label: 'ASBH - Away to Score Both Halves', value: '47' },
    { label: 'HSH - Highest Scoring Half', value: '30' },
    { label: 'HSHHT - Highest Scoring Half Home Team', value: '48' },
    { label: 'HSHAT - Highest Scoring Half Away Team', value: '49' },
    { label: 'HWMC - Half With Most Corners', value: '29' },
    { label: 'RT2G - Race To 2 Goals', value: '23' },
    { label: 'RT3G - Race To 3 Goals', value: '24' },
    { label: 'TWFB - To Win From Behind', value: '33' },
    { label: 'TWTN - To Win To Nil', value: '34' },
    { label: 'PA - Penalty Awarded', value: '22' },
    { label: '3WH - 3-Way Handicap', value: '39' },
    { label: 'CSH - Clean Sheet', value: '40' },
    { label: 'FGM - First Goal Method', value: '21' },
    { label: 'ITA2H - Injury Time Awarded At End Of 2nd Half', value: '27' },
    { label: 'TOTFG - Time Of The First Goal', value: '25' },
    { label: 'WM - Winning Margin', value: '35' },
  ],
  // SPECIALS: [
  //   { value: 'To Kick Off', label: 'To Kick Off' },
  //   { value: '1st Substitution', label: '1st Substitution' },
  //   { value: '1st Offside', label: '1st Offside' },
  //   { value: '1st Goal Kick', label: '1st Goal Kick' },
  //   { value: '1st Throw in', label: '1st Throw in' },
  //   { value: '1st Free Kick', label: '1st Free Kick' },
  //   { value: 'Last Throw in', label: 'Last Throw in' },
  //   { value: 'Last Corner', label: 'Last Corner' },
  //   { value: 'Last Free Kick', label: 'Last Free Kick' },
  //   { value: 'Last Goal Kick', label: 'Last Goal Kick' },
  //   { value: 'Last Offside', label: 'Last Offside' },
  //   { value: 'Last Substitution', label: 'Last Substitution' },
  //   { value: 'Last Booking', label: 'Last Booking' },
  // ],
}

export function getInfoBasket(info, dataHeader) {
  switch (info) {
    case 'SPECIALS':
      return `${dataHeader.league_name} - Specials (Most 3-Point Shot Scored) \n ${dataHeader.home_name} vs ${dataHeader.away_name}`
    case 'QUARTER':
      return `${dataHeader.league_name} (1st Quarter) 
      ${dataHeader.home_name} (1st Q) vs ${dataHeader.away_name} (1st Q)

      ${dataHeader.league_name} (2st Quarter) 
      ${dataHeader.home_name} (2st Q) vs ${dataHeader.away_name} (2st Q)

      ${dataHeader.league_name} (3st Quarter) 
      ${dataHeader.home_name} (3st Q) vs ${dataHeader.away_name} (3st Q)

      ${dataHeader.league_name} (4st Quarter) 
      ${dataHeader.home_name} (4st Q) vs ${dataHeader.away_name} (4st Q)`

    case 'TEAM TOTAL':
      return `${dataHeader.league_name} - Specials (Team Totals) 
      ${dataHeader.home_name} - (Over) vs ${dataHeader.home_name} - (Under)

      ${dataHeader.league_name} - Specials (Team Totals) 
      ${dataHeader.away_name} - (Over) vs ${dataHeader.away_name} - (Under)`

    case '2ND HALF':
      return `${dataHeader.league_name} 2ND HALF
      ${dataHeader.home_name} (2nd) vs ${dataHeader.away_name} (2nd)`
    case 'TEAM TO SCORE':
      return `${dataHeader.league_name} - Specials (Which Team to Score The First Basket)
      ${dataHeader.home_name} to Score First vs ${dataHeader.away_name} to Score First

      ${dataHeader.league_name} - Specials (Which Team to Score The Last Basket)
      ${dataHeader.home_name} to Score Last vs ${dataHeader.away_name} to Score Last`
    case 'TEAM RACE TO FIRST 10':
      return `${dataHeader.league_name}- Specials (Which Team Race to First 10 Points - Quarter)
      ${dataHeader.home_name} to First 10 Points (1st Q) vs ${dataHeader.away_name} to First 10 Points (1st Q)

      ${dataHeader.league_name} Specials (Which Team Race to First 10 Points - Quarter) 
      ${dataHeader.home_name} to First 10 Points (2nd Q) vs ${dataHeader.away_name} to First 10 Points (2nd Q)

      ${dataHeader.league_name} Specials (Which Team Race to First 10 Points - Quarter) 
      ${dataHeader.home_name} to First 10 Points (3rd Q) vs ${dataHeader.away_name} to First 10 Points (3rd Q)
      
      ${dataHeader.league_name} Specials (Which Team Race to First 10 Points - Quarter) 
      ${dataHeader.home_name} to First 10 Points (4th Q) vs ${dataHeader.away_name} to First 10 Points (4th Q)`

    case 'TEAM RACE TO FIRST 15':
      return `${dataHeader.league_name}- Specials (Which Team Race to First 15 Points - Quarter) 
      ${dataHeader.home_name} to First 15 Points (1st Q) vs ${dataHeader.away_name} to First 15 Points (1st Q)

      ${dataHeader.league_name} Specials (Which Team Race to First 10 Points - Quarter)  
      ${dataHeader.home_name} to First 15 Points (2nd Q) vs ${dataHeader.away_name} to First 15 Points (2nd Q)

      ${dataHeader.league_name} Specials (Which Team Race to First 10 Points - Quarter) 
      ${dataHeader.home_name} to First 15 Points (3rd Q) vs ${dataHeader.away_name} to First 15 Points (3rd Q)

      ${dataHeader.league_name} Specials (Which Team Race to First 10 Points - Quarter)  
      ${dataHeader.home_name} to First 15 Points (4th Q) vs ${dataHeader.away_name} to First 15 Points (4th Q)`
    case 'TEAM RACE TO FIRST 20':
      return `${dataHeader.league_name}- Specials (Which Team Race to First 20 Points - Quarter) 
      ${dataHeader.home_name} to First 20 Points (1st Q) vs ${dataHeader.away_name} to First 20 Points (1st Q)

      ${dataHeader.league_name} Specials (Which Team Race to First 10 Points - Quarter) 
      ${dataHeader.home_name} to First 20 Points (2nd Q) vs ${dataHeader.away_name} to First 20 Points (2nd Q) 

      ${dataHeader.league_name} Specials (Which Team Race to First 10 Points - Quarter) 
      ${dataHeader.home_name} to First 20 Points (3rd Q) vs ${dataHeader.away_name} to First 20 Points (3rd Q)

      ${dataHeader.league_name} Specials (Which Team Race to First 10 Points - Quarter) 
      ${dataHeader.home_name} to First 20 Points (4th Q) vs ${dataHeader.away_name} to First 20 Points (4th Q)`
    default:
      return ''
  }
}
export const basketOptionList = {
  SPECIALS: {
    name: 'specials',
    options: [
      { value: 'Most 3-Point Shots Scored', label: 'Most 3-Point Shots Scored' },
      {
        value: 'Which Team With The Highest Scoring Quarter',
        label: 'Which Team With The Highest Scoring Quarter',
      },
      { value: 'Which Team Race to First 20 Points', label: 'Which Team Race to First 20 Points' },
    ],
  },
  QUARTER: {
    name: 'quarter',
    options: [
      { value: '1st Q', label: '1st Q' },
      { value: '2nd Q', label: '2nd Q' },
      { value: '3rd Q', label: '3rd Q' },
      { value: '4th Q', label: '4th Q' },
    ],
  },
  'TEAM TOTAL': {
    name: 'team_total',
    options: [{ value: 'over/under', label: 'Over/Under' }],
  },
  '2ND HALF': {
    name: '2nd_half',
    options: [{ value: '2nd', label: '2nd' }],
  },
  'TEAM TO SCORE': {
    name: 'team_to_score',
    options: [
      { value: 'To Score First', label: 'to Score First' },
      { value: 'To Score Last', label: 'to Score Last' },
    ],
  },
  'TEAM RACE TO FIRST 10': {
    name: 'team_race_to_first_10',
    options: [
      { value: '1st Q', label: '1st Q' },
      { value: '2nd Q', label: '2nd Q' },
      { value: '3rd Q', label: '3rd Q' },
      { value: '4th Q', label: '4th Q' },
    ],
  },
  'TEAM RACE TO FIRST 15': {
    name: 'team_race_to_first_15',
    options: [
      { value: '1st Q', label: '1st Q' },
      { value: '2nd Q', label: '2nd Q' },
      { value: '3rd Q', label: '3rd Q' },
      { value: '4th Q', label: '4th Q' },
    ],
  },
  'TEAM RACE TO FIRST 20': {
    name: 'team_race_to_first_20',
    options: [
      { value: '1st Q', label: '1st Q' },
      { value: '2nd Q', label: '2nd Q' },
      { value: '3rd Q', label: '3rd Q' },
      { value: '4th Q', label: '4th Q' },
    ],
  },
}
export function getInfoVolley(info, dataHeader) {
  switch (info) {
    case 'SPECIALS':
      return `${dataHeader.league_name} (First Set Betting) 
      ${dataHeader.home_name}(1st Set) vs ${dataHeader.away_name}(1st Set)

      ${dataHeader.league_name} (Second Set Betting) 
      ${dataHeader.home_name}(2st Set) vs ${dataHeader.away_name}(2st Set)

      ${dataHeader.league_name} (Third Set Betting) 
      ${dataHeader.home_name}(3t Set) vs ${dataHeader.away_name}(3st Set)
      
      ${dataHeader.league_name} (Fourth Set Betting) 
      ${dataHeader.home_name}(4st Set) vs ${dataHeader.away_name}(4st Set)
      
      ${dataHeader.league_name} (Total Match Points) 
      ${dataHeader.home_name} vs ${dataHeader.away_name}`
    default:
      return ''
  }
}
export const volleyOptionList = {
  SPECIALS: {
    name: 'specials',
    options: [
      { value: '(1st Set)|First Set Winner', label: 'First Set Winner' },
      { value: '(2nd Set)|Second Set Winner', label: 'Second Set Winner' },
      { value: '(3rd Set)|Third Set Winner', label: 'Third Set Winner' },
      { value: '(4th Set)|Fourth Set Winner', label: 'Fourth Set Winner' },
      { value: '(5th Set)|Fifth Set Winner', label: 'Fifth Set Winner' },
      { value: '|Points Handicap', label: 'Points Handicap' },
    ],
  },
}

export function getInfoTennis(info, dataHeader) {
  switch (info) {
    case 'SPECIALS':
      return `${dataHeader.league_name} (First Set Winner)
      ${dataHeader.home_name}(1st Set) vs ${dataHeader.away_name}(1st Set)

      ${dataHeader.league_name} (Second Set Winner)
      ${dataHeader.home_name}(2nd Set) vs ${dataHeader.away_name}(2nd Set)`
    case 'FIRST SET - GAME WINNER':
      return `${dataHeader.league_name} (First Set - Game Winner) 
      ${dataHeader.home_name}(2nd Game) vs ${dataHeader.away_name}(2nd Game)`
    case 'SECOND SET - GAME WINNER':
      return `${dataHeader.league_name} (Second Set - Game Winner) 
      ${dataHeader.home_name}(1st Game) vs ${dataHeader.away_name}(1st Game)`
    case 'THIRD SET - GAME WINNER':
      return `${dataHeader.league_name} (Third Set - Game Winner) 
      ${dataHeader.home_name}(1st Game) vs ${dataHeader.away_name}(1st Game)`
    case 'FOURTH SET - GAME WINNER':
      return `${dataHeader.league_name} (Forth Set - Game Winner) 
      ${dataHeader.home_name}(2nd Game) vs ${dataHeader.away_name}(2nd Game)`
    case 'FIFTH SET - GAME WINNER':
      return `${dataHeader.league_name} (Fifth Set - Game Winner) 
      ${dataHeader.home_name}(1st Game) vs ${dataHeader.away_name}(1st Game)`
    default:
      return ''
  }
}
export const tennisOptionList = {
  SPECIALS: {
    name: 'specials',
    options: [
      { value: '(1st Set)|First Set Winner', label: 'First Set Winner' },
      { value: '(2nd Set)|Second Set Winner', label: 'Second Set Winner' },
      { value: '(3rd Set)|Third Set Winner', label: 'Third Set Winner' },
      { value: '(4th Set)|Fourth Set Winner', label: 'Fourth Set Winner' },
      { value: '(5th Set)|Fifth Set Winner', label: 'Fifth Set Winner' },
    ],
  },
  'FIRST SET - GAME WINNER': {
    name: 'first_set_game_winner',
    options: [
      { value: '(1st Game)', label: '1st Game' },
      { value: '(2nd Game)', label: '2nd Game' },
      { value: '(3rd Game)', label: '3rd Game' },
      { value: '(4th Game)', label: '4th Game' },
      { value: '(5th Game)', label: '5th Game' },
      { value: '(6th Game)', label: '6th Game' },
      { value: '(7th Game)', label: '7th Game' },
      { value: '(8th Game)', label: '8th Game' },
      { value: '(9th Game)', label: '9th Game' },
      { value: '(10th Game)', label: '10th Game' },
      { value: '(11th Game)', label: '11th Game' },
      { value: '(12th Game)', label: '12th Game' },
      { value: '(Tie-Break)', label: 'Tie-Break' },
    ],
  },
  'SECOND SET - GAME WINNER': {
    name: 'second_set_game_winner',
    options: [
      { value: '(1st Game)', label: '1st Game' },
      { value: '(2nd Game)', label: '2nd Game' },
      { value: '(3rd Game)', label: '3rd Game' },
      { value: '(4th Game)', label: '4th Game' },
      { value: '(5th Game)', label: '5th Game' },
      { value: '(6th Game)', label: '6th Game' },
      { value: '(7th Game)', label: '7th Game' },
      { value: '(8th Game)', label: '8th Game' },
      { value: '(9th Game)', label: '9th Game' },
      { value: '(10th Game)', label: '10th Game' },
      { value: '(11th Game)', label: '11th Game' },
      { value: '(12th Game)', label: '12th Game' },
      { value: '(Tie-Break)', label: 'Tie-Break' },
    ],
  },
  'THIRD SET - GAME WINNER': {
    name: 'third_set_game_winner',
    options: [
      { value: '(1st Game)', label: '1st Game' },
      { value: '(2nd Game)', label: '2nd Game' },
      { value: '(3rd Game)', label: '3rd Game' },
      { value: '(4th Game)', label: '4th Game' },
      { value: '(5th Game)', label: '5th Game' },
      { value: '(6th Game)', label: '6th Game' },
      { value: '(7th Game)', label: '7th Game' },
      { value: '(8th Game)', label: '8th Game' },
      { value: '(9th Game)', label: '9th Game' },
      { value: '(10th Game)', label: '10th Game' },
      { value: '(11th Game)', label: '11th Game' },
      { value: '(12th Game)', label: '12th Game' },
      { value: '(Tie-Break)', label: 'Tie-Break' },
    ],
  },
  'FOURTH SET - GAME WINNER': {
    name: 'fourth_set_game_winner',
    options: [
      { value: '(1st Game)', label: '1st Game' },
      { value: '(2nd Game)', label: '2nd Game' },
      { value: '(3rd Game)', label: '3rd Game' },
      { value: '(4th Game)', label: '4th Game' },
      { value: '(5th Game)', label: '5th Game' },
      { value: '(6th Game)', label: '6th Game' },
      { value: '(7th Game)', label: '7th Game' },
      { value: '(8th Game)', label: '8th Game' },
      { value: '(9th Game)', label: '9th Game' },
      { value: '(10th Game)', label: '10th Game' },
      { value: '(11th Game)', label: '11th Game' },
      { value: '(12th Game)', label: '12th Game' },
      { value: '(Tie-Break)', label: 'Tie-Break' },
    ],
  },
  'FIFTH SET - GAME WINNER': {
    name: 'fifth_set_game_winner',
    options: [
      { value: '(1st Game)', label: '1st Game' },
      { value: '(2nd Game)', label: '2nd Game' },
      { value: '(3rd Game)', label: '3rd Game' },
      { value: '(4th Game)', label: '4th Game' },
      { value: '(5th Game)', label: '5th Game' },
      { value: '(6th Game)', label: '6th Game' },
      { value: '(7th Game)', label: '7th Game' },
      { value: '(8th Game)', label: '8th Game' },
      { value: '(9th Game)', label: '9th Game' },
      { value: '(10th Game)', label: '10th Game' },
      { value: '(11th Game)', label: '11th Game' },
      { value: '(12th Game)', label: '12th Game' },
      { value: '(Tie-Break)', label: 'Tie-Break' },
    ],
  },
  'SPECIAL MORE': [
    { value: '1101', label: 'Set 1 Winner' },
    { value: '1104', label: 'Set 2 Winner' },
    { value: '1107', label: 'Set 3 Winner' },
    { value: '1110', label: 'Set 4 Winner' },
    { value: '1113', label: 'Set 5 Winner' },
  ],
}

export function getInfoPool(info, dataHeader) {
  switch (info) {
    case 'SPECIALS':
      return `${dataHeader.league_name} (Best of 7 Frames)
      ${dataHeader.home_name} vs ${dataHeader.away_name}

      ${dataHeader.league_name} Highest Match Break 
      ${dataHeader.home_name} vs ${dataHeader.away_name}`
    case 'FRAMES WINNER':
      return `${dataHeader.league_name} (Frames Winner) 
      ${dataHeader.home_name}(3rd Frame) vs ${dataHeader.away_name}(3rd Frame)`
    default:
      return ''
  }
}
export const poolOptionList = {
  SPECIALS: {
    name: 'specials',
    options: [
      { value: 'Best of 7 Frames', label: 'Best of 7 Frames' },
      { value: 'Best of 9 Frames', label: 'Best of 9 Frames' },
      { value: 'Best of 11 Frames', label: 'Best of 11 Frames' },
      { value: 'Best of 19 Frames', label: 'Best of 19 Frames' },
      { value: 'Total Match Points', label: 'Total Match Points' },
      { value: 'Highest Match Break', label: 'Highest Match Break' },
    ],
  },
  'FRAMES WINNER': {
    name: 'frames_winner',
    options: [
      { value: '1st Frame', label: '1st Frame' },
      { value: '2nd Frame', label: '2nd Frame' },
      { value: '3rd Frame', label: '3rd Frame' },
      { value: '4th Frame', label: '4th Frame' },
      { value: '5th Frame', label: '5th Frame' },
      { value: '6th Frame', label: '6th Frame' },
      { value: '7th Frame', label: '7th Frame' },
      { value: '8th Frame', label: '8th Frame' },
      { value: '9th Frame', label: '9th Frame' },
      { value: '10th Frame', label: '10th Frame' },
      { value: '11th Frame', label: '11th Frame' },
      { value: '12th Frame', label: '12th Frame' },
      { value: '13th Frame', label: '13th Frame' },
      { value: '14th Frame', label: '14th Frame' },
      { value: '15th Frame', label: '15th Frame' },
      { value: '16th Frame', label: '16th Frame' },
      { value: '17th Frame', label: '17th Frame' },
      { value: '18th Frame', label: '18th Frame' },
      { value: '19th Frame', label: '19th Frame' },
    ],
  },
}

export function getInfoBadminton(info, dataHeader) {
  switch (info) {
    case 'SPECIALS':
      return `${dataHeader.league_name} - SPECIALS
      ${dataHeader.home_name} Set Handicap vs ${dataHeader.away_name} Set Handicap`
    default:
      return ''
  }
}
export const badmintonOptionList = {
  SPECIALS: {
    name: 'specials',
    options: [
      { value: '(1st Set)|First Set Winner', label: 'First Set Winner' },
      { value: '(2nd Set)|Second Set Winner', label: 'Second Set Winner' },
      { value: '(3rd Set)|Third Set Winner', label: 'Third Set Winner' },
      {
        value: '(1st Set)|Which Player Race to 3 Points - 1st Set',
        label: 'Which Player Race to 3 Points - 1st Set',
      },
      {
        value: '(1st Set)|Which Player Race to 5 Points - 1st Set',
        label: 'Which Player Race to 5 Points - 1st Set',
      },
      {
        value: '(1st Set)|Which Player Race to 7 Points - 1st Set',
        label: 'Which Player Race to 7 Points - 1st Set',
      },
      {
        value: '(1st Set)|Which Player Race to 9 Points - 1st Set',
        label: 'Which Player Race to 9 Points - 1st Set',
      },
      {
        value: '(1st Set)|Which Player Race to 11 Points - 1st Set',
        label: 'Which Player Race to 11 Points - 1st Set',
      },
    ],
  },
  'First Set - Point Winner': {
    name: 'first_set_point_winner',
    options: [
      { value: '(1st Point)', label: '1st Point' },
      { value: '(2nd Point)', label: '2nd Point' },
      { value: '(3rd Point)', label: '3rd Point' },
      { value: '(4th Point)', label: '4th Point' },
      { value: '(5th Point)', label: '5th Point' },
      { value: '(6th Point)', label: '6th Point' },
      { value: '(7th Point)', label: '7th Point' },
      { value: '(8th Point)', label: '8th Point' },
      { value: '(9th Point)', label: '9th Point' },
      { value: '(10th Point)', label: '10th Point' },
      { value: '(11th Point)', label: '11th Point' },
      { value: '(12th Point)', label: '12th Point' },
      { value: '(13th Point)', label: '13th Point' },
      { value: '(14th Point)', label: '14th Point' },
      { value: '(15th Point)', label: '15th Point' },
      { value: '(16th Point)', label: '16th Point' },
      { value: '(17th Point)', label: '17th Point' },
      { value: '(18th Point)', label: '18th Point' },
      { value: '(19th Point)', label: '19th Point' },
      { value: '(20th Point)', label: '20th Point' },
      { value: '(21st Point)', label: '21st Point' },
    ],
  },
  'Second Set - Point Winner': {
    name: 'second_set_point_winner',
    options: [
      { value: '(1st Point)', label: '1st Point' },
      { value: '(2nd Point)', label: '2nd Point' },
      { value: '(3rd Point)', label: '3rd Point' },
      { value: '(4th Point)', label: '4th Point' },
      { value: '(5th Point)', label: '5th Point' },
      { value: '(6th Point)', label: '6th Point' },
      { value: '(7th Point)', label: '7th Point' },
      { value: '(8th Point)', label: '8th Point' },
      { value: '(9th Point)', label: '9th Point' },
      { value: '(10th Point)', label: '10th Point' },
      { value: '(11th Point)', label: '11th Point' },
      { value: '(12th Point)', label: '12th Point' },
      { value: '(13th Point)', label: '13th Point' },
      { value: '(14th Point)', label: '14th Point' },
      { value: '(15th Point)', label: '15th Point' },
      { value: '(16th Point)', label: '16th Point' },
      { value: '(17th Point)', label: '17th Point' },
      { value: '(18th Point)', label: '18th Point' },
      { value: '(19th Point)', label: '19th Point' },
      { value: '(20th Point)', label: '20th Point' },
      { value: '(21st Point)', label: '21st Point' },
    ],
  },
  'Third Set - Point Winner': {
    name: 'third_set_point_winner',
    options: [
      { value: '(1st Point)', label: '1st Point' },
      { value: '(2nd Point)', label: '2nd Point' },
      { value: '(3rd Point)', label: '3rd Point' },
      { value: '(4th Point)', label: '4th Point' },
      { value: '(5th Point)', label: '5th Point' },
      { value: '(6th Point)', label: '6th Point' },
      { value: '(7th Point)', label: '7th Point' },
      { value: '(8th Point)', label: '8th Point' },
      { value: '(9th Point)', label: '9th Point' },
      { value: '(10th Point)', label: '10th Point' },
      { value: '(11th Point)', label: '11th Point' },
      { value: '(12th Point)', label: '12th Point' },
      { value: '(13th Point)', label: '13th Point' },
      { value: '(14th Point)', label: '14th Point' },
      { value: '(15th Point)', label: '15th Point' },
      { value: '(16th Point)', label: '16th Point' },
      { value: '(17th Point)', label: '17th Point' },
      { value: '(18th Point)', label: '18th Point' },
      { value: '(19th Point)', label: '19th Point' },
      { value: '(20th Point)', label: '20th Point' },
      { value: '(21st Point)', label: '21st Point' },
    ],
  },
  'SPECIAL MORE': [
    { value: '1101', label: 'Set 1 Winner' },
    { value: '1104', label: 'Set 2 Winner' },
    { value: '1107', label: 'Set 3 Winner' },
  ],
}

export function getInfoEsport(dataHeader) {
  return `${dataHeader.league_name} - SPECIALS 
  ${dataHeader.home_name} vs ${dataHeader.away_name}`
}
export const esportOptionList = {
  maps: {
    name: 'maps',
    options: [
      { value: '(Map 1)', label: 'Map 1' },
      { value: '(Map 2)', label: 'Map 2' },
      { value: '(Map 3)', label: 'Map 3' },
      { value: '(Map 4)', label: 'Map 4' },
      { value: '(Map 5)', label: 'Map 5' },
      { value: '(Map 6)', label: 'Map 6' },
      { value: '(Map 7)', label: 'Map 7' },
    ],
  },
  'first blood': {
    name: 'first_blood',
    options: [
      { value: '(First blood)|(1st Blood)', label: 'First blood' },
      { value: '(First blood on Map 1)|(Map 1 - 1st Blood)', label: 'First blood on Map 1' },
      { value: '(First blood on Map 2)|(Map 2 - 1st Blood)', label: 'First blood on Map 2' },
      { value: '(First blood on Map 3)|(Map 3 - 1st Blood)', label: 'First blood on Map 3' },
      { value: '(First blood on Map 4)|(Map 4 - 1st Blood)', label: 'First blood on Map 4' },
      { value: '(First blood on Map 5)|(Map 5 - 1st Blood)', label: 'First blood on Map 5' },
    ],
  },
  'total kills': {
    name: 'total_kills',
    options: [
      { value: '(Total Kills)|(Total Kills)', label: 'Total Kills' },
      { value: '(Total Kills on Map 1)|(Map 1 - Total Kills)', label: 'Total Kills on Map 1' },
      { value: '(Total Kills on Map 2)|(Map 2 - Total Kills)', label: 'Total Kills on Map 2' },
      { value: '(Total Kills on Map 3)|(Map 3 - Total Kills)', label: 'Total Kills on Map 3' },
      { value: '(Total Kills on Map 4)|(Map 4 - Total Kills)', label: 'Total Kills on Map 4' },
      { value: '(Total Kills on Map 5)|(Map 5 - Total Kills)', label: 'Total Kills on Map 5' },
    ],
  },
  'first barracks': {
    name: 'first_barracks',
    options: [
      {
        value: '(Which team will take 1st barracks on map 1)|(Map 1 - 1st Barracks)',
        label: 'Which team will take 1st barracks on map 1',
      },
      {
        value: '(Which team will take 1st barracks on map 2)|(Map 2 - 1st Barracks)',
        label: 'Which team will take 1st barracks on map 2',
      },
      {
        value: '(Which team will take 1st barracks on map 3)|(Map 3 - 1st Barracks)',
        label: 'Which team will take 1st barracks on map 3',
      },
      {
        value: '(Which team will take 1st barracks on map 4)|(Map 4 - 1st Barracks)',
        label: 'Which team will take 1st barracks on map 4',
      },
      {
        value: '(Which team will take 1st barracks on map 5)|(Map 5 - 1st Barracks)',
        label: 'Which team will take 1st barracks on map 5',
      },
    ],
  },
  'first baron': {
    name: 'first_baron',
    options: [
      {
        value: '(Which team will slay the 1st Baron on map 1)|(Map 1 - 1st Baron)',
        label: 'Which team will slay the 1st Baron on map 1',
      },
      {
        value: '(Which team will slay the 1st Baron on map 2)|(Map 2 - 1st Baron)',
        label: 'Which team will slay the 1st Baron on map 2',
      },
      {
        value: '(Which team will slay the 1st Baron on map 3)|(Map 3 - 1st Baron)',
        label: 'Which team will slay the 1st Baron on map 3',
      },
      {
        value: '(Which team will slay the 1st Baron on map 4)|(Map 4 - 1st Baron)',
        label: 'Which team will slay the 1st Baron on map 4',
      },
      {
        value: '(Which team will slay the 1st Baron on map 5)|(Map 5 - 1st Baron)',
        label: 'Which team will slay the 1st Baron on map 5',
      },
    ],
  },
  'map in play': {
    name: 'map_in_play',
    options: [
      { value: '(Map 1)(IN-PLAY)|(Map 1)', label: 'Map 1 (IN-PLAY)' },
      { value: '(Map 2)(IN-PLAY)|(Map 2)', label: 'Map 2 (IN-PLAY)' },
      { value: '(Map 3)(IN-PLAY)|(Map 3)', label: 'Map 3 (IN-PLAY)' },
      { value: '(Map 4)(IN-PLAY)|(Map 4)', label: 'Map 4 (IN-PLAY)' },
      { value: '(Map 5)(IN-PLAY)|(Map 5)', label: 'Map 5 (IN-PLAY)' },
    ],
  },
  'first to reach 5 kills': {
    name: 'first_to_reach_5_kills',
    options: [
      { value: '(First To Reach 5 Kills)|(1st 5 Kills)', label: 'First To Reach 5 Kills' },
      {
        value: '(First To Reach 5 Kills on Map 1)|(Map 1 - 1st 5 Kills)',
        label: 'First To Reach 5 Kills on Map 1',
      },
      {
        value: '(First To Reach 5 Kills on Map 2)|(Map 2 - 1st 5 Kills)',
        label: 'First To Reach 5 Kills on Map 2',
      },
      {
        value: '(First To Reach 5 Kills on Map 3)|(Map 3 - 1st 5 Kills)',
        label: 'First To Reach 5 Kills on Map 3',
      },
      {
        value: '(First To Reach 5 Kills on Map 4)|(Map 4 - 1st 5 Kills)',
        label: 'First To Reach 5 Kills on Map 4',
      },
      {
        value: '(First To Reach 5 Kills on Map 5)|(Map 5 - 1st 5 Kills)',
        label: 'First To Reach 5 Kills on Map 5',
      },
    ],
  },
  'total kills in play': {
    name: 'total_kills_in_play',
    options: [
      { value: '(Total Kills)(IN-PLAY)|(Total Kills)', label: 'Total Kills (IN-PLAY)' },
      {
        value: '(Total Kills on Map 1)(IN-PLAY)|(Map 1 - Total Kills)',
        label: 'Total Kills on Map 1 (IN-PLAY)',
      },
      {
        value: '(Total Kills on Map 2)(IN-PLAY)|(Map 2 - Total Kills)',
        label: 'Total Kills on Map 2 (IN-PLAY)',
      },
      {
        value: '(Total Kills on Map 3)(IN-PLAY)|(Map 3 - Total Kills)',
        label: 'Total Kills on Map 3 (IN-PLAY)',
      },
      {
        value: '(Total Kills on Map 4)(IN-PLAY)|(Map 4 - Total Kills)',
        label: 'Total Kills on Map 4 (IN-PLAY)',
      },
      {
        value: '(Total Kills on Map 5)(IN-PLAY)|(Map 5 - Total Kills)',
        label: 'Total Kills on Map 5 (IN-PLAY)',
      },
    ],
  },
  'first roshan': {
    name: 'first_roshan',
    options: [
      { value: '(First roshan on map 1)|(Map 1 - 1st Roshan)', label: 'First roshan on map 1' },
      { value: '(First roshan on map 2)|(Map 2 - 1st Roshan)', label: 'First roshan on map 2' },
      { value: '(First roshan on map 3)|(Map 3 - 1st Roshan)', label: 'First roshan on map 3' },
      { value: '(First roshan on map 4)|(Map 4 - 1st Roshan)', label: 'First roshan on map 4' },
      { value: '(First roshan on map 5)|(Map 5 - 1st Roshan)', label: 'First roshan on map 5' },
    ],
  },
  'first to reach 10 kills in play': {
    name: 'first_to_reach_10_kills_in_play',
    options: [
      {
        value: '(First To Reach 10 Kills on Map 1)(IN-PLAY)|(Map 1 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 1 (IN-PLAY)',
      },
      {
        value: '(First To Reach 10 Kills on Map 2)(IN-PLAY)|(Map 2 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 2 (IN-PLAY)',
      },
      {
        value: '(First To Reach 10 Kills on Map 3)(IN-PLAY)|(Map 3 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 3 (IN-PLAY)',
      },
      {
        value: '(First To Reach 10 Kills on Map 4)(IN-PLAY)|(Map 4 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 4 (IN-PLAY)',
      },
      {
        value: '(First To Reach 10 Kills on Map 5)(IN-PLAY)|(Map 5 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 5 (IN-PLAY)',
      },
    ],
  },
  'match winner': {
    name: 'match_winner',
    options: [{ value: '(Match Winner)', label: 'Match Winner' }],
  },
  'first to win 5 round': {
    name: 'first_to_win_5_round',
    options: [
      { value: '(First To Win 5 Rounds)|(1st 5 Rounds)', label: 'First To Win 5 Rounds' },
      {
        value: '(Map 1 - First To Win 5 Rounds)|(Map 1 - 1st 5 Rounds)',
        label: 'Map 1 - First To Win 5 Rounds',
      },
      {
        value: '(Map 2 - First To Win 5 Rounds)|(Map 2 - 1st 5 Rounds)',
        label: 'Map 2 - First To Win 5 Rounds',
      },
      {
        value: '(Map 3 - First To Win 5 Rounds)|(Map 3 - 1st 5 Rounds)',
        label: 'Map 3 - First To Win 5 Rounds',
      },
    ],
  },
  'first to reach 10 kills': {
    name: 'first_to_reach_10_kills',
    options: [
      { value: '(First To Reach 10 Kills)|(1st 10 Kills)', label: 'First To Reach 10 Kills' },
      {
        value: '(First To Reach 10 Kills on Map 1)|(Map 1 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 1',
      },
      {
        value: '(First To Reach 10 Kills on Map 2)|(Map 2 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 2',
      },
      {
        value: '(First To Reach 10 Kills on Map 3)|(Map 3 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 3',
      },
      {
        value: '(First To Reach 10 Kills on Map 4)|(Map 4 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 4',
      },
      {
        value: '(First To Reach 10 Kills on Map 5)|(Map 5 - 1st 10 Kills)',
        label: 'First To Reach 10 Kills on Map 5',
      },
    ],
  },
  duration: {
    name: 'duration',
    options: [
      { value: '(Duration - Minutes)|(Minutes)', label: 'Duration (Minutes)' },
      {
        value: '(Duration on Map 1)(Minutes)|(Map 1 - Minutes)',
        label: 'Duration on Map 1 (Minutes)',
      },
      {
        value: '(Duration on Map 2)(Minutes)|(Map 2 - Minutes)',
        label: 'Duration on Map 2 (Minutes)',
      },
      {
        value: '(Duration on Map 3)(Minutes)|(Map 3 - Minutes)',
        label: 'Duration on Map 3 (Minutes)',
      },
      {
        value: '(Duration on Map 4)(Minutes)|(Map 4 - Minutes)',
        label: 'Duration on Map 4 (Minutes)',
      },
      {
        value: '(Duration on Map 5)(Minutes)|(Map 5 - Minutes)',
        label: 'Duration on Map 5 (Minutes)',
      },
    ],
  },
  'pistol round': {
    name: 'pistol_round',
    options: [
      {
        value: '(1st Round Winner - Pistol Round)|(1st Round)',
        label: '1st Round Winner - Pistol Round',
      },
      {
        value: '(16th Round Winner - Pistol Round)|(16th Round)',
        label: '16th Round Winner - Pistol Round',
      },
      {
        value: '(Map 1 - 1st Round Winner - Pistol Round)|(Map 1 - 1st Round)',
        label: 'Map 1 - 1st Round Winner - Pistol Round',
      },
      {
        value: '(Map 1 - 16th Round Winner - Pistol Round)|(Map 1 - 16th Round)',
        label: 'Map 1 - 16th Round Winner - Pistol Round',
      },
      {
        value: '(Map 2 - 1st Round Winner - Pistol Round)|(Map 2 - 1st Round)',
        label: 'Map 2 - 1st Round Winner - Pistol Round',
      },
      {
        value: '(Map 2 - 16th Round Winner - Pistol Round)|(Map 2 - 16th Round)',
        label: 'Map 2 - 16th Round Winner - Pistol Round',
      },
      {
        value: '(Map 3 - 1st Round Winner - Pistol Round)|(Map 3 - 1st Round)',
        label: 'Map 3 - 1st Round Winner - Pistol Round',
      },
      {
        value: '(Map 3 - 16th Round Winner - Pistol Round)|(Map 3 - 16th Round)',
        label: 'Map 3 - 16th Round Winner - Pistol Round',
      },
      {
        value: '(Map 4 - 1st Round Winner - Pistol Round)|(Map 4 - 1st Round)',
        label: 'Map 4 - 1st Round Winner - Pistol Round',
      },
      {
        value: '(Map 4 - 16th Round Winner - Pistol Round)|(Map 4 - 16th Round)',
        label: 'Map 4 - 16th Round Winner - Pistol Round',
      },
    ],
  },
  'tie breaker': {
    name: 'tie_breaker',
    options: [
      { value: '(Tiebreaker)', label: 'Tiebreaker' },
      { value: '(Tiebreaker)(IN-PLAY)', label: 'Tiebreaker (IN-PLAY)' },
    ],
  },
}

export const cricketOptionList = {
  SPECIALS: {
    name: 'specials',
    options: [
      { value: 'cricket|To Win the Toss', label: 'To Win the Toss' },
      { value: 'kembar|Innings Total Runs', label: 'Innings Total Runs' },
      { value: 'kembar|Group 1-6 Total Runs', label: 'Group 1-6 Total Runs' },
      { value: 'kembar|Over 1 Ball 1 Total Runs', label: 'Over 1 Ball 1 Total Runs' },
      { value: 'kembar|Fall of First Wicket Total Runs', label: 'Fall of First Wicket Total Runs' },
      { value: 'cricket|Match Sixes', label: 'Match Sixes' },
      { value: 'kembar|Innings Sixes', label: 'Innings Sixes' },
      { value: 'cricket|Match Fours', label: 'Match Fours' },
      { value: 'kembar|Innings Fours', label: 'Innings Fours' },
      { value: 'cricket|Match Wickets', label: 'Match Wickets' },
      { value: 'cricket|Match Extras', label: 'Match Extras' },
      { value: 'cricket|Highest Individual Score', label: 'Highest Individual Score' },
      { value: 'cricket|Highest Opening Partnership', label: 'Highest Opening Partnership' },
    ],
  },
  '1st Innings Total Runs': {
    name: '1st_innings_total_runs',
    options: [
      { value: '1st Innings Over 1 Total Runs', label: 'Over 1' },
      { value: '1st Innings Over 2 Total Runs', label: 'Over 2' },
      { value: '1st Innings Over 3 Total Runs', label: 'Over 3' },
      { value: '1st Innings Over 4 Total Runs', label: 'Over 4' },
      { value: '1st Innings Over 5 Total Runs', label: 'Over 5' },
      { value: '1st Innings Over 6 Total Runs', label: 'Over 6' },
      { value: '1st Innings Over 7 Total Runs', label: 'Over 7' },
      { value: '1st Innings Over 8 Total Runs', label: 'Over 8' },
      { value: '1st Innings Over 9 Total Runs', label: 'Over 9' },
      { value: '1st Innings Over 10 Total Runs', label: 'Over 10' },
      { value: '1st Innings Over 11 Total Runs', label: 'Over 11' },
      { value: '1st Innings Over 12 Total Runs', label: 'Over 12' },
      { value: '1st Innings Over 13 Total Runs', label: 'Over 13' },
      { value: '1st Innings Over 14 Total Runs', label: 'Over 14' },
      { value: '1st Innings Over 15 Total Runs', label: 'Over 15' },
      { value: '1st Innings Over 16 Total Runs', label: 'Over 16' },
      { value: '1st Innings Over 17 Total Runs', label: 'Over 17' },
      { value: '1st Innings Over 18 Total Runs', label: 'Over 18' },
      { value: '1st Innings Over 19 Total Runs', label: 'Over 19' },
      { value: '1st Innings Over 20 Total Runs', label: 'Over 20' },
    ],
  },
  '2nd Innings Total Runs': {
    name: '2nd_innings_total_runs',
    options: [
      { value: '2nd Innings Over 1 Total Runs', label: 'Over 1' },
      { value: '2nd Innings Over 2 Total Runs', label: 'Over 2' },
      { value: '2nd Innings Over 3 Total Runs', label: 'Over 3' },
      { value: '2nd Innings Over 4 Total Runs', label: 'Over 4' },
      { value: '2nd Innings Over 5 Total Runs', label: 'Over 5' },
      { value: '2nd Innings Over 6 Total Runs', label: 'Over 6' },
      { value: '2nd Innings Over 7 Total Runs', label: 'Over 7' },
      { value: '2nd Innings Over 8 Total Runs', label: 'Over 8' },
      { value: '2nd Innings Over 9 Total Runs', label: 'Over 9' },
      { value: '2nd Innings Over 10 Total Runs', label: 'Over 10' },
      { value: '2nd Innings Over 11 Total Runs', label: 'Over 11' },
      { value: '2nd Innings Over 12 Total Runs', label: 'Over 12' },
      { value: '2nd Innings Over 13 Total Runs', label: 'Over 13' },
      { value: '2nd Innings Over 14 Total Runs', label: 'Over 14' },
      { value: '2nd Innings Over 15 Total Runs', label: 'Over 15' },
      { value: '2nd Innings Over 16 Total Runs', label: 'Over 16' },
      { value: '2nd Innings Over 17 Total Runs', label: 'Over 17' },
      { value: '2nd Innings Over 18 Total Runs', label: 'Over 18' },
      { value: '2nd Innings Over 19 Total Runs', label: 'Over 19' },
      { value: '2nd Innings Over 20 Total Runs', label: 'Over 20' },
    ],
  },
  'Total Runs': {
    name: 'total_runs',
    options: [
      { value: 'Over 1 Total Runs', label: 'Over 1' },
      { value: 'Over 2 Total Runs', label: 'Over 2' },
      { value: 'Over 3 Total Runs', label: 'Over 3' },
      { value: 'Over 4 Total Runs', label: 'Over 4' },
      { value: 'Over 5 Total Runs', label: 'Over 5' },
      { value: 'Over 6 Total Runs', label: 'Over 6' },
      { value: 'Over 7 Total Runs', label: 'Over 7' },
      { value: 'Over 8 Total Runs', label: 'Over 8' },
      { value: 'Over 9 Total Runs', label: 'Over 9' },
      { value: 'Over 10 Total Runs', label: 'Over 10' },
      { value: 'Over 11 Total Runs', label: 'Over 11' },
      { value: 'Over 12 Total Runs', label: 'Over 12' },
      { value: 'Over 13 Total Runs', label: 'Over 13' },
      { value: 'Over 14 Total Runs', label: 'Over 14' },
      { value: 'Over 15 Total Runs', label: 'Over 15' },
      { value: 'Over 16 Total Runs', label: 'Over 16' },
      { value: 'Over 17 Total Runs', label: 'Over 17' },
      { value: 'Over 18 Total Runs', label: 'Over 18' },
      { value: 'Over 19 Total Runs', label: 'Over 19' },
      { value: 'Over 20 Total Runs', label: 'Over 20' },
    ],
  },
}
