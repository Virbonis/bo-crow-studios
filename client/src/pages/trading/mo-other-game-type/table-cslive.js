import React from 'react'
import { Button, Checkbox, Space } from 'antd'
import { groupBy, isEqual, mapValues } from 'lodash'
import { Amount } from 'components/blaise'
import { gameTypeDescription } from 'helper'
import { TableGameType } from './table'
import { InputOddsCS } from '../mo-components'

const TableCSLive = ({
  isLive,
  list,
  match_id,
  refetch,
  UpdateBG,
  UpdateParlay,
  UpdateOpen,
  UpdatePause,
}) => {
  const onChangeBG = React.useCallback(
    (sub_match_id, game_type) => e => {
      const status = e.target.checked ? 'Y' : 'N'
      UpdateBG({ match_id, sub_match_id, game_type, status }, refetch)
    },
    [match_id, UpdateBG, refetch],
  )
  const onChangeParlay = React.useCallback(
    (sub_match_id, game_type) => e => {
      const status = e.target.checked ? 'Y' : 'N'
      UpdateParlay({ match_id, sub_match_id, game_type, status }, refetch)
    },
    [match_id, UpdateParlay, refetch],
  )
  const onChangeOpen = React.useCallback(
    (choice_code, game_type) => e => {
      const status = e.target.checked ? 'Y' : 'N'
      UpdateOpen({ match_id, choice_code, game_type, status }, refetch)
    },
    [match_id, UpdateOpen, refetch],
  )
  const onChangePause = React.useCallback(
    (choice_code, game_type) => e => {
      const status = e.target.checked ? 3 : 0
      UpdatePause({ match_id, choice_code, game_type, status }, refetch)
    },
    [match_id, UpdatePause, refetch],
  )
  const onOpenAll = React.useCallback(
    (game_type, st) => () => UpdateOpen({ match_id, game_type, status: st }, refetch),
    [match_id, refetch, UpdateOpen],
  )
  const onPauseAll = React.useCallback(
    (game_type, st) => () => UpdatePause({ match_id, game_type, status: st }, refetch),
    [match_id, refetch, UpdatePause],
  )

  const [isFirstRow, rowCount] = React.useMemo(() => {
    const grouped = groupBy(list, 'game_type')
    const firstRow = mapValues(grouped, x => x[0].choice_code)
    return [
      (game_type, choice_code) => isEqual(firstRow[game_type], choice_code),
      mapValues(grouped, x => x.length),
    ]
  }, [list])

  const columns = React.useMemo(() => {
    return [
      {
        title: 'Game Type',
        dataIndex: 'game_type',
        render: text => gameTypeDescription[text]?.long,
        width: 200,
        onCell: ({ game_type, choice_code }) => {
          if (isFirstRow(game_type, choice_code))
            return {
              rowSpan: rowCount[game_type],
            }
          return {
            rowSpan: 0,
          }
        },
      },
      {
        title: 'BG',
        align: 'center',
        render: ({ is_show_bg, is_enable_bg, sub_match_status_bg, game_type, sub_match_id }) => {
          if (is_show_bg !== 'Y') return null
          // gt DNB/DC force disable
          const disabled = is_enable_bg !== 'Y' || game_type === 28 || game_type === 15
          const checked = sub_match_status_bg === 'Y'
          return (
            <Checkbox
              checked={checked}
              disabled={disabled}
              onChange={onChangeBG(sub_match_id, game_type)}
            />
          )
        },
        width: 50,
        ellipsis: true,
        // if first gametype of list set rowspan to same gametype length
        onCell: ({ game_type, choice_code }) => {
          if (isFirstRow(game_type, choice_code))
            return {
              rowSpan: rowCount[game_type],
            }
          return {
            rowSpan: 0,
          }
        },
      },
      {
        title: 'Parlay',
        align: 'center',
        render: ({ is_show_parlay, sub_match_status_parlay, game_type, sub_match_id }) => {
          if (is_show_parlay !== 'Y') return null
          const checked = sub_match_status_parlay === 'Y'
          return <Checkbox checked={checked} onChange={onChangeParlay(sub_match_id, game_type)} />
        },
        width: 50,
        ellipsis: true,
        onCell: ({ game_type, choice_code }) => {
          if (isFirstRow(game_type, choice_code))
            return {
              rowSpan: rowCount[game_type],
            }
          return {
            rowSpan: 0,
          }
        },
      },
      {
        title: 'Open',
        align: 'center',
        render: ({ sub_match_status_open, sub_match_status_bg, game_type, choice_code }) => {
          const disabled = sub_match_status_bg === 'Y' && isLive
          const checked = sub_match_status_open === 'Y'
          return (
            <Checkbox
              checked={checked}
              disabled={disabled}
              onChange={onChangeOpen(choice_code, game_type)}
            />
          )
        },
        width: 50,
        ellipsis: true,
      },
      {
        title: 'Pause',
        align: 'center',
        render: ({ sub_match_status_pause, game_type, choice_code }) => {
          const checked = sub_match_status_pause === 3
          return <Checkbox checked={checked} onChange={onChangePause(choice_code, game_type)} />
        },
        width: 50,
        ellipsis: true,
      },
      { title: 'Score', dataIndex: 'score', width: 50, align: 'center' },
      {
        title: 'Odds',
        render: ({ odds, game_type, choice_code }) => (
          <InputOddsCS
            match_id={match_id}
            game_type={game_type}
            choice_code={choice_code}
            odds={odds}
            successCallback={refetch}
          />
        ),
        align: 'center',
        width: 75,
      },
      {
        title: 'Stock',
        align: 'center',
        render: ({ total_bet, total }) =>
          total_bet !== 0 && total !== 0 ? <Amount value={total / total_bet} /> : null,
      },
      {
        title: '',
        render: ({ game_type }) => (
          <Space direction="vertical">
            <Button type="link" className="w-100" onClick={onOpenAll(game_type, 'N')}>
              Close All
            </Button>
            <Button type="link" className="w-100" onClick={onOpenAll(game_type, 'Y')}>
              Open All
            </Button>
            <Button type="link" className="w-100" onClick={onPauseAll(game_type, 3)}>
              Pause All
            </Button>
            <Button type="link" className="w-100" onClick={onPauseAll(game_type, 0)}>
              Resume All
            </Button>
          </Space>
        ),
        width: 100,
        onCell: ({ game_type, choice_code }) => {
          if (isFirstRow(game_type, choice_code))
            return {
              rowSpan: rowCount[game_type],
            }
          return {
            rowSpan: 0,
          }
        },
      },
    ]
  }, [
    match_id,
    refetch,
    isLive,
    isFirstRow,
    rowCount,

    onChangeBG,
    onChangeParlay,
    onChangeOpen,
    onChangePause,
    onOpenAll,
    onPauseAll,
  ])

  return <TableGameType dataSource={list} columns={columns} rowKey="choice_code" />
}

export default TableCSLive
