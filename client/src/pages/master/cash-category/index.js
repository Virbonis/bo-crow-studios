import React, { useEffect, useState } from 'react'
import { Button, Table, Tooltip, Space, Drawer } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/cash-category/actions'
import { EditOutlined, ReloadOutlined } from '@ant-design/icons'
import Edit from './edit'

const mapStateToProps = ({ cashCategory }) => ({
  tableData: cashCategory?.data,
  loadingData: cashCategory?.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Master Cash Category',
    })
  },
})

const CashCategory = ({ tableData, loadingData, Load }) => {
  useEffect(() => {
    Load()
  }, [Load])

  const [editValue, setEditValue] = useState('')
  const [visibleEdit, setVisibleEdit] = useState(false)

  const columns = [
    {
      title: 'Cash Category ID',
      dataIndex: 'cash_category_id',
      width: 600,
    },
    {
      title: 'Position Taking %',
      dataIndex: 'position_taking',
      width: 600,
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: record => (
        <Tooltip placement="top" title="Edit">
          <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
        </Tooltip>
      ),
    },
  ]

  const edit = record => {
    setEditValue(record)
    setVisibleEdit(true)
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
            rowKey="cash_category_id"
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Edit Cash Category"
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
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CashCategory)
