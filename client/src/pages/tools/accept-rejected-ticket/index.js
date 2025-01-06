import React from 'react'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd'
import { connect } from 'react-redux'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/accept-rejected-ticket/actions'
import {
  Amount,
  BetGameTypeColumn,
  BetSlip,
  useGetDateTimeBusinessHour,
  useFormWithPagination,
} from 'components/blaise'

const { Text } = Typography
const mapStateToProps = ({ acceptRejectedTicket }) => ({
  dataTable: acceptRejectedTicket.data,
  totalRecord: acceptRejectedTicket.total,
  loading: acceptRejectedTicket.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_ACCEPT_REJECTED_TICKET,
      payload,
      source: 'Accept Rejected Ticket',
    })
  },
  AcceptTicket: (payload, successCallBack) => {
    dispatch({
      type: actions.ACCEPT_TICKET,
      payload,
      successCallBack,
      source: 'Accept Reject Ticket',
    })
  },
})

const { RangePicker } = DatePicker
const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null

  return <Component {...props} defaultDateTime={defaultDateTime} />
}
// only single type ticket showed (not parlay)
const AcceptRejectedTicket = wrapperDate(
  ({ defaultDateTime, dataTable, totalRecord, loading, LoadTable, AcceptTicket }) => {
    const [form] = Form.useForm()

    const [getRowSpan, getRowNumber] = React.useMemo(() => {
      const isFirstRow = (pending_bet_id, match_id) => {
        const index = dataTable.findIndex(
          x => x.pending_bet_id === pending_bet_id && x.match_id === match_id,
        )
        if (index === -1) return false
        if (index === 0) return true
        const prev = dataTable[index - 1]
        return prev.pending_bet_id !== pending_bet_id
      }
      const rowCount = pending_bet_id =>
        dataTable.filter(x => x.pending_bet_id === pending_bet_id).length

      const uniqData = dataTable.reduce((acc, cur) => {
        const index = acc.findIndex(x => x.pending_bet_id === cur.pending_bet_id)
        if (index === -1) acc.push(cur)
        return acc
      }, [])

      return [
        (pending_bet_id, match_id) => {
          if (!isFirstRow(pending_bet_id, match_id)) return 0
          return rowCount(pending_bet_id)
        },
        pending_bet_id => uniqData.findIndex(x => x.pending_bet_id === pending_bet_id) + 1,
      ]
    }, [dataTable])

    const column = [
      {
        title: 'No',
        align: 'center',
        width: 30,
        render: (text, record) => getRowNumber(record.pending_bet_id),
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
      {
        title: 'User Name',
        dataIndex: 'username',
        align: 'center',
        width: 90,
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
      {
        title: 'Bet ID',
        dataIndex: 'pending_bet_id',
        align: 'center',
        width: 90,
        render: text => {
          const pBetIDClassName = text === 0 ? '' : 'text-green'
          return <Text className={pBetIDClassName}>(P{text})</Text>
        },
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
      {
        title: 'Bet Date \n Reject Date',
        align: 'center',
        width: 100,
        render: ({ bet_date, reject_date, pending_bet_id }) => {
          const rejectClassName = pending_bet_id === 0 ? '' : 'text-green'
          return (
            <>
              {bet_date} <br />
              <Text className={rejectClassName}>({reject_date})</Text>
            </>
          )
        },
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
      {
        title: 'Game Type',
        align: 'center',
        width: 70,
        render: record => <BetGameTypeColumn {...record} />,
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        align: 'center',
        width: 80,
      },
      {
        title: 'Bet Slip',
        align: 'right',
        width: 200,
        render: (data, record) => <BetSlip {...record} />,
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        align: 'center',
        width: 80,
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
      {
        title: 'Stake (F)',
        dataIndex: 'bet_amount',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
      {
        title: 'Stake (L)',
        dataIndex: 'bet_amount_rmb',
        align: 'right',
        width: 70,
        render: text => <Amount value={text} />,
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
      {
        title: 'Result (F)',
        align: 'center',
        width: 70,
        render: ({ win_loss_amount, win_loss_status, void_id, void_desc, void_user }) => {
          if (void_id !== 0) {
            return (
              <>
                <div className="text-danger">{void_desc}</div>
                by {void_user}
              </>
            )
          }
          if (win_loss_status === '') return ''
          return <Amount value={win_loss_amount} />
        },
        onCell: ({ void_id, pending_bet_id, match_id }) => {
          return {
            colSpan: void_id === 0 ? 1 : 2,
            rowSpan: getRowSpan(pending_bet_id, match_id),
          }
        },
      },
      {
        title: 'Result (L)',
        dataIndex: 'win_loss_amount_rmb',
        width: 70,
        render: text => <Amount value={text} />,
        onCell: ({ void_id, pending_bet_id, match_id }) => {
          return {
            colSpan: void_id === 0 ? 1 : 0,
            rowSpan: getRowSpan(pending_bet_id, match_id),
          }
        },
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        align: 'center',
        width: 80,
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
      {
        title: 'Action',
        align: 'center',
        width: 70,
        render: record => {
          if (record.is_processed_bet === 'N')
            return <ButtonAccept record={record} AcceptTicket={AcceptTicket} reload={reload} />
          return null
        },
        onCell: ({ pending_bet_id, match_id }) => ({
          rowSpan: getRowSpan(pending_bet_id, match_id),
        }),
      },
    ]

    const fetch = React.useCallback(
      values => {
        LoadTable({
          ...values,
          from_bet_date: values.bet_date[0].format('YYYY-MM-DD'),
          to_bet_date: values.bet_date[1].format('YYYY-MM-DD'),
        })
      },
      [LoadTable],
    )
    const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalRecord)
    const reload = React.useCallback(() => form.submit(), [form])
    return (
      <>
        <div className="card">
          <div className="card-header ">
            <div className="d-flex flex-row-reverse justify-content-between">
              <Button icon={<ReloadOutlined />} onClick={() => form.submit()} />
              <Form
                className="w-100"
                form={form}
                initialValues={{
                  bet_date: [defaultDateTime, defaultDateTime],
                }}
                {...formProps}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="bet_date">
                      <RangePicker className="w-100" allowClear={false} format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Space.Compact className="w-100">
                      <Form.Item name="from_bet_id" className="w-50">
                        <Input placeholder="From Bet ID" />
                      </Form.Item>
                      <Form.Item name="to_bet_id" className="w-50">
                        <Input placeholder="To Bet ID" />
                      </Form.Item>
                    </Space.Compact>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="match_id">
                      <Input placeholder="Match ID" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Table
              rowKey="bet_id"
              dataSource={dataTable}
              columns={column}
              loading={loading}
              pagination={paginationProps}
              onRow={record => {
                return {
                  className: record.void_id !== 0 ? 'bg-light-grey' : '',
                }
              }}
            />
          </div>
        </div>
      </>
    )
  },
)

const reasonAcceptOptions = [
  { value: 1, label: 'Invalid Goal' },
  { value: 99, label: 'Other' },
]
const ButtonAccept = ({ record, AcceptTicket, reload }) => {
  const [formTable] = Form.useForm()

  const content = (
    <Form
      form={formTable}
      layout="vertical"
      initialValues={{
        reason_id: 99,
        reason: '',
      }}
      onFinish={values => {
        AcceptTicket({ ...record, ...values }, reload)
      }}
    >
      <Form.Item shouldUpdate={(prev, curr) => prev.reason_id !== curr.reason_id}>
        {({ getFieldValue }) => {
          const disabledOther = getFieldValue('reason_id') !== 99
          return (
            <>
              <Form.Item name="reason_id" label="Please select the reason for accepting bet!">
                <Select
                  options={reasonAcceptOptions}
                  onChange={() => formTable.resetFields(['reason'])}
                  getPopupContainer={trigger => trigger.parentElement}
                />
              </Form.Item>
              <Form.Item name="reason" label="if Other :">
                <Input disabled={disabledOther} />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </>
          )
        }}
      </Form.Item>
    </Form>
  )
  return (
    <Popover
      placement="left"
      content={content}
      title={`Accept Bet ID ${record.bet_id}`}
      trigger="click"
      onOpenChange={() => formTable.resetFields()}
    >
      <Button type="link" className="p-0">
        Accept
      </Button>
    </Popover>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AcceptRejectedTicket)
