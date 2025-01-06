import React from 'react'
import { Descriptions, Space, Table } from 'antd'
import { gameTypeDescription, getScoreGameTypeFGLG, getScoreGameTypeSpecial } from 'helper'
import {
  outrightColumns,
  betbuilderColumns,
  tennisColumns,
  badmintonColumns,
  muayThaiColumns,
  BTIColumns,
} from './columns'

const TableResult = ({ game_type, outright_team_winner, tableData, tableDataBetBuilder }) => {
  if (game_type === 11) {
    const data = outright_team_winner
      .split('^')
      .map((e, index) => ({ outright_team_winner: e, key: index }))
    return <Table columns={outrightColumns} dataSource={data} pagination={false} />
  }

  if (game_type === 5000) {
    return (
      <Table rowKey="match_id" columns={BTIColumns} dataSource={tableData} pagination={false} />
    )
  }
  // skip ↓ part if outright // bti
  return (
    <>
      <Space direction="vertical" size="small">
        {tableData.map(record => (
          <div key={record.match_id}>
            <Table
              rowKey={getRowKey(record)}
              columns={getColumns(record)}
              dataSource={getDataSource(record)}
              pagination={false}
              title={() => (
                <Descriptions size="small" column={1} className="font-weight-bold">
                  <Descriptions.Item label="Match">
                    {record.home_name} - {record.away_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Game Type">
                    {gameTypeDescription[record.game_type]?.long}
                  </Descriptions.Item>
                </Descriptions>
              )}
            />
            {/* {[-1, 4000].includes(game_type) ? <Divider /> : <br />} */}
          </div>
        ))}
      </Space>
      {game_type === 3000 && tableDataBetBuilder.length > 0 && (
        <Table
          rowKey="key"
          bordered
          size="small"
          columns={betbuilderColumns}
          dataSource={tableDataBetBuilder}
          pagination={false}
        />
      )}
    </>
  )
}

const getRowKey = record => {
  if ([11, 32, 56].includes(record.sport_id)) return 'team_name'
  return 'match_id'
}
const getColumns = record => {
  if (record.sport_id === 11) return tennisColumns
  if (record.sport_id === 32) return badmintonColumns
  if (record.sport_id === 56) return muayThaiColumns

  const {
    game_type,
    ht_home_result,
    ht_away_result,
    fs_home_result,
    fs_away_result,
    fg_team,
    lg_team,
  } = record

  const columns = [
    {
      title: 'First Half Score',
      align: 'center',
      width: 120,
      render: ({ ht_home, ht_away, ht_score_status }) => {
        if (ht_score_status === 'REFUND') return 'REFUND'
        if (ht_score_status === 'N') return '-'
        return `${ht_home} - ${ht_away}`
      },
    },
    {
      title: 'Final Score',
      align: 'center',
      width: 120,
      render: ({ fs_home, fs_away, ft_score_status }) => {
        if (ft_score_status === 'REFUND') return 'REFUND'
        if (ft_score_status === 'N') return '-'
        return `${fs_home} - ${fs_away}`
      },
    },
  ]
  // #region get score
  let score = ''
  if (game_type === 14) {
    score = getScoreGameTypeFGLG(fg_team, lg_team)
  } else if (![59, 60].includes(game_type)) {
    score = getScoreGameTypeSpecial(
      game_type,
      ht_home_result,
      ht_away_result,
      fs_home_result,
      fs_away_result,
    )
  }
  if (score !== '') {
    // put score in first column
    columns.unshift({
      title: 'Score',
      align: 'center',
      width: game_type !== 1280 ? 70 : 80,
      render: () => score,
    })
  }
  // #endregion
  return columns
}
const getDataSource = record => {
  // tennis
  if (record.sport_id === 11)
    return [
      {
        team_name: record.home_name,
        score1: record.home1,
        score2: record.home2,
        score3: record.home3,
        score4: record.home4,
        score5: record.home5,
        total_point: record.home6,
        total_set: record.fs_home,
      },
      {
        team_name: record.away_name,
        score1: record.away1,
        score2: record.away2,
        score3: record.away3,
        score4: record.away4,
        score5: record.away5,
        total_point: record.away6,
        total_set: record.fs_away,
      },
    ]
  // badminton
  if (record.sport_id === 32)
    return [
      {
        team_name: record.home_name,
        score1: record.home1,
        score2: record.home2,
        score3: record.home3,
        total_point: record.home6,
        total_set: record.fs_home,
      },
      {
        team_name: record.away_name,
        score1: record.away1,
        score2: record.away2,
        score3: record.away3,
        total_point: record.away6,
        total_set: record.fs_away,
      },
    ]
  // muay thai
  if (record.sport_id === 56)
    return [
      {
        team_name: record.home_name,
        score: getMuayThaiScore(record.fs_home, record.fs_away),
        status: getMuayThaiStatus(record.fs_home, record.fs_away),
      },
      {
        team_name: record.away_name,
        score: getMuayThaiScore(record.fs_away, record.fs_home),
      },
    ]
  // else
  return [record]
}
const getMuayThaiScore = (home, away) => {
  if (home === 6 && away === 6) return 'Draw'
  if (home > away) return 'Win'
  if (home < away) return 'Loss'
  return ''
}
const getMuayThaiStatus = (home, away) => {
  if (home === 6 && away === 6) return '5 Rounds Completed'
  if (home === 1 || away === 1) return 'KO in Round 1'
  if (home === 2 || away === 2) return 'KO in Round 2'
  if (home === 3 || away === 3) return 'KO in Round 3'
  if (home === 4 || away === 4) return 'KO in Round 4'
  if (home === 5 || away === 5) return 'KO in Round 5'
  if (home === 6 || away === 6) return '5 Rounds Completed'
  return ''
}

export default TableResult
