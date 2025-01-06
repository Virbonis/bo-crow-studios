import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Spin, Alert, Tooltip, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/sportsbook-setting/actions'
import authEnum from 'authorize'
import './custom.scss'
import SettingStatus from './setting-status'
import SettingDefault from './setting-default'
import SettingMain from './setting-main'

const mapStateToProps = ({ sportsbookSetting, auth }) => ({
  loading: sportsbookSetting.loadingData,
  isAllowed: auth.user.user_auth_ids.includes(authEnum.WHO_CAN_CHANGE_SB_SETTING),
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Sportsbook Setting',
    })
  },
})

const SportsbookSetting = ({ isAllowed, loading, Load }) => {
  useEffect(() => {
    Load()
  }, [Load])

  return (
    <div className="card">
      <div className="card-body">
        <Spin spinning={loading}>
          {!isAllowed && (
            <Alert
              message="You are not allowed to edit this page !"
              type="error"
              className="mb-3"
            />
          )}
          <div className="d-flex flex-row-reverse justify-content-between">
            <Tooltip placement="top" title="Refresh">
              <Button icon={<ReloadOutlined />} onClick={Load} />
            </Tooltip>
            <div className="w-100">
              <SettingStatus reload={Load} isAllowed={isAllowed} />
              <SettingDefault reload={Load} isAllowed={isAllowed} />
              <SettingMain reload={Load} isAllowed={isAllowed} />
            </div>
          </div>
        </Spin>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SportsbookSetting)
