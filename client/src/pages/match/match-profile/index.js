import React, { useState } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/match-profile/actions'
import actionsLeague from 'redux/league/actions'
import {
  Row,
  Col,
  Input,
  Form,
  Select,
  Table,
  DatePicker,
  Tooltip,
  Button,
  Switch,
  Typography,
} from 'antd'
import {
  HomeAwayWithTraderIcon,
  useGetDateTimeBusinessHour,
  useFormWithPagination,
} from 'components/blaise'
import { ReloadOutlined } from '@ant-design/icons'
import 'pages/match/match-list/custom.scss'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { validatorNumeric } from 'helper'

const { RangePicker } = DatePicker

const mapStateToProps = ({ matchProfile }) => ({
  dataTable: matchProfile.data.result,
  loading: matchProfile.loading,
  totalResults: matchProfile.data.total,
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actionsLeague.LOAD_SELECT_IN_MATCH_PROFILE,
      payload,
      source: 'Match Profile',
    })
  },
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Match Profile',
    })
  },
  UpdateMatchProfile: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Match Profile',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const MatchProfile = wrapperDate(
  ({
    dataTable,
    loading,
    totalResults,
    defaultDateTime,
    LoadLeague,
    Load,
    UpdateMatchProfile,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()
    const { profileOptions, sportOptions, leagueInMatchOptions: leagueOptions } = useSelectOptions()
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const fetch = React.useCallback(
      values => {
        setSelectedRowKeys([])
        Load({
          ...values,
          date_start: values.date_range[0].format('YYYY-MM-DD'),
          date_end: values.date_range[1].format('YYYY-MM-DD'),
          order_by: values.order_by ? 'Time' : 'Normal',
        })
      },
      [Load],
    )
    const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResults)
    const reloadLeague = React.useCallback(() => {
      const values = form.getFieldsValue()
      LoadLeague({
        ...values,
        date_start: values.date_range[0].format('YYYY-MM-DD'),
        date_end: values.date_range[1].format('YYYY-MM-DD'),
      })
      form.resetFields(['league_id'])
    }, [form, LoadLeague])

    const reload = React.useCallback(() => {
      reloadLeague()
      form.submit()
    }, [form, reloadLeague])

    React.useEffect(() => reload(), [reload])

    const columns = [
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        align: 'center',
        width: 100,
      },
      {
        title: (
          <>
            <span>Match Date</span>
            <br />
            <span>Created Date</span>
          </>
        ),
        width: 150,
        align: 'center',
        render: ({ match_date, match_create_date }) => (
          <>
            <Typography.Text>{match_date.formatDateTime()}</Typography.Text>
            <br />
            <Typography.Text className="text-warning">
              {match_create_date.formatDateTime()}
            </Typography.Text>
          </>
        ),
      },
      {
        title: 'League',
        dataIndex: 'league_name',
        width: 500,
      },

      {
        title: 'Home Away',
        render: (text, record) => <HomeAwayWithTraderIcon {...record} />,
        width: 300,
      },
      {
        title: 'Profile',
        dataIndex: 'profile_id',
        align: 'center',
        width: 100,
      },
    ]

    return (
      <>
        <div className="card">
          <div className="card-header d-flex flex-row-reverse">
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
            <Form
              form={form}
              className="w-100"
              initialValues={{
                date_range: [defaultDateTime, defaultDateTime],
                sport_id: 10,
                league_id: 0,
              }}
              {...formProps}
              onValuesChange={(changedValues, allValues) => {
                formProps.onValuesChange(changedValues, allValues)

                const key = Object.keys(changedValues)[0]
                if (!['order_by', 'league_id'].includes(key)) {
                  reloadLeague()
                }
              }}
              onKeyPress={e => {
                formProps.onKeyPress(e)
                if (e.key === 'Enter') reloadLeague()
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="date_range">
                    <RangePicker className="w-100" format="YYYY-MM-DD" allowClear={false} />
                  </Form.Item>
                  <Form.Item name="sport_id">
                    <Select placeholder="Select Sport" showSearch options={sportOptions} />
                  </Form.Item>
                  <Form.Item name="league_id">
                    <Select placeholder="Select League" showSearch options={leagueOptions} />
                  </Form.Item>
                  <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
                    <Input className="w-100" placeholder="Match ID" />
                  </Form.Item>
                  <Form.Item name="order_by" valuePropName="checked">
                    <Switch checkedChildren="Sort Normal" unCheckedChildren="Sort By Time" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="team_name">
                    <Input placeholder="Home Away" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="profile_id">
                    <Input placeholder="Profile" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="card-body">
            <Table
              size="small"
              rowKey={record => record.match_id}
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              columns={columns}
              dataSource={dataTable}
              loading={loading}
              pagination={paginationProps}
              title={() => (
                <Form
                  className="w-100"
                  labelAlign="left"
                  initialValues={{ profile_id: profileOptions[0]?.value }}
                  onFinish={values => {
                    const payload = {
                      match_ids: selectedRowKeys.toString(),
                      profile_id: values.profile_id.toString(),
                    }
                    UpdateMatchProfile(payload, reload)
                  }}
                >
                  <Form.Item name="profile_id" label="Change Profile to">
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) === 0
                      }
                      options={profileOptions}
                      allowClear={false}
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={selectedRowKeys.length === 0}
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              )}
            />
          </div>
        </div>
      </>
    )
  },
)
export default connect(mapStateToProps, mapDispatchToProps)(MatchProfile)
