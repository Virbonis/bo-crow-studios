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
  Button,
  Tooltip,
  Modal,
  Space,
  Pagination,
  Typography,
  message,
  Switch,
} from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/bet-enquiry/actions'
import {
  getOddsTypeDescByOddsType,
  getWinlossStatus,
  getWinlossStatusName,
  getPlatform,
  getEarlySettlement,
  reasonOptions,
  validatorNumeric,
  getPresetsMinMaxDate,
} from 'helper'
import {
  CustomizeCell,
  VIPUsername,
  Amount,
  BetSlip,
  useGetLastGLDate,
  useGetDateTimeDBServer,
  BetGameTypeColumn,
  SelectMultipleAll,
} from 'components/blaise'
import './custom.scss'
import { ReloadOutlined } from '@ant-design/icons'
import { isEqual } from 'lodash'
import authorize from 'authorize'
import dayjs from 'dayjs'
import useReportOptions from 'pages/report/shared-components/useReportOptions'
import BetSlipDetail from './bet-enquiry-popup-detail'
import BetWinlossResult from './bet-enquiry-popup-result'

const { Text } = Typography

const mapStateToProps = ({ betEnquiry, auth }, { hist }) => ({
  tableData: hist ? betEnquiry.data_Hist.result : betEnquiry.data_Post.result,
  totalResults: hist ? betEnquiry.data_Hist.total : betEnquiry.data_Post.total,
  loadingData: hist ? betEnquiry.loadingData_Hist : betEnquiry.loadingData_Post,
  loadingDownload: hist ? betEnquiry.loadingDownload_Hist : betEnquiry.loadingDownload_Post,
  AllowedToVoidSettledTickets: auth.user.user_auth_ids.includes(
    authorize.ALLOWED_TO_VOID_SETTLED_TICKETS,
  ),
  AllowedToVoidOutstandingTickets: auth.user.user_auth_ids.includes(
    authorize.ALLOWED_TO_VOID_OUTSTANDING_TICKETS,
  ),
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Bet Enquiry',
    })
  },
  LoadExport: payload => {
    dispatch({
      type: actions.LOAD_EXPORT,
      payload,
      source: 'Bet Enquiry',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Bet Enquiry',
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

const betStatusOptions = [
  { value: '', label: 'Show All Bet Status' },
  { value: 'Outstanding', label: 'Outstanding' },
  { value: 'Settled', label: 'Settled' },
  { value: 'Early Settlement', label: 'Early Settlement' },
  { value: 'Void', label: 'Void' },
  { value: 'Reject', label: 'Reject' },
]
const buybackOptions = [
  { value: 'Include', label: 'Include Buyback' },
  { value: 'Exclude', label: 'Exclude Buyback' },
  { value: 'Only', label: 'Only Buyback' },
]

const { RangePicker } = DatePicker
const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()
  const lastGLDate = useGetLastGLDate()
  const { hist } = props

  if (!defaultDateTimeServer || !lastGLDate) return null

  return (
    <Component
      {...props}
      minDate={!hist ? lastGLDate : dayjs('2012-01-01')}
      maxDate={
        !hist ? defaultDateTimeServer.clone().add(2, 'year') : lastGLDate.clone().subtract(1, 'day')
      }
      fromDate={
        !hist
          ? defaultDateTimeServer.clone().add(-12, 'hours')
          : lastGLDate
              .clone()
              .set({ hour: defaultDateTimeServer.hour(), minute: defaultDateTimeServer.minute() })
              .subtract(36, 'hours')
      }
      toDate={
        !hist
          ? defaultDateTimeServer
          : lastGLDate
              .clone()
              .set({ hour: defaultDateTimeServer.hour(), minute: defaultDateTimeServer.minute() })
              .subtract(1, 'day')
      }
      hist={hist}
    />
  )
}

const BetEnquiry = wrapperDate(
  ({
    tableData,
    totalResults,
    loadingData,
    loadingDownload,
    minDate,
    maxDate,
    fromDate,
    toDate,
    hist,
    AllowedToVoidSettledTickets,
    AllowedToVoidOutstandingTickets,
    Load,
    LoadExport,
    Update,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()
    const [formTable] = Form.useForm()
    const [visibleUpdateModal, setVisibleUpdateModal] = useState({ visible: false, type: '' })

    const [pagination, setPagination] = useState({
      current_page: 1,
      page_size: 50,
    })
    const [orderBy, setOrderBy] = useState('')
    const reload = React.useCallback(() => {
      form.submit()
      formTable.resetFields()
    }, [form, formTable])

    const getSortObject = React.useCallback(
      key => {
        return {
          key,
          sorter: true,
          sortDirections: ['descend', 'descend'],
          sortOrder: orderBy === key ? 'descend' : null,
        }
      },
      [orderBy],
    )
    const [getRowSpan, getRowNumber] = React.useMemo(() => {
      const isFirstRow = record => {
        const index =
          record.status_ticket !== 2
            ? tableData.findIndex(x => x.bet_id === record.bet_id && x.match_id === record.match_id)
            : tableData.findIndex(
                x => x.pending_bet_id === record.pending_bet_id && x.match_id === record.match_id,
              )
        if (index === -1) return false
        if (index === 0) return true
        const prev = tableData[index - 1]
        if (record.status_ticket !== 2) return prev.bet_id !== record.bet_id
        return prev.pending_bet_id !== record.pending_bet_id
      }
      const rowCount = record =>
        record.status_ticket !== 2
          ? tableData.filter(x => x.bet_id === record.bet_id).length
          : tableData.filter(x => x.pending_bet_id === record.pending_bet_id).length

      const uniqData = tableData?.reduce((acc, cur) => {
        const index =
          cur.status_ticket !== 2
            ? acc.findIndex(x => x.bet_id === cur.bet_id)
            : acc.findIndex(x => x.pending_bet_id === cur.pending_bet_id)
        if (index === -1) acc.push(cur)
        return acc
      }, [])

      return [
        record => {
          if (!isFirstRow(record)) return 0
          if (record.status_ticket !== 2) return rowCount(record)
          return rowCount(record)
        },
        record =>
          record.status_ticket !== 2
            ? uniqData.findIndex(x => x.bet_id === record.bet_id) + 1
            : uniqData.findIndex(x => x.pending_bet_id === record.pending_bet_id) + 1,
      ]
    }, [tableData])

    const columns = React.useMemo(
      () => [
        {
          title: 'No',
          align: 'center',
          width: 30,
          render: (text, record) => getRowNumber(record),
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Username',
          align: 'center',
          width: 100,
          render: record => <VIPUsername {...record} />,
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Bet ID',
          align: 'center',
          width: 100,
          render: record => {
            return (
              <Space direction="vertical" size={0}>
                {record.bet_id !== 0 && record.bet_id}
                <Text className="text-danger">{`(${getPlatform(record.bet_type)})`}</Text>
                {record.bet_type === 'BUY' && (
                  <Space direction="vertical" size={0}>
                    <Text className="text-danger">Entried by </Text>
                    {record.user_admin_buy_back}
                  </Space>
                )}
                {record.pending_bet_id !== 0 && (
                  <Text className="text-success">{`(P${record.pending_bet_id})`}</Text>
                )}
                {getEarlySettlement(record.early_settlement_id)}
              </Space>
            )
          },
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Bet Date',
          align: 'center',
          ...getSortObject(''),
          width: 75,
          render: ({ bet_date, pending_bet_id, game_type, accept_pending_date }) => (
            <Space direction="vertical" size={0}>
              {bet_date}
              {(pending_bet_id !== 0 || game_type === 4000) && (
                <span className="text-success">{`(${accept_pending_date})`}</span>
              )}
            </Space>
          ),
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Game Type',
          align: 'center',
          width: 80,
          render: record => (
            <>
              <BetGameTypeColumn {...record} /> <br />
              <BetSlipDetail record={{ ...record, hist }} />
            </>
          ),
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Match ID',
          align: 'center',
          width: 60,
          render: record => (
            <Space direction="vertical" size={0}>
              {record.match_id !== 0 && record.match_id}
              {record.game_type === -1 &&
                getWinlossStatusName(record.parlay_match_winloss_status, record.jwl)}
            </Space>
          ),
          onCell: ({ parlay_match_void_id }) => {
            if (parlay_match_void_id && parlay_match_void_id !== '0')
              return { className: 'bg-void-ticket' }
            return {}
          },
        },
        {
          title: 'Bet Slip',
          align: 'right',
          width: 400,
          render: record => <BetSlip {...record} />,
          onCell: ({ parlay_match_void_id }) => {
            if (parlay_match_void_id && parlay_match_void_id !== '0')
              return { className: 'bg-void-ticket' }
            return {}
          },
        },
        {
          title: 'Odds',
          width: 60,
          align: 'center',
          render: record => (
            <Space direction="vertical" size={0}>
              <Text className="text-danger">{record.game_type !== 4000 && record.odds}</Text>
              <Text>{getOddsTypeDescByOddsType(record.odds_type)}</Text>
            </Space>
          ),
        },
        {
          title: 'Currency',
          dataIndex: 'currency',
          width: 60,
          align: 'center',
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Stake (F)',
          width: 75,
          align: 'right',
          render: record => {
            return (
              <Space direction="vertical" size={0}>
                <Amount value={record.bet_amount} />
                {record.bet_amount !== record.bet_loss && (
                  <>
                    <Amount value={record.bet_loss} />
                    <Text className="font-italic">(Deducted)</Text>
                  </>
                )}
                {record.game_type === -1 && record.tickets !== 1 && (
                  <Text className="font-weight-bold">
                    @<Amount value={record.bet_amount / record.tickets} />
                  </Text>
                )}
              </Space>
            )
          },
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Stake (L)',
          dataIndex: 'bet_amount_rmb',
          ...getSortObject('TicketBetAmountRMB'),
          width: 75,
          align: 'right',
          render: text => <Amount value={text} />,
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Result (F)',
          width: 75,
          align: 'right',
          render: ({ void_id, winloss_status, winloss_amount }) => {
            if ((void_id && void_id !== '0') || winloss_status === '') return '-'
            return <Amount value={winloss_amount} />
          },
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Result (L)',
          width: 75,
          align: 'right',
          render: ({ void_id, winloss_status, winloss_amount_rmb }) => {
            if ((void_id && void_id !== '0') || winloss_status === '') return '-'
            return <Amount value={winloss_amount_rmb} />
          },
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Status',
          width: 75,
          align: 'center',
          render: record => (
            <>
              {getWinlossStatus(record)}
              <br />
              <BetWinlossResult record={{ ...record, hist }} />
            </>
          ),
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          align: 'center',
          width: 60,
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
        {
          title: 'Action',
          fixed: 'right',
          align: 'center',
          width: 60,
          render: record => {
            let visibleCheckbox = false

            // selama tidak reject, checkbox bisa muncul
            if (record.status_ticket !== 2) {
              if (
                // jika sudah di process, hanya bisa void jika user punya akses void settled ticket
                (record.is_processed_bet === 'Y' && AllowedToVoidSettledTickets) ||
                // jika belum di process, hanya bisa void jika user punya akses void outstanding ticket
                (record.is_processed_bet === 'N' && AllowedToVoidOutstandingTickets)
              )
                visibleCheckbox = true
            }
            // Virtual Sport, Match Parlay, hanya status yg bukan cancel
            if ([77, 3000].includes(record.game_type))
              visibleCheckbox = record.winloss_status !== 'C'

            return (
              visibleCheckbox && (
                <Form.Item name={[record.bet_id, 'isSubmit']} valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              )
            )
          },
          onCell: record => ({
            rowSpan: getRowSpan(record),
          }),
        },
      ],
      [
        AllowedToVoidOutstandingTickets,
        AllowedToVoidSettledTickets,
        getRowNumber,
        getRowSpan,
        getSortObject,
        hist,
      ],
    )

    const downloadHandler = () => {
      const values = form.getFieldsValue()
      if (!values.match_id && !values.username) {
        message.warning('Match ID or Username must be filled!')
        return
      }

      LoadExport({
        ...values,
        sport_ids: values.sport_ids.toString(),
        game_types: values.game_types.toString(),
        from_bet_date: values.date_range[0].format('YYYY-MM-DD HH:mm'),
        to_bet_date: values.date_range[1].format('YYYY-MM-DD HH:mm'),
        switch_to_match_date: values.switch_to_match_date ? 'Y' : 'N',
        order_by: orderBy,
        hist_or_post: hist ? '_Hist' : '_Post',
      })
    }

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Tooltip placement="top" title="Refresh list" className="ml-2">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  date_range: [fromDate, toDate],
                  game_types: [-99],
                  bet_status: '',
                  branch_id: '',
                  sport_ids: [''],
                  product: '',
                  buyback: 'Include',
                  txn_type: '',
                  vip_filter: 0,
                  currency: '',
                }}
                onFinish={values => {
                  Load({
                    ...values,
                    ...pagination,
                    sport_ids: values.sport_ids.toString(),
                    game_types: values.game_types.toString(),
                    from_bet_date: values.date_range[0].format('YYYY-MM-DD HH:mm'),
                    to_bet_date: values.date_range[1].format('YYYY-MM-DD HH:mm'),
                    switch_to_match_date: values.switch_to_match_date ? 'Y' : 'N',
                    order_by: orderBy,
                    hist_or_post: hist ? '_Hist' : '_Post',
                  })
                }}
              >
                <BetEnquiryFormItems minDate={minDate} maxDate={maxDate} />
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => setPagination(prev => ({ ...prev, current_page: 1 }))}
                >
                  Submit
                </Button>
                <Button
                  type="primary"
                  className="ml-2"
                  loading={loadingDownload}
                  onClick={downloadHandler}
                >
                  Export
                </Button>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Form
              form={formTable}
              id={`form-table${hist}`}
              initialValues={{ desc: { void_id: 5 } }}
              onFinish={values => {
                const betIDs = Object.entries(values)
                  .filter(([key, val]) => key !== 'desc' && val.isSubmit)
                  .reduce((acc, [key, val]) => {
                    if (val.isSubmit) {
                      acc.push(Number(key))
                    }
                    return acc
                  }, [])

                const betIDsValue = tableData
                  .filter(e => betIDs.includes(e.bet_id))
                  .reduce((acc, curr) => {
                    const { bet_id, game_type, match_id } = curr
                    if (acc === '') {
                      acc = `${bet_id}^${game_type}^${match_id !== null ? match_id : 0}~`
                    } else {
                      acc = `${acc}${bet_id}^${game_type}^${match_id !== null ? match_id : 0}~`
                    }
                    return acc
                  }, '')

                let voidDesc
                if (visibleUpdateModal.type === 'Cancel') {
                  voidDesc =
                    values.desc.void_id === 99
                      ? values.desc.void_desc
                      : reasonOptions.find(data => data.value === values.desc.void_id).label
                } else {
                  voidDesc = values.desc.void_desc
                }

                Update(
                  {
                    ...values.desc,
                    void_desc: voidDesc,
                    bet_ids: betIDsValue,
                    void_type: form.getFieldValue('void_type'),
                    cancel_type: visibleUpdateModal.type,
                  },
                  reload,
                )
              }}
            >
              <Table
                id="table-bet-detail"
                bordered
                size="small"
                rowKey={x => `${x.bet_id}-${x.pending_bet_id}-${x.match_id}`}
                loading={loadingData}
                dataSource={tableData}
                columns={columns}
                rowClassName={record => {
                  if (record.void_id && record.void_id !== '0') return 'bg-void-ticket'
                  return getRowNumber(record) % 2 !== 0 ? 'tr-odd' : 'tr-even'
                }}
                pagination={false}
                onChange={(p, f, sorter) => {
                  setOrderBy(sorter.columnKey)
                  reload()
                }}
                components={{
                  body: {
                    cell: CustomizeCell,
                  },
                }}
                scroll={{ x: 'max-content', y: true }}
                footer={() => (
                  // seperate pagination because rowspan+pagination not working
                  <Pagination
                    className="justify-content-end"
                    current={pagination.current_page}
                    pageSize={pagination.page_size}
                    showSizeChanger
                    total={totalResults}
                    showTotal={total => `Total ${total} items`}
                    onChange={(current_page, page_size) => {
                      setPagination(prev => ({ ...prev, current_page, page_size }))
                      reload()
                    }}
                    pageSizeOptions={pageSizeOptions}
                  />
                )}
                title={() => {
                  if (AllowedToVoidOutstandingTickets || AllowedToVoidSettledTickets) {
                    return (
                      <Form.Item
                        shouldUpdate={(prevValues, currentValues) =>
                          !isEqual(prevValues, currentValues)
                        }
                      >
                        {({ getFieldsValue }) => {
                          const anyChecked = Object.values(getFieldsValue()).some(
                            val => val.isSubmit,
                          )
                          return (
                            <div align="right">
                              <Button
                                type="primary"
                                onClick={() => {
                                  formTable.setFieldsValue({ desc: { void_id: 5, void_desc: '' } })
                                  setVisibleUpdateModal({ visible: true, type: 'Cancel' })
                                }}
                                disabled={!anyChecked}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="primary"
                                className="ml-2"
                                onClick={() => {
                                  setVisibleUpdateModal({ visible: true, type: 'Uncancel' })
                                  formTable.setFieldsValue({ desc: { void_id: 5, void_desc: '' } })
                                }}
                                disabled={!anyChecked}
                              >
                                Uncancel
                              </Button>
                            </div>
                          )
                        }}
                      </Form.Item>
                    )
                  }
                  return null
                }}
              />
              <Modal
                open={visibleUpdateModal.visible}
                title={<strong>{visibleUpdateModal.type}</strong>}
                onCancel={() => setVisibleUpdateModal({ visible: false, type: '' })}
                destroyOnClose
                footer={
                  <Space>
                    <Button onClick={() => setVisibleUpdateModal({ visible: false, type: '' })}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={() =>
                        setVisibleUpdateModal({ visible: false, type: visibleUpdateModal.type })
                      }
                      htmlType="submit"
                      form={`form-table${hist}`}
                    >
                      Submit
                    </Button>
                  </Space>
                }
              >
                {visibleUpdateModal.type === 'Cancel' ? (
                  <>
                    Please select the reason for canceling bet!
                    <br />
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <Form.Item name={['desc', 'void_id']}>
                          <Select options={reasonOptions} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          shouldUpdate={(prevValues, currentValues) => {
                            return !isEqual(prevValues.desc.void_id, currentValues.desc.void_id)
                          }}
                        >
                          {({ getFieldValue }) => {
                            const ifOther = getFieldValue(['desc', 'void_id']) === 99
                            return (
                              <Form.Item name={['desc', 'void_desc']} label="if Other">
                                <Input disabled={!ifOther} />
                              </Form.Item>
                            )
                          }}
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Form.Item name={['desc', 'void_desc']} label="Reason">
                    <Input />
                  </Form.Item>
                )}
              </Modal>
            </Form>
          </div>
        </div>
      </>
    )
  },
)
const pageSizeOptions = [10, 20, 50, 100, 200]

