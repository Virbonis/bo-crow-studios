import React from 'react'

const ButtonStock = ({
  stock,
  match_id,
  sub_match_id,
  game_type,
  gt,
  choice_code, // for csLive

  home_name,
  away_name,
}) => {
  const className = stock < 0 ? 'text-red' : ''

  const title = `${match_id} - ${home_name} - ${away_name}`
  const qs = {
    stock,
    match_id,
    sub_match_id,
    game_type,
    gt,
    choice_code,
    title,
  }
  return (
    <button
      className={`w-100 ${className} mo_btn_link font-weight-bold`}
      type="button"
      onClick={() => {
        window.open(
          `/#/trading/bet-list-fly?${new URLSearchParams(qs).toString()}`,
          `Stock-${match_id}`,
          'height=450,width=1500,scrollbars=no',
        )
      }}
    >
      {stock}
    </button>
  )
}

export default ButtonStock
