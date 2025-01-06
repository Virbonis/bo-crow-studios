import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/currency/actions'
import { Button, Table, Space, Drawer, Tooltip } from 'antd'
import { EditOutlined, ReloadOutlined } from '@ant-design/icons'
import Edit from './edit'
import BranchLimit from '../branch-limit'

const mapStateToProps = ({ currency }) => ({
  tableData: currency.data,
  loadingData: currency.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Master Currency',
    })
  },
})

const MasterCurrency = ({ tableData, loadingData, Load }) => {
  const [editValue, setEditValue] = useState({})
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [branchLimitValue, setBranchLimitValue] = useState({})
  const [visibleBranchLimit, setVisibleBranchLimit] = useState(false)
  useEffect(() => {
    Load()
  }, [Load])

  const columns = [
    {
      title: 'Currency',
      dataIndex: 'currency',
      align: 'center',
      width: 150,
    },
    {
      title: 'English',
      dataIndex: 'description',
      width: 150,
    },
    {
      title: 'Rate',
      dataIndex: 'currency_rate',
      align: 'right',
      width: 150,
    },
    {
      title: 'Effective Date',
      dataIndex: 'effective_date',
      align: 'center',
      width: 150,
    },
    {
      title: 'Stamp User',
      dataIndex: 'stamp_user',
      align: 'center',
      width: 150,
    },
    {
      title: 'Stamp Date',
      dataIndex: 'stamp_date',
      align: 'center',
      width: 150,
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: record => (
        <Space>
          <Tooltip placement="top" title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
          </Tooltip>
          <Button type="link" onClick={() => openBranchLimit(record)}>
            Branch
          </Button>
        </Space>
      ),
    },
  ]

  const edit = record => {
    setEditValue(record)
    setVisibleEdit(true)
  }

  const openBranchLimit = record => {
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
            rowKey={record => record.currency}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Edit Currency"
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
        title="Branch Limit"
        width={1000}
        open={visibleBranchLimit}
        onClose={() => setVisibleBranchLimit(false)}
        destroyOnClose
      >
        <BranchLimit
          currencyID={branchLimitValue.currency}
          successCallback={() => {
            setVisibleBranchLimit(false)
            Load()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterCurrency)
