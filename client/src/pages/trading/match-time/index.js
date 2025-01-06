import React from 'react'
import { connect } from 'react-redux'
import { Button, Space, Row } from 'antd'
import { isEmpty } from 'lodash'
import DragableModal from 'components/blaise/custom/DragableModal'
import actions from 'redux/match-time/actions'
import BasketTimer from './basket'
import OtherBasketTimer from './other-basket'

const mapStateToProps = ({ matchTime }) => ({
  editValue: matchTime.editValue,
  visible: !isEmpty(matchTime.editValue),
  data: matchTime.data,
})
const mapDispatchToProps = dispatch => ({
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
  LoadData: payload => {
    dispatch({
      type: actions.LOAD_DATA,
      payload,
    })
  },
  UpdateAutoClose: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_AUTO_CLOSE,
      payload,
      successCallback,
    })
  },
  UpdateAutoTimer: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_AUTO_TIMER,
      payload,
      successCallback,
    })
  },
})

const DrawerMatchTime = React.memo(
  ({
    editValue,
    visible,
    data,
    CancelEdit,
    LoadData,
    UpdateAutoClose,
    UpdateAutoTimer,
    isShowOption = true,
    successCallback,
  }) => {
    const { match_id, sport_id } = editValue
    const refetch = React.useCallback(() => {
      if (!match_id) return
      LoadData({ match_id })
    }, [match_id, LoadData])
    React.useEffect(() => {
      refetch()
    }, [refetch])

    // basketball, E-Basketball, netball, Football
    const isBasketTimer = [12, 58, 53, 34].includes(sport_id)

    const { is_show_auto_close, is_show_auto_timer, status_auto_close, status_auto_timer } = data
    const ButtonAutoClose = () => {
      if (is_show_auto_close !== 'Y') return null
      return (
        <Button
          size="small"
          className={`${status_auto_close === 'Y' ? 'bg-green text-white' : 'bg-red text-white'}`}
          onClick={() =>
            UpdateAutoClose(
              {
                match_id,
                status: status_auto_close === 'Y' ? 'N' : 'Y',
              },
              refetch,
            )
          }
        >
          {status_auto_close === 'Y' ? 'Auto Close ON' : 'Auto Close OFF'}
        </Button>
      )
    }
    const ButtonAutoTimer = () => {
      if (is_show_auto_timer !== 'Y') return null
      return (
        <Button
          size="small"
          className={`${status_auto_timer === 'Y' ? 'bg-green text-white' : 'bg-red text-white'}`}
          onClick={() =>
            UpdateAutoTimer(
              {
                match_id,
                status: status_auto_timer === 'Y' ? 'N' : 'Y',
              },
              refetch,
            )
          }
        >
          {status_auto_timer === 'Y' ? 'Speedy Timer ON' : 'Speedy Timer OFF'}
        </Button>
      )
    }

    return (
      <DragableModal
        title="Match Time"
        open={visible}
        onCancel={CancelEdit}
        footer={null}
        width={500}
        destroyOnClose
      >
        {isBasketTimer ? (
          <BasketTimer
            editValue={editValue}
            successCallback={() => {
              successCallback()
              CancelEdit()
            }}
          />
        ) : (
          <OtherBasketTimer
            editValue={editValue}
            successCallback={() => {
              successCallback()
              CancelEdit()
            }}
          />
        )}

        {isShowOption && (
          <Row justify="end">
            <Space>
              <ButtonAutoClose />
              <ButtonAutoTimer />
            </Space>
          </Row>
        )}
      </DragableModal>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMatchTime)
