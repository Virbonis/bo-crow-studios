import React, { useState } from 'react'
import {
  Select,
  Row,
  Col,
  Table,
  Form,
  DatePicker,
  Checkbox,
  Input,
  Radio,
  Space,
  Button,
  Breadcrumb,
  Drawer,
  Typography,
  Flex,
} from 'antd'
import { PartitionOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { getPresetsMinMaxDate, validatorNumeric } from 'helper'
import actions from 'redux/breakdown-report-ut/actions'
import actionsBreakdownReport from 'redux/breakdown-report/actions'
import { Amount, useGetDateTimeBusinessHour, useGetLastGLDate } from 'components/blaise'
import dayjs from 'dayjs'
import Detail from './detail'
import useReportOptions from '../shared-components/useReportOptions'

const { Text } = Typography
const mapStateToProps = ({ breakdownReport, breakdownReportUT }, { hist }) => ({
  loadingDownload: hist
    ? breakdownReport.loadingDownload_Hist
    : breakdownReport.loadingDownload_Post,
  loadingData: hist ? breakdownReportUT.loadingData_Hist : breakdownReportUT.loadingData_Post,
  tableData: hist
    ? breakdownReportUT.data_Hist.result?.map((data, index) => {
        return { ...data, key: index + 1 }
      }) || []
    : breakdownReportUT.data_Post.result?.map((data, index) => {
        return { ...data, key: index + 1 }
      }) || [],
  totalMember: hist
    ? breakdownReportUT.data_Hist.total_member
    : breakdownReportUT.data_Post.total_member,
  header: hist
    ? breakdownReportUT.data_Hist.result_header?.header || 'User Team'
    : breakdownReportUT.data_Post.result_header?.header || 'User Team',
  hasDrillDown: hist
    ? breakdownReportUT.data_Hist.result_header?.link
    : breakdownReportUT.data_Post.result_header?.link,
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  Load: (payload, failedCallback) => {
    dispatch({
      type: actions.LOAD_BREAKDOWN_REPORT_UT,
      payload,
      source: 'Breakdown Report UT',
      failedCallback,
    })
  },
  DownloadBetDetail: payload => {
    dispatch({
      type: actionsBreakdownReport.DOWNLOAD_BET_DETAIL,
      payload,
      source: 'Breakdown Report UT',
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

const { RangePicker } = DatePicker
const reportType = 'UserTeam|UserTeamSub|Trader|League|Match|GameType'.split('|')

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
      subtractDateTime={defaultDateTime.clone().subtract(45, 'day')}
      hist={hist}
    />
  )
}

const BreakdownReportUT = wrapperDate(
  ({
    minDate,
    maxDate,
    subtractDateTime,
    hist,

    loadingDownload,
    loadingData,
    tableData,
    totalMember,
    header,
    hasDrillDown,

    Load,
    DownloadBetDetail,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const {
      branchOptions,
      userTeamOptions,
      gameTypeOptions,
      sportOptions,
      specialCodeOptions,
      competitionOptions,
      productOptions,
      GTGroupOptions,
    } = useReportOptions('breakdown')

    const [form] = Form.useForm()

    const [submitValue, setSubmitValue] = useState()
    const [prevMode, setPrevMode] = useState([])
    const [detailValue, setDetailValue] = useState()
    const [visibleDetail, setVisibleDetail] = useState()

    const currentReportType = reportType[prevMode.length]
    const currentIsMemberCount = submitValue?.include_member_count
    const columns = [
      {
        title: 'No',
        dataIndex: 'key',
        align: 'center',
        width: 30,
      },
      {
        title: header,
        width: 400,
        render: ({ drill_id, desc }) => {
          if (drill_id === '-99' || drill_id === '-77' || !hasDrillDown) return desc
          return (
            <Button
              icon={<PartitionOutlined />}
              type="link"
              className="p-0"
              onClick={() => tableHandler({ drill_id, desc })}
            >
              {desc}
            </Button>
          )
        },
      },
      {
        title: 'Member Count',
        dataIndex: 'member_count',
        align: 'center',
        width: 100,
        render: text => (currentIsMemberCount ? text : '-'),
      },
      {
        title: 'Bets Count',
        dataIndex: 'bet_count',
        align: 'center',
        width: 50,
      },
      {
        title: 'Bet Amount',
        dataIndex: 'bet_amount_rmb',
        align: 'right',
        width: 120,
        render: (text, record) => (
          <Button className="p-0" type="link" onClick={() => detailHandler(record)}>
            <Amount value={text} />
          </Button>
        ),
      },
      {
        title: 'Company Stock',
        dataIndex: 'company_stock_rmb',
        align: 'right',
        width: 80,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Member Winloss',
        dataIndex: 'member_result_rmb',
        align: 'right',
        width: 80,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Company Winloss',
        dataIndex: 'company_result_rmb',
        align: 'right',
        width: 80,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Margin 1',
        align: 'right',
        width: 80,
        render: record => {
          if (record.bet_amount_rmb === 0) return 0
          const margin1 = (record.member_result_rmb / record.bet_amount_rmb) * -100
          return <Amount value={margin1} />
        },
      },
      {
        title: 'Margin 2',
        align: 'right',
        width: 80,
        render: record => {
          if (record.company_stock_rmb === 0) return 0
          const margin2 = (record.company_result_rmb / record.company_stock_rmb) * 100
          return <Amount value={margin2} />
        },
      },
      {
        title: 'Avg. Bet/Ticket',
        align: 'right',
        width: 80,
        render: record => {
          if (record.bet_count === 0) return 0
          const averageBetTicket = record.bet_amount_rmb / record.bet_count
          return <Amount value={averageBetTicket} />
        },
      },
    ]

    const tableHandler = ({ drill_id, desc }) => {
      const additionalValue = {}
      if (currentReportType === 'UserTeam') {
        additionalValue.fid_user_team = drill_id
      } else if (currentReportType === 'UserTeamSub') {
        additionalValue.param2 = drill_id
      } else if (currentReportType === 'Trader') {
        additionalValue.param3 = drill_id
      } else if (currentReportType === 'League') {
        additionalValue.param4 = drill_id
      } else if (currentReportType === 'Match') {
        additionalValue.param5 = drill_id
      }

      setPrevMode(prev =>
        prev.concat([
          {
            key: drill_id,
            label: desc,
            payload: additionalValue,
          },
        ]),
      )
    }
    const breadCrumbHandler = selectedMenu => {
      const getIndexMenu = prevMode.findIndex(data => data.key === selectedMenu)
      const backMode = prevMode.filter((data, index) => index < getIndexMenu)

      setPrevMode(backMode)
    }
    const detailHandler = ({ drill_id, desc }) => {
      const additionalValue = {}
      if (prevMode.length === 0) {
        additionalValue.report_type = 'UserTeam'.toLowerCase()
        additionalValue.fid_user_team = drill_id
      } else if (prevMode.length === 1) {
        additionalValue.report_type = 'UserTeamSub'.toLowerCase()
        additionalValue.param2 = drill_id
      } else if (prevMode.length === 2) {
        additionalValue.report_type = 'UserTeam_Trader'.toLowerCase()
        additionalValue.param3 = drill_id
      } else if (prevMode.length === 3) {
        additionalValue.report_type = 'UserTeam_League'.toLowerCase()
        additionalValue.param4 = drill_id
      } else if (prevMode.length === 4) {
        additionalValue.report_type = 'UserTeam_Match'.toLowerCase()
        additionalValue.param5 = drill_id
      } else additionalValue.report_type = 'Userteam_gametype'.toLowerCase()

      const prevParam = prevMode.reduce((acc, curr) => {
        acc[Object.keys(curr.payload)] = curr.payload[Object.keys(curr.payload)]
        return acc
      }, {})

      setDetailValue({
        detailValue: {
          ...submitValue,
          ...prevParam,
          ...additionalValue,
          order_by: 'Bet_Date',
        },
        prevMode: prevMode.concat([{ key: drill_id, label: desc }]),
      })
      setVisibleDetail(true)
    }
    React.useEffect(() => {
      setPrevMode([]) // side effect to reload
    }, [submitValue])
    React.useEffect(() => {
      if (!submitValue) return // return on first render
      const prevPayload = prevMode.reduce((acc, cur) => ({ ...acc, ...cur.payload }), {})
      Load(
        {
          ...submitValue,
          ...prevPayload,
          report_type: reportType[prevMode.length],
        },
        () => setPrevMode(prev => prev.slice(0, prev.length - 1)),
      )
    }, [prevMode, Load]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  date_range: [maxDate, maxDate],
                  branch_id: '',
                  user_team: 0,
                  game_type: -99,
                  sport_id: -99,
                  special_match: '',
                  competition: '',
                  product: '',
                  st_live: '',
                  draw: 0,
                }}
                onFinish={values =>
                  setSubmitValue({
                    ...values,
                    gl_date_from: values.date_range[0].format('YYYY-MM-DD'),
                    gl_date_to: values.date_range[1].format('YYYY-MM-DD'),
                    include_member_count: values.include_member_count ? 1 : 0,
                    hist_or_post: hist ? '_Hist' : '_Post',
                  })
                }
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="date_range" className="mb-0">
                      <RangePicker
                        allowClear={false}
                        format="YYYY-MM-DD"
                        className="w-100"
                        disabledDate={current => current < minDate || current > maxDate}
                        presets={getPresetsMinMaxDate(minDate, maxDate)}
                      />
                    </Form.Item>
                    <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
                      <Input placeholder="Match ID" />
                    </Form.Item>
                    <Form.Item
                      name="include_member_count"
                      valuePropName="checked"
                      extra={
                        <Text className="text-danger">
                          {`*If you tick this, the GL Date valid from
                      ${subtractDateTime.format('YYYY-MM-DD')} (last 45 days)`}
                        </Text>
                      }
                    >
                      <Checkbox>Include Member Count</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="branch_id">
                      <Select showSearch optionFilterProp="label" options={branchOptions} />
                    </Form.Item>
                    <Form.Item name="user_team">
                      <Select showSearch optionFilterProp="label" options={userTeamOptions} />
                    </Form.Item>
                    <Form.Item name="game_type">
                      <Select showSearch optionFilterProp="label" options={gameTypeOptions} />
                    </Form.Item>
                    <Form.Item name="sport_id">
                      <Select showSearch optionFilterProp="label" options={sportOptions} />
                    </Form.Item>
                    <Form.Item name="special_match">
                      <Select showSearch optionFilterProp="label" options={specialCodeOptions} />
                    </Form.Item>
                    <Form.Item name="competition">
                      <Select showSearch optionFilterProp="label" options={competitionOptions} />
                    </Form.Item>
                    <Form.Item name="product">
                      <Select showSearch optionFilterProp="label" options={productOptions} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="draw">
                      <Radio.Group>
                        <Space direction="vertical" size={0}>
                          <Radio value={0}>Normal</Radio>
                          <Radio value={1}>No Draws</Radio>
                          <Radio value={2}>No Draws For Turnover Only</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item name="st_live">
                      <Select showSearch optionFilterProp="label" options={GTGroupOptions} />
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Flex vertical className="h-100">
              <Breadcrumb separator=">>">
                {prevMode.map(data => (
                  <Breadcrumb.Item key={data.key}>
                    <Button type="link" onClick={() => breadCrumbHandler(data.key)}>
                      {data.label}
                    </Button>
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
              <Table
                bordered
                size="small"
                rowKey={record => `${record.drill_id}-${record.desc}`}
                loading={loadingData}
                dataSource={tableData}
                columns={columns}
                pagination={false}
                summary={data => {
                  let betsCountTotal = 0
                  let betAmountTotal = 0
                  let companyStockTotal = 0
                  let memberWinlossTotal = 0
                  let companyWinlossTotal = 0
                  let margin1Total = 0
                  let margin2Total = 0
                  let AVGBetTicketTotal = 0

                  data.forEach(
                    ({
                      bet_count,
                      bet_amount_rmb,
                      company_stock_rmb,
                      company_result_rmb,
                      member_result_rmb,
                    }) => {
                      betsCountTotal += bet_count
                      betAmountTotal += bet_amount_rmb
                      companyStockTotal += company_stock_rmb
                      memberWinlossTotal += member_result_rmb
                      companyWinlossTotal += company_result_rmb
                      margin1Total = (memberWinlossTotal / betAmountTotal) * -100
                      margin2Total = (companyWinlossTotal / companyStockTotal) * 100
                      AVGBetTicketTotal = betAmountTotal / betsCountTotal
                    },
                  )
                  return (
                    data.length > 0 && (
                      <Table.Summary>
                        <Table.Summary.Row
                          align="right"
                          className="font-weight-bold bg-light-yellow"
                        >
                          <Table.Summary.Cell colSpan={2} align="center">
                            Total
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="center">
                            {currentIsMemberCount && <Amount value={totalMember} int />}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell align="center">
                            <Amount value={betsCountTotal} length={0} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Amount value={betAmountTotal} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Amount value={companyStockTotal} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Amount value={memberWinlossTotal} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Amount value={companyWinlossTotal} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Amount value={margin1Total} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Amount value={margin2Total} />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Amount value={AVGBetTicketTotal} />
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  )
                }}
              />
            </Flex>
          </div>
        </div>
        <Drawer
          title="Breakdown Report by UT Detail"
          width="100%"
          open={visibleDetail}
          onClose={() => setVisibleDetail(false)}
          destroyOnClose
          footer={
            <Space>
              <Button
                loading={loadingDownload}
                type="primary"
                onClick={() =>
                  DownloadBetDetail({
                    ...detailValue.detailValue,
                    current_page: 1,
                    page_size: 1000000,
                    order_by: 'Bet_Date',
                  })
                }
              >
                Export
              </Button>
            </Space>
          }
        >
          <Detail {...detailValue} hist={hist} />
        </Drawer>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownReportUT)
