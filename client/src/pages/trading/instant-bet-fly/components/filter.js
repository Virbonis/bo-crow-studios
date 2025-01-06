import React from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Col, Form, Input, Popover, Row, Select } from 'antd'
import actionsLeague from 'redux/league/actions'
import actionsMatch from 'redux/match/actions'
import { debounce } from 'lodash'
import { gameTypeForInstantBet } from 'helper'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { SelectMultipleAll } from 'components/blaise'

const mapStateToProps = ({ league, match }) => ({
  loadingLeague: league.loadingSearch,
  loadingMatch: match.loadingSearch,
})
const mapDispatchToProps = dispatch => ({
  LoadLeagueInstantBet: payload => {
    dispatch({
      type: actionsLeague.LOAD_SELECT_IN_INSTANTBET,
      payload,
      source: 'League',
    })
  },
  LoadMatchInstantBet: payload => {
    dispatch({
      type: actionsMatch.LOAD_SELECT_IN_INSTANTBET,
      payload,
      source: 'Match',
    })
  },
})

const Filter = ({
  loadingLeague,
  loadingMatch,
  viewParameter,
  setViewParameter,
  page,
  tableRef,
  LoadLeagueInstantBet,
  LoadMatchInstantBet,
}) => {
  const [form] = Form.useForm()
  const sport_id = Form.useWatch('sport_id', form)

  const {
    leagueInInstantBetOptions: leagueOptions,
    matchInInstantBetOptions: matchOptions,
    vipCodeOptions: vipOptions,
  } = useSelectOptions()
  let { branchOptions, currencyOptions, platformOptions } = useSelectOptions()
  branchOptions = [{ value: '', label: 'All Branch' }]
    .concat(branchOptions)
    .concat({ value: 'Non-M88S', label: 'Non-M88S' })
  platformOptions = [{ value: '', label: 'All Platform' }].concat(platformOptions)
  currencyOptions = [{ value: 'All', label: 'All Currency' }].concat(currencyOptions)
  const columnsTitle = tableRef.current?.columnsTitle || []

  React.useEffect(() => {
    LoadLeagueInstantBet({ sport_id: '-99' })
    LoadMatchInstantBet({ sport_id: '-99', league_ids: ['0'] })
  }, [LoadLeagueInstantBet, LoadMatchInstantBet])

  const onValuesChange = React.useCallback(
    debounce((changedValues, values) => {
      const keys = Object.keys(changedValues)
      if (keys.includes('sport_id')) {
        values.league_ids = ['0']
        values.match_ids = ['0']
        form.setFieldsValue({ league_ids: ['0'], match_ids: ['0'] })
        LoadLeagueInstantBet({ sport_id: values.sport_id })
      } else if (keys.includes('league_ids')) {
        values.match_ids = ['0']
        form.setFieldsValue({ match_ids: ['0'] })
        LoadMatchInstantBet({ sport_id: values.sport_id, league_ids: values.league_ids.join(',') })
      }
      setViewParameter(prev => ({ ...prev, ...values }))
    }, 750),
    [LoadLeagueInstantBet, LoadMatchInstantBet, form, setViewParameter],
  )

  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 12 }}
      wrapperCol={{ span: 12 }}
      labelAlign="left"
      labelWrap
      initialValues={viewParameter}
      onValuesChange={onValuesChange}
      className="d-flex flex-row flex-wrap"
      style={{ gap: 4 }}
    >
      <div className="d-flex flex-row flex-wrap" style={{ gap: 4 }}>
        <Form.Item name="interval" noStyle>
          <Select
            size="small"
            style={{ width: 75 }}
            options={[
              { value: 0, label: 'None' },
              { value: 3, label: '3' },
              { value: 5, label: '5' },
              { value: 10, label: '10' },
              { value: 15, label: '15' },
              { value: 30, label: '30' },
              { value: 60, label: '60' },
            ]}
          />
        </Form.Item>
        <Form.Item name="branch_id" noStyle>
          <Select
            style={{ width: 100 }}
            options={branchOptions}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item name="username" noStyle>
          <Input size="small" placeholder="Username" style={{ width: 150 }} />
        </Form.Item>
        <Form.Item name="display" noStyle>
          <Select
            size="small"
            style={{ width: 75 }}
            options={[
              { value: 99999999, label: 'All rec' },
              { value: 50, label: '50 rec' },
              { value: 100, label: '100 rec' },
              { value: 200, label: '200 rec' },
            ]}
          />
        </Form.Item>
        {page !== 'MOQuick' && (
          <Form.Item name="match_time_slot" noStyle>
            <Select
              size="small"
              style={{ width: 125 }}
              options={[
                { value: 'All', label: 'All Live Status' },
                { value: 'Live-Today', label: 'Live + Today' },
                { value: 'Live', label: 'Live' },
                { value: 'Today', label: 'Today' },
                { value: 'Early', label: 'Early' },
                { value: 'Today-Early', label: 'Today + Early' },
              ]}
            />
          </Form.Item>
        )}
        <Form.Item name="currency" noStyle>
          <Select
            size="small"
            style={{ width: 110 }}
            options={currencyOptions}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item name="sport_id" noStyle>
          <Select
            size="small"
            style={{ width: 150 }}
            options={[
              { value: -99, label: 'All Sport' },
              { value: 10, label: 'Soccer' },
              { value: 57, label: 'eSoccer' },
              { value: 998, label: 'Soccer + eSoccer' },
              { value: 12, label: 'Basketball' },
              { value: 120, label: 'OS inc Basketball' },
              { value: 0, label: 'OS exc Basketball' },
              { value: 58, label: 'eBasketball' },
              { value: -1, label: 'Mix Parlay' },
              { value: 77, label: 'Virtual Sport' },
            ]}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
        {page !== 'MOQuick' && (
          <>
            <Form.Item name="league_ids">
              <SelectMultipleAll
                placeholder="All League"
                disabled={sport_id === -1}
                options={leagueOptions}
                optionAll={{ value: '0', label: 'All League' }}
                isOptionAllSelectable
                style={{ width: 200 }}
                popupMatchSelectWidth={400}
                loading={loadingLeague}
              />
            </Form.Item>
            <Form.Item name="match_ids">
              <SelectMultipleAll
                placeholder="All Match"
                options={matchOptions}
                optionAll={{ value: '0', label: 'All Match' }}
                isOptionAllSelectable
                style={{ width: 200 }}
                popupMatchSelectWidth={400}
                loading={loadingMatch}
              />
            </Form.Item>
          </>
        )}
        <FilterOther vipOptions={vipOptions} platformOptions={platformOptions} form={form} />
        <FilterAmount />
        <FilterHide columnsTitle={columnsTitle} />
      </div>
    </Form>
  )
}

