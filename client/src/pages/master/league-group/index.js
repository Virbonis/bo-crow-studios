import React, { useEffect } from 'react'
import { Button, Table, Tooltip, Select, Input, Form, Row, Col, Popconfirm } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/league-group/actions'
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ leagueGroup }) => ({
  tableData: leagueGroup.data,
  loadingData: leagueGroup.loadingData,
  loadingList: leagueGroup.loadingList,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Master League Group',
    })
  },
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Master League Group',
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'Master League Group',
    })
  },
})

const MasterLeagueGroup = ({ Load, Create, Delete, tableData, loadingData }) => {
  const { sportOptions } = useSelectOptions()

  const [form] = Form.useForm()
  const [formCreate] = Form.useForm()

  const refresh = () => {
    form.submit()
  }

  useEffect(() => {
    form.setFieldsValue({
      sport_id: sportOptions[0]?.value,
      league_group: '',
    })
    refresh()
  }, [form, sportOptions[0]?.value]) // eslint-disable-line react-hooks/exhaustive-deps

  const columns = [
    {
      title: 'Sport ID',
      dataIndex: 'sport_id',
      width: 500,
    },
    {
      title: 'League Group',
      dataIndex: 'league_group',
      width: 500,
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      render: record => (
        <Tooltip placement="top" title="Delete">
          <Popconfirm
            title="Are you sure delete this?"
            onConfirm={() =>
              Delete(
                {
                  sport_id: record.sport_id,
                  league_group: record.league_group,
                },
                refresh,
              )
            }
          >
            <Button icon={<DeleteOutlined />} type="link" />
          </Popconfirm>
        </Tooltip>
      ),
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse">
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} form="form" htmlType="submit" />
          </Tooltip>
          <div className="w-100">
            <Form
              form={form}
              id="form"
              layout="vertical"
              onFinish={values => {
                Load(values)
              }}
              onValuesChange={refresh}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="sport_id" className="mb-0">
                    <Select
                      showSearch
                      placeholder="Select Sport"
                      options={sportOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Form
              form={formCreate}
              id="formCreate"
              layout="vertical"
              onFinish={values => {
                Create({ ...values, ...form.getFieldsValue() }, () => {
                  refresh()
                  formCreate.setFieldsValue({ league_group: '' })
                })
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="league_group"
                    rules={[{ required: true, message: 'Please input New League Group' }]}
                    className="mb-0"
                  >
                    <Input className="w-100" placeholder="New League Group" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Button form="formCreate" htmlType="submit" icon={<PlusOutlined />}>
                    Add
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.league_group}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterLeagueGroup)
