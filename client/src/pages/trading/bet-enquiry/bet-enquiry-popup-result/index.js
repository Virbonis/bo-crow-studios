import React from 'react'
import { Button } from 'antd'
import { gameTypeDescription } from 'helper'
import { DragableModal } from 'components/blaise'
import BetEnquiryPopupResult from './popup-result'

const BetWinlossResult = ({ record }) => {
  const { void_id, game_type, winloss_status } = record
  const [visibleResult, setVisibleResult] = React.useState(false)

  let showResultButton = false
  if (void_id.toString() !== '' && game_type === 3000) showResultButton = true
  if (['D', 'L', 'W'].includes(winloss_status)) showResultButton = true
  if (game_type === 77) showResultButton = false

  return (
    showResultButton && (
      <>
        <Button type="link" className="font-weight-bold p-0" onClick={() => setVisibleResult(true)}>
          Result
        </Button>

        <DragableModal
          title={
            record?.game_type === 11
              ? `Result - ${record.league_name}`
              : `Result - ${gameTypeDescription[record?.game_type]?.long}`
          }
          width="50%"
          open={visibleResult}
          destroyOnClose
          center
          onCancel={() => setVisibleResult(false)}
          footer={null}
        >
          <BetEnquiryPopupResult {...record} />
        </DragableModal>
      </>
    )
  )
}

export default BetWinlossResult
