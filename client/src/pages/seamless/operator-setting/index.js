import { ReloadOutlined } from '@ant-design/icons'
import { Button, Checkbox, Drawer, Space, Table, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/operator-setting/actions'
import EditSetting from './edit'

const mapStateToProps = ({ operatorSetting }) => ({
  dataTable: operatorSetting.data,
  loading: operatorSetting.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Operator Setting',
    })
  },
})

const OperatorSetting = ({ dataTable, loading, Load }) => {
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState()

  useEffect(() => {
    Load()
  }, [Load])

  const columns = [
    {
      title: 'Branch ID',
      dataIndex: 'branch_id',
      width: 100,
    },
    {
      title: 'Branch Name',
      dataIndex: 'branch_name',
      width: 100,
    },
    {
      title: 'Prefix',
      dataIndex: 'prefix',
      width: 100,
    },
    {
      title: 'Operator ID',
      dataIndex: 'operator_id',
      width: 300,
    },
    {
      title: 'Odds Type',
      dataIndex: 'odds_type',
      width: 100,
    },
    {
      title: 'Default Language',
      dataIndex: 'default_language',
      width: 100,
    },
    {
      title: 'Supported Language',
      dataIndex: 'supported_language',
      width: 300,
      render: text => text.split(',').join(', '),
    },
    {
      title: 'Portal URL',
      dataIndex: 'portal_url',
    },
    {
      title: 'Is Sub Domain',
      width: 100,
      dataIndex: 'is_sub_domain',
      render: data => <Checkbox checked={data} disabled />,
    },
    {
      title: '',
      dataIndex: '',
      width: 60,
      render: (data, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setVisibleEdit(true)
              setEditValue(record)
            }}
          >
            Edit
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse justify-content-between">
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={() => Load()} />
          </Tooltip>
        </div>
        <div className="card-body">
          <Table
            rowKey="branch_code"
            loading={loading}
            columns={columns}
            dataSource={dataTable}
            pagination={false}
            scroll={{ x: 'max-content', y: true }}
          />
        </div>
      </div>
      <Drawer
        title="Edit Operator Setting"
        width={720}
        onClose={() => setVisibleEdit(false)}
        open={visibleEdit}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" form="form-setting">
              Submit
            </Button>
          </Space>
        }
      >
        <EditSetting
          data={editValue}
          successCallback={() => {
            setVisibleEdit(false)
            Load()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(OperatorSetting)
