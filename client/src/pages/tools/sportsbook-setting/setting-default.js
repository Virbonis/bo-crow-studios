import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Col, Divider, Form, Radio, Row, Table } from 'antd'
import actions from 'redux/sportsbook-setting/actions'
import { isEmpty } from 'lodash'

const mapStateToProps = ({ sportsbookSetting }) => ({
  loadingMatchTable: sportsbookSetting.loadingMatchTable,
  loadingOutrightTable: sportsbookSetting.loadingOutrightTable,
  tableData: sportsbookSetting.tableData,
})

const mapDispatchToProps = (dispatch, { reload }) => ({
  UpdateSwitchDefault: payload => {
    dispatch({
      type: actions.UPDATE_DEFAULT_MATCH_OUTRIGHT,
      payload,
      successCallback: reload,
      source: 'Sportsbook Setting',
    })
  },
})

const DisplayTable = ({
  isAllowed,
  loadingMatchTable,
  loadingOutrightTable,
  tableData,
  UpdateSwitchDefault,
}) => {
  const [form] = Form.useForm()
  const [selectedRowKeysMatch, setSelectedRowKeysMatch] = useState([])
  const [selectedRowKeysOutright, setSelectedRowKeysOutright] = useState([])

  useEffect(() => {
    const initialValuesTable = tableData.reduce((acc, curr) => {
      const { sport_id } = curr
      acc[sport_id] = { ...curr }
      return acc
    }, {})
    form.setFieldsValue(initialValuesTable)
    setSelectedRowKeysMatch([])
    setSelectedRowKeysOutright([])
  }, [tableData, form])

  const columnsMatch = [
    {
      title: 'Sport Name',
      dataIndex: 'sport_name',
    },
    {
      title: 'Match',
      align: 'center',
      render: record => (
        <Form.Item name={[record.sport_id, 'auto_create_match']}>
          <Radio.Group disabled={!isAllowed}>
            <Radio value="SBO">SBO</Radio>
            <Radio value="IBC">IBC</Radio>
          </Radio.Group>
        </Form.Item>
      ),
    },
  ]
  const columnsOutright = [
    {
      title: 'Sport Name',
      dataIndex: 'sport_name',
    },
    {
      title: 'Outright',
      align: 'center',
      render: record => (
        <Form.Item name={[record.sport_id, 'auto_create_outright']}>
          <Radio.Group disabled={!isAllowed}>
            <Radio value="SBO">SBO</Radio>
            <Radio value="IBC">IBC</Radio>
          </Radio.Group>
        </Form.Item>
      ),
    },
  ]

  const onSubmitMatch = () => {
    if (selectedRowKeysMatch.length === 0) return

    const values = form.getFieldsValue()
    const payload = selectedRowKeysMatch.map(sport_id => ({
      sport_id,
      auto_create_match: values[sport_id].auto_create_match,
      auto_create_outright: tableData.find(e => e.sport_id === sport_id)?.auto_create_outright, // prev auto_create_outright
    }))
    UpdateSwitchDefault(payload)
  }
  const onSubmitOutright = () => {
    if (selectedRowKeysOutright.length === 0) return

    const values = form.getFieldsValue()
    const payload = selectedRowKeysOutright.map(sport_id => ({
      sport_id,
      auto_create_match: tableData.find(e => e.sport_id === sport_id)?.auto_create_match, // prev auto_create_match
      auto_create_outright: values[sport_id].auto_create_outright,
    }))
    UpdateSwitchDefault(payload)
  }

  if (isEmpty(tableData)) return null
  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      labelWrap="true"
      className="w-100"
    >
      <Divider className="my-2" />
      <Form.Item label="Switch Default Create Match/Outright">
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Table
              size="small"
              bordered
              rowKey="sport_id"
              loading={loadingMatchTable}
              columns={columnsMatch}
              rowSelection={{
                selectedRowKeys: selectedRowKeysMatch,
                onChange: selectedRow => setSelectedRowKeysMatch(selectedRow),
              }}
              dataSource={tableData}
              pagination={false}
              scroll={{
                y: 240,
              }}
              className={`${!isAllowed && 'disabled-table'}`}
            />
            <Button type="primary" className="mt-2" disabled={!isAllowed} onClick={onSubmitMatch}>
              Submit Match
            </Button>
          </Col>
          <Col span={12}>
            <Table
              size="small"
              bordered
              rowKey="sport_id"
              loading={loadingOutrightTable}
              columns={columnsOutright}
              dataSource={tableData}
              rowSelection={{
                selectedRowKeys: selectedRowKeysOutright,
                onChange: selectedRow => setSelectedRowKeysOutright(selectedRow),
              }}
              pagination={false}
              scroll={{
                y: 240,
              }}
              className={`${!isAllowed && 'disabled-table'}`}
            />
            <Button
              type="primary"
              className="mt-2"
              disabled={!isAllowed}
              onClick={onSubmitOutright}
            >
              Submit Outright
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayTable)
