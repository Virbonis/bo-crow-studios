import React from 'react'
import { Space } from 'antd'
import wrapperPopup from 'components/blaise/custom/wrapperPopup'
import DrawerMatchRecord from 'pages/trading/match-record'

import { QueryMOTennis, ReloadPartaiRow, ReloadSingleRow } from './query'
import DropdownScoreRC from './components/dropdown-score-rc'
import TableMOTennis from './components/table'
import {
  ButtonLeech,
  ButtonPauseAll,
  ButtonSyncMarketLeague,
  ButtonZeroOdds,
  DropdownSelectView,
} from '../mo-components'
import '../mo-components/custom.scss'

const MOTennisWrapper = ({ popup_id }) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    ftht: 'FTHT',
    show_hide: 1,
    match_time_slot: 'Live',
    interval: 3,
  })
  return (
    <div style={{ height: 'calc(100vh - 24px)' }}>
      <MOTennis viewParameter={viewParameter} setViewParameter={setViewParameter} />
    </div>
  )
}
const page = 'MOTennis'
const MOTennis = ({ viewParameter, setViewParameter }) => {
  const tableRef = React.useRef()

  const { popup_id, match_time_slot, interval, ftht } = viewParameter
  const { data = [], isFetching, refetch } = QueryMOTennis({
    ftht,
    popup_id,
    match_time_slot,
    interval,
  })

  const refetchNewData = React.useCallback(() => {
    refetch()
    tableRef.current.scrollToTop()
    tableRef.current.resetPageNumber()
    tableRef.current.resetSelectedRow()
    tableRef.current.resetHiddenRows()
  }, [refetch])

  const reloadSingle = React.useCallback(() => {
    ReloadSingleRow({
      popup_id,
      match_time_slot,
      match_id: tableRef.current.selectedRow.ArrMatch.match_id,
      display_admin: tableRef.current.selectedRow.ArrMatch.display_admin,
    })
  }, [popup_id, match_time_slot])
  const reloadPartai = React.useCallback(() => {
    ReloadPartaiRow({
      popup_id,
      match_time_slot,
      match_id: tableRef.current.selectedRow.ArrMatch.match_id,
    })
  }, [popup_id, match_time_slot])

  return (
    <>
      <div className="d-flex justify-content-between">
        <Space>
          <DropdownSelectView
            viewParameter={viewParameter}
            setViewParameter={setViewParameter}
            isFetching={isFetching}
            refetch={refetch}
            refetchNewData={refetchNewData}
            page={page}
          />
          <DropdownScoreRC tableRef={tableRef} />
          <ButtonLeech tableRef={tableRef} successCallback={reloadPartai} />
          <ButtonZeroOdds tableRef={tableRef} successCallback={reloadPartai} />
          <ButtonPauseAll
            popup_id={popup_id}
            match_time_slot={match_time_slot}
            successCallback={refetch}
            tableRef={tableRef}
          />
          <ButtonSyncMarketLeague tableRef={tableRef} page="MO5" successCallback={refetch} />
        </Space>
      </div>
      <TableMOTennis
        ref={tableRef}
        data={data}
        viewParameter={viewParameter}
        reloadSingle={reloadSingle}
        reloadPartai={reloadPartai}
      />
      <DrawerMatchRecord successCallback={reloadPartai} />
      {/* <DrawerMOScoring /> */}
      {/* <DrawerEarlySettlement /> */}
      {/* <DrawerMatchTime successCallback={reloadPartai} /> */}
      {/* <DrawerBasketTimer /> */}
    </>
  )
}
export default wrapperPopup(MOTennisWrapper)
