import { Checkbox, Col, Form, Row, Select, Spin, Collapse } from 'antd'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/country-restriction/actions'

const mapStateToProps = ({ countryRestriction }) => ({
  loadingEdit: countryRestriction.loadingEdit,
  selectedDataEdit: countryRestriction.selectedDataEdit,
  dataEdit: countryRestriction.dataEdit,
})

const mapDispatchToProps = dispatch => ({
  LoadEdit: payload => {
    dispatch({
      type: actions.LOAD_EDIT,
      payload,
      source: 'Country Restriction',
    })
  },
  UpdateEdit: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Country Restriction',
    })
  },
})

const { Panel } = Collapse
const EditCountryRestriction = ({
  editData,
  successCallback,

  loadingEdit,
  selectedDataEdit,
  dataEdit,
  LoadEdit,
  UpdateEdit,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    LoadEdit(editData)
  }, [LoadEdit, editData])

  useEffect(() => {
    form.setFieldsValue({
      access: editData.access,
      country: selectedDataEdit,
    })
  }, [editData, selectedDataEdit, form])
  return (
    <Spin spinning={loadingEdit}>
      <Form
        form={form}
        id="edit-form"
        initialValues={{
          access: selectedDataEdit.access,
          country: selectedDataEdit,
        }}
        onFinish={values => {
          UpdateEdit(
            {
              customer_id: editData.customer_id,
              ...values,
              countries: values.country.join(),
            },
            successCallback,
          )
        }}
      >
        <div>
          Agent below User <b>{editData.username}</b> Is{' '}
          <Form.Item name="access" noStyle>
            <Select
              style={{ width: 100 }}
              value={editData.access}
              options={[
                { value: 1, label: 'Authorized' },
                { value: 0, label: 'Blocked' },
              ]}
            />
          </Form.Item>{' '}
          For Following Countries:
        </div>
        <Checkbox
          onClick={e => {
            if (e.target.checked) form.setFieldsValue({ country: [] })
            else form.setFieldsValue({ country: selectedDataEdit })
          }}
        >
          All Countries
        </Checkbox>
        <Form.Item name="country">
          <Checkbox.Group className="w-100">
            <Row justify="space-between">
              {Object.entries(dataEdit).map(([sort, grouped]) => (
                <Col key={sort} span={4}>
                  {Object.entries(grouped).map(([region, items]) => (
                    <Col key={region}>
                      <Collapse>
                        <Panel header={region}>
                          {items.map(country => (
                            <Checkbox
                              key={country.country_iso}
                              value={country.country_iso}
                              className="ml-0 w-100 h-100"
                            >
                              {country.country_name}
                            </Checkbox>
                          ))}
                        </Panel>
                      </Collapse>
                    </Col>
                  ))}
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCountryRestriction)
