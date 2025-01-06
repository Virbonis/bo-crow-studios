import React from 'react'
import { gameTypeDescription } from 'helper'
import { Amount, CustomizeCell } from 'components/blaise'
import { Space, Row, Col, Table } from 'antd'
import EditPayout from './edit-payout/index'
import OddsTrigger from './odds-trigger/index'
import EditEventLimit from './edit-event-limit/index'
import EditPayoutSpec from './edit-payout-spec/index'

const sharedOnCell = (_, index) => {
  const props = {}
  if (index % 4 === 0) {
    props.rowSpan = 4
  }
  if (index % 2 === 1 || (index % 2 === 0 && index % 4 !== 0)) {
    props.colSpan = 0
  }
  return props
}

const TableProfile = ({
  dataEventLimit,
  dataPayout,
  dataPayoutSpec,
  form,
  refresh,
  loadingData,
}) => {
  const columnEventLimit = [
    {
      title: 'Seq',
      dataIndex: 'game_type_sequence',
      width: 40,
      align: 'center',
      onCell: sharedOnCell,
    },
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      width: 200,
      onCell: sharedOnCell,
      render: text => {
        return gameTypeDescription[text]?.long
      },
    },
    {
      title: '',
      dataIndex: 'market_group',
      align: 'center',
      width: 40,
    },
    {
      title: 'Step',
      dataIndex: 'step',
      align: 'center',
      width: 40,
    },
    {
      title: 'Odds Trigger',
      dataIndex: 'odds_trigger',
      align: 'right',
      width: 70,
      render: text => <Amount value={Number(text)} length={0} />,
    },
    {
      title: 'Max Limit',
      dataIndex: 'max_limit',
      align: 'right',
      width: 70,
      render: text => <Amount value={Number(text)} length={0} />,
    },
    {
      title: 'Max Bet',
      dataIndex: 'max_bet',
      align: 'right',
      width: 70,
      render: text => <Amount value={Number(text)} length={0} />,
    },
    {
      title: 'Spread',
      dataIndex: 'spread',
      align: 'right',
      width: 70,
    },
    {
      title: 'Action',
      width: 70,
      align: 'center',
      fixed: 'right',
      render: record => (
        <EditEventLimit
          record={{ profile_id: form.getFieldValue('profile_id'), ...record }}
          refresh={refresh}
        />
      ),
    },
  ]
  const columnPayout = [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      width: 200,
      render: (text, record) => {
        return getGameTypeName(text, record.is_live)
      },
    },
    {
      title: 'Max Payout',
      dataIndex: 'max_payout',
      width: 100,
      render: text => <Amount value={Number(text)} length={0} />,
      align: 'right',
    },
    {
      title: 'Max Payout/Ticket',
      dataIndex: 'max_payout_ticket',
      width: 100,
      render: text => <Amount value={Number(text)} length={0} />,
      align: 'right',
    },
    {
      title: 'Max Bet',
      dataIndex: 'max_bet',
      width: 100,
      render: text => <Amount value={Number(text)} length={0} />,
      align: 'right',
    },
    {
      title: 'Spread',
      dataIndex: 'spread',
      width: 70,
      render: (text, record) => showSpreadLAP(record.game_type, text),
      align: 'right',
    },
    {
      title: 'LAP',
      dataIndex: 'lap',
      width: 70,
      render: (text, record) => showSpreadLAP(record.game_type, text),
      align: 'right',
    },
    {
      title: 'Amount Trigger',
      dataIndex: 'amount_trigger',
      width: 70,
      render: text => <Amount value={Number(text)} length={0} />,
      align: 'right',
    },
    {
      title: 'Action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: record => (
        <Space>
          <EditPayout record={record} refresh={refresh} />
          <OddsTrigger
            record={{ profile_id: form.getFieldValue('profile_id'), game_type: record.game_type }}
            title={getGameTypeName(record.game_type, record.is_live)}
          />
        </Space>
      ),
    },
  ]
  const columnPayoutSpec = [
    {
      title: 'Game Type',
      dataIndex: 'game_type_spec',
      width: 200,
      render: (text, record) => {
        return getGameTypeName(text, record.is_live_spec)
      },
    },
    {
      title: 'Max Payout',
      dataIndex: 'max_payout_spec',
      width: 100,
      render: text => <Amount value={Number(text)} length={0} />,
      align: 'right',
    },
    {
      title: 'Max Payout/Ticket',
      dataIndex: 'max_payout_spec_ticket',
      width: 100,
      render: text => <Amount value={Number(text)} length={0} />,
      align: 'right',
    },
    {
      title: 'Max Bet',
      dataIndex: 'max_bet_spec',
      width: 100,
      render: text => <Amount value={Number(text)} length={0} />,
      align: 'right',
    },
    {
      title: 'Amount Trigger',
      dataIndex: 'amount_trigger_spec',
      width: 70,
      render: text => <Amount value={Number(text)} length={0} />,
      align: 'right',
    },
    {
      title: 'Action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: record => {
        return (
          <Space>
            <EditPayoutSpec record={record} refresh={refresh} />
            <OddsTrigger
              record={{
                profile_id: form.getFieldValue('profile_id'),
                game_type: record.game_type_spec,
              }}
              title={getGameTypeName(record.game_type_spec, record.is_live_spec)}
            />
          </Space>
        )
      },
    },
  ]

  return (
    <Row gutter={20} justify="space-between" className="h-100">
      <Col xs={24} sm={24} md={24} lg={12} xl={12} className="h-100">
        <Table
          rowKey={record => record.key}
          size="small"
          dataSource={dataEventLimit}
          columns={columnEventLimit}
          pagination={false}
          loading={loadingData}
          components={{
            body: {
              cell: CustomizeCell,
            },
          }}
          className="h-100"
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} className="h-100">
        <Table
          rowKey={record => record.game_type.toString().concat(record.is_live)}
          size="small"
          dataSource={dataPayout}
          columns={columnPayout}
          pagination={false}
          loading={loadingData}
          components={{
            body: {
              cell: CustomizeCell,
            },
          }}
          className="h-50"
          style={{ paddingBottom: 16 }}
        />
        <Table
          rowKey={record => record.game_type_spec.toString().concat(record.is_live_spec)}
          size="small"
          dataSource={dataPayoutSpec}
          columns={columnPayoutSpec}
          pagination={false}
          loading={loadingData}
          components={{
            body: {
              cell: CustomizeCell,
            },
          }}
          className="h-50"
        />
      </Col>
    </Row>
  )
}

const showSpreadLAP = (game_type, text) => {
  if (game_type === 1 || game_type === 8) return <Amount value={Number(text)} length={0} />
  return null
}

const getGameTypeName = (text, is_live) => {
  return gameTypeDescription[text]?.long.concat(
    is_live === 'Y' && !gameTypeDescription[text]?.long.includes('(Live)') ? ' (Live)' : '',
  )
}

export default TableProfile
