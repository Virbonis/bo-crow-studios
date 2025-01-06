import React, { useEffect, useState } from 'react'
import { Button, Space, Table, Tooltip, Checkbox, Drawer } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/branch/actions'
import { EditOutlined, ReloadOutlined } from '@ant-design/icons'
import Edit from './edit'
import BranchLimit from '../branch-limit'

const mapStateToProps = ({ branch }) => ({
  tableData: branch.data,
  loadingData: branch.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Master Branch',
    })
  },
  UpdateLiveStream: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_LIVE_STREAM,
      payload,
      source: 'Master Branch',
      successCallback,
    })
  },
})

const MasterBranch = ({ Load, tableData, loadingData, UpdateLiveStream }) => {
  const [editValue, setEditValue] = useState({})
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [branchLimitValue, setBranchLimitValue] = useState({})
  const [visibleBranchLimit, setVisibleBranchLimit] = useState(false)

  const handleCheckbox = record => event => {
    UpdateLiveStream({ ...record, live_stream: event.target.checked ? 'Y' : 'N' }, Load)
  }

  useEffect(() => {
    Load()
  }, [Load])

  const columns = [
    {
      title: 'Branch ID',
      dataIndex: 'branch_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'Branch Name',
      dataIndex: 'branch_name',
      width: 130,
    },
    {
      title: 'Max Bet Multiplier',
      dataIndex: 'max_bet_multiplier',
      align: 'center',
      width: 130,
    },
    {
      title: 'Odds Trigger Multiplier',
      dataIndex: 'odds_trigger_multiplier',
      align: 'center',
      width: 130,
    },
    {
      title: 'Pause Multiplier',
      dataIndex: 'pause_multiplier',
      align: 'center',
      width: 130,
    },

    {
      title: 'Customer Prefix',
      dataIndex: 'customer_prefix',
      align: 'center',
      width: 120,
    },
    {
      title: 'ST Operator Live Stream',
      dataIndex: 'st_operator_live_stream',
      align: 'center',
      width: 150,
      render: (value, record) => (
        <Checkbox checked={value === 'Y'} onChange={handleCheckbox(record)} />
      ),
    },
    {
      title: 'Action',
      width: 100,
      align: 'center',
      render: record => (
        <Space>
          <Tooltip placement="top" title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
          </Tooltip>
          <Button type="link" onClick={() => branchLimit(record)}>
            Currency
          </Button>
        </Space>
      ),
    },
  ]

  const edit = record => {
    setEditValue(record)
    setVisibleEdit(true)
  }

  const branchLimit = record => {
    setBranchLimitValue(record)
    setVisibleBranchLimit(true)
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
            rowKey={record => record.branch_id}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Edit Branch"
        width={600}
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
        title="Branch Limit"
        width={1000}
        open={visibleBranchLimit}
        onClose={() => setVisibleBranchLimit(false)}
        destroyOnClose
      >
        <BranchLimit
          branchID={branchLimitValue.branch_id}
          successCallback={() => {
            setVisibleBranchLimit(false)
            Load()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterBranch)
