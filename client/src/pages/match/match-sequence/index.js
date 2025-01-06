import React from 'react'
import { connect } from 'react-redux'
import { Button, Select, Input, Form, DatePicker, Tooltip, Row, Col } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/match/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { useGetDateTimeBusinessHour } from 'components/blaise'
import { ContextProvider } from '../../../components/blaise/shared-components/context-provider'
import './custom.scss'
import TableMatchSequence from './table-match-sequence'

const { RangePicker } = DatePicker

const mapStateToProps = ({ match }) => ({
  tableData: match.data_match_sequence,
  loadingData: match.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_MATCH_SEQUENCE,
      payload,
      source: 'Match - Match Sequence',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MATCH_SEQUENCE,
      payload,
      successCallback,
      source: 'Match Sequence',
    })
  },
  SwapSequence: (payload, successCallback) => {
    dispatch({
      type: actions.SWAP_MATCH_SEQUENCE,
      payload,
      successCallback,
      source: 'Match Sequence',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const MatchSequence = wrapperDate(
  ({ tableData, defaultDateTime, loadingData, LoadTable, CleanUp, Update }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()

    const reload = React.useCallback(() => {
      form.submit()
    }, [form])

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
              <FormFilter
                form={form}
                defaultDateTime={defaultDateTime}
                reload={reload}
                LoadTable={LoadTable}
              />
            </div>
          </div>
          <div className="card-body">
            <ContextProvider>
              <TableMatchSequence
                tableData={tableData}
                loadingData={loadingData}
                Update={Update}
                reload={reload}
              />
            </ContextProvider>
          </div>
          <div className="card-footer">
            <b>
              The Order is by :
              <br />
              1. Special Sequence
              <br />
              2. Match Date/Time
              <br />
              3. Match Sequence
              <br />
              4. Match ID
              <br />
              <b>Special Sequence only update for SPECIAL LEAGUES. Otherwise let it blank</b>
            </b>
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(MatchSequence)

const FormFilter = props => {
  const { form, defaultDateTime, reload, LoadTable } = props
  const { sportOptions } = useSelectOptions()
  return (
    <Form
      form={form}
      className="w-100"
      layout="vertical"
      initialValues={{
        sport_id: 10,
        date_range: [defaultDateTime, defaultDateTime],
      }}
      onValuesChange={changedValues => {
        if (Object.keys(changedValues).includes('league_name')) return
        reload()
      }}
      onKeyPress={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          reload()
        }
      }}
      onFinish={values => {
        LoadTable({
          ...values,
          date_start: values.date_range[0].toISOString(true),
          date_end: values.date_range[1].toISOString(true),
        })
      }}
    >
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
          <Form.Item name="date_range" className="mb-0">
            <RangePicker className="w-100" format="YYYY-MM-DD" allowClear={false} />
          </Form.Item>
          <Form.Item name="sport_id" className="mb-0">
            <Select
              placeholder="Select Sport"
              showSearch
              options={sportOptions}
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item name="league_name" className="mb-0">
            <Input placeholder="League Name" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
