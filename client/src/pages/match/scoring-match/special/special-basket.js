import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Checkbox,
  Divider,
  Form,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from 'antd'
import {
  gameTypeDescription,
  getBetChoice,
  ListChoiceBasketByGameType,
  ListGTScoringCanDraw,
  ListGTScoringDropdown,
  ListGTScoringInput,
  MapListSpecialBasket,
} from 'helper'
import actions from 'redux/scoring-match/actions'
import MainRoundScoreBasketSpecial from './special-basket-main-round'

const { Text } = Typography
const mapStateToProps = ({ scoringMatch }) => ({
  loading: scoringMatch.loadingSpecial,
  specialData: scoringMatch.specialData,
  specialScore: scoringMatch.specialDataScore,
  specialLiveScore: scoringMatch.specialDataLiveScore,
})

const mapDispatchToProps = dispatch => ({
  LoadSpecialBasket: payload => {
    dispatch({
      type: actions.LOAD_SPECIAL_BASKET,
      payload,
      source: 'Scoring Match',
    })
  },
  UpdateSpecialBasket: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SCORING_MATCH_SPECIAL_BASKET,
      payload,
      successCallback,
      source: 'Scoring Match',
    })
  },
})

const basketRound = Object.keys(MapListSpecialBasket)
const ScoringSpecialBasket = ({
  specialValue,
  successCallback,

  loading,
  specialData,
  specialScore,
  specialLiveScore,
  LoadSpecialBasket,
  UpdateSpecialBasket,
}) => {
  React.useEffect(() => {
    LoadSpecialBasket(specialValue)
  }, [LoadSpecialBasket, specialValue])

  const [form] = Form.useForm()
  const initialValues = React.useMemo(
    () =>
      // from array, convert to object
      specialData.reduce((acc, specialItem) => {
        const { game_type, fs_home } = specialItem
        acc[game_type] = specialItem

        if (game_type === 1280) {
          const scoreQ = fs_home.toString()
          acc[game_type] = {
            ...specialItem,
            reset: false,
            q1: Number(scoreQ.charAt(0)) === 0 ? 1 : Number(scoreQ.charAt(0)),
            q2: Number(scoreQ.charAt(1)) === 0 ? 1 : Number(scoreQ.charAt(1)),
            q3: Number(scoreQ.charAt(2)) === 0 ? 1 : Number(scoreQ.charAt(2)),
            q4: Number(scoreQ.charAt(3)) === 0 ? 1 : Number(scoreQ.charAt(3)),
          }
        }
        return acc
      }, {}),
    [specialData],
  )
  useEffect(() => {
    form.resetFields()
  }, [form, initialValues])

  const { match_id } = specialValue
  return (
    <Spin spinning={loading}>
      <MainRoundScoreBasketSpecial
        score={specialScore}
        livescore={specialLiveScore}
        home={specialValue.home_name}
        away={specialValue.away_name}
        successCallback={() => {
          LoadSpecialBasket(specialValue)
        }}
      />
      <Divider />
      <Form
        form={form}
        id="special-form"
        initialValues={initialValues}
        onFinish={values => {
          const anyChecked = Object.values(values).some(x => x.isSubmit)
          if (anyChecked === false) {
            message.warning('Please at least check one checkbox')
            return
          }

          // from object, convert to array
          const payload = Object.entries(values)
            .filter(([, val]) => val.isSubmit)
            .map(([key, val]) => {
              let data
              if (ListGTScoringInput.includes(Number(key))) {
                data = {
                  match_id,
                  game_type: Number(key),
                  fs_home: ['', undefined].includes(val.fs_home) ? null : val.fs_home.toString(),
                  fs_away: ['', undefined].includes(val.fs_away) ? null : val.fs_away.toString(),
                  st_fs: 'Y',
                }
              } else if (ListGTScoringDropdown.includes(Number(key))) {
                data = {
                  match_id,
                  game_type: Number(key),
                  fs_home: val.fs_home === 0 ? null : val.fs_home.toString(),
                  fs_away: null,
                  st_fs: 'Y',
                }
              } else if (Number(key) === 1280) {
                data = {
                  match_id,
                  game_type: Number(key),
                  ...val,
                  fs_home: val.reset ? null : `${val.q1}${val.q2}${val.q3}${val.q4}`,
                  st_fs: 'Y',
                }
              }
              return data
            })
          UpdateSpecialBasket(payload, successCallback)
        }}
      >
        <div style={{ width: '100%', overflow: 'scroll', height: '50vh' }}>
          {basketRound.map(round => (
            <TableFormSpecialBasket key={round} data={specialData} round={round} form={form} />
          ))}
        </div>
      </Form>
      <Text className="text-danger mt-10">Note: To reset score in textbox, just make it blank</Text>
    </Spin>
  )
}

