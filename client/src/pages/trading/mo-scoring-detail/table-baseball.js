import React from 'react'
import { Table } from 'antd'
import MoveScore from './components/move-score'
import RadioSet from './components/radio-set'
import RadioBallPosition from './components/radio-ball-position'

const TableBaseball = ({ editValue, data, refetch }) => {
  const { home_name, away_name } = editValue
  const { ball_position, current_set } = data
  const dataSource = React.useMemo(
    () => [
      {
        name: home_name,
        set1: data.home1,
        set2: data.home2,
        set3: data.home3,
        set4: data.home4,
        set5: data.home5,
        set6: data.home6,
        set7: data.home7,
        set8: data.home8,
        set9: data.home9,
        set10: data.home10,
        set_name: 'H',
        ball: 1,
      },
      {
        name: away_name,
        set1: data.away1,
        set2: data.away2,
        set3: data.away3,
        set4: data.away4,
        set5: data.away5,
        set6: data.away6,
        set7: data.away7,
        set8: data.away8,
        set9: data.away9,
        set10: data.away10,
        set_name: 'A',
        ball: 2,
      },
    ],
    [home_name, away_name, data],
  )

  const columns = [
    {
      title: '',
      width: 150,
      render: ({ set_name, ball, name }) => (
        <RadioBallPosition
          ball_position={ball_position}
          set_name={set_name}
          ball={ball}
          successCallback={refetch}
        >
          {name}
        </RadioBallPosition>
      ),
    },
    {
      title: () => (
        <RadioSet value={1} current_set={current_set} successCallback={refetch}>
          1 st
        </RadioSet>
      ),
      dataIndex: 'set1',
    },
    {
      title: () => (
        <RadioSet value={2} current_set={current_set} successCallback={refetch}>
          2 nd
        </RadioSet>
      ),
      dataIndex: 'set2',
    },
    {
      title: () => (
        <RadioSet value={3} current_set={current_set} successCallback={refetch}>
          3 rd
        </RadioSet>
      ),
      dataIndex: 'set3',
    },
    {
      title: () => (
        <RadioSet value={4} current_set={current_set} successCallback={refetch}>
          4 th
        </RadioSet>
      ),
      dataIndex: 'set4',
    },
    {
      title: () => (
        <RadioSet value={5} current_set={current_set} successCallback={refetch}>
          5 th
        </RadioSet>
      ),
      dataIndex: 'set5',
    },
    {
      title: () => (
        <RadioSet value={6} current_set={current_set} successCallback={refetch}>
          6 th
        </RadioSet>
      ),
      dataIndex: 'set6',
    },
    {
      title: () => (
        <RadioSet value={7} current_set={current_set} successCallback={refetch}>
          7 th
        </RadioSet>
      ),
      dataIndex: 'set7',
    },
    {
      title: () => (
        <RadioSet value={8} current_set={current_set} successCallback={refetch}>
          8 th
        </RadioSet>
      ),
      dataIndex: 'set8',
    },
    {
      title: () => (
        <RadioSet value={9} current_set={current_set} successCallback={refetch}>
          9 th
        </RadioSet>
      ),
      dataIndex: 'set9',
    },
    {
      title: () => (
        <RadioSet value={10} current_set={current_set} successCallback={refetch}>
          EI
        </RadioSet>
      ),
      dataIndex: 'set10',
    },
    {
      title: '',
      render: row => <MoveScore row={row} current_set={current_set} successCallback={refetch} />,
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
export default TableBaseball
