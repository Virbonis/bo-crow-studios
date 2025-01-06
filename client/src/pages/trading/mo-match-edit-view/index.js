import React from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { isEmpty } from 'lodash'
import DragableModal from 'components/blaise/custom/DragableModal'
import actions from 'redux/mo-match-edit/actions'
import ContentBasic from './content'

// utk skrg ini pake mo-match-edit, yg ini dihold dulu
const mapStateToProps = ({ moEdit }) => ({
  editValue: moEdit.editValue,
  visible: !isEmpty(moEdit.editValue),
  data: moEdit.data,
  loading: moEdit.loading,
})
const mapDispatchToProps = dispatch => ({
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
  LoadMatch: payload => {
    dispatch({
      type: actions.LOAD_MATCH,
      payload,
    })
  },
})
const DrawerMOMatchEdit = React.memo(props => {
  const { editValue, visible, data, loading, CancelEdit, LoadMatch, page = 'MO5' } = props

  React.useEffect(() => {
    if (isEmpty(editValue)) return
    LoadMatch(editValue)
  }, [LoadMatch, editValue])

  if (!visible) return null
  return (
    <>
      <DragableModal
        title={`Edit Match - ${editValue.match_id}`}
        open={visible}
        onCancel={CancelEdit}
        footer={null}
        width="100%"
        centered
      >
        <Spin tip="Loading..." spinning={loading} className="w-100 h-100">
          <div
            style={{
              overflowY: 'auto',
              height: '80vh',
            }}
          >
            <ContentBasic match={data.match} display_admin={editValue.display_admin} page={page} />
          </div>
        </Spin>
      </DragableModal>
    </>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMOMatchEdit)
