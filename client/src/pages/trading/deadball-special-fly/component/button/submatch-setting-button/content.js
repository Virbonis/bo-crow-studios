import React from 'react'
import { connect } from 'react-redux'
import {
  Checkbox,
  Form,
  Space,
  InputNumber,
  Row,
  Select,
  Table,
  message,
  Col,
  Typography,
} from 'antd'
import { gameTypeDescription, choiceOptions } from 'helper'
import { range } from 'lodash'
import actionsSubMatchSetting from 'redux/edit-sub-match-setting/actions'
import { Amount, InputDecimal } from 'components/blaise'
import ButtonAddAutoSubMatchMore from 'pages/trading/shared-components/add-auto-sub-match-more-button'
import getOnValuesChange from './helper-form'
import FormItemOdds from './form-item-odds'
import './custom.scss'

const { Text } = Typography

const mapStateToProps = ({ editSubMatchSetting }) => ({
  test: editSubMatchSetting,
  loading: editSubMatchSetting.loading,
  tableData: editSubMatchSetting.data.result,
  // sportOptions: sport.select,
})

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  Load: payload => {
    dispatch({
      type: actionsSubMatchSetting.LOAD_SPECIAL,
      payload,
      source: 'Edit Deadball Special',
    })
  },
  Update: payload => {
    dispatch({
      type: actionsSubMatchSetting.UPDATE_SPECIAL,
      payload,
      successCallback,
      source: 'Edit Deadball Special',
    })
  },
  CleanUp: () => dispatch({ type: actionsSubMatchSetting.CLEAN_UP }),
})

