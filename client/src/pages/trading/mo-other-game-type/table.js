import React from 'react'
import { Form, Table } from 'antd'
import { omit, pickBy, reduce } from 'lodash'
import { countOddsMargin, getOddsXKey } from 'helper'

const setOddsXClass = (game_type, fieldName) =>
  getOddsXKey(game_type) === fieldName ? 'bg-yellow' : ''

const FormGT = React.memo(({ game_type, data, children, onSubmit, st_fav }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [form, data])

  const onFinish = values => {
    onSubmit({
      ...data,
      ...values,
      st_fav: st_fav && st_fav[game_type].st_fav,
      st_odds_margin: values.st_odds_margin ? 'Y' : 'N',
      st_odds_margin2: values.st_odds_margin2 ? 'Y' : 'N',
    })
  }
  const onValuesChange = (changedValues, allValues) => {
    const fieldName = Object.keys(changedValues)[0]
    if (!fieldName.startsWith('odds')) return // only calc odds

    const { st_odds_margin, st_odds_margin2 } = allValues
    if (game_type !== 40) {
      // only 1 margin
      const { odds_margin, ...oddsFields } = pickBy(allValues, (v, key) => key.startsWith('odds'))
      if (st_odds_margin) {
        const oddsXKey = getOddsXKey(game_type)
        const restOddsFields = omit(oddsFields, oddsXKey)
        calcOddsXMargin(restOddsFields, odds_margin, oddsXKey)
      } else calcOddsMargin(oddsFields)
    } else {
      // CSH, have 2 margin
      const { odds1, odds2, odds3, odds4, odds_margin, odds_margin2 } = allValues
      // margin1
      if (['odds1', 'odds2', 'odds_margin'].includes(fieldName)) {
        if (st_odds_margin) calcOddsXMargin([odds2], odds_margin, 'odds1')
        else calcOddsMargin([odds1, odds2], 'odds_margin')
      }
      // margin 2
      else if (['odds3', 'odds4', 'odds_margin2'].includes(fieldName)) {
        if (st_odds_margin2) calcOddsXMargin([odds4], odds_margin2, 'odds3')
        else calcOddsMargin([odds3, odds4], 'odds_margin2')
      }
    }
  }
  const calcOddsXMargin = (oddsFields, odds_margin, oddsXKey) => {
    if (!oddsXKey) return
    const totalMargin = reduce(oddsFields, (acc, value) => (value === 0 ? acc : acc + 1 / value), 0)
    let result = odds_margin - totalMargin
    if (result !== 0) result = 1 / result
    if (result < 1) result = 0
    else result = Math.round(result * 100) / 100
    form.setFieldsValue({ [oddsXKey]: result })
  }
  const calcOddsMargin = (oddsFields, oddsMarginKey = 'odds_margin') => {
    form.setFieldsValue({ [oddsMarginKey]: countOddsMargin(oddsFields) })
  }
  const initialValues = {
    ...data,
    // gametype 3wh have negative handicap
    handicap: game_type === 39 ? data.handicap : Math.abs(data.handicap),
    st_odds_margin: data.st_odds_margin === 'Y',
    st_odds_margin2: data.st_odds_margin2 === 'Y',
  }
  return (
    <Form
      form={form}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      initialValues={initialValues}
    >
      {children}
    </Form>
  )
})

const TableGameType = React.memo(props => {
  const { dataSource, columns, ...restProps } = props
  if (dataSource.length === 0) return null

  return (
    <Table
      size="small"
      bordered
      dataSource={dataSource}
      columns={columns}
      rowKey="game_type"
      pagination={false}
      tableLayout="fixed"
      scroll={{ x: '100%' }}
      {...restProps}
    />
  )
})

export default TableGameType
export { getOddsXKey, setOddsXClass, FormGT, TableGameType }
