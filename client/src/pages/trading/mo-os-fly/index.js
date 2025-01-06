import React from 'react'
import { Space } from 'antd'
import wrapperPopup from 'components/blaise/custom/wrapperPopup'
import DrawerMatchRecord from 'pages/trading/match-record'
import DrawerMOScoring from 'pages/trading/mo-scoring'
import DrawerEarlySettlement from 'pages/trading/early-settlement'
import DrawerMatchTime from 'pages/trading/match-time'
import { QueryMOOS, ReloadPartaiRow, ReloadSingleRow } from './query'
import DropdownScoreRC from './components/dropdown-score-rc'
import TableMOOS from './components/table'
import {
  ButtonLeech,
  ButtonMatchTime,
  SelectMatchRound,
  ButtonPauseAll,
  ButtonSyncMarketLeague,
  DropdownSelectView,
} from '../mo-components'
import '../mo-components/custom.scss'

export const MOOSWrapper = ({
  popup_id,
  page = 'MOOS',
  viewParameterMOQuick,
  style = { height: 'calc(100vh - 24px)' },
}) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    ftht: 'FTHT',
    show_hide: 1,
    match_time_slot: 'Live',
    interval: 3,
    match_id: '',
  })
  React.useEffect(() => {
    if (page === 'MOQuick') {
      setViewParameter(prev => ({
        ...prev,
        ...viewParameterMOQuick,
      }))
    }
  }, [page, viewParameterMOQuick])
  return (
    <div style={style}>
      <MOOS viewParameter={viewParameter} setViewParameter={setViewParameter} page={page} />
    </div>
  )
}
const MOOS = ({ viewParameter, setViewParameter, page }) => {
  const tableRef = React.useRef()
  const { popup_id, match_time_slot, interval, match_id, ftht } = viewParameter
  const { data = [], isFetching, refetch } = QueryMOOS({
    popup_id,
    match_time_slot,
    interval,
    match_id,
    ftht,
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

  React.useEffect(() => {
    // manual refetch when match_id changed (from MOQuick)
    if (match_id && match_id !== -1) refetch()
  }, [match_id, refetch])

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
          <ButtonMatchTime tableRef={tableRef} />
          <SelectMatchRound tableRef={tableRef} successCallback={reloadPartai} />
          <ButtonPauseAll
            popup_id={popup_id}
            match_time_slot={match_time_slot}
            successCallback={refetch}
            tableRef={tableRef}
            mo_page={page}
          />
          <ButtonSyncMarketLeague tableRef={tableRef} page="MOOS" successCallback={refetch} />
        </Space>
      </div>
      <TableMOOS
        ref={tableRef}
        data={data}
        viewParameter={viewParameter}
        reloadSingle={reloadSingle}
        reloadPartai={reloadPartai}
      />
      <DrawerMatchRecord successCallback={reloadPartai} />
      <DrawerMOScoring />
      <DrawerEarlySettlement />
      <DrawerMatchTime successCallback={reloadPartai} />
    </>
  )
}
export default wrapperPopup(MOOSWrapper)
