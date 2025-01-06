import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/profile/actions'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Drawer, Popconfirm, Space, Table, Tooltip } from 'antd'
import EditOddsTrigger from './edit'

const mapStateToProps = ({ profile }) => ({
  loadingOddsTrigger: profile.loadingOddsTrigger,
  oddsTriggerData: profile.dataOddsTrigger,
})

const mapDispatchToProps = dispatch => ({
  LoadOdds: payload => {
    dispatch({
      type: actions.LOAD_ODDS_TRIGGER,
      payload,
      source: 'Master Profile',
    })
  },
  AddOdds: (payload, successCallback) => {
    dispatch({
      type: actions.ADD_ODDS_TRIGGER,
      payload,
      successCallback,
      source: 'Master Profile',
    })
  },
  DeleteOdds: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_ODDS_TRIGGER,
      payload,
      successCallback,
      source: 'Master Profile',
    })
  },
})

const OddsTrigger = ({
  oddsTriggerValue,
  AddOdds,
  LoadOdds,
  oddsTriggerData,
  loadingOddsTrigger,
  DeleteOdds,
}) => {
  const { profile_id, game_type } = oddsTriggerValue
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState(null)

  useEffect(() => {
    LoadOdds({ profile_id, game_type })
  }, [LoadOdds, profile_id, game_type])

  const edit = record => {
    setEditValue(record)
    setVisibleEdit(true)
  }

  const deleteOdds = () => {
    DeleteOdds(oddsTriggerValue, () => {
      LoadOdds(oddsTriggerValue)
    })
  }

  const columns = [
    {
      title: 'Odds From',
      dataIndex: 'odds_from',
      width: 150,
    },
    { title: 'Odds To', dataIndex: 'odds_to', width: 150 },
    { title: 'Odds Trigger', dataIndex: 'odds_trigger_percent', width: 150 },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: (text, record, index) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
          </Tooltip>
          {index === oddsTriggerData.length - 1 && (
            <Popconfirm title="Sure to delete?" onConfirm={() => deleteOdds()}>
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Button
          onClick={() => {
            AddOdds({ game_type, profile_id }, () => {
              LoadOdds({ game_type, profile_id }) // BELOM BERES ADD ODDS
            })
          }}
          icon={<PlusOutlined />}
        >
          Add
        </Button>
        <Table
          rowKey={record => record.odds_trigger_id}
          size="small"
          loading={loadingOddsTrigger}
          dataSource={oddsTriggerData}
          columns={columns}
          pagination={false}
        />
        <Drawer
          title="Edit Odds"
          width={420}
          open={visibleEdit}
          onClose={() => setVisibleEdit(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
              <Button form="edit-form" type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          }
        >
          <EditOddsTrigger
            editValue={editValue}
            successCallback={() => {
              setVisibleEdit(false)
              LoadOdds(oddsTriggerValue)
            }}
          />
        </Drawer>
      </Space>
    </div>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(OddsTrigger)
