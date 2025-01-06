import React from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Form, Input, message, Modal, Row, Space, Tooltip } from 'antd'
import actions from 'redux/accept-reject/actions'

const mapDispatchToProps = dispatch => ({
  UpdateTicketByMatch: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_TICKET_MO_BY_MATCH,
      payload,
      successCallback,
    })
  },
  UpdateTicket: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_TICKET_MO,
      payload,
      successCallback,
    })
  },
})

const FormAcceptReject = React.memo(
  React.forwardRef(
    ({ UpdateTicketByMatch, UpdateTicket, match_id, data = [], tableRef, refetch }, ref) => {
      const [form] = Form.useForm()
      const onAccept = () => updateTicket(0)
      const onVoid = (void_id, void_description) => updateTicket(void_id, void_description)
      const updateTicket = (void_id, void_description) => {
        const { selectedRows, setSelectedRows } = tableRef.current
        if (!isByMatch && selectedRows.length === 0) {
          message.warning('Please select at least one ticket')
          return
        }

        const successCallback = () => {
          setSelectedRows([])
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
        // doUpdate()

        function doUpdate() {
          if (isByMatch && data.length !== 0) {
            UpdateTicketByMatch(
              {
                match_id,
                void_id,
                void_description,
                action: void_id === 0 ? 'Accept' : 'Reject',
              },
              successCallback,
            )
          } else if (!isByMatch) {
            UpdateTicket(
              {
                bet_ids: data
                  .filter(item => selectedRows.includes(item.bet_id))
                  .map(item => `${item.bet_id}^${item.game_type}^${item.match_id}`)
                  .join('~'),
                void_id,
                void_description,
                action: void_id === 0 ? 'Accept' : 'Reject',
              },
              successCallback,
            )
          }
        }
      }

      const [isByMatch, setIsByMatch] = React.useState(true)
      const onChangeByMatch = e => {
        setIsByMatch(e.target.checked)
        // tableRef.current.setIsByMatch(e.target.checked)
      }
      const [isAuto, setIsAuto] = React.useState(false)
      const onChangeAuto = e => {
        if (e?.target.checked) onChangeByMatch(e)
        setIsAuto(e.target.checked)
      }

      React.useImperativeHandle(ref, () => ({
        // acceptAllTickets
        checkAuto() {
          if (isAuto) updateTicket(0)
        },
      }))

      const isDisabled = data.length === 0

      return (
        <>
          <Tooltip title="accept/reject entire ticket by Match ID" placement="topLeft">
            <Checkbox checked={isByMatch} onChange={onChangeByMatch} />
            &nbsp; Ac/Rj by Match
          </Tooltip>
          <br />
          <Row justify="space-between">
            <Space style={{ backgroundColor: '#b3f2c8' }}>
              <Tooltip
                title="auto accepting entire ticket when refreshing data"
                placement="topLeft"
              >
                <Checkbox onChange={onChangeAuto} />
                &nbsp; Auto Accept
              </Tooltip>
              <Tooltip title="Accept">
                <Button
                  type="primary"
                  className="bg-success"
                  onClick={onAccept}
                  disabled={isDisabled}
                  size="large"
                >
                  Manual Accept
                </Button>
              </Tooltip>
            </Space>
            <Space>
              <Tooltip title="Goal">
                <Button
                  type="primary"
                  className="bg-danger"
                  onClick={() => onVoid(91)}
                  disabled={isDisabled}
                >
                  RG
                </Button>
              </Tooltip>
              <Tooltip title="Penalty">
                <Button
                  type="primary"
                  className="bg-danger"
                  onClick={() => onVoid(92)}
                  disabled={isDisabled}
                >
                  RP
                </Button>
              </Tooltip>
              <Tooltip title="Red Card">
                <Button
                  type="primary"
                  className="bg-danger"
                  onClick={() => onVoid(90)}
                  disabled={isDisabled}
                >
                  RC
                </Button>
              </Tooltip>
              <Form form={form} onFinish={values => onVoid(99, values.void_description)}>
                <Space.Compact>
                  <Form.Item
                    name="void_description"
                    rules={[
                      { required: true, message: 'Please input reason' },
                      {
                        validator(_, value) {
                          if (/['";]+/.test(value))
                            return Promise.reject(new Error('Invalid input'))
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <Input placeholder="reason" disabled={isDisabled} />
                  </Form.Item>
                  <Tooltip title="Other Reason">
                    <Button
                      type="primary"
                      className="bg-danger"
                      htmlType="submit"
                      disabled={isDisabled}
                    >
                      RJ
                    </Button>
                  </Tooltip>
                </Space.Compact>
              </Form>
              <Tooltip title="Corner">
                <Button
                  type="primary"
                  className="bg-orange"
                  onClick={() => onVoid(93)}
                  disabled={isDisabled}
                >
                  CR
                </Button>
              </Tooltip>
            </Space>
          </Row>
        </>
      )
    },
  ),
)

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(FormAcceptReject)