const FilterOther = ({ vipOptions, platformOptions, form }) => {
  const game_types = Form.useWatch('game_types', form)
  const content = (
    <>
      <Form.Item className="mb-0" name="play_sound" label="Sound" valuePropName="checked">
        <Checkbox />
      </Form.Item>
      <Form.Item className="m-0" name="vip_filter" label="VIP Bets">
        <SelectMultipleAll
          placeholder="VIP Bets"
          options={vipOptions}
          optionAll={{ value: '', label: 'All VIP' }}
          getPopupContainer={trigger => trigger.parentElement}
          isOptionAllSelectable
        />
      </Form.Item>
      <Form.Item
        className="mb-0"
        name="game_type_special"
        label="GT Special"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item className="mb-0" name="accept_pending" label="Accept/Pending">
        <Select
          size="small"
          options={[
            { value: '', label: 'All' },
            { value: '0', label: 'Pending' },
            { value: '1', label: 'Accept' },
          ]}
          getPopupContainer={trigger => trigger.parentElement}
        />
      </Form.Item>
      <Form.Item className="mb-0" name="ftht" label="FTHT">
        <Select
          size="small"
          options={[
            { value: 'FTHT', label: 'FT/HT' },
            { value: 'FT', label: 'FT' },
            { value: 'HT', label: 'HT' },
          ]}
          getPopupContainer={trigger => trigger.parentElement}
        />
      </Form.Item>
      <Form.Item className="mb-0" name="game_types" label="Game Type">
        <SelectMultipleAll
          placeholder="Select Game Types"
          options={getFilteredGameType(game_types)}
          optionAll={{ value: '-99', label: 'All Game Type' }}
          getPopupContainer={trigger => trigger.parentElement}
          popupMatchSelectWidth={300}
          isOptionAllSelectable
        />
      </Form.Item>
      <Form.Item className="mb-0" name="platform" label="Platform">
        <Select
          size="small"
          options={platformOptions}
          getPopupContainer={trigger => trigger.parentElement}
        />
      </Form.Item>
      <Form.Item className="mb-0" name="new_member" label="New Member" valuePropName="checked">
        <Checkbox />
      </Form.Item>
    </>
  )

  return (
    <Popover
      placement="bottomLeft"
      trigger={['click']}
      content={content}
      overlayInnerStyle={{ width: 300 }}
    >
      <Button size="small" type="default">
        Filter
      </Button>
    </Popover>
  )
}
const FilterAmount = () => {
  const content = (
    <>
      <Form.Item name="bet_amount" label="AMT >=" className="mb-0">
        <Select
          size="small"
          options={[
            { value: 0, label: '0' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 500, label: '500' },
            { value: 1000, label: '1k' },
            { value: 3000, label: '3k' },
            { value: 5000, label: '5k' },
            { value: 10000, label: '10k' },
            { value: 20000, label: '20k' },
            { value: 50000, label: '50k' },
            { value: 100000, label: '100k' },
          ]}
          getPopupContainer={trigger => trigger.parentElement}
        />
      </Form.Item>
      {/* <Form.Item name="bet_amount_comp" label="C.Amt Alert >=" className="mb-0">
        <Select
          size="small"
          options={[
            { value: 0, label: '0' },
            { value: 10000, label: '10k' },
            { value: 20000, label: '20k' },
            { value: 30000, label: '30k' },
          ]}
          getPopupContainer={trigger => trigger.parentElement}
        />
      </Form.Item> */}
      <Form.Item name="max_payout" label="Max Payout >=" className="mb-0">
        <Select
          size="small"
          options={[
            { value: 0, label: '0' },
            { value: 20, label: '20' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 250, label: '250' },
            { value: 500, label: '500' },
            { value: 1000, label: '1k' },
            { value: 5000, label: '5k' },
            { value: 10000, label: '10k' },
            { value: 20000, label: '20k' },
            { value: 50000, label: '50k' },
            { value: 100000, label: '100k' },
            { value: 150000, label: '150k' },
            { value: 200000, label: '200k' },
          ]}
          getPopupContainer={trigger => trigger.parentElement}
        />
      </Form.Item>
      <Form.Item name="max_bet" label="Max Bet" className="mb-0">
        <Select
          size="small"
          options={[
            { value: 0, label: 'All' },
            { value: 6000, label: '60 >=' },
            { value: 5999, label: '60 <' },
          ]}
          getPopupContainer={trigger => trigger.parentElement}
        />
      </Form.Item>
    </>
  )

  return (
    <Popover
      placement="bottomLeft"
      trigger={['click']}
      content={content}
      overlayInnerStyle={{ width: 200 }}
    >
      <Button>AMT</Button>
    </Popover>
  )
}
const FilterHide = ({ columnsTitle }) => {
  const content = (
    <Form.Item name="shown_columns" noStyle>
      <Checkbox.Group>
        <Row>
          {columnsTitle.map((label, index) => (
            <Col span={8} key={label}>
              <Checkbox value={index}>{label}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </Form.Item>
  )
  return (
    <Popover
      placement="bottomLeft"
      trigger={['click']}
      content={content}
      overlayInnerStyle={{ width: 300 }}
    >
      <Button>Hide</Button>
    </Popover>
  )
}

const getFilteredGameType = (currGameTypes = []) => {
  const isExist = currGameTypes.some(e => ['-3', '-2', '-1'].includes(e))
  if (isExist) {
    return gameTypeForInstantBet.map(e => ({
      ...e,
      disabled: !['-99', ...currGameTypes].includes(e.value),
    }))
  }
  if (!isExist && currGameTypes.length > 0 && !currGameTypes.includes('-99')) {
    return gameTypeForInstantBet.map(e => ({
      ...e,
      disabled: ['-3', '-2', '-1'].includes(e.value),
    }))
  }
  return gameTypeForInstantBet
}
export default connect(mapStateToProps, mapDispatchToProps)(Filter)
