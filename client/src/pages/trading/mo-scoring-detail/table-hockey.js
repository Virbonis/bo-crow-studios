import React from 'react'
import { Table } from 'antd'
import MoveScore from './components/move-score'
import RadioSet from './components/radio-set'
import SelectPlayer from './components/select-player'

const TableHockey = ({ editValue, data, refetch }) => {
  const { home_name, away_name } = editValue
  const { current_set } = data
  const dataSource = React.useMemo(
    () => [
      {
        name: home_name,
        set1: data.home1,
        set2: data.home2,
        set3: data.home3,
        set4: data.home4,
        player: data.home6,
        set_name: 'H',
      },
      {
        name: away_name,
        set1: data.away1,
        set2: data.away2,
        set3: data.away3,
        set4: data.away4,
        player: data.away6,
        set_name: 'A',
      },
    ],
    [home_name, away_name, data],
  )

  const columns = [
    {
      title: '',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: () => (
        <RadioSet value={1} current_set={current_set} successCallback={refetch}>
          1 Period
        </RadioSet>
      ),
      dataIndex: 'set1',
    },
    {
      title: () => (
        <RadioSet value={2} current_set={current_set} successCallback={refetch}>
          2 Period
        </RadioSet>
      ),
      dataIndex: 'set2',
    },
    {
      title: () => (
        <RadioSet value={3} current_set={current_set} successCallback={refetch}>
          3 Period
        </RadioSet>
      ),
      dataIndex: 'set3',
    },
    {
      title: () => (
        <RadioSet value={4} current_set={current_set} successCallback={refetch}>
          OT
        </RadioSet>
      ),
      dataIndex: 'set4',
    },
    {
      title: '',
      render: row => <MoveScore row={row} current_set={current_set} successCallback={refetch} />,
    },
    {
      title: 'Set',
      render: ({ player, set_name }) => <SelectPlayer player={player} set_name={set_name} />,
    },
  ]

  return (
    <Table
      rowKey="name"
      dataSource={dataSource}
      columns={columns}
      size="small"
      pagination={false}
    />
  )
}
export default TableHockey
