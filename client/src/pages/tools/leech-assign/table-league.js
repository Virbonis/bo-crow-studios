import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Table, Empty, Spin } from 'antd'
import actions from 'redux/leech-assign/actions'
import { isEmpty, isEqual } from 'lodash'

const mapStateToProps = ({ leechAssign }) => ({
  loading: leechAssign.loadingLeagueData,
  tableData: leechAssign.leagueData,
})

const mapDispatchToProps = dispatch => ({
  UpdateLeague: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_LEAGUE,
      payload,
      successCallback,
      source: 'Leech Assign',
    })
  },
})

const columnsLeague = [
  Table.SELECTION_COLUMN,
  {
    title: 'Sport',
    dataIndex: 'sport_name',
    align: 'center',
    width: 70,
  },
  {
    title: 'League Name',
    dataIndex: 'league_name',
    width: 180,
  },
]
const TableLeague = React.memo(
  ({ loading, tableData, UpdateLeague, reload, ...restProps }) => {
    const [formLeague] = Form.useForm()
    const [selectedLeague, setSelectedLeague] = useState([])
    React.useEffect(() => {
      const defaultSelected = tableData.filter(x => x.is_selected === 'Y').map(x => x.league_id)
      setSelectedLeague(defaultSelected)
    }, [tableData])

    const SplitTableData = Object.groupBy(tableData, ({ sport_name }) => sport_name)

    return (
      <Form
        form={formLeague}
        className="w-100"
        id="table-league-form"
        onFinish={() => {
          UpdateLeague({ league_ids: selectedLeague.toString() }, reload)
        }}
      >
        <Form.Item>
          <Button type="primary" htmlType="submit" form="table-league-form">
            Show Matches
          </Button>
        </Form.Item>
        <div
          style={{
            overflow: 'scroll',
            height: '70vh',
          }}
        >
          <Spin spinning={loading}>
            {isEmpty(SplitTableData) ? (
              <Empty />
            ) : (
              Object.entries(SplitTableData).map(e => (
                <div key={e[0]}>
                  <strong> {e[0]}</strong>
                  <TableSelectLeague
                    data={e[1]}
                    columns={columnsLeague}
                    {...restProps}
                    selectedLeague={selectedLeague}
                    setSelectedLeague={setSelectedLeague}
                  />
                </div>
              ))
            )}
          </Spin>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" form="table-league-form">
            Show Matches
          </Button>
        </Form.Item>
      </Form>
    )
  },
  (prev, next) => isEqual(prev, next),
)

const TableSelectLeague = ({ data, selectedLeague, setSelectedLeague, ...restProps }) => {
  return (
    <Table
      rowKey="league_id"
      size="small"
      className="w-100"
      bordered
      dataSource={data}
      columns={columnsLeague}
      {...restProps}
      rowSelection={{
        selectedRowKeys: selectedLeague,
        onSelectAll: (selected, _, changeRows) => {
          const n = changeRows.map(x => x.league_id)
          if (selected) setSelectedLeague(old => [...old, ...n])
          else setSelectedLeague(old => old.filter(x => !n.includes(x)))
        },
        onSelect: (record, selected) => {
          const n = record.league_id
          if (selected) setSelectedLeague(old => [...old, n])
          else setSelectedLeague(old => old.filter(x => x !== n))
        },
      }}
      onRow={row => ({
        onClick: () =>
          setSelectedLeague(old => {
            const n = row.league_id
            const isSelected = old.includes(n)
            if (isSelected) return old.filter(x => x !== n)
            return [...old, n]
          }),
      })}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TableLeague)
