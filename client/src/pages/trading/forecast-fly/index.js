import React from 'react'
import { Button, Drawer, Form, InputNumber, message, Select, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { wrapperPopup } from 'components/blaise'
import { debounce } from 'lodash'
import { createHDPColumns, createOUColumns } from 'helper'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { QueryForecast } from '../forecast-components/query'
import DropdownSelectView from './dropdown-select-view'
import TableForecast from '../forecast-components/table-forecast'
import ForecastSingle from '../forecast-components/forecast-single'

const matchTypeOptions = [
  { label: 'Full Match', value: '' },
  { label: 'Dead Ball', value: 'DEAD' },
  { label: 'Running Ball', value: 'RUN' },
]
const fthtOptions = [
  { label: 'FT/HT', value: '' },
  { label: 'FT', value: 'FT' },
  { label: 'HT', value: 'HT' },
]
const intervalOptions = [
  { label: 'None', value: 0 },
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
]

const Forecast = ({ popup_id, iur = 'Y' }) => {
  const [HDPColumns, setHDPColumns] = React.useState(createHDPColumns(4, 4))
  const [OUColumns, setOUColumns] = React.useState(createOUColumns(0, 7))

  const [visibleSingleForecast, setVisibleSingleForecast] = React.useState(false)
  const [singleForecastValue, setSingleForecastValue] = React.useState()

  let { branchOptions, currencyOptions } = useSelectOptions()
  branchOptions = [{ value: '', label: 'All Branch' }]
    .concat(branchOptions)
    .concat({ value: 'Non-M88S', label: 'Non-M88S' })

  currencyOptions = [{ value: '', label: 'All Currency' }].concat(currencyOptions)

  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    match_time_slot: 'Live-Today',
    hdp_home: 4,
    hdp_away: 4,
    ou_home: 0,
    ou_away: 7,
    match_type: '',
    ftht: '',
    branch_id: '',
    currency: '',
    interval: 5,
  })

  const onValuesChange = debounce((changedValues, values) => {
    if (Object.keys(changedValues).some(e => e.includes('hdp'))) {
      setHDPColumns(createHDPColumns(values.hdp_home, values.hdp_away))
    } else if (Object.keys(changedValues).some(e => e.includes('ou'))) {
      if (values.ou_home > values.ou_away) {
        message.warning('OU: Home must be smaller than Away')
      } else if (values.ou_away - values.ou_home > 50) {
        message.warning('OU: Range Difference between Home and Away must be smaller than 50')
      } else {
        setOUColumns(createOUColumns(values.ou_home, values.ou_away))
      }
    }
    setViewParameter(prev => ({ ...prev, ...values }))
  }, 500)

  const { data = [], isFetching, refetch } = QueryForecast({
    ...viewParameter,
    match_time_slot: `Forecast-${viewParameter.match_time_slot}`,
    is_using_royalty: iur,
  })

  return (
    <div style={{ height: 'calc(100vh - 42px)' }}>
      <Space>
        <DropdownSelectView
          viewParameter={viewParameter}
          onValuesChange={onValuesChange}
          refetch={refetch}
        />
        <Button loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
          Refresh
        </Button>
        <Form initialValues={viewParameter} onValuesChange={onValuesChange}>
          <Space>
            <Form.Item name="interval">
              <Select style={{ width: 75 }} options={intervalOptions} />
            </Form.Item>
            HDP:
            <Form.Item name="hdp_home">
              <InputNumber style={{ width: '50px' }} maxLength="3" min={0} />
            </Form.Item>
            <Form.Item name="hdp_away">
              <InputNumber style={{ width: '50px' }} maxLength="3" min={0} />
            </Form.Item>
            OU:
            <Form.Item name="ou_home">
              <InputNumber style={{ width: '50px' }} maxLength="3" min={0} />
            </Form.Item>
            <Form.Item name="ou_away">
              <InputNumber style={{ width: '50px' }} maxLength="3" min={0} />
            </Form.Item>
            <Form.Item name="match_type">
              <Select options={matchTypeOptions} />
            </Form.Item>
            <Form.Item name="ftht">
              <Select style={{ width: '65px' }} options={fthtOptions} />
            </Form.Item>
            <Form.Item name="branch_id">
              <Select
                style={{ width: 100 }}
                showSearch
                optionFilterProp="label"
                options={branchOptions}
              />
            </Form.Item>
            <Form.Item name="currency">
              <Select
                style={{ width: 100 }}
                showSearch
                optionFilterProp="label"
                options={currencyOptions}
              />
            </Form.Item>
          </Space>
        </Form>
      </Space>
      <TableForecast
        data={data}
        columnHDP={HDPColumns}
        columnOU={OUColumns}
        setVisibleSingleForecast={setVisibleSingleForecast}
        setSingleForecastValue={setSingleForecastValue}
        isFetching={isFetching}
      />
      <Drawer
        title="Single Forecast"
        open={visibleSingleForecast}
        width="100%"
        onClose={() => setVisibleSingleForecast(false)}
        destroyOnClose
        footer={<Button onClick={() => setVisibleSingleForecast(false)}>Close</Button>}
      >
        <ForecastSingle {...singleForecastValue} currency={viewParameter.currency} iur={iur} />
      </Drawer>
    </div>
  )
}

export default wrapperPopup(Forecast)
