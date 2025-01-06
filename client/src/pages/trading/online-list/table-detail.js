import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Popover, Table } from 'antd'
import { isEqual } from 'lodash'
import { gameTypeDescription } from 'helper'
import { Amount } from 'components/blaise'
import TableDetailGameType from './table-detail-gametype'
import { countWL, createDataTotal, genScoreSubList, genScoreSubListNba } from './helper'

const pairedGameType = game_type => {
  switch (game_type) {
    case 0:
    case 2:
      return 0
    case 5:
    case 6:
      return 5
    case 1:
    case 8:
      return 1
    default:
      return game_type
  }
}
const setData = (source, data) => {
  source.home_posisi += data.home_posisi
  source.away_posisi += data.away_posisi
  source.home_score += data.home_score
  source.away_score += data.away_score
  source.match_home += data.match_home
  source.match_away += data.match_away
  source.t_home += data.t_home
  source.t_away += data.t_away
  source.t_draw += data.t_draw
  source.liab_home += data.liab_home
  source.liab_away += data.liab_away
  source.liab_draw += data.liab_draw
}

const TableDetail = React.memo(
  ({
    league_name,
    home_name,
    away_name,
    home_score,
    away_score,
    sub_match_st_fav,
    ev_round,
    game_type,
    dataTableGameType,
    reportType,
  }) => {
    const [showDetail, setShowDetail] = useState(false)
    const [showTeamColumn, setShowTeamColumn] = useState(true)
    const [headerColumns, setHeaderColumns] = useState([])

    const leagueName = (
      <>
        {league_name} <br /> ({home_name}) vs {away_name}
      </>
    )

    useEffect(() => {
      const fnGenScoreColumn = reportType === 'multi3' ? genScoreSubList : genScoreSubListNba
      const generatedScores = fnGenScoreColumn(
        home_score,
        away_score,
        sub_match_st_fav,
        '',
        ev_round,
        game_type,
      )
      setHeaderColumns(generatedScores)
    }, [reportType, home_score, away_score, sub_match_st_fav, ev_round, game_type])

    const dataTable = dataTableGameType.reduce((acc, curr) => {
      const originGameType = pairedGameType(curr.game_type)
      const index = acc.findIndex(item => item.game_type === originGameType)
      if (index > -1) {
        setData(acc[index], curr)
      } else {
        acc.push({ ...curr, game_type: originGameType })
      }
      return acc
    }, [])

    const columns = [
      {
        title: (
          <Button type="link" className="text-white" onClick={() => setShowDetail(prev => !prev)}>
            {showDetail ? '-' : '+'}
          </Button>
        ),
        align: 'center',
        width: 30,
      },
      {
        title: (
          <Button
            type="link"
            className="w-100 d-inline-block text-white"
            onClick={() => setShowTeamColumn(prev => !prev)}
          >
            {leagueName}
          </Button>
        ),
        dataIndex: 'game_type',
        render: text => gameTypeDescription[text]?.long,
        elipsis: true,
        width: 300,
      },
      {
        title: 'TEAM A',
        align: 'right',
        dataIndex: 't_home',
        width: 120,
        hidden: !showTeamColumn,
      },
      {
        title: 'TEAM B',
        align: 'right',
        dataIndex: 't_away',
        width: 120,
        hidden: !showTeamColumn,
      },
      {
        title: 'DRAW',
        dataIndex: 't_draw',
        align: 'right',
        width: 120,
        hidden: !showTeamColumn,
      },
      {
        title: 'DIFF',
        align: 'right',
        width: 120,
        render: ({ t_home, t_away }) => <Amount value={t_home - t_away} int />,
        hidden: !showTeamColumn,
      },
      ...getScoreColumns(reportType, headerColumns, setHeaderColumns, leagueName),
    ].filter(e => !e.hidden)

    const detailDataGameType = React.useMemo(
      () =>
        dataTableGameType.reduce((acc, curr, idx) => {
          const { type } = curr
          const index = acc.findIndex(e => e.some(v => v.type === type))
          if (index !== -1) acc[index].push({ ...curr, key: idx })
          else acc.push([{ ...curr, key: idx }])
          return acc
        }, []),
      [dataTableGameType],
    )

    return (
      <>
        <Table
          bordered
          rowKey={record => `${record.league_name}-${record.game_type}`}
          columns={columns}
          dataSource={dataTable}
          pagination={false}
          summary={getSummary(reportType, dataTable, headerColumns, showTeamColumn)}
        />

        {showDetail &&
          detailDataGameType.map((e, index) => (
            <TableDetailGameType
              hide={!showTeamColumn}
              key={`${e.league_name}-${index + 1}`}
              data={e}
              match_live_status={e[0].match_live_status}
              gameType={e[0].game_type}
              header={headerColumns}
            />
          ))}
      </>
    )
  },
  (prev, next) => isEqual(prev.dataTableGameType, next.dataTableGameType),
)
const getScoreColumns = (reportType, headerColumns, setHeaderColumns, leagueName) => {
  const customScoreColIndex = reportType === 'multi3' ? 5 : 0

  return headerColumns.map((score, index) => ({
    title:
      index === customScoreColIndex ? (
        <CustomScore
          leagueName={leagueName}
          customScore={score}
          setCustomScore={value => {
            setHeaderColumns(prev => {
              prev[customScoreColIndex] = value
              return [...prev]
            })
          }}
        />
      ) : (
        score
      ),
    render: (text, record) => <Amount value={countWL(record, score)} length={0} />,
    align: 'right',
    width: 100,
  }))
}

