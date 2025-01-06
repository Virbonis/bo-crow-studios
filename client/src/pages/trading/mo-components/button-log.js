import React from 'react'
import { Space } from 'antd'
import { getGameTypeDescriptionShort } from 'helper'

const ButtonLog = ({
  match_id,
  lineHDP,
  lineOU,
  lineGAH,
  gameTypeHDP,
  gameTypeOU,
  gameTypeGAH,
  home_name,
  away_name,
}) => {
  const title = `${match_id} - ${home_name} - ${away_name}`
  return (
    <Space>
      {lineHDP && (
        <button
          type="button"
          className="p-0 mo_btn_link"
          onClick={() =>
            window.open(
              `/#/trading/odds-log-fly?${new URLSearchParams({
                match_id,
                line: lineHDP % 30,
                game_type: gameTypeHDP,
                title,
              }).toString()}`,
              `OddsLog-${match_id}`,
              'height=450,width=1500,scrollbars=no',
            )
          }
        >
          {getGameTypeDescriptionShort(gameTypeHDP)}
        </button>
      )}
      {lineGAH && (
        <button
          type="button"
          className="p-0 mo_btn_link"
          onClick={() =>
            window.open(
              `/#/trading/odds-log-fly?${new URLSearchParams({
                match_id,
                line: lineGAH % 30,
                game_type: gameTypeGAH,
                title,
              }).toString()}`,
              `OddsLog-${match_id}`,
              'height=450,width=1500,scrollbars=no',
            )
          }
        >
          {getGameTypeDescriptionShort(gameTypeGAH)}
        </button>
      )}
      {lineOU && (
        <button
          type="button"
          className="p-0 mo_btn_link"
          onClick={() =>
            window.open(
              `/#/trading/odds-log-fly?${new URLSearchParams({
                match_id,
                line: lineOU % 30,
                game_type: gameTypeOU,
                title,
              }).toString()}`,
              `OddsLog-${match_id}`,
              'height=450,width=1500,scrollbars=no',
            )
          }
        >
          {getGameTypeDescriptionShort(gameTypeOU)}
        </button>
      )}
    </Space>
  )
}

export default ButtonLog
