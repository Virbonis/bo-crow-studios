import React, { useEffect } from 'react'
import {
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Spin,
  Table,
} from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/cancel-match/actions'
import {
  choiceOptions,
  getCancelMatchOptions,
  reasonOptions,
  scoreOptions,
  gameTypeDescription,
} from 'helper'

const mapStateToProps = ({ cancelMatch }) => ({
  loading: cancelMatch.loadingSpecialData,
  specialData: cancelMatch.specialData,
})

const mapDispatchToProps = dispatch => ({
  LoadSpecial: payload => {
    dispatch({
      type: actions.LOAD_SPECIAL,
      payload,
      source: 'Cancel Match Special',
    })
  },
  UpdateSpecial: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SPECIAL,
      payload,
      successCallback,
      source: 'Cancel Match Special',
    })
  },
})

const CancelSpecialOther = ({
  specialValue,
  successCallback,

  loading,
  specialData,
  LoadSpecial,
  UpdateSpecial,
}) => {
  useEffect(() => {
    LoadSpecial(specialValue)
  }, [LoadSpecial, specialValue])

  const [form] = Form.useForm()
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
          const anyEmptyCheckedChoice = Object.values(values).some(x => x.void_choice?.[0] === '')
          if (anyEmptyCheckedChoice) {
            message.warning('Please check at least one choice')
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
              return {
                match_id: specialValue.match_id,
                game_type: Number(key),
                ...val,
                void_choice: val.void_choice?.toString(),
              }
            })
          UpdateSpecial(payload, successCallback)
        }}
      >
        <TableFormSpecial data={specialData} form={form} />
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
      title: <Checkbox onChange={onCheckAllGameType}>Cancel</Checkbox>,
      width: 300,
      render: ({ game_type, is_cancelled }) => {
        return (
          <Row justify="space-between">
            <Space align="start">
              <Form.Item name={[game_type, 'isSubmit']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
              <FormCancel game_type={game_type} />
            </Space>
            {is_cancelled === 'Y' && <span className="text-bold text-red">Cancelled</span>}
          </Row>
        )
      },
    },
  ]

  return <Table rowKey="game_type" columns={columns} dataSource={data} pagination={false} />
}

const FormCancel = ({ game_type }) => {
  const cancelOptions = getCancelMatchOptions(game_type)

  return (
    <>
      <Row>
        <Form.Item name={[game_type, 'cancel_type']}>
          <Select placeholder="Select Type" options={cancelOptions} className="w-100" />
        </Form.Item>
      </Row>
      <Row>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues[game_type]?.cancel_type !== currentValues[game_type]?.cancel_type
          }
        >
          {({ getFieldValue }) => {
            const cancelType = getFieldValue([game_type, 'cancel_type'])
            if (cancelType !== 'RESET') {
              return (
                <Row className="mt-2">
                  {cancelType === 'CHOICE' && (
                    <>
                      {choiceOptions && (
                        <Col span={24}>
                          <Form.Item
                            name={[game_type, 'void_choice']}
                            label="Choice"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                          >
                            <Checkbox.Group options={choiceOptions[game_type]} className="w-100" />
                          </Form.Item>
                        </Col>
                      )}
                      <Col span={24}>
                        <Form.Item label="Score" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                          <ScoreForm game_type={game_type} />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  <Col span={24}>
                    <Form.Item
                      name={[game_type, 'void_id']}
                      label="Reason"
                      rules={[{ required: true, message: 'Please Input Type' }]}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Select
                        placeholder="Select Reason"
                        options={reasonOptions}
                        className="w-100"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
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
                            <Col span={20} offset={4}>
                              <Form.Item name={[game_type, 'void_desc']}>
                                <Input placeholder="Input Reason" className="mb-2" />
                              </Form.Item>
                            </Col>
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
      </Row>
    </>
  )
}
const ScoreForm = ({ game_type }) => {
  if (game_type === 26) {
    return (
      <Form.Item name={[game_type, 'tempScore']} style={{ width: '40%' }}>
        <Select options={scoreOptions[game_type]} />
      </Form.Item>
    )
  }
  if ([28, 34, 37, 38, 39, 40].includes(game_type)) {
    return (
      <Form.Item label="FS" colon={false}>
        <Space.Compact>
          <Form.Item name={[game_type, 'fs_home']}>
            <InputNumber min={0} style={{ width: '50px' }} />
          </Form.Item>
          <span className="ml-2 mr-2">-</span>
          <Form.Item name={[game_type, 'fs_away']}>
            <InputNumber min={0} style={{ width: '50px' }} />
          </Form.Item>
        </Space.Compact>
      </Form.Item>
    )
  }
  if ([29, 30, 41, 42, 43, 44, 45, 46, 47, 48, 49].includes(game_type)) {
    return (
      <Form.Item>
        <div className="d-flex flex-row">
          <Form.Item label="HT" colon={false}>
            <Space.Compact>
              <Form.Item name={[game_type, 'ht_home']}>
                <InputNumber min={0} style={{ width: '50px' }} />
              </Form.Item>
              <span className="ml-1 mr-1">-</span>
              <Form.Item name={[game_type, 'ht_away']}>
                <InputNumber min={0} style={{ width: '50px' }} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item label="FS" colon={false} className="ml-1">
            <Space.Compact>
              <Form.Item name={[game_type, 'fs_home']}>
                <InputNumber min={0} style={{ width: '50px' }} />
              </Form.Item>
              <span className="ml-1 mr-1">-</span>
              <Form.Item name={[game_type, 'fs_away']}>
                <InputNumber min={0} style={{ width: '50px' }} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        </div>
      </Form.Item>
    )
  }

  return (
    <Form.Item name={[game_type, 'fs_home']}>
      <Select options={scoreOptions[game_type]} className="w-100" />
    </Form.Item>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CancelSpecialOther)
