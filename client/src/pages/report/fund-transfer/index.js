import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Form,
  Button,
  Table,
  DatePicker,
  Input,
  Select,
  Drawer,
  Space,
  Typography,
} from 'antd'
import { FileExcelOutlined } from '@ant-design/icons'
import actions from 'redux/fund-transfer/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { Amount, useGetDateTimeBusinessHour } from 'components/blaise'
// import dayjs from 'dayjs'
import { getPresetsMinMaxDate } from 'helper'
import Detail from './detail'

const mapStateToProps = ({ fundTransfer }) => ({
  loading: fundTransfer.loadingData,
  loadingExport: fundTransfer.loadingExport,
  tableData: fundTransfer.data.result || [],
  summary: fundTransfer.data.summary,
  totalResults: fundTransfer.data.total,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Fund Transfer',
    })
  },
  Export: payload => {
    dispatch({
      type: actions.EXPORT,
      payload,
      source: 'Fund Transfer',
    })
  },
  ExportDetail: payload => {
    dispatch({
      type: actions.EXPORT_DETAIL,
      payload,
      source: 'Fund Transfer',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return (
    <Component
      {...props}
      minDate={defaultDateTime.clone().subtract(90, 'day')}
      maxDate={defaultDateTime}
    />
  )
  // defaultDateTime.clone().subtract(90, 'day')
}

const { RangePicker } = DatePicker

const FundTransfer = wrapperDate(
  ({
    minDate,
    maxDate,
    loading,
    loadingExport,
    tableData,
    totalResults,
    summary,
    Load,
    Export,
    ExportDetail,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    let { currencyOptions, branchOptions } = useSelectOptions()
    branchOptions = [{ value: '', label: 'Show All Branch' }].concat(branchOptions)
    currencyOptions = [{ value: '', label: 'Show All Currency' }].concat(currencyOptions)

    const [form] = Form.useForm()

    const [pagination, setPagination] = useState({
      current_page: 1,
      page_size: 50,
    })
    const [orderBy, setOrderBy] = useState({ order_by: '', asc_desc: '' })
    const [visibleDetail, setVisibleDetail] = useState(false)
    const [submitValue, setSubmitValue] = useState()

    const columns = [
      {
        title: 'No',
        width: 30,
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Username',
        width: 350,
        dataIndex: 'user_login',
        render: text => (
          <Button
            style={{ userSelect: 'text' }}
            type="link"
            className="p-0"
            onClick={() => detailHandler(text)}
          >
            {text}
          </Button>
        ),
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        align: 'center',
        width: 70,
      },
      {
        title: 'Deposit (F)',
        dataIndex: 'deposit',
        align: 'right',
        width: 120,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Deposit (L)',
        dataIndex: 'deposit_rmb',
        align: 'right',
        key: 'deposit',
        sorter: true,
        sortDirections: ['descend', 'ascend', 'descend'],
        width: 120,
        render: text => <Amount value={text} />,
      },
      {
        title: 'WithDrawal (F)',
        dataIndex: 'withdrawal',
        align: 'right',
        width: 120,
        render: text => <Amount value={text} />,
      },
      {
        title: 'WithDrawal (L)',
        dataIndex: 'withdrawal_rmb',
        align: 'right',
        key: 'withdrawal',
        sorter: true,
        sortDirections: ['descend', 'ascend', 'descend'],
        width: 120,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Balance (F)',
        dataIndex: 'balance',
        align: 'right',
        width: 120,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Balance (L)',
        dataIndex: 'balance_rmb',
        align: 'right',
        width: 120,
        render: text => <Amount value={text} />,
      },
    ]

    const detailHandler = record => {
      setVisibleDetail(true)
      setSubmitValue({ ...submitValue, username: record })
    }

    const reload = React.useCallback(() => {
      form.submit()
    }, [form])

    const exportHandler = () => {
      const values = form.getFieldsValue()
      Export({
        ...values,
        from_date: values.date_range[0].format('YYYY-MM-DD'),
        to_date: values.date_range[1].format('YYYY-MM-DD'),
        current_page: 0,
        page_size: 0,
        sort_by: '',
        asc_desc: 'asc',
      })
    }
    const exportDetailHandler = () => {
      ExportDetail({
        ...submitValue,
        sort_by: '',
        asc_desc: 'asc',
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
                date_range: [maxDate, maxDate],
                branch_id: '',
                currency: '',
              }}
              onFinish={values => {
                const payload = {
                  ...values,
                  from_date: values.date_range[0].format('YYYY-MM-DD'),
                  to_date: values.date_range[1].format('YYYY-MM-DD'),
                }
                setSubmitValue(payload)
                Load({
                  ...payload,
                  ...pagination,
                  ...orderBy,
                })
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="date_range"
                    extra={
                      <Typography.Text type="danger">
                        {`Valid from ${minDate.format('YYYY-MM-DD')} - ${maxDate.format(
                          'YYYY-MM-DD',
                        )}`}
                      </Typography.Text>
                    }
                  >
                    <RangePicker
                      placeholder={['Join Date From', 'Join Date To']}
                      allowClear={false}
                      className="w-100"
                      format="YYYY-MM-DD"
                      disabledDate={current => current < minDate || current > maxDate}
                      presets={getPresetsMinMaxDate(minDate, maxDate)}
                    />
                  </Form.Item>
                  <Form.Item name="username">
                    <Input placeholder="Username" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="branch_id">
                    <Select options={branchOptions} showSearch />
                  </Form.Item>
                  <Form.Item name="currency">
                    <Select options={currencyOptions} showSearch />
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
              bordered
              size="small"
              rowKey="user_login"
              loading={loading}
              columns={columns}
              dataSource={tableData}
              summary={data => data.length > 0 && <DisplaySummary {...summary} />}
              onChange={(p, f, sorter) => {
                setOrderBy({
                  sort_by: sorter.columnKey,
                  asc_desc: sorter.order === 'ascend' ? 'asc' : 'desc', // descend, ascend
                })
                if (submitValue) reload()
              }}
              pagination={{
                showSizeChanger: true,
                total: totalResults,
                showTotal: total => `Total ${total} items`,
                current: pagination.current_page,
                pageSize: pagination.page_size,
                onChange: (current_page, page_size) => {
                  setPagination({ current_page, page_size })
                  reload()
                },
              }}
              tableLayout="fixed"
              scroll={{ x: 'max-content', y: true }}
            />
          </div>
        </div>
        <Drawer
          title="Fund Transfer Detail"
          width="60%"
          open={visibleDetail}
          onClose={() => setVisibleDetail(false)}
          destroyOnClose
          footer={
            <Space>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                loading={loadingExport}
                onClick={exportDetailHandler}
              >
                Export
              </Button>
            </Space>
          }
        >
          <Detail detailValue={submitValue} />
        </Drawer>
      </>
    )
  },
)
const DisplaySummary = ({ deposit_rmb, withdrawal_rmb, balance_rmb }) => {
  return (
    <Table.Summary fixed="bottom">
      <Table.Summary.Row className="font-weight-bold bg-light-yellow">
        <Table.Summary.Cell colSpan={3} align="center">
          Total
        </Table.Summary.Cell>
        <Table.Summary.Cell />
        <Table.Summary.Cell>
          <Amount value={deposit_rmb} />
        </Table.Summary.Cell>
        <Table.Summary.Cell />
        <Table.Summary.Cell>
          <Amount value={withdrawal_rmb} />
        </Table.Summary.Cell>
        <Table.Summary.Cell />
        <Table.Summary.Cell>
          <Amount value={balance_rmb} />
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FundTransfer)
