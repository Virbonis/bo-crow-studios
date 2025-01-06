import React from 'react'
import { Row, Col, Form, Space, Tooltip, Button, Typography, Checkbox } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { CheckboxList } from 'components/blaise'
import { basketOptionList, getInfoBasket } from './special-options'
import SpecialMoreBasket from './special-more-basket'

const { Text } = Typography

const basketRow1Col1 = [{ title: 'SPECIALS', name: 'specials' }]
const basketRow1Col2 = [
  { title: 'QUARTER', name: 'quarter' },
  { title: 'TEAM TOTAL', name: 'team_total' },
  { title: '2ND HALF', name: '2nd_half' },
  { title: 'TEAM TO SCORE', name: 'team_to_score' },
]
const basketRow1Col3 = [
  { title: 'TEAM RACE TO FIRST 10', name: 'team_race_to_first_10' },
  { title: 'TEAM RACE TO FIRST 15', name: 'team_race_to_first_15' },
  { title: 'TEAM RACE TO FIRST 20', name: 'team_race_to_first_20' },
]

const Basket = ({
  dataHeader,
  dataMatchSpecial,
  dataMatchSpecialMore,
  UpdateSpecial,
  UpdateSpecialMore,
}) => {
  const [form] = Form.useForm()
  const filteredSpecialOptions = React.useMemo(() => {
    return Object.entries(basketOptionList).reduce((acc, [title, { name, options }]) => {
      acc = {
        ...acc,
        [name]: options?.map(x => {
          return { ...x, disabled: dataMatchSpecial[title]?.includes(x.value) }
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
    <Row justify="space-between">
      <Col>
        <Form
          id="add-special"
          form={form}
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
            UpdateSpecial({ special_match: payload })
          }}
        >
          <Checkbox onChange={onCheckAllSpecial}>Select All </Checkbox>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              {basketRow1Col1.map(x => (
                <SpecialPanel
                  key={x.name}
                  {...x}
                  dataHeader={dataHeader}
                  filteredSpecialOptions={filteredSpecialOptions}
                />
              ))}
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              {basketRow1Col2.map(x => (
                <SpecialPanel
                  key={x.name}
                  {...x}
                  dataHeader={dataHeader}
                  filteredSpecialOptions={filteredSpecialOptions}
                />
              ))}
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              {basketRow1Col3.map(x => (
                <SpecialPanel
                  key={x.name}
                  {...x}
                  dataHeader={dataHeader}
                  filteredSpecialOptions={filteredSpecialOptions}
                />
              ))}
            </Col>
            <Button type="primary" htmlType="submit">
              Submit Special
            </Button>
          </Row>
        </Form>
      </Col>
      <Col>
        <SpecialMoreBasket
          dataMatchSpecialMore={dataMatchSpecialMore.map(x => Number(x))}
          UpdateSpecialMore={UpdateSpecialMore}
        />
      </Col>
    </Row>
  )
}

const SpecialPanel = ({ name, title, dataHeader, filteredSpecialOptions }) => {
  return (
    <>
      <Space>
        <Tooltip title={getInfoBasket(title, dataHeader)}>
          <InfoCircleOutlined />
        </Tooltip>
        <Text className="font-weight-bold">{title}</Text>
      </Space>
      {name !== 'team_total' && name !== '2nd_half' && (
        <Form.Item
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues[name] !== currentValues[name]
          }}
        >
          {({ getFieldValue, setFieldValue }) => {
            const value = getFieldValue(name) || []
            const indeterminate =
              !!value.length && value.length < filteredSpecialOptions[name]?.length
            const checked = value.length === filteredSpecialOptions[name]?.length
            const onCheckAll = () => {
              setFieldValue(
                name,
                checked
                  ? filteredSpecialOptions[name]?.filter(x => x.disabled).map(x => x.value)
                  : filteredSpecialOptions[name]?.map(x => x.value),
              )
            }

            return (
              <Checkbox indeterminate={indeterminate} checked={checked} onClick={onCheckAll}>
                Select All
              </Checkbox>
            )
          }}
        </Form.Item>
      )}
      <Form.Item name={name}>
        <CheckboxList options={filteredSpecialOptions[name]} columns={1} />
      </Form.Item>
    </>
  )
}

export default Basket
