import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import {
  Row,
  Col,
  Input,
  Select,
  Form,
  Button,
  Space,
  Table,
  Drawer,
  Tooltip,
  Popconfirm,
} from 'antd'
import { debounce } from 'lodash'
import { validatorNumeric } from 'helper'
import React, { useCallback, useState } from 'react'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { connect } from 'react-redux'
import actions from 'redux/list-auto-oods/actions'
import Edit from './edit'

const mapStateToProps = ({ listAutoOdds }) => ({
  dataTable: listAutoOdds.data,
  loading: listAutoOdds.loadingData,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload =>
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'List Auto Odds',
    }),
  DeleteTable: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'List Auto Odds',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const ListAutoOdds = ({ dataTable, loading, LoadTable, DeleteTable, CleanUp }) => {
  const { sportOptions } = useSelectOptions()
  React.useEffect(() => CleanUp, [CleanUp])

  const [form] = Form.useForm()
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState([])

  const reload = useCallback(() => {
    form.submit()
  }, [form])

  const columns = [
    {
      title: 'Match ID',
      dataIndex: 'match_id',
      align: 'center',
      width: 75,
    },
    {
      title: 'League',
      dataIndex: 'league_name',
      width: 400,
    },
    {
      title: 'Home Team',
      dataIndex: 'home_name',
      width: 200,
    },
    {
      title: 'Away Team',
      dataIndex: 'away_name',
      width: 200,
    },
    {
      title: 'Match ID IBC',
      dataIndex: 'match_id_ibc',
      align: 'center',
      width: 120,
    },
    {
      title: 'League IBC',
      dataIndex: 'league_name_ibc',
      width: 300,
    },
    {
      title: 'Home Team IBC',
      dataIndex: 'home_name_ibc',
      width: 200,
    },
    {
      title: 'Away Team IBC',
      dataIndex: 'away_name_ibc',
      width: 200,
    },
    {
      title: 'Match Date IBC',
      dataIndex: 'match_date_ibc',
      align: 'center',
      render: text => text.formatDateTime(),
      width: 120,
    },
    {
      title: '',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: record => {
        return (
          <>
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setVisibleEdit(true)
                  setEditValue(record)
                }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure delete this?"
                onConfirm={() => {
                  DeleteTable(record, reload)
                }}
              >
                <Button type="link" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </>
        )
      },
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse justify-content-between">
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={form.submit} />
          </Tooltip>
          <Form
            form={form}
            className="w-100"
            initialValues={{ sport_id: 10 }}
            onValuesChange={debounce(reload, 500)}
            onFinish={values => {
              LoadTable(values)
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="sport_id">
                  <Select options={sportOptions} showSearch />
                </Form.Item>
                <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
                  <Input className="w-100" placeholder="Match ID" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="league_name_ibc">
                  <Input className="w-100" placeholder="League IBC" />
                </Form.Item>
                <Form.Item name="home_name_ibc">
                  <Input className="w-100" placeholder="Home Team IBC" />
                </Form.Item>
                <Form.Item name="away_name_ibc">
                  <Input className="w-100" placeholder="Away Team IBC" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body">
          <Table
            rowKey="match_id_ibc"
            columns={columns}
            loading={loading}
            dataSource={dataTable}
            pagination={{
              showSizeChanger: true,
              showTotal: total => `Total ${total} items`,
            }}
            scroll={{ x: '100%', y: true }}
          />
        </div>
      </div>
      <Drawer
        title="Edit List Auto Odds"
        width={720}
        open={visibleEdit}
        onClose={() => setVisibleEdit(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
            <Button form="edit-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Edit
          editValue={editValue}
          successCallback={() => {
            setVisibleEdit(false)
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ListAutoOdds)
