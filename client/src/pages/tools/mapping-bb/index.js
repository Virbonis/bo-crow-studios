import React from 'react'
import { Col, DatePicker, Form, Row, Input, Select, Table, Tooltip, Button, Checkbox } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/mapping-bb/actions'
import actionLeague from 'redux/league/actions'
import { useGetDateTimeBusinessHour, useFormWithPagination } from 'components/blaise'
import { ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ league, mappingBB }) => ({
  leagueOptions: [{ value: 0, label: 'All League' }].concat(
    league.select_in_mapping_builder.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  ),
  loading: mappingBB.loadingData,
  tableData: mappingBB.data.result,
  totalResult: mappingBB.data.total,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Mapping BB',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Mapping BB',
    })
  },
  LoadLeagueSelect: payload => {
    dispatch({
      type: actionLeague.LOAD_SELECT_IN_MAPPING_BUILDER,
      payload,
      source: 'League',
    })
  },
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null

  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const MappingBB = wrapperDate(
  ({
    defaultDateTime,
    loading,
    tableData,
    Load,
    totalResult,
    LoadLeagueSelect,
    leagueOptions,
    Update,
  }) => {
    const [form] = Form.useForm()
    const [formTable] = Form.useForm()

    const { sportOptions } = useSelectOptions()

    const fetch = React.useCallback(
      values => {
        Load({
          ...values,
          league_id: values.league_id ? values.league_id : 0,
          match_id: values.match_id ? values.match_id : 0,
          match_date_from: values.dateRange?.[0].format('YYYY-MM-DD'),
          match_date_to: values.dateRange?.[1].format('YYYY-MM-DD'),
        })
      },
      [Load],
    )
    const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResult)
    const reloadLeague = React.useCallback(() => {
      const values = form.getFieldsValue()
      LoadLeagueSelect({
        ...values,
        match_id: values.match_id ? values.match_id : 0,
        match_date_from: values.dateRange?.[0].format('YYYY-MM-DD'),
        match_date_to: values.dateRange?.[1].format('YYYY-MM-DD'),
      })
      form.setFieldsValue({ league_id: 0 })
    }, [form, LoadLeagueSelect])
    const reload = React.useCallback(() => {
      reloadLeague()
      form.submit()
    }, [form, reloadLeague])
    React.useEffect(() => reload(), [reload])

    React.useEffect(() => {
      const initialValuesTable = tableData?.reduce((acc, curr) => {
        const { match_id, bb_status } = curr
        acc[match_id] = {
          bb_status: bb_status === 'Y',
        }
        return acc
      }, {})

      formTable.setFieldsValue(initialValuesTable)
    }, [formTable, tableData])

    const columns = [
      {
        title: 'Match ID',
        align: 'center',
        width: 100,
        dataIndex: 'match_id',
      },
      {
        title: 'Match Date',
        width: 120,
        align: 'center',
        dataIndex: 'match_date',
      },
      {
        title: 'League',
        dataIndex: 'league_name',
        width: 180,
      },
      {
        title: 'Home Away',
        width: 180,
        render: record => (
          <>
            {record.home_name}
            <br />
            {record.away_name}
          </>
        ),
      },
      {
        title: 'BB Match Date',
        align: 'center',
        width: 120,
        dataIndex: 'bb_match_id',
      },
      {
        title: 'BB League',
        dataIndex: 'bb_league_name',
        width: 180,
      },
      {
        title: 'BB Home Away',
        width: 180,
        render: record => (
          <>
            {record.bb_home_name}
            <br />
            {record.bb_away_name}
          </>
        ),
      },
      {
        title: 'BB Mapping',
        align: 'center',
        width: 100,
        render: record => (
          <Form.Item name={[record.match_id, 'bb_status']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        ),
      },
    ]

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={() => reload()} />
              </Tooltip>
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  dateRange: [defaultDateTime, defaultDateTime],
                  sport_id: 10,
                  league_id: 0,
                }}
                {...formProps}
                onValuesChange={(changedValues, allValues) => {
                  formProps.onValuesChange(changedValues, allValues)

                  const key = Object.keys(changedValues)[0]
                  if (!['league_id', 'match_id'].includes(key)) reloadLeague()
                }}
                onKeyPress={e => {
                  formProps.onKeyPress(e)
                  if (e.key === 'Enter') reloadLeague()
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="dateRange" className="mb-0">
                      <DatePicker.RangePicker
                        className="w-100"
                        allowClear={false}
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="sport_id" className="mb-0">
                      <Select
                        placeholder="Select Sport"
                        showSearch
                        optionFilterProp="label"
                        options={sportOptions}
                      />
                    </Form.Item>
                    <Form.Item name="league_id" className="mb-0">
                      <Select showSearch optionFilterProp="label" options={leagueOptions} />
                    </Form.Item>
                    <Form.Item
                      name="match_id"
                      className="mb-0"
                      extra="*If filter by MatchID, other filters will ignored"
                      rules={[{ validator: validatorNumeric }]}
                    >
                      <Input placeholder="Match ID" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Form
              form={formTable}
              className="w-100"
              id="table-form"
              onFinish={values => {
                const convertValue = Object.entries(values).map(([key, val]) => {
                  return { match_id: Number(key), bb_status: val.bb_status ? 'Y' : 'N' }
                })
                Update(convertValue, reload)
              }}
            >
              <Table
                rowKey="match_id"
                size="small"
                bordered
                loading={loading}
                dataSource={tableData}
                columns={columns}
                pagination={paginationProps}
                title={() => (
                  <div align="right">
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!tableData || tableData?.length === 0}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              />
            </Form>
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(MappingBB)
