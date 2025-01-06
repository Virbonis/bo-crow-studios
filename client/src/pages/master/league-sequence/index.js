import React, { useEffect, useState } from 'react'
import { Button, Select, Row, Col, Table, Form, Checkbox, Tooltip, Drawer } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/league-sequence/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { CaretDownOutlined, CaretUpOutlined, ReloadOutlined } from '@ant-design/icons'
import Special from './special'

const mapStateToProps = ({ leagueSequence }) => ({
  tableData: leagueSequence.data,
  loadingData: leagueSequence.loadingData,
  specialData: leagueSequence.data_special,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Master League Sequence',
    })
  },
  LoadSpecial: payload => {
    dispatch({
      type: actions.LOAD_SPECIAL,
      payload,
      source: 'Master League Sequence',
    })
  },
  Swap: (payload, successCallback) => {
    dispatch({
      type: actions.SWAP,
      payload,
      successCallback,
      source: 'Master League Sequence',
    })
  },
  SwapSpecial: (payload, successCallback) => {
    dispatch({
      type: actions.SWAP_SPECIAL,
      payload,
      successCallback,
      source: 'Master League Sequence',
    })
  },
})

const LeagueSequence = ({ tableData, loadingData, Load, Swap, LoadSpecial }) => {
  const { sportOptions } = useSelectOptions()
  const [form] = Form.useForm()
  const [visible, setVisible] = useState()
  const [specialValue, setSpecialValue] = useState()

  useEffect(() => {
    form.setFieldsValue({
      sport_id: 10,
      match_time: 'Today',
      is_show_all: false,
    })
    form.submit()
  }, [form])

  const columns = [
    {
      title: 'League ID',
      dataIndex: 'parent_league_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'nama_events',
    },
    {
      title: form.getFieldValue('match_time') === 'Live' ? 'Seq Live' : 'Seq Non Live',
      dataIndex: 'no_display',
      align: 'center',
      width: 120,
    },
    {
      title: 'Swap',
      align: 'center',
      width: 80,
      render: (text, record, index) => (
        <Row>
          <Col span={12}>
            {index !== 0 && (
              <Button
                style={{
                  color: 'green',
                }}
                icon={<CaretUpOutlined />}
                type="text"
                onClick={() => {
                  const eventIndex =
                    tableData.findIndex(data => data.no_events === record.no_events) - 1
                  Swap(
                    {
                      match_time: form.getFieldValue('match_time'),
                      no_events_2: tableData[eventIndex].no_events,
                      no_events_1: record.no_events,
                    },
                    form.submit,
                  )
                }}
              />
            )}
          </Col>
          <Col span={12}>
            {index !== tableData.length - 1 && (
              <Button
                style={{ color: 'red' }}
                type="text"
                icon={<CaretDownOutlined />}
                onClick={() => {
                  const eventIndex =
                    tableData.findIndex(data => data.no_events === record.no_events) + 1
                  Swap(
                    {
                      match_time: form.getFieldValue('match_time'),
                      no_events_2: tableData[eventIndex].no_events,
                      no_events_1: record.no_events,
                    },
                    form.submit,
                  )
                }}
              />
            )}
          </Col>
        </Row>
      ),
    },
    {
      title: 'Special',
      dataIndex: 'is_show_special',
      width: 350,
      render: (text, record) =>
        text === 'Y' && (
          <Button
            type="link"
            onClick={() => {
              special(record)
            }}
          >
            Special
          </Button>
        ),
    },
  ]

  const special = record => {
    LoadSpecial({ ...record, match_time: form.getFieldValue('match_time') })
    setSpecialValue(record)
    setVisible(true)
  }

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
            onValuesChange={() => {
              form.submit()
            }}
            onFinish={values => {
              Load({ ...values, is_show_all: values.is_show_all ? 'Y' : 'N' })
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="sport_id">
                  <Select
                    placeholder="Select Sport"
                    showSearch
                    className="w-100"
                    options={sportOptions}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="match_time">
                  <Select
                    placeholder="Select Match Time"
                    showSearch
                    className="w-100"
                    options={[
                      { value: 'Today', label: 'Today' },
                      { value: 'Live', label: 'Live' },
                      { value: 'Early', label: 'Early' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="is_show_all" label="Show All" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.no_events}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title={specialValue?.nama_events}
        width={720}
        open={visible}
        onClose={() => setVisible(false)}
        destroyOnClose
      >
        <Special
          matchTime={form.getFieldValue('matchTime')}
          specialValue={specialValue}
          successCallback={() => {
            LoadSpecial({ ...specialValue, match_time: form.getFieldValue('match_time') })
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueSequence)
