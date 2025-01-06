import React from 'react'
import { connect } from 'react-redux'
import { Col, DatePicker, Form, Row, Select, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { CustomizeCell, useGetDateTimeBusinessHour } from 'components/blaise'
import actions from 'redux/leech-assign/actions'
import './custom.scss'
import TableLeague from './table-league'
import TableMatch from './table-match'

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actions.LOAD_LEAGUE_TABLE,
      payload,
      source: 'Leech Assign',
    })
  },
  LoadMatch: payload => {
    dispatch({
      type: actions.LOAD_MATCH_TABLE,
      payload,
      source: 'Leech Assign',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const sportOptions = [
  { value: 10, label: 'Soccer' },
  { value: 0, label: 'Other' },
]
const isCheckedOptions = [
  { value: '', label: 'Show All Status' },
  { value: 'Y', label: 'Checked' },
  { value: 'N', label: 'Unchecked' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null

  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const LeechAssign = wrapperDate(({ defaultDateTime, LoadLeague, LoadMatch, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])
  const [form] = Form.useForm()

  const reload = React.useCallback(() => form.submit(), [form])

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={reload} />
            <Form
              form={form}
              className="w-100"
              initialValues={{
                date_range: [defaultDateTime, defaultDateTime],
                sport_id: 10,
                is_checked: '',
              }}
              onValuesChange={reload}
              onFinish={values => {
                const payload = {
                  ...values,
                  match_date_from: values.date_range[0].format('YYYY-MM-DD'),
                  match_date_to: values.date_range[1].format('YYYY-MM-DD'),
                }
                LoadLeague(payload)
                LoadMatch(payload)
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="date_range" className="mb-0">
                    <DatePicker.RangePicker
                      className="w-100"
                      allowClear={false}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="sport_id" className="mb-0">
                    <Select options={sportOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="is_checked" className="mb-0">
                    <Select options={isCheckedOptions} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Row gutter={[8, 8]}>
            <Col span={8}>
              <TableLeague
                reload={reload}
                scroll={{ y: 500 }}
                pagination={false}
                components={{
                  body: {
                    cell: CustomizeCell,
                  },
                }}
              />
            </Col>
            <Col span={16}>
              <TableMatch
                reload={reload}
                scroll={{ x: 'max-content', y: 500 }}
                pagination={false}
                components={{
                  body: {
                    cell: CustomizeCell,
                  },
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
})

export default connect(null, mapDispatchToProps)(LeechAssign)
