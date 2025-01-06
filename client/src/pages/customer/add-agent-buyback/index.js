import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, Input, Row, Select, Spin } from 'antd'
import actions from 'redux/shareholder-buyback/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ company, shareholderBuyback }) => ({
  loadingUpdate: shareholderBuyback.loadingData,
  loading: company.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Create: (payload, successCallback) =>
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: '',
    }),
})

const AddAgentBuyback = ({ Create, loadingUpdate, loading }) => {
  const [form] = Form.useForm()

  const { currencyOptions, companyOptions } = useSelectOptions()

  React.useEffect(() => {
    form.setFieldsValue({
      company_id: companyOptions[0]?.value,
      currency: currencyOptions[0]?.value,
    })
  }, [form, companyOptions[0]?.value, currencyOptions[0]?.value]) // eslint-disable-line

  const reload = React.useCallback(() => {
    form.resetFields()
  }, [form])

  return (
    <div className="card">
      <div className="card-body">
        <Spin spinning={loadingUpdate}>
          <Form
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 8 }}
            form={form}
            initialValues={{
              company_id: companyOptions[0]?.value,
              currency: currencyOptions[0]?.value,
            }}
            id="create-form"
            onFinish={values => {
              Create(values, reload)
            }}
          >
            <Spin spinning={loading}>
              <Form.Item
                name="username"
                label="Agent"
                rules={[
                  { required: true, message: 'Please Type Agent Username' },
                  {
                    validator: (_, value) => {
                      if (value.includes(' ')) {
                        return Promise.reject(new Error('No spaces allowed'))
                      }
                      if (/[ `!#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)) {
                        return Promise.reject(new Error('Alpha Numeric, Underscore, and @'))
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input className="w-100" placeholder="Agent Username" maxLength={20} />
              </Form.Item>
              <Form.Item name="company_id" label="Company">
                <Select options={companyOptions} />
              </Form.Item>
              <Form.Item name="currency" label="Currency">
                <Select options={currencyOptions} />
              </Form.Item>
            </Spin>
            <Row>
              <Col offset={2} span={8}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAgentBuyback)
