import React from 'react'
import { connect } from 'react-redux'
import { Card, Checkbox, DatePicker, Divider, Form, Select, TimePicker } from 'antd'
import { isEmpty, startsWith } from 'lodash'
import { applyFilterCategories } from 'helper/match-category'
import dayjs from 'dayjs'
import ButtonDetailMatchAssignment from '../shared-components/match-assignment/button-detail'

const getTraderDBRB = trader => {
  const ts = trader.split(';')
  const traderDB = ts.filter(t => startsWith(t, 'DB'))
  const traderRB = ts.filter(t => startsWith(t, 'RB'))
  return [traderDB, traderRB]
}

const mapStateToProps = ({ moEdit, provider }) => ({
  match: moEdit.data.match,
  specialCodeOptions: moEdit.special_code.map(data => ({
    value: data.special_code,
    label: data.special_name,
  })),
  providerOptions: provider.select.map(data => ({
    value: data.provider_id,
    label: data.provider_name,
  })),
})
const SectionMatch = React.memo(({ match, specialCodeOptions, providerOptions }) => {
  if (isEmpty(match)) return null

  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  const [traderDB, traderRB] = getTraderDBRB(match.trader)

  const defaultCategory = applyFilterCategories(match.category, match.league_category)

  const specialCodeEnabled = [10, 11, 12, 16, 38, 35, 32, 52].includes(match.sport_id)

  return (
    <>
      <Form
        size="small"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        initialValues={{
          ...match,
          match_date: match.match_date ? dayjs(new Date(match.match_date)) : null,
          match_hidden_time_status: match.match_hidden_time_status === 1,
          match_open_status: match.match_open_status === 'Y',
          match_live_status: match.match_live_status === 'Y',
          match_has_live_status: match.match_has_live_status === 'Y',
          match_neutral_status: match.match_neutral_status === 'Y',
          category: defaultCategory.filter(x => x.checked).map(x => x.value),
        }}
      >
        <Card size="small">
          <Divider orientation="left" className="m-0">
            Match
          </Divider>

          <Form.Item label="Match ID" className="mb-0">
            {match.match_id}
          </Form.Item>
          <Form.Item label="Match Date" className="mb-0">
            <Form.Item
              className="mb-0 d-inline-block w-50"
              name="match_date"
              rules={[{ required: true, message: 'Please input date!' }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              className="mb-0 d-inline-block w-50"
              name="match_date"
              rules={[{ required: true, message: 'Please input time!' }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item className="mb-0" name="match_hidden_time_status" valuePropName="checked">
              <Checkbox>Hidden Time</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Sport" className="mb-0">
            {match.sport_name}
          </Form.Item>
          <Form.Item label="League" className="mb-0">
            {match.league_name}
          </Form.Item>
          <Form.Item label="Home - Away" className="mb-0">
            {match.home_name} - {match.away_name}
          </Form.Item>
          <Form.Item label="PIC Dead Ball" className="mb-0">
            {traderDB.map(trader => (
              <div key={trader}>{trader}</div>
            ))}
          </Form.Item>
          <Form.Item label="PIC Running Ball" className="mb-0">
            <ButtonDetailMatchAssignment record={match} style={{ height: '100%' }}>
              {traderRB.map(trader => (
                <div key={trader}>{trader}</div>
              ))}
            </ButtonDetailMatchAssignment>
          </Form.Item>
          <Form.Item label="Match Status" className="mb-0">
            <Form.Item className="mb-0" name="match_open_status" valuePropName="checked">
              <Checkbox>Open</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0" name="match_live_status" valuePropName="checked">
              <Checkbox disabled>Live</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0" name="match_has_live_status" valuePropName="checked">
              <Checkbox>Has Live</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0" name="match_neutral_status" valuePropName="checked">
              <Checkbox>Neutral Ground</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                validator: (rule, value) => {
                  if (value.length === 0)
                    return Promise.reject(new Error('Please select at least one category'))
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Checkbox.Group>
              {defaultCategory.map(cat => (
                <Checkbox key={cat.value} value={cat.value}>
                  {cat.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Special Code" className="mb-0" name="special_code">
            <Select
              allowClear
              options={specialCodeOptions}
              showSearch
              disabled={!specialCodeEnabled}
            />
          </Form.Item>
          <Form.Item label="Weather" className="mb-0" name="weather">
            <Select
              allowClear
              options={[
                { value: 0, label: 'No Weather Report' },
                { value: 1, label: 'Clear Sky (Daytime)' },
                { value: 7, label: 'Clear Sky (Nighttime)' },
                { value: 2, label: 'Sunny' },
                { value: 3, label: 'Light Rain' },
                { value: 4, label: 'Heavy Rain' },
                { value: 5, label: 'Light Snow' },
                { value: 6, label: 'Heavy Snow' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Provider Name" className="mb-0" name="provider">
            <Select allowClear options={providerOptions} showSearch />
          </Form.Item>
        </Card>
      </Form>
    </>
  )
})

export default connect(mapStateToProps, null)(SectionMatch)
