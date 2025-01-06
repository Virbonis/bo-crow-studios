import React from 'react'
import { Button } from 'antd'
import { DragableModal } from 'components/blaise'
import BetEnquiryPopupDetail from './popup-detail'

const BetSlipDetail = ({ record }) => {
  const { game_type, tickets, winloss_status } = record
  const [visibleDetail, setVisibleDetail] = React.useState(false)

  let showDetailButton = false
  if (game_type === -1 && tickets > 1 && winloss_status !== '') showDetailButton = true
  if (game_type === 4000) showDetailButton = true

  return (
    showDetailButton && (
      <>
        <Button type="link" className="font-weight-bold p-0" onClick={() => setVisibleDetail(true)}>
          Detail
        </Button>

        <DragableModal
          title={game_type === 4000 ? 'Lottery Detail' : 'Parlay Combo Bet Detail'}
          width="50%"
          open={visibleDetail}
          destroyOnClose
          center
          onCancel={() => setVisibleDetail(false)}
          footer={null}
        >
          <BetEnquiryPopupDetail {...record} />
        </DragableModal>
      </>
    )
  )
}

export default BetSlipDetail
