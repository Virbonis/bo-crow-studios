import React from 'react'
import { connect } from 'react-redux'
import { Button, Select, Space } from 'antd'
import actions from 'redux/match/actions'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'

const mapStateToProps = ({ match }) => {
  const matches = match.select_in_mo
  if (matches.length > 0)
    return {
      matchOptions: match.select_in_mo.map(x => ({
        value: x.match_id,
        label: `${x.home_name} - ${x.away_name}`,
      })),
      defaultMatchId: matches[0].match_id,
    }
  return {
    matchOptions: [{ value: -1, label: 'There is no live match' }],
    defaultMatchId: -1,
  }
}
const mapDispatchToProps = dispatch => ({
  LoadMatchSelection: payload => {
    dispatch({
      type: actions.LOAD_SELECT_IN_MO,
      payload,
    })
  },
})

const DivOptions = ({
  viewParameter,
  setViewParameter,
  matchOptions,
  defaultMatchId,
  LoadMatchSelection,
}) => {
  const { popup_id, match_time_slot } = viewParameter
  const [visibleDrawer, setVisibleDrawer] = React.useState()
  const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

  const onSubmit = React.useCallback(() => {
    LoadMatchSelection({ popup_id })
  }, [LoadMatchSelection, popup_id])
  React.useEffect(() => {
    onSubmit()
  }, [popup_id, onSubmit])

  React.useEffect(() => {
    setViewParameter(prev => ({ ...prev, match_id: defaultMatchId }))
  }, [defaultMatchId, setViewParameter])

  return (
    <Space>
      <Button className="w-100" size="small" onClick={() => setVisibleDrawer(`league Y`)}>
        Select League OS
      </Button>
      <Button className="w-100" size="small" onClick={() => setVisibleDrawer(`league N`)}>
        Select League
      </Button>
      <Button className="w-100" size="small" onClick={() => setVisibleDrawer(`match`)}>
        Select Match
      </Button>
      <Select
        style={{ width: 400 }}
        placeholder="There is no live match"
        size="small"
        value={viewParameter.match_id}
        options={matchOptions}
        onChange={value => setViewParameter(prev => ({ ...prev, match_id: value }))}
      />
      <DrawerSelectLeague
        os={visibleDrawer?.split(' ')[1]}
        open={visibleDrawer?.split(' ')[0] === 'league'}
        closeDrawer={closeDrawer}
        group={`MO-${match_time_slot}`}
        popup_id={popup_id}
        setViewParameter={setViewParameter}
        callbackSubmit={() => {
          onSubmit()
          setViewParameter(prev => ({ ...prev, isLeagueOS: visibleDrawer?.split(' ')[1] }))
        }}
      />
      <DrawerSelectMatch
        open={visibleDrawer === 'match'}
        closeDrawer={closeDrawer}
        group={`MO-${match_time_slot}`}
        popup_id={popup_id}
        callbackSubmit={onSubmit}
      />
    </Space>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DivOptions)
