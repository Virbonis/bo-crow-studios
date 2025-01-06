import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, InputNumber, Select, Table, Tooltip } from 'antd'
import actions from 'redux/league-duplicate-match/actions'
import { ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { throttle } from 'lodash'

const mapStateToProps = ({ leagueDuplicateMatch }) => ({
  tableData: leagueDuplicateMatch.dataSearch,
  loadingData: leagueDuplicateMatch.loadingSearch,
})

const mapDispatchToProps = dispatch => ({
  Search: payload => {
    dispatch({
      type: actions.SEARCH,
      payload,
      source: 'Master League Duplicate Match',
    })
  },
  Insert: (payload, successCallback) => {
    dispatch({
      type: actions.INSERT,
      payload,
      successCallback,
      source: 'Master League Duplicate Match',
    })
  },
  CleanUpSearch: () => dispatch({ type: actions.CLEAN_UP_SEARCH }),
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
const AddLeagueDuplicateMatch = ({
  successCallback,
  Insert,
  Search,
  tableData,
  loadingData,
  CleanUpSearch,
}) => {
  React.useEffect(() => CleanUpSearch, [CleanUpSearch])

  const { sportOptions } = useSelectOptions()

  const [form] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState([])

  const throttleSearch = useCallback(
    throttle(() => {
      const { sport_id, league_id, league_name } = form.getFieldsValue()

      if (league_id?.toString().length > 2 || league_name?.length > 2) {
        setSelectedRows([])
        Search({ sport_id, league_id, league_name })
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
        league_name: '',
        league_id: null,
      }}
      onFinish={values => {
        Insert({ league_ids: values.league_ids?.toString() }, successCallback)
      }}
    >
      <Form.Item name="sport_id" label="Sport">
        <Select placeholder="Select Sport" showSearch className="w-100" options={sportOptions} />
      </Form.Item>
      <Form.Item name="league_id" label="League ID" extra="*Type to search League ID">
        <InputNumber placeholder="League ID" onChange={throttleSearch} className="w-100" />
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

export default connect(mapStateToProps, mapDispatchToProps)(AddLeagueDuplicateMatch)
