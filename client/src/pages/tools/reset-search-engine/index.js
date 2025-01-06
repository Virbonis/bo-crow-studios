import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'antd'
import actions from 'redux/reset-engine/actions'
import { SyncOutlined } from '@ant-design/icons'

const mapStateToProps = ({ resetEngine }) => ({
  loading: resetEngine.loading,
})

const mapDispatchToProps = dispatch => ({
  Reset: () =>
    dispatch({
      type: actions.RESET_ENGINE,
      source: 'Reset Engine',
    }),
})

const ResetEngine = ({ Reset, loading }) => {
  const resetHandler = () => {
    Modal.confirm({
      title: `Are you sure to reset?`,
      okText: 'Yes',
      cancelText: 'No',
      maskClosable: true,
      onOk: () => {
        Reset()
      },
    })
  }

  return (
    <div className="card">
      <div className="card-body">
        <Button
          type="primary"
          icon={<SyncOutlined />}
          onClick={() => resetHandler()}
          loading={loading}
        >
          Reset Search Engine
        </Button>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetEngine)
