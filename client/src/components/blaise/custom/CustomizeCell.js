import React from 'react'
import { isEqual } from 'lodash'
import { Context } from 'components/blaise/shared-components/context-provider'

export const CustomizeCell = ({ onMouseEnter, onMouseLeave, style, children, ...restProps }) => {
  // remove event onMouseEnter & onMouseLeave
  return (
    <td {...restProps} style={{ ...style, borderInlineEnd: '1px solid #d9d9d9' }}>
      {children}
    </td>
  )
}

export const CustomizeHeader = ({ children, ...restProps }) => {
  return (
    <th {...restProps} style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {children}
    </th>
  )
}

export const CustomizeTable = ({ children, ...restProps }) => {
  return (
    <div {...restProps} style={{ height: '100%', overflowX: 'auto', width: '100%' }}>
      <table>{children}</table>
    </div>
  )
}

export const MemoizedRow = React.memo(
  props => {
    return <tr {...props} />
  },
  ({ onClick: onClickprev, ...restPrev }, { onClick: onClicknext, ...restNext }) => {
    return isEqual(restPrev, restNext)
  },
)
export const MemoizedCell = React.memo(
  props => <td {...props} />,
  (prev, next) => isEqual(prev, next),
)

export const EditableCustomizeCell = React.memo(
  ({
    onMouseEnter,
    onMouseLeave,
    style,
    children,
    dataIndex,
    editNode,
    record,
    editable,
    controller,
    align,
    styleCell,
    ellipsis,
    ...restProps
  }) => {
    return (
      <td {...restProps} style={style}>
        {children}
      </td>
    )
  },
  (prev, next) => isEqual(prev.record, next.record) && isEqual(prev.children, next.children),
)

export const EditableCustomizeRow = ({
  onMouseEnter,
  onMouseLeave,
  style,
  children,
  record,
  ...restProps
}) => {
  const [isEditing, setIsEditing] = React.useState(false)
  React.useEffect(() => {
    setIsEditing(false)
  }, [record])

  const { updatePayload } = React.useContext(Context)

  if (!record) return null
  return (
    <tr {...restProps} style={style}>
      {children.map(child => {
        const {
          props: { additionalProps, render },
        } = child
        const { key } = child
        const {
          controller,
          align,
          editable,
          dataIndex,
          editNode,
          styleCell,
          id,
          ellipsis,
        } = additionalProps
        let className = ''
        if (ellipsis) className += 'ant-table-cell-ellipsis '
        if (controller) {
          return (
            <td key={key} align={align} style={styleCell} className={className}>
              <input
                checked={isEditing}
                type="checkbox"
                onChange={e => {
                  setIsEditing(e.target.checked)
                  updatePayload({
                    [id]: {
                      ...record,
                      isEditing: e.target.checked,
                    },
                  })
                }}
              />
            </td>
          )
        }
        if (editable && isEditing)
          return (
            <td key={key} align={align} style={styleCell} className={className}>
              {editNode(record, {
                inputName: dataIndex,
                dataIndex,
                align,
                id,
                isEditing,
                render,
              })}
            </td>
          )
        if (dataIndex) return child
        return (
          <td key={key} align={align} style={styleCell} className={className}>
            {render(record)}
          </td>
        )
      })}
    </tr>
  )
}

export default CustomizeCell