const CustomScore = ({ leagueName, customScore, setCustomScore }) => {
  const [form] = Form.useForm()

  const formChangeScore = (
    <Form
      form={form}
      initialValues={{ home: customScore.split('-')[0], away: customScore.split('-')[1] }}
      onFinish={values => {
        setCustomScore(`${values.home}-${values.away}`)
      }}
    >
      <Form.Item name="home" label="TEAM A">
        <Input style={{ width: 50 }} />
      </Form.Item>
      <Form.Item name="away" label="TEAM B">
        <Input style={{ width: 50 }} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Update
      </Button>
    </Form>
  )
  return (
    <Popover
      placement="left"
      trigger="click"
      title={leagueName}
      content={formChangeScore}
      onVisibleChange={() => form.resetFields()}
    >
      <Button type="link" className="p-0 text-white">
        {customScore}
      </Button>
    </Popover>
  )
}

const getSummary = (reportType, data, headerColumns, showTeamColumn) => () => {
  if (headerColumns.length === 0) return null
  const dataTotal = createDataTotal(data, headerColumns)
  return (
    <Table.Summary.Row>
      <Table.Summary.Cell align="center" colSpan={2}>
        Total
      </Table.Summary.Cell>
      {showTeamColumn && (
        <>
          <Table.Summary.Cell align="right">
            <Amount value={dataTotal.team_a} int />
          </Table.Summary.Cell>
          <Table.Summary.Cell align="right">
            <Amount value={dataTotal.team_b} int />
          </Table.Summary.Cell>
          <Table.Summary.Cell align="right">
            <Amount value={dataTotal.draw} int />
          </Table.Summary.Cell>
          <Table.Summary.Cell align="right">
            <Amount value={dataTotal.diff} int />
          </Table.Summary.Cell>
        </>
      )}

      <Table.Summary.Cell align="right">
        <Amount value={dataTotal.score1} int />
      </Table.Summary.Cell>
      <Table.Summary.Cell align="right">
        <Amount value={dataTotal.score2} int />
      </Table.Summary.Cell>
      <Table.Summary.Cell align="right">
        <Amount value={dataTotal.score3} int />
      </Table.Summary.Cell>
      <Table.Summary.Cell align="right">
        <Amount value={dataTotal.score4} int />
      </Table.Summary.Cell>
      <Table.Summary.Cell align="right">
        <Amount value={dataTotal.score5} int />
      </Table.Summary.Cell>
      <Table.Summary.Cell align="right">
        <Amount value={dataTotal.score6} int />
      </Table.Summary.Cell>
      {reportType !== 'multi3' && (
        <>
          <Table.Summary.Cell align="right">
            <Amount value={dataTotal.score7} length={0} />
          </Table.Summary.Cell>
          <Table.Summary.Cell align="right">
            <Amount value={dataTotal.score8} length={0} />
          </Table.Summary.Cell>
          <Table.Summary.Cell align="right">
            <Amount value={dataTotal.score9} length={0} />
          </Table.Summary.Cell>
        </>
      )}
    </Table.Summary.Row>
  )
}

export default TableDetail
