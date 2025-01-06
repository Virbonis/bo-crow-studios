import React, { useMemo, useRef, useState } from 'react'
import { find, findLast, groupBy, mapValues } from 'lodash'
import {
  ButtonAcRj,
  ButtonScoreBoxLive,
  ButtonLog,
  ButtonMatch,
  ButtonMoveHandicap,
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
  SelectHandicapPoint,
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

const TableMO5 = React.forwardRef(({ viewParameter, data, reloadSingle, reloadPartai }, ref) => {
  const [selectedRow, setSelectedRow] = useState()
  const [hiddenRows, setHiddenRows] = useState([])

  const { ftht, show_hide } = viewParameter
  const isHideActived = show_hide === 2

  // filteredData = exclude match_elapsed to avoid unnecessary re-render
  const [originalData, filteredData, isAnyPaused, isFirstRow, isLastRow] = useMemo(() => {
    let newData = data.filter(
      x =>
        ftht === 'FTHT' ||
        (ftht === 'FT' && x.ArrHDP?.display_admin <= 30) ||
        (ftht === 'HT' && x.ArrHDP?.display_admin >= 30),
    )
    if (isHideActived) newData = newData.filter(x => !hiddenRows.includes(x.ArrMatch.row_id))

    const grouped = groupBy(newData, item => item.ArrMatch.match_id)
    const firstRow = mapValues(grouped, x => find(x).ArrMatch)
    const lastRow = mapValues(grouped, x => findLast(x).ArrMatch)
    return [
      newData,
      newData.map(x => {
        const { ArrMatch } = x
        // exclude match_elapsed to avoid unnecessary re-render
        const { match_elapsed, ...restArrMatch } = ArrMatch
        return { ...x, ArrMatch: restArrMatch }
      }),
      newData.some(x => x.ArrHDP?.st_pause > 0 || x.ArrOU?.st_pause > 0 || x.Arr1X2?.st_pause > 0),
      (matchId, rowID) => firstRow[matchId].row_id === rowID,
      (matchId, rowID) => lastRow[matchId].row_id === rowID,
    ]
  }, [data, ftht, isHideActived, hiddenRows])
  useAudioPause(isAnyPaused)

  const moveHandicapHDPRef = useRef()
  const moveOddsHDP1Ref = useRef()
  const moveOddsHDP2Ref = useRef()
  const moveOddsHDP3Ref = useRef()
  const moveHandicapOURef = useRef()
  const moveOddsOU1Ref = useRef()
  const moveOddsOU2Ref = useRef()
  const moveOddsOU3Ref = useRef()
  React.useImperativeHandle(ref, () => ({
    viewParameter,
    data: filteredData,
    selectedRow: originalData.find(x => x.ArrMatch.row_id === selectedRow),
    resetSelectedRow: () => setSelectedRow(),
    resetHiddenRows: () => setHiddenRows([]),
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
    return [
      {
        title: 'H',
        render: ({ ArrMatch: { row_id }, isHidden }) => (
          <CheckboxHide row_id={row_id} isHidden={isHidden} setHiddenRows={setHiddenRows} />
        ),
        width: 25,
      },
      {
        title: 'Match',
        render: ({ ArrMatch }) => <ButtonMatch {...ArrMatch} tableRef={ref} />,
        width: 75,
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
        width: 125,
        onCell: row => ({
          className: getClassTdMO(row).earlysettlement,
        }),
      },
      {
        title: 'Live',
        render: row => (
          <ButtonScoreBoxLive
            {...row.ArrMatch}
            scoreBoxClass={getClassTdMO(row).scoreBox}
            successCallback={reloadPartai}
          />
        ),
        width: 50,
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
        width: 125,
        onCell: row => ({
          className: getClassTdMO(row).earlysettlement,
        }),
      },
      // HDP
      {
        title: <SelectHandicapPoint ref={moveHandicapHDPRef} />,
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <ButtonMoveHandicap
              {...ArrMatch}
              {...ArrHDP}
              gt="HDP"
              tableRef={ref}
              successCallback={reloadSingle}
            />
          ),
        width: 50,
        onCell: () => ({
          className: 'bg-pink',
        }),
      },
      {
        title: 'HDP',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <SelectHandicap
              {...ArrMatch}
              {...ArrHDP}
              gt="HDP"
              tableRef={ref}
              successCallback={reloadSingle}
            />
          ),
        width: 75,
        onCell: row => ({
          className: getClassTdMO(row).hdp.handicap,
        }),
      },
      {
        title: 'Odds',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && <InputOdds {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} />,
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).hdp.odds,
        }),
      },
      {
        title: (
          <SelectOddsPoints
            placeholder="H/A"
            ref1={moveOddsHDP1Ref}
            ref2={moveOddsHDP2Ref}
            ref3={moveOddsHDP3Ref}
          />
        ),
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <div className="d-flex justify-content-between">
              <ButtonMoveOdds
                {...ArrMatch}
                {...ArrHDP}
                odds={ArrHDP.odds_home}
                direction="H"
                gt="HDP"
                tableRef={ref}
                successCallback={reloadPartai}
              />
              <ButtonPause {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} />
              <ButtonMoveOdds
                {...ArrMatch}
                {...ArrHDP}
                odds={ArrHDP.odds_away}
                direction="A"
                gt="HDP"
                tableRef={ref}
                successCallback={reloadPartai}
              />
            </div>
          ),
        width: 105,
        onCell: row => ({
          className: getClassTdMO(row).hdp.ha,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <ButtonSwapHandicap
              {...ArrMatch}
              {...ArrHDP}
              sameSubMatch={filteredData.filter(
                x =>
                  x.ArrMatch.match_id === ArrMatch.match_id &&
                  x.ArrMatch.display_admin.toString().length ===
                    ArrMatch.display_admin.toString().length,
              )}
              successCallback={reloadPartai}
            />
          ),
        width: 25,
      },
      {
        title: 'LOD',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && <InputLOD {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} />,
        width: 35,
      },
      {
        title: 'Stock',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP?.show_stock && <ButtonStock {...ArrMatch} {...ArrHDP} gt="HDP" />,
        width: 40,
      },
      {
        title: '%',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && <SelectSpread {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} />,
        width: 50,
      },
      {
        title: 'C',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && <StatusOpenSubMatch {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} />,
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row).hdp.stopen,
        }),
      },
      {
        title: 'P',
        render: ({ ArrMatch }) => (
          <StatusPause {...ArrMatch} tableRef={ref} successCallback={reloadPartai} />
        ),
        width: 25,
      },
      {
        title: 'IH',
        render: ({ ArrMatch }) => <StatusOpenMatch {...ArrMatch} successCallback={reloadPartai} />,
        width: 25,
      },
      // OU
      {
        title: <SelectHandicapPoint ref={moveHandicapOURef} />,
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <ButtonMoveHandicap
              {...ArrMatch}
              {...ArrOU}
              gt="OU"
              tableRef={ref}
              successCallback={reloadSingle}
            />
          ),
        width: 50,
        onCell: () => ({
          className: 'bg-pink',
        }),
      },
      {
        title: 'OU',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <SelectHandicap
              {...ArrMatch}
              {...ArrOU}
              gt="OU"
              tableRef={ref}
              successCallback={reloadSingle}
            />
          ),
        width: 75,
        onCell: row => ({
          className: getClassTdMO(row).ou.handicap,
        }),
      },
      {
        title: 'Odds',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && <InputOdds {...ArrMatch} {...ArrOU} successCallback={reloadSingle} />,
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
                {...ArrMatch}
                {...ArrOU}
                odds={ArrOU.odds_home}
                direction="O"
                gt="OU"
                tableRef={ref}
                successCallback={reloadPartai}
              />
              <ButtonPause {...ArrMatch} {...ArrOU} successCallback={reloadSingle} />
              <ButtonMoveOdds
                {...ArrMatch}
                {...ArrOU}
                odds={ArrOU.odds_away}
                direction="U"
                gt="OU"
                tableRef={ref}
                successCallback={reloadPartai}
              />
            </div>
          ),
        width: 105,
        onCell: row => ({
          className: getClassTdMO(row).ou.ha,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <ButtonSwapHandicap
              {...ArrMatch}
              {...ArrOU}
              sameSubMatch={filteredData.filter(
                x =>
                  x.ArrMatch.match_id === ArrMatch.match_id &&
                  x.ArrMatch.display_admin.toString().length ===
                    ArrMatch.display_admin.toString().length,
              )}
              successCallback={reloadPartai}
            />
          ),
        width: 25,
      },
      {
        title: 'LOD',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && <InputLOD {...ArrMatch} {...ArrOU} successCallback={reloadSingle} />,
        width: 35,
      },
      {
        title: 'Stock',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU?.show_stock && <ButtonStock {...ArrMatch} {...ArrOU} gt="OU" />,
        width: 40,
      },
      {
        title: '%',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && <SelectSpread {...ArrMatch} {...ArrOU} successCallback={reloadSingle} />,
        width: 50,
      },
      {
        title: 'C',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && <StatusOpenSubMatch {...ArrMatch} {...ArrOU} successCallback={reloadSingle} />,
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
      {
        title: '',
        render: ({ ArrMatch }) => <ButtonOtherGameType match={ArrMatch} />,
        width: 25,
      },
      // 1X2
      {
        title: '1(H) 2(A) X(D)',
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2 && (
            <div className="d-flex justify-content-between">
              <ButtonOdds1X2 {...ArrMatch} {...Arr1X2} successCallback={reloadSingle} />
              <ButtonPause {...ArrMatch} {...Arr1X2} successCallback={reloadSingle} />
            </div>
          ),
        width: 167,
      },
      {
        title: 'Margin',
        render: ({ Arr1X2 }) =>
          Arr1X2 && (
            <div>{countOddsMargin([Arr1X2.odds_home, Arr1X2.odds_away, Arr1X2.odds_draw])}</div>
          ),
        width: 45,
      },
      {
        title: 'Stock',
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2?.show_stock && <ButtonStock {...ArrMatch} {...Arr1X2} gt="1X2" />,
        width: 50,
        onCell: row => ({
          className: getClassTdMO(row)['1x2'].stock,
        }),
      },
      {
        title: 'C',
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2 && <StatusOpenSubMatch {...ArrMatch} {...Arr1X2} successCallback={reloadSingle} />,
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
            lineHDP={ArrHDP?.display_admin}
            lineOU={ArrOU?.display_admin}
            gameTypeHDP={ArrHDP?.game_type}
            gameTypeOU={ArrOU?.game_type}
          />
        ),
        width: 120,
      },
    ]
  }, [filteredData, hiddenRows, reloadPartai, reloadSingle, ref])
  const onRow = React.useCallback(
    row => {
      const {
        ArrMatch: { row_id, match_id },
      } = row
      let className = ''
      if (selectedRow === row_id) className += 'table-primary'

      const isFirst = isFirstRow(match_id, row_id) ? 'first-row' : ''
      const isLast = isLastRow(match_id, row_id) ? 'last-row' : ''
      className += ` ${isFirst} ${isLast}`
      return {
        className,
        onClick: () => setSelectedRow(row_id),
      }
    },
    [isFirstRow, isLastRow, selectedRow],
  )
  return <TableMO columns={columns} dataSource={filteredData} onRow={onRow} />
})

export default TableMO5
