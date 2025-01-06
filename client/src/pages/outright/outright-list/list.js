import React from 'react'
import { Table, Typography } from 'antd'
import { connect } from 'react-redux'

const mapStateToProps = ({ outright }, { outright_id }) => ({
  data: outright[`dataList_${outright_id}`],
  loading: outright[`loadingList_${outright_id}`],
})

const columns = [
  {
    title: 'Team ID',
    align: 'center',
    width: 60,
    dataIndex: 'team_id',
  },
  {
    title: 'Team',
    width: 400,
    dataIndex: 'team_name',
  },
  {
    title: 'Odds',
    width: 60,
    align: 'center',
    dataIndex: 'team_odds',
  },
  {
    title: 'Seq',
    width: 60,
    align: 'center',
    dataIndex: 'team_seq',
  },
  {
    title: 'Open',
    width: 60,
    align: 'center',
    dataIndex: 'team_open_status',
    render: text =>
      text === 'Y' ? (
        <Typography.Text>Open</Typography.Text>
      ) : (
        <Typography.Text className="text-danger">Close</Typography.Text>
      ),
  },
  {
    title: 'Pause',
    width: 60,
    align: 'center',
    dataIndex: 'team_pause_status',
    render: text =>
      text === 'Y' ? (
        <Typography.Text className="text-danger">Pause</Typography.Text>
      ) : (
        <Typography.Text>Resume</Typography.Text>
      ),
  },
]

const OutrightListTeam = ({ data, loading }) => {
  return (
    <Table
      rowKey="team_id"
      className="w-75"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      bordered
    />
  )
}

export default connect(mapStateToProps)(OutrightListTeam)
