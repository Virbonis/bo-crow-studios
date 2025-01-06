import React from 'react'
import { Button, Checkbox, Form, Space } from 'antd'
import { Amount, InputDecimal } from 'components/blaise'
import { gameTypeDescription } from 'helper'

const useDefaultColumns = (
  isLive,
  match_id,
  sport_id,
  UpdateBG,
  UpdateParlay,
  UpdateOpen,
  UpdatePause,
  refetch,
) => {
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
      UpdateParlay({ match_id, sub_match_id, game_type, status, sport_id }, refetch)
    },
    [match_id, UpdateParlay, refetch, sport_id],
  )
  const onChangeOpen = React.useCallback(
    (sub_match_id, game_type) => e => {
      const status = e.target.checked ? 'Y' : 'N'
      UpdateOpen({ match_id, sub_match_id, game_type, status, sport_id }, refetch)
    },
    [match_id, UpdateOpen, refetch, sport_id],
  )
  const onChangePause = React.useCallback(
    (sub_match_id, game_type) => e => {
      const status = e.target.checked ? 3 : 0
      UpdatePause({ match_id, sub_match_id, game_type, status, sport_id }, refetch)
    },
    [match_id, UpdatePause, refetch, sport_id],
  )

  const defaultColumns = React.useMemo(() => {
    return [
      {
        title: 'Game Type',
        dataIndex: 'game_type',
        render: text => gameTypeDescription[text]?.long,
        width: 200,
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
      },
      {
        title: 'Parlay',
        align: 'center',
        render: ({ is_show_parlay, sub_match_status_parlay, game_type, sub_match_id }) => {
          if (is_show_parlay !== 'Y' && sport_id !== 12 && sport_id !== 58) return null
          const checked = sub_match_status_parlay === 'Y'
          return <Checkbox checked={checked} onChange={onChangeParlay(sub_match_id, game_type)} />
        },
        width: 50,
        ellipsis: true,
      },
      {
        title: 'Open',
        align: 'center',
        render: ({ sub_match_status_open, sub_match_status_bg, game_type, sub_match_id }) => {
          const disabled = sub_match_status_bg === 'Y' && isLive
          const checked = sub_match_status_open === 'Y'
          return (
            <Checkbox
              checked={checked}
              disabled={disabled}
              onChange={onChangeOpen(sub_match_id, game_type)}
            />
          )
        },
        width: 50,
        ellipsis: true,
      },
      {
        title: 'Pause',
        align: 'center',
        render: ({ sub_match_status_pause, game_type, sub_match_id }) => {
          const checked = sub_match_status_pause === 3
          return <Checkbox checked={checked} onChange={onChangePause(sub_match_id, game_type)} />
        },
        width: 50,
        ellipsis: true,
      },
    ]
  }, [isLive, sport_id, onChangeBG, onChangeParlay, onChangeOpen, onChangePause])

  const resultColumns =
    sport_id === 12 || sport_id === 58
      ? defaultColumns.filter(e => e.title !== 'BG')
      : defaultColumns

  return resultColumns
}

const defaultColumnsGT = [
  { title: '' },
  {
    title: 'Margin',
    width: 100,
    align: 'center',
    render: ({ is_show_margin, odds_margin }) => {
      if (is_show_margin !== 'Y')
        return (
          <Form.Item name="odds_margin" noStyle>
            <Amount />
          </Form.Item>
        )
      return (
        <Space.Compact>
          <Form.Item name="st_odds_margin" valuePropName="checked" noStyle>
            <Checkbox style={{ marginRight: 10 }} />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.st_odds_margin !== currentValues.st_odds_margin
            }
          >
            {({ getFieldValue }) => {
              const isChecked = getFieldValue('st_odds_margin')
              return (
                <Form.Item name="odds_margin" noStyle>
                  {!isChecked ? <Amount /> : <InputDecimal oldValue={odds_margin} />}
                </Form.Item>
              )
            }}
          </Form.Item>
        </Space.Compact>
      )
    },
  },
  {
    title: '',
    align: 'center',
    fixed: 'right',
    render: () => (
      <Button type="primary" htmlType="submit" className="w-100">
        Submit
      </Button>
    ),
    width: 100,
  },
]

export default useDefaultColumns
export { defaultColumnsGT }
