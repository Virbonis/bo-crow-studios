import { Space, Table, Typography } from 'antd'
import { getGameTypeDescriptionShort, choiceOptions } from 'helper'
import React from 'react'
import useAudioPause from 'pages/trading/shared-components/useAudioPause'
import OpenCloseSubMatchButton from 'pages/trading/shared-components/deadball-runningball/open-close-sub-match-button'
import OddsMargin from 'pages/trading/shared-components/deadball-runningball/odds-margin'
import RenderSubMatch, { getCellSubMatch } from './RenderSubMatch'
import RenderSubMatchByChoice from './RenderSubMatchByChoice'
import SubMatchSettingButton from '../button/submatch-setting-button'

const { Text } = Typography

const TableDeadballSpecial = ({ data, refetch, lastFetchGameType }) => {
  const [isAnyPaused] = React.useMemo(() => {
    return [data.some(x => x.sub_match_pause_status > 0)]
  }, [data])
  useAudioPause(isAnyPaused)
  const columns = React.useMemo(
    () => [
      {
        title: 'No',
        width: 30,
        onCell: ({ league_group }) => ({ colSpan: league_group ? 15 : 1 }),
        render: ({ league_group, league_name, rowNumber }) => {
          if (league_group) return <span className="h5 font-weight-bold p-3">{league_name}</span>
          return <div align="center">{rowNumber}</div>
        },
      },
      {
        title: 'Time',
        align: 'center',
        width: 100,
        onCell: ({ league_group }) => ({ rowSpan: league_group ? 0 : 1 }),
        render: ({ league_group, match_date, match_hour, is_profile_changed, profile_id }) => {
          if (league_group) return null

          const classProfile =
            is_profile_changed === 0 ? 'cell_profile_not_changed' : 'cell_profile_changed'
          return (
            <div className="d-flex flex-column">
              <span>{match_date}</span>
              <span>{match_hour}</span>
              <span className={classProfile}>{profile_id}</span>
            </div>
          )
        },
      },
      {
        title: 'Home Away',
        width: 400,
        onCell: ({ league_group }) => ({ rowSpan: league_group ? 0 : 1 }),
        render: record => {
          if (record.league_group) return null
          return (
            <Space direction="vertical" size={0}>
              {record.home_name}
              {record.away_name}
              {lastFetchGameType === '39' && 'Draw'}
              {/* CSH, FGM, TOTFG, ITA, WM */}
              {['40', '21', '25', '27', '35'].includes(lastFetchGameType) && (
                <OddsMargin record={record} />
              )}
            </Space>
          )
        },
      },
      // render column for each game type
      ...lastFetchGameType
        .split(',')
        .flatMap((game_type, index) =>
          getColumnsSpecial(Number(game_type), index + 1, refetch, lastFetchGameType),
        ),
    ],
    [refetch, lastFetchGameType],
  )

  return (
    <Table
      id="table-trading"
      bordered
      columns={columns}
      dataSource={data}
      pagination={false}
      rowClassName={x => {
        if (x.league_group) return 'separator-league-color'

        if (x.match_pause_status === 1) return 'tr-match-paused'
        if (x.match_open_status === 'N') return 'tr-match-off'
        return x.rowNumber % 2 !== 0 ? 'tr-odd' : 'tr-even'
      }}
      scroll={{
        x: 'max-content',
      }}
    />
  )
}

const getColumnsSpecial = (game_type, type, refetch, lastFetchGameType) => {
  const onCell = record => getCellSubMatch(record, type)

  // CSH, FGM, TOTFG, ITA, WM,
  // return multi - columns by choices(RenderSubMatchByChoice)
  if ([40, 21, 25, 27, 35].includes(game_type)) {
    let listChoicesByGameType = choiceOptions[game_type]
    // wm column winby goal
    if (game_type === 35)
      listChoicesByGameType = listChoicesByGameType
        .filter((e, i) => ![5, 6, 7, 8].includes(i))
        .map(v => ({ ...v, label: v.label.replace('Home', 'Win by') }))
    return [
      {
        width: 5,
        align: 'center',
        onCell: record => ({
          rowSpan: record.league_group && 0,
          // className:
          //   record.subMatches[0].sub_match_open_status === 'N' ? 'td-sub-match-off' : '',
          // if (subMatches?.sub_match_open_status === 'N') return { className: 'td-sub-match-off' }
          // className: `cell-color ${record.subMatches?.[0].sub_match_open_status}0`,
          className: `${record.subMatches?.[0].sub_match_open_status}0`,
        }),
        render: ({ league_group, auto_pause }) => {
          if (league_group) return null

          return auto_pause === 1 && <div className="icon-indicator pause" />
        },
      },
      ...listChoicesByGameType.map((e, i) => ({
        title: e.label,
        width: 200,
        onCell,
        render: record => {
          if (record.league_group) return null

          // smua selain wm
          if (game_type !== 35)
            return <RenderSubMatchByChoice record={record} index={i} refetch={refetch} />
          // wm, column draw/nogoal
          if (i === 0 || i === 5)
            return <RenderSubMatchByChoice record={record} index={i} refetch={refetch} />
          // wm, column winby goal
          return (
            <Space direction="vertical" size={0}>
              <RenderSubMatchByChoice record={record} index={i} refetch={refetch} />
              <RenderSubMatchByChoice record={record} index={i + 5} refetch={refetch} />
            </Space>
          )
        },
      })),
      {
        title: 'Action',
        align: 'center',
        width: 100,
        onCell: record => ({ rowSpan: record.league_group ? 0 : 1 }),
        render: record => {
          if (record.league_group) return null

          return (
            <Space direction="vertical" size={0}>
              <OpenCloseSubMatchButton record={record} successCallback={refetch} />
              <SubMatchSettingButton
                record={record}
                successCallback={refetch}
                lastFetchGameType={lastFetchGameType}
              />
              {record.reason_pause !== '' && (
                <>
                  <br />
                  <Text className="font-italic">{record.reason_pause}</Text>
                </>
              )}
            </Space>
          )
        },
      },
    ]
  }
  // else return 1 column (RenderSubMatch)
  return {
    title: getGameTypeDescriptionShort(game_type),
    width: 200,
    onCell,
    render: ({ league_group, subMatches }) => {
      if (league_group) return null
      return (
        <RenderSubMatch
          subMatches={subMatches}
          type={type}
          refetch={refetch}
          lastFetchGameType={lastFetchGameType}
        />
      )
    },
  }
}

export default TableDeadballSpecial
