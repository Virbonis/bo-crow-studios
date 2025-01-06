import React from 'react'
import { Button, Col, DatePicker, Form, Row, Select } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/bti-process-breakdown-report/actions'
import { useGetDateTimeDBServer } from 'components/blaise'

const mapDispatchToProps = dispatch => ({
  Process: (payload, successCallback) => {
    dispatch({
      type: actions.PROCESS,
      payload,
      successCallback,
      source: 'BTI Process Breakdown Report',
    })
  },
})

const sportOptions = [
  { value: 60, label: 'M Cricket' },
  { value: 59, label: 'M Basketball' },
]
const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeDBServer()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}
const BTIProcessBreakdownReport = wrapperDate(({ defaultDateTime, Process }) => {
  const [form] = Form.useForm()
  return (
    <div className="card">
      <div className="card-header">
        <Form
          form={form}
          initialValues={{
            sport_id: 60,
            gl_date: defaultDateTime,
          }}
          onFinish={values => Process(values)}
        >
          <Row gutter={[8, 8]}>
            <Col span={6}>
              <Form.Item name="sport_id">
                <Select options={sportOptions} showSearch />
              </Form.Item>
              <Form.Item name="gl_date">
                <DatePicker format="YYYY-MM-DD" allowClear={false} className="w-100" />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
})

export default connect(null, mapDispatchToProps)(BTIProcessBreakdownReport)
