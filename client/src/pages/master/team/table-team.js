import React from 'react'
import { Button, Drawer, Popconfirm, Space, Table, Tooltip } from 'antd'
import { EditableCustomizeCell, EditableCustomizeRow, SelectMultipleAll } from 'components/blaise'
import { DeleteOutlined } from '@ant-design/icons'
import Context from 'components/blaise/shared-components/context-provider'
import EditableCustomInput from 'components/blaise/custom/EditableCustomInput'
import EditableCustomSelect from 'components/blaise/custom/EditableCustomSelect'
import { debounce } from 'lodash'
import EditCountry from './edit-country'

const TableTeam = ({ canDelete, Delete, reload, Update, tableData, ...restProps }) => {
  const [columns, setColumns] = React.useState([
    {
      title: 'Team ID',
      dataIndex: 'team_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'English',
      dataIndex: 'team_name_en',
      width: 350,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Shortname',
      dataIndex: 'short_name',
      width: 150,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Active',
      align: 'center',
      dataIndex: 'active',
      width: 100,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomSelect
          options={[
            { label: 'Active', value: 'Y' },
            { label: 'Disabled', value: 'N' },
          ]}
          record={record}
          cellProps={cellProps}
        />
      ),
      render: row => {
        const isActive = row === 'Y'
        return (
          <span className={isActive ? 'text-success' : 'text-danger'}>
            {isActive ? 'Active' : 'Disabled'}
          </span>
        )
      },
    },
    {
      title: 'Mandarin',
      dataIndex: 'team_name_cn',
      width: 120,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Mandarin - TW',
      dataIndex: 'team_name_tw',
      width: 120,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Thai',
      dataIndex: 'team_name_th',
      width: 120,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Japanesee',
      dataIndex: 'team_name_jp',
      width: 120,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Korean',
      dataIndex: 'team_name_kr',
      width: 120,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Vietnamese',
      dataIndex: 'team_name_vn',
      width: 120,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Indonesia',
      dataIndex: 'team_name_id',
      width: 120,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: '',
      align: 'center',
      fixed: 'right',
      style: {
        position: 'sticky',
        zIndex: 1,
        right: 60,
        background: '#fff',
      },
      width: 120,
      render: record => (
        <Space direction="horizontal">
          {canDelete && (
            <Tooltip placement="top" title="Delete">
              <Popconfirm
                title="Delete Team"
                description="Do you want to delete this team?"
                onConfirm={() => {
                  Delete(record, reload)
                }}
              >
                <Button type="link" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
          <CountryButton reload={reload} record={record} />
        </Space>
      ),
    },
    {
      title: 'Edit',
      align: 'center',
      fixed: 'right',
      controller: true,
      width: 60,
      style: {
        position: 'sticky',
        zIndex: 1,
        right: 0,
        background: '#fff',
      },
    },
  ])

  const columnsFilter = React.useRef(columns)
  const filterChange = React.useCallback(
    value => {
      const changeColumns = columnsFilter.current.filter(
        prevVal =>
          value.includes(prevVal.title) || prevVal.title === '' || prevVal.title === 'Edit',
      )

      setColumns(changeColumns)
    },
    [setColumns],
  )

  const filterColumnOptions = React.useMemo(
    () =>
      columnsFilter.current
        .map(val => ({
          title: val.title,
          value: val.title,
        }))
        .filter(v => v.title !== '' && v.title !== 'Edit'),
    [columnsFilter],
  )

  const editableColumns = React.useMemo(() => {
    const temp = columns.map(e => {
      return {
        ...e,
        onCell: record => ({
          record,
          id: record.team_id,
          controller: e.controller,
          editable: e.editable,
          ellipsis: e.ellipsis,
          dataIndex: e.dataIndex,
          align: e.align,
          editNode: e.editNode,
          styleCell: e.style,
        }),
      }
    })
    return temp
  }, [columns])

  return (
    <Table
      size="small"
      rowKey={rowKey}
      columns={editableColumns}
      dataSource={tableData}
      scroll={scroll}
      onRow={record => ({
        record,
        className: 'custom_row',
      })}
      components={components}
      title={() => {
        return (
          <div className="w-100 d-flex flex-row justify-content-between">
            <FilterColumns
              options={filterColumnOptions}
              value={columns.map(v => v.title).filter(v => v !== '' && v !== 'Edit')}
              onChange={filterChange}
            />
            <SubmitButton Update={Update} reload={reload} tableData={tableData} />
          </div>
        )
      }}
      {...restProps}
    />
  )
}

const FilterColumns = ({ options, value, onChange }) => {
  const { payload } = React.useContext(Context)
  const [localValue, setLocalValue] = React.useState(value)

  const defaultValue = React.useMemo(() => options.map(e => e.value), [options])
  const disabled = React.useMemo(() => Object.values(payload).some(e => e.isEditing), [payload])

  React.useEffect(() => {
    if (disabled) onChange(defaultValue)
  }, [disabled, onChange, defaultValue])
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const debounceOnChange = React.useCallback(debounce(onChange, 1000), [onChange])

  return (
    <SelectMultipleAll
      mode="multiple"
      allowClear={false}
      options={options}
      defaultValue={defaultValue}
      value={localValue}
      onChange={values => {
        setLocalValue(values)
        debounceOnChange(values)
      }}
      disabled={disabled}
      style={{ width: 300 }}
    />
  )
}

const CountryButton = ({ reload, record }) => {
  const [visibleEditCountry, setVisibleEditCountry] = React.useState(false)
  return (
    <>
      <Button type="link" onClick={() => setVisibleEditCountry(true)}>
        Country
      </Button>
      <Drawer
        title="Edit Country"
        width={420}
        open={visibleEditCountry}
        onClose={() => setVisibleEditCountry(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEditCountry(false)}>Cancel</Button>
            <Button form="edit-country-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <EditCountry
          editCountryValue={record}
          successCallback={() => {
            setVisibleEditCountry(false)
            reload()
          }}
        />
      </Drawer>
    </>
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
        team_id: Number(key),
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

const scroll = { x: '100%', y: true }

const rowKey = 'team_id'

export default TableTeam
