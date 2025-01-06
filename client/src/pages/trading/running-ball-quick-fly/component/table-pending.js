import React from 'react'
import { connect } from 'react-redux'
import { Space, Table, Typography } from 'antd'
import { getGameTypeDescriptionShort, getBetChoice } from 'helper'

const { Text } = Typography

const PendingTable = ({ data, type }) => {
  const newData = React.useMemo(() => data?.map((e, index) => ({ ...e, key: index })), [data])
  const getColumnTitle = text => {
    switch (text) {
      case 'pending':
        return 'PENDING'
      case 'accept':
        return 'ACCEPT'
      case 'reject':
        return 'REJECT'
      default:
        return null
    }
  }
  const getHeaderColor = text => {
    switch (text) {
      case 'pending':
        return { backgroundColor: '#f5f988', color: 'black' }
      case 'accept':
        return { backgroundColor: '#8df989', color: 'black' }
      case 'reject':
        return { backgroundColor: '#c63636', color: 'white' }
      default:
        return null
    }
  }
  const columns = [
    {
      title: getColumnTitle(type),
      width: 200,
      render: ({
        username,
        game_type,
        bet_choice,
        currency,
        bet_amount,
        handicap,
        odds,
        accept_timer,
        home_posisi,
        away_posisi,
        home_name,
        away_name,
        team,
        color,
      }) => {
        const USERNAME = <Text className="font-weight-bold">{username}</Text>
        const BET_CHOICE = (
          <Text style={{ color: `#${color}`, fontWeight: 'bold' }}>
            {[5, 6].includes(game_type) ? getBetChoice(bet_choice, home_name, away_name) : team}
          </Text>
        )
        const ACCEPT_TIMER = (
          <Text style={{ color: 'red', fontWeight: 'bold' }}>{accept_timer}</Text>
        )
        return (
          <Space size={2} wrap>
            {USERNAME}/{getGameTypeDescriptionShort(game_type)}/{BET_CHOICE}/{home_posisi}-
            {away_posisi}/{`${currency}${bet_amount} (${Math.abs(handicap)}@${odds})`}/
            {ACCEPT_TIMER}
          </Space>
        )
      },
      onHeaderCell: () => ({ style: { fontWeight: 'bold', ...getHeaderColor(type) } }),
    },
  ]
  return (
    <Table
      rowKey="key"
      rowClassName={type === 'pending' && 'pending'}
      bordered
      size="small"
      columns={columns}
      dataSource={newData}
      pagination={false}
      scroll={{ y: 300 }}
    />
  )
}

export default connect(null, null)(PendingTable)
