import React from 'react'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
} from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/list-cancel-game/actions'
import { ReloadOutlined } from '@ant-design/icons'
import { useGetDateTimeDBServer } from 'components/blaise'
import useReportOptions from 'pages/report/shared-components/useReportOptions'

const mapStateToProps = ({ listCancelGame }) => ({
  tableData: listCancelGame.data,
  loadingData: listCancelGame.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_CANCEL_GAME,
      payload,
      source: 'ListCancel Game',
    })
  },
  Reset: (payload, successCallback) => {
    dispatch({
      type: actions.RESET_CANCEL_GAME,
      payload,
      successCallback,
      source: 'List Cancel Game',
    })
  },
})

const { RangePicker } = DatePicker
const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeDBServer()

  if (!defaultDateTime) return null

  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const ListCancelGame = wrapperDate(({ Load, tableData, loadingData, Reset, defaultDateTime }) => {
  const [form] = Form.useForm()
  const [isFailed, setIsFailed] = React.useState(true)

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])
  React.useEffect(() => {
    reload()
  }, [reload])

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'request_id',
      width: 150,
    },
    {
      title: 'Operator',
      dataIndex: 'branch_name',
      width: 100,
    },
    {
      title: 'Last Error',
      dataIndex: 'last_error',
      align: 'center',
      width: 200,
    },
    {
      title: 'Last Try',
      dataIndex: 'last_try',
      render: text => text?.formatDateTimeSecond(),
      align: 'center',
      width: 150,
    },
    {
      title: 'Params',
      dataIndex: 'params',
      width: 500,
    },
    {
      title: 'Stamp Date',
      dataIndex: 'stamp_date',
      render: text => text.formatDateTimeSecond(),
      align: 'center',
      width: 150,
    },
    {
      title: 'Action',
      align: 'center',
      width: 60,
      render: record => (
        <>
          <Button type="link" onClick={() => onReset({ ...record, update_type: 0 })}>
            Reset
          </Button>
          {isFailed && (
            <Button type="link" onClick={() => onReset({ ...record, update_type: 1 })}>
              Ignore
            </Button>
          )}
        </>
      ),
    },
  ]
  const onReset = record => {
    Reset({ row_id: record.row_id, update_type: record.update_type }, reload)
  }

  const { branchOptions } = useReportOptions('betenquiry')

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse">
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={reload} />
          </Tooltip>
          <Form
            form={form}
            className="w-100"
            layout="vertical"
            initialValues={{
              date_range: [defaultDateTime.clone().startOf('day'), defaultDateTime],
              branch_id: '',
              report_type: false,
            }}
            onFinish={values => {
              Load({
                ...values,
                report_type: values.report_type ? 1 : 0,
                date_from: values.is_using_date
                  ? values.date_range[0].format('YYYY-MMM-DD HH:mm:ss')
                  : '',
                date_to: values.is_using_date
                  ? values.date_range[1].format('YYYY-MMM-DD HH:mm:ss')
                  : '',
              })
              setIsFailed(!values.report_type)
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Space.Compact className="w-100">
                  <Tooltip title="Request Date">
                    <Form.Item name="is_using_date" valuePropName="checked">
                      <Checkbox />
                    </Form.Item>
                  </Tooltip>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.is_using_date !== currentValues.is_using_date
                    }
                  >
                    {({ getFieldValue }) => {
                      const isUsingDate = getFieldValue('is_using_date')
                      return (
                        <Form.Item name="date_range" noStyle>
                          <RangePicker
                            disabled={!isUsingDate}
                            className="ml-1 w-100"
                            allowClear={false}
                            format="YYYY-MM-DD HH:mm"
                            showTime={{ format: 'HH:mm' }}
                          />
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Space.Compact>
                <Form.Item name="report_type" valuePropName="checked">
                  <Switch checkedChildren="Success" unCheckedChildren="Failed" />
                </Form.Item>
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
                <Form.Item name="branch_id">
                  <Select showSearch optionFilterProp="label" options={branchOptions} />
                </Form.Item>
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={4}>
                <Form.Item name="request_ids">
                  <Input placeholder="Request ID" />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.row_id}
            size="small"
            bordered
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
            scroll={{ x: '100%', y: true }}
          />
        </div>
      </div>
    </>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(ListCancelGame)
