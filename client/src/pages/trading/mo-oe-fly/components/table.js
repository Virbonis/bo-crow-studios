import React, { useMemo, useRef, useState } from 'react'
import {
  SelectLDiff,
  ButtonMatch,
  ButtonMoveOddsDirection,
  CheckboxHide,
  InputOdds,
  SelectOddsPoint,
  ButtonMoveOddsSingle,
  ButtonPause,
  ButtonStock,
  SelectSpread,
  StatusOpenSubMatch,
  StatusFollowBookmark,
  TableMO,
  HomeAwayName,
} from 'pages/trading/mo-components'
import { Select } from 'antd'
import getClassTdMO, { getShortPause } from 'helper/mo'
import useAudioPause from 'pages/trading/shared-components/useAudioPause'
import usePaginationData from 'pages/trading/mo-components/usePaginationData'
import transmuteDataMO from 'pages/trading/mo-components/helper'
import { useEvent } from 'rc-util'

const TableMOOE = React.forwardRef(({ viewParameter, data, reloadSingle, reloadPartai }, ref) => {
  const [selectedRow, setSelectedRow] = useState()
  const [hiddenRows, setHiddenRows] = useState([])

  const { show_hide } = viewParameter
  const isHideActived = show_hide === 2

  // filteredData = exclude match_elapsed to avoid unnecessary re-render
  const [filteredData, isAnyPaused, PMaxBet, PLap, PVIP3] = useMemo(() => {
    let newData = data.map(x => {
      const { ArrMatch } = x
      // exclude match_elapsed to avoid unnecessary re-render
      const { match_elapsed, ...restArrMatch } = ArrMatch
      return { ...x, ArrMatch: restArrMatch }
    })
    newData = transmuteDataMO(newData, viewParameter.ftht, hiddenRows, isHideActived)
    return [
      newData,
      newData.some(x => x.ArrOE?.st_pause > 0),
      newData.filter(x => getShortPause(x.ArrOE?.reason_pause) === 'maxbet').length,
      newData.filter(x => getShortPause(x.ArrOE?.reason_pause) === 'lap').length,
      newData.filter(x => getShortPause(x.ArrOE?.reason_pause) === 'vip3').length,
    ]
  }, [data, isHideActived, hiddenRows, viewParameter.ftht])
  useAudioPause(isAnyPaused, PMaxBet, PLap, PVIP3)

  const [paginatedData, lastRowElementRef, resetPageNumber] = usePaginationData(
    filteredData,
    filteredData.length,
    5,
  )

  const moveOddsOERef = useRef()
  const tableRef = useRef()
  React.useImperativeHandle(ref, () => ({
    viewParameter,
    data,
    selectedRow: data.find(x => x.ArrMatch.row_id === selectedRow),
    resetSelectedRow: () => setSelectedRow(),
    resetHiddenRows: () => setHiddenRows([]),
    resetPageNumber: () => resetPageNumber(),
    scrollToTop: () => tableRef.current.scrollTo(0, 0),
    moveOddsOERef,
    reloadSingle,
    reloadPartai,
    page: 'MOOE',
    PMaxBet,
    PLap,
    PVIP3,
    setSelectBookmark: bookmark => {
      const pausedRows = paginatedData.filter(
        x => getShortPause(x.ArrOE?.reason_pause) === bookmark,
      )
      if (pausedRows.length === 0) return
      let selected
      if (pausedRows.length > 1) {
        const index = pausedRows.findIndex(x => x.ArrMatch.row_id === selectedRow)
        selected = pausedRows[index + 1]
      }
      selected = selected || pausedRows[0]

      setSelectedRow(selected.ArrMatch.row_id)
      const index = paginatedData.indexOf(selected)
      document
        .getElementById('dvDetail')
        .getElementsByTagName('tr')
        [index].scrollIntoView()
    },
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
        render: ({ ArrMatch, ArrOE: { game_type } }) => (
          <ButtonMatch {...ArrMatch} game_type={game_type} page={ref.current.page} />
        ),
        width: 65,
      },
      {
        title: 'Home',
        width: 125,
        render: ({ ArrMatch, ArrHDP }) => (
          <HomeAwayName
            {...ArrMatch}
            {...ArrHDP}
            name={ArrMatch.home_name}
            direction="H"
            tableRef={ref}
            successCallback={reloadSingle}
            textOnly
          />
        ),
        onCell: ({ ArrOE: { st_auto_odds } }) => ({
          className: st_auto_odds > 0 ? 'bg-lime' : 'bg-orange',
        }),
      },
      {
        title: 'Away',
        width: 125,
        render: ({ ArrMatch, ArrHDP }) => (
          <HomeAwayName
            {...ArrMatch}
            {...ArrHDP}
            name={ArrMatch.away_name}
            direction="A"
            tableRef={ref}
            successCallback={reloadSingle}
            textOnly
          />
        ),
        onCell: ({ ArrOE: { st_auto_odds } }) => ({
          className: st_auto_odds > 0 ? 'bg-lime' : 'bg-orange',
        }),
      },
      {
        title: 'Odds',
        render: ({ ArrMatch: { match_id }, ArrOE: { sub_match_id, odds } }) => (
          <InputOdds
            match_id={match_id}
            sub_match_id={sub_match_id}
            odds={odds}
            successCallback={reloadSingle}
          />
        ),
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).oe.odds,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch: { match_id }, ArrOE: { sub_match_id, st_auto_odds } }) => (
          <ButtonMoveOddsDirection
            match_id={match_id}
            sub_match_id={sub_match_id}
            direction="O"
            gt="OE"
            tableRef={ref}
            successCallback={reloadSingle}
            enabled={st_auto_odds === 1}
          />
        ),
        width: 20,
      },
      {
        title: 'L.Diff',
        render: ({ ArrMatch: { match_id }, ArrOE: { sub_match_id, ldiff, st_auto_odds } }) => (
          <SelectLDiff
            match_id={match_id}
            sub_match_id={sub_match_id}
            ldiff={ldiff}
            enabled={st_auto_odds === 1}
            successCallback={reloadSingle}
          />
        ),
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).oe.ldiff,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch: { match_id }, ArrOE: { sub_match_id, st_auto_odds } }) => (
          <ButtonMoveOddsDirection
            match_id={match_id}
            sub_match_id={sub_match_id}
            direction="E"
            gt="OE"
            tableRef={ref}
            successCallback={reloadSingle}
            enabled={st_auto_odds === 1}
          />
        ),
        width: 20,
      },
      {
        title: (
          <Select
            className="w-100"
            placeholder="OE"
            dropdownRender={() => <SelectOddsPoint ref={moveOddsOERef} />}
          />
        ),
        render: ({
          ArrMatch: { match_id },
          ArrOE: { sub_match_id, game_type, odds_home, odds_away, st_auto_odds, st_pause },
        }) => (
          <div className="d-flex justify-content-between">
            <ButtonMoveOddsSingle
              match_id={match_id}
              sub_match_id={sub_match_id}
              odds={odds_home}
              direction="O"
              gt="OE"
              tableRef={ref}
              successCallback={reloadSingle}
              enabled={st_auto_odds === 0}
            />
            <ButtonPause
              tableRef={ref}
              match_id={match_id}
              sub_match_id={sub_match_id}
              game_type={game_type}
              st_pause={st_pause}
              successCallback={reloadSingle}
            />
            <ButtonMoveOddsSingle
              match_id={match_id}
              sub_match_id={sub_match_id}
              odds={odds_away}
              direction="E"
              gt="OE"
              tableRef={ref}
              successCallback={reloadSingle}
              enabled={st_auto_odds === 0}
            />
          </div>
        ),
        width: 155,
        onCell: row => ({
          className: getClassTdMO(row).oe.ha,
        }),
      },
      {
        title: 'Stock',
        render: ({
          ArrMatch: { match_id, home_name, away_name },
          ArrOE: { sub_match_id, stock, show_stock },
        }) =>
          show_stock && (
            <ButtonStock
              stock={stock}
              match_id={match_id}
              sub_match_id={sub_match_id}
              gt="OE"
              home_name={home_name}
              away_name={away_name}
            />
          ),
        width: 40,
      },
      {
        title: '%',
        render: ({ ArrMatch: { match_id }, ArrOE: { sub_match_id, spread } }) => (
          <SelectSpread
            match_id={match_id}
            sub_match_id={sub_match_id}
            spread={spread}
            successCallback={reloadSingle}
          />
        ),
        width: 50,
      },
      {
        title: 'C',
        render: ({ ArrMatch: { match_id }, ArrOE: { sub_match_id, st_open, game_type } }) => (
          <StatusOpenSubMatch
            match_id={match_id}
            sub_match_id={sub_match_id}
            st_open={st_open}
            game_type={game_type}
            successCallback={reloadSingle}
          />
        ),
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row).oe.stopen,
        }),
      },
      {
        title: 'L',
        render: ({
          ArrMatch: { match_id },
          ArrOE: { sub_match_id, st_auto_odds, show_auto_odds, game_type },
        }) => (
          <StatusFollowBookmark
            match_id={match_id}
            sub_match_id={sub_match_id}
            isChecked={st_auto_odds > 0}
            game_type={game_type}
            isDisabled={show_auto_odds !== 'Y'}
            successCallback={reloadSingle}
          />
        ),
        width: 25,
      },
      {
        title: '',
      },
    ],
    [ref, reloadSingle],
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
})
const rowKey = record => record.ArrMatch.row_id

export default TableMOOE
