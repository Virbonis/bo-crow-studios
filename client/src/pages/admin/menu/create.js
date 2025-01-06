import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch, InputNumber, Cascader, Select } from 'antd'
import actions from 'redux/admin/menu/actions'
import { createMenuTree } from 'services/menu'
import { listFEIcon } from 'helper'

const mapStateToProps = ({ menu }) => ({
  parentMenuOptions: menu.data
    .filter(x => x.category === false && (x.url === null || x.url === ''))
    .map(x => ({ value: x.menu_id, label: x.title, ...x })),
})

const mapDispatchToProps = (dispatch, { isMulticomp }) => ({
  Create: (payload, successCallback) =>
    dispatch({
      type: actions.CREATE,
      payload: {
        ...payload,
        is_multicomp: isMulticomp,
      },
      successCallback,
      source: '',
    }),
})

const CreateForm = ({ isMulticomp, parentMenuOptions, Create, successCallback }) => {
  const [form] = Form.useForm()

  const newParentMenuOptions = React.useMemo(() => createMenuTree(parentMenuOptions), [
    parentMenuOptions,
  ])

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="create-form"
      onFinish={values => {
        Create(
          {
            ...values,
            parent_id: values.parent_id?.[values.parent_id.length - 1],
          },
          () => {
            successCallback()
            form.resetFields()
          },
        )
      }}
    >
      <Form.Item
        name="parent_id"
        label="Parent Menu"
        extra="*Empty the form to remove it from the parent"
      >
        <Cascader placeholder="Select Parent Menu" options={newParentMenuOptions} changeOnSelect />
      </Form.Item>
      <Form.Item
        name="menu_number"
        label="Menu Number"
        rules={[{ type: 'number', min: 0, max: 99 }]}
      >
        <InputNumber className="w-100" placeholder="Menu Number" />
      </Form.Item>
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input title!' }]}
      >
        <Input placeholder="Title" />
      </Form.Item>
      <Form.Item name="url" label="URL">
        <Input placeholder="URL" />
      </Form.Item>
      <Form.Item name="icon" label="Icon">
        <Select
          allowClear
          showSearch
          placeholder="Select Icon"
          options={listFEIcon}
          optionRender={option => {
            return (
              <div className="d-flex align-items-center">
                <span className={`mr-2 ${option.value}`} />
                <span>{option.label}</span>
              </div>
            )
          }}
        />
      </Form.Item>
      <Form.Item name="category" label="Category" valuePropName="checked">
        <Switch />
      </Form.Item>
      {/* <Form.Item name="is_multicomp" label="Whitelabel" valuePropName="checked">
        <Switch />
      </Form.Item> */}
      {!isMulticomp && (
        <Form.Item name="is_for_trader" label="Is For Trader" valuePropName="checked">
          <Switch />
        </Form.Item>
      )}
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateForm)
