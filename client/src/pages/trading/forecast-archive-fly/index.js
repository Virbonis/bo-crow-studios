import React from 'react'
import { Button, Form, InputNumber, message, Select, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useGetDateTimeBusinessHour, wrapperPopup } from 'components/blaise'
import { debounce } from 'lodash'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { createHDPColumns, createOUColumns } from 'helper'
import { QueryForecastArchive } from '../forecast-components/query'
import TableForecast from '../forecast-components/table-forecast'
import DropdownSelectView from './dropdown-select-view'

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

const wrapperDate = Component => props => {
  const defaultDate = useGetDateTimeBusinessHour()
  if (!defaultDate) return null
  return <Component defaultDate={defaultDate} {...props} />
}

const ForecastArchiveFly = wrapperDate(({ popup_id, defaultDate, iur = 'Y' }) => {
  const [HDPColumns, setHDPColumns] = React.useState([])
  const [OUColumns, setOUColumns] = React.useState([])

  let { branchOptions, currencyOptions } = useSelectOptions()
  branchOptions = [{ value: '', label: 'All Branch' }]
    .concat(branchOptions)
    .concat({ value: 'Non-M88S', label: 'Non-M88S' })

  currencyOptions = [{ value: '', label: 'All Currency' }].concat(currencyOptions)

  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    match_time_slot: 'Forecast-Post',
    hdp_home: 4,
    hdp_away: 4,
    ou_home: 0,
    ou_away: 7,
    match_type: '',
    ftht: '',
    branch_id: '',
    currency: '',
    early_date: [defaultDate, defaultDate.clone().add(1, 'day')],
  })

  React.useEffect(() => {
    setHDPColumns(createHDPColumns(4, 4))
    setOUColumns(createOUColumns(0, 7))
  }, [])
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

  const { data = [], isFetching, refetch } = QueryForecastArchive({
    ...viewParameter,
    match_time_slot: 'Forecast-Post',
    from_early_date: viewParameter.early_date[0].format('YYYY-MM-DD'),
    to_early_date: viewParameter.early_date[1].format('YYYY-MM-DD'),
    is_using_royalty: iur,
  })

  return (
    <div style={{ height: 'calc(100vh - 43px)' }}>
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
          <Space direction="horizontal">
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
      <TableForecast columnHDP={HDPColumns} columnOU={OUColumns} data={data} isArchive />
    </div>
  )
})

export default wrapperPopup(ForecastArchiveFly)
