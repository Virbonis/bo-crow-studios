import React, { useState } from 'react'
import {
  Button,
  Row,
  Col,
  Table,
  Form,
  Input,
  Drawer,
  Space,
  Tooltip,
  Checkbox,
  Select,
  message,
} from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/cancel-match/actions'
import { ReloadOutlined } from '@ant-design/icons'
import { isEqual } from 'lodash'
import SpecialCancelMatch from './special'

const mapStateToProps = ({ cancelMatch }) => ({
  tableData: cancelMatch.data,
  loadingData: cancelMatch.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Cancel Match',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Cancel Match',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const CancelMatch = ({ tableData, totalResults, loadingData, Load, Update, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: 50,
  })
  const [visibleSpecial, setVisibleSpecial] = useState(false)
  const [specialValue, setSpecialValue] = useState()
  const [formTable] = Form.useForm()

  const columns = [
    {
      title: 'Match ID',
      dataIndex: 'match_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'Match Date',
      dataIndex: 'match_date',
      align: 'center',
      width: 150,
    },
    {
      title: 'League',
      dataIndex: 'league_name',
      width: 200,
    },
    {
      title: 'Home Away',
      width: 150,
      render: record => (
        <>
          {record.home_name}
          <br />
          {record.away_name}
        </>
      ),
    },
    {
      title: 'Match Status',
      dataIndex: 'match_score_status',
      align: 'center',
      width: 150,
      render: text => {
        if (text === 'Unscored') return <span className="text-orange">{text}</span>
        if (text === 'Half Time Scored') return <span className="text-black">{text}</span>
        if (
          text === '1st Half Cancelled' ||
          text === '2nd Half Cancelled' ||
          text === 'Match Cancelled'
        )
          return <span className="text-red">{text}</span>
        return text
      },
    },
    {
      title: 'Score',
      align: 'center',
      width: 80,
      render: ({ match_score_status, ht_home, ht_away, fs_home, fs_away }) => {
        if (match_score_status === 'Unscored' || match_score_status === 'Match Cancelled')
          return null
        if (
          match_score_status === 'Half Time Scored' ||
          match_score_status === '1st Half Cancelled' ||
          match_score_status === '2nd Half Cancelled'
        )
          return `${ht_home} - ${ht_away}`
        return (
          <>
            {`${ht_home} - ${ht_away}`}
            <br />
            {`${fs_home} - ${fs_away}`}
          </>
        )
      },
    },
    {
      title: 'Cancel',
      align: 'center',
      width: 200,
      render: record => {
        return (
          <Row>
            <Col span={20}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues[record.match_id]?.edited !== currentValues[record.match_id]?.edited
                }
              >
                {({ getFieldValue }) => {
                  const edited = getFieldValue([record.match_id, 'edited'])
                  const { match_score_status, ht_process_status } = record
                  let cancelTypeOptions
                  switch (match_score_status) {
                    case 'Match Cancelled':
                      cancelTypeOptions = [{ value: 81, label: 'Uncancel Match' }]
                      break
                    case '1st Half Cancelled':
                      cancelTypeOptions = [{ value: 87, label: 'Uncancel 1st Half' }]
                      break
                    case '2nd Half Cancelled':
                      cancelTypeOptions = [{ value: 83, label: 'Uncancel 2nd Half' }]
                      break
                    case 'Half Time Scored':
                    case 'Full Time Scored':
                      if (ht_process_status === 'Y')
                        cancelTypeOptions = [{ value: 82, label: 'Cancel 2nd Half' }]
                      else
                        cancelTypeOptions = [
                          { value: 80, label: 'Cancel Match' },
                          { value: 82, label: 'Cancel 2nd Half' },
                        ]
                      break
                    default:
                      cancelTypeOptions = [
                        { value: 80, label: 'Cancel Match' },
                        { value: 85, label: 'Cancel 1st Half' },
                      ]
                      break
                  }
                  return (
                    edited && (
                      <FormCancel
                        form={formTable}
                        match_id={record.match_id}
                        cancelTypeOptions={cancelTypeOptions}
                        initialValue={cancelTypeOptions[0].value}
                      />
                    )
                  )
                }}
              </Form.Item>
            </Col>
            <Col span={3} offset={1}>
              <Form.Item name={[record.match_id, 'edited']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </Col>
          </Row>
        )
      },
    },
    {
      title: 'Detail',
      align: 'center',
      width: 80,
      render: record => {
        return (
          <>
            {record.special_score_status === 'Y' && (
              <Button
                type="link"
                onClick={() => {
                  special(record)
                }}
              >
                Special
              </Button>
            )}
          </>
        )
      },
    },
  ]

  const special = record => {
    setSpecialValue(record)
    setVisibleSpecial(true)
  }

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])

  React.useEffect(() => {
    formTable.resetFields()
  }, [formTable, tableData])

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center d-flex flex-row-reverse">
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={reload} />
          </Tooltip>
          <Form
            form={form}
            className="w-100"
            onFinish={values => {
              Load({ ...pagination, ...values })
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="match_ids" extra="*Use comma to select multiple MatchID">
                  <Input className="w-100" placeholder="Match IDs" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body">
          <Form
            form={formTable}
            onFinish={values => {
              const payload = Object.entries(values)
                .map(([match_id, value]) => ({
                  match_id: Number(match_id),
                  ...value,
                }))
                .filter(item => item.edited)

              if (payload.length === 0) {
                message.warning('Please select at least one match')
                return
              }
              Update(payload, reload)
            }}
          >
            <Table
              rowKey={record => record.match_id}
              size="small"
              loading={loadingData}
              dataSource={tableData}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                total: totalResults,
                showTotal: total => `Total ${total} items`,
                current: pagination.current_page,
                pageSize: pagination.page_size,
                onChange: (current_page, page_size) => {
                  setPagination({ current_page, page_size })
                  reload()
                },
              }}
              title={() => {
                return (
                  <Form.Item
                    shouldUpdate={(prevValues, currentValues) =>
                      !isEqual(prevValues, currentValues)
                    }
                  >
                    {({ getFieldsValue }) => {
                      const anyChecked = Object.values(getFieldsValue()).some(val => val.edited)
                      return (
                        <div className="d-flex justify-content-end">
                          <Button type="primary" htmlType="submit" disabled={!anyChecked}>
                            Submit
                          </Button>
                        </div>
                      )
                    }}
                  </Form.Item>
                )
              }}
            />
          </Form>
        </div>
        <div className="card-footer">
          <b>
            Notes:
            <br />
            1. Cancel Match page list matches that allow to cancelled on SELECTED DATE
            <br />
            2. To Cancel 2nd half, please input the Half Time Score first
          </b>
        </div>
      </div>
      <Drawer
        title="Cancel Match - Special"
        width={900}
        open={visibleSpecial}
        onClose={() => setVisibleSpecial(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleSpecial(false)}>Cancel</Button>
            <Button form="special-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <SpecialCancelMatch
          specialValue={specialValue}
          successCallback={React.useCallback(() => {
            reload()
            setVisibleSpecial(false)
          }, [reload])}
        />
      </Drawer>
    </>
  )
}

const FormCancel = ({ form, match_id, cancelTypeOptions, initialValue }) => {
  React.useEffect(() => {
    form.setFieldsValue({
      [match_id]: {
        edited: true,
        void_id: initialValue,
      },
    })
  }, [form, match_id, initialValue])

  return (
    <Row className="w-100">
      <Form.Item name={[match_id, 'void_id']} className="w-100">
        <Select className="w-100" options={cancelTypeOptions} placeholder="Cancel Type" />
      </Form.Item>
      <Form.Item name={[match_id, 'void_reason']} className="w-100">
        <Input className="w-100" placeholder="Reason" />
      </Form.Item>
    </Row>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CancelMatch)
