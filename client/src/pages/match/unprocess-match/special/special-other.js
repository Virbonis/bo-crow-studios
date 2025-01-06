import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/unprocess-match/actions'
import { Form, Checkbox, Select, Row, InputNumber, message, Spin, Table, Space, Input } from 'antd'
import { gameTypeDescription, getScoringMatchOptions } from 'helper'

const mapStateToProps = ({ unprocessMatch }) => ({
  loading: unprocessMatch.loadingSpecial,
  specialData: unprocessMatch.dataSpecial,
})

const mapDispatchToProps = dispatch => ({
  LoadSpecial: payload => {
    dispatch({
      type: actions.LOAD_SPECIAL,
      payload,
      source: 'Unprocess Match',
    })
  },
  UnprocessMatchSpecial: (payload, successCallback) => {
    dispatch({
      type: actions.UNPROCESS_MATCH_SPECIAL,
      payload,
      successCallback,
      source: 'Unprocess Match',
    })
  },
})

const UnProcessSpecialOther = ({
  specialValue,
  successCallback,

  loading,
  specialData,
  LoadSpecial,
  UnprocessMatchSpecial,
}) => {
  useEffect(() => {
    LoadSpecial(specialValue)
  }, [LoadSpecial, specialValue])

  const [form] = Form.useForm()
  const initialValues = React.useMemo(
    () =>
      specialData.reduce((acc, specialItem) => {
        const { game_type, fs_home, fs_away } = specialItem

        let tempScore = ''
        if (game_type === 26 && tempScore !== '0') {
          tempScore = `${fs_home}-${fs_away}`
        } else {
          tempScore = '0'
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

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        id="special-form"
        initialValues={initialValues}
        onFinish={values => {
          const anyChecked = Object.values(values).some(x => x.isSubmit)
          if (anyChecked === false) {
            message.warning('Please check at least one checkbox')
            return
          }

          const items = Object.entries(values)
            .filter(([key, val]) => key !== 'reason' && val.isSubmit)
            .map(([key]) => ({
              process_type: -1 * initialValues[key].game_type,
              game_type_description: gameTypeDescription[initialValues[key].game_type]?.long,
            }))

          const payload = {
            match_id: specialValue.match_id,
            sport_id: specialValue.sport_id,
            reason: values.reason,
            items,
          }
          UnprocessMatchSpecial(payload, successCallback)
        }}
      >
        <TableFormSpecial data={specialData} form={form} />
        <Form.Item name="reason" label="Reason">
          <Input.TextArea rows={4} placeholder="Input Reason" />
        </Form.Item>
      </Form>
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
      title: <Checkbox onChange={onCheckAllGameType}>UnProcess</Checkbox>,
      width: 300,
      render: ({ game_type, is_cancelled }) => {
        return (
          <Row justify="space-between">
            <Space align="start">
              <Form.Item name={[game_type, 'isSubmit']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
              <FormScoring game_type={game_type} />
            </Space>
            {is_cancelled === 'Y' && <span className="text-bold text-red">Cancelled</span>}
          </Row>
        )
      },
    },
  ]

  return <Table rowKey="game_type" columns={columns} dataSource={data} pagination={false} />
}

const FormScoring = ({ game_type }) => {
  // same with FormScoring in scoring-match, but with disabled
  if ([26].includes(game_type)) {
    const scoringOptions = getScoringMatchOptions(game_type)
    return (
      <Form.Item name={[game_type, 'tempScore']}>
        <Select options={scoringOptions} style={{ width: 200 }} disabled />
      </Form.Item>
    )
  }

  if ([20, 21, 22, 23, 24, 25, 27, 33, 35].includes(game_type)) {
    const scoringOptions = getScoringMatchOptions(game_type)
    return (
      <Form.Item name={[game_type, 'fs_home']}>
        <Select options={scoringOptions} style={{ width: 200 }} disabled />
      </Form.Item>
    )
  }

  if ([28, 34, 37, 38, 39, 40, 50, 1101, 1104, 1107, 1110, 1113].includes(game_type)) {
    return (
      <Space direction="horizontal">
        FS
        <Form.Item name={[game_type, 'fs_home']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} disabled />
        </Form.Item>
        -
        <Form.Item name={[game_type, 'fs_away']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} disabled />
        </Form.Item>
      </Space>
    )
  }

  if ([29, 30, 41, 42, 43, 44, 45, 46, 47, 48, 49].includes(game_type)) {
    return (
      <Space direction="horizontal">
        HT
        <Form.Item name={[game_type, 'ht_home']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} disabled />
        </Form.Item>
        -
        <Form.Item name={[game_type, 'ht_away']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} disabled />
        </Form.Item>
        FS
        <Form.Item name={[game_type, 'fs_home']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} disabled />
        </Form.Item>
        -
        <Form.Item name={[game_type, 'fs_away']}>
          <InputNumber style={{ width: 50 }} min={0} maxLength={3} controls={false} disabled />
        </Form.Item>
      </Space>
    )
  }
  return null
}

export default connect(mapStateToProps, mapDispatchToProps)(UnProcessSpecialOther)
