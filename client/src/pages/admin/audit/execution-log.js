import React from 'react'
import { Table, Typography } from 'antd'
import dayjs from 'dayjs'

const ExecutionLog = ({
  task_name,
  start_date,
  parameters: { parameter },
  audits: { audit },
  records: { record },
}) => {
  const LogParameter = () => {
    if (!parameter) return null
    return (
      <Table
        id="logParam"
        rowKey="name"
        size="small"
        dataSource={parameter}
        scroll={{ x: true }}
        columns={[
          {
            dataIndex: 'name',
            width: '40%',
            ellipsis: true,
          },
          {
            dataIndex: 'value',
            width: '60%',
            ellipsis: true,
          },
        ]}
        pagination={false}
        showHeader={false}
      />
    )
  }
  const LogInfo = () => {
    if (!record) return null
    return (
      <Table
        id="logInfo"
        rowKey="text"
        size="small"
        dataSource={record}
        // scroll={{ x: true }}
        columns={[
          {
            render: ({ date }) => {
              // start_date is string from timezone 0, but the value is in local timezone
              const normalize_start_date = dayjs.utc(start_date).format('YYYY-MM-DD HH:mm:ss:SSS')
              const start_time = dayjs(normalize_start_date)
              const exec_time = dayjs(date)
              // display the diff in format= 00:00:00
              const diff_hour = exec_time.diff(start_time, 'hour')
              const diff_minute = exec_time.subtract(diff_hour, 'hour').diff(start_time, 'minute')
              const diff_second = exec_time.subtract(diff_minute, 'minute').diff(start_time, 'second') // prettier-ignore
              const result = `${diff_hour.toString().padStart(2, '0')}:${diff_minute.toString().padStart(2, '0')}:${diff_second.toString().padStart(2, '0')}` // prettier-ignore
              return <Typography.Text>{result}</Typography.Text>
            },
            width: '40%',
          },
          {
            render: ({ text, severity }) => {
              const className = severity === 2 ? 'text-danger' : ''
              return <Typography.Text className={className}>{text}</Typography.Text>
            },
            width: '60%',
            ellipsis: true,
          },
        ]}
        pagination={false}
        showHeader={false}
      />
    )
  }
  const LogAudit = () => {
    if (!audit) return null

    return (
      <Table
        id="logAudit"
        rowKey={row => row.table_name + row.field_name}
        size="small"
        dataSource={audit}
        scroll={{ x: true }}
        columns={[
          {
            title: 'Table',
            dataIndex: 'table_name',
            onCell: ({ table_name }, rowIndex) => {
              return {
                rowSpan:
                  audit.findIndex(x => x.table_name === table_name) === rowIndex
                    ? audit.filter(x => x.table_name === table_name).length
                    : 0,
              }
            },
          },
          {
            title: 'Field Name',
            dataIndex: 'field_name',
          },
          {
            title: 'Old Value',
            dataIndex: 'old_value',
          },
          {
            title: 'New Value',
            dataIndex: 'new_value',
          },
        ]}
        pagination={false}
        onRow={({ is_changed }) => ({
          className: is_changed === '1' ? 'text-red' : '',
        })}
      />
    )
  }

  return (
    <>
      <Typography.Title level={5}>{task_name}</Typography.Title>
      <div id="executionLog">
        <LogParameter />
        <LogInfo />
        <LogAudit />
      </div>
    </>
  )
}

export default ExecutionLog
