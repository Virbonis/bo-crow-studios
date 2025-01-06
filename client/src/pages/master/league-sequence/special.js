import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Row, Table } from 'antd'
import actions from 'redux/league-sequence/actions'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'

const mapStateToProps = ({ leagueSequence }) => ({
  tableData: leagueSequence.data_special,
  loadingData: leagueSequence.loadingSpecial,
})

const mapDispatchToProps = dispatch => ({
  SwapSpecial: (payload, successCallback) => {
    dispatch({
      type: actions.SWAP_SPECIAL,
      payload,
      successCallback,
      source: 'Master League Sequence',
    })
  },
})

const Special = ({
  matchTime,
  successCallback,
  specialValue,
  tableData,
  loadingData,
  SwapSpecial,
}) => {
  const columns = [
    {
      title: 'League ID',
      dataIndex: 'parent_league_id',
    },
    {
      title: 'Name',
      dataIndex: 'nama_events',
    },
    {
      title: matchTime === 'Live' ? 'Seq Live' : 'Seq Non Live',
      dataIndex: 'no_display',
    },
    {
      title: 'Action',
      width: 100,
      render: (text, record, index) => (
        <Row>
          <Col span={6}>
            {index !== 0 && (
              <Button
                style={{
                  color: 'green',
                }}
                icon={<CaretUpOutlined />}
                type="text"
                onClick={() => {
                  const eventIndex =
                    tableData.findIndex(data => data.no_events === record.no_events) - 1
                  SwapSpecial(
                    {
                      match_time: matchTime,
                      no_events_2: tableData[eventIndex].no_events,
                      no_events_1: record.no_events,
                      league_parent_id: specialValue.parent_league_id,
                    },
                    successCallback,
                  )
                }}
              />
            )}
          </Col>
          <Col span={6}>
            {index !== tableData.length - 1 && (
              <Button
                style={{ color: 'red' }}
                type="text"
                icon={<CaretDownOutlined />}
                onClick={() => {
                  const eventIndex =
                    tableData.findIndex(data => data.no_events === record.no_events) + 1
                  SwapSpecial(
                    {
                      match_time: matchTime,
                      no_events_2: tableData[eventIndex].no_events,
                      no_events_1: record.no_events,
                      league_parent_id: specialValue.parent_league_id,
                    },
                    successCallback,
                  )
                }}
              />
            )}
          </Col>
        </Row>
      ),
    },
  ]

  return (
    <Table
      rowKey={record => record.no_events}
      size="small"
      loading={loadingData}
      dataSource={tableData}
      columns={columns}
      pagination={false}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Special)
