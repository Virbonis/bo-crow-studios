import React from 'react'
import { Button, Col, DatePicker, Form, Input, Row, Table } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/bbz/actions'
import { CustomizeCell, useGetDateTimeBusinessHour } from 'components/blaise'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ bbz }) => ({
  loading: bbz.loading,
  dataTable: bbz.data_incident,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_INCIDENT,
      payload,
      source: 'BBZ Incident',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_INCIDENT }),
})

const { RangePicker } = DatePicker
const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
    ?.hour(0)
    .minute(0)
  if (!defaultDateTime) return null

  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const BBZMatchList = wrapperDate(({ defaultDateTime, loading, dataTable, LoadTable, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const columns = React.useMemo(() => {
    const getRowSpan = (record, index) => {
      const jumlah = dataTable.filter(e => e.match_id === record.match_id).length

      if (dataTable.findIndex(x => x.match_id === record.match_id) !== index) {
        return 0
      }
      return jumlah
    }
    return [
      {
        title: 'Match ID BBZ',
        width: 300,
        render: ({ match_id_bbz, start_date }) => {
          return (
            <>
              {match_id_bbz}
              <br />
              {start_date.formatDateTimeSecond()}
            </>
          )
        },
        onCell: (record, index) => ({
          rowSpan: getRowSpan(record, index),
        }),
      },
      {
        title: 'Match',
        width: 300,
        render: ({ match_id, league_name, home_team, away_team }) => {
          return (
            <>
              {match_id}
              <br />
              {league_name}
              <br />
              {home_team} - {away_team}
            </>
          )
        },
        onCell: (record, index) => ({
          rowSpan: getRowSpan(record, index),
        }),
      },
      {
        title: 'Incident Name',
        dataIndex: 'incident_name',
        align: 'center',
        width: 120,
      },
      {
        title: 'Incident Value',
        dataIndex: 'incident_value',
        align: 'center',
        width: 120,
      },
      {
        title: 'Stamp Date',
        dataIndex: 'stamp_date',
        align: 'center',
        render: data => data.formatDateTimeSecond(),
        width: 120,
      },
    ]
  }, [dataTable])

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse justify-content-between">
            <Form
              className="w-100"
              initialValues={{
                match_date: [defaultDateTime, defaultDateTime],
              }}
              onFinish={values => {
                LoadTable({
                  ...values,
                  from_date: values.match_date[0].format('YYYY-MM-DD HH:mm'),
                  to_date: values.match_date[1].format('YYYY-MM-DD HH:mm'),
                })
              }}
            >
              <Row gutter={8}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="match_date" label="Stamp Date">
                    <RangePicker
                      className="w-100"
                      allowClear={false}
                      format="YYYY-MM-DD HH:mm"
                      showTime={{ format: 'HH:mm' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="match_id_bbz"
                    extra="*If filter by Match ID BBZ, other filters will ignored"
                  >
                    <Input placeholder="Match ID BBZ" />
                  </Form.Item>
                  <Form.Item
                    name="match_id"
                    rules={[{ validator: validatorNumeric }]}
                    extra="*If filter by Match ID, filter Stamp Date will ignored"
                  >
                    <Input placeholder="Match ID" />
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
            rowKey={rowKey}
            loading={loading}
            columns={columns}
            dataSource={dataTable}
            pagination={false}
            components={components}
          />
        </div>
      </div>
    </>
  )
})
const rowKey = record => `${record.match_id_bbz}-${record.stamp_date}`
const components = {
  body: {
    cell: CustomizeCell,
  },
}

export default connect(mapStateToProps, mapDispatchToProps)(BBZMatchList)
