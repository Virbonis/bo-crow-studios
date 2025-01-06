import React, { useEffect } from 'react'
import { Button, Space, Select, Radio, Row, Popconfirm, Form, Tooltip, Input } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/profile/actions'
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import authorize from 'authorize'
import TableProfile from './table-profile'

const mapStateToProps = ({ profile, auth: { user } }) => ({
  loadingItem: profile.loadingItem,
  dataEventLimit: profile.dataEventLimit,
  dataPayout: profile.dataPayout,
  dataPayoutSpec: profile.dataPayoutSpec,
  loadingData: profile.loadingData,
  allowDelete: user.user_auth_ids.includes(authorize.ALLOWED_DELETE_MASTER_PROFILE),
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_DATA,
      payload,
      source: 'Master Profile',
    })
  },
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Master Profile',
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'Master Profile',
    })
  },
})

const ProfileMaster = ({
  dataEventLimit,
  dataPayout,
  dataPayoutSpec,
  LoadTable,
  loadingData,
  Create,
  Delete,
  allowDelete,
}) => {
  const [form] = Form.useForm()
  const [formCreate] = Form.useForm()
  const RadioGroup = Radio.Group

  const { profileOptions } = useSelectOptions()

  const refresh = () => {
    form.submit()
  }

  useEffect(() => {
    form.setFieldsValue({
      profile_id: profileOptions[0]?.value || '',
      soccer_os: '',
    })
    refresh()
  }, [form, profileOptions[0]?.value]) //eslint-disable-line

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Form
            form={formCreate}
            id="create-form"
            layout="inline"
            className="mb-2 w-100"
            onFinish={values => {
              Create({ profile_id: values.new_profile }, () => {
                formCreate.resetFields()
                form.setFieldsValue({ profile_id: values.new_profile })
                refresh()
              })
            }}
          >
            <Form.Item name="new_profile" rules={[{ required: true }]}>
              <Input placeholder="New Profile" style={{ width: 200 }} />
            </Form.Item>
            <Button form="create-form" htmlType="submit" icon={<PlusOutlined />}>
              Add Profile
            </Button>
          </Form>
          <Form
            form={form}
            id="profile-form"
            className="w-100"
            onValuesChange={() => {
              form.submit()
            }}
            onFinish={values => {
              LoadTable(values)
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 8 }}>
              <Space align="start">
                <Tooltip placement="top" title="Refresh list">
                  <Button onClick={() => refresh()} icon={<ReloadOutlined />} />
                </Tooltip>
              </Space>
              <Row className="w-100">
                <Form.Item name="profile_id">
                  <Select
                    style={{ width: 200 }}
                    placeholder="Select Profile"
                    showSearch
                    options={profileOptions}
                  />
                </Form.Item>
                {allowDelete && (
                  <Popconfirm
                    title="Sure to delete profile?"
                    onConfirm={() => {
                      Delete({ profile_id: form.getFieldValue('profile_id') }, () => {
                        form.setFieldsValue({
                          profile_id:
                            profileOptions[0].value === undefined
                              ? profileOptions[1].value
                              : profileOptions[0].value,
                        })
                        refresh()
                      })
                    }}
                  >
                    <Button icon={<DeleteOutlined />}>Delete Profile</Button>
                  </Popconfirm>
                )}
                <Form.Item name="soccer_os" label="Game Type" className="ml-2">
                  <RadioGroup onChange={refresh}>
                    <Radio value="">All</Radio>
                    <Radio value="Soccer">Soccer</Radio>
                    <Radio value="OS">OS</Radio>
                  </RadioGroup>
                </Form.Item>
              </Row>
            </div>
          </Form>
        </div>
        <div className="card-body">
          <TableProfile
            dataEventLimit={dataEventLimit}
            dataPayout={dataPayout}
            dataPayoutSpec={dataPayoutSpec}
            loadingData={loadingData}
            form={form}
            refresh={refresh}
          />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMaster)
