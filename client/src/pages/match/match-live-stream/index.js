import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Table,
  Select,
  Form,
  DatePicker,
  Row,
  Col,
  Checkbox,
  Tooltip,
  Typography,
} from 'antd'
import actions from 'redux/match-live-stream/actions'
import { useGetDateTimeDBServer } from 'components/blaise'
import { ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const { RangePicker } = DatePicker

const mapStateToProps = ({ matchLiveStream }) => ({
  tableData: matchLiveStream.data.result,
  loadingData: matchLiveStream.loading,
  totalResults: matchLiveStream.data.total,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_MATCH_LIVE_STREAM,
      payload,
      source: 'Match - Match Live Stream',
    })
  },
  UpdateTable: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MATCH_LIVE_STREAM,
      payload,
      successCallback,
      source: 'Match - Match Live Stream',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()
  if (!defaultDateTimeServer) return null
  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const MatchLiveStream = wrapperDate(
  ({
    tableData,
    loadingData,
    LoadTable,
    totalResults,
    defaultDateTimeServer,
    UpdateTable,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    let { sportOptions } = useSelectOptions()

    sportOptions = [{ value: -99, label: 'All Sport' }].concat(sportOptions)

    const [form] = Form.useForm()
    const [formTable] = Form.useForm()
    const [pagination, setPagination] = useState({
      current_page: 1,
      page_size: 50,
    })

    const reload = React.useCallback(() => {
      form.submit()
    }, [form])
    useEffect(() => {
      reload()
    }, [reload])

    const columns = [
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        align: 'center',
        width: 100,
      },
      {
        title: 'Match Date',
        dataIndex: 'match_date',
        align: 'center',
        width: 120,
        render: text => text.formatDateTimeSecond(),
      },
      {
        title: 'Sport',
        align: 'center',
        dataIndex: 'sport_name',
        width: 100,
      },
      {
        title: 'League',
        dataIndex: 'league',
        width: 450,
      },
      {
        title: 'Home - Away',
        width: 300,
        render: record => (
          <>
            <Typography.Text ellipsis={{ tooltip: record.home_name }} style={{ width: 200 }}>
              {record.home_name}
            </Typography.Text>
            <br />
            <Typography.Text ellipsis={{ tooltip: record.away_name }} style={{ width: 200 }}>
              {record.away_name}
            </Typography.Text>
          </>
        ),
      },
      {
        title: 'Live Stream',
        align: 'center',
        width: 100,
        render: record => (
          <Form.Item name={[record.match_id, 'st_live_stream']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        ),
      },
    ]

    const initialValues = React.useMemo(() => {
      return tableData?.reduce((acc, cur) => {
        const { match_id, st_live_stream } = cur
        const checked = st_live_stream
        acc[match_id] = {
          match_id,
          st_live_stream: (checked === 'Y' && true) || (checked === 'N' && false),
        }
        return acc
      }, {})
    }, [tableData])
    useEffect(() => {
      formTable.setFieldsValue(initialValues)
    }, [formTable, initialValues])

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
              <Form
                form={form}
                className="w-100"
                layout="vertical"
                initialValues={{
                  sport_id: -99,
                  date_range: [
                    defaultDateTimeServer.clone().add(-12, 'hours'),
                    defaultDateTimeServer,
                  ],
                }}
                onValuesChange={() => {
                  reload()
                }}
                onFinish={values => {
                  LoadTable({
                    ...values,
                    date_start: values.use_match_date
                      ? values.date_range[0].format('YYYY-MM-DD HH:mm')
                      : null,
                    date_end: values.use_match_date
                      ? values.date_range[1].format('YYYY-MM-DD HH:mm')
                      : null,
                    ...pagination,
                  })
                }}
                onFinishFailed={({ outOfDate }) => {
                  if (outOfDate) reload()
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="sport_id">
                      <Select placeholder="Select Sport" showSearch options={sportOptions} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="date_range" className="w-100" style={{ marginRight: '110px' }}>
                      <RangePicker
                        className="w-100"
                        allowClear={false}
                        showTime={{ format: 'HH:mm' }}
                      />
                    </Form.Item>
                    <Form.Item name="use_match_date" valuePropName="checked">
                      <Checkbox>Use Match Date</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                {/* <div className="d-flex flex-row" style={{ gap: '8px' }}></div>
            <Form.Item className="mb-0" wrapperCol={{ offset: 4 }}>
              <Button htmlType="submit">Submit</Button>
            </Form.Item> */}
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Row gutter={[0, 60]} justify="space-between">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form
                  form={formTable}
                  onValuesChange={changedValue => {
                    UpdateTable(
                      {
                        match_id: Number(Object.keys(changedValue)),
                        st_live_stream: changedValue[Object.keys(changedValue)].st_live_stream
                          ? 'Y'
                          : 'N',
                      },
                      reload,
                    )
                  }}
                  id="live-stream-checked"
                >
                  <Table
                    rowKey={record => record.match_id}
                    size="small"
                    loading={loadingData}
                    dataSource={tableData}
                    columns={columns}
                    pagination={{
                      showSizeChanger: true,
                      showTotal: total => `Total ${total} items`,
                      total: totalResults,
                      pageSize: pagination.page_size,
                      onChange: (current_page, page_size) => {
                        setPagination({ current_page, page_size })
                        reload()
                      },
                    }}
                  />
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(MatchLiveStream)
