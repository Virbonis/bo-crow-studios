import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Divider, Form, Row, Typography } from 'antd'
import actions from 'redux/sportsbook-setting/actions'
import { isEmpty } from 'lodash'

const { Text } = Typography
const mapStateToProps = ({ sportsbookSetting }) => ({
  data: sportsbookSetting.data,
})

const mapDispatchToProps = (dispatch, { reload }) => ({
  UpdateMaintenanceStatus: payload => {
    dispatch({
      type: actions.UPDATE_MAINTENANCE_STATUS,
      payload,
      successCallback: reload,
      source: 'Sportsbook Setting',
    })
  },
  UpdateSeamlessMaintenanceStatus: payload => {
    dispatch({
      type: actions.UPDATE_SEAMLESS_MAINTENANCE_STATUS,
      payload,
      successCallback: reload,
      source: 'Sportsbook Setting',
    })
  },
  UpdateCloseFundTransferStatus: payload => {
    dispatch({
      type: actions.UPDATE_CLOSE_FUND_TRANSFER_STATUS,
      payload,
      successCallback: reload,
      source: 'Sportsbook Setting',
    })
  },
  UpdateBetBazarStatus: payload => {
    dispatch({
      type: actions.UPDATE_BET_BAZAR_STATUS,
      payload,
      successCallback: reload,
      source: 'Sportsbook Setting',
    })
  },
  UpdateIMStatus: payload => {
    dispatch({
      type: actions.UPDATE_IM_STATUS,
      payload,
      successCallback: reload,
      source: 'Sportsbook Setting',
    })
  },
  UpdateSISStatus: payload => {
    dispatch({
      type: actions.UPDATE_SIS_STATUS,
      payload,
      successCallback: reload,
      source: 'Sportsbook Setting',
    })
  },
  UpdateBTIAutoAddMatch: payload => {
    dispatch({
      type: actions.UPDATE_BTI_AUTO_ADD_MATCH,
      payload,
      successCallback: reload,
      source: 'Sportsbook Setting',
    })
  },
})

const DisplayStatus = ({
  isAllowed,
  data,
  UpdateMaintenanceStatus,
  UpdateSeamlessMaintenanceStatus,
  UpdateCloseFundTransferStatus,
  UpdateBetBazarStatus,
  UpdateIMStatus,
  UpdateSISStatus,
  UpdateBTIAutoAddMatch,
}) => {
  if (isEmpty(data)) return null

  const is_maintenance = data.is_maintenance === 'Y'
  const is_maintenance_seamless = data.is_maintenance_seamless === 'Y'
  const close_fund_transfer = data.close_fund_transfer === 1
  const { bet_bazar_status, im_status, sis_status, bti_auto_add_match } = data

  const onUpdateMaintenance = () =>
    UpdateMaintenanceStatus({
      is_maintenance: is_maintenance ? 'N' : 'Y',
    })
  const onUpdateSeamlessMaintenance = () =>
    UpdateSeamlessMaintenanceStatus({
      is_maintenance_seamless: is_maintenance_seamless ? 'N' : 'Y',
    })
  const onUpdateCloseFundTransfer = () =>
    UpdateCloseFundTransferStatus({
      close_fund_transfer: close_fund_transfer ? 0 : 1,
    })
  const onUpdateBetBazarStatus = () => UpdateBetBazarStatus({ bet_bazar_status: !bet_bazar_status })
  const onUpdateIMStatus = () => UpdateIMStatus({ im_status: !im_status })
  const onUpdateSISStatus = () => UpdateSISStatus({ sis_status: !sis_status })
  const onUpdateBTIAutoAddMatch = () =>
    UpdateBTIAutoAddMatch({ bti_auto_add_match: !bti_auto_add_match })

  return (
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} labelWrap="true" className="w-100">
      <Form.Item label="Sportsbook Status">
        <Row>
          <Col span={3}>{is_maintenance ? maintenanceText : 'Sportsbook running well'}</Col>
          <Col>
            <Button
              type="primary"
              disabled={!isAllowed}
              className={getStatusClass(is_maintenance)}
              onClick={onUpdateMaintenance}
            >
              {is_maintenance ? 'Back to Normal' : 'Go To Maintenance!'}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={3}>{is_maintenance_seamless ? maintenanceText : 'Seamless running well'}</Col>
          <Col>
            <Button
              type="primary"
              disabled={!isAllowed}
              className={getStatusClass(is_maintenance_seamless)}
              onClick={onUpdateSeamlessMaintenance}
            >
              {is_maintenance_seamless ? 'Back to Normal' : 'Go To Maintenance!'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Divider className="my-2" />
      <Form.Item label="Fund Transfer">
        <Row>
          <Col span={3}>
            {close_fund_transfer ? (
              <Text className="text-danger font-weight-bold">FUND TRANSFER ON MAINTENANCE!</Text>
            ) : (
              'Fund Transfer running well'
            )}
          </Col>
          <Col>
            <Button
              type="primary"
              disabled={!isAllowed}
              className={getStatusClass(close_fund_transfer)}
              onClick={onUpdateCloseFundTransfer}
            >
              {close_fund_transfer ? 'Back to Normal' : 'Force to Stop!'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Divider className="my-2" />
      <Form.Item label="BetBazar Status">
        <Row>
          <Col span={3}>
            {bet_bazar_status ? (
              'is Open'
            ) : (
              <Text className="text-danger font-weight-bold">IS CLOSE!</Text>
            )}
          </Col>
          <Col>
            <Button
              type="primary"
              disabled={!isAllowed}
              className={getStatusClass(!bet_bazar_status)}
              onClick={onUpdateBetBazarStatus}
            >
              {bet_bazar_status ? 'Go To Close!' : 'Go To Open!'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item label="IM Status">
        <Row>
          <Col span={3}>
            {im_status ? (
              'is Open'
            ) : (
              <Text className="text-danger font-weight-bold">IS CLOSE!</Text>
            )}
          </Col>
          <Col>
            <Button
              type="primary"
              disabled={!isAllowed}
              className={getStatusClass(!im_status)}
              onClick={onUpdateIMStatus}
            >
              {im_status ? 'Go To Close!' : 'Go To Open!'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item label="SIS Status">
        <Row>
          <Col span={3}>
            {sis_status ? (
              'is Open'
            ) : (
              <Text className="text-danger font-weight-bold">IS CLOSE!</Text>
            )}
          </Col>
          <Col>
            <Button
              type="primary"
              disabled={!isAllowed}
              className={getStatusClass(!sis_status)}
              onClick={onUpdateSISStatus}
            >
              {sis_status ? 'Go To Close!' : 'Go To Open!'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item label="BTI Auto Add Match">
        <Row>
          <Col span={3}>
            {bti_auto_add_match ? (
              'is Open'
            ) : (
              <Text className="text-danger font-weight-bold">IS CLOSE!</Text>
            )}
          </Col>
          <Col>
            <Button
              type="primary"
              disabled={!isAllowed}
              className={getStatusClass(!bti_auto_add_match)}
              onClick={onUpdateBTIAutoAddMatch}
            >
              {bti_auto_add_match ? 'Go To Close!' : 'Go To Open!'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  )
}
const maintenanceText = (
  <Text className="text-danger font-weight-bold">WE ARE ON MAINTENANCE !</Text>
)
const getStatusClass = status => {
  if (status) return 'bg-success'
  return 'bg-primary'
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayStatus)
