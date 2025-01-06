import React, { useState } from 'react'
import { Col, Table, Form, Button, Select, Checkbox, Drawer, Row } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/member-pending-funds/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { Amount, useGetDateTimeBusinessHour } from 'components/blaise'
import Detail from './detail'

const mapStateToProps = ({ memberPendingFunds }) => ({
  loading: memberPendingFunds.loadingData,
  tableData: memberPendingFunds.data.result,
  totalResults: memberPendingFunds.data.total,
  summary: memberPendingFunds.data.summary,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Member Pending Funds',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()

  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const MemberPendingFunds = wrapperDate(
  ({ defaultDateTime, loading, tableData, totalResults, summary, Load, CleanUp }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()
    const [visibleDetail, setVisibleDetail] = useState(false)
    const [detailValue, setDetailValue] = useState()
    const [pagination, setPagination] = useState({
      current_page: 1,
      page_size: 50,
    })

    let { currencyOptions, branchOptions } = useSelectOptions()
    currencyOptions = [{ value: 'ALL', label: 'Show All Currency' }].concat(currencyOptions)
    branchOptions = [{ value: 'ALL', label: 'Show All Branch' }].concat(branchOptions)

    const columns = [
      {
        title: 'No',
        render: (text, record, index) => index + 1,
        align: 'center',
        width: 30,
      },
      {
        title: 'Username',
        dataIndex: 'member_id',
        width: 600,
        render: text => (
          <Button type="link" className="p-0" onClick={() => detailHandler(text)}>
            {text}
          </Button>
        ),
      },
      {
        title: 'Bets Count',
        dataIndex: 'total_transaction',
        align: 'right',
        width: 120,
        render: text => <Amount value={text} int />,
      },
      {
        title: 'Pending Funds',
        dataIndex: 'total_pending',
        align: 'right',
        width: 120,
        render: text => <Amount value={text} />,
      },
    ]

    const submitHandler = () => setPagination(prev => ({ ...prev, current_page: 1 }))
    const reload = () => form.submit()

    const detailHandler = username => {
      setDetailValue(prev => ({ ...prev, username }))
      setVisibleDetail(true)
    }

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  branch: 'ALL',
                  currency: 'ALL',
                  base_curr: true,
                }}
                onFinish={values => {
                  const payload = {
                    ...values,
                    base_curr: values.base_curr ? 'Y' : 'N',
                  }
                  setDetailValue(payload)
                  Load({
                    ...payload,
                    ...pagination,
                  })
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="branch">
                      <Select showSearch optionFilterProp="label" options={branchOptions} />
                    </Form.Item>
                    <Form.Item name="currency">
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={currencyOptions}
                        onChange={() => form.setFieldsValue({ base_curr: false })}
                      />
                    </Form.Item>
                    {/* <Form.Item name="base_curr" valuePropName="checked">
                    <Checkbox disabled={!form.isFieldTouched('currency')} defaultChecked="true">
                      Convert to RMB
                    </Checkbox>
                  </Form.Item> */}
                    <Form.Item
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.currency !== currentValues.currency
                      }
                    >
                      {({ isFieldTouched }) => {
                        const disableBaseCurr = !isFieldTouched('currency')
                        return (
                          <Form.Item name="base_curr" valuePropName="checked">
                            <Checkbox disabled={disableBaseCurr}>Convert to RMB</Checkbox>
                          </Form.Item>
                        )
                      }}
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
              rowKey="member_id"
              bordered
              size="small"
              loading={loading}
              columns={columns}
              dataSource={tableData}
              pagination={{
                showTotal: total => `Total ${total} items`,
                total: totalResults,
                current: pagination.current_page,
                pageSize: pagination.page_size,
                onShowSizeChange: (current, size) => {
                  setPagination({ ...pagination, current_page: current, page_size: size })
                },
                onChange: (current, size) => {
                  setPagination({ ...pagination, current_page: current, page_size: size })
                  reload()
                },
              }}
              summary={data =>
                data.length > 0 && (
                  <Table.Summary fixed="bottom">
                    <Table.Summary.Row align="right" className="font-weight-bold bg-light-yellow">
                      <Table.Summary.Cell index={0} colSpan={2} align="center">
                        Total
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Amount value={summary.total_transaction} int />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Amount value={summary.total_pending} />
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )
              }
            />
          </div>
        </div>
        <Drawer
          title="Member Pending Funds Detail"
          width="60%"
          open={visibleDetail}
          onClose={() => setVisibleDetail(false)}
          destroyOnClose
        >
          <Detail detailValue={detailValue} dateTimeBusinessHour={defaultDateTime} />
        </Drawer>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(MemberPendingFunds)
