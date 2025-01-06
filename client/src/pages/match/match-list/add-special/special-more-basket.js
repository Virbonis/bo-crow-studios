import React from 'react'
import { Button, Checkbox, Col, Form, Row, Typography, message } from 'antd'
import { CheckboxList } from 'components/blaise'
import { gameTypeDescription, MapListSpecialBasket } from 'helper'

const createInitialValue = dataSelected => {
  return Object.entries(MapListSpecialBasket).reduce((acc, curr) => {
    const [key, listGT] = curr
    acc[key] = listGT.filter(x => dataSelected.includes(x))
    return acc
  }, {})
}

const SpecialMoreBasket = ({ dataMatchSpecialMore, UpdateSpecialMore }) => {
  const [form] = Form.useForm()

  const initialValues = React.useMemo(() => {
    return createInitialValue(dataMatchSpecialMore)
  }, [dataMatchSpecialMore])
  React.useLayoutEffect(() => {
    form.setFieldsValue(initialValues)
  }, [form, initialValues])

  const checkAllSpecialMore = isChecked => {
    if (isChecked) {
      form.setFieldsValue(
        Object.entries(MapListSpecialBasket).reduce((acc, curr) => {
          const [key, listGT] = curr
          if (key === 'MainQuarter') acc[key] = listGT.slice(0, 4).map(e => e)
          else acc[key] = listGT.map(e => e)
          return acc
        }, {}),
      )
    } else {
      form.setFieldsValue(initialValues)
    }
  }

  return (
    <>
      <Typography.Title level={5}>Special More</Typography.Title>
      <Checkbox onChange={e => checkAllSpecialMore(e.target.checked)}>Select All</Checkbox>
      <Form
        form={form}
        onFinish={values => {
          const listGTSelection = Object.values(values).flat()
          const filteredValue = listGTSelection
            .filter(x => !dataMatchSpecialMore.includes(x))
            .map(x => x.toString())

          if (filteredValue.length === 0) {
            message.error('Please select at least one option')
            return
          }

          UpdateSpecialMore({ special_more: filteredValue })
        }}
      >
        <Row>
          <Col>
            <SpecialMore header="MainQuarter" initialValues={initialValues} />
          </Col>
        </Row>
        <Row>
          <Col>
            <SpecialMore header="HT" initialValues={initialValues} />
          </Col>
          <Col>
            <SpecialMore header="FT" initialValues={initialValues} />
          </Col>
          <Col>
            <SpecialMore header="Quarter" initialValues={initialValues} />
          </Col>
        </Row>
        <Row>
          <Col>
            <SpecialMore header="Q1" initialValues={initialValues} />
          </Col>
          <Col>
            <SpecialMore header="Q2" initialValues={initialValues} />
          </Col>
          <Col>
            <SpecialMore header="Q3" initialValues={initialValues} />
          </Col>
          <Col>
            <SpecialMore header="Q4" initialValues={initialValues} />
          </Col>
        </Row>
      </Form>
      <br />
      <Button type="primary" onClick={() => form.submit()}>
        Submit Special More
      </Button>
    </>
  )
}

const SpecialMore = ({ header, initialValues }) => {
  let specialMoreOptions = MapListSpecialBasket[header].map(game_type => ({
    value: game_type,
    label: gameTypeDescription[game_type].long,
    disabled: initialValues[header].includes(game_type),
  }))
  if (header === 'MainQuarter') {
    specialMoreOptions = specialMoreOptions.slice(0, 4)
  }
  return (
    <>
      <Typography.Text className="font-weight-bold">{header}</Typography.Text>
      <Form.Item
        shouldUpdate={(prevValues, currentValues) => prevValues[header] !== currentValues[header]}
      >
        {({ getFieldValue, setFieldsValue }) => {
          const value = getFieldValue(header) || []

          const indeterminate = !!value.length && value.length < specialMoreOptions.length
          const checked = value.length === specialMoreOptions.length
          const onCheckAll = () => {
            setFieldsValue({
              [header]: checked ? initialValues[header] : specialMoreOptions.map(x => x.value),
            })
          }

          return (
            <Checkbox indeterminate={indeterminate} checked={checked} onClick={onCheckAll}>
              Select All
            </Checkbox>
          )
        }}
      </Form.Item>
      <Form.Item name={header}>
        <CheckboxList options={specialMoreOptions} columns={1} />
      </Form.Item>
    </>
  )
}

export default SpecialMoreBasket
