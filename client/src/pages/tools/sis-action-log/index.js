import React from 'react'
import { Button, Table, Input, Form, Row, Col, Drawer } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/sis/actions'
import Detail from './detail'

const mapStateToProps = ({ sis }) => ({
  loadingTable: sis.loadingData,
  dataTable: sis.data_action_log,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_ACTION_LOG,
      payload,
      source: 'SIS Action Log',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_ACTION_LOG }),
})

const SISActionLog = ({ LoadTable, CleanUp, loadingTable, dataTable }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [detailValue, setDetailValue] = React.useState()
  const [visibleDetail, setVisibleDetail] = React.useState()

  const columns = [
    {
      title: 'Log Description',
      dataIndex: 'log_desc',
    },
    {
      title: 'Log Date',
      dataIndex: 'log_date',
      render: text => text.formatDateTimeSecond(),
    },
    {
      title: 'Detail',
      align: 'center',
      render: record => {
        if (record.log_desc === 'Copy Market')
          return (
            <Button
              type="link"
              onClick={() => {
                setDetailValue(record)
                setVisibleDetail(true)
              }}
            >
              Detail
            </Button>
          )
        return null
      },
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse">
          <div className="w-100">
            <Form
              id="form"
              layout="vertical"
              onFinish={values => {
                LoadTable(values)
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="match_id_sis" className="mb-0">
                    <Input className="w-100" placeholder="Match ID SIS" />
                  </Form.Item>
                  <Form.Item name="match_id" className="mb-0">
                    <Input className="w-100" placeholder="Match ID" />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey={rowKey}
            size="small"
            loading={loadingTable}
            dataSource={dataTable}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Detail Copy Market Log"
        width={1000}
        open={visibleDetail}
        onClose={() => setVisibleDetail(false)}
        destroyOnClose
      >
        <Detail detailValue={detailValue} />
      </Drawer>
    </>
  )
}
const rowKey = record => `${record.event_id}-${record.log_desc}-${record.log_date}`

export default connect(mapStateToProps, mapDispatchToProps)(SISActionLog)
