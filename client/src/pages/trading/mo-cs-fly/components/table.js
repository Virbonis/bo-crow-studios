import React, { useMemo, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Button, Space } from 'antd'
import { CheckboxHide, HomeAwayName, TableMO } from 'pages/trading/mo-components'
import actions from 'redux/mo5/actions'
import useAudioPause from 'pages/trading/shared-components/useAudioPause'
import usePaginationData from 'pages/trading/mo-components/usePaginationData'
import transmuteDataMO from 'pages/trading/mo-components/helper'
import { useEvent } from 'rc-util'
import TableScore from './table-score-cs'

const mapDispatchToProps = dispatch => ({
  PauseResumeSubMatchCS: (payload, successCallback) => {
    dispatch({
      type: actions.PAUSE_RESUME_SUB_MATCH_CS,
      payload,
      successCallback,
    })
  },
  OpenCloseSubMatchCS: (payload, successCallback) => {
    dispatch({
      type: actions.OPEN_CLOSE_SUB_MATCH_CS,
      payload,
      successCallback,
    })
  },
})
const TableMO5CS = React.forwardRef(
  ({ viewParameter, data, reloadPartai, PauseResumeSubMatchCS, OpenCloseSubMatchCS }, ref) => {
    const [selectedRow, setSelectedRow] = useState()
    const [hiddenRows, setHiddenRows] = useState([])

    const { show_hide } = viewParameter
    const isHideActived = show_hide === 2

    const [filteredData, isAnyPaused] = useMemo(() => {
      const newData = transmuteDataMO(data, viewParameter.ftht, hiddenRows, isHideActived)
      return [newData, newData.some(x => x.ArrScore.some(s => s.sub_match_pause_status > 0))]
    }, [data, isHideActived, hiddenRows, viewParameter.ftht])
    useAudioPause(isAnyPaused)

    const [paginatedData, lastRowElementRef, resetPageNumber] = usePaginationData(
      filteredData,
      filteredData.length,
      5,
    )

    const tableRef = useRef()

    React.useImperativeHandle(ref, () => ({
      viewParameter,
      data,
      selectedRow: data.find(x => x.ArrMatch.row_id === selectedRow),
      resetSelectedRow: () => setSelectedRow(),
      resetHiddenRows: () => setHiddenRows([]),
      resetPageNumber: () => resetPageNumber(),
      scrollToTop: () => tableRef.current.scrollTo(0, 0),
      reloadPartai,
      page: 'MOCS',
    }))

    const columns = React.useMemo(
      () => [
        {
          title: 'H',
          render: ({ ArrMatch: { row_id }, isHidden }) => (
            <CheckboxHide row_id={row_id} isHidden={isHidden} setHiddenRows={setHiddenRows} />
          ),
          width: 25,
        },
        {
          title: 'Match',
          width: 65,
          render: ({ ArrMatch }) => {
            const { match_id, limit_id } = ArrMatch
            return <span title={limit_id}>{match_id}</span>
          },
        },
        {
          title: 'Home Away',
          // render: ({ ArrMatch: { home_name, away_name, st_penalty, home_rc, away_rc } }) => {
          render: ({ ArrMatch, ArrHDP }) => {
            return (
              <Space direction="vertical" className="w-100">
                <HomeAwayName
                  {...ArrMatch}
                  {...ArrHDP}
                  name={ArrMatch.home_name}
                  direction="H"
                  noDirection
                  textOnly
                />
                <HomeAwayName
                  {...ArrMatch}
                  {...ArrHDP}
                  name={ArrMatch.away_name}
                  direction="A"
                  noDirection
                  textOnly
                />
              </Space>
            )
          },
          width: 150,
        },
        {
          title: 'Live',
          render: ({ ArrMatch: { home_posisi, away_posisi } }) => (
            <div size="small" type="text" className="score_box bg-orange m-0 p-0">
              {home_posisi} - {away_posisi}
            </div>
          ),
          width: 50,
        },
        {
          title: '',
          render: ({ ArrMatch: { match_id, game_type }, ArrScore }) => {
            return (
              <TableScore
                data={ArrScore}
                match_id={match_id}
                game_type={game_type}
                reloadPartai={reloadPartai}
              />
            )
          },
        },
        {
          title: 'Action',
          render: ({ ArrMatch: { match_id, game_type } }) => {
            const openClose = st => () =>
              OpenCloseSubMatchCS({ match_id, game_type, sub_match_open_status: st }, reloadPartai)
            const pauseResume = st => () =>
              PauseResumeSubMatchCS(
                { match_id, game_type, sub_match_pause_status: st },
                reloadPartai,
              )
            return (
              <div style={{ display: 'flex', gap: 0, flexDirection: 'column' }}>
                <Button type="link" onClick={openClose('N')}>
                  Close All
                </Button>
                <Button type="link" onClick={openClose('Y')}>
                  Open All
                </Button>
                <Button type="link" onClick={pauseResume(3)}>
                  Pause All
                </Button>
                <Button type="link" onClick={pauseResume(0)}>
                  Resume All
                </Button>
              </div>
            )
          },
          width: 100,
        },
      ],
      [reloadPartai, PauseResumeSubMatchCS, OpenCloseSubMatchCS],
    )

    const onRow = useEvent(record => {
      let className = `${record.isFirst} ${record.isLast}`
      if (selectedRow === record.ArrMatch.row_id) className += ' table-primary'
      return {
        className,
        onClick: () => setSelectedRow(record.ArrMatch.row_id),
      }
    })

    return (
      <TableMO
        tableRef={tableRef}
        rowKey={rowKey}
        columns={columns}
        dataSource={paginatedData}
        onRow={onRow}
        lastRowElementRef={lastRowElementRef}
      />
    )
  },
)
const rowKey = record => record.ArrMatch.row_id

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(TableMO5CS)
