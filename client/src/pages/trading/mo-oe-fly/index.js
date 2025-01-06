import React from 'react'
import { Button, Space } from 'antd'
import wrapperPopup from 'components/blaise/custom/wrapperPopup'

import { QueryMOOE, ReloadPartaiRow, ReloadSingleRow } from './query'
import TableMOOE from './components/table'
import { ButtonPauseAll, DropdownSelectView } from '../mo-components'
import '../mo-components/custom.scss'

const MOOEWrapper = ({ popup_id }) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    ftht: 'FTHT',
    show_hide: 1,
    match_time_slot: 'Live',
    interval: 3,
  })
  return (
    <div style={{ height: 'calc(100vh - 24px)' }}>
      <MOOE viewParameter={viewParameter} setViewParameter={setViewParameter} />
    </div>
  )
}
const page = 'MOOE'
const MOOE = ({ viewParameter, setViewParameter }) => {
  const tableRef = React.useRef()

  const { popup_id, match_time_slot, interval } = viewParameter
  const { data = [], isFetching, refetch } = QueryMOOE({
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
          <ButtonPauseAll
            popup_id={popup_id}
            match_time_slot={match_time_slot}
            successCallback={refetch}
            tableRef={tableRef}
          />
          <div>
            P.Max Bet:
            <Button
              size="small"
              type="link"
              onClick={() => tableRef.current.setSelectBookmark('maxbet')}
            >
              {tableRef.current?.PMaxBet}
            </Button>
          </div>
          <div>
            P.LAP:
            <Button
              size="small"
              type="link"
              onClick={() => tableRef.current.setSelectBookmark('lap')}
            >
              {tableRef.current?.PLap}
            </Button>
          </div>
          <div>
            P.VIP 3:
            <Button
              size="small"
              type="link"
              onClick={() => tableRef.current.setSelectBookmark('vip3')}
            >
              {tableRef.current?.PVIP3}
            </Button>
          </div>
        </Space>
      </div>
      <TableMOOE
        ref={tableRef}
        data={data}
        viewParameter={viewParameter}
        reloadSingle={reloadSingle}
        reloadPartai={reloadPartai}
      />
    </>
  )
}
export default wrapperPopup(MOOEWrapper)
