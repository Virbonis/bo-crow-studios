import { MapListSpecialBasket } from 'helper'

export const getScoringMatchOptions = game_type => {
  if ([20, 22].includes(game_type)) {
    return [
      { value: 0, label: 'Unscored/To Reset' },
      { value: 1, label: 'Yes' },
      { value: -1, label: 'No' },
    ]
  }
  if (game_type === 21) {
    return [
      { value: 0, label: 'Unscored/To Reset' },
      { value: 1, label: 'Free Kick' },
      { value: 2, label: 'Header' },
      { value: 3, label: 'No Goal' },
      { value: 4, label: 'Own Goal' },
      { value: 5, label: 'Penalty' },
      { value: 6, label: 'Shot' },
    ]
  }
  if ([23, 24].includes(game_type)) {
    return [
      { value: 0, label: 'Unscored/To Reset' },
      { value: -1, label: 'None' },
      { value: 1, label: 'Home' },
      { value: 2, label: 'Away' },
    ]
  }
  if (game_type === 25) {
    return [
      { value: 0, label: 'Unscored/To Reset' },
      { value: 1, label: '27th Minute Onwards' },
      { value: 2, label: 'Up To And Including The 26th Minute' },
      { value: 3, label: 'No Goal' },
    ]
  }
  if (game_type === 26) {
    return [
      { value: '0', label: 'Unscored/To Reset' },
      { value: '0-0', label: 'None' },
      { value: '1-0', label: 'Home' },
      { value: '0-1', label: 'Away' },
      { value: '1-1', label: 'Both' },
    ]
  }
  if (game_type === 27) {
    return [
      { value: 0, label: 'Unscored/To Reset' },
      { value: 1, label: '1 Minute' },
      { value: 2, label: '2 Minute' },
      { value: 3, label: '3 Minute' },
      { value: 4, label: '4 Minute' },
      { value: 5, label: '5 Minute or More' },
      { value: 6, label: 'None' },
    ]
  }
  if (game_type === 33) {
    return [
      { value: 0, label: 'Unscored/To Reset' },
      { value: 1, label: 'Home' },
      { value: 2, label: 'Away' },
    ]
  }
  if (game_type === 35) {
    return [
      { value: 0, label: 'Unscored/To Reset' },
      { value: 1, label: 'Any Goal Score Draw' },
      { value: 2, label: 'Home Team To Win By 1 Goal' },
      { value: 3, label: 'Home Team To Win By 2 Goals' },
      { value: 4, label: 'Home Team To Win By 3 Goals' },
      { value: 5, label: 'Home Team To Win By 4 or More Goals' },
      { value: 6, label: 'Away Team To Win By 1 Goal' },
      { value: 7, label: 'Away Team To Win By 2 Goals' },
      { value: 8, label: 'Away Team To Win By 3 Goals' },
      { value: 9, label: 'Away Team To Win By 4 Goals' },
      { value: 10, label: 'No Goal' },
    ]
  }
  return []
}
export const getCancelMatchOptions = game_type => {
  if (
    [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49].includes(game_type) // prettier-ignore
  ) {
    return [
      { source: 'N^', value: 'RESET', label: 'Uncancelled/To Reset' },
      { source: 'Y', value: 'GAMETYPE', label: 'Per GameType' },
      { source: 'N', value: 'CHOICE', label: 'Per Choice' },
    ]
  }
  if (
    [50, 1101, 1104, 1107, 1110, 1113]
      .concat(Object.values(MapListSpecialBasket).flat())
      .includes(game_type)
  ) {
    return [
      { source: 'N^', value: 'RESET', label: 'Uncancelled/To Reset' },
      { source: 'Y', value: 'GAMETYPE', label: 'Per GameType' },
    ]
  }
  return []
}
export const reasonOptions = [
  { value: 3, label: 'Incorrect Team Name' },
  { value: 4, label: 'Incorrect Bet Entry' },
  { value: 5, label: 'Abnormal Bets' },
  { value: 6, label: 'System Error' },
  { value: 7, label: 'Test Bet' },
  { value: 8, label: 'Duplicate Bet' },
  { value: 9, label: 'Promotional Bet' },
  { value: 10, label: 'Cancelled by Other Bookmark' },
  { value: 11, label: 'Postponed Game' },
  { value: 12, label: 'Incorrect Score' },
  { value: 13, label: 'Incorrect Odds' },
  { value: 14, label: 'Incorect Handicap' },
  { value: 15, label: 'Incorrect Favorite' },
  { value: 16, label: 'Incorrect Over/Under' },
  { value: 17, label: 'Distruption' },
  { value: 18, label: 'Incorrect Fixtures' },
  { value: 19, label: 'Match Completed' },
  { value: 20, label: 'Started Early' },
  { value: 90, label: 'Red Card'.toUpperCase() },
  { value: 91, label: 'Goal'.toUpperCase() },
  { value: 92, label: 'Penalty'.toUpperCase() },
  { value: 93, label: 'Corner'.toUpperCase() },
  { value: 99, label: 'Other' },
]
export const scoreOptions = {
  20: [
    { value: 1, label: 'Yes' },
    { value: -1, label: 'No' },
  ],
  21: [
    { value: 1, label: 'Free Kick' },
    { value: 2, label: 'Header' },
    { value: 3, label: 'No Goal' },
    { value: 4, label: 'Own Goal' },
    { value: 5, label: 'Penalty' },
    { value: 6, label: 'Shot' },
  ],
  22: [
    { value: 1, label: 'Yes' },
    { value: -1, label: 'No' },
  ],
  23: [
    { value: -1, label: 'None' },
    { value: 1, label: 'Home' },
    { value: 2, label: 'Away' },
  ],
  24: [
    { value: -1, label: 'None' },
    { value: 1, label: 'Home' },
    { value: 2, label: 'Away' },
  ],
  25: [
    { value: 1, label: '27th Minute Onwards' },
    { value: 2, label: 'Up To And Including The 26th Minute' },
    { value: 3, label: 'No Goal' },
  ],
  26: [
    { value: '0-0', label: 'None' },
    { value: '1-0', label: 'Home' },
    { value: '0-1', label: 'Away' },
    { value: '1-1', label: 'Both' },
  ],
  27: [
    { value: 1, label: '1 Minute' },
    { value: 2, label: '2 Minute' },
    { value: 3, label: '3 Minute' },
    { value: 4, label: '4 Minute' },
    { value: 5, label: '5 Minute or More' },
    { value: 6, label: 'None' },
  ],
  33: [
    { value: 1, label: 'Home' },
    { value: 2, label: 'Away' },
  ],
  35: [
    { value: 1, label: 'Any Goal Score Draw' },
    { value: 2, label: 'Home Team To Win By 1 Goal' },
    { value: 3, label: 'Home Team To Win By 2 Goals' },
    { value: 4, label: 'Home Team To Win By 3 Goals' },
    { value: 5, label: 'Home Team To Win By 4 or More Goals' },
    { value: 6, label: 'Away Team To Win By 1 Goal' },
    { value: 7, label: 'Away Team To Win By 2 Goals' },
    { value: 8, label: 'Away Team To Win By 3 Goals' },
    { value: 9, label: 'Away Team To Win By 4 Goals' },
    { value: 10, label: 'No Goal' },
  ],
}
export const choiceOptions = {
  20: [
    { value: `BTSY`, label: 'Yes' },
    { value: `BTSN`, label: 'No' },
  ],
  21: [
    { value: `FGM1`, label: 'Free Kick' },
    { value: `FGM2`, label: 'Header' },
    { value: `FGM3`, label: 'No Goal' },
    { value: `FGM4`, label: 'Own Goal' },
    { value: `FGM5`, label: 'Penalty' },
    { value: `FGM6`, label: 'Shot' },
  ],
  22: [
    { value: `PenY`, label: 'Yes' },
    { value: `PenN`, label: 'No' },
  ],
  23: [
    { value: `R2GH`, label: 'Home' },
    { value: `R2GA`, label: 'Away' },
  ],
  24: [
    { value: `R3GH`, label: 'Home' },
    { value: `R3GA`, label: 'Away' },
  ],
  25: [
    { value: `T1G1`, label: '27th Minute Onwards' },
    { value: `T1G2`, label: '26th Minute' },
    { value: `T1G3`, label: 'No Goal' },
  ],
  26: [
    { value: `SBH`, label: 'Home' },
    { value: `SBA`, label: 'Away' },
  ],
  27: [
    { value: `Inj1`, label: '1 Minute' },
    { value: `Inj2`, label: '2 Minute' },
    { value: `Inj3`, label: '3 Minute' },
    { value: `Inj4`, label: '4 Minute' },
    { value: `Inj5`, label: '5 Minute or More' },
    { value: `Inj0`, label: 'None' },
  ],
  28: [
    { value: `DNBH`, label: 'Home' },
    { value: `DNBA`, label: 'Away' },
  ],
  29: [
    { value: `HMC1`, label: '1st Half' },
    { value: `HMC2`, label: '2nd Half' },
    { value: `HMCX`, label: 'Draw' },
  ],
  30: [
    { value: `HMG1`, label: '1st Half' },
    { value: `HMG2`, label: '2nd Half' },
    { value: `HMGX`, label: 'Draw' },
  ],
  33: [
    { value: `WFB1`, label: 'Home' },
    { value: `WFB2`, label: 'Away' },
  ],
  34: [
    { value: `WN1`, label: 'Home' },
    { value: `WN2`, label: 'Away' },
  ],
  35: [
    { value: `WMX`, label: 'Draw' },
    { value: `WMH1`, label: 'Home 1 Goal' },
    { value: `WMH2`, label: 'Home 2 Goal' },
    { value: `WMH3`, label: 'Home 3 Goal' },
    { value: `WMH4`, label: 'Home 4>= Goal' },
    { value: `WMA1`, label: 'Away 1 Goal' },
    { value: `WMA2`, label: 'Away 2 Goal' },
    { value: `WMA3`, label: 'Away 3 Goal' },
    { value: `WMA4`, label: 'Away 4>= Goal' },
    { value: `WM0`, label: 'No Goal' },
  ],
  37: [
    { value: `HNBA`, label: 'Away' },
    { value: `HNBD`, label: 'Draw' },
  ],
  38: [
    { value: `ANBH`, label: 'Home' },
    { value: `ANBD`, label: 'Draw' },
  ],
  39: [
    { value: `3WHH`, label: 'Home' },
    { value: `3WHA`, label: 'Away' },
    { value: `3WHD`, label: 'Draw' },
  ],
  40: [
    { value: `CSHY`, label: 'Home Yes' },
    { value: `CSHN`, label: 'Home No' },
    { value: `CSAY`, label: 'Away Yes' },
    { value: `CSAN`, label: 'Away No' },
  ],
  41: [
    { value: `2BTY`, label: 'Yes' },
    { value: `2BTN`, label: 'No' },
  ],
  42: [
    { value: `HWHY`, label: 'Yes' },
    { value: `HWHN`, label: 'No' },
  ],
  43: [
    { value: `AWHY`, label: 'Yes' },
    { value: `AWHN`, label: 'No' },
  ],
  44: [
    { value: `HWBY`, label: 'Yes' },
    { value: `HWBN`, label: 'No' },
  ],
  45: [
    { value: `AWBY`, label: 'Yes' },
    { value: `AWBN`, label: 'No' },
  ],
  46: [
    { value: `HSBY`, label: 'Yes' },
    { value: `HSBN`, label: 'No' },
  ],
  47: [
    { value: `ASBY`, label: 'Yes' },
    { value: `ASBN`, label: 'No' },
  ],
  48: [
    { value: `HHH1`, label: '1st Half' },
    { value: `HHH2`, label: '2nd Half' },
    { value: `HHHX`, label: 'Draw' },
  ],
  49: [
    { value: `HHA1`, label: '1st Half' },
    { value: `HHA2`, label: '2nd Half' },
    { value: `HHAX`, label: 'Draw' },
  ],
}

export default getScoringMatchOptions
