import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Space, Form, Table, Drawer, Tooltip, Input } from 'antd'
import actions from 'redux/region/actions'
import { ReloadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import Create from './create'
import Edit from './edit'

const mapStateToProps = ({ region }) => ({
  tableData: region.data,
  loading: region.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      Source: 'Master Region',
    })
  },
})

const MasterRegion = ({ tableData, Load, loading }) => {
  const [form] = Form.useForm()
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [valueEdit, setValueEdit] = useState(false)
  const [newData, setNewData] = useState([])

  useEffect(() => {
    setNewData(tableData)
  }, [tableData])

  useEffect(() => {
    Load()
  }, [Load])

  const columns = [
    {
      title: 'Sort Number',
      dataIndex: 'sort_number',
      align: 'center',
      width: 80,
    },
    {
      title: 'English',
      dataIndex: 'english',
      width: 100,
    },
    {
      title: 'Mandarin',
      dataIndex: 'mandarin',
      width: 100,
    },
    {
      title: 'Taiwan',
      dataIndex: 'taiwan',
      width: 100,
    },
    {
      title: 'Thai',
      dataIndex: 'thailand',
      width: 100,
    },
    {
      title: 'Japanesee',
      dataIndex: 'japanese',
      width: 100,
    },
    {
      title: 'Korean',
      dataIndex: 'korean',
      width: 100,
    },
    {
      title: 'Vietnamese',
      dataIndex: 'vietnamese',
      width: 100,
    },
    {
      title: 'Indonesia',
      dataIndex: 'indonesia',
      width: 100,
    },
    {
      title: 'Flag Image',
      dataIndex: 'flag_source',
      width: 100,
      render: text => <img src={text} alt="No img" width={100} height={50} />,
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: (text, record) => (
        <>
          <Space>
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setVisibleEdit(true)
                  setValueEdit(record)
                }}
              />
            </Tooltip>
          </Space>
        </>
      ),
    },
  ]

  const reload = () => {
    Load()
    form.resetFields()
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse justify-content-between" style={{ gap: 8 }}>
            <Space>
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setVisibleCreate(true)
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
              onFinish={values => {
                const filteredData = values
                  ? tableData.filter(e =>
                      e.english.toUpperCase().startsWith(values.region_name.toUpperCase()),
                    )
                  : tableData
                setNewData(filteredData)
              }}
            >
              <Form.Item name="region_name">
                <Input placeholder="Search by English" style={{ width: 250 }} />
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey="region_id"
            size="small"
            loading={loading}
            columns={columns}
            dataSource={newData}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Create Region"
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
        <Create
          successCallback={() => {
            setVisibleCreate(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Edit Region"
        width={420}
        open={visibleEdit}
        onClose={() => setVisibleEdit(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
            <Button form="add-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Edit
          editValue={valueEdit}
          successCallback={() => {
            setVisibleEdit(false)
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterRegion)
