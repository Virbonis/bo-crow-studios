import React from 'react'
import { connect } from 'react-redux'
import { Input, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
// import { CustomizeCell } from 'components/blaise'
import ButtonDetail from '../shared-components/match-assignment/button-detail'
import ButtonLog from '../shared-components/match-assignment/button-log'

const mapStateToProps = ({ matchAssignment }) => ({
  dataMatch: matchAssignment.dataMatch,
})

const columnMatch = [
  {
    title: 'Sport',
    dataIndex: 'sport_name',
    align: 'center',
    width: '100px',
  },
  {
    title: 'Match ID / Match Date',
    width: '120px',
    align: 'center',
    render: record => {
      return (
        <span>
          <span className={`icon_${toSnakeCase(record.match_time_slot)}`} /> {record.match_id}
          <br /> {record.match_date}
        </span>
      )
    },
  },
  {
    title: 'League',
    dataIndex: 'league_name',
    width: '150px',
  },
  {
    title: 'Home Away',
    align: 'left',
    width: '220px',
    render: record => <ButtonLog record={record} />,
  },
  {
    title: 'Runnning Ball',
    children: [
      {
        title: 'HT',
        width: '100px',
        render: record => <ButtonDetail record={record} traderType="RBHT" isReadOnly />,
      },
      {
        title: 'FT',
        width: '100px',
        render: record => <ButtonDetail record={record} traderType="RBFT" isReadOnly />,
      },
    ],
  },
]

const TableMatch = ({ dataMatch }) => {
  const [dataSource, setDataSource] = React.useState([])

  React.useEffect(() => {
    setDataSource(dataMatch)
  }, [dataMatch])
  const onRow = (record, index) => {
    const { sport_name } = record
    const isLastIndexSportName = sport_name !== dataMatch[index + 1]?.sport_name
    return {
      className:
        isLastIndexSportName && index !== dataMatch.length - 1 ? 'custom_border_bottom' : '',
    }
  }
  const onSearch = e => {
    const searchTerm = e.target.value.toLowerCase()
    if (e.target.value.length > 0) {
      setDataSource(
        dataMatch.filter(
          v =>
            v.match_id.toString().includes(searchTerm) ||
            v.home_name.toLowerCase().includes(searchTerm) ||
            v.away_name.toLowerCase().includes(searchTerm) ||
            v.league_name.toLowerCase().includes(searchTerm),
        ),
      )
    } else setDataSource(dataMatch)
  }
  return (
    <>
      <div className="d-flex flex-row justify-content-between header-style">
        <div>Assign Match</div>
      </div>
      <Table
        title={() => (
          <div align="right">
            <Input
              placeholder="Search"
              style={{ width: 300 }}
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              onPressEnter={onSearch}
            />
          </div>
        )}
        id="table-match"
        className="w-100"
        size="small"
        bordered
        virtual
        rowKey="match_id"
        columns={columnMatch}
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: 500 }}
        onRow={onRow}
      />
    </>
  )
}

const toSnakeCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_')

export default connect(mapStateToProps, null)(TableMatch)
