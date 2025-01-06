import React, { useState } from 'react'
import {
  Button,
  Space,
  Select,
  Row,
  Col,
  Table,
  Form,
  Input,
  Drawer,
  Tooltip,
  Popconfirm,
} from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/league-hidden/actions'
import { useFormWithPagination } from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import AddLeagueHidden from './create'

const mapStateToProps = ({ leagueHidden }) => ({
  totalResults: leagueHidden.data.total,
  tableData: leagueHidden.data.result,
  loadingData: leagueHidden.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Master League Hidden',
    })
  },
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Master League Hidden',
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'Master League Hidden',
    })
  },
})

const LeagueHidden = ({ tableData, totalResults, loadingData, Delete, Load }) => {
  const [form] = Form.useForm()
  const [visibleCreate, setVisibleCreate] = useState(false)
  const { branchOptions } = useSelectOptions()
  let { currencyOptions } = useSelectOptions()
  currencyOptions = [
    { value: '', label: 'Show All Currency' },
    { value: 'ALL', label: 'ALL' },
  ].concat(currencyOptions)

  const fetch = React.useCallback(values => Load(values), [Load])
  const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResults)
  const reload = React.useCallback(() => form.submit(), [form])
  React.useEffect(() => reload(), [reload])

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
      title: 'Branch',
      dataIndex: 'branch_alias',
      align: 'center',
      width: 150,
    },
    {
      title: 'Curr',
      dataIndex: 'currency',
      align: 'center',
      width: 150,
    },
    {
      title: 'Sport',
      dataIndex: 'sport_name',
      align: 'center',
      width: 150,
    },
    {
      title: 'League',
      dataIndex: 'league_name',
      width: 600,
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: record => (
        <Tooltip placement="top" title="Delete">
          <Popconfirm title="Are you sure delete this?" onConfirm={() => Delete(record, reload)}>
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
                setVisibleCreate(true)
              }}
            >
              Add
            </Button>
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
          </Space>
          <Form
            form={form}
            className="w-100"
            initialValues={{ currency: '', branch_code: branchOptions[0]?.value }}
            {...formProps}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="branch_code">
                  <Select
                    placeholder="Select Branch"
                    showSearch
                    className="w-100"
                    options={branchOptions}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="currency">
                  <Select
                    placeholder="Select Currency"
                    showSearch
                    className="w-100"
                    options={currencyOptions}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="league_name">
                  <Input className="w-100" placeholder="League Name" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.row_id}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={paginationProps}
          />
        </div>
      </div>
      <Drawer
        title="Add League Hidden"
        width={720}
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
        <AddLeagueHidden
          successCallback={() => {
            setVisibleCreate(false)
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueHidden)
