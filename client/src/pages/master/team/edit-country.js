import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Select } from 'antd'
import actions from 'redux/team/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ team }) => ({
  detail: team.detail,
})

const mapDispatchToProps = dispatch => ({
  UpdateCountry: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_COUNTRY,
      payload,
      successCallback,
      source: 'Master Team',
    })
  },
  GetDetail: payload => {
    dispatch({
      type: actions.LOAD_DETAIL,
      payload,
      source: 'Master Team',
    })
  },
})

const EditCountry = ({ detail, GetDetail, editCountryValue, successCallback, UpdateCountry }) => {
  console.log(editCountryValue)
  const [form] = Form.useForm()
  const { countryOptions } = useSelectOptions()

  useEffect(() => {
    GetDetail(editCountryValue)
  }, [GetDetail, editCountryValue])

  useEffect(() => {
    form.setFieldsValue({ country: detail?.country })
  }, [form, detail])

  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        layout="horizontal"
        form={form}
        onFinish={value => {
          console.log(value)
          UpdateCountry({ ...value, team_id: editCountryValue.team_id }, successCallback)
        }}
        id="edit-country-form"
      >
        <Form.Item
          name="country"
          label="Select Country"
          className="w-100"
          rules={[{ required: true }]}
        >
          <Select showSearch className="w-100" options={countryOptions} />
        </Form.Item>
      </Form>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCountry)
