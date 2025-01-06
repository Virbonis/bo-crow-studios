import React from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Checkbox, Row, Col, Space, Form, Tooltip, Button, message, Typography } from 'antd'
import { CheckboxList } from 'components/blaise'
import { badmintonOptionList, getInfoBadminton } from './special-options'

const { Text } = Typography
const badmintonRow1 = [
  { title: 'SPECIALS', name: 'specials' },
  { title: 'First Set - Point Winner', name: 'first_set_point_winner' },
  { title: 'Second Set - Point Winner', name: 'second_set_point_winner' },
  { title: 'Third Set - Point Winner', name: 'third_set_point_winner' },
]
const specialMoreOptions = badmintonOptionList['SPECIAL MORE']

const Badminton = ({
  dataHeader,
  dataMatchSpecial,
  dataMatchSpecialMore,
  UpdateSpecial,
  UpdateSpecialMore,
}) => {
  const [form] = Form.useForm()
  const [formSpecialMore] = Form.useForm()

  const filteredSpecialOptions = React.useMemo(() => {
    return Object.entries(badmintonOptionList).reduce((acc, [title, { name, options }]) => {
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

  const filteredSpecialMoreOptions = React.useMemo(
    () =>
      specialMoreOptions.map(x => ({
        ...x,
        disabled: dataMatchSpecialMore.includes(x.value),
      })),
    [dataMatchSpecialMore],
  )

  React.useLayoutEffect(() => {
    formSpecialMore.setFieldValue('special_more', dataMatchSpecialMore)
  }, [formSpecialMore, dataMatchSpecialMore])

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
      <Row gutter={[8, 8]}>
        <Col span={18}>
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
              {badmintonRow1.map(x => (
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
        </Col>
        <Col span={6}>
          <Form
            form={formSpecialMore}
            onFinish={value => {
              const filteredValue = value.special_more.filter(
                x => !dataMatchSpecialMore.includes(x),
              )
              if (filteredValue.length === 0) {
                message.error('Please select at least one option')
                return
              }
              UpdateSpecialMore({ special_more: filteredValue })
            }}
          >
            <div>
              <Text className="font-weight-bold">SPECIAL MORE</Text>
              <Form.Item
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.special_more !== currentValues.special_more
                }
              >
                {({ getFieldValue, setFieldsValue }) => {
                  const value = getFieldValue('special_more') || []

                  const indeterminate = !!value.length && value.length < specialMoreOptions.length
                  const checked = value.length === specialMoreOptions.length
                  const onCheckAll = () => {
                    setFieldsValue({
                      special_more: checked
                        ? dataMatchSpecialMore
                        : specialMoreOptions.map(x => x.value),
                    })
                  }

                  return (
                    <Checkbox indeterminate={indeterminate} checked={checked} onClick={onCheckAll}>
                      Select All
                    </Checkbox>
                  )
                }}
              </Form.Item>
              <Form.Item name="special_more">
                <CheckboxList options={filteredSpecialMoreOptions} />
              </Form.Item>
            </div>
            <Button type="primary" htmlType="submit">
              Submit Special More
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  )
}
const SpecialPanel = ({ name, title, dataHeader, filteredSpecialOptions }) => {
  return (
    <>
      <Space>
        <Tooltip title={getInfoBadminton(title, dataHeader)}>
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

export default Badminton
