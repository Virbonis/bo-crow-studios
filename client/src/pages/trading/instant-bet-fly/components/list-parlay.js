import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import actions from 'redux/instant-bet/actions'
import { HDPColumn, TextAwayFav, TextHomeFav } from 'components/blaise'
import { getGameTypeDescriptionShort, listGT } from 'helper'

const mapStateToProps = ({ instantBet }) => ({
  loading: instantBet.loading,
  data: instantBet.listParlay,
})
const mapDispatchToProps = (dispatch, { successCallback }) => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_LIST_PARLAY,
      payload,
      successCallback,
    })
  },
})

const ListParlay = ({ parlay_seq, loading, data, Load }) => {
  React.useEffect(() => {
    if (parlay_seq) Load({ parlay_seq })
  }, [Load, parlay_seq])

  const columns = [
    {
      title: 'League',
      dataIndex: 'league_name',
    },
    {
      title: 'Home',
      render: (text, record) => <TextHomeFav {...record} />,
    },
    {
      title: 'Away',
      render: (text, record) => <TextAwayFav {...record} />,
    },
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      align: 'center',
      render: text => getGameTypeDescriptionShort(text),
      width: 50,
    },
    {
      title: 'Score',
      align: 'center',
      width: 50,
      render: (text, { game_type, home_score, away_score }) => {
        if (
          listGT.Handicap.includes(game_type) ||
          listGT.OverUnder.includes(game_type) ||
          listGT.OddEven.includes(game_type) ||
          listGT['1X2'].includes(game_type)
        )
          return `${home_score} - ${away_score}`
        return null
      },
    },
    {
      title: 'Handicap',
      align: 'center',
      render: record => <HDPColumn {...record} bet_fav_status={record.st_fav} />,
      width: 50,
    },
    {
      title: 'Odds',
      align: 'center',
      dataIndex: 'odds',
      render: text => text !== 0 && text,
      width: 50,
    },
  ]

  return (
    <Table
      bordered
      size="small"
      rowKey="no_txn"
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={false}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ListParlay)
