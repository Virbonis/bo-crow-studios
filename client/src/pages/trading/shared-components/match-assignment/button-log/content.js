import { Table, Typography } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/match-assignment/actions'

const { Text } = Typography

const mapStateToProps = ({ matchAssignment }) => ({
  loading: matchAssignment.loadingLog,
  data: matchAssignment.dataLog,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_LOG,
      payload,
      source: 'Match Assignment',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_LOG }),
})

const Content = ({ match_id, loading, data, Load, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [orderBy, setOrderBy] = React.useState('StampDate')
  React.useEffect(() => {
    Load({ match_id, order_by: orderBy })
  }, [Load, match_id, orderBy])

  const getSortObject = key => ({
    key,
    sorter: true,
    sortDirections: ['descend', 'descend'],
    sortOrder: orderBy === key ? 'descend' : null,
  })
  const columns = [
    {
      title: 'Action Date',
      dataIndex: 'stamp_date',
      align: 'center',
      width: 120,
      ...getSortObject('StampDate'),
    },
    {
      title: 'Stamp User',
      dataIndex: 'stamp_user',
      align: 'center',
      width: 100,
    },
    {
      title: 'Match/League',
      dataIndex: 'match_league',
      align: 'center',
      width: 100,
    },
    {
      title: 'RB',
      dataIndex: 'rb_game',
      width: 100,
      render: text => (text === 'HTFT' ? 'HT & FT' : text),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: 100,
    },
    {
      title: 'Trader',
      dataIndex: 'trader_name',
      align: 'center',
      width: 100,
      ...getSortObject('TraderName'),
    },
  ]

  const onRow = (record, index) => {
    if (orderBy !== 'TraderName') return {}
    if (index === data.length - 1) return {}

    const isLastIndexTraderName = record.trader_name !== data[index + 1]?.trader_name
    return {
      className: isLastIndexTraderName ? 'custom_border_bottom' : '',
    }
  }

  return (
    <>
      <Table
        rowKey="row_id"
        size="small"
        bordered
        loading={loading}
        pagination={false}
        dataSource={data}
        columns={columns}
        onChange={(p, f, sorter) => {
          setOrderBy(sorter.columnKey)
        }}
        onRow={onRow}
        scroll={{
          y: 500,
        }}
      />
      <Text className="text-danger font-weight-bold mt-1">
        Note: Dash (-) means Match is removed
      </Text>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Content)
