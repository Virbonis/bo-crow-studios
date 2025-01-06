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
  Typography,
  Switch,
} from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/void-ticket/actions'
import {
  getGameTypeDescriptionShort,
  getGameTypeOptions,
  getWinlossStatus,
  getWinlossStatusName,
  reasonOptions,
  validatorNumeric,
} from 'helper'
import {
  useGetDateTimeDBServer,
  VIPUsername,
  Amount,
  HDPColumn,
  getBetScore,
} from 'components/blaise'
import './custom.scss'
import { ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { isEqual } from 'lodash'
import authorize from 'authorize'

const { Text } = Typography

const mapStateToProps = ({ voidTicket, auth }) => ({
  loadingDownload: voidTicket.loadingDownload,
  loadingData: voidTicket.loadingData,
  tableData: voidTicket.data.result?.map((data, index) => {
    return { ...data, key: index + 1 }
  }),
  totalResults: voidTicket.data.total,
  AllowedToVoidSettledTickets: auth.user.user_auth_ids.includes(
    authorize.ALLOWED_TO_VOID_SETTLED_TICKETS,
  ),
  AllowedToVoidOutstandingTickets: auth.user.user_auth_ids.includes(
    authorize.ALLOWED_TO_VOID_OUTSTANDING_TICKETS,
  ),
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Void Ticket',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Void Ticket',
    })
  },
})

const { RangePicker } = DatePicker

const betStatusOptions = [
  { value: '', label: 'Show All Bet Status' },
  { value: 'Outstanding', label: 'Outstanding' },
  { value: 'Settled', label: 'Settled' },
  { value: 'Void', label: 'Void' },
  { value: 'Reject', label: 'Reject' },
]

const betAmtOptions = [
  { value: 0, label: 'Show All Stake (L)' },
  { value: 1, label: 'Below 500' },
  { value: 2, label: '500 - 1K' },
  { value: 3, label: '1K - 3K' },
  { value: 4, label: '3K - 5K' },
  { value: 5, label: '5K - 10K' },
  { value: 6, label: '10K Up' },
]

