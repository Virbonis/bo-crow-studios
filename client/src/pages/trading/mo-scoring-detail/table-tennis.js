import React from 'react'
import { Table } from 'antd'
import MoveScore from './components/move-score'
import RadioSet from './components/radio-set'
import RadioBallPosition from './components/radio-ball-position'
import SelectSet from './components/select-set'
import MovePoint from './components/move-point'
import SelectInjured from './components/select-injured'

const TableTennis = ({ editValue, data, refetch }) => {
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
        set: data.home7,
        point: data.home99,
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
        set: data.away7,
        point: data.away99,
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
      title: () => (
        <RadioSet value={4} current_set={current_set} successCallback={refetch}>
          4 Set
        </RadioSet>
      ),
      dataIndex: 'set4',
    },
    {
      title: () => (
        <RadioSet value={5} current_set={current_set} successCallback={refetch}>
          5 Set
        </RadioSet>
      ),
      dataIndex: 'set5',
    },
    {
      title: '',
      render: row => <MoveScore row={row} current_set={current_set} successCallback={refetch} />,
    },
    {
      title: 'Set',
      render: row => <SelectSet row={row} successCallback={refetch} />,
    },
    {
      title: 'Point',
      dataIndex: 'point',
    },
    {
      title: '',
      render: ({ set_name }) => (
        <MovePoint
          home99={data.home99}
          away99={data.away99}
          st_general={data.st_general}
          home_away={set_name}
          successCallback={refetch}
        />
      ),
    },
    {
      title: 'Injured',
      render: () => <SelectInjured st_injured={data.st_injured} successCallback={refetch} />,
      align: 'center',
      onCell: (row, index) => {
        return {
          className: 'align-middle',
          rowSpan: index === 0 ? 2 : 0,
        }
      },
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
export default TableTennis
