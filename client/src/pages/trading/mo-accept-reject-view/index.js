import { ReloadOutlined } from '@ant-design/icons'
import { Button, Form, Select, Space, Table } from 'antd'
import {
  Amount,
  HDPColumn,
  TextAwayFav,
  TextHomeFav,
  VIPUsername,
  getBetScore,
  GameTypeColumn,
} from 'components/blaise'
import { getStatusAcRj } from 'helper'
import React from 'react'
import QueryAcceptRejectViewList from './query'
import { getAcceptRejectClass } from '../mo-accept-reject/table'

const columns = [
  {
    title: 'Username',
    render: record => <VIPUsername username={record.username} vip_code={record.vip_code} />,
    width: 115,
  },
  { title: 'Branch', dataIndex: 'branch_alias' },
  {
    title: 'Bet ID',
    dataIndex: 'bet_id',
  },
  {
    title: 'DS',
    align: 'center',
    render: ({ status, void_id, early_counter, ev_round, comp_type }) =>
      getStatusAcRj(status, void_id, early_counter, ev_round, comp_type),
    width: 35,
  },
  {
    title: 'Home/Over',
    render: record => <TextHomeFav {...record} />,
    width: 100,
  },
  {
    title: 'Away/Under',
    render: record => <TextAwayFav {...record} />,
    width: 100,
  },
  {
    title: 'Game Type',
    align: 'center',
    render: record => {
      // hardcode parlay_combo_ticket = 1 biar ga jadi button
      return <GameTypeColumn {...record} parlay_combo_ticket={1} />
    },
    width: 50,
  },
  {
    title: 'Score',
    align: 'center',
    render: record => getBetScore(record),
    width: 50,
  },
  {
    title: 'HDP',
    align: 'center',
    render: record => <HDPColumn {...record} bet_fav_status={record.st_fav} />,
    width: 50,
  },
  {
    title: 'Odds',
    align: 'right',
    dataIndex: 'odds',
    render: text => <Amount value={text} />,
    width: 50,
  },
  {
    title: 'C.Amt',
    align: 'right',
    dataIndex: 'bet_amount_comp',
    render: text => <Amount value={text} bold />,
    width: 50,
  },
  {
    title: 'Amt',
    align: 'right',
    dataIndex: 'bet_amount',
    render: text => <Amount value={text} bold className="text-magenta" />,
    width: 50,
  },
  {
    title: 'Bet Date',
    dataIndex: 'bet_date',
    render: text => text.formatDateTimeSecond(),
    width: 100,
  },
  {
    title: 'AcRj Date',
    dataIndex: 'date_reject_accept',
    render: text => text && text.formatDateTimeSecond(),
    width: 100,
  },
  {
    title: 'Pending Time (s)',
    dataIndex: 'pending_time',
    render: text => text > 0 && text,
  },
  {
    title: 'Stampuser',
    dataIndex: 'trader_name',
  },
]
const MOAcRjView = ({ match_id }) => {
  const [viewParameter, setViewParameter] = React.useState({
    interval: 3000,
    display: 50,
    ftht: 'FTHT',
    pending: '',
  })

  const { data, isFetching, refetch } = QueryAcceptRejectViewList({
    match_id,
    ...viewParameter,
  })
  React.useEffect(() => {
    refetch()
  }, [match_id, refetch])

  return (
    <>
      <Form
        size="small"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={viewParameter}
        onValuesChange={values => {
          setViewParameter(old => ({ ...old, values }))
        }}
        layout="inline"
      >
        <Space>
          <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
            Refresh
          </Button>
          <Form.Item name="interval" noStyle>
            <Select
              style={{ width: 75 }}
              size="small"
              options={[
                { value: 0, label: 'None' },
                { value: 3, label: '3' },
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 15, label: '15' },
                { value: 30, label: '30' },
                { value: 60, label: '60' },
              ]}
            />
          </Form.Item>
          <Form.Item name="display" noStyle>
            <Select
              style={{ width: 75 }}
              size="small"
              options={[
                { value: 50, label: '50 rec' },
                { value: 100, label: '100 rec' },
                { value: 200, label: '200 rec' },
              ]}
            />
          </Form.Item>
          <Form.Item name="ftht" noStyle>
            <Select
              style={{ width: 75 }}
              options={[
                { value: 'FTHT', label: 'FT/HT' },
                { value: 'FT', label: 'FT' },
                { value: 'HT', label: 'HT' },
              ]}
            />
          </Form.Item>
          <Form.Item name="pending">
            <Select
              style={{ width: 100 }}
              size="small"
              options={[
                { value: '', label: 'Show All' },
                { value: '1', label: 'Accept' },
                { value: '0', label: 'Pending' },
              ]}
            />
          </Form.Item>
        </Space>
      </Form>
      <Table
        id="table-bet-listing"
        rowKey="bet_id"
        className="w-100 h-100"
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{ x: '100%', y: true }}
        onRow={({ status, void_id, game_type }) => ({
          className: getAcceptRejectClass(status, void_id, game_type),
        })}
      />
    </>
  )
}

export default MOAcRjView
