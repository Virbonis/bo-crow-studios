import React from 'react'
import { Button, Drawer, Table } from 'antd'
import { gameTypeDescription, getBetChoiceTrading } from 'helper'
import { connect } from 'react-redux'
import { Amount } from 'components/blaise'
import BetDetail from './bet-detail'
import { countWL } from './helper'

const TableDetailGameType = ({ data, header, hide, match_live_status, gameType }) => {
  const [dataBetDetail, setDataDetail] = React.useState([])
  const [showBetDetail, setShowBetDetail] = React.useState(false)

  const setBetDetail = (record, direction) => {
    setDataDetail({
      match_id: record.match_id,
      match_live_status: record.match_live_status,
      home_score: record.home_posisi,
      away_score: record.away_posisi,
      handicap: record.handicap,
      bet_choice: getBetChoiceTrading(record.game_type, direction),
    })
    setShowBetDetail(true)
  }

  const columns = [
    {
      title: `${match_live_status === 'Y' ? 'RUNNING' : ''} ${gameTypeDescription[
        gameType
      ]?.long.toUpperCase()}`,
      key: 1,
      width: 330,
      render: (text, record) => {
        if ([0, 1, 2, 3, 8, 16].includes(record.game_type))
          return `${record.home_posisi} - ${record.away_posisi}`
        return record.handicap
      },
    },
    {
      title: <Header game_type={gameType} index={1} />,
      align: 'right',
      width: 120,
      hidden: hide,
      render: record => (
        <Button className="p-0" onClick={() => setBetDetail(record, 'H')} type="link">
          {record.t_home}
        </Button>
      ),
    },
    {
      title: <Header game_type={gameType} index={2} />,
      align: 'right',
      width: 120,
      hidden: hide,
      render: record => (
        <Button className="p-0" onClick={() => setBetDetail(record, 'A')} type="link">
          {record.t_away}
        </Button>
      ),
    },
    {
      title: <Header game_type={gameType} index={3} />,
      align: 'right',
      width: 180,
      hidden: hide,
      render: record => {
        if ([1, 8].includes(record.game_type))
          return (
            <Button className="p-0" onClick={() => setBetDetail(record, 'D')} type="link">
              {record.t_draw}
            </Button>
          )
        return record.t_home - record.t_away
      },
    },
    ...header.map(score => ({
      title: score,
      render: (text, record) => <Amount length={0} value={countWL(record, score)} />,
      align: 'right',
      width: 100,
    })),
  ].filter(e => !e.hidden)
  return (
    <>
      <Table
        rowKey="key"
        bordered
        columns={columns}
        dataSource={data}
        pagination={false}
        summary={record => {
          let totalTHome = 0
          let totalTAway = 0
          let totalDiff = 0

          record.forEach(({ t_home, t_away, t_draw, game_type }) => {
            totalTHome += t_home
            totalTAway += t_away
            totalDiff += [1, 8].includes(game_type) ? t_draw : t_home - t_away
          })

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell align="center">Total</Table.Summary.Cell>
              {!hide && (
                <>
                  <Table.Summary.Cell align="right">
                    <Amount length={0} value={totalTHome} />
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    <Amount length={0} value={totalTAway} />
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    <Amount length={0} value={totalDiff} noColor keepMinus />
                  </Table.Summary.Cell>
                </>
              )}
              {header.map(score => {
                const totalScore = record.reduce((acc, curr) => {
                  acc += countWL(curr, score)
                  return acc
                }, 0)
                return (
                  <Table.Summary.Cell align="right" key={score}>
                    <Amount length={0} value={totalScore} />
                  </Table.Summary.Cell>
                )
              })}
            </Table.Summary.Row>
          )
        }}
      />
      <Drawer
        title="Bet Detail"
        width="75%"
        open={showBetDetail}
        destroyOnClose
        onClose={() => {
          setShowBetDetail(false)
        }}
      >
        <BetDetail dataBetDetail={dataBetDetail} />
      </Drawer>
    </>
  )
}

const Header = ({ index, game_type }) => {
  if (index === 1) {
    if ([0, 2].includes(game_type)) return 'TEAM A'
    if ([5, 6].includes(game_type)) return 'OVER'
    if ([3, 16].includes(game_type)) return 'ODD'
    return 'HOME'
  }
  if (index === 2) {
    if ([0, 2].includes(game_type)) return 'TEAM B'
    if ([5, 6].includes(game_type)) return 'UNDER'
    if ([3, 16].includes(game_type)) return 'EVEN'
    return 'AWAY'
  }
  if (index === 3) {
    if ([0, 2, 3, 5, 6, 16].includes(game_type)) return 'DIFF'
    return 'DRAW'
  }
  return null
}

export default connect(null, null)(TableDetailGameType)
