import React, { useState } from 'react'
import { Button, Space, Row, Col, Select, Input, Form, Drawer, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { ContextProvider } from 'components/blaise/shared-components/context-provider'
import actions from 'redux/league/actions'
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { activeOptions, categoryName, groupOptions, sortByOptions, validatorNumeric } from 'helper'
import { useFormWithPagination } from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import authorize from 'authorize'
import Create from './create'
import TableLeague from './table-league'

const categoryOptions = [{ value: '-99', label: 'All Category' }].concat(
  Object.entries(categoryName).map(([key, value]) => ({
    value: key,
    label: value,
  })),
)

const mapStateToProps = ({ league, auth }) => ({
  tableData: league.data.result,
  loading: league.loading,
  loadingExport: league.loadingExport,
  totalResults: league.data.total,
  dataExport: league.dataExport,
  allowEditLeagueSeq: auth.user.user_auth_ids.includes(authorize.ALLOWED_EDIT_LEAGUE_SEQ),
  allowChangeLeagueName: auth.user.user_auth_ids.includes(
    authorize.ALLOWED_UPDATE_MASTER_LEAGUE_NAME,
  ),
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_DATA,
      payload,
      source: 'Master League',
    })
  },
  LoadExportData: payload => {
    dispatch({
      type: actions.LOAD_EXPORT_DATA,
      payload,
      source: 'Master League',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const convertCategory = category => {
  if (category.includes('-99')) return '-99'
  return category.toString()
}
const MasterLeague = ({
  tableData,
  loading,
  allowEditLeagueSeq,
  allowChangeLeagueName,
  LoadTable,
  totalResults,
  LoadExportData,
  loadingExport,
  Update,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [form] = Form.useForm()

  const {
    sportOptions,
    profileOptions: profileTemp,
    profile1x2Options: profile1x2Temp,
    competitionOptions,
  } = useSelectOptions()
  const profile1x2Options = [{ value: '', label: 'All Profile 1X2' }].concat(profile1x2Temp)
  const profileOptions = [{ value: '', label: 'All Profile' }].concat(profileTemp)
  const compOptions = [{ value: 'None', label: 'None' }].concat(competitionOptions)

  const fetch = React.useCallback(
    values => {
      LoadTable({
        ...values,
        category: convertCategory(values.category),
      })
    },
    [LoadTable],
  )
  const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResults)

  const reload = React.useCallback(() => form.submit(), [form])
  React.useEffect(() => reload(), [reload])

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse align-items-start" style={{ gap: 8 }}>
            <Space align="start">
              <span>
                <CreateButton reload={reload} />
                <br />
                <Tooltip
                  title="Export to XLS list league that not used in last 45 days"
                  placement="top"
                >
                  <Button
                    icon={<FileExcelOutlined />}
                    onClick={() =>
                      LoadExportData({
                        sport_id: form.getFieldValue('sport_id'),
                      })
                    }
                    loading={loadingExport}
                  >
                    XLS
                  </Button>
                </Tooltip>
              </span>
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
            </Space>
            <Form
              form={form}
              className="w-100"
              initialValues={{
                sport_id: 10,
                league_name_en: '',
                short_name: '',
                profile_id: '',
                profile1x2: '',
                price_group: 0,
                category: ['-99'],
                competition: '',
                active: 'Y',
                current_page: 1,
                page_size: 1,
                sort: 'Nama_Events',
                by: 'Asc',
              }}
              {...formProps}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="sport_id" className="mb-0">
                    <Select
                      placeholder="Select Sport"
                      showSearch
                      options={sportOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item name="league_name_en" className="mb-0">
                    <Input placeholder="League Name" />
                  </Form.Item>
                  <Form.Item name="short_name" className="mb-0">
                    <Input placeholder="Shortname" />
                  </Form.Item>
                  <Form.Item
                    name="league_id"
                    className="mb-0"
                    rules={[{ validator: validatorNumeric }]}
                  >
                    <Input placeholder="League ID" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="profile_id" className="mb-0">
                    <Select
                      placeholder="Profile ID"
                      showSearch
                      options={profileOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item name="profile1x2" className="mb-0">
                    <Select
                      placeholder="Profile1X2"
                      showSearch
                      options={profile1x2Options}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item name="price_group" className="mb-0">
                    <Select
                      placeholder="Group"
                      showSearch
                      options={groupOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item name="category" className="mb-0">
                    <Select
                      mode="multiple"
                      placeholder="Category"
                      showSearch
                      options={categoryOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item name="active" className="mb-0">
                    <Select
                      placeholder="Active"
                      showSearch
                      options={activeOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="sort" label="Sort by" className="mb-0">
                    <Select
                      placeholder="Select a sort"
                      showSearch
                      options={[
                        { value: 'Nama_Events', label: 'English' },
                        { value: 'No_Display', label: 'Seq Non Live' },
                        { value: 'No_Display_Live', label: 'Seq Live' },
                      ]}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item name="by" label="Order by" className="mb-0">
                    <Select
                      placeholder="By"
                      showSearch
                      options={sortByOptions}
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
            <TableLeague
              size="small"
              bordered
              loading={loading}
              tableData={tableData}
              pagination={paginationProps}
              compOptions={compOptions}
              reload={reload}
              allowChangeLeagueName={allowChangeLeagueName}
              allowEditLeagueSeq={allowEditLeagueSeq}
              Update={Update}
            />
          </ContextProvider>
        </div>
      </div>
    </>
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
        title="Create League"
        width={600}
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

export default connect(mapStateToProps, mapDispatchToProps)(MasterLeague)
