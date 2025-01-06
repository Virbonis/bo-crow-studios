import React from 'react'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import wrapperPopup from 'components/blaise/custom/wrapperPopup'
import { QueryInstantBet } from './query'
import Filter from './components/filter'
import TableInstantBet from './components/table'
import ModalGameTypeDetail from './components/modal-game-type-detail'
import Sound from './components/sound'
import '../shared-components/trading.scss'
import './custom.scss'
import Acrj from './components/acrj'
import Help from './components/help'

export const InstantBetWrapper = ({
  page = 'InstantBet', // can be called from MOQuick
  style = { height: 'calc(100vh - 23px)' },
  viewParameterMOQuick,
}) => {
  const [viewParameter, setViewParameter] = React.useState({
    interval: 3,
    branch_id: '',
    display: 50,
    league_ids: ['0'],
    match_ids: ['0'],
    match_time_slot: 'All',
    currency: 'All',
    sport_id: -99,
    match_id: 0,
    play_sound: true,
    vip_filter: [''],
    game_type_special: false,
    accept_pending: '',
    ftht: 'FTHT',
    game_types: ['-99'],
    platform: '',
    new_member: false,
    bet_amount: 0,
    bet_amount_comp: 10000,
    max_payout: 0,
    max_bet: 0,
    shown_columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 19, 21, 22, 23, 24], // 1 , 13 , 15 , 19 , 21
  })
  React.useLayoutEffect(() => {
    if (page === 'MOQuick') {
      setViewParameter(prev => ({
        ...prev,
        ...viewParameterMOQuick,
        match_time_slot: 'MO-Live',
      }))
    }
  }, [page, viewParameterMOQuick])

  return (
    <div style={style}>
      <InstantBet viewParameter={viewParameter} setViewParameter={setViewParameter} page={page} />
    </div>
  )
}
const InstantBet = ({ page, viewParameter, setViewParameter }) => {
  const tableRef = React.useRef()
  const { data = [], isFetching, refetch } = QueryInstantBet({
    ...viewParameter,
    game_types: viewParameter.game_types.toString() || '-99',
    league_ids: viewParameter.league_ids?.join(','),
    match_ids: viewParameter.match_ids?.join(','),
    vip_filter: viewParameter.vip_filter?.join(','),
    game_type_special: viewParameter.game_type_special ? 'Y' : 'N',
    new_member: viewParameter.new_member ? 'Y' : 'N',
  })
  const { bet_amount_comp, play_sound } = viewParameter

  const tableData = React.useMemo(
    () =>
      data.map(x => {
        // exclude vip_timer to avoid unnecessary re-render
        const { vip_timer, ...restData } = x
        return { ...restData }
      }),
    [data],
  )
  const hardRefresh = () => {
    refetch()
    tableRef.current.resetVoidTicketIDs()
  }

  return (
    <>
      <div className="d-flex flex-row" style={{ gap: 4 }}>
        <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={hardRefresh}>
          Refresh
        </Button>
        <Filter
          viewParameter={viewParameter}
          setViewParameter={setViewParameter}
          refetch={refetch}
          page={page}
          tableRef={tableRef}
        />
        <Acrj tableRef={tableRef} refetch={refetch} />
        <Help />
      </div>
      <TableInstantBet ref={tableRef} data={tableData} viewParameter={viewParameter} />
      <Sound data={data} play_sound={play_sound} bet_amount_comp={bet_amount_comp} />
      <ModalGameTypeDetail />
    </>
  )
}

export default wrapperPopup(InstantBetWrapper)
