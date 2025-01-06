import React from 'react'

const startIndex = 0
// eslint-disable-next-line no-unused-vars
export const usePaginationData = (data = [], totalResult, pageSize = 30) => {
  const [pageNumber, setPageNumber] = React.useState(1)

  const tableData = React.useMemo(() => {
    const endIndex = pageNumber * pageSize

    return data.slice(startIndex, endIndex)
  }, [data, pageNumber, pageSize])

  const observer = React.useRef()
  const lastRowElement = React.useCallback(
    node => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && tableData.length !== totalResult) {
          setPageNumber(prev => prev + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [tableData, totalResult],
  )

  const resetPageNumber = React.useCallback(() => {
    setPageNumber(1)
  }, [])
  return [tableData, lastRowElement, resetPageNumber]
}

export default usePaginationData
