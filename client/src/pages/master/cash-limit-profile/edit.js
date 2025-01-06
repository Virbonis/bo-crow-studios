import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  Table,
  Form,
  Radio,
  Button,
  InputNumber,
  Descriptions,
  Select,
  Typography,
  Divider,
  message,
} from 'antd'
import actions from 'redux/cash-limit-profile/actions'
import { priceGroupName, priceGroupOptions } from 'helper'
import { Amount } from 'components/blaise'
import { PlusOutlined } from '@ant-design/icons'

const mapStateToProps = ({ cashLimitProfile }) => ({
  tableData: cashLimitProfile.dataEdit,
  leagueGroupRadioOptions:
    cashLimitProfile.dataEdit.league_group?.map(x => ({
      value: x,
      label: priceGroupName[x],
    })) || [],
  leagueGroupOptions: priceGroupOptions.filter(
    x => !cashLimitProfile.dataEdit.league_group?.includes(x.value),
  ),
  loadingData: cashLimitProfile.loadingEdit,
})

const mapDispatchToProps = dispatch => ({
  LoadDetail: payload => {
    dispatch({
      type: actions.LOAD_DETAIL,
      payload,
      source: 'Edit Cash Limit Profile',
    })
  },
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE_DETAIL,
      payload,
      successCallback,
      source: 'Edit Cash Limit Profile',
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_DETAIL,
      payload,
      successCallback,
      source: 'Edit Cash Limit Profile',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_DETAIL,
      payload,
      successCallback,
      source: 'Edit Cash Limit Profile',
    })
  },
})

