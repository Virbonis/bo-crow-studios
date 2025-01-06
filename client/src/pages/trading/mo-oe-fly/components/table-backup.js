import React, { useMemo, useRef, useState } from 'react'
import { Typography } from 'antd'
import { find, findLast, groupBy, mapValues } from 'lodash'
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
} from 'pages/trading/mo-components'
import getClassTdMO, { getShortPause } from 'helper/mo'
import useAudioPause from 'pages/trading/shared-components/useAudioPause'

const TableMOOE = React.forwardRef(({ viewParameter, data, reloadSingle, reloadPartai }, ref) => {
  const [selectedRow, setSelectedRow] = useState()
  const [hiddenRows, setHiddenRows] = useState([])

  const { show_hide } = viewParameter
  const isHideActived = show_hide === 2
  const [filteredData, isAnyPaused, isFirstRow, isLastRow, PMaxBet, PLap, PVIP3] = useMemo(() => {
    let newData = data
    if (isHideActived) newData = newData.filter(x => !hiddenRows.includes(x.ArrMatch.row_id))

    const grouped = groupBy(newData, item => item.ArrMatch.match_id)
    const firstRow = mapValues(grouped, x => find(x).ArrMatch)
    const lastRow = mapValues(grouped, x => findLast(x).ArrMatch)
    return [
      newData,
      newData.some(x => x.ArrOE?.st_pause > 0),
      (matchId, rowID) => firstRow[matchId].row_id === rowID,
      (matchId, rowID) => lastRow[matchId].row_id === rowID,
      newData.filter(x => getShortPause(x.ArrOE?.reason_pause) === 'maxbet').length,
      newData.filter(x => getShortPause(x.ArrOE?.reason_pause) === 'lap').length,
      newData.filter(x => getShortPause(x.ArrOE?.reason_pause) === 'vip3').length,
    ]
  }, [data, isHideActived, hiddenRows])
  useAudioPause(isAnyPaused, PMaxBet, PLap, PVIP3)

  const moveOddsOERef = useRef()
  React.useImperativeHandle(ref, () => ({
    viewParameter,
    data: filteredData,
    selectedRow: filteredData.find(x => x.ArrMatch.row_id === selectedRow),
    resetSelectedRow: () => setSelectedRow(),
    resetHiddenRows: () => setHiddenRows([]),
    moveOddsOERef,
    reloadSingle,
    reloadPartai,
    page: 'MOOE',
    PMaxBet,
    PLap,
    PVIP3,
    setSelectBookmark: bookmark => {
      const pausedRows = filteredData.filter(x => getShortPause(x.ArrOE?.reason_pause) === bookmark)
      if (pausedRows.length === 0) return
      let selected
      if (pausedRows.length > 1) {
        const index = pausedRows.findIndex(x => x.ArrMatch.row_id === selectedRow)
        selected = pausedRows[index + 1]
      }
      selected = selected || pausedRows[0]

      setSelectedRow(selected.ArrMatch.row_id)
      const index = filteredData.indexOf(selected)
      document
        .getElementById('dvDetail')
        .getElementsByTagName('tr')
        [index].scrollIntoView()
    },
  }))

  const columns = [
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
        <ButtonMatch {...ArrMatch} game_type={game_type} tableRef={ref} />
      ),
      width: 75,
    },
    {
      title: 'Home',
      render: ({ ArrMatch: { home_name } }) => (
        <Typography.Text ellipsis className="text-blue">
          {home_name}
        </Typography.Text>
      ),
      width: 200,
      onCell: ({ ArrOE: { st_auto_odds } }) => ({
        className: st_auto_odds > 0 ? 'bg-lime' : 'bg-orange',
      }),
    },
    {
      title: 'Away',
      render: ({ ArrMatch: { away_name } }) => (
        <Typography.Text ellipsis className="text-blue">
          {away_name}
        </Typography.Text>
      ),
      width: 200,
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
      title: <SelectOddsPoint placeholder="OE" ref={moveOddsOERef} />,
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
            successCallback={reloadPartai}
            enabled={st_auto_odds === 0}
          />
          <ButtonPause
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
            successCallback={reloadPartai}
            enabled={st_auto_odds === 0}
          />
        </div>
      ),
      width: 105,
      onCell: row => ({
        className: getClassTdMO(row).oe.ha,
      }),
    },
    {
      title: 'Stock',
      render: ({ ArrMatch: { match_id }, ArrOE: { sub_match_id, stock, show_stock } }) =>
        show_stock && (
          <ButtonStock stock={stock} match_id={match_id} sub_match_id={sub_match_id} gt="OE" />
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
  ]
  const onRow = row => {
    const {
      ArrMatch: { row_id, match_id },
    } = row
    const isFirst = isFirstRow(match_id, row_id) ? 'first-row' : ''
    const isLast = isLastRow(match_id, row_id) ? 'last-row' : ''
    const borderClass = `${isFirst} ${isLast}`
    return {
      className: selectedRow === row_id ? 'table-primary' : borderClass,
      onClick: () => setSelectedRow(row_id),
    }
  }
  return <TableMO columns={columns} dataSource={filteredData} onRow={onRow} />
})

export default TableMOOE
