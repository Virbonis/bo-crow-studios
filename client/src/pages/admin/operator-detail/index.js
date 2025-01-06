import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Alert, Button, Checkbox, Col, Divider, Form, Input, Row, Spin, Tooltip } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import authEnum from 'authorize'
import actions from 'redux/operator-detail/actions'
import { isEmpty } from 'lodash'

const mapStateToProps = ({ operatorDetail, auth }) => ({
  loading: operatorDetail.loading,
  data: operatorDetail.data,
  allowToEdit: auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_EDIT_OPERATOR_DETAIL),
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Operator Detail',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Operator Detail',
    })
  },
})

const OperatorDetail = ({ loading, data, Load, Update, allowToEdit }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    Load()
  }, [Load])

  useEffect(() => {
    const { branch_id, branch_name, configs, currencies } = data
    form.setFieldsValue({
      branch_id,
      branch_name,
      configs: configs?.reduce((acc, curr) => {
        acc[`${curr.config_key}`] = curr.config_value
        return acc
      }, {}),
      currencies: currencies?.filter(e => e.flag).map(e => e.currency),
    })
  }, [data, form])

  return (
    <div className="card">
      <div className="card-header d-flex flex-row-reverse justify-content-between">
        <Tooltip placement="top" title="Refresh list">
          <Button icon={<ReloadOutlined />} onClick={() => Load()} />
        </Tooltip>
        {!allowToEdit && (
          <Alert message="You are not allowed to edit this page" type="error" className="w-50" />
        )}
      </div>
      <div className="card-body">
        <Spin spinning={loading}>
          <Form
            form={form}
            onFinish={values => {
              Update(
                {
                  branch_id: values.branch_id,
                  branch_name: values.branch_name,
                  configs: Object.entries(values.configs)
                    .map(e => `${e[0]}^${e[1]}`)
                    .join('~'),
                  currencies: values.currencies.join(','),
                },
                Load,
              )
            }}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            labelAlign="right"
          >
            {!isEmpty(data) && (
              <>
                <Form.Item label="Branch ID" name="branch_id">
                  <Input bordered={false} disabled />
                </Form.Item>
                <Form.Item label="Branch Name" name="branch_name">
                  <Input bordered={false} disabled />
                </Form.Item>
                <Divider className="m-2" />
                <Row gutter={[8, 8]}>
                  <Col span={4} align="right">
                    Config Key
                  </Col>
                  <Col span={16}>Config Value</Col>
                </Row>
                {data.configs?.map(e => (
                  <Form.Item
                    key={e.config_key}
                    label={e.config_key}
                    name={['configs', e.config_key]}
                  >
                    <Input disabled={!allowToEdit} />
                  </Form.Item>
                ))}
                <Form.Item label="Shareholder By Currency" name="currencies">
                  <Checkbox.Group>
                    <Row gutter={[2, 0]} style={{ marginRight: '200px' }}>
                      {data.currencies?.map(e => (
                        <Col key={e.currency} span={8}>
                          <Checkbox value={e.currency} disabled={e.flag || !allowToEdit}>
                            {e.currency}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Divider className="m-2" />
                <Col offset={4} span={16}>
                  <Button type="primary" htmlType="submit" disabled={!allowToEdit}>
                    Submit
                  </Button>
                </Col>
              </>
            )}
          </Form>
        </Spin>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(OperatorDetail)
