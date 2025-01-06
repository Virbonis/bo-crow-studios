import React, { useEffect, useState } from 'react'
import { Button, Space, Table, Drawer, Tooltip } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/sport/actions'
import { EditOutlined, ReloadOutlined } from '@ant-design/icons'
import Edit from './edit'
import DelayBet from './delay-bet'

const mapStateToProps = ({ sport }) => ({
  tableData: sport.data,
  loadingData: sport.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Master Sport',
    })
  },
})

const MasterSport = ({ Load, tableData, loadingData }) => {
  const [editValue, setEditValue] = useState('')
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleDelayBet, setVisibledelayBet] = useState(false)
  const [delayBetValue, setDelayBetValue] = useState('')

  useEffect(() => {
    Load()
  }, [Load])

  const columns = [
    {
      title: 'Sport ID',
      dataIndex: 'sport_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'English',
      dataIndex: 'sport_name_en',
      width: 150,
    },
    {
      title: 'Mandarin',
      dataIndex: 'sport_name_cn',
      width: 150,
    },
    {
      title: 'Thai',
      dataIndex: 'sport_name_th',
      width: 150,
    },
    {
      title: 'Japanese',
      dataIndex: 'sport_name_jp',
      width: 150,
    },
    {
      title: 'Korean',
      dataIndex: 'sport_name_kr',
      width: 150,
    },
    {
      title: 'Vietnamese',
      dataIndex: 'sport_name_vn',
      width: 150,
    },
    {
      title: 'Indonesia',
      dataIndex: 'sport_name_id',
      width: 150,
    },
    {
      title: 'Display',
      dataIndex: 'site_no_display',
      align: 'center',
      width: 100,
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: record => (
        <div>
          <Tooltip placement="top" title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
          </Tooltip>
          <Button type="link" onClick={() => handleDelayBet(record)}>
            Delay Bet
          </Button>
        </div>
      ),
    },
  ]

  const edit = record => {
    setEditValue(record)
    setVisibleEdit(true)
  }

  const handleDelayBet = record => {
    setVisibledelayBet(true)
    setDelayBetValue(record)
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse align-items-start" style={{ gap: 8 }}>
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={() => Load()} />
            </Tooltip>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.sport_id}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Edit Master Sport"
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
        <Edit
          editValue={editValue}
          successCallback={() => {
            setVisibleEdit(false)
            Load()
          }}
        />
      </Drawer>
      <Drawer
        title="Master Sport Delay Bet"
        width={650}
        open={visibleDelayBet}
        onClose={() => setVisibledelayBet(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibledelayBet(false)}>Cancel</Button>
          </Space>
        }
      >
        <DelayBet
          initialValue={delayBetValue}
          successCallback={() => {
            setVisibledelayBet(false)
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterSport)
