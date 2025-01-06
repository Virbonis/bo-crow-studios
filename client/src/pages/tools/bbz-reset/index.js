import React from 'react'
import { Button } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/bbz/actions'

const mapStateToProps = ({ bbz }) => ({
  loading: bbz.loading,
})

const mapDispatchToProps = dispatch => ({
  ResetService: () => {
    dispatch({
      type: actions.RESET_SERVICE,
      source: 'BBZ Reset',
    })
  },
})

const BBZReset = ({ loading, ResetService }) => {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <Button type="primary" icon={<SyncOutlined />} onClick={ResetService} loading={loading}>
            Reset Service
          </Button>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BBZReset)
