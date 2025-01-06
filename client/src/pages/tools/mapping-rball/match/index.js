import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, DatePicker, Form, Select } from 'antd'
import actions from 'redux/mapping-rball-match/actions'
import { useGetDateTimeBusinessHour } from 'components/blaise'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import TableList from './table-list'

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload =>
    dispatch({
      type: actions.LOAD_LEAGUE,
      payload,
      source: 'Mapping RB',
    }),
  LoadLeagueRB: payload =>
    dispatch({
      type: actions.LOAD_LEAGUE_RB,
      payload,
      source: 'Mapping RB',
    }),
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null

  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const MapMatchRBall = wrapperDate(({ defaultDateTime, LoadLeague, LoadLeagueRB, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const { sportOptions } = useSelectOptions()

  const [form] = Form.useForm()
  const [formValue, setFormValue] = useState()

  React.useEffect(() => {
    form.submit()
  }, [form])

  return (
    <div className="card">
      <div className="card-header">
        <Form
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 4 }}
          form={form}
          labelAlign="left"
          className="w-100"
          initialValues={{
            sport_id: sportOptions[0]?.value,
            match_date: defaultDateTime,
          }}
          onValuesChange={() => form.submit()}
          onFinish={values => {
            CleanUp() // clean table before load new data

            const payload = {
              ...values,
              match_date: values.match_date.format('YYYY-MM-DD'),
            }
            setFormValue(payload)
            LoadLeague(payload)
            LoadLeagueRB(payload)
          }}
        >
          <Form.Item name="sport_id" label="Sport">
            <Select options={sportOptions} />
          </Form.Item>
          <Form.Item name="match_date" label="Date">
            <DatePicker allowClear={false} className="w-100" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 2 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="card-body">
        <DndProvider backend={HTML5Backend}>
          <TableList formValue={formValue} />
        </DndProvider>
      </div>
    </div>
  )
})
export default connect(null, mapDispatchToProps)(MapMatchRBall)
