import React, { useEffect, useState } from 'react'
import { Button, Form, Select, Table, Space, Drawer, Tooltip, Popconfirm, Row, Col } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/knockouts/actions'
import CreateForm from './create'
import EditForm from './edit'

const mapStateToProps = ({ knockouts }) => ({
  categoryOptions: knockouts.dataCategory.map(e => ({
    value: e.knockouts_category,
    label: e.knockouts_category,
  })),
  dataTable: knockouts.data,
  loadingData: knockouts.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadCategory: () => {
    dispatch({
      type: actions.LOAD_CATEGORY,
      source: 'Knockouts',
    })
  },
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Knockouts',
    })
  },
  DeleteData: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'Knockouts',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const Knockout = ({
  dataTable,
  loadingData,
  categoryOptions,
  LoadCategory,
  LoadTable,
  DeleteData,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [form] = Form.useForm()
  const [addValue, setAddValue] = useState([])
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [editValue, setEditValue] = useState([])
  const [visibleEdit, setVisibleEdit] = useState(false)

  useEffect(() => {
    LoadCategory()
  }, [LoadCategory])

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])
  useEffect(() => {
    form.setFieldsValue({
      category: categoryOptions[0]?.value || '',
    })
    reload()
  }, [form, categoryOptions[0]?.value]) //eslint-disable-line

  const column = [
    {
      title: 'Category',
      dataIndex: 'category',
      width: 250,
    },
    {
      title: 'Knockout ID',
      dataIndex: 'knockouts_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'Knockout Round',
      dataIndex: 'knockouts_round',
      align: 'center',
      width: 100,
    },
    {
      title: 'Team 1',
      dataIndex: 'home_name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Team 2',
      dataIndex: 'away_name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Match Date',
      dataIndex: 'match_date',
      align: 'center',
      width: 150,
      render: text => {
        return text.formatDateTime()
      },
    },
    {
      title: 'Result State',
      dataIndex: 'results_state',
      align: 'center',
      width: 150,
    },
    {
      title: 'Result Score',
      dataIndex: 'result',
      align: 'center',
      width: 150,
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditValue(record)
                  setVisibleEdit(true)
                }}
              />
            </Tooltip>
            <Tooltip placement="top" title="Delete">
              <Popconfirm
                title="Are you sure delete this?"
                onConfirm={() => {
                  DeleteData({ row_id: record.row_id }, reload)
                }}
              >
                <Button type="link" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </>
        )
      },
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
            <Space>
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setAddValue(form.getFieldsValue())
                  setVisibleAdd(true)
                }}
              >
                Create
              </Button>
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
            </Space>
            <Form
              form={form}
              className="w-100"
              onValuesChange={reload}
              onFinish={values => {
                if (values.category) LoadTable(values)
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="category">
                    <Select options={categoryOptions} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.row_id}
            columns={column}
            dataSource={dataTable}
            loading={loadingData}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Create Knockouts"
        width={420}
        open={visibleAdd}
        onClose={() => setVisibleAdd(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleAdd(false)}>Cancel</Button>
            <Button form="add-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <CreateForm
          addValue={addValue}
          successCallback={() => {
            setVisibleAdd(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Edit Knockouts"
        width={500}
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
        <EditForm
          editValue={editValue}
          successCallback={() => {
            setVisibleEdit(false)
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Knockout)
