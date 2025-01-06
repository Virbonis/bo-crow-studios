import React, { useEffect } from 'react'
import { Checkbox, Col, Form, Input, message, Row, Select, Space, Spin, Table } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/cancel-match/actions'
import {
  getCancelMatchOptions,
  reasonOptions,
  gameTypeDescription,
  MapListSpecialBasket,
} from 'helper'

const mapStateToProps = ({ cancelMatch }) => ({
  loading: cancelMatch.loadingSpecialData,
  specialData: cancelMatch.specialData,
})

const mapDispatchToProps = dispatch => ({
  LoadSpecialBasket: payload => {
    dispatch({
      type: actions.LOAD_SPECIAL, // sama kyk other
      payload,
      source: 'Cancel Match Special',
    })
  },
  UpdateSpecialBasket: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SPECIAL_BASKET,
      payload,
      successCallback,
      source: 'Cancel Match Special',
    })
  },
})

const basketRound = Object.keys(MapListSpecialBasket)
const SpecialCancelMatch = ({
  specialValue,
  successCallback,

  loading,
  specialData,
  LoadSpecialBasket,
  UpdateSpecialBasket,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    LoadSpecialBasket(specialValue)
  }, [LoadSpecialBasket, specialValue])

  const initialValues = React.useMemo(
    () =>
      // from array, convert to object
      specialData.reduce((acc, specialItem) => {
        const { game_type, is_cancelled, fs_home, fs_away } = specialItem

        let tempScore = ''
        if (game_type === 26) tempScore = `${fs_home}-${fs_away}`

        if ([20, 21, 22, 25, 27, 33, 35].includes(game_type) && is_cancelled === 'N') {
          specialItem.fs_home = 1
          specialItem.fs_away = 0
        }
        if ([23, 24].includes(game_type) && is_cancelled === 'N') {
          specialItem.fs_home = -1
          specialItem.fs_away = 0
        }

        acc[game_type] = {
          ...specialItem,
          void_id: is_cancelled === 'Y' ? specialItem.void_id : 99,
          void_choice: specialItem.void_choice.split(','),
          cancel_type: getCancelMatchOptions(game_type).find(
            x => x.source === specialItem.cancel_type,
          )?.value,
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
          // from object, convert to array
          const payload = Object.entries(values)
            .filter(([, val]) => val.isSubmit)
            .map(([key, val]) => {
              return {
                match_id: specialValue.match_id,
                game_type: Number(key),
                ...val,
                void_choice: val.void_choice?.toString(),
              }
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
      title: <Checkbox onChange={checkAllGameType}>Cancel</Checkbox>,
      width: 300,
      render: ({ game_type, is_cancelled }) => {
        return (
          <Row justify="space-between">
            <Space align="start">
              <Form.Item name={[game_type, 'isSubmit']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
              <FormCancelBasket game_type={game_type} />
            </Space>
            {is_cancelled === 'Y' && <span className="text-bold text-red">Cancelled</span>}
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

const FormCancelBasket = ({ game_type }) => {
  const cancelOptions = getCancelMatchOptions(game_type)

  return (
    <>
      <Form.Item name={[game_type, 'cancel_type']}>
        <Select options={cancelOptions} style={{ width: '250px' }} />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) => prev[game_type].cancel_type !== curr[game_type].cancel_type}
      >
        {({ getFieldValue }) => {
          const val = getFieldValue([game_type, 'cancel_type'])
          if (val === 'GAMETYPE') {
            return (
              <Row>
                <Col span={20}>
                  <Form.Item
                    name={[game_type, 'void_id']}
                    label="Reason"
                    rules={[{ required: true, message: 'Please Input Type' }]}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Select placeholder="Select Reason" options={reasonOptions} className="w-100" />
                  </Form.Item>
                </Col>
                <Col span={20}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues[game_type]?.cancel_type !==
                        currentValues[game_type]?.cancel_type ||
                      prevValues[game_type]?.void_id !== currentValues[game_type]?.void_id
                    }
                  >
                    {({ getFieldValue: gfv }) => {
                      const voidID = gfv([game_type, 'void_id'])
                      if (voidID === 99) {
                        return (
                          <Form.Item
                            name={[game_type, 'void_desc']}
                            label="if other"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                          >
                            <Input placeholder="Input Reason" className="mb-2" />
                          </Form.Item>
                        )
                      }
                      return <></>
                    }}
                  </Form.Item>
                </Col>
              </Row>
            )
          }
          return null
        }}
      </Form.Item>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SpecialCancelMatch)
