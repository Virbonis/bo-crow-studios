import React from 'react'
import { Button, Col, Form, Input, message, Modal, Popover, Row, Select, Space } from 'antd'
import { connect } from 'react-redux'
import actionsAcRj from 'redux/accept-reject/actions'

const mapDispatchToProps = dispatch => ({
  UpdateTicket: (payload, successCallback) => {
    dispatch({
      type: actionsAcRj.UPDATE_TICKET_INSTANTBET,
      payload,
      successCallback,
    })
  },
})

const ACRJ = ({ tableRef, refetch, UpdateTicket }) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = React.useState(false)
  // copied event ↓ form accept reject
  const onAccept = () => updateTicket(0)
  const onVoid = (void_id, void_description) => updateTicket(void_id, void_description)
  const onSelectReject = (value, { label }) => onVoid(value, label)
  const onSubmitOtherReject = values => onVoid(99, values.void_description)

  const updateTicket = (void_id, void_description) => {
    const { voidTicketIDs, resetVoidTicketIDs, data } = tableRef.current
    if (voidTicketIDs.length === 0) {
      message.warning('Please select at least one ticket')
      return
    }

    const successCallback = () => {
      setVisible(false)
      resetVoidTicketIDs()
      refetch()
    }

    if (void_id !== 0) {
      Modal.confirm({
        title: 'Are you sure to reject ticket?',
        content: '',
        okText: 'Yes',
        cancelText: 'No',
        onOk: doUpdate,
      })
    } else doUpdate()

    function doUpdate() {
      UpdateTicket(
        {
          // format bet_ids beda sama accept reject mo
          bet_ids: data
            .filter(x => voidTicketIDs.includes(x.id))
            .map(
              x =>
                `${x.bet_id}x${x.match_id}^${x.bet_id}^${x.game_type}^${x.status_ticket}^${x.match_id}`,
            )
            .join('~'),
          void_id,
          void_description,
          action: void_id === 0 ? 'Accept' : 'Reject',
        },
        successCallback,
      )
    }
  }

  const content = (
    <Space direction="vertical">
      <Button
        size="small"
        type="primary"
        className="bg-success border-success w-100"
        onClick={onAccept}
      >
        Accept
      </Button>
      <Select
        placeholder="Select Rejection"
        className="w-100"
        onSelect={onSelectReject}
        options={[
          { value: 5, label: 'Abnormal Bets' },
          { value: 10, label: 'Cancelled by Other Bookmaker' },
          { value: 17, label: 'Distruption' },
          { value: 8, label: 'Duplicate Bet' },
          { value: 4, label: 'Incorrect Bet Entry' },
          { value: 15, label: 'Incorrect Favorite' },
          { value: 18, label: 'Incorrect Fixtures' },
          { value: 14, label: 'Incorrect Handicap' },
          { value: 13, label: 'Incorrect Odds' },
          { value: 16, label: 'Incorrect Over/Under' },
          { value: 12, label: 'Incorrect Score' },
          { value: 3, label: 'Incorrect Team Name' },
          { value: 19, label: 'Match Completed' },
          { value: 11, label: 'Postponed Game' },
          { value: 9, label: 'Promotional Bet' },
          { value: 20, label: 'Started Early' },
          { value: 6, label: 'System Error' },
          { value: 7, label: 'Test Bet' },
          { value: 90, label: 'RED CARD' },
          { value: 91, label: 'GOAL' },
          { value: 92, label: 'PENALTY' },
          { value: 93, label: 'CORNER' },
        ]}
        getPopupContainer={trigger => trigger.parentElement}
      />
      <Form form={form} onFinish={onSubmitOtherReject}>
        <Row>
          <Col flex="1">
            <Form.Item
              name="void_description"
              rules={[
                { required: true, message: 'Please input reason' },
                {
                  validator(_, value) {
                    if (/['";]+/.test(value)) return Promise.reject(new Error('Invalid input'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input placeholder="reason" />
            </Form.Item>
          </Col>
          <Button type="danger" htmlType="submit">
            RJ
          </Button>
        </Row>
      </Form>
    </Space>
  )
  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      content={content}
      overlayInnerStyle={{ width: 200 }}
      open={visible}
      onOpenChange={open => setVisible(open)}
    >
      <Button>Ac/Rj</Button>
    </Popover>
  )
}

export default connect(null, mapDispatchToProps)(ACRJ)
