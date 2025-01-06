import React from 'react'
import { connect } from 'react-redux'
import wrapperPopup from 'components/blaise/custom/wrapperPopup'
import { Button, Card, Form, Input, Modal, Space, Tooltip } from 'antd'
import { MO5Wrapper } from 'pages/trading/mo-fly'
import actions from 'redux/accept-reject/actions'
import DivOptions from './components/div-options'
import ForecastSingle from '../forecast-components/forecast-single'
import { InstantBetWrapper } from '../instant-bet-fly'
import { MOOSWrapper } from '../mo-os-fly'

const mapDispatchToProps = dispatch => ({
  UpdateTicketMO: payload => {
    dispatch({
      type: actions.UPDATE_TICKET_MO_BY_MATCH,
      payload,
    })
  },
})

const MOQuickWrapper = ({ popup_id, UpdateTicketMO }) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    match_time_slot: 'Live',
    isLeagueOS: 'N',
    match_id: -1, // will be set after load match selection
  })

  const [form] = Form.useForm()
  const onAccept = () => updateTicket(0)
  const onVoid = (void_id, void_description) => updateTicket(void_id, void_description)
  const updateTicket = (void_id, void_description) => {
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
      UpdateTicketMO(
        {
          match_id: viewParameter.match_id,
          void_id,
          void_description,
          action: void_id === 0 ? 'Accept' : 'Reject',
        },
        form.resetFields,
      )
    }
  }

  return (
    <div>
      <Card style={{ height: '30vh', overflow: 'auto' }}>
        <DivOptions viewParameter={viewParameter} setViewParameter={setViewParameter} />
        {viewParameter.isLeagueOS === 'Y' ? (
          <MOOSWrapper
            page="MOQuick"
            style={{ height: 'calc(30vh - 56px)' }}
            viewParameterMOQuick={viewParameter}
          />
        ) : (
          <MO5Wrapper
            page="MOQuick"
            style={{ height: 'calc(30vh - 56px)' }}
            viewParameterMOQuick={viewParameter}
          />
        )}
      </Card>
      <Card style={{ height: '30vh', overflow: 'auto' }}>
        <ForecastSingle
          page="MOQuick"
          style={{ height: 'calc(30vh - 36px)' }}
          viewParameterMOQuick={viewParameter}
        />
      </Card>
      <Card style={{ height: '40vh', overflow: 'auto' }}>
        <div style={{ background: '#efefef' }}>
          <Space>
            <Tooltip title="Accept">
              <Button type="primary" className="bg-success" onClick={onAccept}>
                Accept
              </Button>
            </Tooltip>
            <Tooltip title="Goal">
              <Button type="primary" className="bg-danger" onClick={() => onVoid(91)}>
                RG
              </Button>
            </Tooltip>
            <Tooltip title="Penalty">
              <Button type="primary" className="bg-danger" onClick={() => onVoid(92)}>
                RP
              </Button>
            </Tooltip>
            <Tooltip title="Red Card">
              <Button type="primary" className="bg-danger" onClick={() => onVoid(90)}>
                RC
              </Button>
            </Tooltip>
            <Form form={form} onFinish={values => onVoid(99, values.void_description)}>
              <Space.Compact>
                <Form.Item name="void_description">
                  <Input />
                </Form.Item>
                <Tooltip title="Other Reason">
                  <Button type="primary" className="bg-danger" onClick={() => onVoid(99)}>
                    RJ
                  </Button>
                </Tooltip>
              </Space.Compact>
            </Form>
            <Tooltip title="Corner">
              <Button type="primary" className="bg-orange" onClick={() => onVoid(93)}>
                CR
              </Button>
            </Tooltip>
          </Space>
        </div>
        <InstantBetWrapper
          page="MOQuick"
          style={{ height: 'calc(40vh - 58px)' }}
          viewParameterMOQuick={viewParameter}
        />
      </Card>
    </div>
  )
}

export default connect(null, mapDispatchToProps)(wrapperPopup(MOQuickWrapper))
