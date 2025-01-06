import React from 'react'
import { Button, InputNumber, Select, Space, message, Form } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { debounce } from 'lodash'
import { createHDPColumns, createOUColumns } from 'helper'
import { QueryForecastSingle } from './query'
import TableForecast from './table-forecast'

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

export const ForecastSingleWrapper = props => {
  const {
    page = '', // can be called from MOQuick
    style = {},
    viewParameterMOQuick,

    ...restProps
  } = props
  const [viewParameter, setViewParameter] = React.useState({
    hdp_home: 4,
    hdp_away: 4,
    ou_home: 0,
    ou_away: 7,
    match_type: '',
    ftht: '',
    branch_id: '',
    interval: 5,
  })
  React.useEffect(() => {
    if (page === 'MOQuick') {
      setViewParameter(prev => ({
        ...prev,
        ...viewParameterMOQuick,
        match_time_slot: 'MO-Live',
      }))
    }
  }, [page, viewParameterMOQuick])

  return (
    <div style={style}>
      <ForecastSingle
        viewParameter={viewParameter}
        setViewParameter={setViewParameter}
        page={page}
        style={style}
        {...restProps}
      />
    </div>
  )
}

const ForecastSingle = ({
  iur = 'Y',
  viewParameter,
  setViewParameter,
  match_id,
  currency,
  page,
}) => {
  const { data = [], isFetching, refetch } = QueryForecastSingle({
    match_id, // from original forecast or MOQuick
    currency, // from original forecast
    ...viewParameter,
    is_using_royalty: iur,
  })
  let { branchOptions } = useSelectOptions()
  branchOptions = [{ value: '', label: 'All Branch' }]
    .concat(branchOptions)
    .concat({ value: 'Non-M88S', label: 'Non-M88S' })

  const fs_home = data[0]?.fs_home
  const fs_away = data[0]?.fs_away
  const [HDPColumns, setHDPColumns] = React.useState([])
  const [OUColumns, setOUColumns] = React.useState([])

  React.useEffect(() => {
    setHDPColumns(createHDPColumns(4, 4, fs_home || 0, fs_away || 0, true))
    setOUColumns(createOUColumns(0, 7, fs_home || 0, fs_away || 0, true))
  }, [fs_home, fs_away, page])
  const onValuesChange = debounce((changedValues, values) => {
    if (Object.keys(changedValues).some(e => e.includes('hdp'))) {
      setHDPColumns(
        createHDPColumns(values.hdp_home, values.hdp_away, fs_home || 0, fs_away || 0, true),
      )
    } else if (Object.keys(changedValues).some(e => e.includes('ou'))) {
      if (values.ou_home > values.ou_away) {
        message.warning('OU: Home must be smaller than Away')
      } else if (values.ou_away - values.ou_home > 50) {
        message.warning('OU: Range Difference between Home and Away must be smaller than 50')
      } else {
        setOUColumns(
          createOUColumns(values.ou_home, values.ou_away, fs_home || 0, fs_away || 0, true),
        )
      }
    }
    setViewParameter(prev => ({ ...prev, ...values }))
  }, 500)

  return (
    <>
      <Space>
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
          </Space>
        </Form>
      </Space>
      <TableForecast columnHDP={HDPColumns} columnOU={OUColumns} data={data} isSingleForecast />
    </>
  )
}
export default ForecastSingleWrapper
