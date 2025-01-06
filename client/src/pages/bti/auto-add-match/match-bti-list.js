import { ReloadOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ BTIautoAddMatch }) => ({
  loading: BTIautoAddMatch.loading_mapped,
  dataTable: BTIautoAddMatch.data_mapped,
})

const columns = [
  {
    title: 'BTI Match ID',
    width: 150,
    render: (text, record) => {
      return (
        <div>
          {record.match_id}
          <br />
          {record.start_event_date.formatDateTime()}
        </div>
      )
    },
  },
  {
    title: 'Result',
    width: 100,
    render: (text, record) => {
      const { home_result, away_result, is_canceled, result_date } = record
      return (
        <>
          {home_result}-{away_result}
          {is_canceled && <span className="text-danger float-right">Canceled</span>}
          <br />
          {result_date && result_date.formatDateTime()}
        </>
      )
    },
  },
  {
    title: 'Match ID',
    dataIndex: 'm_match_id',
    width: 100,
  },
  {
    title: 'League',
    width: 110,
    render: (text, record) => {
      const { m_league_id, m_league_name } = record
      return (
        <>
          ({m_league_id})
          <br />
          {m_league_name}
        </>
      )
    },
  },
  {
    title: 'Home Team',
    width: 110,
    render: (text, record) => {
      const { m_home_id, m_home_name } = record
      return (
        <>
          ({m_home_id})
          <br />
          {m_home_name}
        </>
      )
    },
  },
  {
    title: 'Away Team',
    width: 110,
    render: (text, record) => {
      const { m_away_id, m_away_name } = record
      return (
        <>
          ({m_away_id})
          <br />
          {m_away_name}
        </>
      )
    },
  },
]
const BTIMatchList = ({ loading, dataTable }) => {
  return (
    <Table
      rowKey="match_id"
      columns={columns}
      loading={loading}
      dataSource={dataTable}
      pagination={false}
      title={() => <Button icon={<ReloadOutlined />} form="formList" htmlType="submit" />}
    />
  )
}

export default connect(mapStateToProps, null)(BTIMatchList)
