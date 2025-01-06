import React from 'react'
import { Helmet } from 'react-helmet'
import { wrapperPopup } from 'components/blaise'
import MOAcceptRejectView from 'pages/trading/mo-accept-reject-view'

const MOAcceptRejectViewFly = ({ match_id, title }) => {
  return (
    <>
      <Helmet titleTemplate="" title={title} />
      <MOAcceptRejectView match_id={Number(match_id)} />
    </>
  )
}

export default wrapperPopup(MOAcceptRejectViewFly)
