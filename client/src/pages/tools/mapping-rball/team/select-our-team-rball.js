import React from 'react'
import { connect } from 'react-redux'
import { Select, Spin } from 'antd'
import { debounce } from 'lodash'
import { LoadTeamMappingTeamRB } from 'services/team'

const mapStateToProps = ({ profile }) => ({
  profileID: profile.select[0]?.profile_id,
})

// local hooks for fetching options
const useOptions = () => {
  const [loading, setLoading] = React.useState(false)
  const [teamSearchOptions, setTeamSearchOptions] = React.useState([])

  const LoadSearchTeam = React.useCallback(payload => {
    setLoading(true)
    setTeamSearchOptions([])
    LoadTeamMappingTeamRB(payload).then(res => {
      setLoading(false)
      setTeamSearchOptions(
        res.data.map(data => ({
          value: data.our_team,
          label: data.our_team,
        })),
      )
    })
  }, [])
  const CleanUp = React.useCallback(() => {
    setLoading(false)
    setTeamSearchOptions([])
  }, [])

  return [loading, teamSearchOptions, LoadSearchTeam, CleanUp]
}

const SelectOurTeamRBall = ({ profileID, CreateTeam, sportIDSubmitValueRef, ...restProps }) => {
  const [loading, teamSearchOptions, LoadSearchTeam, CleanUp] = useOptions()

  const onSearch = debounce(search => {
    if (search.length > 0) {
      LoadSearchTeam({
        sport_id: sportIDSubmitValueRef.current,
        team_name: search,
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
      options={teamSearchOptions}
      filterOption={false}
      placeholder="Search Team"
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

export default connect(mapStateToProps, null)(SelectOurTeamRBall)
