import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import action from 'redux/scoring-outright/actions'
import { useGetDateTimeBusinessHour, useFormWithPagination } from 'components/blaise'
import { isEqual } from 'lodash'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import ColumnTeam from './column-team'

const { Text } = Typography
const mapStateToProps = ({ scoringOutright }) => ({
  loading: scoringOutright.loading,
  dataTable: scoringOutright.data.result,
  totalResult: scoringOutright.data.total,
  outrightTeam: scoringOutright.team,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: action.LOAD,
      payload,
      source: 'Scoring Outright',
    })
  },
  UpdateTeam: (payload, successCallback) => {
    dispatch({
      type: action.UPDATE,
      payload,
      successCallback,
      source: 'Scoring Outright',
    })
  },
  DeleteTeam: (payload, successCallback) => {
    dispatch({
      type: action.DELETE,
      payload,
      successCallback,
      source: 'Scoring Outright',
    })
  },
  CleanUp: () => dispatch({ type: action.CLEAN_UP }),
})

const { RangePicker } = DatePicker
const outrightStatusOptions = [
  { value: '', label: 'All Scoring Status' },
  { value: 'Unscored', label: 'Unscored' },
  { value: 'Scored', label: 'Scored' },
  { value: 'Cancelled', label: 'Cancelled' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const ScoringOutright = wrapperDate(
  ({
    dataTable,
    totalResult,
    defaultDateTime,
    LoadTable,
    loading,
    UpdateTeam,
    DeleteTeam,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()
    const [formTable] = Form.useForm()

    const { sportOptions } = useSelectOptions()

    const fetch = React.useCallback(
      values => {
        LoadTable({
          ...values,
          date_from: values.outright_date?.[0].format('YYYY-MMM-DD'),
          date_to: values.outright_date?.[1].format('YYYY-MMM-DD'),
        })
        formTable.resetFields()
      },
      [LoadTable, formTable],
    )
    const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResult)
    const reload = React.useCallback(() => form.submit(), [form])
    useEffect(() => reload(), [reload])

    const columns = [
      {
        title: 'Outright ID',
        dataIndex: 'outright_id',
        width: 100,
        align: 'center',
        fixed: 'left',
      },
      {
        title: 'Outright Date',
        dataIndex: 'outright_date',
        align: 'center',
        width: 150,
        render: text => text.formatDateTime(),
      },
      {
        title: 'League',
        dataIndex: 'league_name',
        width: 400,
      },
      {
        title: 'Outright Status',
        dataIndex: 'outright_score_status',
        align: 'center',
        width: 120,
        render: text => {
          if (text === 'Unscored') return <Text className="text-warning">{text}</Text>
          if (text === 'Cancelled') return <Text className="text-danger">{text}</Text>
          return text
        },
      },
      {
        title: 'Score',
        dataIndex: 'outright_score',
        width: 300,
        render: (text, record) => {
          return (
            <Form.Item
              shouldUpdate={(prev, curr) =>
                prev[record.outright_id]?.check !== curr[record.outright_id]?.check
              }
            >
              {({ getFieldValue }) => {
                const checked = getFieldValue([record.outright_id, 'check'])

                if (!checked) return <Text>{text}</Text>
                return <ColumnTeam form={formTable} record={record} />
              }}
            </Form.Item>
          )
        },
      },
      {
        title: 'Scoring',
        width: 100,
        render: (text, record) => {
          const DisplayCheckbox = () => {
            if (record.outright_score_status === 'Cancelled') return null

            return (
              <Form.Item name={[record.outright_id, 'check']} valuePropName="checked">
                <Checkbox className="w-100">Input Score</Checkbox>
              </Form.Item>
            )
          }

          const DisplayResetButton = () => {
            if (record.outright_score_status === 'Unscored') return null

            return (
              <Button
                type="link"
                onClick={() => {
                  DeleteTeam(record, reload)
                }}
                style={{}}
              >
                Reset Score
              </Button>
            )
          }
          return (
            <div style={{ justifyItems: 'flex-end' }}>
              <DisplayCheckbox />
              <DisplayResetButton />
            </div>
          )
        },
      },
    ]

    return (
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse">
            <Tooltip>
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
            <Form
              form={form}
              className="w-100"
              initialValues={{
                outright_date: [defaultDateTime, defaultDateTime],
                sport_id: 10,
                scoring_status: '',
              }}
              {...formProps}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="outright_date">
                    <RangePicker className="w-100" format="YYYY-MM-DD" allowClear={false} />
                  </Form.Item>
                  <Form.Item name="sport_id">
                    <Select options={sportOptions} showSearch />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="scoring_status">
                    <Select options={outrightStatusOptions} showSearch />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Form
            form={formTable}
            onFinish={values => {
              const payload = Object.entries(values)
                .filter(([, data]) => data.chk_team?.length > 0)
                .map(([key, data]) => ({
                  outright_id: Number(key),
                  team_id: data.chk_team.toString(),
                  league_id: dataTable.find(x => x.outright_id === Number(key))?.league_id,
                }))
              UpdateTeam(payload, reload)
            }}
          >
            <Table
              rowKey="outright_id"
              size="small"
              dataSource={dataTable}
              loading={loading}
              columns={columns}
              pagination={paginationProps}
              title={() => {
                return (
                  <Form.Item
                    shouldUpdate={(prevValues, currentValues) =>
                      !isEqual(prevValues, currentValues)
                    }
                  >
                    {({ getFieldsValue }) => {
                      const anyChecked = Object.values(getFieldsValue()).some(
                        val => val.check && val.chk_team?.length > 0,
                      )
                      return (
                        <div className="d-flex justify-content-end">
                          <Button type="primary" htmlType="submit" disabled={!anyChecked}>
                            Submit
                          </Button>
                        </div>
                      )
                    }}
                  </Form.Item>
                )
              }}
            />
          </Form>
        </div>
        <div className="card-footer">
          <b>
            Notes:
            <br />
            Scoring Outright page list outrights that ready to scored on SELECTED DATE
          </b>
        </div>
      </div>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(ScoringOutright)
