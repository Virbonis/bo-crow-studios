import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Col, DatePicker, Form, Row, Select } from 'antd'
import actions from 'redux/export/actions'
import actionsLeague from 'redux/league/actions'
import { SelectMultipleAll, useGetDateTimeBusinessHour } from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ league, exportReport }) => ({
  loadingLeagueOptions: league.loadingSelect,
  leagueOptions: [{ value: '', label: 'All League' }].concat(
    league.select_in_matchlist.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  ),
  loadingExport: exportReport.loadingExportMatchlist,
})
const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actionsLeague.LOAD_SELECT_IN_MATCHLIST,
      payload,
      source: 'Export',
    })
  },
  Export: payload => {
    dispatch({
      type: actions.EXPORT_MATCH_LIST,
      payload,
      source: 'Export',
    })
  },
})

const liveOptions = [
  { value: '', label: 'All Live Status' },
  { value: 'Y', label: 'Live' },
  { value: 'N', label: 'No' },
]
const hasLiveOptions = [
  { value: '', label: 'All Has Live Status' },
  { value: 'Y', label: 'Has Live' },
  { value: 'N', label: 'No' },
]
const openOptions = [
  { value: '', label: 'All Match Status' },
  { value: 'Y', label: 'Open' },
  { value: 'N', label: 'Close' },
]
const processStatusOptions = [
  { value: '', label: 'All Process Status' },
  { value: 'p', label: 'Process' },
  { value: 'U', label: 'Unprocess' },
]
const hasParlayOptions = [
  { value: '', label: 'All Has Parlay Status' },
  { value: 'Y', label: 'Has Parlay' },
  { value: 'N', label: 'No' },
]
const matchCategoryOptions = [
  { value: '', label: 'All Category' },
  { value: '0', label: 'Normal' },
  { value: '3', label: 'World Cup' },
  { value: '2', label: 'Olympic' },
  { value: '1', label: 'Special - Normal' },
  { value: '31', label: 'Special - World Cup' },
  { value: '21', label: 'Special - Olympic' },
]
const leechOptions = [
  { value: '', label: 'All Leech' },
  { value: '0', label: 'Manual' },
  { value: '1', label: 'SBO' },
  { value: '2', label: 'IBC' },
]

const { RangePicker } = DatePicker

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const ExportMatchList = wrapperDate(
  ({ defaultDateTime, leagueOptions, loadingExport, LoadLeague, Export }) => {
    const [form] = Form.useForm()

    const { sportOptions } = useSelectOptions()

    const reloadLeague = React.useCallback(() => {
      const values = form.getFieldsValue()
      if (values.sport_ids.length === 0) return

      LoadLeague({
        ...values,
        date_start: values.dateRange[0].format('YYYY-MM-DD'),
        date_end: values.dateRange[1].format('YYYY-MM-DD'),
        sport_ids: values.sport_ids.toString(),
      })
      form.resetFields(['league_id'])
    }, [form, LoadLeague])
    React.useEffect(() => {
      reloadLeague()
    }, [reloadLeague])

    return (
      <Card title="Match List">
        <Form
          form={form}
          initialValues={{
            dateRange: [defaultDateTime, defaultDateTime],
            sport_ids: [],
            league_id: '',
            match_open_status: '',
            status: '',
            match_live_status: '',
            match_has_live_status: '',
            match_has_parlay_status: '',
            category: '',
            auto_odds: '',
          }}
          onValuesChange={changedValue => {
            if (!Object.keys(changedValue).includes('league_id')) reloadLeague()
          }}
          onFinish={values => {
            Export({
              ...values,
              sport_ids: values.sport_ids.toString(),
              date_from: values.dateRange?.[0].format('YYYY-MM-DD'),
              date_to: values.dateRange?.[1].format('YYYY-MM-DD'),
            })
          }}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="dateRange">
                <RangePicker className="w-100" allowClear={false} format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                name="sport_ids"
                rules={[{ required: true, message: 'Please select sport' }]}
              >
                <SelectMultipleAll
                  showSearch
                  optionFilterProp="label"
                  options={sportOptions}
                  placeholder="Select Sport"
                  optionAll={{ value: 'All', label: 'All Sport' }}
                />
              </Form.Item>
              <Form.Item name="league_id">
                <Select showSearch optionFilterProp="label" options={leagueOptions} />
              </Form.Item>
              <Form.Item name="match_open_status">
                <Select options={openOptions} />
              </Form.Item>
              <Form.Item name="status">
                <Select options={processStatusOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="match_live_status">
                <Select options={liveOptions} />
              </Form.Item>
              <Form.Item name="match_has_live_status">
                <Select options={hasLiveOptions} />
              </Form.Item>
              <Form.Item name="match_has_parlay_status">
                <Select options={hasParlayOptions} />
              </Form.Item>
              <Form.Item name="category">
                <Select options={matchCategoryOptions} />
              </Form.Item>
              <Form.Item name="auto_odds">
                <Select options={leechOptions} />
              </Form.Item>
            </Col>
          </Row>
          <Button loading={loadingExport} type="primary" htmlType="submit">
            Export
          </Button>
        </Form>
      </Card>
    )
  },
)
export default connect(mapStateToProps, mapDispatchToProps)(ExportMatchList)