const TableFormSpecialBasket = ({ data, round, form }) => {
  const dataSource = data
    ?.filter(x => MapListSpecialBasket[round].includes(x.game_type))
    .sort((a, b) => a.game_type - b.game_type)
  if (dataSource.length === 0) return null

  const onCheckAllGameType = e => {
    if (e.target.checked) {
      const selectAll = dataSource.reduce((curr, next) => {
        return {
          ...curr,
          [next.game_type]: {
            ...form.getFieldsValue()[next.game_type],
            isSubmit: true,
          },
        }
      }, {})
      form.setFieldsValue({ ...form.getFieldsValue(), ...selectAll })
    } else {
      const selectAll = dataSource.reduce((curr, next) => {
        return {
          ...curr,
          [next.game_type]: {
            ...form.getFieldsValue()[next.game_type],
            isSubmit: false,
          },
        }
      }, {})
      form.setFieldsValue({ ...form.getFieldsValue(), ...selectAll })
    }
  }

  const columns = [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      width: 300,
      render: game_type => {
        if (game_type === 1241) return 'Quarter 1(Handicap, Over / Under, Odd / Even, Money Line)'
        if (game_type === 1242) return 'Quarter 2(Handicap, Over / Under, Odd / Even, Money Line)'
        if (game_type === 1243) return 'Quarter 3(Handicap, Over / Under, Odd / Even, Money Line)'
        if (game_type === 1244) return 'Quarter 4(Handicap, Over / Under, Odd / Even, Money Line)'

        return gameTypeDescription[game_type]?.long
      },
    },
    {
      title: <Checkbox onChange={onCheckAllGameType}>Scoring</Checkbox>,
      width: 300,
      render: ({ game_type, is_scored }) => {
        return (
          <Row justify="space-between">
            <Space align="start">
              <Form.Item name={[game_type, 'isSubmit']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
              <FormScoringBasket game_type={game_type} />
            </Space>
            {is_scored === 'Y' && <span className="text-bold text-green">Scored</span>}
          </Row>
        )
      },
    },
  ]

  return (
    <Table
      title={() => <div className="text-bold text-center">{round}</div>}
      rowKey="game_type"
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  )
}
const FormScoringBasket = ({ game_type }) => {
  if (ListGTScoringInput.includes(game_type))
    return (
      <Space direction="horizontal">
        FS
        <Form.Item name={[game_type, 'fs_home']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} />
        </Form.Item>
        -
        <Form.Item name={[game_type, 'fs_away']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} />
        </Form.Item>
      </Space>
    )

  if (ListGTScoringDropdown.includes(game_type)) {
    const scoringOptions = [
      { value: 0, label: 'Unscored/To Reset' },
      ...ListChoiceBasketByGameType(game_type).map((betcode, idx) => ({
        value: idx + 1,
        label: getBetChoice(betcode),
      })),
    ]
    const canDraw = ListGTScoringCanDraw.includes(game_type)
    if (canDraw) scoringOptions.push({ value: -1, label: 'None' })

    return (
      <Form.Item name={[game_type, 'fs_home']}>
        <Select options={scoringOptions} style={{ width: '250px' }} />
      </Form.Item>
    )
  }

  if (game_type === 1280)
    return (
      <Form.Item
        shouldUpdate={(prev, next) =>
          prev[game_type].reset !== next[game_type].reset && next[game_type].reset !== undefined
        }
      >
        {({ getFieldValue }) => {
          const isReset = getFieldValue([game_type, 'reset'])
          const option = [
            { value: 1, label: 'Home Win' },
            { value: 2, label: 'Away Win' },
            { value: 3, label: 'AOS' },
          ]
          const listQ = ['q1', 'q2', 'q3', 'q4']
          return (
            <div>
              <Form.Item
                name={[game_type, 'reset']}
                valuePropName="checked"
                style={{ width: '300px' }}
              >
                <Checkbox>Unscored / To Reset</Checkbox>
              </Form.Item>
              {!isReset &&
                listQ.map(q => (
                  <Form.Item
                    key={q}
                    label={q.toUpperCase()}
                    name={[game_type, q]}
                    // style={{ width: '100px' }}
                  >
                    <Select options={option} style={{ width: '250px' }} />
                  </Form.Item>
                ))}
            </div>
          )
        }}
      </Form.Item>
    )

  return `${game_type} Game Type not found`
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoringSpecialBasket)
