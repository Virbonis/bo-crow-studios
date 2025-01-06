import { Button } from 'antd'
import React from 'react'

const ButtonSettle = ({
  match_id,
  st_settle,
  home_posisi,
  away_posisi,
  st_process_type,
  early_settlement_id,
  UpdateEarlySettlement,
  successCallback,
}) => {
  const onClickSettle = () =>
    UpdateEarlySettlement(
      {
        match_id,
        st_settle,
        home_posisi,
        away_posisi,
        st_process_type,
        early_settlement_id,
      },
      successCallback,
    )

  function GetStSettleName(val) {
    switch (val) {
      case -1:
        return 'Unsettle'
      case 1:
        return 'Settle'
      default:
        return ''
    }
  }

  return (
    <Button type="primary" onClick={onClickSettle}>
      {GetStSettleName(st_settle)}
    </Button>
  )
}

export default ButtonSettle
