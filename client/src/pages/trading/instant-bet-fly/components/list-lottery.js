import React from 'react'
import { connect } from 'react-redux'
import { Descriptions, Table } from 'antd'
import actions from 'redux/instant-bet/actions'
import { Amount, TextAwayFav, TextHomeFav } from 'components/blaise'
import { getBetChoice, getGameTypeDescriptionShort } from 'helper'

const mapStateToProps = ({ instantBet }) => ({
  loading: instantBet.loading,
  data: instantBet.listLottery,
  lottery_id: instantBet.listLottery?.[0].lottery_id,
  jackpot_id: instantBet.listLottery?.[0].jackpot_id,
})
const mapDispatchToProps = (dispatch, { successCallback }) => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_LIST_LOTTERY,
      payload,
      successCallback,
    })
  },
})
const ListLottery = ({ bet_id, loading, data, Load, jackpot_id, lottery_id }) => {
  const [getRowSpan] = React.useMemo(() => {
    const isFirstRow = (match_id, choice) => {
      const index = data.findIndex(x => x.match_id === match_id && x.choice === choice)
      if (index === -1) return false
      if (index === 0) return true
      const prev = data[index - 1]
      return prev.match_id !== match_id
    }
    const rowCount = match_id => data.filter(x => x.match_id === match_id).length

    return [
      (match_id, choice) => {
        if (!isFirstRow(match_id, choice)) return 0
        return rowCount(match_id)
      },
    ]
  }, [data])
  React.useEffect(() => {
    if (bet_id) Load({ bet_id })
  }, [Load, bet_id])

  const columns = [
    {
      title: 'Match ID',
      align: 'center',
      onCell: ({ match_id, choice }) => ({
        rowSpan: getRowSpan(match_id, choice),
      }),
      render: record => record.match_id,
    },
    {
      title: 'League',
      onCell: ({ match_id, choice }) => ({
        rowSpan: getRowSpan(match_id, choice),
      }),
      render: record => record.league_name,
    },
    {
      title: 'Home',
      onCell: ({ match_id, choice }) => ({
        rowSpan: getRowSpan(match_id, choice),
      }),
      render: (text, record) => <TextHomeFav {...record} />,
    },
    {
      title: 'Away',
      onCell: ({ match_id, choice }) => ({
        rowSpan: getRowSpan(match_id, choice),
      }),
      render: (text, record) => <TextAwayFav {...record} />,
    },
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => getGameTypeDescriptionShort(text),
      onCell: ({ match_id, choice }) => ({
        rowSpan: getRowSpan(match_id, choice),
      }),
    },
    {
      title: 'Handicap',
      align: 'center',
      onCell: ({ match_id, choice }) => ({
        rowSpan: getRowSpan(match_id, choice),
      }),
      render: record => <Amount value={record.handicap} noColor />,
    },
    {
      title: 'Choice',
      render: record => getBetChoice(record.choice, record.home_name, record.away_name),
    },
  ]

  return (
    <>
      <Descriptions size="small" column={1} className="font-weight-bold" style={{ width: '50%' }}>
        <Descriptions.Item label="Jackpot ID">{jackpot_id}</Descriptions.Item>
        <Descriptions.Item label="Lottery">{lottery_id}</Descriptions.Item>
      </Descriptions>
      <Table
        bordered
        size="small"
        rowKey={record =>
          `${record.match_id}-${record.league_name}-${record.home_name}-${record.away_name}-${record.choice}`
        }
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    </>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(ListLottery)
