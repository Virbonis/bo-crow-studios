import React from 'react'

export const useFormWithPagination = (form, fetch, totalResult) => {
  const submitValueRef = React.useRef()
  const [pagination, setPagination] = React.useState({ current_page: 1, page_size: 50 })

  React.useEffect(() => {
    form.submit()
  }, [form])

  React.useLayoutEffect(() => {
    if (submitValueRef.current)
      fetch({
        ...submitValueRef.current,
        ...pagination,
      })
  }, [pagination]) // eslint-disable-line react-hooks/exhaustive-deps

  return React.useMemo(
    () => ({
      formProps: {
        onValuesChange: changedValues => {
          const key = Object.keys(changedValues)[0]
          const element = form.getFieldInstance(key)
          const isElementInput = element.nativeElement?.tagName === 'INPUT'
          if (isElementInput) {
            // skip if input
          } else {
            form.submit()
          }
        },
        onKeyPress: e => {
          if (e.key === 'Enter') form.submit()
        },
        onFinish: values => {
          submitValueRef.current = values
          setPagination(prev => ({ ...prev, current_page: 1 })) // indirect fetching
        },
      },
      paginationProps: {
        current: pagination.current_page,
        pageSize: pagination.page_size,
        total: totalResult,
        showTotal: total => `Total ${total} items`,
        onChange: (current_page, page_size) => setPagination({ current_page, page_size }),
        showSizeChanger: true,
      },
      pagination,
      setPagination,
    }),
    [form, totalResult, pagination],
  )
}

export default useFormWithPagination

export const useFormWithPagination2 = (form, fetch, totalResult) => {
  const submitValueRef = React.useRef({
    page: 1,
    pageSize: 50,
  })

  React.useLayoutEffect(() => {
    form.submit()
  }, [form])

  const reload = React.useCallback(() => {
    fetch(submitValueRef.current)
  }, [fetch])
  const memoizedFormProps = React.useMemo(() => {
    return {
      onValuesChange: changedValues => {
        const key = Object.keys(changedValues)[0]
        const element = form.getFieldInstance(key)
        const isElementInput = element.nativeElement?.tagName === 'INPUT'
        if (isElementInput) {
          // skip if input
        } else {
          form.submit()
        }
      },
      onKeyPress: e => {
        if (e.key === 'Enter') form.submit()
      },
      onFinish: values => {
        submitValueRef.current = {
          ...values,
          page: 1,
          pageSize: submitValueRef.current.pageSize,
        }
        reload()
      },
    }
  }, [form, reload])
  const memoizedPagination = React.useMemo(
    () => ({
      current: submitValueRef.current.page,
      pageSize: submitValueRef.current.pageSize,
      total: totalResult,
      showTotal: total => `Total ${total} items`,
      onChange: (page, pageSize) => {
        submitValueRef.current = {
          ...submitValueRef.current,
          page,
          pageSize,
        }
        reload()
      },
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50, 100, 200],
    }),
    [totalResult, reload, submitValueRef.current.page, submitValueRef.current.pageSize], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return {
    formProps: memoizedFormProps,
    paginationProps: memoizedPagination,
    reload,
  }
}
