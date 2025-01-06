import React from 'react'
import actions from 'redux/customer-list/actions'
import { connect } from 'react-redux'
import { Button, Form, InputNumber, Table } from 'antd'
import { MemoizedCell, MemoizedRow } from 'components/blaise'

const mapStateToProps = ({ customerList, sport }) => ({
  data: customerList.dataDelayBet,
  listSport: sport.select,
  loading: customerList.loadingDelayBet,
})

const mapDispatchToProps = dispatch => ({
  LoadDataDelay: payload => {
    dispatch({
      type: actions.LOAD_CUSTOMER_DELAY_BET,
      payload,
      source: 'Customer List',
    })
  },
  UpdateDelayBet: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_CUSTOMER_DELAY_BET,
      payload,
      successCallback,
      source: 'Customer List',
    })
  },
})

const columns = [
  {
    title: 'Sport Name',
    dataIndex: 'sport_name',
    // render: record => listSport.find(x => x.sport_id === record).name,
  },
  {
    title: 'Early',
    dataIndex: 'early_delay',
    render: (record, rowData) => {
      return (
        <Form.Item name={[rowData.sport_id, 'early_delay']}>
          <InputNumber min={0} />
        </Form.Item>
      )
    },
  },
  {
    title: 'Today',
    dataIndex: 'today_delay',
    render: (record, rowData) => {
      return (
        <Form.Item name={[rowData.sport_id, 'today_delay']}>
          <InputNumber min={0} />
        </Form.Item>
      )
    },
  },
  {
    title: 'Live',
    dataIndex: 'live_delay',
    render: (record, rowData) => {
      return (
        <Form.Item name={[rowData.sport_id, 'live_delay']}>
          <InputNumber min={0} />
        </Form.Item>
      )
    },
  },
]
const DelaYBet = ({
  customerData,
  data,
  listSport,
  loading,
  LoadDataDelay,
  successCallback,
  UpdateDelayBet,
}) => {
  React.useEffect(() => {
    LoadDataDelay(customerData)
  }, [LoadDataDelay, customerData])

  const [form] = Form.useForm()
  const [selectedRows, setSelectedRows] = React.useState([])

  const dataTable = React.useMemo(() => {
    return listSport.map(x => {
      if (data.find(y => y.sport_id === x.sport_id)) {
        const existData = data.find(y => y.sport_id === x.sport_id)

        return {
          sport_name: x.name,
          ...existData,
        }
      }
      return {
        sport_id: x.sport_id,
        sport_name: x.name,
        early_delay: 0,
        today_delay: 0,
        live_delay: 0,
      }
    })
  }, [data, listSport])

  React.useEffect(() => {
    console.log(listSport)
  }, [listSport])
  React.useEffect(() => {
    console.log(data)
  }, [data])
  React.useEffect(() => {
    console.log(dataTable)
  }, [dataTable])

  React.useEffect(() => {
    const initialValue = dataTable.reduce((acc, curr) => {
      acc = {
        ...acc,
        [curr.sport_id]: {
          ...curr,
        },
      }
      return acc
    }, {})
    form.setFieldsValue(initialValue)
  }, [form, dataTable])

  return (
    <>
      <Form
        form={form}
        onFinish={values => {
          const list_delay_bet = selectedRows
            .map(sport_id => {
              const value = values[sport_id]
              return `${sport_id}^${value.early_delay}^${value.today_delay}^${value.live_delay}`
            })
            .join(',')
          UpdateDelayBet({ customer_id: customerData.customer_id, list_delay_bet }, successCallback)
        }}
      >
        <Table
          loading={loading}
          rowKey="sport_id"
          columns={columns}
          dataSource={dataTable}
          rowSelection={{
            selectedRowKeys: selectedRows,
            onChange: setSelectedRows,
          }}
          pagination={false}
          components={components}
          title={() => {
            return (
              <div className="d-flex justify-content-end">
                <Button
                  type="primary"
                  disabled={selectedRows.length === 0}
                  onClick={() => form.submit()}
                >
                  Submit
                </Button>
              </div>
            )
          }}
        />
      </Form>
    </>
  )
}
const components = {
  body: {
    row: MemoizedRow,
    cell: MemoizedCell,
  },
}

export default connect(mapStateToProps, mapDispatchToProps)(DelaYBet)
