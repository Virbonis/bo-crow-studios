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
  Drawer,
  Breadcrumb,
  Typography,
  Flex,
} from 'antd'
import { PartitionOutlined } from '@ant-design/icons'
import { MapListSpecialBasket, getPresetsMinMaxDate, validatorNumeric } from 'helper'
import { connect } from 'react-redux'
import actions from 'redux/breakdown-report/actions'
import { Amount, useGetDateTimeBusinessHour, useGetLastGLDate } from 'components/blaise'
import dayjs from 'dayjs'
import Detail from './detail'
import useReportOptions from '../shared-components/useReportOptions'

const { Text } = Typography
const mapStateToProps = ({ breakdownReport }, { hist }) => ({
  loadingDownload: hist
    ? breakdownReport.loadingDownload_Hist
    : breakdownReport.loadingDownload_Post,
  loadingData: hist ? breakdownReport.loadingData_Hist : breakdownReport.loadingData_Post,
  tableData: hist
    ? breakdownReport.data_Hist.result?.map((data, index) => {
        return { ...data, key: index + 1 }
      }) || []
    : breakdownReport.data_Post.result?.map((data, index) => {
        return { ...data, key: index + 1 }
      }) || [],
  totalMember: hist
    ? breakdownReport.data_Hist.total_member
    : breakdownReport.data_Post.total_member,
  tableSingleParlay: hist
    ? breakdownReport.data_Hist.result_single_parlay?.map((data, index) => {
        return { ...data, key: index + 1 }
      }) || []
    : breakdownReport.data_Post.result_single_parlay?.map((data, index) => {
        return { ...data, key: index + 1 }
      }) || [],
  tableComboParlay: hist
    ? breakdownReport.data_Hist.result_combo_parlay?.map((data, index) => {
        return { ...data, key: index + 1 }
      }) || []
    : breakdownReport.data_Post.result_combo_parlay?.map((data, index) => {
        return { ...data, key: index + 1 }
      }) || [],
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  Load: (payload, failedCallback) => {
    dispatch({
      type: actions.LOAD_BREAKDOWN_REPORT,
      payload,
      source: 'Breakdown Report',
      failedCallback,
    })
  },
  DownloadBetDetail: payload => {
    dispatch({
      type: actions.DOWNLOAD_BET_DETAIL,
      payload,
      source: 'Breakdown Report',
    })
  },
  DownloadBetDetailDate: payload => {
    dispatch({
      type: actions.DOWNLOAD_BET_DETAIL_DATE,
      payload,
      source: 'Breakdown Report',
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

const { RangePicker } = DatePicker

const DBGameTypeTennis = '1101,1102,1103,1104,1105,1106,1107,1108,1109,1110,1111,1112,1113,1114,1115,1116,1117,1118,1119,1120' // prettier-ignore
const DBGameTypeBasket = Object.entries(MapListSpecialBasket).reduce((acc, [, val]) => {
  if (acc === '') acc += `${val}`
  else acc += `,${val}`
  return acc
}, '')

const DBGameType = '-1,0,2,5,6,1,8,3,16,7,9,15,20,28,63,64,12,17'
  .concat(DBGameTypeTennis)
  .concat(DBGameTypeBasket)
  .split(',')

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

const BreakdownReport = wrapperDate(
  ({
    minDate,
    maxDate,
    subtractDateTime,
    hist,
    loadingDownload,
    loadingData,
    tableData,
    totalMember,
    tableSingleParlay,
    tableComboParlay,

    Load,
    DownloadBetDetail,
    DownloadBetDetailDate,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const {
      breakdownReportTypeOptions,
      branchOptions,
      userTeamOptions,
      gameTypeOptions,
      sportOptions,
      specialCodeOptions,
      competitionOptions,
      productOptions,
      drawOptions,
      GTGroupOptions,
      currencyOptions,
      platformOptions,
      groupOptions,
    } = useReportOptions('breakdown')

    const [form] = Form.useForm()

    const [submitValue, setSubmitValue] = useState()
    const [prevMode, setPrevMode] = useState([])
    const [detailValue, setDetailValue] = useState({})
    const [visibleDetail, setVisibleDetail] = useState(false)

    const currentReportType =
      prevMode[prevMode.length - 1]?.payload.report_type || submitValue?.report_type
    const currentIsMemberCount = submitValue?.include_member_count
    const columns = [
      {
        title: 'No',
        dataIndex: 'key',
        align: 'center',
        width: 30,
      },
      {
        title: currentReportType,
        width: 400,
        render: ({ drill_id, desc }, record) => {
          if (
            ['Month', 'Sport', 'League', 'Match', 'Special'].includes(currentReportType) &&
            desc !== 'Outright'
          ) {
            return (
              <Button
                icon={<PartitionOutlined />}
                className="p-0"
                type="link"
                onClick={() => tableHandler({ drill_id, desc })}
              >
                {desc}
              </Button>
            )
          }
          // else(date, branch, game type, currency, platform)
          return (
            <Row justify="space-between">
              {desc}
              {currentReportType === 'Date' && (
                <Button
                  className="p-0"
                  type="link"
                  onClick={() =>
                    DownloadBetDetailDate({
                      ...submitValue,
                      gl_date_from: record.desc.formatDate(),
                      gl_date_to: record.desc.formatDate(),
                      current_page: 1,
                      page_size: 1000000,
                      order_by: 'Bet_Date',
                    })
                  }
                >
                  Export
                </Button>
              )}
            </Row>
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
        render: (text, record) => {
          if (currentReportType !== 'Platform') {
            return (
              <Button className="p-0" type="link" onClick={() => detailHandler(record)}>
                <Amount value={text} />
              </Button>
            )
          }
          return <Amount value={text} />
        },
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
    const columnsParlay = [
      {
        title: 'No',
        dataIndex: 'key',
        align: 'center',
        width: 40,
      },
      {
        title: 'Match',
        align: 'center',
        dataIndex: 'match',
        width: 100,
      },
      {
        title: 'Combo',
        align: 'center',
        dataIndex: 'combo',
        width: 100,
      },
      {
        title: 'Bets Count',
        dataIndex: 'bets_count',
        align: 'center',
        width: 100,
      },
      {
        title: 'Member Winloss',
        dataIndex: 'member_result_rmb',
        align: 'right',
        width: 100,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Company Winloss',
        dataIndex: 'company_result_rmb',
        align: 'right',
        width: 120,
        render: text => <Amount value={text} />,
      },
    ]

    const tableHandler = ({ drill_id, desc }) => {
      const additionalValue = {}
      if (currentReportType === 'Month') {
        const startOfMonth = dayjs(desc).startOf('month')
        let endOfMonth = dayjs(desc).endOf('month')
        if (maxDate < endOfMonth) endOfMonth = maxDate
        additionalValue.gl_date_from = startOfMonth.format('YYYY-MM-DD')
        additionalValue.gl_date_to = endOfMonth.format('YYYY-MM-DD')
        additionalValue.report_type = 'Date'
      } else if (currentReportType === 'Sport') {
        const findSportIndex = sportOptions.findIndex(data => data.label === desc)
        additionalValue.sport_id = findSportIndex !== -1 ? sportOptions[findSportIndex].value : -99
        additionalValue.report_type = findSportIndex !== -1 ? 'League' : 'Parlay'
      } else if (currentReportType === 'League') {
        additionalValue.league_id = drill_id
        additionalValue.report_type = 'Match'
      } else if (currentReportType === 'Match') {
        additionalValue.match_id = drill_id
        additionalValue.report_type = 'GameType'
      } else if (currentReportType === 'Special') {
        additionalValue.special_match = drill_id
        additionalValue.report_type = 'League'
      }

      setPrevMode(prev =>
        prev.concat({
          key: drill_id,
          label: desc,
          payload: additionalValue,
        }),
      )
    }
    const breadCrumbHandler = selectedMenu => {
      const getIndexMenu = prevMode.findIndex(data => data.key === selectedMenu)
      const backMode = prevMode.filter((data, index) => index < getIndexMenu)

      setPrevMode(backMode)
    }
    const detailHandler = ({ drill_id, desc }) => {
      const additionalValue = {}

      if (currentReportType === 'Month') {
        const startOfMonth =
          dayjs(desc).startOf('month') < dayjs(submitValue.gl_date_from)
            ? dayjs(submitValue.gl_date_from)
            : dayjs(desc).startOf('month')
        additionalValue.gl_date_from = startOfMonth.format('YYYY-MM-DD')
        additionalValue.gl_date_to = dayjs(desc)
          .endOf('month')
          .format('YYYY-MM-DD')
      } else if (currentReportType === 'Date') {
        additionalValue.gl_date_from = dayjs(desc).format('YYYY-MM-DD')
        additionalValue.gl_date_to = dayjs(desc).format('YYYY-MM-DD')
      } else if (currentReportType === 'Branch')
        additionalValue.branch = branchOptions.find(data => data.label === desc)?.value
      else if (currentReportType === 'Sport') additionalValue.sport_id = Number(drill_id)
      else if (currentReportType === 'League') additionalValue.league_id = drill_id
      else if (currentReportType === 'Match') additionalValue.match_id = drill_id
      else if (currentReportType === 'GameType') {
        additionalValue.game_type = Number(drill_id)

        if (desc.includes('(Live)')) additionalValue.st_live = 'Y'
        else if (DBGameType.includes(drill_id)) additionalValue.st_live = 'N'

        if (submitValue.match_id) {
          additionalValue.match_id = submitValue.match_id
        } else if (prevMode.length > 0) {
          additionalValue.match_id = prevMode[prevMode.length - 1].key
        } else {
          additionalValue.match_id = 0
        }
      } else if (currentReportType === 'Currency') additionalValue.currency = drill_id
      else if (currentReportType === 'Special') additionalValue.special_match = drill_id

      setDetailValue({
        detailValue: {
          ...submitValue,
          ...additionalValue,
          report_type: currentReportType,
          order_by: 'Bet_Date',
        },
        prevMode: prevMode.concat({ key: drill_id, label: desc }),
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
                  report_type: 'Month',
                  branch_id: '',
                  user_team: 0,
                  game_type: -99,
                  sport_id: -99,
                  special_match: '',
                  competition: '',
                  product: '',
                  st_live: '',
                  currency: '',
                  txn_type: '',
                  price_group: 0,
                  draw: 0,
                }}
                onFinish={values => {
                  const payload = {
                    ...values,
                    gl_date_from: values.date_range[0].format('YYYY-MM-DD'),
                    gl_date_to: values.date_range[1].format('YYYY-MM-DD'),
                    include_member_count: values.include_member_count ? 1 : 0,
                    hist_or_post: hist ? '_Hist' : '_Post',
                  }
                  setSubmitValue(payload)
                }}
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
                    <Form.Item name="report_type">
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={breakdownReportTypeOptions}
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
                          {drawOptions.map(item => (
                            <Radio key={item.value} value={item.value}>
                              {item.label}
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item name="st_live">
                      <Select showSearch optionFilterProp="label" options={GTGroupOptions} />
                    </Form.Item>
                    <Form.Item name="currency">
                      <Select showSearch optionFilterProp="label" options={currencyOptions} />
                    </Form.Item>
                    <Form.Item name="txn_type">
                      <Select showSearch optionFilterProp="label" options={platformOptions} />
                    </Form.Item>
                    <Form.Item name="price_group">
                      <Select showSearch optionFilterProp="label" options={groupOptions} />
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
              {currentReportType !== 'Parlay' && (
                <Table
                  bordered
                  size="small"
                  rowKey={record => `${record.drill_id}-${record.desc}`}
                  loading={loadingData}
                  dataSource={tableData}
                  columns={columns}
                  pagination={false}
                  scroll={{ x: 'max-content', y: true }}
                  summary={data => {
                    let totalBetsCount = 0
                    let totalBetAmount = 0
                    let totalCompanyStock = 0
                    let totalMemberWinloss = 0
                    let totalCompanyWinloss = 0
                    let totalMargin1 = 0
                    let totalMargin2 = 0
                    let totalAvgBetTicket = 0

                    data.forEach(
                      ({
                        bet_count,
                        bet_amount_rmb,
                        company_stock_rmb,
                        company_result_rmb,
                        member_result_rmb,
                      }) => {
                        totalBetsCount += bet_count
                        totalBetAmount += bet_amount_rmb
                        totalCompanyStock += company_stock_rmb
                        totalMemberWinloss += member_result_rmb
                        totalCompanyWinloss += company_result_rmb
                        totalMargin1 = (totalMemberWinloss / totalBetAmount) * -100
                        totalMargin2 = (totalCompanyWinloss / totalCompanyStock) * 100
                        totalAvgBetTicket = totalBetAmount / totalBetsCount
                      },
                    )
                    return (
                      data.length > 0 && (
                        <Table.Summary>
                          <Table.Summary.Row
                            className="font-weight-bold bg-light-yellow"
                            align="right"
                          >
                            <Table.Summary.Cell colSpan={2} align="center">
                              Total
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align="center">
                              {currentIsMemberCount && <Amount value={totalMember} int />}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align="center">
                              <Amount value={totalBetsCount} length={0} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalBetAmount} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalCompanyStock} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalMemberWinloss} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalCompanyWinloss} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalMargin1} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalMargin2} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalAvgBetTicket} />
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </Table.Summary>
                      )
                    )
                  }}
                />
              )}
              {currentReportType === 'Parlay' && (
                <div className="w-50">
                  <div align="center">
                    <Text className="text-primary">Single Parlay</Text>
                  </div>
                  <Table
                    bordered
                    size="small"
                    rowKey="drill_id"
                    loading={loadingData}
                    dataSource={tableSingleParlay}
                    columns={columnsParlay}
                    pagination={false}
                    summary={data => {
                      let totalBetsCount = 0
                      let totalMemberWinloss = 0
                      let totalCompanyWinloss = 0
                      data.forEach(({ bets_count, company_result_rmb, member_result_rmb }) => {
                        totalBetsCount += bets_count
                        totalMemberWinloss += member_result_rmb
                        totalCompanyWinloss += company_result_rmb
                      })
                      return (
                        <Table.Summary>
                          <Table.Summary.Row
                            align="right"
                            className="font-weight-bold bg-light-yellow"
                          >
                            <Table.Summary.Cell colSpan={3} align="center">
                              Total
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align="center">{totalBetsCount}</Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalMemberWinloss} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalCompanyWinloss} />
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </Table.Summary>
                      )
                    }}
                  />
                  <div align="center">
                    <Text className="text-primary">Combo Parlay</Text>
                  </div>
                  <Table
                    bordered
                    size="small"
                    rowKey="drill_id"
                    loading={loadingData}
                    dataSource={tableComboParlay}
                    columns={columnsParlay}
                    pagination={false}
                    summary={data => {
                      let totalBetsCount2 = 0
                      let totalMemberWinloss2 = 0
                      let totalCompanyWinloss2 = 0
                      data.forEach(({ bets_count, company_result_rmb, member_result_rmb }) => {
                        totalBetsCount2 += bets_count
                        totalMemberWinloss2 += member_result_rmb
                        totalCompanyWinloss2 += company_result_rmb
                      })

                      let totalBetsCount1 = 0
                      let totalMemberWinloss1 = 0
                      let totalCompanyWinloss1 = 0
                      tableSingleParlay.forEach(
                        ({ bets_count, company_result_rmb, member_result_rmb }) => {
                          totalBetsCount1 += bets_count
                          totalMemberWinloss1 += member_result_rmb
                          totalCompanyWinloss1 += company_result_rmb
                        },
                      )
                      const totalBetsCount = totalBetsCount1 + totalBetsCount2
                      const totalMemberWinloss = totalMemberWinloss1 + totalMemberWinloss2
                      const totalCompanyWinloss = totalCompanyWinloss1 + totalCompanyWinloss2

                      return (
                        <>
                          <Table.Summary.Row
                            align="right"
                            className="font-weight-bold bg-light-yellow"
                          >
                            <Table.Summary.Cell colSpan={3} align="center">
                              Total
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align="center">
                              {totalBetsCount2}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalMemberWinloss2} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalCompanyWinloss2} />
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                          <Table.Summary.Row align="right" className="font-weight-bold">
                            <Table.Summary.Cell colSpan={3} align="center">
                              Total All
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align="center">{totalBetsCount}</Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalMemberWinloss} />
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              <Amount value={totalCompanyWinloss} />
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </>
                      )
                    }}
                  />
                </div>
              )}
            </Flex>
          </div>
        </div>
        <Drawer
          title="Breakdown Report Detail"
          width="100%"
          open={visibleDetail}
          onClose={() => setVisibleDetail(false)}
          destroyOnClose
          footer={
            <Button
              type="primary"
              loading={loadingDownload}
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
          }
        >
          <Detail {...detailValue} hist={hist} />
        </Drawer>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownReport)
