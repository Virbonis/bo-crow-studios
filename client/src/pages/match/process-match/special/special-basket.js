import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/process-match/actions'
import { Form, Checkbox, Row, message, Spin, Table, Space } from 'antd'
import { gameTypeDescription, getScoreGameTypeSpecial, MapListSpecialBasket } from 'helper'

const mapStateToProps = ({ processMatch }) => ({
  loading: processMatch.loadingSpecial,
  specialData: processMatch.dataSpecial,
})

const mapDispatchToProps = dispatch => ({
  LoadSpecial: payload => {
    dispatch({
      type: actions.LOAD_SPECIAL,
      payload,
      source: 'Process Match',
    })
  },
  ProcessMatchSpecial: (payload, successCallback) => {
    dispatch({
      type: actions.PROCESS_MATCH_SPECIAL,
      payload,
      successCallback,
      source: 'Process Match',
    })
  },
})

const basketRound = Object.keys(MapListSpecialBasket)
const Special = ({
  specialValue,
  successCallback,

  loading,
  specialData,
  LoadSpecial,
  ProcessMatchSpecial,
}) => {
  useEffect(() => {
    LoadSpecial(specialValue)
  }, [LoadSpecial, specialValue])

  const [form] = Form.useForm()
  const initialValues = React.useMemo(
    () =>
      specialData.reduce((acc, specialItem) => {
        const { game_type } = specialItem
        acc[game_type] = specialItem
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
            message.warning('Please at least check one checkbox')
            return
          }

          const items = Object.entries(values)
            .filter(([, val]) => val.isSubmit)
            .map(([key]) => ({
              process_type: initialValues[key].game_type,
              game_type_description: gameTypeDescription[initialValues[key].game_type]?.long,
            }))

          const payload = {
            match_id: specialValue.match_id,
            sport_id: specialValue.sport_id,
            items,
          }
          ProcessMatchSpecial(payload, successCallback)
        }}
      >
        <div style={{ width: '100%', overflow: 'scroll', height: '50vh' }}>
          {basketRound.map(round => (
            <TableFormSpecialBasket key={round} data={specialData} round={round} form={form} />
          ))}
        </div>
      </Form>
    </Spin>
  )
}

const TableFormSpecialBasket = ({ round, data, form }) => {
  const dataSource = data
    ?.filter(x => MapListSpecialBasket[round].includes(x.game_type))
    .sort((a, b) => a.game_type - b.game_type)
  if (dataSource.length === 0) return null

  const checkAllGameType = e => {
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
      title: <Checkbox onChange={checkAllGameType}>Process</Checkbox>,
      width: 300,
      render: ({ game_type, is_cancelled, fs_home, fs_away }) => {
        const isCancelled = is_cancelled === 'Y'
        return (
          <Row justify="space-between">
            <Space>
              <Form.Item name={[game_type, 'isSubmit']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
              {!isCancelled && getScoreGameTypeSpecial(game_type, 0, 0, fs_home, fs_away)}
            </Space>
            {isCancelled && <span className="text-bold text-red">Cancelled</span>}
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

export default connect(mapStateToProps, mapDispatchToProps)(Special)
