import React from 'react'
import { Table } from 'antd'
import { isEqual } from 'lodash'
import produce from 'immer'
import CustomCheckbox from '../shared-components/match-assignment/custom-checkbox'
import ButtonDetail from '../shared-components/match-assignment/button-detail'
import ButtonLog from '../shared-components/match-assignment/button-log'

const TableMatchContent = React.memo(
  ({ onRow, dataSource, setSelectedData }) => {
    const onCheck = React.useCallback(
      (record, type) => {
        const [key, value] = Object.entries(type)[0]
        setSelectedData(prev => {
          const { match_id, match_time_slot } = record
          const index = prev.findIndex(e => e.match_id === match_id)

          if (index !== -1) {
            return produce(prev, draftState => {
              draftState[index][key] = !value

              const { db_ht = false, db_ft = false, rb_ht = false, rb_ft = false } = draftState[index] // prettier-ignore
              if (!db_ht && !db_ft && !rb_ht && !rb_ft) draftState.splice(index, 1)
            })
          }
          return [...prev, { match_id, match_time_slot, [key]: !value }]
        })
      },
      [setSelectedData],
    )

    const onCheckHeader = React.useCallback(
      (type, checked) => {
        setSelectedData(prev =>
          produce(prev, draftState => {
            dataSource.forEach(record => {
              const { match_id, match_time_slot } = record
              const index = draftState.findIndex(e => e.match_id === match_id)
              if (index !== -1) {
                draftState[index][type] = checked
              } else {
                draftState.push({ match_id, match_time_slot, [type]: checked })
              }
              // const { rb_ht = false, rb_ft = false } = draftState[index]
              if (
                !checked &&
                !draftState[index]?.db_ht &&
                !draftState[index]?.db_ft &&
                !draftState[index]?.rb_ht &&
                !draftState[index]?.rb_ft
              ) {
                draftState.splice(index, 1)
              }
            })
          }),
        )
      },
      [dataSource, setSelectedData],
    )

    const columnMatch = React.useMemo(
      () => [
        {
          title: 'Sport',
          dataIndex: 'sport_name',
          align: 'center',
          width: 100,
        },
        {
          title: 'Match ID / Match Date',
          width: 120,
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
          width: 150,
        },
        {
          title: 'Home Away',
          align: 'left',
          width: 220,
          render: record => <ButtonLog record={record} />,
        },
        {
          title: 'Dead Ball',
          children: [
            {
              align: 'center',
              width: 30,
              title: () => (
                <input type="checkbox" onChange={e => onCheckHeader('db_ht', e.target.checked)} />
              ),
              render: (record, { db_ht }) => (
                <CustomCheckbox checked={db_ht} onChange={() => onCheck(record, { db_ht })} />
              ),
              onCell: ({ match_time_slot }) => ({
                className: `cell_checkbox ${toSnakeCase(match_time_slot)}`,
              }),
            },
            {
              title: 'HT',
              width: 100,
              render: record => (
                <ButtonDetail record={record} traderType="PICKDBHT" isPick isLive={false} />
              ),
            },
            {
              align: 'center',
              width: 30,
              title: () => (
                <input type="checkbox" onChange={e => onCheckHeader('db_ft', e.target.checked)} />
              ),
              render: (record, { db_ft }) => (
                <CustomCheckbox checked={db_ft} onChange={() => onCheck(record, { db_ft })} />
              ),
              onCell: ({ match_time_slot }) => ({
                className: `cell_checkbox ${toSnakeCase(match_time_slot)}`,
              }),
            },
            {
              title: 'FT',
              width: 100,
              render: record => (
                <ButtonDetail record={record} traderType="PICKDBFT" isPick isLive={false} />
              ),
            },
          ],
        },
        {
          title: 'Runnning Ball',
          children: [
            {
              align: 'center',
              width: 30,
              title: () => (
                <input type="checkbox" onChange={e => onCheckHeader('rb_ht', e.target.checked)} />
              ),
              render: (record, { rb_ht }) => (
                <CustomCheckbox checked={rb_ht} onChange={() => onCheck(record, { rb_ht })} />
              ),
              onCell: ({ match_time_slot }) => ({
                className: `cell_checkbox ${toSnakeCase(match_time_slot)}`,
              }),
            },
            {
              title: 'HT',
              width: 100,
              render: record => <ButtonDetail record={record} traderType="PICKRBHT" isPick />,
            },
            {
              title: () => (
                <input type="checkbox" onChange={e => onCheckHeader('rb_ft', e.target.checked)} />
              ),
              width: 30,
              render: (record, { rb_ft }) => (
                <CustomCheckbox checked={rb_ft} onChange={() => onCheck(record, { rb_ft })} />
              ),
              onCell: ({ match_time_slot }) => ({
                className: `cell_checkbox ${toSnakeCase(match_time_slot)}`,
              }),
            },
            {
              title: 'FT',
              width: 100,
              render: record => <ButtonDetail record={record} traderType="PICKRBFT" isPick />,
            },
          ],
        },
      ],
      [onCheck, onCheckHeader],
    )
    return (
      <Table
        id="table-match"
        rowKey="match_id"
        className="w-100 custom_row_hover"
        columns={columnMatch}
        dataSource={dataSource}
        onRow={onRow}
        pagination={false}
        scroll={scroll}
        virtual
      />
    )
  },
  (prev, next) => isEqual(prev.dataSource, next.dataSource),
)

const scroll = { y: 500 }

const toSnakeCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_')

export default TableMatchContent
