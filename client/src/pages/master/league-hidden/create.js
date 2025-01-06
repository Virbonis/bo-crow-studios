import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Select, Table, Tooltip } from 'antd'
import actions from 'redux/league-hidden/actions'
import actionsLeague from 'redux/league/actions'
import { ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { throttle } from 'lodash'

const mapStateToProps = ({ league }) => ({
  tableData: league.dataSearch,
  loadingData: league.loadingSearch,
})

const mapDispatchToProps = dispatch => ({
  Search: payload => {
    dispatch({
      type: actionsLeague.SEARCH,
      payload,
      source: 'Master League Hidden',
    })
  },
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Master League Hidden',
    })
  },
  CleanUpSearch: () => dispatch({ type: actionsLeague.CLEAN_UP_SEARCH }),
})

const columns = [
  {
    title: 'League ID',
    dataIndex: 'league_id',
    width: 300,
  },

  {
    title: 'League Name',
    dataIndex: 'league_name',
    width: 300,
  },
]
const AddLeagueHidden = ({
  successCallback,
  Create,
  Search,
  tableData,
  loadingData,
  CleanUpSearch,
}) => {
  React.useEffect(() => CleanUpSearch, [CleanUpSearch])

  const { sportOptions, branchOptions, currencyOptions: currOptions } = useSelectOptions()
  const currencyOptions = [{ value: 'ALL', label: 'ALL' }].concat(currOptions)

  const [form] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState([])

  const throttleSearch = useCallback(
    throttle(() => {
      const { sport_id, league_name } = form.getFieldsValue()

      if (league_name?.length > 2) {
        setSelectedRows([])
        Search({ sport_id, league_name })
      }
    }, 500),
    [Search, form],
  )

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      labelAlign="left"
      form={form}
      id="add-form"
      initialValues={{
        sport_id: 10,
        currency: 'ALL',
        branch_code: branchOptions[0].value,
        league_name: '',
        league_ids: [],
      }}
      onFinish={values => {
        Create(values, successCallback)
      }}
    >
      <Form.Item name="branch_code" label="Branch">
        <Select placeholder="Select Branch" showSearch className="w-100" options={branchOptions} />
      </Form.Item>
      <Form.Item name="currency" label="Currency">
        <Select
          placeholder="Select Currency"
          showSearch
          className="w-100"
          options={currencyOptions}
        />
      </Form.Item>
      <Form.Item name="sport_id" label="Sport">
        <Select placeholder="Select Sport" showSearch className="w-100" options={sportOptions} />
      </Form.Item>
      <Form.Item name="league_name" label="League Name" extra="*Type to search League Name">
        <Input placeholder="League Name" onChange={throttleSearch} />
      </Form.Item>
      <Tooltip placement="top" title="Refresh list">
        <Button icon={<ReloadOutlined />} onClick={throttleSearch} />
      </Tooltip>
      <Form.Item
        name="league_ids"
        rules={[{ required: true, message: 'Please select any league' }]}
      >
        <Table
          rowKey={record => record.league_id}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRows,
            onChange: selectedRowKeys => {
              setSelectedRows([...selectedRowKeys])
              form.setFieldsValue({ league_ids: [...selectedRowKeys] })
            },
          }}
          size="small"
          loading={loadingData}
          dataSource={tableData}
          columns={columns}
          pagination={false}
          scroll={{ y: 500 }}
        />
      </Form.Item>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLeagueHidden)
