import React, { useMemo, useRef, useState } from 'react'
import { find, findLast, groupBy, mapValues } from 'lodash'
import {
  ButtonAcRj,
  ButtonScoreBoxLive,
  ButtonLog,
  ButtonMatch,
  ButtonMoveHandicap,
  ButtonMoveOdds,
  ButtonMoveOddsSingle,
  ButtonPause,
  ButtonStock,
  ButtonSwapHandicap,
  CheckboxHide,
  HomeAwayName,
  InputLOD,
  InputOdds,
  SelectHandicap,
  SelectHandicapPoint,
  SelectOddsPoint,
  SelectOddsPoints,
  SelectSpread,
  StatusOpenMatch,
  StatusOpenSubMatch,
  StatusPause,
  TableMO,
} from 'pages/trading/mo-components'
import getClassTdMO from 'helper/mo'
import useAudioPause from 'pages/trading/shared-components/useAudioPause'
import ButtonAddAutoSubMatchMore from '../../shared-components/add-auto-sub-match-more-button'

const TableMOTennis = React.forwardRef(
  ({ viewParameter, data, reloadSingle, reloadPartai }, ref) => {
    const [selectedRow, setSelectedRow] = useState()
    const [hiddenRows, setHiddenRows] = useState([])

    const { ftht, show_hide } = viewParameter
    const isHideActived = show_hide === 2
    const [filteredData, isAnyPaused, isFirstRow, isLastRow] = useMemo(() => {
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
        newData.some(
          x =>
            x.ArrHDP?.st_pause > 0 ||
            x.ArrOU?.st_pause > 0 ||
            x.ArrGAH?.st_pause > 0 ||
            x.ArrML?.st_pause > 0 ||
            x.ArrOE?.st_pause > 0,
        ),
        (matchId, rowID) => firstRow[matchId].row_id === rowID,
        (matchId, rowID) => lastRow[matchId].row_id === rowID,
      ]
    }, [data, ftht, isHideActived, hiddenRows])
    useAudioPause(isAnyPaused)

    const moveHandicapHDPRef = useRef()
    const moveOddsHDP1Ref = useRef()
    const moveOddsHDP2Ref = useRef()
    const moveOddsHDP3Ref = useRef()
    const moveHandicapGAHRef = useRef()
    const moveOddsGAH1Ref = useRef()
    const moveOddsGAH2Ref = useRef()
    const moveOddsGAH3Ref = useRef()
    const moveHandicapOURef = useRef()
    const moveOddsOU1Ref = useRef()
    const moveOddsOU2Ref = useRef()
    const moveOddsOU3Ref = useRef()
    const moveOddsMLRef = useRef()
    const moveOddsOERef = useRef()

    React.useImperativeHandle(ref, () => ({
      viewParameter,
      data: filteredData,
      selectedRow: filteredData.find(x => x.ArrMatch.row_id === selectedRow),
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
      moveHandicapGAHRef,
      moveOddsGAH1Ref,
      moveOddsGAH2Ref,
      moveOddsGAH3Ref,
      moveOddsMLRef,
      moveOddsOERef,
      reloadSingle,
      reloadPartai,
      page: 'MOTennis',
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
            textOnly
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
            textOnly
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
            textOnly
          />
        ),
        width: 125,
        onCell: row => ({
          className: getClassTdMO(row).earlysettlement,
        }),
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
        title: <SelectOddsPoint placeholder="ML" ref={moveOddsMLRef} />,
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
        width: 105,
        onCell: row => ({
          className: getClassTdMO(row).ml.ha,
        }),
      },
      {
        title: 'LOD',
        render: ({ ArrMatch, ArrML }) =>
          ArrML && <InputLOD {...ArrMatch} {...ArrML} successCallback={reloadSingle} />,
        width: 35,
      },
      {
        title: '%',
        render: ({ ArrMatch, ArrML }) =>
          ArrML && <SelectSpread {...ArrMatch} {...ArrML} successCallback={reloadSingle} />,
        width: 50,
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
            <div className="d-flex gap-0">
              <HomeAwayName
                {...ArrMatch}
                {...ArrHDP}
                name=""
                direction="H"
                tableRef={ref}
                successCallback={reloadSingle}
                style={{ flex: 1 }}
              />
              <SelectHandicap
                {...ArrMatch}
                {...ArrHDP}
                gt="HDP"
                tableRef={ref}
                successCallback={reloadSingle}
              />
              <HomeAwayName
                {...ArrMatch}
                {...ArrHDP}
                name=""
                direction="A"
                tableRef={ref}
                successCallback={reloadSingle}
                style={{ flex: 1 }}
              />
            </div>
          ),
        width: 150,
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
      // GAH
      {
        title: <SelectHandicapPoint ref={moveHandicapGAHRef} />,
        render: ({ ArrMatch, ArrGAH }) =>
          ArrGAH && (
            <ButtonMoveHandicap
              {...ArrMatch}
              {...ArrGAH}
              gt="GAH"
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
        title: 'G.AH',
        render: ({ ArrMatch, ArrGAH }) =>
          ArrGAH && (
            <div className="d-flex gap-0">
              <HomeAwayName
                {...ArrMatch}
                {...ArrGAH}
                name=""
                direction="H"
                tableRef={ref}
                successCallback={reloadSingle}
                style={{ flex: 1 }}
              />
              <SelectHandicap
                {...ArrMatch}
                {...ArrGAH}
                gt="GAH"
                tableRef={ref}
                successCallback={reloadSingle}
              />
              <HomeAwayName
                {...ArrMatch}
                {...ArrGAH}
                name=""
                direction="A"
                tableRef={ref}
                successCallback={reloadSingle}
                style={{ flex: 1 }}
              />
            </div>
          ),
        width: 150,
        onCell: row => ({
          className: getClassTdMO(row).gah.handicap,
        }),
      },
      {
        title: 'Odds',
        render: ({ ArrMatch, ArrGAH }) =>
          ArrGAH && <InputOdds {...ArrMatch} {...ArrGAH} successCallback={reloadSingle} />,
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).gah.odds,
        }),
      },
      {
        title: (
          <SelectOddsPoints
            placeholder="H/A"
            ref1={moveOddsGAH1Ref}
            ref2={moveOddsGAH2Ref}
            ref3={moveOddsGAH3Ref}
          />
        ),
        render: ({ ArrMatch, ArrGAH }) =>
          ArrGAH && (
            <div className="d-flex justify-content-between">
              <ButtonMoveOdds
                {...ArrMatch}
                {...ArrGAH}
                odds={ArrGAH.odds_home}
                direction="H"
                gt="GAH"
                tableRef={ref}
                successCallback={reloadPartai}
              />
              <ButtonPause {...ArrMatch} {...ArrGAH} successCallback={reloadSingle} />
              <ButtonMoveOdds
                {...ArrMatch}
                {...ArrGAH}
                odds={ArrGAH.odds_away}
                direction="A"
                gt="GAH"
                tableRef={ref}
                successCallback={reloadPartai}
              />
            </div>
          ),
        width: 105,
        onCell: row => ({
          className: getClassTdMO(row).gah.ha,
        }),
      },
      {
        title: '',
        render: ({ ArrMatch, ArrGAH }) =>
          ArrGAH && (
            <ButtonSwapHandicap
              {...ArrMatch}
              {...ArrGAH}
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
        render: ({ ArrMatch, ArrGAH }) =>
          ArrGAH && <InputLOD {...ArrMatch} {...ArrGAH} successCallback={reloadSingle} />,
        width: 35,
      },
      {
        title: '%',
        render: ({ ArrMatch, ArrGAH }) =>
          ArrGAH && <SelectSpread {...ArrMatch} {...ArrGAH} successCallback={reloadSingle} />,
        width: 50,
      },
      {
        title: 'C',
        render: ({ ArrMatch, ArrGAH }) =>
          ArrGAH && <StatusOpenSubMatch {...ArrMatch} {...ArrGAH} successCallback={reloadSingle} />,
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row).gah.stopen,
        }),
      },
      {
        title: 'P',
        render: ({ ArrMatch }) => (
          <StatusPause
            {...ArrMatch}
            tableRef={ref}
            successCallback={reloadPartai}
            frompage="motennis"
          />
        ),
        width: 25,
      },
      {
        title: 'IH',
        render: ({ ArrMatch }) => (
          <StatusOpenMatch {...ArrMatch} successCallback={reloadPartai} frompage="motennis" />
        ),
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
        title: 'G.OU',
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
        title: <SelectOddsPoint placeholder="OE" ref={moveOddsOERef} />,
        render: ({ ArrMatch, ArrOE }) =>
          ArrOE && (
            <div className="d-flex justify-content-between">
              <ButtonMoveOdds
                {...ArrMatch}
                {...ArrOE}
                odds={ArrOE.odds_home}
                direction="O"
                gt="OE"
                tableRef={ref}
                successCallback={reloadPartai}
              />
              <ButtonPause {...ArrMatch} {...ArrOE} successCallback={reloadSingle} />
              <ButtonMoveOdds
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
        width: 105,
        onCell: row => ({
          className: getClassTdMO(row).oe.ha,
        }),
      },
      {
        title: 'Stock',
        render: ({ ArrMatch, ArrML, ArrHDP, ArrGAH, ArrOU, ArrOE }) =>
          (ArrML?.show_stock ||
            ArrHDP?.show_stock ||
            ArrGAH?.show_stock ||
            ArrOU?.show_stock ||
            ArrOE?.show_stock) && (
            <ButtonStock
              // match_id, sub_match_id, gt, game_type, choice_code
              {...ArrMatch}
              stock={ArrML?.stock + ArrHDP?.stock + ArrGAH?.stock + ArrOU?.stock + ArrOE?.stock}
              sub_match_id={-1}
              gt="tennis"
            />
          ),
        width: 50,
      },
      {
        title: '%',
        render: ({ ArrMatch, ArrOE }) =>
          ArrOE && <SelectSpread {...ArrMatch} {...ArrOE} successCallback={reloadSingle} />,
        width: 50,
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
        render: ({ ArrMatch }) => (
          <ButtonAddAutoSubMatchMore match={ArrMatch} frompage="motennis" />
        ),
        width: 25,
      },
      {
        title: 'LOG',
        render: ({ ArrMatch, ArrHDP, ArrGAH, ArrOU }) => (
          <ButtonLog
            {...ArrMatch}
            lineHDP={ArrHDP?.display_admin}
            lineOU={ArrOU?.display_admin}
            lineGAH={ArrGAH?.display_admin}
            gameTypeHDP={ArrHDP?.game_type}
            gameTypeOU={ArrOU?.game_type}
            gameTypeGAH={ArrGAH?.game_type}
          />
        ),
        width: 150,
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
  },
)

export default TableMOTennis