import React, { useMemo, useRef, useState } from 'react'
import {
  ButtonAcRj,
  ButtonScoreBoxLive,
  ButtonLog,
  ButtonMatch,
  ButtonMoveOdds,
  ButtonMoveOddsSingle,
  ButtonOtherGameType,
  ButtonPause,
  ButtonStock,
  ButtonSwapHandicap,
  CheckboxHide,
  HomeAwayName,
  InputLOD,
  InputOdds,
  SelectHandicap,
  SelectOddsPoint,
  SelectOddsPoints,
  SelectSpread,
  StatusOpenMatch,
  StatusOpenSubMatch,
  StatusPause,
  TableMO,
} from 'pages/trading/mo-components'
import { Select } from 'antd'
import getClassTdMO from 'helper/mo'
import useAudioPause from 'pages/trading/shared-components/useAudioPause'
import usePaginationData from 'pages/trading/mo-components/usePaginationData'
import transmuteDataMO from 'pages/trading/mo-components/helper'
import { useEvent } from 'rc-util'

const TableMOOS = React.forwardRef(({ viewParameter, data, reloadSingle, reloadPartai }, ref) => {
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
  const moveOddsOERef = useRef()
  const moveOddsMLRef = useRef()
  const tableRef = useRef()
  React.useImperativeHandle(ref, () => ({
    viewParameter,
    data,
    selectedRow: data.find(x => x.ArrMatch.row_id === selectedRow),
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
    moveOddsOERef,
    moveOddsMLRef,
    reloadSingle,
    reloadPartai,
    page: 'MOOS',
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
        render: row => (
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
        width: 75,
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
      // HDP
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
        width: 112,
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
        width: 40,
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
        render: ({ ArrMatch }) => (
          <StatusPause
            match_id={ArrMatch.match_id}
            st_pause={ArrMatch.st_pause}
            tableRef={ref}
            successCallback={reloadPartai}
            frompage="MOOS"
          />
        ),
        width: 25,
      },
      {
        title: 'IH',
        render: ({ ArrMatch }) => (
          <StatusOpenMatch
            match_id={ArrMatch.match_id}
            st_open={ArrMatch.st_open}
            successCallback={reloadPartai}
            frompage="MOOS"
          />
        ),
        width: 25,
      },
      // OU
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
        width: 112,
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
        width: 40,
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
        render: ({ ArrMatch }) =>
          ArrMatch.st_live !== 'N' && (
            <ButtonAcRj
              match_id={ArrMatch.match_id}
              title={`${ArrMatch.match_id} - ${ArrMatch.home_name} - ${ArrMatch.away_name}`}
            />
          ),
        width: 40,
      },
      // OE
      {
        title: 'Odds',
        render: ({ ArrMatch, ArrOE }) =>
          ArrOE && <InputOdds {...ArrMatch} {...ArrOE} successCallback={reloadSingle} />,
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).oe.odds,
        }),
      },
      {
        title: (
          <Select
            className="w-100"
            placeholder="OE"
            dropdownRender={() => <SelectOddsPoint ref={moveOddsOERef} />}
          />
        ),
        render: ({ ArrMatch, ArrOE }) =>
          ArrOE && (
            <div className="d-flex justify-content-between">
              <ButtonMoveOddsSingle
                {...ArrMatch}
                {...ArrOE}
                odds={ArrOE.odds_home}
                direction="O"
                gt="OE"
                tableRef={ref}
                successCallback={reloadPartai}
              />
              <ButtonPause {...ArrMatch} {...ArrOE} successCallback={reloadSingle} />
              <ButtonMoveOddsSingle
                {...ArrMatch}
                {...ArrOE}
                odds={ArrOE.odds_away}
                direction="E"
                gt="OE"
                tableRef={ref}
                successCallback={reloadPartai}
              />
            </div>
          ),
        width: 112,
        onCell: row => ({
          className: getClassTdMO(row).oe.ha,
        }),
      },
      {
        title: 'Stock',
        render: ({ ArrMatch, ArrOE }) =>
          ArrOE?.show_stock && <ButtonStock {...ArrMatch} {...ArrOE} gt="OE" />,
        width: 40,
      },
      {
        title: '%',
        render: ({ ArrMatch, ArrOE }) =>
          ArrOE && <SelectSpread {...ArrMatch} {...ArrOE} successCallback={reloadSingle} />,
        width: 35,
      },
      {
        title: 'C',
        render: ({ ArrMatch, ArrOE }) =>
          ArrOE && <StatusOpenSubMatch {...ArrMatch} {...ArrOE} successCallback={reloadSingle} />,
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row).oe.stopen,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch }) => <ButtonOtherGameType match={ArrMatch} />,
        width: 25,
      },
      // ML
      {
        title: 'Odds',
        render: ({ ArrMatch, ArrML }) =>
          ArrML && <InputOdds {...ArrMatch} {...ArrML} successCallback={reloadSingle} />,
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).ml.odds,
        }),
      },
      {
        title: (
          <Select
            className="w-100"
            placeholder="ML"
            dropdownRender={() => <SelectOddsPoint ref={moveOddsMLRef} />}
          />
        ),
        render: ({ ArrMatch, ArrML }) =>
          ArrML && (
            <div className="d-flex justify-content-between">
              <ButtonMoveOddsSingle
                {...ArrMatch}
                {...ArrML}
                odds={ArrML.odds_home}
                direction="HML"
                gt="ML"
                tableRef={ref}
                successCallback={reloadPartai}
              />
              <ButtonPause {...ArrMatch} {...ArrML} successCallback={reloadSingle} />
              <ButtonMoveOddsSingle
                {...ArrMatch}
                {...ArrML}
                odds={ArrML.odds_away}
                direction="AML"
                gt="ML"
                tableRef={ref}
                successCallback={reloadPartai}
              />
            </div>
          ),
        width: 112,
        onCell: row => ({
          className: getClassTdMO(row).ml.ha,
        }),
      },
      {
        title: 'Stock',
        render: ({ ArrMatch, ArrML }) =>
          ArrML?.show_stock && <ButtonStock {...ArrMatch} {...ArrML} gt="ML" />,
        width: 40,
      },
      {
        title: '%',
        render: ({ ArrMatch, ArrML }) =>
          ArrML && <SelectSpread {...ArrMatch} {...ArrML} successCallback={reloadSingle} />,
        width: 35,
      },
      {
        title: 'C',
        render: ({ ArrMatch, ArrML }) =>
          ArrML && <StatusOpenSubMatch {...ArrMatch} {...ArrML} successCallback={reloadSingle} />,
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row).ml.stopen,
        }),
      },
      {
        title: 'LOG',
        render: ({ ArrMatch, ArrHDP, ArrOU }) => (
          <ButtonLog
            {...ArrMatch}
            lineHDP={ArrHDP?.display_admin}
            lineOU={ArrOU?.display_admin}
            gameTypeHDP={ArrHDP?.game_type}
            gameTypeOU={ArrOU?.game_type}
          />
        ),
        width: 120,
      },
    ],
    [ref, reloadSingle, reloadPartai],
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

const rowKey = row => row.ArrMatch.row_id

export default TableMOOS
