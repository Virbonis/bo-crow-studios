import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import actions from 'redux/instant-bet/actions'
import ListParlay from './list-parlay'
import ListMatchParlay from './list-match-parlay'
import ListLottery from './list-lottery'

const mapStateToProps = ({ instantBet }) => ({
  loading: instantBet.loading,
  data: instantBet.gameTypeDetail,
})
const mapDispatchToProps = dispatch => ({
  CloseDetail: () => {
    dispatch({
      type: actions.OPEN_INSTANT_BET_DETAIL,
      payload: {
        view: null,
      },
    })
  },
})

const ModalGameTypeDetail = ({ data, CloseDetail }) => {
  const [title, content] = React.useMemo(() => {
    switch (data?.view) {
      case 'parlay':
        return ['Parlay', <ListParlay {...data} />]
      case 'match_parlay':
        return ['Match Parlay', <ListMatchParlay {...data} />]
      case 'lottery':
        return ['Lottery', <ListLottery {...data} />]
      default:
        return [null, null]
    }
  }, [data])

  if (!data) return null
  const { bet_id } = data
  return (
    <Modal
      title={`${title} ${bet_id}`}
      open={!!bet_id}
      onCancel={CloseDetail}
      footer={null}
      width={800}
    >
      {content}
    </Modal>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalGameTypeDetail)
