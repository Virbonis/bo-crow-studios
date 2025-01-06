import React, { useState } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/team/actions'
import authEnum from 'authorize'
import { Button, Space, Row, Col, Input, Form, Select, Drawer, Tooltip } from 'antd'
import { ContextProvider } from 'components/blaise/shared-components/context-provider'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { activeOptions, validatorNumeric } from 'helper'
import { useFormWithPagination } from 'components/blaise'
import Create from './create'
import TableTeam from './table-team'

const mapStateToProps = ({ team, auth }) => ({
  tableData: team.data.result,
  loading: team.loading,
  canDelete: auth.user.user_auth_ids.includes(authEnum.ALLOWED_DELETE_MASTER_TEAM),
  totalResults: team.data.total,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Master Team',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Master Team',
    })
  },
})

const MasterTeam = ({ tableData, loading, totalResults, Load, canDelete, Delete, Update }) => {
  const [form] = Form.useForm()
  const { sportOptions } = useSelectOptions()

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])
  React.useEffect(() => reload(), [reload])

  const fetch = React.useCallback(
    values => {
      Load(values)
    },
    [Load],
  )

  const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResults)

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex flex-row-reverse align-items-start" style={{ gap: 8 }}>
          <Space>
            <CreateButton reload={reload} />
            <Tooltip placement="top" title="Refresh list">
              <Button htmlType="submit" icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
          </Space>
          <Form
            form={form}
            className="w-100"
            initialValues={{
              sport_id: 10,
              team_name_en: '',
              team_name: '',
              team_id: '',
              short_name: '',
              active: 'Y',
            }}
            {...formProps}
          >
            <Row gutter={8}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="sport_id" className="mb-0" wrapperCol={{ span: 24 }}>
                  <Select
                    placeholder="Select Sport"
                    showSearch
                    options={sportOptions}
                    optionFilterProp="label"
                  />
                </Form.Item>
                <Form.Item name="team_name_en" className="mb-0">
                  <Input placeholder="Team Name" className="w-100" />
                </Form.Item>
                <Form.Item name="short_name" className="mb-0" wrapperCol={{ span: 24 }}>
                  <Input placeholder="Shortname" />
                </Form.Item>
                <Form.Item
                  name="team_id"
                  className="mb-0"
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      validator: validatorNumeric,
                    },
                  ]}
                >
                  <Input placeholder="Team ID" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="active" className="mb-0" wrapperCol={{ span: 24 }}>
                  <Select
                    placeholder="Active"
                    showSearch
                    options={activeOptions}
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div className="card-body">
        <ContextProvider>
          <TableTeam
            pagination={paginationProps}
            tableData={tableData}
            loading={loading}
            Update={Update}
            canDelete={canDelete}
            Delete={Delete}
            reload={reload}
          />
        </ContextProvider>
      </div>
    </div>
  )
}

const CreateButton = ({ reload }) => {
  const [visibleAdd, setVisibleAdd] = useState(false)
  return (
    <>
      <Button icon={<PlusOutlined />} onClick={() => setVisibleAdd(true)}>
        Create
      </Button>
      <Drawer
        title="Create Team"
        width={420}
        open={visibleAdd}
        onClose={() => setVisibleAdd(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleAdd(false)}>Cancel</Button>
            <Button form="add-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Create
          successCallback={() => {
            setVisibleAdd(false)
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterTeam)
