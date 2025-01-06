import React from 'react'
import { connect } from 'react-redux'
import { DatePicker, Form, Input, InputNumber, Select, Switch } from 'antd'
import actions from 'redux/news-ticker/actions'
import dayjs from 'dayjs'
import './custom.scss'

const mapDispatchToProps = dispatch => ({
  CreateNewsTicker: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'News Ticker',
    })
  },
})

const { RangePicker } = DatePicker
const Create = ({ websiteOptions, languageOptions, CreateNewsTicker, successCallback }) => {
  const [form] = Form.useForm()

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      labelAlign="right"
      labelWrap="true"
      form={form}
      id="create-form"
      initialValues={{
        news_type: false,
        news_sequence: 1,
        date_range: [dayjs().utcOffset(8), dayjs().endOf('day')],
        website_id: websiteOptions[0].value,
        lang: 'en-US',
        news_display_status: true,
      }}
      onFinish={values =>
        CreateNewsTicker(
          {
            ...values,
            news_type: values.news_type ? 'PR' : 'GN',
            news_from_date_time: values.date_range[0].format('YYYY-MM-DD HH:mm'),
            news_to_date_time: values.date_range[1].format('YYYY-MM-DD HH:mm'),
            // convert lang to array string, if ALL selected, convert to all language except ALL
            lang:
              values.lang === 'ALL'
                ? languageOptions.filter(data => data.value !== 'ALL').map(e => e.value)
                : [values.lang],
            news_display_status: values.news_display_status ? 'Y' : 'N',
          },
          successCallback,
        )
      }
    >
      <Form.Item label="Type" name="news_type" valuePropName="checked">
        <Switch unCheckedChildren="General" checkedChildren="Personal" />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.news_type !== currentValues.news_type
        }
      >
        {({ getFieldValue }) => {
          return (
            getFieldValue('news_type') && (
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please Input Username' }]}
              >
                <Input />
              </Form.Item>
            )
          )
        }}
      </Form.Item>
      <Form.Item name="news_sequence" label="Seq">
        <InputNumber maxLength={6} placeholder="Seq" controls={false} />
      </Form.Item>
      <Form.Item name="date_range" label="Date">
        <RangePicker
          className="w-50"
          allowClear={false}
          format="YYYY-MM-DD HH:mm"
          showTime={{ format: 'HH:mm' }}
        />
      </Form.Item>
      <Form.Item name="website_id" label="Website">
        <Select options={websiteOptions} showSearch />
      </Form.Item>
      <Form.Item name="lang" label="Language">
        <Select options={languageOptions} showSearch />
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

export default connect(null, mapDispatchToProps)(Create)
