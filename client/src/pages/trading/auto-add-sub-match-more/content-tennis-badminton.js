import { Divider, Table } from 'antd'
import { Amount } from 'components/blaise'
import { gameTypeDescription, listGT } from 'helper'
import React from 'react'

const columns = [
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    render: text => gameTypeDescription[text]?.long,
    width: 250,
  },
  {
    title: 'Handicap',
    dataIndex: 'handicap',
    render: text => text !== 0 && <Amount value={text} />,
  },
  {
    title: 'Home',
    dataIndex: 'odds_1',
    render: text => <Amount value={text} />,
  },
  {
    title: 'Away',
    dataIndex: 'odds_2',
    render: text => <Amount value={text} />,
  },
]
const listGTSetTennis = ['S1', 'S2', 'S3', 'S4', 'S5']
const ContentTennisBadminton = ({ list }) => {
  return listGTSetTennis.map((gt, index) => {
    const dataSource = list.filter(x => listGT[gt].includes(x.game_type))
    return <TableGameType key={gt} dataSource={dataSource} index={index} />
  })
}

const TableGameType = ({ dataSource, index }) => {
  if (dataSource.length === 0) return null

  return (
    <>
      <Divider orientation="left" className="m-0 font-weight-bold">
        Set {index + 1}
      </Divider>
      <Table
        size="small"
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey="game_type"
        pagination={false}
      />
    </>
  )
}

export default ContentTennisBadminton
