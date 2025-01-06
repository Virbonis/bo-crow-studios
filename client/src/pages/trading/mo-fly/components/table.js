import React, { useMemo, useRef, useState } from 'react'
import {
  ButtonAcRj,
  ButtonScoreBoxLive,
  ButtonLog,
  ButtonMatch,
  ButtonMoveOdds,
  ButtonOdds1X2,
  ButtonOtherGameType,
  ButtonPause,
  ButtonStock,
  ButtonSwapHandicap,
  CheckboxHide,
  HomeAwayName,
  InputLOD,
  InputOdds,
  SelectHandicap,
  SelectOddsPoints,
  SelectSpread,
  StatusOpenMatch,
  StatusOpenSubMatch,
  StatusPause,
  TableMO,
} from 'pages/trading/mo-components'
import getClassTdMO from 'helper/mo'
import { countOddsMargin } from 'helper'
import useAudioPause from 'pages/trading/shared-components/useAudioPause'
import usePaginationData from 'pages/trading/mo-components/usePaginationData'
import transmuteDataMO from 'pages/trading/mo-components/helper'
import { useEvent } from 'rc-util'

const TableMO5 = React.forwardRef(({ viewParameter, data, reloadSingle, reloadPartai }, ref) => {
  const [selectedRow, setSelectedRow] = useState()
  const [hiddenRows, setHiddenRows] = useState([])

  const { show_hide } = viewParameter
  const isHideActived = show_hide === 2

  // filteredData = exclude match_elapsed to avoid unnecessary re-render
  const [filteredData, isAnyPaused] = useMemo(() => {
    let newData = data.map(x => {
      const { ArrMatch } = x
      // exclude match_elapsed to avoid unnecessary re-render
      const { match_elapsed, ...restArrMatch } = ArrMatch
      return { ...x, ArrMatch: restArrMatch }
    })
    newData = transmuteDataMO(newData, viewParameter.ftht, hiddenRows, isHideActived)
    return [
      newData,
      newData.some(x => x.ArrHDP?.st_pause > 0 || x.ArrOU?.st_pause > 0 || x.Arr1X2?.st_pause > 0),
    ]
  }, [data, isHideActived, hiddenRows, viewParameter.ftht])
  useAudioPause(isAnyPaused)

  const [paginatedData, lastRowElementRef, resetPageNumber] = usePaginationData(
    filteredData,
    filteredData.length,
    5,
  )

  const moveHandicapHDPRef = useRef()
  const moveOddsHDP1Ref = useRef()
  const moveOddsHDP2Ref = useRef()
  const moveOddsHDP3Ref = useRef()
  const moveHandicapOURef = useRef()
  const moveOddsOU1Ref = useRef()
  const moveOddsOU2Ref = useRef()
  const moveOddsOU3Ref = useRef()
  const tableRef = useRef()

  React.useImperativeHandle(ref, () => ({
    viewParameter,
    data,
    selectedRow: data.find(x => x.ArrMatch.row_id === selectedRow),
    hiddenRows,
    resetSelectedRow: () => setSelectedRow(),
    resetHiddenRows: () => setHiddenRows([]),
    resetPageNumber: () => resetPageNumber(),
    scrollToTop: () => tableRef.current.scrollTo(0, 0),
    moveHandicapHDPRef,
    moveOddsHDP1Ref,
    moveOddsHDP2Ref,
    moveOddsHDP3Ref,
    moveHandicapOURef,
    moveOddsOU1Ref,
    moveOddsOU2Ref,
    moveOddsOU3Ref,
    reloadSingle,
    reloadPartai,
    page: 'MO5',
  }))
  const columns = React.useMemo(() => {
    const onHideAll = e => {
      const { checked } = e.target
      const rowIDs = ref.current.data.map(v => v.ArrMatch.row_id)
      if (checked) setHiddenRows(rowIDs)
      else setHiddenRows([])
    }
    return [
      {
        title: <input type="checkbox" onChange={onHideAll} />,
        render: ({ ArrMatch: { row_id }, isHidden }) => (
          <CheckboxHide row_id={row_id} isHidden={isHidden} setHiddenRows={setHiddenRows} />
        ),
        width: 25,
      },
      {
        title: 'Match',
        render: ({ ArrMatch }) => <ButtonMatch {...ArrMatch} page={ref.current.page} />,
        width: 65,
      },
      {
        title: 'Home',
        render: ({ ArrMatch, ArrHDP }) => (
          <HomeAwayName
            {...ArrMatch}
            {...ArrHDP}
            name={ArrMatch.home_name}
            direction="H"
            tableRef={ref}
            successCallback={reloadSingle}
          />
        ),
        width: 100,
        onCell: row => ({
          className: getClassTdMO(row).earlysettlement,
        }),
      },
      {
        title: 'Live',
        render: row =>
          row.isFirst && (
            <ButtonScoreBoxLive
              match_round={row.ArrMatch.match_round}
              display_admin={row.ArrMatch.display_admin}
              st_live={row.ArrMatch.st_live}
              home_posisi={row.ArrMatch.home_posisi}
              away_posisi={row.ArrMatch.away_posisi}
              elapsed_live={row.ArrMatch.elapsed_live}
              match_id={row.ArrMatch.match_id}
              home_rc={row.ArrMatch.home_rc}
              away_rc={row.ArrMatch.away_rc}
              home_yc={row.ArrMatch.home_yc}
              away_yc={row.ArrMatch.away_yc}
              st_penalty={row.ArrMatch.st_penalty}
              scoreBoxClass={getClassTdMO(row).scoreBox}
              successCallback={reloadPartai}
            />
          ),
        width: 50,
        onCell: row => ({
          rowSpan: row.isFirst ? row.sameMatchLength : 0,
        }),
      },
      {
        title: 'Away',
        render: ({ ArrMatch, ArrHDP }) => (
          <HomeAwayName
            {...ArrMatch}
            {...ArrHDP}
            name={ArrMatch.away_name}
            direction="A"
            tableRef={ref}
            successCallback={reloadSingle}
          />
        ),
        width: 100,
        onCell: row => ({
          className: getClassTdMO(row).earlysettlement,
        }),
      },
      {
        title: 'HDP',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <SelectHandicap
              match_id={ArrMatch.match_id}
              total_score={ArrMatch.total_score}
              sub_match_id={ArrHDP.sub_match_id}
              handicap={ArrHDP.handicap}
              gt="HDP"
              tableRef={ref}
              successCallback={reloadSingle}
            />
          ),
        width: 65,
        onCell: row => ({
          className: getClassTdMO(row).hdp.handicap,
        }),
      },
      {
        title: 'Odds',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <InputOdds
              match_id={ArrMatch.match_id}
              sub_match_id={ArrHDP.sub_match_id}
              odds={ArrHDP.odds}
              game_type={ArrHDP.game_type}
              successCallback={reloadSingle}
            />
          ),
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).hdp.odds,
        }),
      },
      {
        title: (
          <SelectOddsPoints
            placeholder="AH"
            ref1={moveOddsHDP1Ref}
            ref2={moveOddsHDP2Ref}
            ref3={moveOddsHDP3Ref}
          />
        ),
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <div className="d-flex justify-content-between">
              <ButtonMoveOdds
                match_id={ArrMatch.match_id}
                display_admin={ArrMatch.display_admin}
                sub_match_id={ArrHDP.sub_match_id}
                odds={ArrHDP.odds_home}
                game_type={ArrHDP.game_type}
                direction="H"
                gt="HDP"
                tableRef={ref}
                successCallback={reloadPartai}
              />
              <ButtonPause
                match_id={ArrMatch.match_id}
                st_pause={ArrHDP.st_pause}
                sub_match_id={ArrHDP.sub_match_id}
                game_type={ArrHDP.game_type}
                successCallback={reloadSingle}
              />
              <ButtonMoveOdds
                match_id={ArrMatch.match_id}
                display_admin={ArrMatch.display_admin}
                sub_match_id={ArrHDP.sub_match_id}
                odds={ArrHDP.odds_away}
                game_type={ArrHDP.game_type}
                direction="A"
                gt="HDP"
                tableRef={ref}
                successCallback={reloadPartai}
              />
            </div>
          ),
        width: 100,
        onCell: row => ({
          className: getClassTdMO(row).hdp.ha,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch, ArrHDP, sameSubMatch }) =>
          ArrHDP && (
            <ButtonSwapHandicap
              match_id={ArrMatch.match_id}
              display_admin={ArrMatch.display_admin}
              sub_match_id={ArrHDP.sub_match_id}
              game_type={ArrHDP.game_type}
              sameSubMatch={sameSubMatch}
              successCallback={reloadPartai}
              tableRef={ref}
            />
          ),
        width: 20,
      },
      {
        title: 'LOD',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <InputLOD
              match_id={ArrMatch.match_id}
              sub_match_id={ArrHDP.sub_match_id}
              link_odds_diff={ArrHDP.link_odds_diff}
              successCallback={reloadSingle}
            />
          ),
        width: 35,
      },
      {
        title: 'Stock',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP?.show_stock && (
            <ButtonStock
              {...ArrMatch}
              match_id={ArrMatch.match_id}
              sub_match_id={ArrHDP.sub_match_id}
              game_type={ArrHDP.game_type}
              stock={ArrHDP.stock}
              gt="HDP"
            />
          ),
        width: 50,
      },
      {
        title: '%',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <SelectSpread
              match_id={ArrMatch.match_id}
              sub_match_id={ArrHDP.sub_match_id}
              spread={ArrHDP.spread}
              tableRef={ref}
              successCallback={reloadSingle}
            />
          ),
        width: 35,
      },
      {
        title: 'C',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <StatusOpenSubMatch
              match_id={ArrMatch.match_id}
              st_open={ArrHDP.st_open}
              sub_match_id={ArrHDP.sub_match_id}
              game_type={ArrHDP.game_type}
              successCallback={reloadSingle}
            />
          ),
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row).hdp.stopen,
        }),
      },
      {
        title: 'P',
        render: ({ ArrMatch, isFirst }) =>
          isFirst && (
            <StatusPause
              match_id={ArrMatch.match_id}
              st_pause={ArrMatch.st_pause}
              tableRef={ref}
              successCallback={reloadPartai}
            />
          ),
        width: 25,
        onCell: row => ({
          rowSpan: row.isFirst ? row.sameMatchLength : 0,
        }),
      },
      {
        title: 'IH',
        render: ({ ArrMatch, isFirst }) =>
          isFirst && (
            <StatusOpenMatch
              match_id={ArrMatch.match_id}
              st_open={ArrMatch.st_open}
              successCallback={reloadPartai}
            />
          ),
        width: 25,
        onCell: row => ({
          rowSpan: row.isFirst ? row.sameMatchLength : 0,
        }),
      },
      {
        title: 'OU',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <SelectHandicap
              match_id={ArrMatch.match_id}
              total_score={ArrMatch.total_score}
              sub_match_id={ArrOU.sub_match_id}
              handicap={ArrOU.handicap}
              gt="OU"
              tableRef={ref}
              successCallback={reloadSingle}
            />
          ),
        width: 65,
        onCell: row => ({
          className: getClassTdMO(row).ou.handicap,
        }),
      },
      {
        title: 'Odds',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <InputOdds
              match_id={ArrMatch.match_id}
              sub_match_id={ArrOU.sub_match_id}
              odds={ArrOU.odds}
              game_type={ArrOU.game_type}
              successCallback={reloadSingle}
              tableRef={ref}
            />
          ),
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).ou.odds,
        }),
      },
      {
        title: (
          <SelectOddsPoints
            placeholder="OU"
            ref1={moveOddsOU1Ref}
            ref2={moveOddsOU2Ref}
            ref3={moveOddsOU3Ref}
          />
        ),
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <div className="d-flex justify-content-between">
              <ButtonMoveOdds
                match_id={ArrMatch.match_id}
                display_admin={ArrMatch.display_admin}
                sub_match_id={ArrOU.sub_match_id}
                odds={ArrOU.odds_home}
                game_type={ArrOU.game_type}
                direction="O"
                gt="OU"
                tableRef={ref}
                successCallback={reloadPartai}
              />
              <ButtonPause
                match_id={ArrMatch.match_id}
                st_pause={ArrOU.st_pause}
                sub_match_id={ArrOU.sub_match_id}
                game_type={ArrOU.game_type}
                successCallback={reloadSingle}
                tableRef={ref}
              />
              <ButtonMoveOdds
                match_id={ArrMatch.match_id}
                display_admin={ArrMatch.display_admin}
                sub_match_id={ArrOU.sub_match_id}
                odds={ArrOU.odds_away}
                game_type={ArrOU.game_type}
                direction="U"
                gt="OU"
                tableRef={ref}
                successCallback={reloadPartai}
              />
            </div>
          ),
        width: 100,
        onCell: row => ({
          className: getClassTdMO(row).ou.ha,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch, ArrOU, sameSubMatch }) =>
          ArrOU && (
            <ButtonSwapHandicap
              match_id={ArrMatch.match_id}
              display_admin={ArrMatch.display_admin}
              sub_match_id={ArrOU.sub_match_id}
              game_type={ArrOU.game_type}
              sameSubMatch={sameSubMatch}
              successCallback={reloadPartai}
              tableRef={ref}
            />
          ),
        width: 20,
      },
      {
        title: 'LOD',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <InputLOD
              match_id={ArrMatch.match_id}
              sub_match_id={ArrOU.sub_match_id}
              link_odds_diff={ArrOU.link_odds_diff}
              successCallback={reloadSingle}
              tableRef={ref}
            />
          ),
        width: 35,
      },
      {
        title: 'Stock',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU?.show_stock && (
            <ButtonStock
              {...ArrMatch}
              match_id={ArrMatch.match_id}
              sub_match_id={ArrOU.sub_match_id}
              game_type={ArrOU.game_type}
              stock={ArrOU.stock}
              gt="OU"
              tableRef={ref}
            />
          ),
        width: 50,
      },
      {
        title: '%',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <SelectSpread
              match_id={ArrMatch.match_id}
              sub_match_id={ArrOU.sub_match_id}
              spread={ArrOU.spread}
              successCallback={reloadSingle}
              tableRef={ref}
            />
          ),
        width: 35,
      },
      {
        title: 'C',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <StatusOpenSubMatch
              match_id={ArrMatch.match_id}
              st_open={ArrOU.st_open}
              sub_match_id={ArrOU.sub_match_id}
              game_type={ArrOU.game_type}
              successCallback={reloadSingle}
              tableRef={ref}
            />
          ),
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row).ou.stopen,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch, isFirst }) =>
          isFirst &&
          ArrMatch.st_live !== 'N' && (
            <ButtonAcRj
              match_id={ArrMatch.match_id}
              title={`${ArrMatch.match_id} - ${ArrMatch.home_name} - ${ArrMatch.away_name}`}
            />
          ),
        width: 40,
        onCell: row => ({
          rowSpan: row.isFirst ? row.sameMatchLength : 0,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch, isFirst }) => {
          return isFirst && <ButtonOtherGameType match={ArrMatch} />
        },
        width: 25,
        onCell: row => ({
          rowSpan: row.isFirst ? row.sameMatchLength : 0,
        }),
      },
      // 1X2
      {
        title: '1(H) 2(A) X(D)',
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2 && (
            <div className="d-flex justify-content-between">
              <ButtonOdds1X2
                match_id={ArrMatch.match_id}
                sub_match_id={Arr1X2.sub_match_id}
                odds_home={Arr1X2.odds_home}
                odds_away={Arr1X2.odds_away}
                odds_draw={Arr1X2.odds_draw}
                last_change_odds_home={Arr1X2.last_change_odds_home}
                last_change_odds_away={Arr1X2.last_change_odds_away}
                last_change_odds_draw={Arr1X2.last_change_odds_draw}
                alert_trader_odds_home={Arr1X2.alert_trader_odds_home}
                alert_trader_odds_away={Arr1X2.alert_trader_odds_away}
                alert_trader_odds_draw={Arr1X2.alert_trader_odds_draw}
                spread={Arr1X2.spread}
                profile={Arr1X2.profile}
                st_auto_calc_odds={Arr1X2.st_auto_calc_odds}
                lock_shift={Arr1X2.lock_shift}
                successCallback={reloadSingle}
              />
              <ButtonPause
                match_id={ArrMatch.match_id}
                st_pause={Arr1X2.st_pause}
                sub_match_id={Arr1X2.sub_match_id}
                game_type={Arr1X2.game_type}
                successCallback={reloadSingle}
              />
            </div>
          ),
        width: 125,
      },
      {
        title: 'Margin',
        render: ({ Arr1X2 }) =>
          Arr1X2 && (
            <div className="font-weight-bold">
              {countOddsMargin([Arr1X2.odds_home, Arr1X2.odds_away, Arr1X2.odds_draw])}
            </div>
          ),
        width: 45,
      },
      {
        title: 'Stock',
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2?.show_stock && (
            <ButtonStock
              {...ArrMatch}
              match_id={ArrMatch.match_id}
              sub_match_id={Arr1X2.sub_match_id}
              game_type={Arr1X2.game_type}
              stock={Arr1X2.stock}
              gt="1X2"
              tableRef={ref}
            />
          ),
        width: 50,
        onCell: row => ({
          className: getClassTdMO(row)['1x2'].stock,
        }),
      },
      {
        title: 'C',
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2 && (
            <StatusOpenSubMatch
              match_id={ArrMatch.match_id}
              st_open={Arr1X2.st_open}
              sub_match_id={Arr1X2.sub_match_id}
              game_type={Arr1X2.game_type}
              successCallback={reloadSingle}
              tableRef={ref}
            />
          ),
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row)['1x2'].stopen,
        }),
      },
      {
        title: 'LOG',
        render: ({ ArrMatch, ArrHDP, ArrOU }) => (
          <ButtonLog
            {...ArrMatch}
            match_id={ArrMatch.match_id}
            lineHDP={ArrHDP?.display_admin}
            lineOU={ArrOU?.display_admin}
            gameTypeHDP={ArrHDP?.game_type}
            gameTypeOU={ArrOU?.game_type}
          />
        ),
        width: 100,
      },
    ]
  }, [ref, reloadSingle, reloadPartai])

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
      bordered
      pagination={false}
      columns={columns}
      dataSource={paginatedData}
      onRow={onRow}
      lastRowElementRef={lastRowElementRef}
    />
  )
})
const rowKey = record => record.ArrMatch.row_id

export default React.memo(TableMO5)
