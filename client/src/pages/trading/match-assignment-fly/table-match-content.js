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

              const { rb_ht = false, rb_ft = false } = draftState[index]
              if (!rb_ht && !rb_ft) draftState.splice(index, 1)
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
              if (!checked && !draftState[index]?.rb_ht && !draftState[index]?.rb_ft) {
                draftState.splice(index, 1)
              }
            })
          }),
        )
      },
      [dataSource, setSelectedData],
    )

    const columnsMatch = React.useMemo(
      () => [
        {
          title: 'Sport',
          dataIndex: 'sport_name',
          align: 'center',
          width: 80,
        },
        {
          title: 'Match ID / Match Date',
          width: 100,
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
          render: record => {
            return <ButtonLog record={record} />
          },
        },
        {
          title: 'Runnning Ball',
          children: [
            {
              align: 'center',
              width: 30,
              title: () => {
                return (
                  <input type="checkbox" onChange={e => onCheckHeader('rb_ht', e.target.checked)} />
                )
              },
              render: (record, { rb_ht }) => {
                return (
                  <CustomCheckbox checked={rb_ht} onChange={() => onCheck(record, { rb_ht })} />
                )
              },
              shouldCellUpdate: (prev, next) => !isEqual(prev.rb_ht, next.rb_ht),
              onCell: ({ match_time_slot }) => ({
                className: `cell_checkbox ${toSnakeCase(match_time_slot)}`,
              }),
            },
            {
              title: 'HT',
              width: 100,
              render: record => {
                return <ButtonDetail record={record} traderType="RBHT" />
              },
            },
            {
              align: 'center',
              width: 30,
              title: () => {
                return (
                  <input type="checkbox" onChange={e => onCheckHeader('rb_ft', e.target.checked)} />
                )
              },
              render: (record, { rb_ft }) => (
                <CustomCheckbox checked={rb_ft} onChange={() => onCheck(record, { rb_ft })} />
              ),
              shouldCellUpdate: (prev, next) => !isEqual(prev.rb_ft, next.rb_ft),
              onCell: ({ match_time_slot }) => ({
                className: `cell_checkbox ${toSnakeCase(match_time_slot)}`,
              }),
            },
            {
              title: 'FT',
              width: 100,
              render: record => {
                return <ButtonDetail record={record} traderType="RBFT" />
              },
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
        columns={columnsMatch}
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
