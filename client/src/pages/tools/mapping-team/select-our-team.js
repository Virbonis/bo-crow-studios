import React from 'react'
import { connect } from 'react-redux'
import { Select, Divider, Input, Button, Spin } from 'antd'
import { debounce } from 'lodash'
import teamActions from 'redux/team/actions'
import { PlusOutlined } from '@ant-design/icons'
import { LoadTeamMappingTeam } from 'services/team'

const mapStateToProps = ({ profile }) => ({
  profileID: profile.select[0]?.profile_id,
})
const mapDispatchToProps = dispatch => ({
  CreateTeam: (payload, successCallback) => {
    dispatch({
      type: teamActions.CREATE,
      payload,
      successCallback,
      source: 'Mapping Team',
    })
  },
})

// local hooks for fetching options
const useOptions = () => {
  const [loading, setLoading] = React.useState(false)
  const [teamSearchOptions, setTeamSearchOptions] = React.useState([])

  const LoadSearchTeam = React.useCallback(payload => {
    setLoading(true)
    setTeamSearchOptions([])
    LoadTeamMappingTeam(payload).then(res => {
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

const SelectOurTeam = ({
  profileID,
  CreateTeam,
  sportIDSubmitValueRef,
  oldValue,
  ...restProps
}) => {
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
  const onCreate = newTeam => {
    CreateTeam(
      {
        sport_id: sportIDSubmitValueRef.current,
        active: 'Y',
        short_name: newTeam,
        team_name_en: newTeam,
        team_name_cn: newTeam,
        team_name_tw: newTeam,
        team_name_th: newTeam,
        team_name_jp: newTeam,
        team_name_kr: newTeam,
        team_name_vn: newTeam,
        team_name_id: newTeam,
      },
      () => onSearch(newTeam),
    )
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
            <Divider className="my-2" />
            <CustomInput onCreate={onCreate} defaultValue={restProps.value} />
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

const CustomInput = ({ defaultValue, onCreate }) => {
  const [value, setValue] = React.useState(defaultValue)
  React.useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Input
      value={value}
      placeholder="Input New Team"
      defaultValue={defaultValue}
      onChange={e => setValue(e.target.value)}
      suffix={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => onCreate(value)}>
          Add New Team
        </Button>
      }
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectOurTeam)