const EditCashLimitProfile = ({
  editValue,
  tableData,
  loadingData,
  leagueGroupRadioOptions,
  leagueGroupOptions,
  LoadDetail,
  Update,
  Create,
  Delete,
}) => {
  const [formFilter] = Form.useForm()
  const [formAddLeague] = Form.useForm()
  const [formMain] = Form.useForm()
  const [formParlay] = Form.useForm()
  const [selectedMain, setSelectedMain] = useState([])
  const [selectedParlay, setSelectedParlay] = useState([])

  const reload = React.useCallback(() => {
    setSelectedMain([])
    setSelectedParlay([])
    LoadDetail({ ...editValue, ...formFilter.getFieldsValue() })
  }, [LoadDetail, editValue, formFilter])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    formAddLeague.resetFields()
    formParlay.resetFields()
    formMain.resetFields()
  }, [tableData, formFilter, formAddLeague, formParlay, formMain])

  const columnParlay = [
    {
      title: 'Sport',
      render: (_, { sport_name }, index) => (
        <Form.Item name={['parlay', index, 'sport_id']} noStyle>
          <Typography.Text>{sport_name}</Typography.Text>
        </Form.Item>
      ),
      width: 125,
    },
    {
      title: 'Min Bet',
      dataIndex: 'min_bet',
      render: (text, record, index) => {
        if (selectedParlay.includes(record.sport_id))
          return (
            <Form.Item
              name={['parlay', index, 'min_bet']}
              rules={[
                { required: true, message: 'Please input min bet' },
                {
                  validator: (_, value) => {
                    if (value <= 0) return Promise.reject(new Error('Value cannot be 0'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          )
        return <Amount value={text} int />
      },
      width: 200,
      align: 'right',
    },
    {
      title: 'Max Bet',
      dataIndex: 'max_bet',
      render: (text, record, index) => {
        if (selectedParlay.includes(record.sport_id))
          return (
            <Form.Item
              name={['parlay', index, 'max_bet']}
              rules={[
                { required: true, message: 'Please input max bet' },
                {
                  validator: (_, value) => {
                    if (value <= 0) return Promise.reject(new Error('Value cannot be 0'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          )
        return <Amount value={text} int />
      },
      width: 200,
      align: 'right',
    },
    {
      title: 'Max Payout',
      dataIndex: 'match_limit',
      render: (text, record, index) => {
        if (selectedParlay.includes(record.sport_id))
          return (
            <Form.Item
              name={['parlay', index, 'match_limit']}
              rules={[
                { required: true, message: 'Please input max payout' },
                {
                  validator: (_, value) => {
                    if (value <= 0) return Promise.reject(new Error('Value cannot be 0'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          )
        return <Amount value={text} int />
      },
      width: 200,
      align: 'right',
    },
    {},
  ]
  const columnMain = [
    {
      title: 'Sport',
      render: (_, { sport_name }, index) => (
        <Form.Item name={['main', index, 'sport_id']} noStyle>
          <Typography.Text>{sport_name}</Typography.Text>
        </Form.Item>
      ),
      width: 125,
    },
    {
      title: 'Min Bet',
      dataIndex: 'min_bet',
      render: (text, record, index) => {
        if (selectedMain.includes(record.sport_id))
          return (
            <Form.Item
              name={['main', index, 'min_bet']}
              rules={[
                { required: true, message: 'Please input min bet' },
                {
                  validator: (_, value) => {
                    if (value <= 0) return Promise.reject(new Error('Value cannot be 0'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          )
        return text === 0 ? 'Default' : <Amount value={text} int />
      },
      width: 200,
      align: 'right',
    },
    {
      title: 'Max Bet',
      dataIndex: 'max_bet',
      render: (text, record, index) => {
        if (selectedMain.includes(record.sport_id))
          return (
            <Form.Item
              name={['main', index, 'max_bet']}
              rules={[
                { required: true, message: 'Please input max bet' },
                {
                  validator: (_, value) => {
                    if (value <= 0) return Promise.reject(new Error('Value cannot be 0'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          )
        return text === 0 ? 'Default' : <Amount value={text} int />
      },
      width: 200,
      align: 'right',
    },
    {
      title: 'Match limit',
      dataIndex: 'match_limit',
      render: (text, record, index) => {
        if (selectedMain.includes(record.sport_id))
          return (
            <Form.Item
              name={['main', index, 'match_limit']}
              rules={[
                { required: true, message: 'Please input match limit' },
                {
                  validator: (_, value) => {
                    if (value <= 0) return Promise.reject(new Error('Value cannot be 0'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          )
        return text === 0 ? 'Default' : <Amount value={text} int />
      },
      width: 200,
      align: 'right',
    },
    {
      title: 'Action',
      render: record =>
        record.min_bet !== 0 &&
        record.max_bet !== 0 &&
        record.match_limit !== 0 &&
        record.sport_id !== '-99' && (
          <Button
            type="link"
            onClick={() =>
              Delete(
                {
                  ...editValue,
                  sport_id: record.sport_id,
                  league_group: formFilter.getFieldValue('league_group'),
                },
                reload,
              )
            }
          >
            Revert To Default
          </Button>
        ),
      align: 'right',
    },
  ]

  const submitForm = values => {
    if (selectedMain.length === 0 && selectedParlay.length === 0) {
      message.warning('Please select at least one sport')
      return
    }

    Update(
      {
        main: Object.values(values.main)
          .filter(x => selectedMain.includes(x.sport_id))
          .map(obj => ({
            ...obj,
            profile_id: editValue.profile_id,
            branch_code: editValue.branch_code,
            currency: editValue.currency,
            price_group: formFilter.getFieldValue('league_group'),
          })),
        parlay: Object.values(values.parlay)
          .filter(x => selectedParlay.includes(x.sport_id))
          .map(obj => ({
            ...obj,
            profile_id: editValue.profile_id,
            branch_code: editValue.branch_code,
            currency: editValue.currency,
            price_group: formFilter.getFieldValue('league_group'),
          })),
        jumlah_league: leagueGroupRadioOptions.length,
      },
      reload,
    )
  }

  return (
    <>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Profile ID">{editValue.profile_id}</Descriptions.Item>
        <Descriptions.Item label="Currency">{editValue.currency}</Descriptions.Item>
        <Descriptions.Item label="Branch">{editValue.branch_name}</Descriptions.Item>
        <Descriptions.Item label="League Group">
          <Form
            form={formFilter}
            size="small"
            onValuesChange={reload}
            initialValues={{ league_group: -99 }}
          >
            <Form.Item name="league_group">
              <Radio.Group options={leagueGroupRadioOptions} />
            </Form.Item>
          </Form>
          {leagueGroupOptions.length > 0 && (
            <Form
              form={formAddLeague}
              size="small"
              onFinish={values => Create({ ...editValue, ...values }, reload)}
              initialValues={{ league_group: leagueGroupOptions[0].value }}
            >
              <Form.Item name="league_group" noStyle>
                <Select style={{ width: '200px' }} options={leagueGroupOptions} />
              </Form.Item>
              <Button htmlType="submit" icon={<PlusOutlined />}>
                Add League Group
              </Button>
            </Form>
          )}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Form form={formParlay} initialValues={tableData} onFinish={submitForm}>
        <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
          Submit
        </Button>
        <Table
          size="small"
          columns={columnParlay}
          rowKey="sport_id"
          rowSelection={{
            selectedRowKeys: selectedParlay,
            onChange: selectedRowKeys => setSelectedParlay(selectedRowKeys),
          }}
          dataSource={tableData.parlay}
          pagination={false}
          loading={loadingData}
        />
        <Typography.Text className="text-danger">
          *Change Mix Parlay Setting will Force Logoff the member
        </Typography.Text>
        <Table
          size="small"
          rowKey="sport_id"
          columns={columnMain}
          pagination={false}
          loading={loadingData}
          dataSource={tableData.main}
          rowSelection={{
            selectedRowKeys: selectedMain,
            onChange: selectedRowKeys => setSelectedMain(selectedRowKeys),
          }}
        />
        <Typography.Text className="text-danger">
          *Min Bet, Max Bet, Match Limit / Max Payout values must higher than 0.
        </Typography.Text>
      </Form>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCashLimitProfile)
