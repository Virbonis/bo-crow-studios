import React, { useState } from 'react'
import { Button, Col, DatePicker, Form, Radio, Row, Select, Typography } from 'antd'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { SelectMultipleAll, useGetDateTimeBusinessHour, useGetLastGLDate } from 'components/blaise'
import dayjs from 'dayjs'
import { getPresetsMinMaxDate } from 'helper'
import LedgerMain from './pages/ledger-main'
import LedgerAverage from './pages/ledger-average'
import LedgerNew from './pages/ledger-new'
import LedgerBreakdown from './pages/ledger-breakdown'
import LedgerBetDetail from './pages/ledger-bet-detail'
import { getDrillCustomerType } from './pages/desc'
import useReportOptions from '../shared-components/useReportOptions'

const { RangePicker } = DatePicker
const getPreGeneratedReport = today => {
  const firstDayOfThisMonth = dayjs(today)
    .clone()
    .startOf('months')

  const yesterday = dayjs(today)
    .clone()
    .subtract(1, 'days')
  let lastDayOfThisMonth = yesterday
  if (yesterday.month() !== today.month()) lastDayOfThisMonth = today.clone()

  const firstDayOfThisWeek = dayjs(today)
    .clone()
    .subtract(1, 'weeks')
    .startOf('week')
    .add(1, 'days')
  const lastDayOfThisWeek = dayjs(today)
    .clone()
    .subtract(1, 'weeks')
    .endOf('week')
    .add(1, 'days')

  const last3Day = dayjs(today)
    .clone()
    .subtract(3, 'days')
  const last2Day = dayjs(today)
    .clone()
    .subtract(2, 'days')
  const last1Day = dayjs(today)
    .clone()
    .subtract(1, 'days')

  const pregeneratedReport = [
    {
      label: `This Month (${firstDayOfThisMonth.format('MMMM')}, ${firstDayOfThisMonth.format(
        'YYYY-MM-DD',
      )} - ${lastDayOfThisMonth.format('YYYY-MM-DD')}) `,
      value: [firstDayOfThisMonth, lastDayOfThisMonth],
    },
    {
      label: `Weekly (${firstDayOfThisWeek.format('YYYY-MM-DD')} - ${lastDayOfThisWeek.format(
        'YYYY-MM-DD',
      )})`,
      value: [firstDayOfThisWeek, lastDayOfThisWeek],
    },
    {
      label: `Daily (${last3Day.format('YYYY-MM-DD')})`,
      value: [last3Day, last3Day],
    },
    {
      label: `Daily (${last2Day.format('YYYY-MM-DD')})`,
      value: [last2Day, last2Day],
    },
    {
      label: `Daily (${last1Day.format('YYYY-MM-DD')})`,
      value: [last1Day, last1Day],
    },
  ]
  return pregeneratedReport
}

