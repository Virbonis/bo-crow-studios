import React from 'react'
import { connect } from 'react-redux'
import actionsMO from 'redux/mo5/actions'

const mapDispatchToProps = dispatch => ({
  SwapFavorite: (payload, successCallback) => {
    dispatch({
      type: actionsMO.SWAP_FAVOURITE,
      payload,
      successCallback,
    })
  },
})

const HomeAwayName = ({
  st_fav,
  handicap,
  name,
  neutral_ground,
  match_id,
  sub_match_id,
  direction,
  textOnly,
  successCallback,
  tableRef,
  SwapFavorite,
  noColor = false,
  noDirection = false,
  home_rc,
  away_rc,
  st_penalty,
}) => {
  let isChecked
  let red_card
  let penalty
  let favClass
  let classRadio
  let placement
  let suffixText = ''
  if (direction === 'H') {
    placement = 'right'
    isChecked = st_fav <= 0
    favClass = st_fav <= 0 && handicap * 1 !== 0 ? 'text-red' : 'text-blue'
    classRadio = 'radio_right'
    red_card = home_rc
    penalty = st_penalty === 'H'
    if (neutral_ground) {
      suffixText = neutral_ground === 'Y' ? ' (N)' : ''
    }
    name += suffixText
  } else if (direction === 'A') {
    placement = 'left'
    isChecked = st_fav > 0
    favClass = st_fav > 0 && handicap * 1 !== 0 ? 'text-red' : 'text-blue'
    classRadio = 'radio_left'
    red_card = away_rc
    penalty = st_penalty === 'A'
  }
  if (noDirection) classRadio = 'radio_none'
  if (noColor) favClass = ''

  if (textOnly)
    return (
      <div className={classRadio}>
        <TeamName name={name} favClass={favClass} placement={placement} />
        <span>
          <TagPenalty penalty={penalty} />
          <TagRedCard red_card={red_card} />
        </span>
      </div>
    )

  const popConfirm = () => {
    // eslint-disable-next-line
    if (confirm('Are you sure to SWAP FAVOURITE?')) {
      const { popup_id } = tableRef?.current.viewParameter || ''
      SwapFavorite({ match_id, sub_match_id, st_fav: st_fav * -1, popup_id }, successCallback)
    }
  }

  return (
    <>
      <div className={classRadio}>
        <input checked={isChecked} type="radio" onChange={popConfirm} />
        <TeamName name={name} favClass={favClass} placement={placement} />
        <span>
          <TagPenalty penalty={penalty} />
          <TagRedCard red_card={red_card} />
        </span>
      </div>
    </>
  )
}

const TeamName = ({ name, favClass, placement }) => {
  const textRef = React.useRef(null)
  const [showTooltip, setShowTooltip] = React.useState(false)

  React.useEffect(() => {
    const element = textRef.current
    setShowTooltip(element.scrollWidth > element.clientWidth)
  }, [name])

  return (
    <>
      <span className={`${favClass} home_away_text`} title={name} ref={textRef}>
        {name}
        {showTooltip && <span className={`tooltip_text ${placement}`}>{name}</span>}
      </span>
    </>
  )
}

const TagPenalty = ({ penalty }) => {
  return penalty && <span className="tag_penalty">PEN</span>
}
const TagRedCard = ({ red_card }) => {
  return red_card > 0 && <span className="tag_red_card">{red_card}</span>
}

export default connect(null, mapDispatchToProps)(HomeAwayName)
