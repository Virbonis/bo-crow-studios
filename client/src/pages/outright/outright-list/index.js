import React, { useState } from 'react'
import {
  Col,
  DatePicker,
  Form,
  Row,
  Input,
  Select,
  Table,
  Space,
  Button,
  Tooltip,
  Drawer,
  Modal,
  Typography,
  Popconfirm,
} from 'antd'
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { validatorNumeric } from 'helper'
import authEnum from 'authorize'
import actions from 'redux/outright/actions'
import { useGetDateTimeBusinessHour, useFormWithPagination } from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import Info from './info'
import Edit from './edit'
import List from './list'

const { Text } = Typography
const mapStateToProps = ({ auth, outright }) => ({
  loading: outright.loadingData,
  dataTable: outright.data.result,
  totalResult: outright.data.total,
  cantEditOutright: auth.user.user_auth_ids.includes(authEnum.DISALLOW_EDIT_OUTRIGHT),
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_OUTRIGHT,
      payload,
      source: 'Outright List',
    })
  },
  LoadOutrightTeam: payload => {
    dispatch({
      type: actions.LOAD_OUTRIGHT_TEAM,
      payload,
      source: 'Outright List',
    })
  },
  CleanOutrightTeam: payload => {
    dispatch({
      type: actions.CLEAN_UP_LIST,
      payload,
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_OUTRIGHT,
      successCallback,
      payload,
      source: 'Outright List',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const outrightStatusOptions = [
  { value: '', label: 'All Outright Status' },
  { value: 'Unscored', label: 'Unscored' },
  { value: 'Scored', label: 'Scored' },
  { value: 'Cancelled', label: 'Cancelled' },
]
const outrightOpenStatusOptions = [
  { value: '', label: 'All Open Status' },
  { value: 'Y', label: 'Open' },
  { value: 'N', label: 'Close' },
]
const outrightDeadHeatStatusOptions = [
  { value: '', label: 'All Dead Heat Status' },
  { value: 'Y', label: 'Yes' },
  { value: 'N', label: 'No' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const OutrightList = wrapperDate(
  ({
    loading,
    dataTable,
    totalResult,
    defaultDateTime,
    Load,
    Delete,
    // dataTeam,
    LoadOutrightTeam,
    CleanOutrightTeam,
    cantEditOutright,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()
    const [editValue, setEditValue] = useState()
    const [visibleInfo, setVisibleInfo] = useState(false)
    const [visibleEdit, setVisibleEdit] = useState(false)

    const { sportOptions } = useSelectOptions()

    const [expanded, setExpanded] = useState([])

    const fetch = React.useCallback(
      values => {
        setExpanded([])
        Load({
          ...values,
          from_date: values.dateRange?.[0].format('YYYY-MM-DD'),
          to_date: values.dateRange?.[1].format('YYYY-MM-DD'),
        })
      },
      [Load],
    )
    const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResult)
    const reload = React.useCallback(() => form.submit(), [form])
    React.useEffect(() => reload(), [reload])

    const columns = React.useMemo(() => {
      const editHandler = record => {
        setVisibleEdit(true)
        setEditValue(record)
      }
      const listHandler = record => {
        if (expanded.includes(record.outright_id)) {
          setExpanded(old => old.filter(data => data !== record.outright_id))
          CleanOutrightTeam({ outright_id: record.outright_id })
        } else {
          setExpanded(old => old.concat(record.outright_id))
          LoadOutrightTeam({ outright_id: record.outright_id })
        }
      }
      const infoHandler = record => {
        setVisibleInfo(true)
        setEditValue(record)
      }

      const deleteHandler = record => {
        Modal.confirm({
          title: `Confirm DELETE Outright ${record.outright_id}?`,
          okText: 'Yes',
          cancelText: 'No',
          maskClosable: true,
          onOk: () => {
            Delete({ outright_id: record.outright_id }, reload)
          },
        })
      }

      return [
        {
          title: 'Outright ID',
          dataIndex: 'outright_id',
          align: 'center',
          width: 100,
        },
        {
          title: 'Outright Date',
          width: 120,
          align: 'center',
          dataIndex: 'outright_date',
          render: text => text.formatDateTime(),
        },
        {
          title: 'League',
          width: 250,
          dataIndex: 'league_name',
          render: text => <Text className="text-wrap">{text}</Text>,
        },
        {
          title: 'Outright Status',
          align: 'center',
          width: 120,
          dataIndex: 'outright_score_status',
          render: text => (
            <>
              {text === 'Scored' && <Text>Scored</Text>}
              {text === 'Unscored' && <Text className="text-warning">Unscored</Text>}
              {text === 'Cancelled' && <Text className="text-danger">Cancelled</Text>}
            </>
          ),
        },
        {
          title: 'Open',
          width: 80,
          align: 'center',
          dataIndex: 'outright_open_status',
          render: text =>
            text === 'Y' ? <Text>Open</Text> : <Text className="text-danger">Close</Text>,
        },
        {
          title: 'Dead Heat',
          align: 'center',
          width: 90,
          dataIndex: 'outright_dead_heat_status',
          render: text => (text === 'Y' ? <Text>Yes</Text> : <Text>No</Text>),
        },
        {
          title: 'Score',
          dataIndex: 'outright_score',
          width: 250,
          render: text => <Text className="text-wrap">{text}</Text>,
        },
        {
          title: 'Process',
          width: 90,
          align: 'center',
          dataIndex: 'outright_process_status',
          render: text => {
            if (text === 'Y') return <Text className="text-success">Processed</Text>
            if (text === '0') return <Text className="text-danger">Queue</Text>
            return null
          },
        },
        {
          title: 'Action',
          align: 'center',
          width: 100,
          render: record => (
            <>
              {record.outright_process_status === 'N' && (
                <Tooltip title="Edit">
                  <Button type="link" icon={<EditOutlined />} onClick={() => editHandler(record)} />
                </Tooltip>
              )}
              <Tooltip title="List">
                <Button type="link" onClick={() => listHandler(record)}>
                  List
                </Button>
              </Tooltip>
              <Tooltip title="Info">
                <Button type="link" onClick={() => infoHandler(record)}>
                  Info
                </Button>
              </Tooltip>
              {record.is_outright_has_ticket === 'N' && record.outright_process_status === 'N' && (
                <Tooltip title="Delete">
                  <Popconfirm
                    title="Are you sure delete this?"
                    onConfirm={() => deleteHandler(record, reload)}
                  >
                    <Button type="link" icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Tooltip>
              )}
            </>
          ),
        },
      ]
    }, [reload, expanded, LoadOutrightTeam, CleanOutrightTeam, Delete])
    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  dateRange: [defaultDateTime, defaultDateTime],
                  sport_id: 10,
                  outright_open_status: '',
                  outright_dead_heat_status: '',
                  outright_score_status: '',
                }}
                {...formProps}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="dateRange" className="mb-0">
                      <DatePicker.RangePicker
                        className="w-100"
                        allowClear={false}
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                    <Form.Item name="sport_id" className="mb-0">
                      <Select
                        placeholder="Select Sport"
                        showSearch
                        options={sportOptions}
                        optionFilterProp="label"
                      />
                    </Form.Item>
                    <Form.Item
                      name="outright_id"
                      className="mb-0"
                      rules={[{ validator: validatorNumeric }]}
                    >
                      <Input placeholder="Ouright ID" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="outright_score_status" className="mb-0">
                      <Select options={outrightStatusOptions} />
                    </Form.Item>
                    <Form.Item name="outright_open_status" className="mb-0">
                      <Select options={outrightOpenStatusOptions} />
                    </Form.Item>
                    <Form.Item name="outright_dead_heat_status" className="mb-0">
                      <Select options={outrightDeadHeatStatusOptions} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Table
              rowKey="outright_id"
              size="small"
              bordered
              loading={loading}
              dataSource={dataTable}
              columns={columns}
              expandable={{
                expandedRowRender: record => <List outright_id={record.outright_id} />,
                showExpandColumn: false,
                expandedRowKeys: expanded,
                // expandRowByClick: true,
              }}
              pagination={paginationProps}
            />
          </div>
        </div>
        <Drawer
          title="Outright Information" // same as match info
          width="60%"
          open={visibleInfo}
          onClose={() => setVisibleInfo(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleInfo(false)}>Cancel</Button>
              <Button form="info-form" type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          }
        >
          <Info
            editValue={editValue}
            successCallback={React.useCallback(() => {
              setVisibleInfo(false)
              reload()
            }, [reload])}
          />
        </Drawer>
        <Drawer
          title="Edit Outright"
          width="70%"
          open={visibleEdit}
          onClose={() => setVisibleEdit(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
              <Button form="edit-form" type="primary" htmlType="submit" disabled={cantEditOutright}>
                Submit
              </Button>
            </Space>
          }
        >
          <Edit
            editValue={editValue}
            successCallback={React.useCallback(() => {
              setVisibleEdit(false)
              reload()
            }, [reload])}
          />
        </Drawer>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(OutrightList)
