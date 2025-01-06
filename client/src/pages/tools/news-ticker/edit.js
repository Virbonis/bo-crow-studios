import React from 'react'
import { connect } from 'react-redux'
import { DatePicker, Divider, Form, Input, InputNumber, Switch } from 'antd'
import actions from 'redux/news-ticker/actions'
import dayjs from 'dayjs'
import './custom.scss'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'News Ticker',
    })
  },
})

const { RangePicker } = DatePicker
const Edit = ({ newsType, editValue, languageOptions, Update, successCallback }) => {
  const [form] = Form.useForm()

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      labelAlign="right"
      labelWrap="true"
      form={form}
      id="edit-form"
      onFinish={values => {
        Update(
          {
            ...editValue,
            ...values,
            news_type: newsType,
            news_from_date_time: values.date_range[0].format('YYYY-MM-DD HH:mm'),
            news_to_date_time: values.date_range[1].format('YYYY-MM-DD HH:mm'),
            news_display_status: values.news_display_status ? 'Y' : 'N',
          },
          successCallback,
        )
      }}
      initialValues={{
        ...editValue,
        date_range: [dayjs(editValue.news_from_date), dayjs(editValue.news_to_date)],
      }}
    >
      <Form.Item label="News ID">{editValue.news_id}</Form.Item>
      {newsType === 'PR' && (
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please Input Username' }]}
        >
          <Input />
        </Form.Item>
      )}
      <Form.Item label="Website">{editValue.website_name}</Form.Item>
      <Form.Item label="Language">
        {languageOptions.find(data => data.value === editValue.lang).label}
      </Form.Item>
      <Divider className="my-2" />
      <Form.Item
        name="news_sequence"
        label="News Sequence"
        rules={[{ required: true, message: 'Please Input News Sequence' }]}
      >
        <InputNumber maxLength={6} controls={false} />
      </Form.Item>
      <Form.Item name="date_range" label="Date">
        <RangePicker className="w-50" allowClear={false} showTime={{ format: 'HH:mm' }} />
      </Form.Item>
      <Form.Item name="news_display_status" label="Display" valuePropName="checked">
        <Switch unCheckedChildren="Hidden" checkedChildren="Display" />
      </Form.Item>
      <Form.Item
        name="news"
        label="News"
        rules={[{ required: true, message: 'Please Input News' }]}
      >
        <Input.TextArea placeholder="News" autoSize={{ minRows: 3 }} />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(Edit)