export const BetEnquiryFormItems = ({ fromExportPage, minDate, maxDate }) => {
  const {
    branchOptions,
    sportOptions,
    gameTypeOptions,
    productOptions,
    platformOptions,
    vipOptions,
    currencyOptions,
  } = useReportOptions('betenquiry')

  const newGameTypeOptions = gameTypeOptions.slice(1)
  const newSportOptions = sportOptions.slice(1)

  return (
    <Row gutter={[8, 8]}>
      <Col xs={24} sm={12} md={6} lg={6} xl={6}>
        <Form.Item name="switch_to_match_date" valuePropName="checked">
          <Switch checkedChildren="Use Match Date" unCheckedChildren="Use Bet Date" />
        </Form.Item>
        <Form.Item
          name="date_range"
          className="mb-0"
          extra={
            fromExportPage ? null : (
              <Typography.Text type="danger">
                {`Valid from ${minDate.format('YYYY-MM-DD')} - ${maxDate.format('YYYY-MM-DD')}`}
              </Typography.Text>
            )
          }
        >
          <RangePicker
            className="w-100"
            allowClear={false}
            format="YYYY-MM-DD HH:mm"
            showTime={{ format: 'HH:mm' }}
            disabledDate={fromExportPage ? null : current => current < minDate || current > maxDate}
            presets={!fromExportPage && getPresetsMinMaxDate(minDate, maxDate)}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item
            name="from_bet_id"
            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
          >
            <Input placeholder="From Bet ID" />
          </Form.Item>
          <span
            style={{
              display: 'inline-block',
              width: 24,
              textAlign: 'center',
            }}
          >
            -
          </span>
          <Form.Item
            name="to_bet_id"
            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
          >
            <Input placeholder="To Bet ID" />
          </Form.Item>
        </Form.Item>
        <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
          <Input placeholder="Match ID" />
        </Form.Item>
        <Form.Item name="username">
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="void_user"
          extra={
            <Text className="font-italic text-danger">*User who stamp a Bet Cancellation</Text>
          }
        >
          <Input placeholder="Stamp User" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={6} lg={6} xl={6}>
        <Form.Item name="game_types">
          <SelectMultipleAll
            showSearch
            optionFilterProp="label"
            options={newGameTypeOptions}
            isOptionAllSelectable
            optionAll={{ value: -99, label: 'Show All Game Type' }}
          />
        </Form.Item>
        <Form.Item
          name="bet_status"
          extra={
            <span className="font-italic text-danger">
              *Settled means that ticket has been paid out regardless of the match
            </span>
          }
        >
          <Select showSearch optionFilterProp="label" options={betStatusOptions} />
        </Form.Item>
        <Form.Item name="branch_id">
          <Select showSearch optionFilterProp="label" options={branchOptions} />
        </Form.Item>
        <Form.Item>
          <Form.Item
            name="bet_amt_from"
            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
          >
            <Input placeholder="From Stake (L)" />
          </Form.Item>
          <span
            style={{
              display: 'inline-block',
              width: 24,
              textAlign: 'center',
            }}
          >
            -
          </span>
          <Form.Item
            name="bet_amt_to"
            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
          >
            <Input placeholder="To Stake (L)" />
          </Form.Item>
        </Form.Item>
        <Form.Item name="sport_ids">
          <SelectMultipleAll
            showSearch
            optionFilterProp="label"
            options={newSportOptions}
            isOptionAllSelectable
            allowClear={false}
            optionAll={{ value: '', label: 'Show All Sport' }}
          />
        </Form.Item>
        <Form.Item name="product">
          <Select showSearch optionFilterProp="label" options={productOptions} />
        </Form.Item>
      </Col>
      <Form.Item
        shouldUpdate={(prevValues, currentValues) =>
          !isEqual(prevValues.game_type, currentValues.game_type)
        }
        noStyle
      >
        {({ getFieldValue }) => {
          const game_types = getFieldValue('game_types')
          const showLotteryForm = game_types.every(e => e === 4000) && game_types.length !== 0
          return (
            <>
              {showLotteryForm && (
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Form.Item name="jackpot_id">
                    <Input placeholder="Jackpot ID" />
                  </Form.Item>
                  <Form.Item name="lottery_id">
                    <Input placeholder="Lottery ID" />
                  </Form.Item>
                  <Form.Item>
                    <Form.Item
                      name="from_bet_id_lottery"
                      style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                    >
                      <Input placeholder="From Bet ID Lottery" />
                    </Form.Item>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 24,
                        textAlign: 'center',
                      }}
                    >
                      -
                    </span>
                    <Form.Item
                      name="to_bet_id_lottery"
                      style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                    >
                      <Input placeholder="To Bet ID Lottery" />
                    </Form.Item>
                  </Form.Item>
                </Col>
              )}
              <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                <Form.Item name="buyback">
                  <Select showSearch optionFilterProp="label" options={buybackOptions} />
                </Form.Item>
                <Form.Item name="txn_type">
                  <Select showSearch optionFilterProp="label" options={platformOptions} />
                </Form.Item>
                <Form.Item name="vip_filter">
                  <Select showSearch optionFilterProp="label" options={vipOptions} />
                </Form.Item>
                <Form.Item name="currency">
                  <Select showSearch optionFilterProp="label" options={currencyOptions} />
                </Form.Item>
              </Col>
            </>
          )
        }}
      </Form.Item>
    </Row>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BetEnquiry)
