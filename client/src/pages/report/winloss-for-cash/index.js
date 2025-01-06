import React, { useState } from 'react'
import {
  Row,
  Col,
  Table,
  Form,
  DatePicker,
  Input,
  Button,
  Select,
  Breadcrumb,
  Typography,
  Pagination,
  Flex,
} from 'antd'
import { PartitionOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { Amount, useGetDateTimeBusinessHour, useGetLastGLDate } from 'components/blaise'
import actions from 'redux/winloss-for-cash/actions'
import dayjs from 'dayjs'
import { getPresetsMinMaxDate } from 'helper'
import useReportOptions from '../shared-components/useReportOptions'
import TableDetail from './detail'

const { Text } = Typography
const mapStateToProps = ({ winlossForCash }, { hist }) => ({
  loading: hist ? winlossForCash.loadingData_Hist : winlossForCash.loadingData_Post,
  tableData: hist ? winlossForCash.data_Hist : winlossForCash.data_Post,
  totalData: hist ? winlossForCash.total_Hist : winlossForCash.total_Post,
  summary: hist ? winlossForCash.summary_Hist : winlossForCash.summary_Post,

  dataDetail: hist ? winlossForCash.dataDetail_Hist : winlossForCash.dataDetail_Post,
  totalDetail: hist ? winlossForCash.totalDetail_Hist : winlossForCash.totalDetail_Post,
  summaryDetail: hist ? winlossForCash.summaryDetail_Hist : winlossForCash.summaryDetail_Post,
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  Load: (payload, failedCallback) => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Winloss for Cash',
      failedCallback,
    })
  },
  LoadDetail: (payload, failedCallback) => {
    dispatch({
      type: actions.LOAD_TABLE_DETAIL,
      payload,
      source: 'Winloss for Cash',
      failedCallback,
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

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

const WinlossForCash = wrapperDate(
  ({
    minDate,
    maxDate,
    hist,

    loading,
    tableData,
    totalData,
    summary,

    dataDetail,
    totalDetail,
    summaryDetail,

    Load,
    LoadDetail,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const { branchOptions, gameTypeOptions, sportOptions } = useReportOptions()

    const [form] = Form.useForm()

    const [submitValue, setSubmitValue] = useState()
    const [prevMode, setPrevMode] = React.useState([])
    const [pagination, setPagination] = useState({
      current_page: 1,
      page_size: 50,
    })
    const [orderBy, setOrderBy] = useState('')

    const columns = [
      {
        title: 'No',
        width: 30,
        align: 'center',
        render: record => <Text>{record.index_number}</Text>,
      },
      {
        title: 'Username',
        width: 200,
        render: record => (
          <>
            <Button
              icon={<PartitionOutlined />}
              type="link"
              onClick={() => tableHandler(record)}
              className="p-0"
            >
              {record.username}
            </Button>
          </>
        ),
      },
      {
        title: 'Bets Count',
        dataIndex: 'bets_count',
        align: 'center',
        width: 100,
      },
      {
        title: 'Member Count',
        dataIndex: 'member_count',
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
        title: 'Bet Amount',
        align: 'center',
        children: [
          {
            title: 'Local',
            dataIndex: 'bet_amount',
            align: 'right',
            render: text => <Amount value={text} />,
            width: 100,
          },
          {
            title: 'RMB',
            dataIndex: 'bet_amount_rmb',
            align: 'right',
            render: text => <Amount value={text} />,
            width: 100,
          },
        ],
      },
      {
        title: 'Member Winloss',
        align: 'center',
        children: [
          {
            title: 'Local',
            dataIndex: 'winloss_member',
            align: 'right',
            render: text => <Amount value={text} />,
            width: 100,
          },
          {
            title: 'RMB',
            dataIndex: 'winloss_member_rmb',
            align: 'right',
            render: text => <Amount value={text} />,
            width: 100,
          },
        ],
      },
      {
        title: 'Company Winloss',
        align: 'center',
        children: [
          {
            title: 'Local',
            dataIndex: 'winloss_company',
            align: 'right',
            render: text => <Amount value={text} />,
            width: 100,
          },
          {
            title: 'RMB',
            dataIndex: 'winloss_company_rmb',
            align: 'right',
            render: text => <Amount value={text} />,
            width: 100,
          },
        ],
      },
    ]

    const tableHandler = ({ customer_id, username, customer_level }) => {
      const additionalValue = {
        customer_id,
        username,
        report_type: customer_level === 'Member' ? 'detail' : '',
        is_get_downline: customer_level !== 'Member' ? 'Y' : 'N',
      }
      setPagination(prev => ({ ...prev, current_page: 1 }))
      setPrevMode(prev =>
        prev.concat({
          key: username,
          label: username,
          payload: additionalValue,
        }),
      )
    }
    const breadCrumbHandler = selectedMenu => {
      const getIndexMenu = prevMode.findIndex(data => data.key === selectedMenu)
      const backMode = prevMode.filter((data, index) => index < getIndexMenu)

      setPagination(prev => ({ ...prev, current_page: 1 }))
      setPrevMode(backMode)
    }
    React.useEffect(() => {
      setPrevMode([]) // side effect to reload
      setPagination(prev => ({ ...prev, current_page: 1 }))
      setOrderBy('')
    }, [submitValue])
    React.useEffect(() => {
      if (!submitValue) return // return on first render
      const prevPayload = prevMode.reduce((acc, cur) => ({ ...acc, ...cur.payload }), {})
      const payload = {
        ...submitValue,
        ...prevPayload,
        ...pagination,
        order_by: orderBy,
      }
      if (payload.report_type !== 'detail') {
        Load(payload, () => setPrevMode(prev => prev.slice(0, prev.length - 1)))
      } else {
        LoadDetail(payload, () => setPrevMode(prev => prev.slice(0, prev.length - 1)))
      }
    }, [pagination, orderBy, Load, LoadDetail]) // eslint-disable-line react-hooks/exhaustive-deps

    const showDetail = prevMode[prevMode.length - 1]?.payload.report_type === 'detail'
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
                sport_id: -99,
                game_type: -99,
              }}
              onFinish={values => {
                setSubmitValue({
                  ...values,
                  ...pagination,
                  gl_date_from: values.date_range[0].format('YYYY-MM-DD'),
                  gl_date_to: values.date_range[1].format('YYYY-MM-DD'),
                  is_get_downline: 'N',
                  hist_or_post: hist ? '_Hist' : '_Post',
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
                      allowClear={false}
                      format="YYYY-MM-DD"
                      className="w-100"
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
                    <Select showSearch optionFilterProp="label" options={branchOptions} />
                  </Form.Item>
                  <Form.Item name="sport_id">
                    <Select showSearch optionFilterProp="label" options={sportOptions} />
                  </Form.Item>
                  <Form.Item name="game_type">
                    <Select showSearch optionFilterProp="label" options={gameTypeOptions} />
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
                {/* {customerUpline?.map(data => (
              <Breadcrumb.Item key={data.username}>
                <Button type="link" onClick={() => breadcrumbHandler(data)}>
                  {data.username}
                </Button>
              </Breadcrumb.Item>
            ))} */}
              </Breadcrumb>

              {!showDetail && (
                <Table
                  bordered
                  size="small"
                  rowKey="index_number"
                  loading={loading}
                  dataSource={tableData}
                  className="h-100"
                  columns={columns}
                  scroll={{ x: 'max-content', y: true }}
                  summary={data =>
                    data.length > 0 && (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row
                          align="right"
                          className="font-weight-bold bg-light-yellow"
                        >
                          <Table.Summary.Cell index={0} colSpan={2}>
                            TOTAL
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="center">
                            <Amount value={summary.bets_count} length={0} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="center">
                            <Amount value={summary.member_count} length={0} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell />
                          <Table.Summary.Cell />
                          <Table.Summary.Cell align="right">
                            <Amount value={summary.bet_amount_rmb} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell />
                          <Table.Summary.Cell align="right">
                            <Amount value={summary.winloss_member_rmb} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell />
                          <Table.Summary.Cell align="right">
                            <Amount value={summary.winloss_company_rmb} />
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  }
                  pagination={{
                    current: pagination.current_page,
                    pageSize: pagination.page_size,
                    showSizeChanger: true,
                    total: totalData,
                    showTotal: total => `Total ${total} items`,
                    onChange: (current_page, page_size) => {
                      setPagination({ page_size, current_page })
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
                  scroll={{ x: 'max-content', y: true }}
                  footer={() => (
                    // seperate pagination because rowspan+pagination not working
                    <Pagination
                      className="justify-content-end"
                      current={pagination.current_page}
                      pageSize={pagination.page_size}
                      showSizeChanger
                      total={totalDetail}
                      showTotal={total => `Total ${total} items`}
                      onChange={(current_page, page_size) => {
                        setPagination({ current_page, page_size })
                      }}
                    />
                  )}
                  summary={data =>
                    data.length > 0 && (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row
                          align="right"
                          className="font-weight-bold bg-light-yellow"
                        >
                          <Table.Summary.Cell colSpan={8} index={0}>
                            TOTAL
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="right">
                            <Amount value={summaryDetail.bet_amount_rmb} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell />
                          <Table.Summary.Cell align="right">
                            <Amount value={summaryDetail.winloss_amount_rmb} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell />
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  }
                />
              )}
            </Flex>
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(WinlossForCash)
