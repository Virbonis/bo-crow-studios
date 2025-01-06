import React from 'react'
import { Row, Col, Table, Button, Select } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/user-online/actions'
import { ReloadOutlined } from '@ant-design/icons'
import { amount, Amount, useInterval } from 'components/blaise'

const mapStateToProps = ({ userOnline }) => ({
  loading: userOnline.loadingData,
  tableData: userOnline.data.result || [],
  totalUserOnline: userOnline.data.total || 0,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD_TABLE,
      source: 'User Online',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const intervalOptions = [
  { value: 0, label: 'None' },
  { value: 30, label: '30s' },
  { value: 60, label: '1m' },
  { value: 120, label: '2m' },
  { value: 180, label: '3m' },
  { value: 300, label: '5m' },
  { value: 600, label: '10m' },
]
const columns = [
  {
    title: 'Branch',
    dataIndex: 'branch_name',
    width: 400,
  },
  {
    title: 'User',
    dataIndex: 'user_online',
    render: text => <Amount value={text} int />,
    align: 'right',
    width: 80,
  },
  {
    title: 'Mobile++',
    dataIndex: 'mobile_plus',
    render: text => <Amount value={text} int />,
    align: 'right',
    width: 80,
  },
  {
    title: 'Mobile',
    dataIndex: 'mobile',
    render: text => <Amount value={text} int />,
    align: 'right',
    width: 80,
  },
  {
    title: 'SB++',
    dataIndex: 'wap',
    render: text => <Amount value={text} int />,
    align: 'right',
    width: 80,
  },
  {
    title: 'Web',
    dataIndex: 'web',
    render: text => <Amount value={text} int />,
    align: 'right',
    width: 80,
  },
  {
    title: 'Simple',
    dataIndex: 'simple',
    render: text => <Amount value={text} int />,
    align: 'right',
    width: 80,
  },
  {
    title: 'China Desktop',
    dataIndex: 'china_desktop',
    render: text => <Amount value={text} int />,
    align: 'right',
    width: 80,
  },
  {
    title: 'China Mobile',
    dataIndex: 'china_mobile',
    render: text => <Amount value={text} int />,
    align: 'right',
    width: 80,
  },
]

const MemberOnline = ({ loading, tableData, totalUserOnline, Load, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [interval, setInterval] = React.useState(30)

  const onFetch = React.useCallback(() => {
    Load()
  }, [Load])
  const [timer, reload] = useInterval(interval, onFetch)

  return (
    <div className="card">
      <div className="card-header">
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={4} lg={4} xl={4}>
            <Button className="w-50" onClick={reload} icon={<ReloadOutlined />}>
              Refresh {interval !== 0 && ` (${timer})`}
            </Button>
            <Select
              className="w-50"
              options={intervalOptions}
              value={interval}
              onChange={setInterval}
            />
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <Table
          rowKey="branch_name"
          bordered
          size="small"
          loading={loading}
          columns={columns}
          dataSource={tableData}
          pagination={false}
          title={() => `Total User Online : ${amount(totalUserOnline, 0)}`}
        />
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberOnline)
