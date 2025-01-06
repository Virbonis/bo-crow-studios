import React from 'react'
import { Button, Drawer, Table } from 'antd'
import { categoryName, priceGroupName } from 'helper'
import Context from 'components/blaise/shared-components/context-provider'
import EditableCustomInput from 'components/blaise/custom/EditableCustomInput'
import EditableCustomSelect from 'components/blaise/custom/EditableCustomSelect'
import { EditableCustomizeCell, EditableCustomizeRow, SelectMultipleAll } from 'components/blaise'
import { debounce } from 'lodash'
import EditLeagueDetail from './edit-league-detail'

const categoryOptions = Object.entries(categoryName).map(([key, value]) => ({
  value: key,
  label: value,
}))

const TableLeague = ({
  compOptions,
  reload,
  allowChangeLeagueName,
  allowEditLeagueSeq,
  Update,
  tableData,
  ...restProps
}) => {
  const [columns, setColumns] = React.useState([
    {
      title: 'League ID',
      dataIndex: 'league_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'English',
      dataIndex: 'league_name_en',
      width: 400,
      editable: allowChangeLeagueName,
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
      title: 'Profile ID',
      dataIndex: 'profile_id',
      align: 'center',
      width: 100,
      // editable: true,
      // editNode: (record, cellProps) => (
      //   <EditableCustomSelect
      //     record={record}
      //     cellProps={cellProps}
      //     options={profileOptions}
      //     showSearch
      //     optionFilterProp="label"
      //   />
      // ),
    },
    {
      title: 'Profile 1X2',
      dataIndex: 'profile1x2',
      width: 100,
    },
    {
      title: 'Group',
      dataIndex: 'price_group',
      align: 'center',
      render: text => priceGroupName[text],
      width: 85,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomSelect
          options={[
            { label: 'Major', value: 1 },
            { label: 'Medium', value: 2 },
            { label: 'Tournament', value: 3 },
            { label: 'Minor', value: 90 },
          ]}
          record={record}
          cellProps={cellProps}
        />
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      align: 'center',
      width: 100,
      render: text => (
        <span style={{ whiteSpace: 'pre-wrap' }}>
          {text
            .split('^')
            .map(value => categoryName[value])
            .join(', \n')}
        </span>
      ),
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomSelect
          record={record}
          cellProps={cellProps}
          mode="multiple"
          delimiter="^"
          placeholder="Select Category"
          showSearch
          className="w-100"
          options={categoryOptions}
          optionFilterProp="label"
        />
      ),
    },
    {
      title: 'Competition',
      dataIndex: 'competition',
      align: 'center',
      width: 85,
      editable: true,
      inputType: 'input',
      editNode: (record, cellProps) => (
        <EditableCustomSelect record={record} cellProps={cellProps} options={compOptions} />
      ),
    },
    {
      title: 'Active',
      align: 'center',
      dataIndex: 'active',
      width: 80,
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
      render: active => {
        const isActive = active === 'Y'
        return (
          <span className={isActive ? 'text-success' : 'text-danger'}>
            {isActive ? 'Active' : 'Disabled'}
          </span>
        )
      },
    },
    {
      title: 'Seq Non Live',
      dataIndex: 'league_sequence',
      align: 'center',
      width: 100,
      editable: allowEditLeagueSeq,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Seq Live',
      dataIndex: 'no_display_live',
      align: 'center',
      width: 100,
      editable: allowEditLeagueSeq,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Mandarin',
      dataIndex: 'league_name_cn',
      width: 100,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Mandarin - TW',
      dataIndex: 'league_name_tw',
      width: 100,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Thai',
      dataIndex: 'league_name_th',
      width: 100,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Japanese',
      dataIndex: 'league_name_jp',
      width: 100,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Korean',
      dataIndex: 'league_name_kr',
      width: 100,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Vietnamese',
      dataIndex: 'league_name_vn',
      width: 100,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: 'Indonesia',
      dataIndex: 'league_name_id',
      width: 100,
      ellipsis: true,
      editable: true,
      editNode: (record, cellProps) => (
        <EditableCustomInput record={record} cellProps={cellProps} />
      ),
    },
    {
      title: '',
      fixed: 'right',
      align: 'center',
      width: 100,
      style: {
        position: 'sticky',
        zIndex: 1,
        right: 60,
        background: '#fff',
      },
      render: record => <DetailButton record={record} reload={reload} />,
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
          id: record.league_id,
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
      rowKey={rowKey}
      scroll={scroll}
      columns={editableColumns}
      dataSource={tableData}
      components={components}
      onRow={record => ({
        record,
        className: 'custom_row',
      })}
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

const components = {
  body: {
    row: EditableCustomizeRow,
    cell: EditableCustomizeCell,
  },
}

const rowKey = 'league_id'
const scroll = { x: '100%', y: true }

const DetailButton = ({ record, reload }) => {
  const [visibleEditDetail, setVisibleEditDetail] = React.useState(false)
  return (
    <>
      <Button type="link" onClick={() => setVisibleEditDetail(true)}>
        Detail
      </Button>
      <Drawer
        title="Edit Detail"
        width="85%"
        open={visibleEditDetail}
        onClose={() => setVisibleEditDetail(false)}
        destroyOnClose
      >
        <EditLeagueDetail
          initialValue={record}
          successCallback={() => {
            setVisibleEditDetail(false)
            reload()
          }}
          cancelEdit={() => setVisibleEditDetail(false)}
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
      .map(([key, val]) => {
        return {
          ...val,
          league_id: Number(key),
          league_sequence: Number(val.league_sequence),
          no_display_live: Number(val.no_display_live),
        }
      })
      .filter(e => e.isEditing)
    Update(updatePayload, reload)
  }
  return (
    <Button type="primary" htmlType="submit" onClick={UpdateHandler}>
      Submit
    </Button>
  )
}

export default TableLeague
