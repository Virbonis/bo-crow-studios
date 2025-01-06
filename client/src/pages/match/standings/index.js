import { connect } from 'react-redux'
import { Button, Table, Space, Select, Form, Col, Row, Drawer, Tooltip, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/standings/actions'
import React, { useEffect, useState } from 'react'
import CreateForm from './create'
import EditForm from './edit'

const mapStateToProps = ({ standings }) => ({
  categoryOptions: standings.dataCategory.map(e => ({
    value: e.standings_category,
    label: e.standings_category,
  })),
  dataTable: standings.data,
  loading: standings.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadCategory: () => {
    dispatch({
      type: actions.LOAD_CATEGORY,
      source: 'Standings',
    })
  },
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Standings',
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'Standings',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const Standings = ({
  loading,
  dataTable,
  categoryOptions,
  LoadCategory,
  LoadTable,
  Delete,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [form] = Form.useForm()
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [addValue, setAddValue] = useState([])
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState([])

  useEffect(() => {
    LoadCategory()
  }, [LoadCategory])

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])
  useEffect(() => {
    form.setFieldsValue({
      category: categoryOptions[0]?.value,
    })
    reload()
  }, [form, categoryOptions[0]?.value, reload]) // eslint-disable-line

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      width: 250,
    },
    {
      title: 'Group Name',
      dataIndex: 'group_name',
      align: 'center',
      width: 120,
    },
    {
      title: 'Sort Number',
      dataIndex: 'sort_number',
      align: 'center',
      width: 100,
    },
    {
      title: 'No Team',
      dataIndex: 'no_team',
      align: 'center',
      width: 100,
    },
    {
      title: 'Team Name',
      dataIndex: 'name_team_en',
      width: 180,
    },
    {
      title: 'Play',
      dataIndex: 'play',
      align: 'center',
      width: 80,
    },
    {
      title: 'Win',
      dataIndex: 'win',
      align: 'center',
      width: 80,
    },
    {
      title: 'Draw',
      dataIndex: 'draw',
      align: 'center',
      width: 80,
    },
    {
      title: 'Lose',
      dataIndex: 'lose',
      align: 'center',
      width: 80,
    },
    {
      title: 'Goal',
      dataIndex: 'goal',
      align: 'center',
      width: 80,
    },
    {
      title: 'Conceded',
      dataIndex: 'conceded',
      align: 'center',
      width: 80,
    },
    {
      title: 'Points',
      dataIndex: 'points',
      align: 'center',
      width: 80,
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Tooltip placement="top" title="Edit">
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
                onConfirm={() => Delete(record, reload)}
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
        <div className="card-header card-header-flex flex-row-reverse align-items-center justify-content-between">
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                setVisibleCreate(true)
                setAddValue(categoryOptions)
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
            <Row>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="category">
                  <Select options={categoryOptions} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body">
          <Table
            rowKey="row_id"
            columns={columns}
            dataSource={dataTable}
            loading={loading}
            pagination={false}
          />
        </div>
      </div>
      <div>
        <Drawer
          title="Create Standings"
          width={420}
          open={visibleCreate}
          onClose={() => setVisibleCreate(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleCreate(false)}>Cancel</Button>
              <Button form="add-form" type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          }
        >
          <CreateForm
            data={addValue}
            successCallback={() => {
              setVisibleCreate(false)
              reload()
            }}
          />
        </Drawer>
        <Drawer
          title="Edit Standings"
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
          <EditForm
            editData={editValue}
            successCallback={() => {
              setVisibleEdit(false)
              reload()
            }}
          />
        </Drawer>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Standings)
