import React from 'react'
import { Form, Space } from 'antd'
import {
  ButtonMoveOddsSingle,
  HomeAwayName,
  InputOdds,
  SelectHandicapNumber,
  SelectSpread,
} from 'pages/trading/mo-components'
import SubMatchSettingButton from 'pages/trading/shared-components/deadball-runningball/sub-match-setting-button'
import { InputDecimal } from 'components/blaise'
import { getValidatorOdds } from 'helper'
import { FormGT, TableGameType } from '../table'
import { defaultColumnsGT } from '../hooks'

const TableSubQT = ({ tableData, defaultColumns, refetch, match_id, sport_id, onSubmit }) => {
  const getColumns = key => {
    if (key === 'result1') {
      const columns = [
        {
          title: 'Handicap',
          align: 'center',
          width: 200,
          render: ({ st_fav, sub_match_id, handicap, game_type }) => (
            <div className="d-flex flex-row justify-content-between">
              <HomeAwayName
                st_fav={st_fav}
                match_id={match_id}
                sub_match_id={sub_match_id}
                name="Home"
                direction="H"
                successCallback={refetch}
                noColor
              />
              <SelectHandicapNumber
                match_id={match_id}
                sub_match_id={sub_match_id}
                handicap={Math.abs(handicap) || 0}
                gt="HDP"
                textOnly={false}
                game_type={game_type}
                successCallback={refetch}
              />
              <HomeAwayName
                st_fav={st_fav}
                match_id={match_id}
                sub_match_id={sub_match_id}
                name="Away"
                direction="A"
                successCallback={refetch}
                noColor
              />
            </div>
          ),
        },
        {
          title: 'Odds',
          align: 'center',
          width: 150,
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
        },
        {
          title: 'Home',
          align: 'center',
          width: 120,
          render: ({ sub_match_id, odds_home }) => {
            return (
              <ButtonMoveOddsSingle
                match_id={match_id}
                sub_match_id={sub_match_id}
                odds={odds_home}
                direction="H"
                gt="HDP"
                successCallback={refetch}
              />
            )
          },
        },
        {
          title: 'Away',
          align: 'center',
          width: 120,
          render: ({ sub_match_id, odds_away }) => {
            return (
              <ButtonMoveOddsSingle
                match_id={match_id}
                sub_match_id={sub_match_id}
                odds={odds_away}
                direction="A"
                gt="HDP"
                successCallback={refetch}
              />
            )
          },
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
          render: record => {
            return (
              <SubMatchSettingButton
                record={{ ...record, match_id, sport_id }}
                successCallback={refetch}
                fromPage="MO"
              />
            )
          },
          align: 'center',
          width: 100,
        },
      ]
      return defaultColumns.concat(columns)
    }
    if (['result2', 'result8'].includes(key)) {
      const columns = [
        {
          title: 'Handicap',
          align: 'center',
          width: 75,
          render: ({ sub_match_id, handicap, game_type }) => (
            <SelectHandicapNumber
              match_id={match_id}
              sub_match_id={sub_match_id}
              handicap={handicap}
              gt="HDP"
              textOnly={false}
              game_type={game_type}
              successCallback={refetch}
            />
          ),
        },
        {
          title: 'Odds',
          align: 'center',
          width: 150,
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
        },
        {
          title: 'Over',
          align: 'center',
          width: 120,
          render: ({ sub_match_id, odds_home }) => {
            return (
              <ButtonMoveOddsSingle
                match_id={match_id}
                sub_match_id={sub_match_id}
                odds={odds_home}
                direction="H"
                gt="OU"
                successCallback={refetch}
              />
            )
          },
        },
        {
          title: 'Under',
          align: 'center',
          width: 120,
          render: ({ sub_match_id, odds_away }) => {
            return (
              <ButtonMoveOddsSingle
                match_id={match_id}
                sub_match_id={sub_match_id}
                odds={odds_away}
                direction="A"
                gt="OU"
                successCallback={refetch}
              />
            )
          },
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
          render: record => {
            return (
              <SubMatchSettingButton
                record={{ ...record, match_id, sport_id }}
                successCallback={refetch}
                fromPage="MO"
              />
            )
          },
          align: 'center',
          width: 100,
        },
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result5') {
      const scoreList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
      const columns = [
        ...scoreList.map((e, idx) => ({
          title: e,
          align: 'center',
          width: 75,
          render: record => {
            return (
              <Form.Item
                name={`odds${idx + 1}`}
                rules={[{ validator: getValidatorOdds(record.game_type) }]}
                noStyle
              >
                <InputDecimal oldValue={record[`odds${idx + 1}`]} />
              </Form.Item>
            )
          },
        })),
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result6') {
      const scoreList = ['Win by 1-4', 'Win by 5-8', 'Win by 9+']
      const columns = [
        ...scoreList.map((e, idx) => ({
          title: e,
          align: 'center',
          width: 125,
          render: record => {
            const startingKey1 = 1
            const startingKey2 = 4
            return (
              <Space direction="vertical" size={0}>
                <Form.Item
                  label="Home"
                  name={`odds${startingKey1 + idx}`}
                  rules={[{ validator: getValidatorOdds(record.game_type) }]}
                >
                  <InputDecimal oldValue={record[`odds${startingKey1 + idx}`]} />
                </Form.Item>
                <Form.Item
                  label="Away"
                  name={`odds${startingKey2 + idx}`}
                  rules={[{ validator: getValidatorOdds(record.game_type) }]}
                >
                  <InputDecimal oldValue={record[`odds${startingKey2 + idx}`]} />
                </Form.Item>
              </Space>
            )
          },
        })),
        {
          title: 'Draw',
          align: 'center',
          width: 75,
          render: ({ game_type, odds7 }) => (
            <Form.Item name="odds7" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds7} />
            </Form.Item>
          ),
        },
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (['result3', 'result4', 'result7'].includes(key)) {
      const columns = [
        {
          title: 'Odds',
          align: 'center',
          width: 150,
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
        },
        {
          title: key === 'result3' ? 'Odd' : 'Home',
          align: 'center',
          width: 120,
          render: ({ sub_match_id, odds_home }) => {
            return (
              <ButtonMoveOddsSingle
                match_id={match_id}
                sub_match_id={sub_match_id}
                odds={odds_home}
                direction="H"
                gt="OU"
                successCallback={refetch}
              />
            )
          },
        },
        {
          title: key === 'result3' ? 'Even' : 'Away',
          align: 'center',
          width: 120,
          render: ({ sub_match_id, odds_away }) => {
            return (
              <ButtonMoveOddsSingle
                match_id={match_id}
                sub_match_id={sub_match_id}
                odds={odds_away}
                direction="A"
                gt="OU"
                successCallback={refetch}
              />
            )
          },
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
          render: record => {
            return (
              <SubMatchSettingButton
                record={{ ...record, match_id, sport_id }}
                successCallback={refetch}
                fromPage="MO"
              />
            )
          },
          align: 'center',
          width: 100,
        },
      ]
      return defaultColumns.concat(columns)
    }
    return null
  }
  return (
    <>
      {tableData.map(e => {
        if (['result5', 'result6'].includes(e.key)) {
          return e.data.map((dataSource, index) => (
            <FormGT
              key={dataSource.game_type}
              data={dataSource}
              onSubmit={onSubmit}
              game_type={dataSource.game_type}
            >
              <TableGameType
                dataSource={[dataSource]}
                columns={getColumns(e.key)}
                showHeader={index === 0}
              />
            </FormGT>
          ))
        }
        return <TableGameType key={e.key} dataSource={e.data} columns={getColumns(e.key)} />
      })}
    </>
  )
}

export default TableSubQT
