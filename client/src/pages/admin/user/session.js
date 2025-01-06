import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, DatePicker, Button, Table, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import actions from 'redux/admin/user/actions'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const mapStateToProps = ({ user }) => ({
  loading: user.loadingSession,
  data: user.session,
})

const mapDispatchToProps = dispatch => ({
  LoadSession: payload => {
    dispatch({
      type: actions.LOAD_SESSION,
      payload,
      source: '',
    })
  },
  ClearSession: () => {
    dispatch({
      type: actions.SET_STATE,
      payload: {
        session: [],
      },
    })
  },
})

const columns = [
  {
    title: 'Login Date',
    dataIndex: 'login_date',
    align: 'center',
    render: text => dayjs.utc(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: 'Logout Date',
    dataIndex: 'logout_date',
    align: 'center',
    render: text => {
      if (text === '2001-01-01T00:00:00Z') return '-'
      return dayjs.utc(text).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: 'IP Login',
    dataIndex: 'ip_login',
    align: 'center',
  },
]
const SessionTab = ({ loading, data, LoadSession, ClearSession, sessionValue }) => {
  const [form] = Form.useForm()
  const startDate = dayjs()
    .utcOffset(8)
    .add(-91, 'day')
  const endDate = dayjs()
    .utcOffset(8)
    .add(-1, 'day')

  useEffect(() => {
    form.setFieldsValue(sessionValue)
    return ClearSession()
  }, [form, sessionValue, ClearSession])

  return (
    <div className="d-flex flex-column h-100">
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        form={form}
        id="session-form"
        onFinish={values =>
          LoadSession({
            ...sessionValue,
            date_start: values.dateRange[0].toISOString(true),
            date_end: values.dateRange[1].toISOString(true),
          })
        }
        initialValues={sessionValue}
      >
        <Form.Item label="Username">{sessionValue.username}</Form.Item>
        <Form.Item
          label="Login Date"
          name="dateRange"
          rules={[{ required: true, message: 'Please input date range' }]}
          initialValue={[startDate, endDate]}
        >
          <RangePicker
            style={{ width: '100%' }}
            // showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Row>
          <Col offset={8}>
            <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="login_date"
        size="small"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionTab)
