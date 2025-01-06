import React from 'react'
import { Space } from 'antd'
import wrapperPopup from 'components/blaise/custom/wrapperPopup'
import DrawerMatchRecord from 'pages/trading/match-record'
import DrawerMOScoring from 'pages/trading/mo-scoring'
import DrawerMatchTime from 'pages/trading/match-time'

import { QueryMO5Euro, ReloadPartaiRow, ReloadSingleRow } from './query'
import TableMO5Euro from './components/table'
import DropdownScoreRC from './components/dropdown-score-rc'
import {
  ButtonMatchTime,
  SelectMatchRound,
  ButtonPauseAll,
  ButtonSyncMarketLeague,
  DropdownSelectView,
} from '../mo-components'
import '../mo-components/custom.scss'

const MO5EuroWrapper = ({ popup_id }) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    ftht: 'FTHT',
    show_hide: 1,
    match_time_slot: 'Live',
    interval: 3,
  })
  return (
    <div style={{ height: 'calc(100vh - 24px)' }}>
      <MO5Euro viewParameter={viewParameter} setViewParameter={setViewParameter} />
    </div>
  )
}

const page = 'MO5Euro'
const MO5Euro = ({ viewParameter, setViewParameter }) => {
  const tableRef = React.useRef()

  const { popup_id, match_time_slot, interval, ftht } = viewParameter
  const { data = [], isFetching, refetch } = QueryMO5Euro({
    popup_id,
    match_time_slot,
    interval,
    ftht,
  })
  React.useEffect(() => {
    refetch()
    tableRef.current.resetSelectedRow()
    tableRef.current.resetHiddenRows()
  }, [refetch, tableRef])

  const refetchNewData = React.useCallback(() => {
    refetch()
    tableRef.current.scrollToTop()
    tableRef.current.resetPageNumber()
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
          <DropdownScoreRC tableRef={tableRef} page={page} />
          <ButtonMatchTime tableRef={tableRef} />
          <SelectMatchRound tableRef={tableRef} successCallback={reloadPartai} />
          <ButtonPauseAll
            popup_id={popup_id}
            match_time_slot={match_time_slot}
            successCallback={refetch}
            tableRef={tableRef}
          />
          <ButtonSyncMarketLeague tableRef={tableRef} page="MOEuroAHOU" successCallback={refetch} />
        </Space>
      </div>
      <TableMO5Euro
        ref={tableRef}
        data={data}
        viewParameter={viewParameter}
        reloadSingle={reloadSingle}
        reloadPartai={reloadPartai}
      />
      <DrawerMatchRecord penalty={false} successCallback={reloadPartai} />
      <DrawerMOScoring />
      <DrawerMatchTime successCallback={reloadPartai} />
    </>
  )
}
export default wrapperPopup(MO5EuroWrapper)
