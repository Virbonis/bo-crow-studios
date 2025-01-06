// gt 11
export const outrightColumns = [
  {
    title: 'Team Name',
    dataIndex: 'outright_team_winner',
  },
]
// gt 3000
export const betbuilderColumns = [
  {
    title: 'Selection',
    dataIndex: 'market_name',
    align: 'center',
    width: '50%',
  },
  {
    title: 'Result',
    dataIndex: 'result',
    align: 'center',
    width: '50%',
  },
]
// gt 5000 BTI
export const BTIColumns = [
  {
    title: 'Score',
    dataIndex: 'bti_result_score',
    align: 'center',
  },
  {
    title: 'First Half Score',
    align: 'center',
    render: ({ ht_home, ht_away, ht_score_status }) => {
      if (ht_score_status === 'REFUND') return 'REFUND'
      if (ht_score_status === 'N') return '-'
      return `${ht_home} - ${ht_away}`
    },
  },
  {
    title: 'Final Score',
    align: 'center',
    render: ({ fs_home, fs_away, ft_score_status }) => {
      if (ft_score_status === 'REFUND') return 'REFUND'
      if (ft_score_status === 'N') return '-'
      return `${fs_home} - ${fs_away}`
    },
  },
]

// sportid 11
export const tennisColumns = [
  { title: 'Match', dataIndex: 'team_name', align: 'center', width: 250 },
  { title: `1 Set`, dataIndex: 'score1', align: 'center' },
  { title: `2 Set`, dataIndex: 'score2', align: 'center' },
  { title: `3 Set`, dataIndex: 'score3', align: 'center' },
  { title: `4 Set`, dataIndex: 'score4', align: 'center' },
  { title: `5 Set`, dataIndex: 'score5', align: 'center' },
  { title: 'Total Point', dataIndex: 'total_point', align: 'center' },
  { title: 'Total Set', dataIndex: 'total_set', align: 'center' },
]
// sportid 32
export const badmintonColumns = [
  { title: 'Match', dataIndex: 'team_name', align: 'center', width: 250 },
  { title: `1 Set`, dataIndex: 'score1', align: 'center' },
  { title: `2 Set`, dataIndex: 'score2', align: 'center' },
  { title: `3 Set`, dataIndex: 'score3', align: 'center' },
  { title: 'Total Point', dataIndex: 'total_point', align: 'center' },
  { title: 'Total Set', dataIndex: 'total_set', align: 'center' },
]
// sportid 56
export const muayThaiColumns = [
  { title: 'Match', dataIndex: 'team_name', align: 'center', width: 250 },
  { title: `Full Time Score`, dataIndex: 'score', align: 'center' },
  {
    title: `Status`,
    dataIndex: 'status',
    align: 'center',
    onCell: (_, index) => ({ rowSpan: index === 0 ? 2 : 0 }),
  },
]

const columns = []
export default columns
