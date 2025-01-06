import React, { useState } from 'react'
import { Row, Col, Table, Form, DatePicker, Input, Button, Drawer, Space } from 'antd'
import { connect } from 'react-redux'
import { Amount, useGetDateTimeDBServer } from 'components/blaise'
import actions from 'redux/member-duplicate-ip/actions'
import VIPLog from '../../customer/customer-list/vip-log'

const mapStateToProps = ({ memberDuplicateIP }) => ({
  tableData: memberDuplicateIP.data.result || [],
  loading: memberDuplicateIP.loadingData,
  totalResults: memberDuplicateIP.data.total,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Member Duplicate IP',
    })
  },
})

const { RangePicker } = DatePicker

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()

  if (!defaultDateTimeServer) return null
  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const MemberDuplicateIP = wrapperDate(
  ({ defaultDateTimeServer, tableData, loading, totalResults, Load }) => {
    const [form] = Form.useForm()
    const [visibleVIPLog, setVisibleVIPLog] = React.useState(false)
    const [customerData, setCustomerData] = React.useState([])
    const [pagination, setPagination] = useState({
      current_page: 1,
      page_size: 50,
    })

    const reload = () => form.submit()
    const submitHandler = () => setPagination(prev => ({ ...prev, current_page: 1 }))

    const [getRowSpan, getRowNumber] = React.useMemo(() => {
      const isFirstRow = (ip_address, index) => {
        const firstIndex = tableData.findIndex(x => x.ip_address === ip_address)
        if (firstIndex === -1) return false
        if (index === firstIndex) return true
        const prev = tableData[index - 1]
        return prev.ip_address !== ip_address
      }
      const rowCount = ip_address => tableData.filter(x => x.ip_address === ip_address).length

      const uniqData = tableData.reduce((acc, cur) => {
        const index = acc.findIndex(x => x.ip_address === cur.ip_address)
        if (index === -1) acc.push(cur)
        return acc
      }, [])

      return [
        (ip_address, match_id) => {
          if (!isFirstRow(ip_address, match_id)) return 0
          return rowCount(ip_address)
        },
        ip_address => uniqData.findIndex(x => x.ip_address === ip_address) + 1,
      ]
    }, [tableData])

    const vipLogHandler = record => {
      setVisibleVIPLog(true)
      setCustomerData(record)
    }

    const columns = [
      {
        title: 'No',
        align: 'center',
        width: 30,
        render: (text, record) => getRowNumber(record.ip_address),
        onCell: ({ ip_address }, index) => ({
          rowSpan: getRowSpan(ip_address, index),
        }),
      },
      {
        title: 'IP',
        align: 'center',
        dataIndex: 'ip_address',
        width: 300,
        onCell: ({ ip_address }, index) => ({
          rowSpan: getRowSpan(ip_address, index),
        }),
      },
      {
        title: 'Username',
        dataIndex: 'user_id',
        width: 400,
      },
      {
        title: 'Login Count',
        dataIndex: 'login_count',
        align: 'right',
        width: 100,
        render: text => <Amount value={text} int />,
      },
      {
        title: 'Bets Count',
        dataIndex: 'bet_count',
        align: 'right',
        width: 100,
        render: text => <Amount value={text} int />,
      },
      {
        title: '',
        width: 50,
        render: record => {
          return (
            <Button
              type="link"
              onClick={() => vipLogHandler({ ...record, username: record.user_id })}
            >
              VIP Log
            </Button>
          )
        },
      },
    ]

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Form
                form={form}
                className="w-100"
                initialValues={{ date_range: [defaultDateTimeServer, defaultDateTimeServer] }}
                onFinish={values => {
                  Load({
                    ...values,
                    login_date_from: values.date_range[0].format('YYYY-MM-DD'),
                    login_date_to: values.date_range[1].format('YYYY-MM-DD'),
                    ...pagination,
                  })
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="date_range" className="mb-0">
                      <RangePicker format="YYYY-MM-DD" className="w-100" allowClear={false} />
                    </Form.Item>
                    <Form.Item name="ip_address">
                      <Input placeholder="IP" className="w-100" />
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="primary" htmlType="submit" onClick={submitHandler}>
                  Submit
                </Button>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Table
              rowKey="index_number"
              bordered
              className="h-100"
              size="small"
              loading={loading}
              columns={columns}
              dataSource={tableData}
              summary={data => {
                if (!data.length) return null

                let totalUser = 0
                let totalLoginCount = 0
                let totalBetCount = 0
                data.forEach(({ login_count, bet_count }) => {
                  totalUser += 1
                  totalLoginCount += login_count
                  totalBetCount += bet_count
                })
                return (
                  <>
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={2}>
                          Total
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="center">
                          <Amount value={totalUser} int />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount value={totalLoginCount} int />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount value={totalBetCount} int />
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  </>
                )
              }}
              pagination={{
                current: pagination.current_page,
                pageSize: pagination.page_size,
                showSizeChanger: true,
                total: totalResults,
                showTotal: total => `Total ${total} items`,
                onChange: (current, size) => {
                  setPagination({ ...pagination, current_page: current, page_size: size })
                  reload()
                },
              }}
            />
          </div>
        </div>
        <Drawer
          title="Customer VIP Log"
          width={600}
          open={visibleVIPLog}
          onClose={() => setVisibleVIPLog(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleVIPLog(false)}>Close</Button>
            </Space>
          }
        >
          <VIPLog
            editValue={customerData}
            successCallback={() => {
              reload()
            }}
          />
        </Drawer>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(MemberDuplicateIP)
