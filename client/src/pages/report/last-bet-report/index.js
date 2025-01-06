import React from 'react'
import { Row, Col, Form, Button, Input, InputNumber, Select, Table, Space } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/last-bet-report/actions'
import { getGameTypeDescriptionShort, validatorNumeric } from 'helper'
import { Amount, TextHomeFav, TextAwayFav, HDPColumn } from 'components/blaise'

const mapStateToProps = ({ lastBetReport }) => ({
  tableData: lastBetReport.data,
  loading: lastBetReport.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Last Bet Report',
    })
  },
})

const displayOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 200, label: '200' },
]

const statusOptions = [
  { value: 1, label: 'Active' },
  { value: 2, label: 'Reject' },
]

const LastBetReport = ({ Load, tableData, loading }) => {
  const [form] = Form.useForm()

  const columns = [
    {
      title: 'No',
      width: 30,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: 'Branch',
      dataIndex: 'branch_alias',
      align: 'center',
      width: 100,
    },
    {
      title: 'League',
      dataIndex: 'league_name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Home',
      align: 'center',
      width: 100,
      render: record => <TextHomeFav {...record} />,
    },
    {
      title: 'Away',
      align: 'center',
      width: 100,
      render: record => <TextAwayFav {...record} />,
    },
    {
      title: 'Type',
      dataIndex: 'game_type',
      align: 'center',
      width: 80,
      render: text => getGameTypeDescriptionShort(text),
    },
    {
      title: 'HDP',
      align: 'center',
      width: 100,
      render: record => <HDPColumn {...record} bet_fav_status={record.st_fav} />,
    },
    {
      title: 'Odds',
      dataIndex: 'odds',
      align: 'center',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Curr',
      dataIndex: 'currency',
      align: 'center',
      width: 100,
    },
    {
      title: 'Amt',
      dataIndex: 'amount',
      render: text => <Amount className="text-magenta" value={text} int bold />,
      align: 'right',
      width: 100,
    },
    {
      title: 'Bet Date',
      dataIndex: 'trans_date',
      width: 100,
      render: text => text.formatDateTimeSecond(),
      align: 'center',
    },
    {
      title: 'Bet ID',
      dataIndex: 'pending_bet_id',
      align: 'center',
      width: 100,
      render: text => `(${text})`,
    },
    {
      title: 'Stamp User',
      dataIndex: 'stamp_user',
      align: 'center',
      width: 100,
    },
    {
      title: 'Stamp Date',
      dataIndex: 'stamp_date',
      align: 'center',
      width: 100,
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Form
            form={form}
            className="w-100"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ match_id: '', total_row: 10, status: 1 }}
            onFinish={values => {
              Load({
                ...values,
              })
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                <Form.Item
                  name="match_id"
                  label="Match ID"
                  rules={[
                    { required: true, message: 'Please Input Match ID' },
                    { validator: validatorNumeric },
                  ]}
                >
                  <Input placeholder="Match ID" />
                </Form.Item>
                <Form.Item label="Score">
                  <Space>
                    <Form.Item
                      name="home_posisi"
                      rules={[{ required: true, message: 'Please Input Score Home' }]}
                    >
                      <InputNumber
                        placeholder="Score Home"
                        className="w-100"
                        min={0}
                        maxLength={5}
                        controls={false}
                      />
                    </Form.Item>
                    <Form.Item
                      name="away_posisi"
                      rules={[{ required: true, message: 'Please Input Score Away' }]}
                    >
                      <InputNumber
                        placeholder="Score Away"
                        className="w-100"
                        min={0}
                        maxLength={5}
                        controls={false}
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                <Form.Item name="total_row" label="Display">
                  <Select options={displayOptions} />
                </Form.Item>
                <Form.Item name="status" label="Type">
                  <Select options={statusOptions} />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
        <div className="card-body">
          <Table
            bordered
            rowKey="pending_bet_id"
            loading={loading}
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LastBetReport)
