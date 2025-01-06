import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Checkbox,
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
import { gameTypeDescription, getScoringMatchOptions } from 'helper'
import actions from 'redux/scoring-match/actions'

const { Text } = Typography
const mapStateToProps = ({ scoringMatch }) => ({
  loading: scoringMatch.loadingSpecial,
  specialData: scoringMatch.specialData,
})

const mapDispatchToProps = dispatch => ({
  LoadSpecial: payload => {
    dispatch({
      type: actions.LOAD_SPECIAL,
      payload,
      source: 'Scoring Match',
    })
  },
  UpdateSpecial: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SCORING_MATCH_SPECIAL,
      payload,
      successCallback,
      source: 'Scoring Match',
    })
  },
})

const ScoringSpecialOther = ({
  specialValue,
  successCallback,

  loading,
  specialData,
  LoadSpecial,
  UpdateSpecial,
}) => {
  React.useEffect(() => {
    LoadSpecial(specialValue)
  }, [LoadSpecial, specialValue])

  const [form] = Form.useForm()
  const initialValues = React.useMemo(
    () =>
      // from array, convert to object
      specialData.reduce((acc, specialItem) => {
        const { game_type, fs_home, fs_away, is_scored } = specialItem
        acc[game_type] = specialItem

        if (
          [28, 29, 30, 34, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 1101, 1104, 1107, 1110, 1113].includes(game_type) && // prettier-ignore
          is_scored === 'N'
        ) {
          specialItem.fs_away = null
          specialItem.fs_home = null
          specialItem.ht_home = null
          specialItem.ht_away = null
        }

        let tempScore = ''
        if ([26].includes(game_type) && is_scored === 'N') {
          tempScore = '0'
        } else if ([26].includes(game_type) && is_scored === 'Y') {
          tempScore = `${fs_home}-${fs_away}`
        }
        acc[game_type] = {
          ...specialItem,
          tempScore,
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
              if (initialValues[key].game_type === 26 && val.tempScore) {
                const score = val.tempScore?.split('-')
                val.fs_home = Number(score[0])
                val.fs_away = Number(score[1])
              }
              const st_fs = getStFS(initialValues[key].game_type, val)
              return {
                match_id,
                game_type: Number(key),
                ...val,
                st_fs,
              }
            })
          UpdateSpecial(payload, successCallback)
        }}
      >
        <TableFormSpecial data={specialData} form={form} />
      </Form>
      <Text className="text-danger mt-10">Note: To reset score in textbox, just make it blank</Text>
    </Spin>
  )
}

const TableFormSpecial = ({ data, form }) => {
  if (data.length === 0) return null

  const onCheckAllGameType = e => {
    if (e.target.checked) {
      const selectAll = data.reduce((curr, next) => {
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
      const selectAll = data.reduce((curr, next) => {
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
      render: game_type => gameTypeDescription[game_type]?.long,
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
              <FormScoring game_type={game_type} />
            </Space>
            {is_scored === 'Y' && <span className="text-bold text-green">Scored</span>}
          </Row>
        )
      },
    },
  ]

  return <Table rowKey="game_type" columns={columns} dataSource={data} pagination={false} />
}

const FormScoring = ({ game_type }) => {
  if ([26].includes(game_type)) {
    const scoringOptions = getScoringMatchOptions(game_type)
    return (
      <Form.Item name={[game_type, 'tempScore']}>
        <Select options={scoringOptions} style={{ width: 200 }} />
      </Form.Item>
    )
  }

  if ([20, 21, 22, 23, 24, 25, 27, 33, 35].includes(game_type)) {
    const scoringOptions = getScoringMatchOptions(game_type)
    return (
      <Form.Item name={[game_type, 'fs_home']}>
        <Select options={scoringOptions} style={{ width: 200 }} />
      </Form.Item>
    )
  }

  if ([28, 34, 37, 38, 39, 40, 50, 1101, 1104, 1107, 1110, 1113].includes(game_type)) {
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
  }

  if ([29, 30, 41, 42, 43, 44, 45, 46, 47, 48, 49].includes(game_type)) {
    return (
      <Space direction="horizontal">
        HT
        <Form.Item name={[game_type, 'ht_home']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} />
        </Form.Item>
        -
        <Form.Item name={[game_type, 'ht_away']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} />
        </Form.Item>
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
  }
  return null
}
const getStFS = (game_type, value) => {
  if ([26].includes(game_type)) {
    if (value.tempScore === '0') return 'N'
    return 'Y'
  }
  if ([20, 21, 22, 23, 24, 25, 27, 33, 35].includes(game_type)) {
    if (value.fs_home === 0) return 'N'
    return 'Y'
  }
  if ([28, 34, 37, 38, 39, 40, 50, 1101, 1104, 1107, 1110, 1113].includes(game_type)) {
    if (value.fs_home === null && value.fs_away === null) {
      return 'N'
    }
    return 'Y'
  }
  if ([29, 30, 41, 42, 43, 44, 45, 46, 47, 48, 49].includes(game_type)) {
    if (
      value.fs_home === null &&
      value.fs_away === null &&
      value.ht_home === null &&
      value.ht_away === null
    )
      return 'N'
    return 'Y'
  }
  return ''
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoringSpecialOther)
