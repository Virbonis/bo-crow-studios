import React from 'react'
import { Form, Space } from 'antd'
import {
  InputOdds,
  ButtonMoveOddsSingle,
  SelectSpread,
  SelectHandicapNumber,
} from 'pages/trading/mo-components'
import SubMatchSettingButton from 'pages/trading/shared-components/deadball-runningball/sub-match-setting-button'
import { InputDecimal } from 'components/blaise'
import { getValidatorOdds } from 'helper'
import { FormGT, TableGameType } from '../table'
import { defaultColumnsGT } from '../hooks'

const TableFT = ({ tableData, match_id, sport_id, defaultColumns, refetch, onSubmit }) => {
  const getColumns = key => {
    if (['result1', 'result2'].includes(key)) {
      const columns = [
        {
          title: 'Handicap',
          align: 'center',
          width: 100,
          render: ({ sub_match_id, handicap, game_type }) => {
            return (
              <SelectHandicapNumber
                match_id={match_id}
                sub_match_id={sub_match_id}
                handicap={handicap}
                gt="OU"
                textOnly={false}
                game_type={game_type}
                successCallback={refetch}
              />
            )
          },
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
          title: key === 'result1' ? 'Home' : 'Over',
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
          title: key === 'result1' ? 'Away' : 'Under',
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
      if (key === 'result1') columns.shift()
      return defaultColumns.concat(columns)
    }
    if (key === 'result3') {
      const scoreList = [
        'Win By 1-5',
        'Win By 6-10',
        'Win By 11-15',
        'Win By 16-20',
        'Win By 21-25',
        'Win By 26+',
      ]
      const columns = [
        ...scoreList.map((e, idx) => ({
          title: e,
          align: 'center',
          width: 125,
          render: record => {
            const startingKey1 = 1
            const startingKey2 = 7
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
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result4') {
      const scoreList = [
        'Win By 1-2',
        'Win By 3-6',
        'Win By 7-9',
        'Win By 10-13',
        'Win By 14-17',
        'Win By 18-21',
        'Win By 21+',
      ]
      const columns = [
        ...scoreList.map((e, idx) => ({
          title: e,
          align: 'center',
          width: 125,
          render: record => {
            const startingKey1 = 1
            const startingKey2 = 8
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
        ...defaultColumnsGT,
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
    return null
  }
  return (
    <>
      {tableData.map(e => {
        if (['result1', 'result2'].includes(e.key))
          return <TableGameType key={e.key} dataSource={e.data} columns={getColumns(e.key)} />
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
      })}
    </>
  )
}

export default TableFT
