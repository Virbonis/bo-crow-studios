import React, { useMemo, useRef, useState } from 'react'
import {
  ButtonAcRj,
  ButtonScoreBoxLive,
  ButtonMatch,
  ButtonMoveOddsDirection,
  ButtonMoveOddsSingle,
  ButtonOdds1X2,
  ButtonPause,
  ButtonStock,
  ButtonSwapHandicap,
  CheckboxHide,
  HomeAwayName,
  InputOddsEuro,
  SelectHandicap,
  SelectLDiff,
  SelectOddsPoint,
  SelectSpread,
  // StatusAutoCalcOdds1X2,
  StatusFollowBookmark,
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
import { Select } from 'antd'

const TableMO5Euro = React.forwardRef(
  ({ viewParameter, data, reloadSingle, reloadPartai }, ref) => {
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
        newData.some(
          x => x.ArrHDP?.st_pause > 0 || x.ArrOU?.st_pause > 0 || x.Arr1X2?.st_pause > 0,
        ),
      ]
    }, [data, isHideActived, hiddenRows, viewParameter.ftht])
    useAudioPause(isAnyPaused)

    const [paginatedData, lastRowElementRef, resetPageNumber] = usePaginationData(
      filteredData,
      filteredData.length,
      5,
    )

    const moveHandicapHDPRef = useRef()
    const moveOddsHDPRef = useRef()
    const moveHandicapOURef = useRef()
    const moveOddsOURef = useRef()
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
      moveOddsHDPRef,
      moveHandicapOURef,
      moveOddsOURef,
      reloadSingle,
      reloadPartai,
      page: 'MO5Euro',
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
              {...row.ArrMatch}
              scoreBoxClass={getClassTdMO(row).scoreBox}
              successCallback={reloadPartai}
              tableRef={ref}
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
                {...ArrMatch}
                {...ArrHDP}
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
              <InputOddsEuro
                {...ArrMatch}
                {...ArrHDP}
                successCallback={reloadSingle}
                tableRef={ref}
              />
            ),
          width: 50,
          onCell: row => ({
            className: getClassTdMO(row).hdp.odds,
          }),
        },
        {
          title: '',
          render: ({ ArrMatch, ArrHDP }) =>
            ArrHDP && (
              <ButtonMoveOddsDirection
                {...ArrMatch}
                {...ArrHDP}
                direction="H"
                gt="HDP"
                tableRef={ref}
                successCallback={reloadSingle}
                enabled={ArrHDP.st_auto_odds > 0}
              />
            ),
          width: 20,
          onCell: row => ({
            className: getClassTdMO(row).hdp.st4pointldiff,
          }),
        },
        {
          title: 'L.Diff',
          render: ({ ArrMatch, ArrHDP }) =>
            ArrHDP && (
              <SelectLDiff
                {...ArrMatch}
                {...ArrHDP}
                enabled={ArrHDP.st_auto_odds === 1}
                successCallback={reloadSingle}
              />
            ),
          width: 50,
          onCell: row => ({
            className: getClassTdMO(row).hdp.ldiff,
          }),
        },
        {
          title: '',
          render: ({ ArrMatch, ArrHDP }) =>
            ArrHDP && (
              <ButtonMoveOddsDirection
                {...ArrMatch}
                {...ArrHDP}
                direction="A"
                gt="HDP"
                tableRef={ref}
                successCallback={reloadSingle}
                enabled={ArrHDP.st_auto_odds > 0}
              />
            ),
          width: 20,
          onCell: row => ({
            className: getClassTdMO(row).hdp.st4pointldiff,
          }),
        },
        {
          title: (
            <Select
              className="w-100"
              placeholder="AH"
              dropdownRender={() => <SelectOddsPoint ref={moveOddsHDPRef} />}
            />
          ),
          render: ({ ArrMatch, ArrHDP }) =>
            ArrHDP && (
              <div className="d-flex justify-content-between">
                <ButtonMoveOddsSingle
                  {...ArrMatch}
                  {...ArrHDP}
                  odds={ArrHDP.odds_home}
                  direction="H"
                  gt="HDP"
                  tableRef={ref}
                  successCallback={reloadPartai}
                  enabled={ArrHDP.st_auto_odds === 0}
                />
                <ButtonPause {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} />
                <ButtonMoveOddsSingle
                  {...ArrMatch}
                  {...ArrHDP}
                  odds={ArrHDP.odds_away}
                  direction="A"
                  gt="HDP"
                  tableRef={ref}
                  successCallback={reloadPartai}
                  enabled={ArrHDP.st_auto_odds === 0}
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
          render: ({ ArrMatch, ArrHDP, sameSubMatch }) =>
            ArrHDP && (
              <ButtonSwapHandicap
                {...ArrMatch}
                {...ArrHDP}
                sameSubMatch={sameSubMatch}
                successCallback={reloadPartai}
              />
            ),
          width: 25,
        },
        {
          title: 'Stock',
          render: ({ ArrMatch, ArrHDP }) =>
            ArrHDP?.show_stock && <ButtonStock {...ArrMatch} {...ArrHDP} gt="HDP" />,
          width: 50,
        },
        {
          title: '%',
          render: ({ ArrMatch, ArrHDP }) =>
            ArrHDP && <SelectSpread {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} />,
          width: 35,
        },
        {
          title: 'C',
          render: ({ ArrMatch, ArrHDP }) =>
            ArrHDP && (
              <StatusOpenSubMatch {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} />
            ),
          width: 25,
          onCell: row => ({
            className: getClassTdMO(row).hdp.stopen,
          }),
        },
        {
          title: 'L',
          render: ({ ArrMatch, ArrHDP }) =>
            ArrHDP && (
              <StatusFollowBookmark {...ArrMatch} {...ArrHDP} successCallback={reloadSingle} />
            ),
          width: 25,
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
          render: ({ ArrMatch }) => (
            <StatusOpenMatch {...ArrMatch} successCallback={reloadPartai} />
          ),
          width: 25,
        },
        // OU
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
          width: 65,
          onCell: row => ({
            className: getClassTdMO(row).ou.handicap,
          }),
        },
        {
          title: 'Odds',
          render: ({ ArrMatch, ArrOU }) =>
            ArrOU && <InputOddsEuro {...ArrMatch} {...ArrOU} successCallback={reloadSingle} />,
          width: 50,
          onCell: row => ({
            className: getClassTdMO(row).ou.odds,
          }),
        },
        {
          title: '',
          render: ({ ArrMatch, ArrOU }) =>
            ArrOU && (
              <ButtonMoveOddsDirection
                {...ArrMatch}
                {...ArrOU}
                direction="O"
                gt="OU"
                tableRef={ref}
                successCallback={reloadSingle}
                enabled={ArrOU.st_auto_odds > 0}
              />
            ),
          width: 20,
          onCell: row => ({
            className: getClassTdMO(row).ou.st4pointldiff,
          }),
        },
        {
          title: 'L.Diff',
          render: ({ ArrMatch, ArrOU }) =>
            ArrOU && (
              <SelectLDiff
                {...ArrMatch}
                {...ArrOU}
                enabled={ArrOU.st_auto_odds === 1}
                successCallback={reloadSingle}
              />
            ),
          width: 50,
          onCell: row => ({
            className: getClassTdMO(row).ou.ldiff,
          }),
        },
        {
          title: '',
          render: ({ ArrMatch, ArrOU }) =>
            ArrOU && (
              <ButtonMoveOddsDirection
                {...ArrMatch}
                {...ArrOU}
                direction="U"
                gt="OU"
                tableRef={ref}
                successCallback={reloadSingle}
                enabled={ArrOU.st_auto_odds > 0}
              />
            ),
          width: 20,
          onCell: row => ({
            className: getClassTdMO(row).ou.st4pointldiff,
          }),
        },
        {
          title: (
            <Select
              className="w-100"
              placeholder="OU"
              dropdownRender={() => <SelectOddsPoint ref={moveOddsOURef} />}
            />
          ),
          render: ({ ArrMatch, ArrOU }) =>
            ArrOU && (
              <div className="d-flex justify-content-between">
                <ButtonMoveOddsSingle
                  {...ArrMatch}
                  {...ArrOU}
                  odds={ArrOU.odds_home}
                  direction="O"
                  gt="OU"
                  tableRef={ref}
                  successCallback={reloadPartai}
                  enabled={ArrOU.st_auto_odds === 0}
                />
                <ButtonPause {...ArrMatch} {...ArrOU} successCallback={reloadSingle} />
                <ButtonMoveOddsSingle
                  {...ArrMatch}
                  {...ArrOU}
                  odds={ArrOU.odds_away}
                  direction="U"
                  gt="OU"
                  tableRef={ref}
                  successCallback={reloadPartai}
                  enabled={ArrOU.st_auto_odds === 0}
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
          render: ({ ArrMatch, ArrOU, sameSubMatch }) =>
            ArrOU && (
              <ButtonSwapHandicap
                {...ArrMatch}
                {...ArrOU}
                sameSubMatch={sameSubMatch}
                successCallback={reloadPartai}
              />
            ),
          width: 25,
        },
        {
          title: 'Stock',
          render: ({ ArrMatch, ArrOU }) =>
            ArrOU?.show_stock && <ButtonStock {...ArrMatch} {...ArrOU} gt="OU" />,
          width: 50,
        },
        {
          title: '%',
          render: ({ ArrMatch, ArrOU }) =>
            ArrOU && <SelectSpread {...ArrMatch} {...ArrOU} successCallback={reloadSingle} />,
          width: 35,
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
          title: 'L',
          render: ({ ArrMatch, ArrOU }) =>
            ArrOU && (
              <StatusFollowBookmark {...ArrMatch} {...ArrOU} successCallback={reloadSingle} />
            ),
          width: 25,
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
          width: 125,
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
            Arr1X2?.show_stock && <ButtonStock {...ArrMatch} {...Arr1X2} gt="ML" />,
          width: 50,
          onCell: row => ({
            className: getClassTdMO(row)['1x2'].stock,
          }),
        },
        {
          title: 'C',
          render: ({ ArrMatch, Arr1X2 }) =>
            Arr1X2 && (
              <StatusOpenSubMatch {...ArrMatch} {...Arr1X2} successCallback={reloadSingle} />
            ),
          width: 25,
          onCell: row => ({
            className: getClassTdMO(row)['1x2'].stopen,
          }),
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
  },
)
const rowKey = record => record.ArrMatch.row_id

export default TableMO5Euro
