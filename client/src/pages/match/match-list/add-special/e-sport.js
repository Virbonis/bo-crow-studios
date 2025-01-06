import React from 'react'
import { Row, Col, Form, Space, Tooltip, Button, Typography, Checkbox } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { CheckboxList } from 'components/blaise'
import { esportOptionList, getInfoEsport } from './special-options'

const { Text } = Typography
const esportCol1 = [
  { title: 'maps', name: 'maps' },
  { title: 'first blood', name: 'first_blood' },
  { title: 'total kills', name: 'total_kills' },
  { title: 'first barracks', name: 'first_barracks' },
  { title: 'first baron', name: 'first_baron' },
]
const esportCol2 = [
  { title: 'map in play', name: 'map_in_play' },
  { title: 'first to reach 5 kills', name: 'first_to_reach_5_kills' },
  { title: 'total kills in play', name: 'total_kills_in_play' },
  { title: 'first roshan', name: 'first_roshan' },
  { title: 'first to reach 10 kills in play', name: 'first_to_reach_10_kills_in_play' },
]
const esportCol3 = [
  { title: 'match winner', name: 'match_winner' },
  { title: 'first to win 5 round', name: 'first_to_win_5_round' },
  { title: 'first to reach 10 kills', name: 'first_to_reach_10_kills' },
  { title: 'duration', name: 'duration' },
  { title: 'pistol round', name: 'pistol_round' },
]
const esportCol4 = [{ title: 'tie breaker', name: 'tie_breaker' }]

const ESport = ({ dataHeader, dataMatchSpecial, UpdateSpecial }) => {
  const [form] = Form.useForm()

  const filteredSpecialOptions = React.useMemo(() => {
    return Object.entries(esportOptionList).reduce((acc, [, { name, options }]) => {
      acc = {
        ...acc,
        [name]: options?.map(x => {
          return {
            ...x,
            disabled: dataMatchSpecial.specials
              ?.map(y => y.toLowerCase())
              .includes(x.value.toLowerCase()),
          }
        }),
      }
      return acc
    }, {})
  }, [dataMatchSpecial])

  const initialValues = React.useMemo(() => {
    return Object.entries(filteredSpecialOptions).reduce((acc, [name, options]) => {
      acc = {
        ...acc,
        [name]: options?.filter(x => x.disabled).map(x => x.value),
      }
      return acc
    }, {})
  }, [filteredSpecialOptions])

  React.useLayoutEffect(() => {
    form.setFieldsValue(initialValues)
  }, [form, initialValues])
  const onCheckAllSpecial = e => {
    const { checked } = e.target
    const value = Object.entries(filteredSpecialOptions).reduce((acc, [key, option]) => {
      acc = {
        ...acc,
        [key]: checked
          ? option?.map(x => x.value)
          : option?.filter(x => x.disabled).map(x => x.value),
      }
      return acc
    }, {})

    form.setFieldsValue(value)
  }
  return (
    <>
      <Form
        id="add-special"
        form={form}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={values => {
          const payload = Object.entries(values).reduce((acc, [key, option]) => {
            acc = {
              ...acc,
              [key]: option.filter(e => !initialValues[key].includes(e)),
            }
            return acc
          }, {})
          UpdateSpecial({
            special_match: payload,
          })
        }}
      >
        <Space direction="vertical">
          <Space>
            <Tooltip title={getInfoEsport(dataHeader)}>
              <InfoCircleOutlined />
            </Tooltip>
            <Text className="font-weight-bold">SPECIALS</Text>
          </Space>
          <Checkbox onChange={onCheckAllSpecial}>Select All </Checkbox>
        </Space>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
            {esportCol1.map(x => (
              <SpecialPanel
                key={x.name}
                {...x}
                dataHeader={dataHeader}
                filteredSpecialOptions={filteredSpecialOptions}
              />
            ))}
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
            {esportCol2.map(x => (
              <SpecialPanel
                key={x.name}
                {...x}
                dataHeader={dataHeader}
                filteredSpecialOptions={filteredSpecialOptions}
              />
            ))}
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
            {esportCol3.map(x => (
              <SpecialPanel
                key={x.name}
                {...x}
                dataHeader={dataHeader}
                filteredSpecialOptions={filteredSpecialOptions}
              />
            ))}
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
            {esportCol4.map(x => (
              <SpecialPanel
                key={x.name}
                {...x}
                dataHeader={dataHeader}
                filteredSpecialOptions={filteredSpecialOptions}
              />
            ))}
          </Col>
        </Row>
        <Button type="primary" htmlType="submit">
          Submit Special
        </Button>
      </Form>
    </>
  )
}
const SpecialPanel = ({ name, filteredSpecialOptions }) => {
  return (
    <>
      <Form.Item name={name}>
        <CheckboxList options={filteredSpecialOptions[name]} columns={1} />
      </Form.Item>
    </>
  )
}

export default ESport
