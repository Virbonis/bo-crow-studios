import React, { useState } from 'react'
import {
  Select,
  Row,
  Col,
  Table,
  Form,
  DatePicker,
  Input,
  Button,
  Drawer,
  Typography,
  Breadcrumb,
} from 'antd'
import { PartitionOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/member-winloss/actions'
import { Amount, useGetDateTimeBusinessHour, useGetLastGLDate } from 'components/blaise'
import { getPresetsMinMaxDate, validatorNumeric } from 'helper'
import dayjs from 'dayjs'
import Detail from './detail'
import useReportOptions from '../shared-components/useReportOptions'

const { Text } = Typography
const mapStateToProps = ({ memberWinloss }, { hist }) => ({
  loadingData: hist ? memberWinloss.loading_Hist : memberWinloss.loading_Post,
  tableData: hist ? memberWinloss.data_Hist || [] : memberWinloss.data_Post || [],
  totalData: hist ? memberWinloss.dataTotal_Hist : memberWinloss.dataTotal_Post,
  header: hist
    ? memberWinloss.dataResultHeader_Hist?.header || 'Username'
    : memberWinloss.dataResultHeader_Post?.header || 'Username',
  hasDrillDown: hist
    ? memberWinloss.dataResultHeader_Hist?.link
    : memberWinloss.dataResultHeader_Post?.link,
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  Load: (payload, failedCallback) => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Member Winloss',
      failedCallback,
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

const { RangePicker } = DatePicker
const reportType = 'member|sport|league|match|gametype'.split('|')
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

const MemberWinloss = wrapperDate(
  ({
    minDate,
    maxDate,
    hist,

    loadingData,
    tableData,
    totalData,

    header,
    hasDrillDown,

    Load,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const {
      branchOptions,
      gameTypeOptions,
      sportOptions,
      productOptions,
      GTGroupOptions,
      currencyOptions,
      platformOptions,
      vipOptions,
    } = useReportOptions('memberwinloss')

    const [form] = Form.useForm()

    const [pagination, setPagination] = useState({
      current_page: 1,
      page_size: 50,
    })

    const [submitValue, setSubmitValue] = useState()
    const [prevMode, setPrevMode] = useState([])
    const [detailValue, setDetailValue] = useState({})
    const [visibleDetail, setVisibleDetail] = useState(false)
    const [orderBy, setOrderBy] = useState('Winloss_Member_RMB')
    const getSortObject = key => ({
      key,
      sorter: true,
      sortDirections: ['descend', 'descend'],
      sortOrder: orderBy === key ? 'descend' : null,
    })
    const columnsMember = [
      {
        title: 'No',
        align: 'center',
        width: 30,
        render: (text, record, index) =>
          (pagination.current_page - 1) * pagination.page_size + index + 1,
      },
      {
        title: header,
        width: 200,
        render: ({ drill_id, desc }) => {
          if (['-99', '-77', '-90'].includes(drill_id) || !hasDrillDown) return desc
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
        title: 'VIP Code',
        align: 'center',
        dataIndex: 'VIPCode',
        width: 60,
        render: text => text.split(',').join(', '),
      },
      {
        title: 'Profile',
        align: 'center',
        dataIndex: 'limit_profile_id',
        width: 70,
      },
      {
        title: 'Currency',
        align: 'center',
        dataIndex: 'currency',
        width: 80,
      },
      {
        title: 'Bets Count',
        align: 'center',
        width: 55,
        dataIndex: 'bets_count',
        render: text => <Amount value={text} length={0} />,
        ...getSortObject('Bets_Count'),
      },
      {
        title: 'Win %',
        align: 'center',
        width: 60,
        render: record => <Text>{`${Math.round(record.win_perc)}% (${record.win_count})`}</Text>,
      },
      {
        title: 'Draw %',
        align: 'center',
        width: 60,
        render: record => <Text>{`${Math.round(record.draw_perc)}% (${record.draw_count})`}</Text>,
      },
      {
        title: 'Loss %',
        align: 'center',
        width: 60,
        render: record => <Text>{`${Math.round(record.loss_perc)}% (${record.loss_count})`}</Text>,
      },
      {
        title: 'Bet Amount',
        align: 'right',
        width: 60,
        render: record => (
          <Button type="link" className="p-0" onClick={() => detailHandler(record)}>
            <Amount value={record.bet_amount_rmb} />
          </Button>
        ),
        ...getSortObject('Bet_Amount_RMB'),
      },
      {
        title: 'Member Winloss',
        dataIndex: 'winloss_member_rmb',
        align: 'right',
        width: 60,
        render: text => <Amount value={text} />,
        ...getSortObject('Winloss_Member_RMB'),
      },
      {
        title: 'Company Winloss',
        dataIndex: 'winloss_company_rmb',
        align: 'right',
        width: 60,
        render: text => <Amount value={text} />,
        ...getSortObject('Winloss_Company_RMB'),
      },
      {
        title: 'Join Date',
        dataIndex: 'join_date',
        align: 'center',
        width: 80,
        render: text => text.formatDateTime(),
        ...getSortObject('Join_Date'),
      },
      {
        title: 'Total Bets',
        dataIndex: 'total_bets',
        width: 55,
        align: 'center',
        render: text => <Text>{text}</Text>,
        ...getSortObject('Total_Bets'),
      },
      {
        title: 'Total Bet Amount',
        dataIndex: 'total_bet_amount',
        align: 'right',
        width: 60,
        render: text => <Amount value={text} />,
        ...getSortObject('Total_Bet_Amount'),
      },
      {
        title: 'Total Winloss Amt',
        dataIndex: 'total_winloss_amt',
        align: 'right',
        width: 60,
        render: text => <Amount value={text} />,
        ...getSortObject('Total_Winloss_Amt'),
      },
      {
        title: 'Total Winloss %',
        dataIndex: 'total_winloss_perc',
        align: 'right',
        width: 100,
        render: text => (
          <Text>
            <Amount value={text} /> %
          </Text>
        ),
        ...getSortObject('Total_Winloss_Perc'),
      },
    ]
    const columnsNonMember = [
      {
        title: 'No',
        align: 'center',
        width: 30,
        render: (text, record, index) =>
          (pagination.current_page - 1) * pagination.page_size + index + 1,
      },
      {
        title: header,
        width: 450,
        render: ({ drill_id, desc }) => {
          if (['-99', '-77', '-90'].includes(drill_id) || !hasDrillDown) return desc
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
        title: 'Currency',
        align: 'center',
        dataIndex: 'currency',
        width: 100,
      },
      {
        title: 'Bets Count',
        dataIndex: 'bets_count',
        align: 'center',
        width: 80,
        render: text => <Amount value={text} length={0} />,
        ...getSortObject('Bets_Count'),
      },
      {
        title: 'Win %',
        align: 'center',
        width: 100,
        render: record => <Text>{`${Math.round(record.win_perc)}% (${record.win_count})`}</Text>,
        ...getSortObject('Win_Perc'),
      },
      {
        title: 'Draw %',
        align: 'center',
        width: 100,
        render: record => <Text>{`${Math.round(record.draw_perc)}% (${record.draw_count})`}</Text>,
        ...getSortObject('Draw_Perc'),
      },
      {
        title: 'Loss %',
        align: 'center',
        width: 100,
        render: record => <Text>{`${Math.round(record.loss_perc)}% (${record.loss_count})`}</Text>,
        ...getSortObject('Loss_Perc'),
      },
      {
        title: 'Bet Amount',
        align: 'right',
        width: 100,
        render: record => (
          <Button type="link" className="p-0" onClick={() => detailHandler(record)}>
            <Amount value={record.bet_amount_rmb} />
          </Button>
        ),
        ...getSortObject('Bet_Amount_RMB'),
      },
      {
        title: 'Member Winloss',
        dataIndex: 'winloss_member_rmb',
        align: 'right',
        width: 100,
        render: text => <Amount value={text} />,
        ...getSortObject('Winloss_Member_RMB'),
      },
      {
        title: 'Company Winloss',
        dataIndex: 'winloss_company_rmb',
        align: 'right',
        width: 100,
        render: text => <Amount value={text} />,
        ...getSortObject('Winloss_Company_RMB'),
      },
    ]
    const currentReportType = reportType[prevMode.length]
    const columns = currentReportType === 'member' ? columnsMember : columnsNonMember

    const tableHandler = ({ drill_id, desc }) => {
      const additionalValue = {}
      if (currentReportType === 'member') {
        additionalValue.param2 = drill_id
      } else if (currentReportType === 'sport') {
        additionalValue.param3 = drill_id
      } else if (currentReportType === 'league') {
        additionalValue.param4 = drill_id
      } else if (currentReportType === 'match') {
        additionalValue.param5 = drill_id
      }

      setPagination(prev => ({ ...prev, current_page: 1 }))
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

      setPagination(prev => ({ ...prev, current_page: 1 }))
      setPrevMode(backMode)
    }
    const detailHandler = ({ drill_id, desc }) => {
      const additionalValue = {}
      if (currentReportType === 'member') {
        additionalValue.param2 = drill_id
      } else if (currentReportType === 'sport') {
        additionalValue.param3 = drill_id
      } else if (currentReportType === 'league') {
        additionalValue.param4 = drill_id
      } else if (currentReportType === 'match') {
        additionalValue.param5 = drill_id
      } else if (currentReportType === 'gametype') {
        additionalValue.param6 = drill_id
      }

      const prevParam = prevMode.reduce((acc, curr) => {
        acc[Object.keys(curr.payload)] = curr.payload[Object.keys(curr.payload)]
        return acc
      }, {})

      setDetailValue({
        detailValue: {
          ...submitValue,
          ...prevParam,
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
      setPagination(prev => ({ ...prev, current_page: 1 }))
      setOrderBy('Winloss_Member_RMB')
    }, [submitValue])
    React.useEffect(() => {
      if (!submitValue) return // return on first render
      const prevPayload = prevMode.reduce((acc, cur) => ({ ...acc, ...cur.payload }), {})
      Load(
        {
          ...submitValue,
          ...prevPayload,
          ...pagination,
          order_by: orderBy,
          report_type: reportType[prevMode.length],
        },
        () => setPrevMode(prev => prev.slice(0, prev.length - 1)),
      )
    }, [prevMode, pagination, orderBy, Load]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  // report_type: 'member', // non-drill
                  date_range: [maxDate, maxDate],
                  branch_id: '',
                  sport_id: -99,
                  game_type: -99,
                  product: '',
                  currency: '',
                  vip_code: -99,
                  st_live: '',
                  txn_type: '',
                }}
                onFinish={values =>
                  setSubmitValue({
                    ...values,
                    gl_date_from: values.date_range[0].format('YYYY-MM-DD'),
                    gl_date_to: values.date_range[1].format('YYYY-MM-DD'),
                    hist_or_post: hist ? '_Hist' : '_Post',
                  })
                }
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
                    <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
                      <Input placeholder="Match ID" />
                    </Form.Item>
                    <Form.Item name="league_id" rules={[{ validator: validatorNumeric }]}>
                      <Input placeholder="League ID" />
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
                    <Form.Item name="product">
                      <Select showSearch optionFilterProp="label" options={productOptions} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="currency">
                      <Select showSearch optionFilterProp="label" options={currencyOptions} />
                    </Form.Item>
                    <Form.Item name="vip_code">
                      <Select showSearch optionFilterProp="label" options={vipOptions} />
                    </Form.Item>
                    <Form.Item name="st_live">
                      <Select showSearch optionFilterProp="label" options={GTGroupOptions} />
                    </Form.Item>
                    <Form.Item name="txn_type">
                      <Select showSearch optionFilterProp="label" options={platformOptions} />
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
              className="h-100"
              rowKey={record => `${record.key}-${record.drill_id}`}
              loading={loadingData}
              dataSource={tableData}
              columns={columns}
              onChange={(p, f, sorter) => {
                setPagination({ current_page: p.current, page_size: p.pageSize })
                setOrderBy(sorter.columnKey)
              }}
              pagination={{
                current: pagination.current_page,
                pageSize: pagination.page_size,
                showSizeChanger: true,
                total: totalData,
                showTotal: total => `Total ${total} items`,
              }}
              scroll={{ x: 'max-content', y: true }}
            />
          </div>
          <div className="card-footer">
            <Text className="text-primary">
              *All figures are in <strong>Base</strong> Currency (RMB)
            </Text>
          </div>
        </div>
        <Drawer
          title="Member Winloss Detail"
          width="100%"
          open={visibleDetail}
          onClose={() => setVisibleDetail(false)}
          destroyOnClose
        >
          <Detail {...detailValue} hist={hist} />
        </Drawer>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(MemberWinloss)
