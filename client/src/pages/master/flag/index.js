import { Form, Image, Input, Table, Button, Tooltip, Drawer, Space } from 'antd'
import React, { useState, useCallback } from 'react'
import actions from 'redux/flag/actions'
import { connect } from 'react-redux'
import { useFormWithPagination } from 'components/blaise'
import { EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import Add from './add'
import Edit from './edit'

const mapStateToProps = ({ flag }) => ({
  dataTable: flag.data?.result,
  totalData: flag.data?.total,
  loading: flag.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Flag',
    })
  },
})
const Flag = ({ dataTable, totalData, loading, LoadTable }) => {
  const [visibleAddFlag, setVisibleAddFlag] = useState(false)
  const [visibleEditFlag, setVisibleEditFlag] = useState(false)
  const [editFlagValue, setEditFlagValue] = useState({})
  const [form] = Form.useForm()

  const fetch = React.useCallback(values => LoadTable(values), [LoadTable])
  const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalData)
  const reload = useCallback(() => form.submit(), [form])
  React.useEffect(() => reload(), [reload])

  const columns = [
    {
      title: 'Flag Name',
      dataIndex: 'flag_name',
      width: 500,
    },
    {
      title: 'Flag Image',
      dataIndex: 'flag_source',
      width: 500,
      render: text => {
        return <Image width={75} height={50} src={text} />
      },
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: (_, row) => {
        return (
          <Tooltip placement="top" title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setVisibleEditFlag(true)
                setEditFlagValue(row)
              }}
              type="link"
            />
          </Tooltip>
        )
      },
    },
  ]
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse justify-content-between" style={{ gap: 8 }}>
            <Space>
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setVisibleAddFlag(true)
                }}
              >
                Create
              </Button>
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
            </Space>
            <Form form={form} {...formProps}>
              <Form.Item name="flag_name">
                <Input placeholder="Search by Flag Name" />
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey="flag_id"
            loading={loading}
            columns={columns}
            dataSource={dataTable}
            pagination={paginationProps}
          />
        </div>
      </div>
      <Drawer
        title="Add Flag"
        width={720}
        open={visibleAddFlag}
        destroyOnClose
        onClose={() => setVisibleAddFlag(false)}
        footer={
          <Space>
            <Button onClick={() => setVisibleAddFlag(false)}>Cancel</Button>
            <Button form="form-add" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Add
          successCallback={() => {
            setVisibleAddFlag(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Edit Flag"
        width={720}
        open={visibleEditFlag}
        onClose={() => setVisibleEditFlag(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEditFlag(false)}>Cancel</Button>
            <Button form="form-edit" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Edit
          rowData={editFlagValue}
          successCallback={() => {
            setVisibleEditFlag(false)
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Flag)
