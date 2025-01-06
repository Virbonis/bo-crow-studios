import React from 'react'
import { Row, Col, Form, Space, Tooltip, Button, Typography, Checkbox } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { CheckboxList } from 'components/blaise'
import { getInfoVolley, volleyOptionList } from './special-options'

const { Text } = Typography
const volleyRow1 = [{ title: 'SPECIALS', name: 'specials' }]
const Volley = ({ dataHeader, dataMatchSpecial, UpdateSpecial }) => {
  const [form] = Form.useForm()

  const filteredSpecialOptions = React.useMemo(() => {
    return Object.entries(volleyOptionList).reduce((acc, [title, { name, options }]) => {
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
    <>
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
          UpdateSpecial({
            special_match: payload,
          })
        }}
      >
        <Checkbox onChange={onCheckAllSpecial}>Select All </Checkbox>
        <Row gutter={[8, 8]}>
          {volleyRow1.map(x => (
            <Col key={x.name} xs={24} sm={24} md={24} lg={8} xl={8}>
              <SpecialPanel
                {...x}
                dataHeader={dataHeader}
                filteredSpecialOptions={filteredSpecialOptions}
              />
            </Col>
          ))}
        </Row>
        <Button type="primary" htmlType="submit">
          Submit Special
        </Button>
      </Form>
    </>
  )
}
const SpecialPanel = ({ name, title, dataHeader, filteredSpecialOptions }) => {
  return (
    <>
      <Space>
        <Tooltip title={getInfoVolley(title, dataHeader)}>
          <InfoCircleOutlined />
        </Tooltip>
        <Text className="font-weight-bold">{title}</Text>
      </Space>
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
      <Form.Item name={name}>
        <CheckboxList options={filteredSpecialOptions[name]} columns={1} />
      </Form.Item>
    </>
  )
}

export default Volley
