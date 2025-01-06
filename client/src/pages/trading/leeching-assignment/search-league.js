import React from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'

const SearchLeague = React.forwardRef((props, ref) => {
  const { setViewParameter } = props

  const debouncedOnChange = debounce(e => {
    e.preventDefault()
    const { value } = e.target
    setViewParameter(prev => ({
      ...prev,
      league_name: value,
      current_page: 1,
    }))
  }, 500)

  return (
    <Input
      ref={ref}
      style={{ width: '400px' }}
      placeholder="Search League"
      onChange={debouncedOnChange}
      onPressEnter={e => {
        e.preventDefault()
      }}
    />
  )
})

export default SearchLeague
