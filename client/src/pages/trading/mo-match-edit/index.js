import React from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { wrapperPopup } from 'components/blaise'
import actions from 'redux/mo-match-edit/actions'
import { listGT } from 'helper'
import ContentTennis from './content-tennis'
import ContentOE from './content-oe'
import ContentWNW from './content-wnw'
import ContentBasic from './content'

const mapStateToProps = ({ moEdit }) => ({
  data: moEdit.data,
  loading: moEdit.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadMatch: payload => {
    dispatch({
      type: actions.LOAD_MATCH,
      payload,
    })
  },
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
})

const MOMatchEdit = React.memo(({ editValue, data, loading, LoadMatch }) => {
  const { match_id, display_admin, game_type, page } = editValue

  React.useEffect(() => {
    if (!match_id) return
    LoadMatch({
      match_id,
      display_admin,
    })
  }, [LoadMatch, match_id, display_admin])

  const Content = () => {
    if (['MO5', 'MO5Euro', 'MOOE', 'MOOS'].includes(page))
      return <ContentBasic match={data.match} display_admin={display_admin} page={page} />
    if (page === 'MOTennis')
      return <ContentTennis match={data.match} display_admin={display_admin} />
    if (listGT.OddEven.includes(game_type))
      return <ContentOE match={data.match} game_type={game_type} />
    if (listGT.WNW.includes(game_type))
      return <ContentWNW match={data.match} game_type={game_type} />

    return null
  }

  return (
    <Spin tip="Loading..." spinning={loading}>
      <Content />
    </Spin>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(wrapperPopup(MOMatchEdit))
