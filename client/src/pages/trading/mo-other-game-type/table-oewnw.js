import React from 'react'
import { Button } from 'antd'
import { Amount } from 'components/blaise'
import { isEqual } from 'lodash'
import { InputOdds, SelectSpread, ButtonMoveOddsSingle } from 'pages/trading/mo-components'
import { listGT } from 'helper'
import { TableGameType } from './table'

const TableOEWNW = React.memo(
  props => {
    const { list, defaultColumns, match_id, refetch, editMatch } = props
    const mapColumns = React.useMemo(() => {
      return {
        OEGOE: [
          ...defaultColumns,
          {
            title: 'Odds',
            render: ({ sub_match_id, odds, game_type }) => {
              return (
                <InputOdds
                  match_id={match_id}
                  sub_match_id={sub_match_id}
                  odds={odds}
                  game_type={game_type}
                  successCallback={refetch}
                />
              )
            },
            align: 'center',
            width: 150,
          },
          {
            title: 'O/E',
            render: ({ sub_match_id, odds_home, odds_away }) => {
              return (
                <div className="d-flex justify-content-between">
                  <ButtonMoveOddsSingle
                    match_id={match_id}
                    sub_match_id={sub_match_id}
                    odds={odds_home}
                    direction="O"
                    gt="OE"
                    successCallback={refetch}
                  />
                  <ButtonMoveOddsSingle
                    match_id={match_id}
                    sub_match_id={sub_match_id}
                    odds={odds_away}
                    direction="E"
                    gt="OE"
                    successCallback={refetch}
                  />
                </div>
              )
            },
            align: 'center',
            width: 150,
          },
          {
            title: '%',
            render: ({ sub_match_id, spread_perc }) => {
              return (
                <SelectSpread
                  match_id={match_id}
                  sub_match_id={sub_match_id}
                  spread={spread_perc}
                  successCallback={refetch}
                />
              )
            },
            align: 'center',
            width: 75,
          },
          { title: '' },
          {
            title: '',
            render: ({ display_admin, game_type }) => (
              <Button size="small" type="link" onClick={editMatch(display_admin, game_type)}>
                Detail
              </Button>
            ),
            width: 100,
          },
        ],
        WNW: [
          ...defaultColumns,
          {
            title: 'Odds',
            render: ({ odds }) => <Amount value={odds} />,
            align: 'center',
            width: 150,
          },
          {
            title: 'W/NW',
            render: ({ odds_home, odds_away }) => {
              return (
                <div className="d-flex justify-content-between">
                  <Amount value={odds_home} style={{ width: '100%' }} />
                  <Amount value={odds_away} style={{ width: '100%' }} />
                </div>
              )
            },
            align: 'center',
            width: 150,
          },
          {
            title: '%',
            render: ({ spread_perc }) => {
              return <Amount value={spread_perc} int />
            },
            align: 'center',
            width: 75,
          },
          { title: '' },
          {
            title: '',
            render: ({ display_admin, game_type }) => (
              <Button size="small" type="link" onClick={editMatch(display_admin, game_type)}>
                Detail
              </Button>
            ),
            width: 100,
          },
        ],
      }
    }, [defaultColumns, match_id, refetch, editMatch])

    const raw = React.useMemo(() => {
      return Object.entries(mapColumns).map(([gt, columns]) => {
        return [gt, columns, list.filter(y => listGT[gt].includes(y.game_type))]
      })
    }, [list, mapColumns])

    return (
      <>
        {raw.map(([gt, columns, data]) => {
          return <TableGameType key={gt} dataSource={data} columns={columns} />
        })}
      </>
    )
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
)

export default TableOEWNW
