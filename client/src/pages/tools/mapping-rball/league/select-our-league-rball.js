import React from 'react'
import { connect } from 'react-redux'
import { Select, Spin } from 'antd'
import { debounce } from 'lodash'
import { LoadLeagueMappingLeagueRBall } from 'services/league'

const mapStateToProps = ({ profile }) => ({
  profileID: profile.select[0]?.profile_id,
})

// local hooks for fetching options
const useOptions = () => {
  const [loading, setLoading] = React.useState(false)
  const [leagueSearchOptions, setLeagueSearchOptions] = React.useState([])

  const LoadSearchLeague = React.useCallback(payload => {
    setLoading(true)
    setLeagueSearchOptions([])
    LoadLeagueMappingLeagueRBall(payload).then(res => {
      setLoading(false)
      setLeagueSearchOptions(
        res.data.map(data => ({
          value: data.our_league,
          label: data.our_league,
        })),
      )
    })
  }, [])
  const CleanUp = React.useCallback(() => {
    setLoading(false)
    setLeagueSearchOptions([])
  }, [])

  return [loading, leagueSearchOptions, LoadSearchLeague, CleanUp]
}

const SelectOurLeagueRBall = ({ profileID, CreateLeague, sportIDSubmitValueRef, ...restProps }) => {
  const [loading, leagueSearchOptions, LoadSearchLeague, CleanUp] = useOptions()

  const onSearch = debounce(search => {
    if (search.length > 0) {
      LoadSearchLeague({
        sport_id: sportIDSubmitValueRef.current,
        league_name: search,
      })
    }
  }, 500)
  const onDropdownVisibleChange = open => {
    if (!open) CleanUp()
  }

  return (
    <Select
      showSearch
      className="w-100"
      options={leagueSearchOptions}
      filterOption={false}
      placeholder="Search League"
      dropdownRender={menu => {
        return (
          <>
            {loading ? (
              <div align="center">
                <Spin />
              </div>
            ) : (
              menu
            )}
          </>
        )
      }}
      allowClear
      onSearch={onSearch}
      onDropdownVisibleChange={onDropdownVisibleChange}
      {...restProps}
    />
  )
}

export default connect(mapStateToProps, null)(SelectOurLeagueRBall)
