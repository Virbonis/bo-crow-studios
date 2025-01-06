import React from 'react'
import { connect } from 'react-redux'
import { Select, Typography } from 'antd'
import actions from 'redux/mo5/actions'
import { ldiffEuroOptions, ldiffOEOptions } from 'helper'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  ChangeLDiff: payload => {
    dispatch({
      type: actions.CHANGE_LDIFF,
      payload,
      successCallback,
    })
  },
})

const SelectLDiff = React.memo(({ ChangeLDiff, match_id, sub_match_id, ldiff, enabled, gt }) => {
  const [visible, setVisible] = React.useState(false)

  const onClickHandler = () => setVisible(true)

  if (!enabled) return <Typography.Text className="text-blue">{ldiff}</Typography.Text>

  const ldiffOptions = gt === 'OE' ? ldiffOEOptions : ldiffEuroOptions
  const onChangeLDiff = value => {
    ChangeLDiff({
      match_id,
      sub_match_id,
      ldiff: parseFloat(value),
    })
  }

  return (
    <>
      <span
        className="w-100"
        onClick={onClickHandler}
        onKeyPress={onClickHandler}
        role="button"
        tabIndex={0}
      >
        {ldiff}
      </span>

      {visible && (
        <Select
          onChange={onChangeLDiff}
          size="small"
          className="w-100"
          suffixIcon={null}
          options={ldiffOptions}
          open={visible}
          style={{ position: 'absolute', left: 0 }}
          // onMouseEnter={() => setVisible(true)}
          onDropdownVisibleChange={open => !open && setVisible(open)}
        />
      )}
    </>
  )
})

export default connect(null, mapDispatchToProps)(SelectLDiff)
