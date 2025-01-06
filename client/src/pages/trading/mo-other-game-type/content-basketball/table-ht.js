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

const TableHT = ({ tableData, match_id, sport_id, defaultColumns, refetch, onSubmit }) => {
  const getColumns = key => {
    if (['result1', 'result2'].includes(key)) {
      const columns = [
        {
          title: 'Handicap',
          align: 'center',
          width: 75,
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
      const columns = [
        {
          title: 'Home/Home',
          align: 'center',
          render: ({ game_type, odds1 }) => (
            <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds1} />
            </Form.Item>
          ),
          width: 75,
        },
        {
          title: 'Home/Draw',
          align: 'center',
          render: ({ game_type, odds2 }) => (
            <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds2} />
            </Form.Item>
          ),
          width: 75,
        },
        {
          title: 'Home/Away',
          align: 'center',
          render: ({ game_type, odds3 }) => (
            <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds3} />
            </Form.Item>
          ),
          width: 75,
        },
        {
          title: 'Draw/Home',
          align: 'center',
          render: ({ game_type, odds4 }) => (
            <Form.Item name="odds4" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds4} />
            </Form.Item>
          ),
          width: 75,
        },
        {
          title: 'Draw/Away',
          align: 'center',
          render: ({ game_type, odds5 }) => (
            <Form.Item name="odds5" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds5} />
            </Form.Item>
          ),
          width: 75,
        },
        {
          title: 'Away/Home',
          align: 'center',
          render: ({ game_type, odds6 }) => (
            <Form.Item name="odds6" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds6} />
            </Form.Item>
          ),
          width: 75,
        },
        {
          title: 'Away/Draw',
          align: 'center',
          render: ({ game_type, odds7 }) => (
            <Form.Item name="odds7" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds7} />
            </Form.Item>
          ),
          width: 75,
        },
        {
          title: 'Away/Away',
          align: 'center',
          render: ({ game_type, odds8 }) => (
            <Form.Item name="odds8" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds8} />
            </Form.Item>
          ),
          width: 75,
        },
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result4') {
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
        {
          title: 'Draw',
          align: 'center',
          width: 75,
          render: ({ game_type, odds13 }) => (
            <Form.Item name="odds13" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds13} />
            </Form.Item>
          ),
        },
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

export default TableHT
