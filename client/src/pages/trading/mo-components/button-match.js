import React from 'react'

const ButtonMatch = ({
  match_follow_rball,
  match_auto_odds,
  limit_id,

  match_id,
  display_admin,
  game_type,
  sport_id,
  page,

  home_name,
  away_name,
}) => {
  const title = `${match_id} - ${home_name} - ${away_name}`
  const qs = {
    match_id,
    display_admin,
    game_type,
    sport_id,
    page,
    title,
  }
  return (
    <button
      title={limit_id}
      size="small"
      type="button"
      className="p-0 mo_btn_link"
      onClick={() => {
        window.open(
          `/#/trading/mo-match-edit-fly?${new URLSearchParams(qs).toString()}`,
          `MatchEdit-${match_id}`,
          'height=750,width=1500,scrollbars=no',
        )
      }}
    >
      {`${match_follow_rball} ${match_auto_odds} ${match_id}`}
    </button>
  )
}
export default ButtonMatch
