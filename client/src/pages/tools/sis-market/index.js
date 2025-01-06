import React from 'react'
import { Button, Table, Input, Form, Row, Col } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/sis/actions'
import { Amount } from 'components/blaise'

const mapStateToProps = ({ sis }) => ({
  loadingTable: sis.loadingData,
  dataTable: sis.data_market,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_MARKET,
      payload,
      source: 'SIS Market',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_MARKET }),
})

const columns = [
  {
    title: 'Game Type',
    dataIndex: 'game_type',
  },
  {
    title: 'Line',
    dataIndex: 'line',
    align: 'right',
    width: 70,
  },
  {
    title: 'Handicap',
    dataIndex: 'handicap',
    align: 'right',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Odds 1',
    dataIndex: 'odds1',
    align: 'right',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Odds 2',
    dataIndex: 'odds2',
    align: 'right',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Odds 3',
    dataIndex: 'odds3',
    align: 'right',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Is Displayed',
    dataIndex: 'is_displayed',
    render: text => {
      if (text === 'N') return 'No'
      if (text === 'Y') return 'Yes'
      return ''
    },
  },
  {
    title: 'Stamp Date',
    dataIndex: 'stamp_date',
    render: record => record.formatDateTimeSecond(),
  },
]
const SISMarket = ({ LoadTable, CleanUp, dataTable, loadingTable }) => {
  React.useEffect(() => CleanUp, [CleanUp])

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
    </>
  )
}
const rowKey = record => `${record.game_type}-${record.line}-${record.handicap}`

export default connect(mapStateToProps, mapDispatchToProps)(SISMarket)
