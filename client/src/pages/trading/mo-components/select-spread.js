import React from 'react'
import { Select } from 'antd'
import { spreadOptions } from 'helper'
import { usePopupID } from 'components/blaise/custom/wrapperPopup'
import { connect } from 'react-redux'
import actionsMO from 'redux/mo5/actions'

const mapDispatchToProps = dispatch => ({
  ChangeSpread: (payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_SPREAD,
      payload,
      successCallback,
    })
  },
})

const SelectSpread = ({
  match_id,
  sub_match_id,
  spread,
  textOnly,
  ChangeSpread,
  successCallback,
}) => {
  const [visible, setVisible] = React.useState(false)
  const popup_id = usePopupID()
  if (textOnly) return spread

  const onClickHandler = () => setVisible(true)
  const onChangeSpread = value =>
    ChangeSpread(
      {
        match_id,
        sub_match_id,
        spread: parseFloat(value),
        popup_id,
      },
      successCallback,
    )

  return (
    <div className="w-100 h-100">
      {!visible && (
        <span
          className="w-100 font-weight-bold"
          onClick={onClickHandler}
          onKeyUp={onClickHandler}
          role="button"
          tabIndex={0}
        >
          {spread}
        </span>
      )}
      {visible && (
        <Select
          className="w-100 mo_select"
          variant="borderless"
          suffixIcon={null}
          showSearch
          // filterOption={(input, option) => option?.value.toString().includes(input.toString())}
          open={visible}
          onDropdownVisibleChange={open => !open && setVisible(open)}
          value={spread}
          onChange={onChangeSpread}
          autoFocus={visible}
          options={spreadOptions}
        />
      )}
    </div>
  )
}

/**
 * @param {int} match_id
 * @param {int} sub_match_id
 * @param {int} spread
 * @param {function} successCallback
 */
export default connect(null, mapDispatchToProps)(SelectSpread)
