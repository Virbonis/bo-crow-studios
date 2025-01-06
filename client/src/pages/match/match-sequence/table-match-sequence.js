import React from 'react'
import { Button, Table } from 'antd'
import { Context } from 'components/blaise/shared-components/context-provider'
import { EditableCustomizeCell, EditableCustomizeRow } from 'components/blaise'
import EditableCustomInput from 'components/blaise/custom/EditableCustomInput'
import SwapSequenceButton from './swap-sequence-button'

const TableMatchSequence = ({ tableData, loadingData, reload, Update }) => {
  const convertedDataTable = React.useMemo(
    () =>
      tableData.map((curr, currIdx) => {
        const canBeSwap =
          tableData.filter(
            e => e.special_sequence === curr.special_sequence && e.match_date === curr.match_date, // sameMatchSequence
          ).length > 1
        if (!canBeSwap) return curr

        const firstIndex = tableData.findIndex(
          e => e.special_sequence === curr.special_sequence && e.match_date === curr.match_date,
        )
        const lastIndex = tableData.findLastIndex(
          e => e.special_sequence === curr.special_sequence && e.match_date === curr.match_date,
        )
        if (currIdx === firstIndex)
          return {
            ...curr,
            match_id_swap_down: tableData[currIdx + 1].match_id,
            swapDown: true,
          }
        if (currIdx === lastIndex)
          return {
            ...curr,
            match_id_swap_up: tableData[currIdx - 1].match_id,
            swapUp: true,
          }
        return {
          ...curr,
          match_id_swap_down: tableData[currIdx + 1].match_id,
          match_id_swap_up: tableData[currIdx - 1].match_id,
          swapUp: true,
          swapDown: true,
        }
      }),
    [tableData],
  )

  const columns = [
    {
      title: 'Special Sequence',
      dataIndex: 'special_sequence',
      align: 'center',
      width: 200,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Match Date/Time',
      dataIndex: 'match_date',
      align: 'center',
      width: 150,
    },
    {
      title: 'Match Sequence',
      dataIndex: 'sequence',
      align: 'center',
      width: 100,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Match ID',
      dataIndex: 'match_id',
      align: 'center',
      width: 80,
    },
    {
      title: 'Swap',
      align: 'center',
      width: 80,
      render: record => <SwapSequenceButton record={record} reload={reload} />,
    },
    {
      title: 'Home - Away',
      dataIndex: 'team',
      width: 150,
    },
    {
      title: 'Leech',
      dataIndex: 'auto_odds',
      align: 'center',
      width: 70,
    },
    {
      title: 'League',
      dataIndex: 'league_name',
      width: 300,
    },
    {
      title: 'Edit',
      align: 'center',
      controller: true,
      width: 80,
    },
  ]

  const editableColumns = React.useMemo(() => {
    const temp = columns.map(e => {
      return {
        ...e,
        onCell: record => ({
          record,
          id: record.match_id,
          controller: e.controller,
          editable: e.editable,
          dataIndex: e.dataIndex,
          align: e.align,
          editNode: e.editNode,
        }),
      }
    })
    return temp
  }, [columns])

  return (
    <Table
      rowKey="match_id"
      size="small"
      loading={loadingData}
      dataSource={convertedDataTable}
      columns={editableColumns}
      pagination={false}
      components={components}
      onRow={record => ({
        record,
        className: 'custom_row',
      })}
      title={() => (
        <div className="d-flex justify-content-end">
          <SubmitButton Update={Update} reload={reload} tableData={tableData} />
        </div>
      )}
    />
  )
}

const SubmitButton = ({ Update, reload, tableData }) => {
  const { payload, resetPayload } = React.useContext(Context)
  React.useEffect(() => {
    resetPayload()
  }, [resetPayload, tableData])

  const UpdateHandler = () => {
    const updatePayload = Object.entries(payload)
      .map(([key, val]) => ({
        ...val,
        match_id: Number(key),
      }))
      .filter(e => e.isEditing)
    Update(updatePayload, reload)
  }
  return (
    <Button type="primary" htmlType="submit" onClick={UpdateHandler}>
      Submit
    </Button>
  )
}

const components = {
  body: {
    row: EditableCustomizeRow,
    cell: EditableCustomizeCell,
  },
}

export default TableMatchSequence
