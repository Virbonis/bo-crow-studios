import React from 'react'
import { Button, Col, Row, Space, Table, Tooltip } from 'antd'
import { Amount, CustomizeCell } from 'components/blaise'
import { getScore } from 'helper'
import ButtonTradingInfo from './button-trading-info'
import MOBetListSummary from '../mo-bet-list-summary'
import { transmuteData } from './query'
import './custom.scss'

const TableForecast = ({
  columnHDP,
  columnOU,
  loading,
  data,
  setVisibleSingleForecast,
  setSingleForecastValue,
  isSingleForecast = false,
  isArchive = false,
  ...restProps
}) => {
  const columnForecast = React.useMemo(
    () => [
      {
        title: 'Match ID',
        width: 100,
        align: 'center',
        fixed: 'left',
        render: record => {
          const gameType = record.GT === 'FT' ? '' : `(${record.GT})`
          return (
            <MOBetListSummary {...record} enableReset={!isSingleForecast && !isArchive}>
              {record.match_id} {gameType}
            </MOBetListSummary>
          )
        },
        onCell: () => {
          return {
            style: { verticalAlign: 'middle' },
          }
        },
      },
      {
        title: 'Home Away',
        width: 300,
        align: 'center',
        fixed: 'left',
        onCell: ({ GT, order_ah, order_ou }) => {
          return {
            className: !['HT', 'GH'].includes(GT) ? `${order_ah}${order_ou}` : '',
            style: { verticalAlign: 'middle' },
          }
        },
        render: (x, record) => {
          return (
            <Row gutter={5} justify="space-between" align="middle">
              <Col align="left" flex="1">
                {!isSingleForecast && !isArchive ? (
                  <Button
                    className="font-weight-bold p-0"
                    style={{ textAlign: 'left', textWrap: 'wrap' }}
                    type="link"
                    onClick={() => {
                      setVisibleSingleForecast(true)
                      setSingleForecastValue({ ...record })
                    }}
                  >
                    {record.home_name} - {record.away_name}
                  </Button>
                ) : (
                  <span>{`${record.home_name} - ${record.away_name}`}</span>
                )}
              </Col>
              <Col>
                <Space size={0} align="center">
                  {record.GT === 'FT' && <ButtonTradingInfo {...record} />}
                  {record.rb_result && (
                    <Tooltip title={record.rb_result}>
                      <div className="text_rb">R</div>
                    </Tooltip>
                  )}
                  {record.db_result && (
                    <Tooltip title={record.db_result}>
                      <div className="text_db">D</div>
                    </Tooltip>
                  )}
                  {record.pick_result && (
                    <Tooltip title={record.pick_result}>
                      <div className="text_pick">P</div>
                    </Tooltip>
                  )}
                </Space>
              </Col>
            </Row>
          )
        },
      },
      {
        title: 'Score',
        width: 50,
        align: 'center',
        fixed: 'left',
        render: (x, record) => {
          if (record.match_live_status === 'Y') {
            const score = getScore(record)
            const scoreHome = score[0]
            const scoreAway = score[1]
            return (
              <div className="font-weight-bold mt-2">
                {scoreHome} - {scoreAway}
              </div>
            )
          }
          return null
        },
      },
      {
        title: 'Total',
        width: 100,
        align: 'center',
        fixed: 'left',
        render: record => {
          const marginHome = (
            <Amount
              title={record.margin_home}
              value={record.margin_home}
              bold
              int
              keepMinus={false}
            />
          )
          const marginCenter = (
            <Amount
              title={record.margin_center}
              value={record.margin_center}
              bold
              int
              keepMinus={false}
            />
          )
          const marginAway = (
            <Amount
              title={record.margin_away}
              value={record.margin_away}
              bold
              int
              keepMinus={false}
            />
          )

          return (
            <>
              <Amount title={record.total} value={record.total} bold int />
              <br />
              <span style={{ fontSize: '.75em' }}>
                {marginHome} / {marginCenter} / {marginAway}
              </span>
            </>
          )
        },
      },
      {
        width: 5,
        onCell: () => ({ className: 'td-separator' }),
        onHeaderCell: () => ({ className: 'td-separator' }),
      },
      {
        title: 'HDP + 1X2 + ML + DC + NG/NC + CS (Live)',
        width: 53 * columnHDP.length,
        children: [
          ...columnHDP.map((e, index) => ({
            title: e,
            width: 53,
            align: 'center',
            onCell: record => {
              if (
                record.arrScoreHDP?.length > 0 &&
                record.score_posisi_hdp === index &&
                record.match_live_status === 'Y'
              ) {
                return { style: { backgroundColor: '#fefca7' } }
              }
              return ''
            },
            render: (x, record) => {
              return (
                record.arrScoreHDP?.length > 0 && (
                  <>
                    <Amount
                      title={record.arrScoreHDP[index]}
                      value={record.arrScoreHDP[index]}
                      int
                    />
                    <br />
                    <span style={{ fontSize: '.75em' }}>
                      <Amount
                        title={record.arrBetAmtHDP[index]}
                        value={record.arrBetAmtHDP[index]}
                        int
                        keepMinus={false}
                      />
                    </span>
                  </>
                )
              )
            },
          })),
        ],
      },
      {
        width: 5,
        onCell: () => ({ className: 'td-separator' }),
        onHeaderCell: () => ({ className: 'td-separator' }),
      },
      {
        title: 'OU',
        width: 53 * columnOU.length,
        children: [
          ...columnOU.map((e, index) => ({
            title: e,
            width: 53,
            align: 'center',
            onCell: record => {
              if (
                record.arrScoreOU?.length > 0 &&
                record.score_posisi_ou === index &&
                record.match_live_status === 'Y'
              ) {
                return { style: { backgroundColor: '#fefca7' } }
              }
              return ''
            },
            render: (x, record) => {
              return (
                record.arrScoreOU?.length > 0 && (
                  <>
                    <Amount title={record.arrScoreOU[index]} value={record.arrScoreOU[index]} int />
                    <br />
                    <span style={{ fontSize: '.75em' }}>
                      <Amount
                        title={record.arrBetAmtOU[index]}
                        value={record.arrBetAmtOU[index]}
                        int
                        keepMinus={false}
                      />
                    </span>
                  </>
                )
              )
            },
          })),
        ],
      },
    ],
    [
      columnHDP,
      columnOU,
      setVisibleSingleForecast,
      isSingleForecast,
      setSingleForecastValue,
      isArchive,
    ],
  )

  const newData = React.useMemo(() => {
    return transmuteData(data, columnHDP, columnOU)
  }, [data, columnHDP, columnOU])

  return (
    <Table
      id="table-forecast"
      loading={loading}
      style={{ maxWidth: window.innerWidth }}
      rowKey={record => `${record.match_id}_${record.GT}`}
      columns={columnForecast}
      dataSource={newData}
      bordered
      pagination={false}
      scroll={{ x: 45 * columnHDP.length + 45 * columnOU.length, y: true }}
      sticky
      components={{
        body: {
          cell: CustomizeCell,
        },
      }}
      {...restProps}
    />
  )
}

export default TableForecast
