import React, { useEffect, useState } from 'react'
import { Button, Space, Select, Row, Col, Table, Form, Drawer, Tooltip, Popconfirm } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/league-duplicate-match/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import AddLeagueDuplicateMatch from './add'

const mapStateToProps = ({ leagueDuplicateMatch }) => ({
  tableData: leagueDuplicateMatch.data,
  loadingData: leagueDuplicateMatch.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Master League Duplicate Match',
    })
  },
  Search: (payload, successCallback) => {
    dispatch({
      type: actions.SEARCH,
      payload,
      successCallback,
      source: 'Master League Duplicate Match',
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'Master League Duplicate Match',
    })
  },
})

const LeagueDuplicateMatch = ({ tableData, loadingData, Delete, Load }) => {
  const [form] = Form.useForm()
  const [visibleAdd, setVisibleAdd] = useState(false)

  const { sportOptions } = useSelectOptions()

  const refresh = () => form.submit()

  useEffect(() => {
    form.setFieldsValue({
      sport_id: sportOptions[0]?.value || '',
    })
    refresh()
  }, [sportOptions[0]?.value, form]) //eslint-disable-line

  const columns = [
    {
      title: 'No',
      align: 'center',
      width: 50,
      render: (_, __, index) => {
        return index + 1
      },
    },
    {
      title: 'League ID',
      dataIndex: 'league_id',
      width: 100,
    },
    {
      title: 'League Name',
      dataIndex: 'league_name',
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: record => (
        <Tooltip placement="top" title="Delete">
          <Popconfirm title="Are you sure delete this?" onConfirm={() => Delete(record, refresh)}>
            <Button icon={<DeleteOutlined />} type="link" />
          </Popconfirm>
        </Tooltip>
      ),
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse justify-content-between">
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                setVisibleAdd(true)
              }}
            >
              Add
            </Button>
            <Tooltip placement="top" title="Refresh list">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  refresh()
                }}
              />
            </Tooltip>
          </Space>
          <Form
            form={form}
            className="w-100"
            onFinish={values => {
              Load(values)
            }}
            onValuesChange={() => {
              refresh()
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="sport_id">
                  <Select
                    placeholder="Select Sport ID"
                    showSearch
                    className="w-100"
                    options={sportOptions}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.league_id}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Add League Duplicate Match"
        width={720}
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
        <AddLeagueDuplicateMatch
          successCallback={() => {
            setVisibleAdd(false)
            refresh()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueDuplicateMatch)
