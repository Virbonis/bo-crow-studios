import React from 'react'
import { connect } from 'react-redux'
import { Button, Space } from 'antd'
import wrapperPopup from 'components/blaise/custom/wrapperPopup'
import actionsMOMatchEdit from 'redux/mo-match-edit/actions'
import TableMO5 from './components/table'
import { QueryMO5 } from '../mo-fly/query'
import { DropdownSelectView } from '../mo-components'
import '../mo-components/custom.scss'

const mapDispatchToProps = dispatch => ({
  EditMatch: match => {
    dispatch({
      type: actionsMOMatchEdit.OPEN_EDIT,
      payload: match,
    })
  },
})

const MO5ViewWrapper = ({ popup_id, EditMatch }) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    ftht: 'FTHT',
    show_hide: 1,
    match_time_slot: 'Live',
    interval: 3,
  })
  return (
    <div style={{ height: 'calc(100vh - 24px)' }}>
      <MO5View
        viewParameter={viewParameter}
        setViewParameter={setViewParameter}
        EditMatch={EditMatch}
      />
    </div>
  )
}

const page = 'MOView'
const MO5View = ({ viewParameter, setViewParameter, EditMatch }) => {
  const tableRef = React.useRef()
  const { popup_id, match_time_slot, interval, ftht } = viewParameter
  const { data = [], isFetching, refetch } = QueryMO5({
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

  return (
    <>
      <Space>
        <DropdownSelectView
          viewParameter={viewParameter}
          setViewParameter={setViewParameter}
          isFetching={isFetching}
          refetch={refetch}
          refetchNewData={refetchNewData}
          page={page}
        />
        <Button
          onClick={() => {
            if (tableRef.current.selectedRow) {
              const { match_id, display_admin } = tableRef.current.selectedRow.ArrMatch
              EditMatch({ match_id, display_admin })
            }
          }}
        >
          Edit
        </Button>
      </Space>
      <TableMO5
        viewParameter={viewParameter}
        ref={tableRef}
        data={data}
        refetch={refetch}
        loading={isFetching}
      />
    </>
  )
}

export default wrapperPopup(connect(null, mapDispatchToProps)(MO5ViewWrapper))
