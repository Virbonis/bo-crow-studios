import React from 'react'
import { Space } from 'antd'
import wrapperPopup from 'components/blaise/custom/wrapperPopup'

import { QueryMO5CS, ReloadPartaiRow } from './query'
import TableMOCS from './components/table'
import { ButtonPauseAll, DropdownSelectView } from '../mo-components'
import '../mo-components/custom.scss'

const MOCSWrapper = ({ popup_id }) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    ftht: 'FTHT',
    show_hide: 1,
    match_time_slot: 'Live',
    interval: 3,
  })
  return (
    <div style={{ height: 'calc(100vh - 24px)' }}>
      <MOCS viewParameter={viewParameter} setViewParameter={setViewParameter} />
    </div>
  )
}

const page = 'MOCS'
const MOCS = ({ viewParameter, setViewParameter }) => {
  const tableRef = React.useRef()

  const { popup_id, ftht, match_time_slot, interval } = viewParameter
  const { data = [], isFetching, refetch } = QueryMO5CS({
    popup_id,
    ftht,
    match_time_slot,
    interval,
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

  const reloadPartai = React.useCallback(() => {
    ReloadPartaiRow({
      popup_id,
      ftht,
      match_time_slot,
      match_id: tableRef.current.selectedRow.ArrMatch.match_id,
      game_type: tableRef.current.selectedRow.ArrMatch.game_type,
    })
  }, [popup_id, ftht, match_time_slot])

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
          <ButtonPauseAll
            popup_id={popup_id}
            match_time_slot={match_time_slot}
            mo_page="MOCS"
            successCallback={refetch}
            tableRef={tableRef}
          />
        </Space>
      </div>
      <TableMOCS
        ref={tableRef}
        data={data}
        viewParameter={viewParameter}
        reloadPartai={reloadPartai}
      />
    </>
  )
}
export default wrapperPopup(MOCSWrapper)