const reportTypeOptions = [
  { value: 'SMA', label: 'Ledger' },
  { value: 'AvgSMA', label: 'Ledger Average' },
  { value: 'NewShareholder', label: 'Ledger New' },
  { value: 'Branch', label: 'Breakdown by Branch' },
  { value: 'Sport', label: 'Breakdown by Sport' },
  { value: 'League', label: 'Breakdown by League' },
  { value: 'Match', label: 'Breakdown by Match' },
  { value: 'GameType', label: 'Breakdown by Game Type' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  const lastGLDate = useGetLastGLDate()
  const { hist } = props

  if (!defaultDateTime || !lastGLDate) return null
  return (
    <Component
      {...props}
      minDate={!hist ? lastGLDate : dayjs('2012-01-01')}
      maxDate={!hist ? defaultDateTime : lastGLDate.clone().subtract(1, 'day')}
      generatedReport={!hist ? getPreGeneratedReport(defaultDateTime) : null}
      hist={hist}
    />
  )
}

const Ledger = wrapperDate(({ minDate, maxDate, generatedReport, hist }) => {
  const { customerTypeOptions, gameTypeOptions, branchOptions, sportOptions } = useReportOptions()
  const { vipCodeOptions, currencyOptions } = useSelectOptions()

  const [form] = Form.useForm()

  const onClickGeneratedReport = value => {
    form.setFieldsValue({
      gl_date: value,
    })
    form.submit()
  }

  const [submitValue, setSubmitValue] = useState()
  const [detailValue, setDetailValue] = useState()
  const detailHandler = ({ status7, desc, drill_id }, source) => {
    const params = {
      ...submitValue,
      status7,
    }
    if ('Branch|Sport|League|Match|GameType'.split('|').includes(source)) {
      params.status7 = status7
      if (source === 'Branch') params.branch_id = drill_id
      if (source === 'Sport') params.sport_id = drill_id
      if (source === 'League') params.league_id = drill_id
      if (source === 'Match') params.match_id = drill_id
      if (source === 'GameType') {
        params.game_type = drill_id
        params.st_live = desc.includes('Live') ? 'Y' : 'N'
      }
    } else {
      params.username = desc
      params.customer_type = getDrillCustomerType(status7)
    }
    setDetailValue(params)
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              gl_date: [maxDate, maxDate],
              report_type: 'SMA',
              customer_type: 'COMBI',
              game_type: -99,
              sport_id: -99,
              branch_id: '',
              draw: 0,
              vip_code: [],
              currency: [],
            }}
            onFinish={values => {
              const payload = {
                ...values,
                from_date: values.gl_date?.[0].format('YYYY-MM-DD'),
                to_date: values.gl_date?.[1].format('YYYY-MM-DD'),
                vip_code: values.vip_code?.join(','),
                currency: values.currency?.join(','),
                hist_or_post: hist ? '_Hist' : '_Post',
              }
              setSubmitValue(payload)
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item
                  name="gl_date"
                  extra={
                    <Typography.Text type="danger">
                      {`Valid from ${minDate.format('YYYY-MM-DD')} - ${maxDate.format(
                        'YYYY-MM-DD',
                      )}`}
                    </Typography.Text>
                  }
                >
                  <RangePicker
                    format="YYYY-MM-DD"
                    allowClear={false}
                    className="w-100"
                    disabledDate={current => current < minDate || current > maxDate}
                    presets={getPresetsMinMaxDate(minDate, maxDate)}
                  />
                </Form.Item>
                <Form.Item name="report_type">
                  <Select showSearch optionFilterProp="label" options={reportTypeOptions} />
                </Form.Item>
                <Form.Item name="customer_type">
                  <Select showSearch optionFilterProp="label" options={customerTypeOptions} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="branch_id">
                  <Select showSearch optionFilterProp="label" options={branchOptions} />
                </Form.Item>
                <Form.Item name="game_type">
                  <Select showSearch optionFilterProp="label" options={gameTypeOptions} />
                </Form.Item>
                <Form.Item name="sport_id">
                  <Select showSearch optionFilterProp="label" options={sportOptions} />
                </Form.Item>
                <Form.Item name="vip_code">
                  <SelectMultipleAll
                    placeholder="Select VIP"
                    optionAll={{ value: '', label: 'Show All VIP' }}
                    options={vipCodeOptions}
                  />
                </Form.Item>
                <Form.Item name="currency">
                  <SelectMultipleAll
                    placeholder="Select Currency"
                    optionAll={{ value: '', label: 'Show All Currency' }}
                    options={currencyOptions}
                  />
                </Form.Item>
                <Form.Item name="draw">
                  <Radio.Group className="d-flex flex-column">
                    <Radio value={0}>Normal</Radio>
                    <Radio value={1}>No Draws</Radio>
                    <Radio value={2}>No Draws For Turnover Only</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {generatedReport && (
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item label="Pre-Generated Date Report">
                    <ul>
                      {generatedReport.map(({ label, value }) => {
                        return (
                          <li key={label}>
                            <Button type="link" onClick={() => onClickGeneratedReport(value)}>
                              {label}
                            </Button>
                          </li>
                        )
                      })}
                    </ul>
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
        <div className="card-body">
          {submitValue?.report_type === 'SMA' && (
            <LedgerMain submitValue={submitValue} hist={hist} detailHandler={detailHandler} />
          )}
          {submitValue?.report_type === 'AvgSMA' && (
            <LedgerAverage submitValue={submitValue} hist={hist} detailHandler={detailHandler} />
          )}
          {submitValue?.report_type === 'NewShareholder' && (
            <LedgerNew submitValue={submitValue} hist={hist} detailHandler={detailHandler} />
          )}
          {['Branch', 'Sport', 'League', 'Match', 'GameType'].includes(
            submitValue?.report_type,
          ) && (
            <LedgerBreakdown submitValue={submitValue} hist={hist} detailHandler={detailHandler} />
          )}
        </div>
        <div className="card-footer">
          <Typography.Text className="text-primary">
            *All figures are in <strong>Base</strong> Currency (RMB)
          </Typography.Text>
        </div>
      </div>
      <LedgerBetDetail hist={hist} detailValue={detailValue} setDetailValue={setDetailValue} />
    </>
  )
})
export default Ledger
