import React, { useEffect, useState, useCallback } from 'react'
import { Table, Button, Space, Drawer, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/branch/actions'
import { Amount } from 'components/blaise'
import EditBranch from './edit'

const mapStateToProps = ({ branch }) => ({
  loading: branch.loading,
  data: branch.limit,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_LIMIT,
      payload,
      source: 'Branch Limit',
    })
  },
})

const BranchLimit = ({ loading, data, Load, branchID, currencyID }) => {
  const [editValue, setEditValue] = useState('')
  const [visibleEdit, setVisibleEdit] = useState(false)

  const reload = useCallback(
    () =>
      Load({
        branch_id: branchID,
        currency_id: currencyID,
      }),
    [Load, branchID, currencyID],
  )
  useEffect(() => reload(), [reload])

  const edit = record => {
    setEditValue(record)
    setVisibleEdit(true)
  }

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
      width: 100,
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      align: 'center',
      width: 120,
    },
    {
      title: 'Min Bet',
      dataIndex: 'min_bet',
      align: 'right',
      width: 120,
    },
    {
      title: 'Min Bet Parlay',
      dataIndex: 'min_bet_parlay',
      align: 'right',
      width: 120,
    },
    {
      title: 'Max Payout Parlay',
      dataIndex: 'max_payout_parlay',
      width: 120,
      render: text => <Amount value={text} int />,
      align: 'right',
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: record => (
        <Space>
          <Tooltip placement="top" title="Edit Branch limit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table
        rowKey={record => `${record.currency}${record.branch_name}`}
        size="small"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={false}
      />
      <Drawer
        title="Edit Branch Limit"
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
        <EditBranch
          editBranchValue={editValue}
          successCallback={() => {
            setVisibleEdit(false)
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BranchLimit)
