import React from 'react'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { wrapperPopup } from 'components/blaise'
import MOMatchEdit from 'pages/trading/mo-match-edit'
import actions from 'redux/mo-match-edit/actions'

// page = MO5/MOQuick/MO5Euro/MO5OE/MOOS/MOTennis/MOView
const MOMatchEditFly = ({
  match_id,
  display_admin,
  game_type, // if MO5, MO5Euro, MOOE, MOOS can be undefined
  sport_id,
  page = 'MO5',
  title,
}) => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch({
      type: actions.EDIT,
      payload: {
        match_id: Number(match_id),
        display_admin: Number(display_admin),
        game_type: Number(game_type),
        sport_id: Number(sport_id),
        page,
      },
    })
  }, [dispatch, match_id, display_admin, game_type, sport_id, page])

  return (
    <>
      <Helmet titleTemplate="" title={title} />
      <MOMatchEdit
        editValue={{
          match_id: Number(match_id),
          display_admin: Number(display_admin),
          game_type: Number(game_type),
          sport_id: Number(sport_id),
          page,
        }}
      />
    </>
  )
}

export default wrapperPopup(MOMatchEditFly)
