import React from 'react'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { wrapperPopup } from 'components/blaise'
import ContentMOScoringDetail from 'pages/trading/mo-scoring-detail/content'
import actions from 'redux/mo-scoring-detail/actions'

const MoScoringDetailFly = ({ match_id, league_name, home_name, away_name, sport_id, title }) => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch({
      type: actions.EDIT,
      payload: {
        match_id: Number(match_id),
        league_name,
        home_name,
        away_name,
        sport_id: Number(sport_id),
      },
    })
  }, [dispatch, match_id, league_name, home_name, away_name, sport_id])

  return (
    <>
      <Helmet titleTemplate="" title={title} />
      <ContentMOScoringDetail
        editValue={{
          match_id: Number(match_id),
          league_name,
          home_name,
          away_name,
          sport_id: Number(sport_id),
        }}
      />
    </>
  )
}

export default wrapperPopup(MoScoringDetailFly)
