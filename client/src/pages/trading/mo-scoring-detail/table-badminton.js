import React from 'react'
import { Table } from 'antd'
import MoveScore from './components/move-score'
import RadioSet from './components/radio-set'
import SelectSet from './components/select-set'

const TableBadminton = ({ editValue, data, refetch }) => {
  const { home_name, away_name } = editValue
  const dataSource = React.useMemo(
    () => [
      {
        name: home_name,
        set1: data.home1,
        set2: data.home2,
        set3: data.home3,
        set: data.home7,
        set_name: 'H',
      },
      {
        name: away_name,
        set1: data.away1,
        set2: data.away2,
        set3: data.away3,
        set: data.away7,
        set_name: 'A',
      },
    ],
    [home_name, away_name, data],
  )

  const { current_set } = data
  const columns = [
    {
      title: '',
      dataIndex: 'name',
    },
    {
      title: () => (
        <RadioSet value={1} current_set={current_set} successCallback={refetch}>
          1 Set
        </RadioSet>
      ),
      dataIndex: 'set1',
    },
    {
      title: () => (
        <RadioSet value={2} current_set={current_set} successCallback={refetch}>
          2 Set
        </RadioSet>
      ),
      dataIndex: 'set2',
    },
    {
      title: () => (
        <RadioSet value={3} current_set={current_set} successCallback={refetch}>
          3 Set
        </RadioSet>
      ),
      dataIndex: 'set3',
    },
    {
      title: '',
      render: row => <MoveScore row={row} current_set={current_set} successCallback={refetch} />,
    },
    {
      title: 'Set',
      render: row => <SelectSet row={row} successCallback={refetch} />,
    },
  ]

  return (
    <Table
      size="small"
      dataSource={dataSource}
      columns={columns}
      rowKey="name"
      pagination={false}
    />
  )
}
export default TableBadminton
