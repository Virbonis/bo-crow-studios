import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Typography,
} from 'antd'
import { PartitionOutlined } from '@ant-design/icons'
import actions from 'redux/company-winloss-foreign/actions'
import { Amount, useGetDateTimeBusinessHour, useGetLastGLDate } from 'components/blaise'
import TableDetail from 'pages/report/company-winloss/detail'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { getPresetsMinMaxDate } from 'helper'
import dayjs from 'dayjs'

const mapStateToProps = ({ companyWinlossForeign }) => ({
  loading: companyWinlossForeign.loading,
  dataCash: companyWinlossForeign.dataCash,
  dataDetail: companyWinlossForeign.dataDetail,

  totalCash: companyWinlossForeign.totalCash,
  totalDetail: companyWinlossForeign.totalDetail,
})

const mapDispatchToProps = dispatch => ({
  Load: (payload, failedCallback) => {
    dispatch({
      type: actions.LOAD,
      payload,
      failedCallback,
      source: 'Company Winloss Foreign',
    })
  },
  LoadDetail: (payload, failedCallback) => {
    dispatch({
      type: actions.LOAD_DETAIL,
      payload,
      failedCallback,
      source: 'Company Winloss Foreign',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const { Text } = Typography
const { RangePicker } = DatePicker

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  const lastGLDate = useGetLastGLDate()
  const { hist } = props

  if (!defaultDateTime || !lastGLDate) return null

  return (
    <Component
      {...props}
      minDate={!hist ? lastGLDate : dayjs('2012-01-01')}
      maxDate={!hist ? defaultDateTime : lastGLDate.clone().subtract(1, 'day')}
      hist={hist}
    />
  )
}

const CompanyWinLossForeign = wrapperDate(
  ({
    minDate,
    maxDate,
    hist,

    loading,
    dataCash,
    totalCash,
    dataDetail,
    totalDetail,

    Load,
    LoadDetail,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    let { branchOptions } = useSelectOptions()
    branchOptions = [{ value: '', label: 'Show All Branch' }].concat(branchOptions)

    const [form] = Form.useForm()

    const [cashPagination, setCashPagination] = useState({ current_page: 1, page_size: 50 })
    const [detailPagination, setDetailPagination] = useState({ current_page: 1, page_size: 50 })

    const [submitValue, setSubmitValue] = React.useState()
    const [prevMode, setPrevMode] = React.useState([])
    const columns = [
      {
        title: 'Username',
        dataIndex: 'username',
        fixed: 'left',
        width: 150,
        render: (text, record) => {
          return (
            <Button
              icon={<PartitionOutlined />}
              type="link"
              className="p-0"
              onClick={() => tableHandler(record)}
            >
              {text}
            </Button>
          )
        },
      },
      {
        title: 'Turn Over',
        dataIndex: 'bet_amount',
        width: 100,
        align: 'right',
        render: text => <Amount value={text} />,
      },
      {
        title: 'Gross Comm',
        dataIndex: 'gross_comm',
        width: 100,
        align: 'right',
        render: text => <Amount value={text} />,
      },
      {
        title: 'Member',
        children: [
          {
            title: 'Win',
            dataIndex: 'win_member',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            title: 'Comm',
            dataIndex: 'comm_amt_member',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            title: 'Total',
            dataIndex: 'total_member',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
        ],
      },
      {
        title: 'Agent',
        children: [
          {
            title: 'Win',
            dataIndex: 'win_agent',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            width: 100,
            dataIndex: 'comm_amt_agent',
            align: 'right',
            title: 'Comm',
            render: text => <Amount value={text} />,
          },
          {
            width: 100,
            dataIndex: 'total_agent',
            align: 'right',
            title: 'Total',
            render: text => <Amount value={text} />,
          },
        ],
      },
      {
        title: 'MA',
        children: [
          {
            title: 'Win',
            dataIndex: 'win_ma',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            title: 'Comm',
            dataIndex: 'comm_amt_ma',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            title: 'Total',
            dataIndex: 'total_ma',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
        ],
      },
      {
        title: 'SMA',
        children: [
          {
            title: 'Win',
            dataIndex: 'win_sma',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            width: 100,
            dataIndex: 'comm_amt_sma',
            align: 'right',
            title: 'Comm',
            render: text => <Amount value={text} />,
          },
          {
            title: 'Total',
            dataIndex: 'total_sma',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
        ],
      },
      {
        title: 'SSMA',
        children: [
          {
            title: 'Win',
            dataIndex: 'win_ssma',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            title: 'Comm',
            dataIndex: 'comm_amt_ssma',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            title: 'Total',
            dataIndex: 'total_ssma',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
        ],
      },
      {
        title: 'Company',
        children: [
          {
            title: 'Win',
            dataIndex: 'win_company',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            title: 'Comm',
            dataIndex: 'comm_amt_company',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
          {
            title: 'Total',
            dataIndex: 'total_company',
            width: 100,
            align: 'right',
            render: text => <Amount value={text} />,
          },
        ],
      },
    ]

    const tableHandler = record => {
      const report_type = record.customer_level === 'Member' ? 'detail' : ''

      setCashPagination(prev => ({ ...prev, current_page: 1 }))
      setDetailPagination(prev => ({ ...prev, current_page: 1 }))
      setPrevMode(prev =>
        prev.concat({
          key: record.username,
          label: record.username,
          payload: {
            username: record.username,
            report_type,
          },
        }),
      )
    }
    const breadCrumbHandler = selectedMenu => {
      const getIndexMenu = prevMode.findIndex(data => data.key === selectedMenu)
      const backMode = prevMode.filter((data, index) => index < getIndexMenu)

      setCashPagination(prev => ({ ...prev, current_page: 1 }))
      setPrevMode(backMode)
    }
    React.useEffect(() => {
      setPrevMode([]) // side effect to reload
      setCashPagination(prev => ({ ...prev, current_page: 1 }))
    }, [submitValue])
    React.useEffect(() => {
      if (!submitValue) return // return on first render
      const prevPayload = prevMode.reduce((acc, cur) => ({ ...acc, ...cur.payload }), {})
      const payload = {
        ...submitValue,
        ...prevPayload,
      }
      if (payload.report_type !== 'detail') {
        Load(
          {
            ...payload,
            current_page_cash: cashPagination.current_page,
            page_size_cash: cashPagination.page_size,
          },
          () => setPrevMode(prev => prev.slice(0, prev.length - 1)),
        )
      } else {
        LoadDetail({ ...payload, ...detailPagination }, () =>
          setPrevMode(prev => prev.slice(0, prev.length - 1)),
        )
      }
    }, [prevMode, cashPagination, detailPagination, Load, LoadDetail]) // eslint-disable-line react-hooks/exhaustive-deps

    const showDetail = prevMode[prevMode.length - 1]?.payload.report_type === 'detail'
    return (
      <>
        <div className="card">
          <div className="card-header">
            <Form
              className="w-100"
              form={form}
              initialValues={{
                gl_date: [maxDate, maxDate],
                branch_id: '',
              }}
              onFinish={values =>
                setSubmitValue({
                  ...values,
                  date_from: values.gl_date[0].format('YYYY-MM-DD'),
                  date_to: values.gl_date[1].format('YYYY-MM-DD'),
                  hist_or_post: hist ? '_Hist' : '_Post',
                })
              }
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="gl_date"
                    extra={
                      <Typography.Text type="danger">
                        {`Valid from ${minDate.format('YYYY-MM-DD')} - ${maxDate.format(
                          'YYYY-MM-DD',
                        )}`}
                      </Typography.Text>
                    }
                  >
                    <RangePicker
                      allowClear={false}
                      format="YYYY-MM-DD"
                      className="w-100"
                      disabledDate={current => current < minDate || current > maxDate}
                      presets={getPresetsMinMaxDate(minDate, maxDate)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="branch_id">
                    <Select options={branchOptions} className="w-100" />
                  </Form.Item>
                  <Form.Item name="username">
                    <Input className="w-100" placeholder="Username" />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
          <div className="card-body">
            <Flex vertical className="h-100">
              <Breadcrumb separator=">>">
                {prevMode.map(data => {
                  return (
                    <Breadcrumb.Item key={data.key} onClick={() => breadCrumbHandler(data.key)}>
                      <Button type="link">{data.label}</Button>
                    </Breadcrumb.Item>
                  )
                })}
              </Breadcrumb>

              {!showDetail && (
                <Table
                  rowKey="username"
                  bordered
                  loading={loading}
                  dataSource={dataCash}
                  columns={columns}
                  className="h-100"
                  scroll={{ x: 'max-content', y: true }}
                  pagination={{
                    current: cashPagination.current_page,
                    pageSize: cashPagination.page_size,
                    showSizeChanger: true,
                    total: totalCash,
                    showTotal: total => `Total ${total} items`,
                    onChange: (current_page, page_size) => {
                      setCashPagination({ page_size, current_page })
                    },
                  }}
                />
              )}

              {showDetail && (
                <TableDetail
                  bordered
                  loading={loading}
                  className="h-100"
                  dataSource={dataDetail}
                  pagination={false}
                  footer={() => (
                    // seperate pagination because rowspan+pagination not working
                    <Pagination
                      className="justify-content-end"
                      current={detailPagination.current_page}
                      pageSize={detailPagination.page_size}
                      showSizeChanger
                      total={totalDetail}
                      showTotal={total => `Total ${total} items`}
                      onChange={(current_page, page_size) => {
                        setDetailPagination(prev => ({ ...prev, current_page, page_size }))
                      }}
                    />
                  )}
                />
              )}
            </Flex>
          </div>
          <div className="card-footer">
            <Text className="text-primary">*All figures are in Foreign Currency</Text>
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(CompanyWinLossForeign)
