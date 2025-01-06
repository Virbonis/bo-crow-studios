import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import qs from 'qs'

export const useSearchParams = () => {
  const { search, pathname } = useLocation()
  const searchParam = React.useMemo(() => {
    const x = qs.parse(search, { ignoreQueryPrefix: true })
    return x
  }, [search])

  const history = useHistory()
  const setSearchParams = React.useCallback(
    params => {
      const newSearch = qs.stringify(params, { addQueryPrefix: true })
      history.push({
        pathname,
        search: newSearch,
      })
    },
    [history, pathname],
  )

  return [searchParam, setSearchParams]
}

export default useSearchParams
