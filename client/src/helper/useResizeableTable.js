import React from 'react'
import { Resizable } from 'react-resizable'

export const useResizeableTableProps = (columns, setColumns) => {
  const originalColumns = React.useRef(columns)

  const refTableBody = React.useRef()
  const refMarker = React.useRef()
  const refMarker2 = React.useRef()

  const [ratioResize, setRatioResize] = React.useState()

  const getFirstRenderColumn = React.useCallback(() => {
    if (refTableBody.current) {
      const widthRendered = refTableBody.current.firstElementChild.childNodes[0].getBoundingClientRect()
        .width
      const originalWidth = originalColumns.current[0]?.width
      setRatioResize(widthRendered / originalWidth)
    }
  }, [])

  React.useEffect(() => {
    const currentColumnsLength =
      columns[columns.length - 1].title === 'Edit' ? columns.length - 1 : columns.length

    if (currentColumnsLength < originalColumns.current?.length) {
      originalColumns.current = originalColumns.current.filter(value =>
        columns.find(({ title }) => value.title === title),
      )
    } else if (currentColumnsLength > originalColumns.current?.length) {
      const lastDeleted = columns.filter(
        value =>
          !originalColumns.current.find(
            ({ title }) => value.title === title || value.title === 'Edit',
          ),
      )
      const arrIndex = lastDeleted.map(value => columns.findIndex(e => value.title === e.title))

      lastDeleted.forEach((element, index) => {
        originalColumns.current.splice(arrIndex[index], 0, element)
      })
    }

    getFirstRenderColumn()
  }, [columns, getFirstRenderColumn])

  React.useEffect(() => {
    setTimeout(getFirstRenderColumn, 50)
  }, [refTableBody, getFirstRenderColumn])

  const startX = React.useRef(0)

  React.useEffect(() => {
    const updateWindowDimensions = () => {
      getFirstRenderColumn()
    }

    window.addEventListener('resize', updateWindowDimensions)

    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [getFirstRenderColumn])

  const transformToResizeableColumns = React.useCallback(
    prev => {
      return prev.map((col, index) => ({
        ...col,
        onHeaderCell: column => ({
          width: column.width,
          onResizeStart: e => {
            refMarker.current.style.visibility = 'visible'
            refMarker2.current.style.visibility = 'visible'

            const parent = refTableBody.current.parentElement
            const sidebarSize = Math.floor(parent.getBoundingClientRect().left)

            const child = refTableBody.current.firstElementChild.childNodes
            const boundingClient = child[index].getBoundingClientRect()

            // find parent div 'ant-table-body' to get the scrollOffsetLeft

            const widthClient = boundingClient.width

            const leftMarker = boundingClient.x - sidebarSize
            const rightMarker = leftMarker + widthClient

            refMarker2.current.style.left = `${rightMarker}px`
            refMarker.current.style.left = `${leftMarker}px`

            startX.current = e.clientX
          },
          onResize: e => {
            const parent = refTableBody.current.parentElement
            const sidebarSize = Math.floor(parent.getBoundingClientRect().left)
            const child = refTableBody.current.firstElementChild.childNodes

            const boundingClient = child[index].getBoundingClientRect()

            // const widthClient = boundingClient.width

            const left = boundingClient.x - sidebarSize

            // const leftMarker = calculateLeftPosition(prev, index)
            // const rightMarker = calculateLeftPosition(prev, index + 1)
            const addedWidth = e.clientX - startX.current
            const newWidth = column.width * ratioResize + addedWidth
            const position = e.clientX - sidebarSize

            const originalWidthToRatio = originalColumns.current[index].width * ratioResize

            // if width is less than the original width, use the original width
            let validatedPosition
            if (newWidth < originalWidthToRatio) validatedPosition = left + originalWidthToRatio
            else validatedPosition = position
            refMarker2.current.style.left = `${validatedPosition}px`
          },
          onResizeStop: e => {
            refMarker.current.style.visibility = 'hidden'
            refMarker2.current.style.visibility = 'hidden'

            const addedWidth = e.clientX - startX.current
            const newWidthRatio = column.width * ratioResize + addedWidth
            const originalWidthToRatio = ratioResize * originalColumns.current[index].width

            // if width is less than the original width, use the original width
            let validatedWidth
            if (newWidthRatio < originalWidthToRatio)
              validatedWidth = originalColumns.current[index].width
            else validatedWidth = newWidthRatio

            const oldColumns = [...prev]
            oldColumns[index] = {
              ...oldColumns[index],
              width: validatedWidth,
            }
            if (prev[index].width !== validatedWidth) setColumns(oldColumns)
          },
        }),
      }))
    },
    [setColumns, originalColumns.current, ratioResize],
  )

  const memoizedProps = React.useMemo(() => {
    return {
      transformToResizeableColumns,
      components: {
        table: getResizeableTable(refTableBody, refMarker, refMarker2),
        header: {
          cell: ResizableHeader,
        },
      },
    }
  }, [transformToResizeableColumns])

  return memoizedProps
}

const getResizeableTable = (refTableBody, refMarker, refMarker2) => props => {
  return (
    <>
      <table ref={refTableBody} {...props} />
      <div
        ref={refMarker}
        id="x-grid3-marker"
        style={{
          visibility: 'hidden',
          height: '100%',
          backgroundColor: '#777',
          top: '1px',
          width: '1px',
          border: '0 none',
          zIndex: '999999',
          position: 'absolute',
        }}
      />
      <div
        ref={refMarker2}
        id="x-grid3-marker2"
        style={{
          visibility: 'hidden',
          height: '100%',
          backgroundColor: '#777',
          top: '1px',
          width: '1px',
          border: '0 none',
          zIndex: '999999',
          position: 'absolute',
        }}
      />
    </>
  )
}
const ResizableHeader = props => {
  const { onResize, onResizeStart, onResizeStop, width, ...restProps } = props
  if (!width) {
    return <th {...restProps} />
  }

  return (
    <Resizable
      axis="x"
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation()
          }}
          role="presentation"
          style={{
            position: 'absolute',
            insetInlineEnd: '-5px',
            bottom: '0',
            zIndex: '1',
            width: '10px',
            height: '100%',
            cursor: 'col-resize',
          }}
        />
      }
      onResize={onResize}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
    >
      <th {...restProps} />
    </Resizable>
  )
}

export default useResizeableTableProps
