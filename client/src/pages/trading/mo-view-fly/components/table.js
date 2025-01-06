import React, { useMemo, useRef, useState } from 'react'
import {
  ButtonScoreBoxLive,
  ButtonLog,
  ButtonOdds1X2,
  ButtonPause,
  ButtonStock,
  CheckboxHide,
  HomeAwayName,
  InputOdds,
  SelectHandicap,
  SelectSpread,
  StatusAutoCalcOdds1X2,
  StatusOpenMatch,
  StatusOpenSubMatch,
  StatusPause,
  TableMO,
  useAudioPause,
} from 'pages/trading/mo-components'
import getClassTdMO from 'helper/mo'
import { countOddsMargin } from 'helper'
import { Amount } from 'components/blaise'
import ButtonAcrjView from 'pages/trading/mo-components/button-acrj-view'
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
  const columns = React.useMemo(
    () => [
      {
        title: 'H',
        align: 'center',
        render: ({ ArrMatch: { row_id }, isHidden }) => {
          return <CheckboxHide row_id={row_id} isHidden={isHidden} setHiddenRows={setHiddenRows} />
        },
        width: 25,
      },
      {
        title: 'Match',
        align: 'center',
        render: ({ ArrMatch }) => {
          const { match_follow_rball, match_auto_odds, match_id, limit_id } = ArrMatch
          return (
            <span title={limit_id}>
              {match_follow_rball} {match_auto_odds} {match_id}
            </span>
          )
        },
        width: 75,
      },
      {
        title: 'Home',
        align: 'center',
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
        onCell: row => ({
          className: getClassTdMO(row).earlysettlement,
        }),
      },
      {
        title: 'Live',
        align: 'center',
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
        align: 'center',
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
        onCell: row => ({
          className: getClassTdMO(row).earlysettlement,
        }),
      },
      // HDP
      {
        title: 'HDP',
        align: 'center',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <SelectHandicap
              {...ArrMatch}
              {...ArrHDP}
              gt="HDP"
              tableRef={ref}
              successCallback={reloadSingle}
              textOnly
            />
          ),
        width: 75,
        onCell: row => ({
          className: getClassTdMO(row).hdp.handicap,
        }),
      },
      {
        title: 'Odds',
        align: 'center',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && <InputOdds {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} textOnly />,
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).hdp.odds,
        }),
      },
      {
        title: 'AH',
        align: 'center',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <div className="d-flex justify-content-between align-items-center">
              <Amount value={ArrHDP.odds_home} className="w-50" />
              <ButtonPause {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} textOnly />
              <Amount value={ArrHDP.odds_away} className="w-50" />
            </div>
          ),
        width: 112,
        onCell: row => ({
          className: getClassTdMO(row).hdp.ha,
        }),
      },
      {
        title: 'Stock',
        align: 'center',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP?.show_stock && <ButtonStock {...ArrMatch} {...ArrHDP} gt="HDP" textOnly />,
        width: 50,
      },
      {
        title: '%',
        align: 'center',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <SelectSpread {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} textOnly />
          ),
        width: 50,
      },
      {
        title: 'C',
        align: 'center',
        render: ({ ArrMatch, ArrHDP }) =>
          ArrHDP && (
            <StatusOpenSubMatch {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} textOnly />
          ),
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row).hdp.stopen,
        }),
      },
      {
        title: 'P',
        align: 'center',
        render: ({ ArrMatch }) => (
          <StatusPause {...ArrMatch} tableRef={ref} successCallback={reloadPartai} textOnly />
        ),
        width: 25,
      },
      {
        title: 'IH',
        align: 'center',
        render: ({ ArrMatch }) => (
          <StatusOpenMatch {...ArrMatch} successCallback={reloadPartai} textOnly />
        ),
        width: 25,
      },
      // OU
      {
        title: 'OU',
        align: 'center',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <SelectHandicap
              {...ArrMatch}
              {...ArrOU}
              gt="OU"
              tableRef={ref}
              successCallback={reloadSingle}
              textOnly
            />
          ),
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).ou.handicap,
        }),
      },
      {
        title: 'Odds',
        align: 'center',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && <InputOdds {...ArrMatch} {...ArrOU} successCallback={reloadSingle} textOnly />,
        width: 60,
        onCell: row => ({
          className: getClassTdMO(row).ou.odds,
        }),
      },
      {
        title: 'OU',
        align: 'center',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <div className="d-flex justify-content-between align-items-center">
              <Amount value={ArrOU.odds_home} className="w-50" />
              <ButtonPause {...ArrMatch} {...ArrOU} successCallback={reloadSingle} textOnly />
              <Amount value={ArrOU.odds_away} className="w-50" />
            </div>
          ),
        width: 112,
        onCell: row => ({
          className: getClassTdMO(row).ou.ha,
        }),
      },
      {
        title: 'Stock',
        align: 'center',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU?.show_stock && <ButtonStock {...ArrMatch} {...ArrOU} gt="OU" textOnly />,
        width: 50,
      },
      {
        title: '%',
        align: 'center',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <SelectSpread {...ArrMatch} {...ArrOU} successCallback={reloadSingle} textOnly />
          ),
        width: 50,
      },
      {
        title: 'C',
        align: 'center',
        render: ({ ArrMatch, ArrOU }) =>
          ArrOU && (
            <StatusOpenSubMatch {...ArrMatch} {...ArrOU} successCallback={reloadSingle} textOnly />
          ),
        width: 25,
        onCell: row => ({
          className: getClassTdMO(row).ou.stopen,
        }),
      },
      {
        title: '',
        align: 'center',
        render: ({ ArrMatch }) =>
          ArrMatch.st_live !== 'N' && (
            <ButtonAcrjView
              match_id={ArrMatch.match_id}
              title={`${ArrMatch.match_id} - ${ArrMatch.home_name} - ${ArrMatch.away_name}`}
            />
          ),
        width: 40,
      },
      // 1X2
      {
        title: '1(H) 2(A) X(D)',
        align: 'center',
        width: 148,
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2 && (
            <div className="d-flex">
              <ButtonOdds1X2 {...ArrMatch} {...Arr1X2} successCallback={reloadSingle} textOnly />
              <ButtonPause {...ArrMatch} {...Arr1X2} successCallback={reloadSingle} textOnly />
            </div>
          ),
      },
      {
        title: 'Margin',
        align: 'center',
        width: 45,
        render: ({ Arr1X2 }) =>
          Arr1X2 && (
            <div>{countOddsMargin([Arr1X2.odds_home, Arr1X2.odds_away, Arr1X2.odds_draw])}</div>
          ),
      },
      {
        title: 'Stock',
        align: 'center',
        width: 50,
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2?.show_stock && <ButtonStock {...ArrMatch} {...Arr1X2} gt="1X2" />,
        onCell: row => ({
          className: getClassTdMO(row)['1x2'].stock,
        }),
      },
      {
        title: 'C',
        align: 'center',
        width: 25,
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2 && (
            <StatusOpenSubMatch {...ArrMatch} {...Arr1X2} successCallback={reloadSingle} textOnly />
          ),
        onCell: row => ({
          className: getClassTdMO(row)['1x2'].stopen,
        }),
      },
      {
        title: 'A',
        align: 'center',
        width: 25,
        render: ({ ArrMatch, Arr1X2 }) =>
          Arr1X2 && (
            <StatusAutoCalcOdds1X2
              {...ArrMatch}
              {...Arr1X2}
              successCallback={reloadPartai}
              textOnly
            />
          ),
      },
      {
        title: 'LOG',
        align: 'center',
        width: 120,
        render: ({ ArrMatch, ArrHDP, ArrOU }) => {
          return (
            <ButtonLog
              {...ArrMatch}
              lineHDP={ArrHDP?.display_admin}
              lineOU={ArrOU?.display_admin}
              gameTypeHDP={ArrHDP?.game_type}
              gameTypeOU={ArrOU?.game_type}
            />
          )
        },
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
export default TableMO5