const voidTypeOptions = [
  { value: 'Void', label: 'Void Ticket' },
  { value: 'Suspend', label: 'Count as 1' },
]

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()

  if (!defaultDateTimeServer) return null

  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const VoidTicket = wrapperDate(
  ({
    defaultDateTimeServer,
    tableData,
    loadingData,
    totalResults,
    Load,
    Update,
    AllowedToVoidSettledTickets,
    AllowedToVoidOutstandingTickets,
  }) => {
    const [form] = Form.useForm()
    const [formTable] = Form.useForm()
    const [visibleModal, setVisibleModal] = useState({ visible: false, type: '' })

    let { sportOptions, branchOptions } = useSelectOptions()
    sportOptions = [{ value: 0, label: 'Show All Sport' }].concat(sportOptions)
    branchOptions = [{ value: '', label: 'Show All Branch' }].concat(branchOptions)

    const [pagination, setPagination] = useState({
      current_page: 1,
      page_size: 50,
    })
    const [orderBy, setOrderBy] = useState('')

    const reload = React.useCallback(() => {
      form.submit()
      formTable.resetFields()
    }, [form, formTable])

    const getSortObject = key => {
      return {
        key,
        sorter: true,
        sortDirections: ['descend', 'descend'],
        sortOrder: orderBy === key ? 'descend' : null,
      }
    }

    const columns = [
      {
        title: 'No',
        align: 'center',
        width: 30,
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Username',
        width: 100,
        render: record => <VIPUsername {...record} />,
      },
      {
        title: 'Bet ID',
        align: 'center',
        width: 90,
        render: record => (
          <>
            {record.bet_id !== 0 && record.bet_id} <br />
            {record.bet_live_status === 'Y' && (
              <Text className="text-success">{`(P${record.pending_bet_id})`}</Text>
            )}
          </>
        ),
      },
      {
        title: 'Bet Date',
        align: 'center',
        ...getSortObject(''),
        width: 150,
        render: record => (
          <>
            {record.bet_date} <br />
            {record.bet_live_status === 'Y' && (
              <Text className="text-success">{`(${record.accept_pending_date})`}</Text>
            )}
          </>
        ),
      },
      {
        title: 'Match ID',
        align: 'center',
        width: 60,
        render: ({ match_id, game_type, parlay_match_winloss_status, jwl }) => {
          return (
            <>
              {match_id} <br />
              {game_type === -1 &&
                getWinlossStatusName(parlay_match_winloss_status, jwl, game_type, 'parlay')}
            </>
          )
        },
      },
      {
        title: 'League Name',
        dataIndex: 'league_name',
        width: 180,
      },
      {
        title: 'Home',
        dataIndex: 'home_name',
        width: 150,
      },
      {
        title: 'Away',
        dataIndex: 'away_name',
        width: 150,
      },
      {
        title: 'Type',
        align: 'center',
        width: 80,
        render: record => (
          <Space direction="vertical" size={0}>
            {getGameTypeDescriptionShort(record.game_type)}
            {form.getFieldValue('void_type') === 'Suspend' &&
              record.game_type === -1 &&
              getGameTypeDescriptionShort(record.parlay_game_type)}
            {record.bet_live_status === 'Y' && <span className="text-red">Live</span>}
          </Space>
        ),
      },
      {
        title: 'Score',
        align: 'center',
        width: 60,
        render: record => getBetScore(record),
      },
      {
        title: 'HDP',
        align: 'center',
        width: 60,
        render: record => <HDPColumn {...record} />,
      },
      {
        title: 'Odds',
        dataIndex: 'odds',
        width: 60,
        align: 'center',
        render: text => text !== 0 && <Amount value={text} />,
      },
      {
        title: 'Curr',
        dataIndex: 'currency',
        width: 60,
        align: 'center',
      },
      {
        title: 'Stake (L)',
        dataIndex: 'bet_amount_rmb',
        ...getSortObject('TicketBetAmountRMB'),
        width: 60,
        align: 'right',
        render: text => <Amount value={text} />,
      },
      {
        title: 'Result (L)',
        width: 60,
        align: 'right',
        render: record => {
          if (record.void_id !== 0 || record.winloss_status === '') return '-'
          return <Amount value={record.winloss_amount_rmb} />
        },
      },
      {
        title: 'Status',
        width: 120,
        align: 'center',
        render: record => {
          const { parlay_match_void_id, parlay_match_void_desc, parlay_match_void_user } = record
          if (parlay_match_void_id && parlay_match_void_id !== '0')
            return (
              <>
                <div className="text-danger">{parlay_match_void_desc}</div>
                by {parlay_match_void_user}
              </>
            )
          return getWinlossStatus(record)
        },
      },
      {
        title: 'Action',
        align: 'center',
        width: 60,
        render: record => {
          if (record.status_ticket !== 2 || (record.void_id <= 20 && record.void_id >= 80)) {
            if (record.is_processed_bet === 'Y' && AllowedToVoidSettledTickets) {
              return (
                <Form.Item name={[record.bet_id, 'isSubmit']} valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              )
            }
            if (record.is_processed_bet === 'N' && AllowedToVoidOutstandingTickets) {
              return (
                <Form.Item name={[record.bet_id, 'isSubmit']} valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              )
            }
          }
          return null
        },
      },
    ]

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
                  date_range: [
                    defaultDateTimeServer.clone().add(-12, 'hours'),
                    defaultDateTimeServer,
                  ],
                  game_type: -99,
                  bet_status: '',
                  branch_id: '',
                  sport_id: 0,
                  bet_amt: 0,
                  void_type: 'Void',
                }}
                onFinish={values =>
                  Load({
                    ...values,
                    ...pagination,
                    from_bet_date: values.date_range[0].format('YYYY-MM-DD HH:mm'),
                    to_bet_date: values.date_range[1].format('YYYY-MM-DD HH:mm'),
                    switch_to_match_date: values.switch_to_match_date ? 'Y' : 'N',
                    match_id: values.match_id ? values.match_id : 0,
                    order_by: orderBy,
                  })
                }
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="switch_to_match_date" valuePropName="checked">
                      <Switch checkedChildren="Use Match Date" unCheckedChildren="Use Bet Date" />
                    </Form.Item>
                    <Form.Item name="date_range" className="mb-0">
                      <RangePicker
                        className="w-100"
                        allowClear={false}
                        format="YYYY-MM-DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
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
                      <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
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
                      name="stamp_user"
                      extra={
                        <Text className="font-italic text-danger">
                          *User who stamp a Bet Cancellation
                        </Text>
                      }
                    >
                      <Input placeholder="Stamp User" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="game_type">
                      <Select
                        options={[{ value: -99, label: 'Show All Game Type' }].concat(
                          getGameTypeOptions('VoidTicket'),
                        )}
                        showSearch
                        optionFilterProp="label"
                      />
                    </Form.Item>
                    <Form.Item name="bet_status">
                      <Select options={betStatusOptions} />
                    </Form.Item>
                    <Form.Item name="branch_id">
                      <Select options={branchOptions} showSearch optionFilterProp="label" />
                    </Form.Item>
                    <Form.Item name="sport_id">
                      <Select options={sportOptions} showSearch optionFilterProp="label" />
                    </Form.Item>
                    <Form.Item name="bet_amt">
                      <Select options={betAmtOptions} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="void_type">
                      <Select options={voidTypeOptions} />
                    </Form.Item>
                  </Col>
                </Row>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => setPagination({ ...pagination, current_page: 1 })}
                >
                  Submit
                </Button>
                <Text className="text-danger ml-2">
                  *To void Parlay <strong>Count as 1</strong> kindly input Match ID, GameType = Mix
                  Parlay and Void Type = Count as 1
                </Text>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Form
              form={formTable}
              id="form-table"
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
                    acc.push(`${bet_id}^${game_type}^${match_id !== null ? match_id : 0}`)
                    return acc
                  }, [])

                let voidDesc
                if (visibleModal.type === 'Cancel') {
                  voidDesc =
                    values.desc.void_id === 99
                      ? values.desc.voidDesc
                      : reasonOptions.find(data => data.value === values.desc.void_id).label
                } else {
                  voidDesc = values.desc.void_desc
                }
                Update(
                  {
                    ...values.desc,
                    void_desc: voidDesc,
                    bet_ids: betIDsValue.join('~'),
                    void_type: form.getFieldValue('void_type'),
                    cancel_type: visibleModal.type,
                  },
                  reload,
                )
              }}
            >
              <Table
                bordered
                id="table-bet-detail"
                size="small"
                rowKey="key"
                loading={loadingData}
                dataSource={tableData}
                columns={columns}
                rowClassName={record => {
                  if (record.parlay_match_void_id !== '0' && record.parlay_match_void_id) {
                    return 'bg-ca1'
                  }
                  if (record.void_id !== 0 && record.void_id) {
                    return 'bg-void-ticket'
                  }
                  return ''
                }}
                onChange={(p, f, sorter) => {
                  setOrderBy(sorter.columnKey)
                  reload()
                }}
                pagination={{
                  showSizeChanger: true,
                  showTotal: total => `Total ${total} items`,
                  total: totalResults,
                  pageSize: pagination.page_size,
                  current: pagination.current_page,
                  onChange: (current_page, page_size) => {
                    setPagination({ current_page, page_size })
                    reload()
                  },
                }}
                title={() => {
                  if (AllowedToVoidOutstandingTickets && AllowedToVoidSettledTickets) {
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
                                onClick={() => setVisibleModal({ visible: true, type: 'Cancel' })}
                                disabled={!anyChecked}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="primary"
                                className="ml-2"
                                onClick={() => setVisibleModal({ visible: true, type: 'Uncancel' })}
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
                open={visibleModal.visible}
                title={<strong>{visibleModal.type}</strong>}
                onCancel={() => setVisibleModal({ visible: false, type: '' })}
                destroyOnClose
                footer={
                  <Space>
                    <Button onClick={() => setVisibleModal({ visible: false, type: '' })}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => setVisibleModal({ visible: false, type: visibleModal.type })}
                      htmlType="submit"
                      form="form-table"
                    >
                      Submit
                    </Button>
                  </Space>
                }
              >
                {visibleModal.type === 'Cancel' ? (
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
          <div className="card-footer">
            <b>
              Notes:
              <br />
              <span className="box bg-void-ticket" /> Void Ticket
              <br />
              <span className="box bg-ca1" /> Count as 1
              <br />
            </b>
          </div>
        </div>
      </>
    )
  },
)
export default connect(mapStateToProps, mapDispatchToProps)(VoidTicket)