const Content = ({
  record,
  match,
  lastFetchGameType,
  loading,
  tableData = [],
  // sportOptions,
  Load,
  Update,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])
  const {
    match_id,
    sub_match_id,
    // sport_id, league_name, home_name, away_name
  } = record
  React.useEffect(() => {
    Load({
      match_id,
      sub_match_id,
      game_type: lastFetchGameType,
    })
    setSelectedRow([])
  }, [match_id, sub_match_id, lastFetchGameType, Load])

  const [form] = Form.useForm()
  const [selectedRow, setSelectedRow] = React.useState([])

  const initialValues = React.useMemo(() => {
    return tableData.reduce((acc, curr) => {
      const { game_type, sub_match_parlay_status, st_odds_margin } = curr
      acc[game_type] = {
        ...curr,
        sub_match_parlay_status: sub_match_parlay_status === 'Y',
        st_odds_margin: st_odds_margin === 'Y',
        st_odds_margin2: st_odds_margin === 'Y',
      }
      return acc
    }, {})
  }, [tableData])

  React.useEffect(() => {
    form.resetFields()
  }, [form, initialValues])

  // GET FIRST GAMETYPE TO DETERMINE GAMETYPE GROUP e.g. 28, HNB,ANB,DNB
  const firstGameType = Number(lastFetchGameType.split(',')[0])

  return (
    <>
      {/* <Descriptions size="small" column={1}>
        <Descriptions.Item label="Match ID">{match_id}</Descriptions.Item>
        <Descriptions.Item label="Sport">
          {sportOptions.find(e => e.sport_id === sport_id).name}
        </Descriptions.Item>
        <Descriptions.Item label="League">{league_name}</Descriptions.Item>
        <Descriptions.Item label="Home Away">
          {home_name} {away_name}
        </Descriptions.Item>
      </Descriptions>
      <br /> */}
      <Row justify="space-between" align="middle">
        <Text className="h4 font-weight-bold" />
        <ButtonAddAutoSubMatchMore match={match} frompage="deadball" />
      </Row>
      <Form
        id="deadball-special-edit"
        form={form}
        initialValues={initialValues}
        onValuesChange={getOnValuesChange(form)}
        onFinish={values => {
          // FOR MULTI GAMETYPE CONDITION
          if (![39, 40, 21, 25, 27, 35].includes(firstGameType) && selectedRow.length === 0) {
            return message.error('Please checked Game Type to update')
          }
          const convertValue =
            selectedRow.length !== 0
              ? Object.entries(values)
                  .filter(([key]) => selectedRow.includes(Number(key)))
                  .map(([key, val]) => ({
                    ...initialValues[key],
                    ...val,
                    match_id,
                    game_type: Number(key),
                    st_odds_margin: val.st_odds_margin ? 'Y' : 'N',
                    st_odds_margin2: val.st_odds_margin2 ? 'Y' : 'N',
                    sub_match_parlay_status: val.sub_match_parlay_status ? 'Y' : 'N',
                  }))
              : Object.entries(values).map(([key, val]) => ({
                  ...initialValues[key],
                  ...val,
                  match_id,
                  game_type: Number(key),
                  st_odds_margin: val.st_odds_margin ? 'Y' : 'N',
                  st_odds_margin2: val.st_odds_margin2 ? 'Y' : 'N',
                  sub_match_parlay_status: val.sub_match_parlay_status ? 'Y' : 'N',
                }))
          return Update(convertValue)
        }}
      >
        {![28, 37, 38].includes(firstGameType) ? (
          <Table
            rowKey="game_type"
            size="small"
            columns={getColumns(firstGameType)}
            loading={loading}
            dataSource={tableData}
            pagination={false}
            bordered
            style={{ width: '100%' }}
            rowSelection={
              // CHECK IF IT'S NOT MULTI GAMETYPE THEN DISBALE ROW SELECTION
              ![39, 40, 21, 25, 27, 35].includes(firstGameType) && {
                selectedRowKeys: selectedRow,
                onChange: selectedRowKeys => {
                  setSelectedRow(selectedRowKeys)
                },
              }
            }
          />
        ) : (
          tableData.map((e, index) => {
            return (
              <Table
                key={e.game_type}
                rowKey="game_type"
                size="small"
                columns={getColumns(e.game_type)}
                loading={loading}
                dataSource={[tableData[index]]}
                pagination={false}
                bordered
                style={{ width: '100%' }}
                rowSelection={{
                  hideSelectAll: true,
                  onSelect: (selectedRecord, selected) => {
                    if (selected) setSelectedRow(selectedRow.concat(selectedRecord.game_type))
                    else setSelectedRow(selectedRow.filter(x => x !== selectedRecord.game_type))
                  },
                  selectedRowKeys: selectedRow,
                }}
              />
            )
          })
        )}
      </Form>
    </>
  )
}
const getColumns = game_type => {
  const columns = [
    Table.SELECTION_COLUMN,
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      width: 200,
      render: text => gameTypeDescription[text]?.long,
    },
    ...getColumnsOddsSetting(game_type),
    ...getOtherSetting(game_type),
  ]
  // FOR SINGLE GAME_TYPE, remove selection column
  if ([39, 40, 21, 25, 27, 35].includes(game_type)) columns.shift()
  return columns
}
// Render Input for Odds and Margin
const getColumnsOddsSetting = game_type => {
  if (game_type !== 40)
    return [
      {
        title: 'Odds',
        children: choiceOptions[game_type]?.map((e, index) => ({
          title: e.label,
          align: 'center',
          width: 150,
          render: record => (
            <FormItemOdds
              game_type={record.game_type}
              name={[record.game_type, `odds${index + 1}`]}
              asOddsX={isOddsX(record.game_type, index + 1)}
            />
          ),
        })),
      },
      {
        title: 'Margin',
        align: 'center',
        width: 100,
        render: record => {
          const is_show_margin = [20, 26, 34, 41, 42, 43, 44, 45, 46, 47, 40, 37, 38].includes(
            record.game_type,
          )
          return (
            <Row justify="space-between">
              <Col span={4}>
                {is_show_margin && (
                  <Form.Item name={[record.game_type, 'st_odds_margin']} valuePropName="checked">
                    <Checkbox style={{ marginRight: 10 }} />
                  </Form.Item>
                )}
              </Col>
              <Col span={20}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues[record.game_type]?.st_odds_margin !==
                    currentValues[record.game_type]?.st_odds_margin
                  }
                >
                  {({ getFieldValue }) => {
                    const isChecked = getFieldValue([record.game_type, 'st_odds_margin'])
                    return (
                      <Form.Item name={[record.game_type, 'odds_margin']}>
                        {!isChecked || !is_show_margin ? (
                          <Amount />
                        ) : (
                          <InputNumber
                            controls={false}
                            className="input-center"
                            step={0.01}
                            min={0}
                            maxLength={6}
                            style={{ width: 70 }}
                          />
                        )}
                      </Form.Item>
                    )
                  }}
                </Form.Item>
              </Col>
            </Row>
          )
        },
      },
    ]
  // csh, split 2 column
  const firstArray = choiceOptions[game_type].slice(0, 2)
  const secondArray = choiceOptions[game_type].slice(2)
  return [
    {
      title: 'Odds',
      children: firstArray.map((e, index) => ({
        title: e.label,
        align: 'center',
        width: 150,
        render: record => (
          <FormItemOdds
            game_type={record.game_type}
            name={[record.game_type, `odds${index + 1}`]}
            asOddsX={isOddsX(record.game_type, index + 1)}
          />
        ),
      })),
    },
    {
      title: 'Margin',
      align: 'center',
      width: 100,
      render: record => (
        <Space>
          <Form.Item name={[record.game_type, 'st_odds_margin']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues[record.game_type]?.st_odds_margin !==
              currentValues[record.game_type]?.st_odds_margin
            }
          >
            {({ getFieldValue }) => {
              const isChecked = getFieldValue([record.game_type, 'st_odds_margin'])
              return (
                <Form.Item name={[record.game_type, 'odds_margin']}>
                  {!isChecked ? <Amount /> : <InputDecimal oldValue={record.odds_margin} />}
                </Form.Item>
              )
            }}
          </Form.Item>
        </Space>
      ),
    },
    {
      title: 'Odds',
      children: secondArray.map((e, index) => ({
        title: e.label,
        align: 'center',
        width: 150,
        render: record => (
          <FormItemOdds
            game_type={game_type}
            name={[record.game_type, `odds${index + 3}`]}
            asOddsX={isOddsX(game_type, index + 3)}
          />
        ),
      })),
    },
    {
      title: 'Margin',
      align: 'center',
      width: 100,
      render: record => (
        <Space>
          <Form.Item name={[record.game_type, 'st_odds_margin2']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues[record.game_type]?.st_odds_margin2 !==
              currentValues[record.game_type]?.st_odds_margin2
            }
          >
            {({ getFieldValue }) => {
              const isChecked = getFieldValue([record.game_type, 'st_odds_margin2'])
              return (
                <Form.Item name={[record.game_type, 'odds_margin2']}>
                  {!isChecked ? <Amount /> : <InputDecimal oldValue={record.odds_margin} />}
                </Form.Item>
              )
            }}
          </Form.Item>
        </Space>
      ),
    },
  ]
}
// Render Input for Handicap and Parlay
const getOtherSetting = game_type => {
  const handicapOptions = range(-10, 11, 1).map(e => ({ value: e, label: e }))
  const columns = [
    {
      title: 'Handicap',
      align: 'center',
      width: 100,
      render: record => (
        <Form.Item name={[record.game_type, 'handicap']}>
          <Select options={handicapOptions} />
        </Form.Item>
      ),
    },
    {
      title: 'Parlay',
      align: 'center',
      width: 100,
      render: record => (
        <Form.Item name={[record.game_type, 'sub_match_parlay_status']} valuePropName="checked">
          <Checkbox />
        </Form.Item>
      ),
    },
  ]
  if (game_type !== 39) columns.shift() // GameType Not 3WH
  return columns
}
const isOddsX = (game_type, index) => {
  if (game_type === 40 && (index === 1 || index === 3)) return true
  if ([41, 42, 43, 44, 45, 46, 47].includes(game_type) && index === 1) return true
  if ([20, 26, 34, 37, 38].includes(game_type) && index === 2) return true
  return false
}

export default connect(mapStateToProps, mapDispatchToProps)(Content)
