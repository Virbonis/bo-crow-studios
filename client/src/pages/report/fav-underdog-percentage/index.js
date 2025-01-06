import React from 'react'
import { Row, Col, Table, Form, DatePicker, Button, Select, Space } from 'antd'
import { connect } from 'react-redux'
import { Amount, useGetDateTimeDBServer } from 'components/blaise'
import actions from 'redux/fav-underdog-percentage/actions'
import './custom.scss'
import { FileExcelOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ favUnderdogPercentage }) => ({
  tableData: favUnderdogPercentage.data,
  loading: favUnderdogPercentage.loadingData,
  loadingExport: favUnderdogPercentage.loadingExport,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Fav Underdog Percentage',
    })
  },
  LoadExport: payload => {
    dispatch({
      type: actions.LOAD_EXPORT,
      payload,
      source: 'Fav Underdog Percentage',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const columns = [
  {
    title: 'No',
    width: 30,
    align: 'center',
    render: (text, record, index) => index + 1,
  },
  {
    title: 'Branch',
    dataIndex: 'branch_name',
    align: 'center',
    width: 100,
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    align: 'center',
    width: 100,
  },
  {
    title: 'Dead Ball',
    children: [
      {
        title: 'Fav (%)',
        dataIndex: 'dead_ball_fav',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Underdog (%)',
        dataIndex: 'dead_ball_underdog',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Over (%)',
        dataIndex: 'dead_ball_over',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Under (%)',
        dataIndex: 'dead_ball_under',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
      },
    ],
  },
  {
    title: 'Running Ball',
    children: [
      {
        title: 'Fav (%)',
        dataIndex: 'running_ball_fav',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Underdog (%)',
        dataIndex: 'running_ball_underdog',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Over (%)',
        dataIndex: 'running_ball_over',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Under (%)',
        dataIndex: 'running_ball_under',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
      },
    ],
  },
]

const { RangePicker } = DatePicker
const minYear = 2014

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()
  if (!defaultDateTimeServer) return null
  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const FavUnderdogPercentage = wrapperDate(
  ({ defaultDateTimeServer, tableData, loading, loadingExport, Load, LoadExport, CleanUp }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    let { sportOptions, branchOptions, currencyOptions, productOptions } = useSelectOptions()

    sportOptions = [{ value: 0, label: 'Show All Sport' }].concat(sportOptions)
    branchOptions = [{ value: '', label: 'Show All Branch' }].concat(branchOptions)
    productOptions = [{ value: '', label: 'Show All Product' }].concat(productOptions)
    currencyOptions = [{ value: '', label: 'Show All Currency' }].concat(currencyOptions)

    const [form] = Form.useForm()

    const exportHandler = () => {
      const values = form.getFieldsValue()
      LoadExport({
        ...values,
        date_from: values.date_range[0].startOf('month').format('YYYY-MM-DD'),
        date_to: values.date_range[1].startOf('month').format('YYYY-MM-DD'),
      })
    }

    return (
      <>
        <div className="card">
          <div className="card-header">
            <Form
              form={form}
              className="w-100"
              initialValues={{
                date_range: [
                  defaultDateTimeServer.clone().subtract(-12, 'hours'),
                  defaultDateTimeServer,
                ],
                sport_id: 0,
                branch_code: '',
                currency: '',
                product: '',
              }}
              onFinish={values => {
                Load({
                  ...values,
                  date_from: values.date_range[0].startOf('month').format('YYYY-MM-DD'),
                  date_to: values.date_range[1].startOf('month').format('YYYY-MM-DD'),
                })
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Form.Item name="date_range">
                    <RangePicker
                      allowClear={false}
                      format="YYYY-MM"
                      className="w-100"
                      picker="month"
                      disabledDate={current => current < minYear}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Form.Item name="sport_id">
                    <Select showSearch optionFilterProp="label" options={sportOptions} />
                  </Form.Item>
                  <Form.Item name="product">
                    <Select showSearch optionFilterProp="label" options={productOptions} />
                  </Form.Item>
                  <Form.Item name="branch_code">
                    <Select showSearch optionFilterProp="label" options={branchOptions} />
                  </Form.Item>
                  <Form.Item name="currency">
                    <Select showSearch optionFilterProp="label" options={currencyOptions} />
                  </Form.Item>
                </Col>
              </Row>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  loading={loadingExport}
                  onClick={exportHandler}
                >
                  Export
                </Button>
              </Space>
            </Form>
          </div>
          <div className="card-body">
            <Table
              rowKey={record => `${record.branch_code}_${record.currency}`}
              bordered
              size="small"
              loading={loading}
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(FavUnderdogPercentage)
