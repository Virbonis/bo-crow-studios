import React from 'react'
import { connect } from 'react-redux'
import { Select, Divider, Input, Button, Spin } from 'antd'
import { debounce } from 'lodash'
import leagueActions from 'redux/league/actions'
import { PlusOutlined } from '@ant-design/icons'
import { LoadLeagueMappingLeague } from 'services/league'

const mapStateToProps = ({ profile }) => ({
  profileID: profile.select[0]?.profile_id,
})
const mapDispatchToProps = dispatch => ({
  CreateLeague: (payload, successCallback) => {
    dispatch({
      type: leagueActions.CREATE,
      payload,
      successCallback,
      source: 'Mapping League',
    })
  },
})

// local hooks for fetching options
const useOptions = () => {
  const [loading, setLoading] = React.useState(false)
  const [leagueSearchOptions, setLeagueSearchOptions] = React.useState([])

  const LoadSearchLeague = React.useCallback(payload => {
    setLoading(true)
    setLeagueSearchOptions([])
    LoadLeagueMappingLeague(payload).then(res => {
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

const SelectOurLeague = ({
  profileID,
  CreateLeague,
  sportIDSubmitValueRef,
  oldValue,
  ...restProps
}) => {
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
  const onCreate = newLeague => {
    CreateLeague(
      {
        sport_id: sportIDSubmitValueRef.current,
        league_sequence: 0,
        price_group: 90,
        category: '0',
        active: 'Y',
        profile_id: profileID,
        competition: '',
        short_name: newLeague,
        league_name_en: newLeague,
        league_name_cn: newLeague,
        league_name_tw: newLeague,
        league_name_th: newLeague,
        league_name_jp: newLeague,
        league_name_kr: newLeague,
        league_name_vn: newLeague,
        league_name_id: newLeague,
      },
      () => onSearch(newLeague),
    )
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
      placeholder="Input New League"
      defaultValue={defaultValue}
      value={value}
      onChange={e => setValue(e.target.value)}
      suffix={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => onCreate(value)}>
          Add New League
        </Button>
      }
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectOurLeague)
