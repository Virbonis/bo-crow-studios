import React, { useEffect, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import qs from 'qs'
import { v4 as uuidv4 } from 'uuid'
import { useSearchParams } from './useSearchParams'

export const wrapperPopup = Component =>
  withRouter(props => {
    const { location, history, match, ...restProps } = props
    const query = useMemo(() => qs.parse(location.search, { ignoreQueryPrefix: true }), [location])
    useEffect(() => {
      if (!query.popup_id) {
        history.replace({
          pathname: location.pathname,
          search: qs.stringify({
            ...query,
            popup_id: uuidv4(),
          }),
        })
      }
    }, [history, location, query])

    if (!query.popup_id) return null
    return <Component {...query} {...restProps} />
  })

export const usePopupID = () => {
  const [{ popup_id }] = useSearchParams()
  return popup_id
}

export default wrapperPopup
