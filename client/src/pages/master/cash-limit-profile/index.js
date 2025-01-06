import {
  Space,
  Form,
  Select,
  Table,
  Button,
  Tooltip,
  Drawer,
  Input,
  Row,
  Col,
  Popconfirm,
} from 'antd'
import React, { useEffect, useState } from 'react'
import actions from 'redux/cash-limit-profile/actions'
import { connect } from 'react-redux'
import { DeleteOutlined, EditOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import AddCashLimit from './create'
import Log from './log'
import Edit from './edit'

const mapStateToProps = ({ cashLimitProfile }) => ({
  tableData: cashLimitProfile.data,
  loadingData: cashLimitProfile.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Master Cash Limit Proflie',
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'Master Cash Limit Proflie',
    })
  },
})

const MasterCashLimitProfile = ({ loadingData, tableData, Load, Delete }) => {
  const [form] = Form.useForm()

  let { currencyOptions, branchOptions } = useSelectOptions()
  branchOptions = [{ value: '', label: 'Show All' }].concat(branchOptions)
  currencyOptions = [{ value: '', label: 'Show All' }].concat(currencyOptions)

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])
  useEffect(() => {
    form.resetFields()
    reload()
  }, [branchOptions[0]?.value, currencyOptions[0]?.value, form]) //eslint-disable-line

  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleLog, setVisibleLog] = useState(false)
  const [valueLog, setValueLog] = useState('')
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [valueEdit, setValueEdit] = useState('')

  const columns = React.useMemo(
    () => [
      {
        title: 'Profile ID',
        dataIndex: 'profile_id',
        width: 500,
      },
      {
        title: 'Branch',
        dataIndex: 'branch_name',
        width: 400,
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        width: 400,
      },
      {
        title: 'Action',
        width: 100,
        // align: 'center',
        render: record => (
          <>
            <Tooltip placement="top" title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setVisibleEdit(true)
                  setValueEdit(record)
                }}
              />
            </Tooltip>
            {record.can_delete && (
              <Tooltip placement="top" title="Delete">
                <Popconfirm
                  title="Are you sure delete this?"
                  onConfirm={() => Delete(record, reload)}
                >
                  <Button icon={<DeleteOutlined />} type="link" />
                </Popconfirm>
              </Tooltip>
            )}
            <Tooltip placement="top" title="Show Log">
              <Button
                type="link"
                onClick={() => {
                  setVisibleLog(true)
                  setValueLog(record)
                }}
              >
                Log
              </Button>
            </Tooltip>
          </>
        ),
      },
    ],
    [Delete, reload],
  )

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse align-items-start" style={{ gap: 8 }}>
            <Space>
              <Button icon={<PlusOutlined />} onClick={() => setVisibleAdd(true)}>
                Create
              </Button>
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
            </Space>
            <Form
              form={form}
              className="w-100"
              id="create-form"
              onValuesChange={debounce(reload, 300)}
              onFinish={values => {
                Load(values)
              }}
              initialValues={{
                branch_code: '001',
                currency: 'RMB',
              }}
            >
              <Row gutter={8}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="profile_id">
                    <Input placeholder="Profile" className="w-100" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="branch_code">
                    <Select
                      placeholder="Select Branch"
                      className="w-100"
                      showSearch
                      options={branchOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="currency">
                    <Select
                      placeholder="Select Currency"
                      className="w-100"
                      showSearch
                      options={currencyOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey={rowKey}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Add New Cash Limit Profile"
        width={450}
        open={visibleAdd}
        onClose={() => setVisibleAdd(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleAdd(false)}>Cancel</Button>
            <Button form="addForm" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <AddCashLimit
          successCallback={() => {
            setVisibleAdd(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title={`Log - ${valueLog.profile_id}`}
        width="60%"
        open={visibleLog}
        onClose={() => setVisibleLog(false)}
        destroyOnClose
      >
        <Log logValue={valueLog} />
      </Drawer>
      <Drawer
        title="Edit Cash Limit"
        width="60%"
        open={visibleEdit}
        onClose={() => setVisibleEdit(false)}
        destroyOnClose
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
const rowKey = record => `${record.profile_id}-${record.branch_name}-${record.currency}`

export default connect(mapStateToProps, mapDispatchToProps)(MasterCashLimitProfile)
