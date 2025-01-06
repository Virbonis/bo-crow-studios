import React from 'react'
import { Select } from 'antd'

const defaultOptionAll = { value: 'all', label: 'All' }
export const SelectMultipleAll = ({
  value = [],
  onChange = () => {},
  options = [],
  optionAll = defaultOptionAll,
  isOptionAllSelectable = false,
  ...props
}) => {
  const flattenOptions = options.flatMap(x => x.options || [x]) // flattenOptions utk nested options

  // prettier-ignore
  const onChangeSelect = v => {
    const valueOptionAll = optionAll.value
    const isAllSelected = v.includes(valueOptionAll)

    if (isAllSelected && v[0] === valueOptionAll && v.length > 1)
      v = v.filter(x => x !== valueOptionAll) // buang #select option all
    else if (isOptionAllSelectable && (isAllSelected || v.length === 0))
      v = [valueOptionAll] // #select option all
    else if (isAllSelected) {
      if (v.length === flattenOptions.length + 1) v = [] // #select empty
      else v = flattenOptions.map(x => x.value) // #select options
    }
    onChange(v)
  }

  const searchProps = useSearchProps({
    options,
    optionAll,
  })
  return (
    <Select
      value={value}
      onChange={onChangeSelect}
      options={[optionAll].concat(options)}
      optionFilterProp="label"
      mode="multiple"
      maxTagCount={value.length === flattenOptions.length ? 0 : 'responsive'}
      maxTagPlaceholder={
        value.length === flattenOptions.length
          ? `${optionAll.label} (${flattenOptions.length})`
          : undefined
      }
      {...props}
      {...searchProps} // #search
    />
  )
}

const useSearchProps = ({ options, optionAll }) => {
  const [searchInput, setSearchInput] = React.useState('')
  const [interacted, setInteracted] = React.useState(false)

  return React.useMemo(() => {
    const isSearching = searchInput.length > 0
    const getOptions = () => {
      if (isSearching) {
        const searchTerm = searchInput.toLowerCase()
        const newOptions = options.filter(e => e.label.toLowerCase().includes(searchTerm))
        return [optionAll].concat(newOptions)
      }
      return [optionAll].concat(options)
    }
    return {
      showSearch: true,
      filterOption: false,
      onSearch: value => setSearchInput(value),
      options: getOptions(),
      onDropdownVisibleChange: open => {
        if (open) setInteracted(true)
        else setSearchInput('')
      },
      autoFocus: interacted,
      allowClear: true,
    }
  }, [options, optionAll, searchInput, interacted])
}

export default SelectMultipleAll
