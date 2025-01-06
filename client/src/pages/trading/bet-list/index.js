import React from 'react'
import { connect } from 'react-redux'
import { Empty } from 'antd'
import { wrapperPopup } from 'components/blaise'
import actionsMatch from 'redux/match/actions'
import ContentAHOU from './content-ahou'
import Content1X2 from './content-1X2'
import ContentCS from './content-cs'
import ContentOE from './content-oe'
import ContentTennis from './content-tennis'

const mapDispatchToProps = (dispatch, ownProps) => ({
  LoadMatchSelection: () => {
    dispatch({
      type: actionsMatch.LOAD_SELECT_IN_BETLIST,
      payload: {
        group: ownProps.group,
        popup_id: ownProps.popup_id,
      },
    })
  },
})

const BetList = React.memo(({ editValue, LoadMatchSelection }) => {
  React.useEffect(() => {
    if (['HDP', 'OU', 'OE', '1X2', 'tennis'].includes(editValue.gt)) LoadMatchSelection()
  }, [LoadMatchSelection, editValue.gt])

  const Content = () => {
    if (editValue.gt === 'HDP' || editValue.gt === 'OU' || editValue.gt === 'ML')
      return <ContentAHOU editValue={editValue} />
    if (editValue.gt === 'OE') return <ContentOE editValue={editValue} />
    if (editValue.gt === '1X2') return <Content1X2 editValue={editValue} />
    if (editValue.gt === 'CS') return <ContentCS editValue={editValue} />
    if (editValue.gt === 'tennis') return <ContentTennis editValue={editValue} />

    return <Empty />
  }

  return <Content />
})

export default connect(null, mapDispatchToProps)(wrapperPopup(BetList))
