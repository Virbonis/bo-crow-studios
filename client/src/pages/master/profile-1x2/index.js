import React, { useEffect, useState } from 'react'
import { Button, Space, Input, Select, Col, Table, Drawer, Form, Tooltip, Row } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/profile-1x2/actions'
import { EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { gameType1x2Options, gameTypeDescription } from 'helper'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import Edit from './edit'

const mapStateToProps = ({ profile1x2 }) => ({
  loadingList: profile1x2.loadingList,
  tableData: profile1x2.data,
  loadingData: profile1x2.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Master Profile1X2',
    })
  },
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Master Profile1X2',
    })
  },
})

const ProfileMaster1x2 = ({ Load, tableData, loadingData, Create }) => {
  const [form] = Form.useForm()
  const [formCreate] = Form.useForm()
  const [editValue, setEditValue] = useState('')
  const [visibleEdit, setVisibleEdit] = useState(false)

  const { profile1x2Options, profile1x2hdpOptions: hdpOptions } = useSelectOptions()

  const refresh = () => {
    form.submit()
  }

  useEffect(() => {
    form.setFieldsValue({
      profile_id: profile1x2Options[0]?.value || '',
      game_type: gameType1x2Options[0].value,
      hdp: hdpOptions[0]?.value || '0.0000',
    })
    refresh()
  }, [form, profile1x2Options[0]?.value, hdpOptions[0]?.value]) //eslint-disable-line

  const columns = [
    {
      title: 'Profile ID',
      dataIndex: 'limit_id_1x2',
      align: 'center',
      width: 110,
    },
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      align: 'center',
      width: 100,
      render: text => {
        return gameTypeDescription[text]?.long
      },
    },
    {
      title: 'HDP',
      dataIndex: 'hdp',
      align: 'center',
      width: 80,
    },
    {
      title: 'Odds HDP',
      dataIndex: 'odds_hdp',
      align: 'right',
      width: 90,
    },
    {
      title: 'Odds Fav',
      dataIndex: 'odds_fav',
      align: 'right',
      width: 90,
    },
    {
      title: 'Odds Draw',
      dataIndex: 'odds_draw',
      align: 'right',
      width: 90,
    },
    {
      title: 'Odds5',
      dataIndex: 'odds_5',
      align: 'right',
      width: 70,
    },
    {
      title: 'Odds6',
      dataIndex: 'odds_6',
      align: 'right',
      width: 70,
    },
    {
      title: 'Odds7',
      dataIndex: 'odds_7',
      align: 'right',
      width: 70,
    },
    {
      title: 'Odds8',
      dataIndex: 'odds_8',
      align: 'right',
      width: 70,
    },

    {
      title: 'Odds9',
      dataIndex: 'odds_9',
      align: 'right',
      width: 70,
    },
    {
      title: 'Odds10',
      dataIndex: 'odds_10',
      align: 'right',
      width: 70,
    },
    {
      title: 'Odds12',
      dataIndex: 'odds_12',
      align: 'right',
      width: 70,
    },
    {
      title: 'Odds15',
      dataIndex: 'odds_15',
      align: 'right',
      width: 70,
    },
    {
      title: 'Odds18',
      dataIndex: 'odds_18',
      align: 'right',
      width: 70,
    },
    {
      title: 'Odds20',
      dataIndex: 'odds_20',
      align: 'right',
      width: 70,
    },
    {
      title: 'Odds24',
      dataIndex: 'odds_24',
      align: 'right',
      width: 70,
    },
    {
      title: 'Action',
      align: 'center',
      width: 80,
      render: record => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} type="link" onClick={() => edit(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const edit = record => {
    setEditValue(record)
    setVisibleEdit(true)
  }

  return (
    <>
      <div className="card">
        <div className="card-header ">
          <Form
            form={formCreate}
            id="create-form"
            layout="inline"
            className="mb-2"
            onFinish={values => {
              Create({ profile_id: values.new_profile }, () => {
                formCreate.setFieldsValue({ new_profile: '' })
              })
            }}
          >
            <Form.Item name="new_profile" rules={[{ required: true }]}>
              <Input placeholder="New Profile 1X2" />
            </Form.Item>
            <Button form="create-form" htmlType="submit" icon={<PlusOutlined />}>
              Add Profile
            </Button>
          </Form>
          <Form
            form={form}
            id="profile-form"
            onValuesChange={() => {
              // setParameters(values)
              // form.setFieldsValue(values)
              refresh()
            }}
            onFinish={values => {
              Load(values)
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 8 }}>
              <Space>
                <Tooltip placement="top" title="Refresh list">
                  <Button onClick={() => refresh()} icon={<ReloadOutlined />} />
                </Tooltip>
              </Space>
              <Row gutter={8} className="w-100">
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="profile_id">
                    <Select
                      placeholder="Select Profile"
                      className="w-100"
                      showSearch
                      options={profile1x2Options}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="game_type">
                    <Select
                      placeholder="Select Game Type"
                      showSearch
                      className="w-100"
                      options={gameType1x2Options}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="hdp">
                    <Select
                      placeholder="Select HDP"
                      showSearch
                      options={hdpOptions}
                      className="w-100"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.row_id}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Edit Event Limit"
        width={420}
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
            refresh()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMaster1x2)
