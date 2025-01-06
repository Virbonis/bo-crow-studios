import React from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useGetDateTimeBusinessHour, useGetLastGLDate, useInterval } from 'components/blaise'
import actions from 'redux/bet-listing/actions'
import betListActions from 'redux/bet-list/actions'
import TableForecast from 'pages/trading/bet-list/table-forecast'
import TableBetList from 'pages/trading/bet-list/table-betlist'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { getPresetsMinMaxDate } from 'helper'

const { Text } = Typography
const mapStateToProps = ({ betListing }) => ({
  loadingLeague: betListing.loadingLeague,
  initialLeague: betListing.league_select[0]?.league_id,
  loadingMatch: betListing.loadingMatch,
  initialMatch: betListing.match_select[0]?.match_id,
  tableDataHome: betListing.data.home || [],
  tableDataAway: betListing.data.away || [],
  tableDataHome1x2: betListing.data.home1x2 || [],
  tableDataAway1x2: betListing.data.away1x2 || [],
  tableDataDraw1x2: betListing.data.draw1x2 || [],
  tableTotalCAmt: betListing.data.total,
  loading: betListing.loadingData,
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actions.LOAD_LEAGUE,
      payload,
      source: 'Bet Listing',
    })
  },
  LoadMatch: payload => {
    dispatch({
      type: actions.LOAD_MATCH,
      payload,
      source: 'Bet Listing',
    })
  },
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Bet Listing',
    })
  },
  GetForecast: (payload, successCallback) => {
    dispatch({
      type: betListActions.GET_FORECAST,
      payload,
      successCallback,
    })
  },
})

// ↓ hardcoded only for bet-listing
const defaultListGT = ['0,2', '50', '5,6,61', '3,16,62', '1,8', '12,17', '59,60']
const timerOptions = [
  { value: 0, label: 'None' },
  { value: 3, label: '3s' },
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  const lastGLDate = useGetLastGLDate()

  if (!defaultDateTime || !lastGLDate) return null

  return (
    <Component
      {...props}
      minDate={lastGLDate}
      maxDate={null}
      fromDate={defaultDateTime.clone().add(-1, 'day')}
      toDate={defaultDateTime}
    />
  )
}

