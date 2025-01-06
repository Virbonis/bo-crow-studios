import React from 'react'
import { Button, Col, Form, Input, message, Row, Table } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/breakdown-patching/actions'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ breakdownPatching }) => ({
  dataTable: breakdownPatching.data,
  dataTableCopy: breakdownPatching.data_copy,
  loading: breakdownPatching.loading,
  loading_copy: breakdownPatching.loading_copy,
})
const mapDispatchToProps = dispatch => ({
  LoadTable: (payload, isCopy) => {
    dispatch({
      type: actions.LOAD,
      payload,
      isCopy,
      source: 'Breakdown Patching',
    })
  },
  UpdateTraderDeadBall: payload => [
    dispatch({
      type: actions.UPDATE,
      payload,
      source: 'Breakdown Patching',
    }),
  ],
})

const column = [
  {
    title: 'Sport Name',
    dataIndex: 'sport_name',
    width: 100,
  },
  {
    title: 'League Name',
    dataIndex: 'league_name',
    width: 100,
  },
  {
    title: 'Home Team',
    dataIndex: 'home_team_name',
    width: 100,
  },
  {
    title: 'Away Team',
    dataIndex: 'away_team_name',
    width: 100,
  },
  {
    title: 'Match Date',
    dataIndex: 'match_date',
    width: 100,
  },
  {
    title: 'Trader',
    dataIndex: 'trader',
    width: 100,
  },
  {
    title: 'User Team',
    render: ({ user_team_id, user_team_name }) => `${user_team_id} (${user_team_name})`,
    width: 100,
  },
  {
    title: 'User TeamSub',
    render: ({ user_team_sub_id, user_team_sub_name }) =>
      `${user_team_sub_id} (${user_team_sub_name})`,
    width: 100,
  },
  {
    title: 'Special',
    dataIndex: 'special_name',
    width: 100,
  },
]
const BreakdownPatching = ({
  dataTable,
  dataTableCopy,
  loading,
  loading_copy,
  LoadTable,
  UpdateTraderDeadBall,
}) => {
  const [form] = Form.useForm()
  const [formCopy] = Form.useForm()

  const onClickCopy = () => {
    const match_id = form.getFieldValue('match_id')
    const match_id_copy = formCopy.getFieldValue('match_id')
    if (!match_id || !match_id_copy) {
      message.error('MatchID or MatchIDCopy cannot be empty!')
      return
    }

    UpdateTraderDeadBall({
      match_id: Number(match_id),
      match_id_copy: Number(match_id_copy),
    })
  }

  return (
    <>
      <div className="card">
        <div className="card-header ">
          <Form
            form={form}
            className="w-100"
            initialValues={{ match_id: '' }}
            onFinish={values => {
              LoadTable(values, false)
            }}
          >
            <Row>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item
                  name="match_id"
                  rules={[
                    { required: true, message: 'Please input Match ID' },
                    { validator: validatorNumeric },
                  ]}
                >
                  <Input placeholder="Match ID" />
                </Form.Item>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    form.submit()
                  }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
          <Table
            rowKey="league_name"
            loading={loading}
            columns={column}
            dataSource={dataTable}
            pagination={false}
          />
        </div>
        <div className="card-header ">
          <Form
            form={formCopy}
            className="w-100"
            initialValues={{ match_id: '' }}
            onFinish={values => {
              LoadTable(values, true)
            }}
          >
            <Row>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item
                  name="match_id"
                  rules={[
                    { required: true, message: 'Please input Match ID Copy' },
                    { validator: validatorNumeric },
                  ]}
                >
                  <Input placeholder="Match ID Copy" />
                </Form.Item>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    formCopy.submit()
                  }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
          <Table
            rowKey="league_name"
            loading={loading_copy}
            columns={column}
            dataSource={dataTableCopy}
            pagination={false}
          />
        </div>
        <div className="card-footer ">
          <Button type="primary" onClick={onClickCopy}>
            Copy
          </Button>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownPatching)
