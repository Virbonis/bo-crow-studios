import { Button, Table, message } from 'antd'
import actions from 'redux/bti-auto-add-match/actions'
import React from 'react'
import { connect } from 'react-redux'
import { ReloadOutlined } from '@ant-design/icons'

const mapStateToProps = ({ BTIautoAddMatch }) => ({
  loading: BTIautoAddMatch.loading_unmapped,
  dataTable: BTIautoAddMatch.data_unmapped,
})

const mapDispatchToProps = dispatch => ({
  InsertMatch: (payload, successCallback) => {
    dispatch({
      type: actions.INSERT_MATCH,
      payload,
      successCallback,
      source: 'BTI Auto Add Match',
    })
  },
})

const columns = [
  {
    title: 'BTI League Name',
    dataIndex: 'league_name',
    width: 100,
  },
  {
    title: 'BTI Home Name',
    dataIndex: 'home_name',
    width: 100,
  },
  {
    title: 'BTI Away Name',
    dataIndex: 'away_name',
    width: 100,
  },
  {
    title: 'BTI Match Date',
    dataIndex: 'start_event_date',
    width: 100,
    render: text => text.formatDateTime(),
  },
  Table.SELECTION_COLUMN,
]
const BTIMatchInsert = ({
  loading,
  dataTable,

  InsertMatch,
  successCallback,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([])
  React.useEffect(() => setSelectedRowKeys([]), [dataTable])

  const onClickSubmit = React.useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one match')
      return
    }
    const payload = {
      bti_match_ids: selectedRowKeys,
    }
    InsertMatch(payload, () => {
      setSelectedRowKeys([])
      successCallback()
    })
  }, [InsertMatch, selectedRowKeys, successCallback])

  return (
    <Table
      rowKey="match_id"
      columns={columns}
      loading={loading}
      dataSource={dataTable}
      pagination={false}
      rowSelection={{
        selectedRowKeys,
        onChange: setSelectedRowKeys,
      }}
      title={() => (
        <div className="d-flex justify-content-end">
          <Button type="primary" onClick={onClickSubmit} disabled={selectedRowKeys.length === 0}>
            Add Match
          </Button>
          <Button
            className="float-right"
            icon={<ReloadOutlined />}
            form="formInsert"
            htmlType="submit"
          />
        </div>
      )}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BTIMatchInsert)
