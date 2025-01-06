import React from 'react'
import { Checkbox, Row, Col, Form, Space, Tooltip, Button, message, Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { CheckboxList } from 'components/blaise'
import { getInfoSoccer, soccerOptionList } from './special-options'

const { Text } = Typography
const soccerRow1Col1 = [
  { title: 'TEAM TOTAL GOALS', name: 'team_total_goals' },
  { title: 'SINGLE TEAM OVER/UNDER', name: 'single_team_over_under' },
  { title: 'SINGLE TEAM ODD/EVEN', name: 'single_team_odd_even' },
  { title: 'SPECIALS', name: 'specials' },
]
const soccerRow1Col2 = [
  { title: 'SPECIFIC 10 MINS', name: 'specific_10_mins' },
  { title: 'SPECIFIC 15 MINS', name: 'specific_15_mins' },
  { title: 'SPECIFIC 15 MINS NUMBER OF CORNERS', name: 'specific_15_mins_number_of_corners' },
  { title: 'SPECIFIC 15 MINS TOTAL BOOKINGS', name: 'specific_15_mins_total_bookings' },
]
const soccerRow1Col3 = [
  { title: 'ET & PEN', name: 'et_pen' },
  { title: 'PENALTY SHOOT-OUT', name: 'penalty_shootout' },
]
const soccerRow2Col1 = [{ title: 'CORNERS', name: 'corners' }]
const soccerRow2Col2 = [{ title: 'SPECIALS GOAL', name: 'specials_goal' }]
const soccerRow2Col3 = [{ title: 'BOOKINGS', name: 'bookings' }]
const soccerRow3 = [
  { title: 'GOAL KICK', name: 'goal_kick' },
  { title: 'FREE KICK', name: 'free_kick' },
  { title: 'OFFSIDE', name: 'offside' },
]
const specialMoreOptions = soccerOptionList['SPECIAL MORE']

const Soccer = ({
  dataHeader,
  dataMatchSpecial,
  dataMatchSpecialMore,
  UpdateSpecial,
  UpdateSpecialMore,
}) => {
  const [form] = Form.useForm()
  const [formSpecialMore] = Form.useForm()

  const filteredSpecialOptions = React.useMemo(() => {
    return Object.entries(soccerOptionList).reduce((acc, [title, { name, options }]) => {
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
    <Row gutter={[8, 8]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={18}>
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
              {soccerRow1Col1.map(x => (
                <SpecialPanel
                  key={x.name}
                  {...x}
                  dataHeader={dataHeader}
                  filteredSpecialOptions={filteredSpecialOptions}
                />
              ))}
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              {soccerRow1Col2.map(x => (
                <SpecialPanel
                  key={x.name}
                  {...x}
                  dataHeader={dataHeader}
                  filteredSpecialOptions={filteredSpecialOptions}
                />
              ))}
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              {soccerRow1Col3.map(x => (
                <SpecialPanel
                  key={x.name}
                  {...x}
                  dataHeader={dataHeader}
                  filteredSpecialOptions={filteredSpecialOptions}
                />
              ))}
              <b>*ET/PEN/Penalty Shoot-out, special match will be created without parent MatchID</b>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              {soccerRow2Col1.map(x => (
                <SpecialPanel
                  key={x.name}
                  {...x}
                  dataHeader={dataHeader}
                  filteredSpecialOptions={filteredSpecialOptions}
                />
              ))}
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              {soccerRow2Col2.map(x => (
                <SpecialPanel
                  key={x.name}
                  {...x}
                  dataHeader={dataHeader}
                  filteredSpecialOptions={filteredSpecialOptions}
                />
              ))}
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              {soccerRow2Col3.map(x => (
                <SpecialPanel
                  key={x.name}
                  {...x}
                  dataHeader={dataHeader}
                  filteredSpecialOptions={filteredSpecialOptions}
                />
              ))}
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            {soccerRow3.map(x => (
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
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={6}>
        <Form
          form={formSpecialMore}
          onFinish={value => {
            const filteredValue = value.special_more.filter(x => !dataMatchSpecialMore.includes(x))
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
  )
}
const SpecialPanel = ({ name, title, dataHeader, filteredSpecialOptions }) => {
  return (
    <>
      <Space>
        <Tooltip title={getInfoSoccer(title, dataHeader)}>
          <InfoCircleOutlined />
        </Tooltip>
        <Text className="font-weight-bold">{title}</Text>
      </Space>
      {!soccerRow1Col1.some(e => e.name === name) && (
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
        <CheckboxList options={filteredSpecialOptions[name]} columns={2} />
      </Form.Item>
    </>
  )
}

export default Soccer
