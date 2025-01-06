import React from 'react'
import { Space, Table } from 'antd'
import MoveScore from './components/move-score'
import RadioSet from './components/radio-set'

const TableBasket = ({ editValue, data, refetch }) => {
  const { home_name, away_name } = editValue
  const { current_set, st_general } = data
  const dataSource = React.useMemo(
    () => [
      {
        name: home_name,
        set1: data.home1,
        set2: data.home2,
        set3: data.home3,
        set4: data.home4,
        set5: data.home5,
        set_name: 'H',
      },
      {
        name: away_name,
        set1: data.away1,
        set2: data.away2,
        set3: data.away3,
        set4: data.away4,
        set5: data.away5,
        set_name: 'A',
      },
    ],
    [home_name, away_name, data],
  )

  const columns = React.useMemo(() => {
    if (st_general === 'H') {
      return [
        {
          title: '',
          dataIndex: 'name',
        },
        {
          title: () => (
            <RadioSet value={1} current_set={current_set} successCallback={refetch}>
              1H
            </RadioSet>
          ),
          dataIndex: 'set1',
          width: 50,
        },
        {
          title: () => (
            <RadioSet value={2} current_set={current_set} successCallback={refetch}>
              1H
            </RadioSet>
          ),
          dataIndex: 'set2',
          width: 50,
        },
        {
          title: '3Q',
          dataIndex: 'set3',
          width: 50,
        },
        {
          title: '4Q',
          dataIndex: 'set4',
          width: 50,
        },
        {
          title: () => (
            <RadioSet value={5} current_set={current_set} successCallback={refetch}>
              OT
            </RadioSet>
          ),
          dataIndex: 'set5',
          width: 50,
        },
        {
          title: '',
          render: row => {
            return (
              <Space>
                <MoveScore
                  row={row}
                  current_set={current_set}
                  movePoint={1}
                  successCallback={refetch}
                />
                <MoveScore
                  row={row}
                  current_set={current_set}
                  movePoint={2}
                  successCallback={refetch}
                />
                <MoveScore
                  row={row}
                  current_set={current_set}
                  movePoint={3}
                  successCallback={refetch}
                />
              </Space>
            )
          },
          width: 150,
        },
      ]
    }
    return [
      {
        title: '',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: () => (
          <RadioSet value={1} current_set={current_set} successCallback={refetch}>
            1Q
          </RadioSet>
        ),
        dataIndex: 'set1',
      },
      {
        title: () => (
          <RadioSet value={2} current_set={current_set} successCallback={refetch}>
            2Q
          </RadioSet>
        ),
        dataIndex: 'set2',
      },
      {
        title: () => (
          <RadioSet value={3} current_set={current_set} successCallback={refetch}>
            3Q
          </RadioSet>
        ),
        dataIndex: 'set3',
      },
      {
        title: () => (
          <RadioSet value={4} current_set={current_set} successCallback={refetch}>
            4Q
          </RadioSet>
        ),
        dataIndex: 'set4',
      },
      {
        title: () => (
          <RadioSet value={5} current_set={current_set} successCallback={refetch}>
            OT
          </RadioSet>
        ),
        dataIndex: 'set5',
      },
      {
        title: '',
        render: row => {
          return (
            <Space>
              <MoveScore
                row={row}
                current_set={current_set}
                movePoint={1}
                successCallback={refetch}
              />
              <MoveScore
                row={row}
                current_set={current_set}
                movePoint={2}
                successCallback={refetch}
              />
              <MoveScore
                row={row}
                current_set={current_set}
                movePoint={3}
                successCallback={refetch}
              />
            </Space>
          )
        },
      },
    ]
  }, [st_general, current_set, refetch])

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
export default TableBasket
