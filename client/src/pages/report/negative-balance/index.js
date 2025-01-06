import React from 'react'
import { Row, Col, Form, Button, Input, Select, Table, Space } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/negative-balance/actions'
import { Amount } from 'components/blaise'
import { FileExcelOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ negativeBalance }) => ({
  loading: negativeBalance.loadingData,
  tableData: negativeBalance.data.result || [],
  totalResult: negativeBalance.data.total,
  loadingExport: negativeBalance.loadingExport,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Negative Balance',
    })
  },
  Export: payload => {
    dispatch({
      type: actions.EXPORT,
      payload,
      source: 'Negative Balance',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const NegativeBalance = ({
  loading,
  tableData,
  totalResult,
  loadingExport,
  Load,
  Export,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  let { branchOptions } = useSelectOptions()
  branchOptions = [{ value: '', label: 'Show All Branch' }].concat(branchOptions)

  const [form] = Form.useForm()

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      width: 400,
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      align: 'center',
      width: 400,
    },
    {
      title: 'Current Balance',
      dataIndex: 'current_balance',
      align: 'right',
      width: 200,
      render: text => <Amount value={text} />,
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Form
            form={form}
            className="w-100"
            initialValues={{
              branch_id: '',
            }}
            onFinish={values => {
              Load(values)
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
                  <Input maxLength={7} placeholder="Match ID" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                <Form.Item name="username" extra="(Cash Member Only)">
                  <Input placeholder="Username" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                <Form.Item name="branch_id">
                  <Select showSearch optionFilterProp="label" options={branchOptions} />
                </Form.Item>
              </Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                loading={loadingExport}
                onClick={() => Export(form.getFieldsValue())}
              >
                Export
              </Button>
            </Space>
          </Form>
        </div>
        <div className="card-body">
          <Table
            bordered
            size="small"
            rowKey="username"
            loading={loading}
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
          <span className="text-primary font-weight-bold">Total: {totalResult} records</span>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NegativeBalance)
