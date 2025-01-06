import React from 'react'
import { Row, Col, Form, Button, Typography, Checkbox } from 'antd'
import { CheckboxList } from 'components/blaise'
import { cricketOptionList } from './special-options'

const { Text } = Typography
const cricketRow1 = [
  { title: 'SPECIALS', name: 'specials' },
  { title: '1st Innings Total Runs', name: '1st_innings_total_runs' },
  { title: '2nd Innings Total Runs', name: '2nd_innings_total_runs' },
  { title: 'Total Runs', name: 'total_runs' },
]

const Cricket = ({ dataHeader, dataMatchSpecial, UpdateSpecial }) => {
  const [form] = Form.useForm()

  const filteredSpecialOptions = React.useMemo(() => {
    return Object.entries(cricketOptionList).reduce((acc, [title, { name, options }]) => {
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
        <Checkbox onChange={onCheckAllSpecial}>Select All </Checkbox>
        <Row gutter={[8, 8]}>
          {cricketRow1.map(x => (
            <Col key={x.name} xs={24} sm={24} md={24} lg={6} xl={6}>
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
const SpecialPanel = ({ name, title, filteredSpecialOptions }) => {
  return (
    <>
      <>
        {/* <Tooltip title={getInfoCricket(key, dataHeader)}>
          <InfoCircleOutlined />
        </Tooltip> */}
        <Text className="font-weight-bold">{title}</Text>
      </>
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

export default Cricket
