import { ReloadOutlined } from '@ant-design/icons'
import { Button, Form, Table, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/failed-payout/actions'

const mapStateToProps = ({ failedPayout }) => ({
  dataTable: failedPayout.data,
  loading: failedPayout.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Failed Payout',
    })
  },
  Reset: (payload, successCallback) => {
    dispatch({
      type: actions.RESET,
      payload,
      successCallback,
      source: 'Failed Payout',
    })
  },
})

const FailedPayout = ({ loading, dataTable, Load, Reset }) => {
  useEffect(() => {
    Load()
  }, [Load])

  const [form] = Form.useForm()

  const reload = () => {
    form.submit()
  }

  const columns = [
    {
      title: 'Action',
      align: 'center',
      width: 80,
      render: (text, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              Reset(record, reload)
            }}
          >
            Reset
          </Button>
        )
      },
    },
    {
      title: 'Process ID',
      dataIndex: 'process_id',
      width: 300,
    },
    {
      title: 'Total Ticket',
      dataIndex: 'total_ticket',
      align: 'center',
      width: 100,
    },
    {
      title: 'Match ID',
      dataIndex: 'match_id',
      width: 200,
      render: text => text.split(',').join(', '),
    },
    {
      title: 'Last Error',
      dataIndex: 'last_error',
      width: 500,
    },
    {
      title: 'Last Error Date',
      dataIndex: 'last_error_date',
      align: 'center',
      width: 150,
      render: text => text.formatDateTimeSecond(),
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse justify-content-between">
          <Tooltip>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                reload()
              }}
            />
          </Tooltip>
        </div>
        <div className="card-body">
          <Form
            form={form}
            className="w-100"
            onFinish={() => {
              Load()
            }}
          >
            <Table
              rowKey={record => {
                return `${record.process_id}-${record.last_error_date}`
              }}
              columns={columns}
              dataSource={dataTable}
              loading={loading}
              pagination={false}
            />
          </Form>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FailedPayout)
