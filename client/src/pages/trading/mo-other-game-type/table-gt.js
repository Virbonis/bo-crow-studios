import React from 'react'
import { Button, Checkbox, Form, Select, Space } from 'antd'
import { listGT } from 'helper'
import { Amount, InputDecimal } from 'components/blaise'
import { isEqual, range } from 'lodash'
import { getValidatorOdds } from 'helper/form-validator'
import { defaultColumnsGT } from './hooks'
import { FormGT, TableGameType } from './table'

const TableGT = React.memo(
  ({ list, defaultColumns, onSubmit }) => {
    const mapColumns = React.useMemo(() => {
      return {
        // DC, TG, FHTG, FGLG, HTFT, FGM, TOTFG, ITA, WM
        DC: [
          ...defaultColumns,
          {
            title: '1X',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '12',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'X2', // as odds X
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        TG: [
          ...defaultColumns,
          {
            title: '0-1',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '2-3',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '4-6',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '7 & OVER',
            render: ({ game_type, odds4 }) => (
              <Form.Item name="odds4" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds4} className="bg-yellow" />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        FHTG: [
          ...defaultColumns,
          {
            title: '0-1',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '2-3',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '4 & OVER',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} className="bg-yellow" />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],

        FGLG: [
          ...defaultColumns,
          {
            title: 'HF',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'HL',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'AF',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'AL',
            render: ({ game_type, odds4 }) => (
              <Form.Item name="odds4" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds4} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'NG',
            render: ({ game_type, odds5 }) => (
              <Form.Item name="odds5" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds5} className="bg-yellow" />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        HTFT: [
          ...defaultColumns,
          {
            title: 'HH',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'HD',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'HA',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'DH',
            render: ({ game_type, odds4 }) => (
              <Form.Item name="odds4" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds4} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'DD',
            render: ({ game_type, odds5 }) => (
              <Form.Item name="odds5" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds5} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'DA',
            render: ({ game_type, odds6 }) => (
              <Form.Item name="odds6" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds6} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'AH',
            render: ({ game_type, odds7 }) => (
              <Form.Item name="odds7" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds7} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'AD',
            render: ({ game_type, odds8 }) => (
              <Form.Item name="odds8" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds8} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'AA',
            render: ({ game_type, odds9 }) => (
              <Form.Item name="odds9" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds9} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],

        FGM: [
          ...defaultColumns,
          {
            title: 'Free Kick',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Header',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'No Goal',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Own Goal',
            render: ({ game_type, odds4 }) => (
              <Form.Item name="odds4" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds4} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Penalty',
            render: ({ game_type, odds5 }) => (
              <Form.Item name="odds5" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds5} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Shot',
            render: ({ game_type, odds6 }) => (
              <Form.Item name="odds6" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds6} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        TOTFG: [
          ...defaultColumns,
          {
            title: '27th Minute Onwards',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
            ellipsis: true,
          },
          {
            title: 'Up To And Including The 26th Minute',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
            ellipsis: true,
          },
          {
            title: 'No Goal',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
            ellipsis: true,
          },
          ...defaultColumnsGT,
        ],
        ITA: [
          ...defaultColumns,
          {
            title: 'None',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '1 Min',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '2 Min',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '3 Min',
            render: ({ game_type, odds4 }) => (
              <Form.Item name="odds4" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds4} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '4 Min',
            render: ({ game_type, odds5 }) => (
              <Form.Item name="odds5" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds5} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '5 Min More',
            render: ({ game_type, odds6 }) => (
              <Form.Item name="odds6" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds6} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        WM: [
          ...defaultColumns,
          {
            title: 'Draw',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Home 1 Goal',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Home 2 Goal',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Home 3 Goal',
            render: ({ game_type, odds4 }) => (
              <Form.Item name="odds4" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds4} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Home 4 Goal',
            render: ({ game_type, odds5 }) => (
              <Form.Item name="odds5" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds5} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Away 1 Goal',
            render: ({ game_type, odds6 }) => (
              <Form.Item name="odds6" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds6} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Away 2 Goal',
            render: ({ game_type, odds7 }) => (
              <Form.Item name="odds7" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds7} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Away 3 Goal',
            render: ({ game_type, odds8 }) => (
              <Form.Item name="odds8" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds8} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Away 4 Goal',
            render: ({ game_type, odds9 }) => (
              <Form.Item name="odds9" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds9} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'No Goal',
            render: ({ game_type, odds10 }) => (
              <Form.Item name="odds10" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds10} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],

        // CS, FHCS, CSH, 3WH
        CSH: [
          ...defaultColumns,
          {
            title: 'Home Yes',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} className="bg-yellow" />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Home No',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Margin',
            width: 150,
            render: ({ is_show_margin, odds_margin }) => {
              if (is_show_margin !== 'Y')
                return (
                  <Form.Item name="odds_margin" noStyle>
                    <Amount />
                  </Form.Item>
                )
              return (
                <Space>
                  <Form.Item name="st_odds_margin" valuePropName="checked" noStyle>
                    <Checkbox />
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
                          {!isChecked ? (
                            <Amount />
                          ) : (
                            <InputDecimal oldValue={odds_margin} disabled={!isChecked} />
                          )}
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Space>
              )
            },
          },
          {
            title: 'Away Yes',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} className="bg-yellow" />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Away No',
            render: ({ game_type, odds4 }) => (
              <Form.Item name="odds4" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds4} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Margin',
            width: 150,
            render: ({ is_show_margin, odds_margin2 }) => {
              if (is_show_margin !== 'Y')
                return (
                  <Form.Item name="odds_margin2" noStyle>
                    <Amount />
                  </Form.Item>
                )
              return (
                <Space.Compact>
                  <Form.Item name="st_odds_margin2" valuePropName="checked" noStyle>
                    <Checkbox style={{ marginRight: 10 }} />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.st_odds_margin2 !== currentValues.st_odds_margin2
                    }
                  >
                    {({ getFieldValue }) => {
                      const isChecked = getFieldValue('st_odds_margin2')
                      return (
                        <Form.Item name="odds_margin2" noStyle>
                          {!isChecked ? (
                            <Amount />
                          ) : (
                            <InputDecimal oldValue={odds_margin2} disabled={!isChecked} />
                          )}
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Space.Compact>
              )
            },
          },
          { title: '' },
          {
            title: '',
            render: () => (
              <Button type="primary" htmlType="submit" className="w-100">
                Submit
              </Button>
            ),
            width: 100,
          },
        ],
        '3WH': [
          ...defaultColumns,
          {
            title: 'Hdp',
            render: () => (
              <Form.Item name="handicap" noStyle>
                <Select
                  size="small"
                  className="w-100"
                  suffixIcon={null}
                  options={range(-10, 11).map(i => ({ value: i, label: i }))}
                />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Home Team',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Draw',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Away Team',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        CS: [
          ...defaultColumns,
          {
            title: '1:0',
            render: ({ game_type, odds1, odds12 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds1"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds1} />
                </Form.Item>
                <Form.Item
                  name="odds12"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds12} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '2:0',
            render: ({ game_type, odds2, odds13 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds2"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds2} />
                </Form.Item>
                <Form.Item
                  name="odds13"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds13} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '2:1',
            render: ({ game_type, odds3, odds14 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds3"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds3} />
                </Form.Item>
                <Form.Item
                  name="odds14"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds14} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '3:0',
            render: ({ game_type, odds4, odds15 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds4"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds4} />
                </Form.Item>
                <Form.Item
                  name="odds15"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds15} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '3:1',
            render: ({ game_type, odds5, odds16 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds5"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds5} />
                </Form.Item>
                <Form.Item
                  name="odds16"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds16} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '3:2',
            render: ({ game_type, odds6, odds17 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds6"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds6} />
                </Form.Item>
                <Form.Item
                  name="odds17"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds17} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '4:0',
            render: ({ game_type, odds7, odds18 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds7"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds7} />
                </Form.Item>
                <Form.Item
                  name="odds18"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds18} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '4:1',
            render: ({ game_type, odds8, odds19 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds8"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds8} />
                </Form.Item>
                <Form.Item
                  name="odds19"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds19} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '4:2',
            render: ({ game_type, odds9, odds20 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds9"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds9} />
                </Form.Item>
                <Form.Item
                  name="odds20"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds20} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '4:3',
            render: ({ game_type, odds10, odds21 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds10"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds10} />
                </Form.Item>
                <Form.Item
                  name="odds21"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds21} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: 'AOS',
            render: ({ game_type, odds11 }) => (
              <Form.Item name="odds11" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds11} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '0:0',
            render: ({ game_type, odds23 }) => (
              <Form.Item name="odds23" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds23} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '1:1',
            render: ({ game_type, odds24 }) => (
              <Form.Item name="odds24" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds24} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '2:2',
            render: ({ game_type, odds25 }) => (
              <Form.Item name="odds25" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds25} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '3:3',
            render: ({ game_type, odds26 }) => (
              <Form.Item name="odds26" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds26} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '4:4',
            render: ({ game_type, odds27 }) => (
              <Form.Item name="odds27" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds27} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        FHCS: [
          ...defaultColumns,
          {
            title: '1:0',
            render: ({ game_type, odds1, odds12 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds1"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds1} />
                </Form.Item>
                <Form.Item
                  name="odds12"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds12} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '2:0',
            render: ({ game_type, odds2, odds13 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds2"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds2} />
                </Form.Item>
                <Form.Item
                  name="odds13"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds13} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '2:1',
            render: ({ game_type, odds3, odds14 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds3"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds3} />
                </Form.Item>
                <Form.Item
                  name="odds14"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds14} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '3:0',
            render: ({ game_type, odds4, odds15 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds4"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds4} />
                </Form.Item>
                <Form.Item
                  name="odds15"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds15} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '3:1',
            render: ({ game_type, odds5, odds16 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds5"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds5} />
                </Form.Item>
                <Form.Item
                  name="odds16"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds16} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: '3:2',
            render: ({ game_type, odds6, odds17 }) => (
              <Space direction="vertical">
                <Form.Item
                  name="odds6"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds6} />
                </Form.Item>
                <Form.Item
                  name="odds17"
                  rules={[{ validator: getValidatorOdds(game_type) }]}
                  noStyle
                >
                  <InputDecimal oldValue={odds17} />
                </Form.Item>
              </Space>
            ),
            width: 75,
          },
          {
            title: 'AOS',
            render: ({ game_type, odds11 }) => (
              <Form.Item name="odds11" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds11} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '0:0',
            render: ({ game_type, odds23 }) => (
              <Form.Item name="odds23" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds23} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '1:1',
            render: ({ game_type, odds24 }) => (
              <Form.Item name="odds24" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds24} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '2:2',
            render: ({ game_type, odds25 }) => (
              <Form.Item name="odds25" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds25} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '3:3',
            render: ({ game_type, odds26 }) => (
              <Form.Item name="odds26" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds26} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
      }
    }, [defaultColumns])

    return (
      <>
        {Object.entries(mapColumns)
          .map(([gt, columns]) => {
            const game_type = listGT[gt][0]
            return [game_type, columns, list.find(y => y.game_type === game_type)]
          })
          .filter(([, , data]) => data)
          .map(([game_type, columns, data]) => {
            return (
              <FormGT key={game_type} game_type={game_type} data={data} onSubmit={onSubmit}>
                <TableGameType dataSource={[data]} columns={columns} />
              </FormGT>
            )
          })}
      </>
    )
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
)

export default TableGT
