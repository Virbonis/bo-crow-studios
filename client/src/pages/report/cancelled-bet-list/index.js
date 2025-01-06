import React, { useEffect } from 'react'
import { Col, Table, Form, Button, Select, Spin, Space } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/cancelled-bet-list/actions'
import { Amount, BetSlip } from 'components/blaise'
import { FileExcelOutlined, ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ cancelledBetList }) => ({
  loadingOption: cancelledBetList.loadingOption,
  userOptions: cancelledBetList.user.map(data => ({
    value: data.username,
    label: data.username,
  })),
  loading: cancelledBetList.loadingData,
  tableData: cancelledBetList.data.map((data, index) => ({ ...data, key: index + 1 })),
  loadingExport: cancelledBetList.loadingExport,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Cancelled Bet List',
    })
  },
  LoadUser: payload => {
    dispatch({
      type: actions.LOAD_USER,
      payload,
      source: 'Cancelled Bet List',
    })
  },
  LoadExportData: payload => {
    dispatch({
      type: actions.EXPORT,
      payload,
      source: 'Cancelled Bet List',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const CancelledBetList = ({
  loadingOption,
  userOptions,
  loading,
  loadingExport,
  tableData,
  LoadUser,
  Load,
  LoadExportData,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  let { currencyOptions, branchOptions } = useSelectOptions()
  branchOptions = [{ value: 'ALL', label: 'Show All Branch' }].concat(branchOptions)
  currencyOptions = [{ value: 'ALL', label: 'Show All Currency' }].concat(currencyOptions)

  const [form] = Form.useForm()
  const reloadUser = React.useCallback(
    isResetForm => {
      LoadUser(form.getFieldsValue())
      if (isResetForm) form.setFieldsValue({ username: null })
    },
    [form, LoadUser],
  )
  useEffect(() => {
    reloadUser()
  }, [reloadUser])

  const exportHandler = () => {
    form.validateFields().then(values => LoadExportData(values))
  }

  const [getRowSpan, getRowNumber] = React.useMemo(() => {
    const isFirstRow = (bet_id, index) => {
      const firstIndex = tableData.findIndex(x => x.bet_id === bet_id)
      if (firstIndex === -1) return false
      if (index === firstIndex) return true
      const prev = tableData[index - 1]
      return prev.bet_id !== bet_id
    }
    const rowCount = bet_id => tableData.filter(x => x.bet_id === bet_id).length

    const uniqData = tableData.reduce((acc, cur) => {
      const index = acc.findIndex(x => x.bet_id === cur.bet_id)
      if (index === -1) acc.push(cur)
      return acc
    }, [])

    return [
      (bet_id, index) => {
        if (!isFirstRow(bet_id, index)) return 0
        return rowCount(bet_id)
      },
      bet_id => uniqData.findIndex(x => x.bet_id === bet_id) + 1,
    ]
  }, [tableData])

  const columns = [
    {
      title: 'No',
      width: 30,
      align: 'center',
      render: (text, record) => getRowNumber(record.bet_id),
      onCell: ({ bet_id }, index) => ({
        rowSpan: getRowSpan(bet_id, index),
      }),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 120,
      onCell: ({ bet_id }, index) => ({
        rowSpan: getRowSpan(bet_id, index),
      }),
    },
    {
      title: 'Trans Time',
      align: 'center',
      width: 120,
      render: ({ bet_id, bet_date }) => {
        return (
          <>
            {`Ref No. ${bet_id}`}
            <br />
            {bet_date.formatDateTimeSecond()}
          </>
        )
      },
      onCell: ({ bet_id }, index) => ({
        rowSpan: getRowSpan(bet_id, index),
      }),
    },
    {
      title: 'Bet Slip',
      width: 200,
      render: record => <BetSlip {...record} odds={record.m_odds || record.odds} />,
      align: 'right',
    },
    {
      title: 'Odds',
      dataIndex: 'odds',
      width: 120,
      render: text => <Amount value={text} length={3} />,
      align: 'right',
      onCell: ({ bet_id }, index) => ({
        rowSpan: getRowSpan(bet_id, index),
      }),
    },
    {
      title: 'Stake',
      align: 'right',
      width: 120,
      render: record => <Amount value={record.bet_amount} />,
      onCell: ({ bet_id }, index) => ({
        rowSpan: getRowSpan(bet_id, index),
      }),
    },
    {
      title: 'Status',
      dataIndex: 'winloss_status',
      align: 'center',
      width: 120,
      render: () => {
        return 'Reject'
      },
      onCell: ({ bet_id }, index) => ({
        rowSpan: getRowSpan(bet_id, index),
      }),
    },
  ]

  return (
    <>
      <Spin spinning={loading}>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  branch_id: 'ALL',
                  currency: 'ALL',
                }}
                onFinish={values => {
                  Load(values)
                }}
              >
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="branch_id">
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={branchOptions}
                      onChange={() => reloadUser(true)}
                    />
                  </Form.Item>
                  <Form.Item name="currency">
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={currencyOptions}
                      onChange={() => reloadUser(true)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please select user',
                      },
                    ]}
                    extra="*User Options affected by branch & currency"
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={userOptions}
                      placeholder="User"
                    />
                  </Form.Item>
                  <Button
                    type="link"
                    loading={loadingOption}
                    icon={<ReloadOutlined />}
                    onClick={() => reloadUser(false)}
                  >
                    Refresh User Options
                  </Button>
                  {/* <Form.Item
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.currency !== currentValues.currency
                    }
                  >
                    {({ isFieldTouched }) => {
                      const disableBaseCurr = !isFieldTouched('currency')
                      return (
                        <Form.Item name="basecurr" valuePropName="checked">
                          <Checkbox disabled={disableBaseCurr} defaultChecked="true">
                            Convert to RMB
                          </Checkbox>
                        </Form.Item>
                      )
                    }}
                  </Form.Item> */}
                </Col>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button
                    loading={loadingExport}
                    icon={<FileExcelOutlined />}
                    onClick={exportHandler}
                  >
                    XLS
                  </Button>
                </Space>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Table
              id="table-cancelled-bet-list"
              bordered
              size="small"
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
          </div>
        </div>
      </Spin>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CancelledBetList)
