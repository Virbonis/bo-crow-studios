import React, { useRef, useState } from 'react'
import { Button, Input, Space } from 'antd'
import Highlighter from 'react-highlight-words'
import { FilterFilled, SearchOutlined } from '@ant-design/icons'

export const useColumnFilter = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const getColumnFilterProps = (dataIndex, fnChange) => {
    const handleSearch = (selectedKeys, confirm) => {
      setSearchText(selectedKeys[0])
      setSearchedColumn(dataIndex)
      confirm({
        closeDropdown: false,
      })
      if (fnChange && typeof fnChange === 'function') fnChange(selectedKeys[0])
    }

    const handleReset = (clearFilters, confirm) => {
      clearFilters()
      setSearchText('')
      setSearchedColumn(dataIndex)
      confirm({
        closeDropdown: false,
      })
      if (fnChange && typeof fnChange === 'function') fnChange('')
    }

    return {
      filterIcon: <FilterFilled style={{ color: '#fff' }} />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
          style={{
            padding: 8,
          }}
        >
          <Input
            ref={searchInput}
            placeholder="Search"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Filter
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownOpenChange: visible => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100)
        }
      },
      render: text =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    }
  }

  return getColumnFilterProps
}

export default useColumnFilter
