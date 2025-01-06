import React, { useCallback, useEffect, useState } from 'react'
import { Button, Select, Table, Form, Tooltip, InputNumber, Typography, Row, Col } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/branch/actions'
import { ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ branch }) => ({
  tableData: branch.sportLimit,
  loadingData: branch.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_SPORT_LIMIT,
      payload,
      source: 'Master Branch Sport Limit',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SPORT_LIMIT,
      payload,
      source: 'Master Branch Sport Limit',
      successCallback,
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_SPORT_LIMIT,
      payload,
      successCallback,
      source: 'Master Branch Sport Limit',
    })
  },
})

const BranchSportLimit = ({ tableData, loadingData, Load, Update, Delete }) => {
  const [form] = Form.useForm()
  const [formTable] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState([])

  const { currencyOptions, branchOptions } = useSelectOptions()

  const refresh = useCallback(() => {
    form.submit()
    setSelectedRows([])
  }, [form])

  useEffect(() => {
    form.setFieldsValue({
      currency: currencyOptions[0]?.value,
      branch_id: branchOptions[0]?.value,
    })
    refresh()
  }, [form, currencyOptions[0]?.value, branchOptions[0]?.value]) // eslint-disable-line

  useEffect(() => {
    formTable.setFieldsValue(tableData)
  }, [formTable, tableData])

  const columns = [
    {
      title: 'Sport',
      width: 400,
      render: (_, { sport_name }, index) => (
        <Form.Item name={[index, 'sport_id']} noStyle>
          <Typography.Text>{sport_name}</Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: 'Min Bet Live Stream',
      dataIndex: 'min_bet_live_stream',
      width: 400,
      render: (text, { sport_id }, index) => {
        if (selectedRows.includes(sport_id))
          return (
            <Form.Item name={[index, 'min_bet_live_stream']} noStyle>
              <InputNumber min={0} max={9999} className="w-50" />
            </Form.Item>
          )
        return text === 0 ? 'Default' : text
      },
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: record =>
        record.min_bet_live_stream !== 0 &&
        record.sport_id !== '-99' && (
          <Button
            type="link"
            onClick={() => {
              Delete({ ...record, ...form.getFieldsValue() }, refresh)
            }}
          >
            Revert to default
          </Button>
        ),
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse align-items-start" style={{ gap: 8 }}>
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={refresh} />
            </Tooltip>
            <Form form={form} className="w-100" onValuesChange={refresh} onFinish={Load}>
              <Row gutter={8}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="currency">
                    <Select
                      placeholder="Select Currency"
                      showSearch
                      options={currencyOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="branch_id">
                    <Select
                      placeholder="Select Branch"
                      showSearch
                      options={branchOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Form
            size="small"
            form={formTable}
            onFinish={values => {
              const arrValues = Object.values(values)
              if (selectedRows.length > 0) {
                Update(
                  {
                    ...form.getFieldsValue(),
                    sport_limits: selectedRows.map(sport_id =>
                      arrValues.find(v => v.sport_id === sport_id),
                    ),
                  },
                  refresh,
                )
              }
            }}
          >
            <Table
              rowKey={record => record.sport_id}
              rowSelection={{
                selectedRowKeys: selectedRows,
                onChange: selectedRowKeys => setSelectedRows(selectedRowKeys),
              }}
              size="small"
              loading={loadingData}
              dataSource={tableData}
              columns={columns}
              pagination={false}
            />
          </Form>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BranchSportLimit)
