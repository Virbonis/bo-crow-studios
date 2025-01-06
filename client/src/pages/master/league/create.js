import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select } from 'antd'
import actions from 'redux/league/actions'
import { categoryName, validatorSpecialChar } from 'helper'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const categoryOptions = Object.entries(categoryName).map(([key, value]) => ({
  value: key,
  label: value,
}))

const mapDispatchToProps = dispatch => ({
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
})

const CreateLeague = ({ successCallback, Create }) => {
  const [form] = Form.useForm()

  const { profileOptions, sportOptions, competitionOptions } = useSelectOptions('ProfileMaster')

  const compOptions = [{ value: '', label: 'None' }].concat(competitionOptions)

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="add-form"
      initialValues={{
        sport_id: 10,
        profile_id: profileOptions[0].value,
        price_group: 90,
        category: ['0'],
        competition: '',
        active: 'Y',
        short_name: '',
        league_name_en: '',
        league_name_cn: '',
        league_name_tw: '',
        league_name_th: '',
        league_name_jp: '',
        league_name_kr: '',
        league_name_vn: '',
        league_name_id: '',
      }}
      onFinish={values => {
        Create(
          {
            ...values,
            league_name_cn: values.league_name_cn ? values.league_name_cn : values.league_name_en,
            league_name_id: values.league_name_id ? values.league_name_id : values.league_name_en,
            league_name_jp: values.league_name_jp ? values.league_name_jp : values.league_name_en,
            league_name_kr: values.league_name_kr ? values.league_name_kr : values.league_name_en,
            league_name_th: values.league_name_th ? values.league_name_th : values.league_name_en,
            league_name_tw: values.league_name_tw ? values.league_name_tw : values.league_name_en,
            league_name_vn: values.league_name_vn ? values.league_name_vn : values.league_name_en,
            category: values.category.join('^'),
          },
          successCallback,
        )
      }}
    >
      <Form.Item name="sport_id" label="Sport" rules={[{ required: true }]}>
        <Select placeholder="Select Sport" showSearch className="w-100" options={sportOptions} />
      </Form.Item>
      <Form.Item name="profile_id" label="Profile ID" rules={[{ required: true }]}>
        <Select
          placeholder="Select Profile ID"
          showSearch
          className="w-100"
          options={profileOptions}
        />
      </Form.Item>
      <Form.Item name="price_group" label="Group" rules={[{ required: true }]}>
        <Select
          placeholder="Select Group"
          showSearch
          className="w-100"
          options={[
            { label: 'Major', value: 1 },
            { label: 'Medium', value: 2 },
            { label: 'Tournament', value: 3 },
            { label: 'Minor', value: 90 },
          ]}
        />
      </Form.Item>
      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select
          mode="multiple"
          placeholder="Select Category"
          showSearch
          className="w-100"
          options={categoryOptions}
          optionFilterProp="label"
        />
      </Form.Item>
      <Form.Item name="competition" label="Competition">
        <Select
          placeholder="Select Competition"
          showSearch
          className="w-100"
          options={compOptions}
        />
      </Form.Item>
      <Form.Item name="active" label="Active" rules={[{ required: true }]}>
        <Select
          placeholder="Select Active"
          showSearch
          className="w-100"
          options={[
            { label: 'Active', value: 'Y' },
            { label: 'Disabled', value: 'N' },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="league_name_en"
        label="English"
        rules={[
          { required: true, message: 'Please input English Name' },
          { validator: validatorSpecialChar },
        ]}
      >
        <Input type="text" className="w-100" placeholder="English Name" />
      </Form.Item>
      <Form.Item
        name="short_name"
        label="Shortname"
        rules={[
          { required: true, message: 'Please input Short Name' },
          { validator: validatorSpecialChar },
        ]}
      >
        <Input type="text" className="w-100" placeholder="Short Name" />
      </Form.Item>
      <Form.Item
        name="league_name_cn"
        label="Mandarin"
        rules={[{ validator: validatorSpecialChar }]}
      >
        <Input type="text" className="w-100" placeholder="Mandarin Name" />
      </Form.Item>
      <Form.Item name="league_name_tw" label="Taiwan" rules={[{ validator: validatorSpecialChar }]}>
        <Input type="text" className="w-100" placeholder="Taiwan Name" />
      </Form.Item>
      <Form.Item
        name="league_name_th"
        label="Thailand"
        rules={[{ validator: validatorSpecialChar }]}
      >
        <Input type="text" className="w-100" placeholder="Thailand Name" />
      </Form.Item>
      <Form.Item
        name="league_name_jp"
        label="Japanese"
        rules={[{ validator: validatorSpecialChar }]}
      >
        <Input type="text" className="w-100" placeholder="Japanese Name" />
      </Form.Item>
      <Form.Item name="league_name_kr" label="Korean" rules={[{ validator: validatorSpecialChar }]}>
        <Input type="text" className="w-100" placeholder="Korean Name" />
      </Form.Item>
      <Form.Item
        name="league_name_vn"
        label="Vietnamese"
        rules={[{ validator: validatorSpecialChar }]}
      >
        <Input type="text" className="w-100" placeholder="Vietnamese Name" />
      </Form.Item>
      <Form.Item
        name="league_name_id"
        label="Indonesia"
        rules={[{ validator: validatorSpecialChar }]}
      >
        <Input type="text" className="w-100" placeholder="Indonesia Name" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(CreateLeague)
