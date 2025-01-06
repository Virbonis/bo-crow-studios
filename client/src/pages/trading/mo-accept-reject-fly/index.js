import React from 'react'
import { Helmet } from 'react-helmet'
import { wrapperPopup } from 'components/blaise'
import MOAcceptReject from 'pages/trading/mo-accept-reject'

const MOAcceptRejectFly = ({ match_id, title }) => {
  return (
    <>
      <Helmet titleTemplate="" title={title} />
      <MOAcceptReject match_id={Number(match_id)} />
    </>
  )
}

export default wrapperPopup(MOAcceptRejectFly)
