import React, { useEffect, useState } from 'react'
import { Button, Space, Table, Select, Form, Drawer, Tooltip, Row, Col } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/sport/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { EditOutlined, ReloadOutlined } from '@ant-design/icons'
import Edit from './edit'

const mapStateToProps = ({ sport }) => ({
  tableData: sport.dataSorting,
  loadingData: sport.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_SORTING,
      payload,
      source: 'Master League Group',
    })
  },
  Copy: (payload, successCallback) => {
    dispatch({
      type: actions.COPY_SORTING,
      payload,
      successCallback,
      source: 'Master League Group Copy',
    })
  },
})

const MasterSportSorting = ({ Load, tableData, loadingData, Copy }) => {
  const [form] = Form.useForm()
  const [editValue, setEditValue] = useState('')
  const [visibleEdit, setVisibleEdit] = useState(false)

  const { currencyOptions } = useSelectOptions()

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])

  useEffect(() => {
    form.setFieldsValue({
      currency: currencyOptions[0]?.value,
    })
    reload()
  }, [form, currencyOptions[0]?.value]) // eslint-disable-line react-hooks/exhaustive-deps

  const columns = [
    {
      title: 'Sport ID',
      dataIndex: 'sport_id',
      width: 300,
    },
    {
      title: 'Sport Name',
      dataIndex: 'sport_name',
      width: 300,
    },
    {
      title: 'No Display',
      dataIndex: 'no_display',
      width: 300,
    },
    {
      title: 'Action',
      align: 'center',
      width: 80,
      render: record => (
        <Tooltip placement="top" title="Edit">
          <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
        </Tooltip>
      ),
    },
  ]

  const edit = record => {
    setEditValue({ ...record, currency: form.getFieldValue('currency') })
    setVisibleEdit(true)
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse">
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
            <Form
              form={form}
              className="w-100"
              layout="vertical"
              onValuesChange={reload}
              onFinish={values => {
                Load(values)
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="currency" className="mb-0">
                    <Select
                      placeholder="Select Currency"
                      showSearch
                      options={currencyOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
                <Button
                  onClick={() => {
                    Copy({ currency: form.getFieldValue('currency') }, reload)
                  }}
                >
                  Copy
                </Button>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.sport_id}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Edit Master Sport Sorting"
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
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterSportSorting)
