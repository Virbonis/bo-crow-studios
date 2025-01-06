import { Button, Descriptions, Drawer, Table, Tooltip, Typography } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/trading-info/actions'

const { Text } = Typography

const ButtonTradingInfo = ({
  match_id,
  home_name,
  away_name,
  interval_trader_info,
  message,
  stamp_user,
}) => {
  const [visibleTradingInfo, setVisibleTradingInfo] = React.useState()

  const classNameButton = interval_trader_info >= 0 && interval_trader_info <= 30 ? 'blink' : ''

  if (!stamp_user) return null
  return (
    <>
      <Tooltip title={`${message} by ${stamp_user}`}>
        <span
          className={`text_info ${classNameButton}`}
          role="button"
          tabIndex={0}
          onKeyDown={() => setVisibleTradingInfo(true)}
          onClick={() => setVisibleTradingInfo(true)}
        >
          I
        </span>
      </Tooltip>
      <Drawer
        title="Trading Info"
        open={visibleTradingInfo}
        onClose={() => setVisibleTradingInfo(false)}
        width="45%"
        destroyOnClose
        footer={<Button onClick={() => setVisibleTradingInfo(false)}>Close</Button>}
      >
        <TableTradingInfo match_id={match_id} home_name={home_name} away_name={away_name} />
      </Drawer>
    </>
  )
}

const mapStateToProps = ({ tradingInfo }) => ({
  loading: tradingInfo.loadingData,
  data: tradingInfo.data,
})
const mapDispatchToProps = dispatch => ({
  LoadTradingInfo: payload => dispatch({ type: actions.LOAD_TABLE, payload }),
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const getOrderAHOU = status => {
  switch (status) {
    case 'A':
      return 'Away'
    case 'H':
      return 'Home'
    case 'O':
      return 'Over'
    case 'U':
      return 'Under'
    case 'N':
      return <Text className="text-danger">None</Text>
    default:
      return ''
  }
}
const columns = [
  {
    title: 'Message',
    dataIndex: 'message',
  },
  {
    title: 'AH',
    align: 'center',
    dataIndex: 'order_ah',
    render: text => getOrderAHOU(text),
  },
  {
    title: 'OU',
    align: 'center',
    dataIndex: 'order_ou',
    render: text => getOrderAHOU(text),
  },
  {
    title: 'Stamp User',
    align: 'center',
    dataIndex: 'stamp_user',
  },
]
const TableTradingInfo = connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  ({
    match_id,
    home_name,
    away_name,

    loading,
    data,
    LoadTradingInfo,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    React.useEffect(() => {
      LoadTradingInfo({ match_id })
    }, [match_id, LoadTradingInfo])

    return (
      <>
        <Descriptions size="small" column={1} className="font-weight-bold">
          <Descriptions.Item label="Match ID">{match_id}</Descriptions.Item>
          <Descriptions.Item label="Team">{`${home_name} - ${away_name}`}</Descriptions.Item>
        </Descriptions>
        <Table
          bordered
          rowKey="id"
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      </>
    )
  },
)

export default ButtonTradingInfo