const BetListing = wrapperDate(
  ({
    minDate,
    maxDate,
    fromDate,
    toDate,
    loadingLeague,
    initialLeague,
    loadingMatch,
    initialMatch,
    loading,
    tableDataHome,
    tableDataAway,
    tableDataHome1x2,
    tableDataAway1x2,
    tableDataDraw1x2,
    LoadLeague,
    LoadMatch,
    LoadTable,
    GetForecast,
  }) => {
    const {
      leagueBetListingOptions: leagueOptions,
      matchBetListingOptions: matchOptions,
    } = useSelectOptions()

    const { RangePicker } = DatePicker
    const [form] = Form.useForm()
    React.useEffect(() => {
      // fetch League on mount
      LoadLeague({
        ...form.getFieldsValue(),
        match_date_from: form.getFieldValue('date_range')[0].format('YYYY-MM-DD'),
        match_date_to: form.getFieldValue('date_range')[1].format('YYYY-MM-DD'),
        list_gt: form.getFieldValue('list_gt').toString(),
      })
    }, [form, LoadLeague])

    const [interval, setInterval] = React.useState(0)
    const onFetch = React.useCallback(() => {
      form.submit()
    }, [form])
    const [timer, reload] = useInterval(interval, onFetch)

    React.useEffect(() => {
      form.setFieldsValue({ league_id: initialLeague })
    }, [form, initialLeague])
    React.useEffect(() => {
      form.setFieldsValue({ match_id: initialMatch })
    }, [form, initialMatch])

    // FOR DISPLAYING WHICH TEAM IS HOME AND AWAY ON THE TABLE
    const getHomeAway = type => {
      if (matchOptions.length > 0) {
        const HomeAwayName = matchOptions.find(e => e.value === form.getFieldValue('match_id'))
          ?.label
        const result = HomeAwayName?.replace('vs', ',').split(',')
        if (type === 'home') {
          return result?.[0].trim()
        }
        return result?.[1].trim()
      }
      return ''
    }

    return (
      <div className="card">
        <div className="card-header">
          <Form
            form={form}
            className="w-100"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              date_range: [fromDate, toDate],
              st_live: '',
              ftht: '',
              interval: 0,
              list_gt: defaultListGT,
            }}
            onValuesChange={(changedValues, values) => {
              const payload = {
                ...values,
                match_date_from: values.date_range[0].format('YYYY-MM-DD'),
                match_date_to: values.date_range[1].format('YYYY-MM-DD'),
                list_gt: values.list_gt.toString(),
              }
              if (Object.keys(changedValues).includes('date_range')) {
                LoadLeague(payload)
              } else if (Object.keys(changedValues).includes('league_id')) {
                LoadMatch(payload)
              } else form.submit()
            }}
            onFinish={values => {
              // validate if match_id is not null
              if (values.match_id)
                LoadTable({
                  ...values,
                  match_date_from: values.date_range[0].format('YYYY-MM-DD'),
                  match_date_to: values.date_range[1].format('YYYY-MM-DD'),
                  list_gt: values.list_gt.toString(),
                })
            }}
          >
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Divider orientation="left" className="m-0">
                  Date
                </Divider>
                <Form.Item name="date_range" wrapperCol={24} className="mb-2">
                  <RangePicker
                    className="w-100"
                    allowClear={false}
                    format="YYYY-MM-DD"
                    disabledDate={current => current < minDate || (maxDate && current > maxDate)}
                    presets={getPresetsMinMaxDate(minDate, maxDate)}
                  />
                </Form.Item>
                <Form.Item label="League" name="league_id">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={leagueOptions}
                    loading={loadingLeague}
                  />
                </Form.Item>
                <Form.Item label="Match" name="match_id">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={matchOptions}
                    loading={loadingMatch}
                  />
                </Form.Item>
                <Form.Item label="Is Running" name="st_live" className="mb-0">
                  <Select
                    className="w-100"
                    size="small"
                    options={[
                      { value: '', label: 'All' },
                      { value: 'Y', label: 'Yes' },
                      { value: 'N', label: 'No' },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Is First Half" name="ftht" className="mb-0">
                  <Select
                    className="w-100"
                    size="small"
                    options={[
                      { value: '', label: 'All' },
                      { value: 'HT', label: 'Yes' },
                      { value: 'FT', label: 'No' },
                    ]}
                  />
                </Form.Item>
                <Space>
                  <Button onClick={() => reload()} icon={<ReloadOutlined />}>
                    Refresh {interval !== 0 && ` (${timer})`}
                  </Button>
                  <Select
                    style={{ width: 75 }}
                    options={timerOptions}
                    value={interval}
                    onChange={setInterval}
                  />
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={3}>
                <Divider orientation="left" className="m-0">
                  Transaction Type
                </Divider>
                <Form.Item name="list_gt">
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Space direction="vertical" size={0}>
                        <Checkbox value={defaultListGT[0]}>HDP</Checkbox>
                        <Checkbox value={defaultListGT[1]}>G.AH</Checkbox>
                        <Checkbox value={defaultListGT[2]}>OU/G.OU</Checkbox>
                        <Checkbox value={defaultListGT[3]}>OE/G.OE</Checkbox>
                      </Space>
                      <Space direction="vertical" size={0}>
                        <Checkbox value={defaultListGT[4]}>1X2</Checkbox>
                        <Checkbox value={defaultListGT[5]}>ML</Checkbox>
                        <Checkbox value={defaultListGT[6]}>NG/NC</Checkbox>
                      </Space>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <TableForecast
                  GetForecast={GetForecast}
                  editValue={form.getFieldsValue()}
                  listGameType={form.getFieldValue('list_gt')?.toString()}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body">
          <Spin spinning={loading}>
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <Divider orientation="left" className="font-weight-bold m-0">
                  <Text>{`Home - ${getHomeAway('home')}`}</Text>
                </Divider>
                <TableBetList data={tableDataHome} />
              </Col>
              <Col span={12}>
                <Divider orientation="left" className="font-weight-bold m-0">
                  <Text>{`Away - ${getHomeAway('away')}`}</Text>
                </Divider>
                <TableBetList data={tableDataAway} />
              </Col>
            </Row>
            <br />
            <Row gutter={[10, 10]}>
              <Col span={8}>
                <Divider orientation="left" className="font-weight-bold m-0">
                  1
                </Divider>
                <TableBetList data={tableDataHome1x2} is1X2 />
              </Col>
              <Col span={8}>
                <Divider orientation="left" className="font-weight-bold m-0">
                  X
                </Divider>
                <TableBetList data={tableDataDraw1x2} is1X2 />
              </Col>
              <Col span={8}>
                <Divider orientation="left" className="font-weight-bold m-0">
                  2
                </Divider>
                <TableBetList data={tableDataAway1x2} is1X2 />
              </Col>
            </Row>
          </Spin>
        </div>
      </div>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(BetListing)
