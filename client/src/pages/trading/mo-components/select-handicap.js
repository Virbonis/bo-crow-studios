import React from 'react'
import { message, Select } from 'antd'
import actionsMO from 'redux/mo5/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = dispatch => ({
  ChangeHandicap: (payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_HANDICAP,
      payload,
      successCallback,
    })
  },
})

const array = []
const convertToText = i => {
  let optionText = i
  const floor = Math.floor(i)
  if (i - floor === 0.25) {
    optionText = `${floor}/${i + 0.25}`
  } else if (i - floor === 0.75) {
    optionText = `${i - 0.25}/${i + 0.25}`
  }
  return optionText
}
const generateHDC = until => {
  const options = []
  for (let i = 0; i < until; i += 0.25) {
    const optionText = convertToText(i)
    array[optionText] = i
    options.push({ value: i, label: optionText, className: 'px-0' })
  }
  return options
}

const optionsHDP = generateHDC(100)
const optionsOU = generateHDC(600)

const SelectHandicap = ({
  match_id,
  sub_match_id,
  handicap,
  total_score,
  gt,
  tableRef,
  textOnly,
  successCallback,
  ChangeHandicap,
}) => {
  const [visible, setVisible] = React.useState(false)
  if (textOnly) return handicap

  const onChangeHandicap = value => {
    const nextHandicap = parseFloat(value)
    let minHDPOU = 0
    let isValidHDP = true
    // Validasi hanya utk hdp OU
    if (gt === 'OU') {
      minHDPOU = total_score + 0.5
      isValidHDP = nextHandicap >= minHDPOU
    }

    if (isValidHDP) {
      const { popup_id } = tableRef.current.viewParameter
      ChangeHandicap(
        {
          match_id,
          sub_match_id,
          handicap: nextHandicap,
          popup_id,
        },
        successCallback,
      )
    } else message.warning(`Handicap can't be less than ${minHDPOU}`)
  }

  const onClickHandler = () => setVisible(true)
  const options = gt === 'HDP' ? optionsHDP : optionsOU
  const handicapValue = options.find(e => e.value === handicap).label

  return (
    <div className="w-100 h-100">
      {!visible && (
        <span
          className="w-100"
          onClick={onClickHandler}
          onKeyUp={onClickHandler}
          role="button"
          tabIndex={0}
        >
          {handicapValue}
        </span>
      )}
      {visible && (
        <Select
          className="w-100 mo_select"
          variant="borderless"
          suffixIcon={null}
          showSearch
          filterOption={(input, option) => option?.value.toString().includes(input.toString())}
          open={visible}
          onDropdownVisibleChange={open => !open && setVisible(open)}
          value={handicap}
          onChange={onChangeHandicap}
          autoFocus={visible}
          options={options}
        />
      )}
    </div>
  )
}

export default connect(null, mapDispatchToProps)(SelectHandicap)
