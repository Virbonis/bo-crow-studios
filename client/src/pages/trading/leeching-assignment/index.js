import { Alert, Button, Checkbox, Col, Form, Row, Table, Tooltip, message } from 'antd'
import React from 'react'
import { ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/leeching-assignment/actions'
import authEnum from 'authorize'
import TableLeague from './table-league'

const mapStateToProps = ({ leechingAssignment, auth }) => ({
  loadingData: leechingAssignment.loadingSport,
  tableData: leechingAssignment.sportData,
  havePermission: auth.user.user_auth_ids.includes(authEnum.WHO_CAN_CHANGE_LEECHING_ASSIGNMENT),
})

const mapDispatchToProps = dispatch => ({
  LoadSport: () => {
    dispatch({
      type: actions.LOAD_SPORT,
      source: 'Leeching Assignment',
    })
  },
  UpdateSport: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SPORT,
      payload,
      successCallback,
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const LeechingAssignment = ({
  loadingData,
  tableData,
  LoadSport,
  UpdateSport,
  CleanUp,
  havePermission,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [form] = Form.useForm()
  const [sportID, setSportID] = React.useState(null)

  React.useEffect(() => {
    LoadSport()
  }, [LoadSport])
  const reload = React.useCallback(() => {
    LoadSport()
    setSportID(null) // DI SET KE NULL BIAR USE EFFECT DI LOAD TABLE-LEAGUE JALAN
  }, [LoadSport])

  React.useEffect(() => {
    const initialValuesSport = tableData.reduce((acc, curr) => {
      const { sport_id, db_auto_odds, rb_auto_odds } = curr
      acc[sport_id] = {
        db_ht: [0, 2].includes(db_auto_odds),
        db_ft: [0, 1].includes(db_auto_odds),
        rb_ht: [0, 2].includes(rb_auto_odds),
        rb_ft: [0, 1].includes(rb_auto_odds),
      }
      return acc
    }, {})
    form.setFieldsValue(initialValuesSport)
  }, [form, tableData])
  const columns = [
    {
      title: 'Sport',
      width: 100,
      render: record => (
        <Button className="p-0" type="link" onClick={() => setSportID(record.sport_id)}>
          {record.sport_name}
        </Button>
      ),
    },
    {
      title: 'Dead Ball',
      children: [
        {
          title: 'HT',
          align: 'center',
          width: 40,
          render: record => (
            <Form.Item name={[record.sport_id, 'db_ht']} valuePropName="checked">
              <Checkbox />
            </Form.Item>
          ),
        },
        {
          title: 'FT',
          align: 'center',
          width: 40,
          render: record => (
            <Form.Item name={[record.sport_id, 'db_ft']} valuePropName="checked">
              <Checkbox />
            </Form.Item>
          ),
        },
      ],
    },
    {
      title: 'Running Ball',
      children: [
        {
          title: 'HT',
          align: 'center',
          width: 40,
          render: record => (
            <Form.Item name={[record.sport_id, 'rb_ht']} valuePropName="checked">
              <Checkbox />
            </Form.Item>
          ),
        },
        {
          title: 'FT',
          align: 'center',
          width: 40,
          render: record => (
            <Form.Item name={[record.sport_id, 'rb_ft']} valuePropName="checked">
              <Checkbox />
            </Form.Item>
          ),
        },
      ],
    },
  ]

  if (!havePermission)
    return (
      <Alert message="You are not allowed to access this page!" type="error" className="mb-1" />
    )

  return (
    <div className="card">
      <div className="card-body">
        <Row gutter={8} wrap={false}>
          <Col flex="0 1 400px">
            <Form
              size="small"
              form={form}
              onFinish={values => {
                const convertValue = Object.entries(values).map(([key, val]) => {
                  const getDBAutoOddsValue = (db_ht, db_ft) => {
                    if (db_ft && db_ht) return 0
                    if (db_ft) return 1
                    if (db_ht) return 2
                    return 3
                  }
                  const getRBAutoOddsValue = (rb_ht, rb_ft) => {
                    if (rb_ft && rb_ht) return 0
                    if (rb_ft) return 1
                    if (rb_ht) return 2
                    return 3
                  }
                  return {
                    db_auto_odds: getDBAutoOddsValue(val.db_ht, val.db_ft),
                    rb_auto_odds: getRBAutoOddsValue(val.rb_ht, val.rb_ft),
                    sport_id: Number(key),
                  }
                })
                // filter convertValue hanya yang berubah
                const filteredConvertValue = convertValue.filter(
                  item =>
                    item.db_auto_odds !==
                      tableData.find(x => x.sport_id === item.sport_id).db_auto_odds ||
                    item.rb_auto_odds !==
                      tableData.find(x => x.sport_id === item.sport_id).rb_auto_odds,
                )

                if (filteredConvertValue.length === 0) {
                  message.info('No changes detected')
                  return
                }

                UpdateSport(filteredConvertValue, reload)
              }}
            >
              <Table
                bordered
                rowKey="sport_id"
                size="small"
                dataSource={tableData}
                columns={columns}
                loading={loadingData}
                pagination={false}
                footer={() => (
                  <div align="right">
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </div>
                )}
                scroll={{
                  x: 'max-content',
                  y: 500,
                }}
              />
            </Form>
          </Col>
          <Col>
            <Tooltip placement="top" title="Refresh list">
              <Button onClick={reload} icon={<ReloadOutlined />} />
            </Tooltip>
          </Col>
          <Col flex="1 1 800px">{!!sportID && <TableLeague sportID={sportID} />}</Col>
        </Row>
      </div>
      <div className="card-footer">
        <b>
          Notes:
          <br />
          Tick = Manual (Unfollow)
          <br />
          Untick = Follow Leeching
        </b>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LeechingAssignment)
