import React from 'react'
import { Button, Col, DatePicker, Form, Input, Row, Table } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/bbz/actions'
import { useGetDateTimeBusinessHour } from 'components/blaise'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ bbz }) => ({
  loading: bbz.loading,
  dataTable: bbz.data_match_list,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_MATCH_LIST,
      payload: {
        ...payload,
        from_date: payload.match_date[0].format('YYYY-MM-DD HH:mm'),
        to_date: payload.match_date[1].format('YYYY-MM-DD HH:mm'),
      },
      source: 'BBZ Match List',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_MATCH_LIST }),
})

const { RangePicker } = DatePicker
const columns = [
  {
    title: 'Match ID BBZ',
    dataIndex: 'match_id_bbz',
    width: 120,
  },
  {
    title: 'Sport BBZ',
    dataIndex: 'sport_bbz',
    align: 'center',
    width: 90,
  },
  {
    title: 'League BBZ',
    dataIndex: 'league_name_bbz',
    width: 180,
  },
  {
    title: 'Home BBZ',
    dataIndex: 'home_name_bbz',
    width: 150,
  },
  {
    title: 'Away BBZ',
    dataIndex: 'away_name_bbz',
    width: 150,
  },
  {
    title: 'Match Date BBZ',
    dataIndex: 'start_date',
    align: 'center',
    width: 100,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'Status BBZ',
    dataIndex: 'status',
    align: 'center',
    width: 100,
  },
  {
    title: 'Match ID',
    dataIndex: 'match_id',
    align: 'center',
    width: 80,
  },
  {
    title: 'Sport',
    dataIndex: 'sport_name',
    align: 'center',
    width: 100,
  },
  {
    title: 'League',
    width: 180,
    render: ({ league_id, league_name }) => `(${league_id}) ${league_name}`,
  },
  {
    title: 'Home',
    width: 150,
    render: ({ home_id, home_team }) => `(${home_id}) ${home_team}`,
  },
  {
    title: 'Away',
    width: 150,
    render: ({ away_id, away_team }) => `(${away_id}) ${away_team}`,
  },
  {
    title: 'Livestream',
    dataIndex: 'live_stream',
    width: 150,
  },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
    ?.hour(0)
    .minute(0)
  if (!defaultDateTime) return null

  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const BBZMatchList = wrapperDate(({ defaultDateTime, loading, dataTable, LoadTable, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const { formProps, paginationProps } = useCustomHookPagination(LoadTable, true)
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse justify-content-between">
            <Form
              className="w-100"
              initialValues={{ match_date: [defaultDateTime, defaultDateTime] }}
              {...formProps}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="match_id_bbz"
                    extra="*If filter by Match ID BBZ, other filters will be ignored"
                  >
                    <Input placeholder="Match ID BBZ" />
                  </Form.Item>
                  <Form.Item
                    name="match_id"
                    rules={[{ validator: validatorNumeric }]}
                    extra="*If filter by Match ID, filter Match Date BBZ, League BBZ, Home Team BBZ and Away Team
                    BBZ will be ignored"
                  >
                    <Input placeholder="Match ID" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="match_date" label="Match Date BBZ">
                    <RangePicker
                      className="w-100"
                      allowClear={false}
                      format="YYYY-MM-DD HH:mm"
                      showTime={{ format: 'HH:mm' }}
                    />
                  </Form.Item>
                  <Form.Item name="league">
                    <Input placeholder="League BBZ" />
                  </Form.Item>
                  <Form.Item name="home_team">
                    <Input placeholder="Home BBZ" />
                  </Form.Item>
                  <Form.Item name="away_team">
                    <Input placeholder="Away BBZ" />
                  </Form.Item>
                </Col>
              </Row>
              <Button htmlType="submit" type="primary">
                Submit
              </Button>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey="match_id_bbz"
            loading={loading}
            columns={columns}
            dataSource={dataTable}
            pagination={paginationProps}
          />
        </div>
      </div>
    </>
  )
})

// todo: move to helper
const useCustomHookPagination = (LoadTable, isClientSidePagination) => {
  const [pagination, setPagination] = React.useState({
    current_page: 1,
    page_size: 50,
  })
  const submitValueRef = React.useRef()

  const fetch = React.useCallback(() => {
    LoadTable({
      ...submitValueRef.current,
      ...pagination,
    })
  }, [LoadTable, pagination])

  return {
    formProps: {
      onFinish: values => {
        submitValueRef.current = values
        setPagination({ ...pagination, current_page: 1 })
        fetch()
      },
    },
    paginationProps: {
      showSizeChanger: true,
      showTotal: total => `Total ${total} items`,
      current: pagination.current_page,
      pageSize: pagination.page_size,
      onChange: (current_page, page_size) => {
        setPagination({ current_page, page_size })
        if (!isClientSidePagination) fetch()
      },
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BBZMatchList)
