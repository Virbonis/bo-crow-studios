import { Button, Table } from 'antd'
import { Amount, BetSlipWLDescription, CustomizeCell } from 'components/blaise'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ memberPendingFunds }) => ({
  loading: memberPendingFunds.loadingDetail,
  tableData: memberPendingFunds.betListRunningData,
})

const BetListRunning = ({ tableData, loading }) => {
  const [expanded, setExpanded] = React.useState([])

  const [getRowSpan, getRowNumber, getFirstRow] = React.useMemo(() => {
    const isFirstRow = (bet_id, index) => {
      const firstIndex = tableData.findIndex(x => x.bet_id === bet_id)
      if (firstIndex === -1) return false
      if (index === firstIndex) return true
      const prev = tableData[index - 1]
      return prev.bet_id !== bet_id
    }
    const rowCount = bet_id => tableData.filter(x => x.bet_id === bet_id).length

    const uniqData = tableData.reduce((acc, cur) => {
      const index = acc.findIndex(x => x.bet_id === cur.bet_id)
      if (index === -1) acc.push(cur)
      return acc
    }, [])

    return [
      (bet_id, index) => {
        if (!isFirstRow(bet_id, index)) return 0
        return rowCount(bet_id)
      },
      bet_id => uniqData.findIndex(x => x.bet_id === bet_id) + 1,
      isFirstRow,
    ]
  }, [tableData])

  const dropDownHandler = React.useCallback(
    bet_id => {
      if (expanded.includes(bet_id)) {
        setExpanded(old => old.filter(data => data !== bet_id))
      } else {
        setExpanded(old => old.concat(bet_id))
      }
    },
    [expanded],
  )

  const columns = React.useMemo(
    () => [
      {
        title: 'No',
        align: 'center',
        width: 30,
        render: (text, record) => getRowNumber(record.bet_id),
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Trans Time',
        align: 'center',
        width: 150,
        render: record => (
          <>
            <span>Ref No. {record.bet_id === 0 ? '' : record.bet_id}</span>
            <br />
            {record.bet_type === 'WML' && (
              <span className="text-danger">
                (Mobile) <br />
              </span>
            )}
            {record.bet_type === 'BUY' && (
              <span className="text-danger">
                (Buyback) <br />
              </span>
            )}
            {record.bet_date.formatDateTimeSecond()}
          </>
        ),
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Choice',
        align: 'right',
        width: 200,
        render: (record, _, index) => {
          if (record.game_type !== -1) {
            return <BetSlipWLDescription {...record} />
          }

          const isFirstRow = getFirstRow(record.bet_id, index)
          return (
            <>
              {isFirstRow && (
                <>
                  <Button
                    type="link"
                    className="p-0"
                    onClick={() => dropDownHandler(record.bet_id)}
                  >
                    Mix Parlay
                  </Button>
                  <br />
                </>
              )}
              {expanded.includes(record.bet_id) && <BetSlipWLDescription {...record} />}
            </>
          )
        },
        onCell: ({ bet_id }, index) => ({
          rowSpan: expanded.includes(bet_id) ? 1 : getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Odds',
        align: 'center',
        dataIndex: 'odds',
        width: 80,
        render: text => <Amount value={text} length={3} />,
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Stake',
        align: 'right',
        dataIndex: 'bet_amount',
        width: 80,
        render: text => <Amount value={text} />,
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Status',
        align: 'center',
        dataIndex: 'wl_status',
        width: 80,
        render: text => {
          if (text === 'W') return 'Win'
          if (text === 'L') return 'Loss'
          if (text === 'D') return 'Draw'
          if (text === 'C') return 'Cancelled'
          return text === '' ? 'Running' : text
        },
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
    ],
    [getRowSpan, expanded, getFirstRow, getRowNumber, dropDownHandler],
  )

  return (
    <Table
      rowKey={rowKey}
      bordered
      size="small"
      loading={loading}
      dataSource={tableData}
      columns={columns}
      pagination={false}
      components={{
        body: {
          cell: CustomizeCell,
        },
      }}
    />
  )
}
const rowKey = x => `${x.bet_id}-${x.match_id}-${x.bet_choice}}-${x.home_name}-${x.away_name}`

export default connect(mapStateToProps)(BetListRunning)
