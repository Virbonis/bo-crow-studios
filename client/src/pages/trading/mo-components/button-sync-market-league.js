import React from 'react'
import { connect } from 'react-redux'
import { Button, message, Modal, Select } from 'antd'
import actions from 'redux/auto-add-sub-match/actions'

const mapDispatchToProps = dispatch => ({
  UpdateSubMatchSyncMarket: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_AUTO_ADD_SUB_MATCH_SYNC_MARKET,
      payload,
      successCallback,
    })
  },
  UpdateSubMatchSyncLeague: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_AUTO_ADD_SUB_MATCH_SYNC_LEAGUE,
      payload,
      successCallback,
    })
  },
})

const ButtonSyncMarketLeague = React.memo(
  ({ UpdateSubMatchSyncMarket, UpdateSubMatchSyncLeague, tableRef, page, successCallback }) => {
    const [bookmarker, setBookmarker] = React.useState('')

    const onClickSyncMarket = () => {
      const { selectedRow } = tableRef.current
      if (!selectedRow) {
        message.warning('Please select 1 Record!')
        return
      }

      const { ArrMatch } = selectedRow

      Modal.confirm({
        title: 'Are you sure to sync market ?',
        content: '',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () =>
          UpdateSubMatchSyncMarket(
            {
              sport_id: ArrMatch.sport_id,
              match_id: ArrMatch.match_id,
              match_date: ArrMatch.match_date,
              league_id: ArrMatch.league_id,
              home_id: ArrMatch.home_id,
              away_id: ArrMatch.away_id,
              bookmarker_name: bookmarker,
            },
            successCallback,
          ),
      })
    }

    const onClickSyncLeague = () => {
      const { selectedRow } = tableRef.current
      if (!selectedRow) {
        message.warning('Please select 1 Record!')
        return
      }

      const { ArrMatch } = selectedRow
      const { popup_id, match_time_slot } = tableRef.current.viewParameter

      const payload = {
        match_id: ArrMatch.match_id,
        popup_id,
        match_time_slot: `MO-${match_time_slot}`,
        mo_page: 'MOAHOU',
        bookmarker_name: bookmarker,
      }

      Modal.confirm({
        title: 'Are you sure to sync league ?',
        content: '',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () =>
          UpdateSubMatchSyncLeague(payload, response => {
            callbackSyncLeague(response)
            successCallback()
          }),
      })

      function callbackSyncLeague({ status, data }) {
        if (!['MO5', 'MO5Euro', 'MOOS', 'MOTennis'].includes(page)) return
        if (status === -30) {
          const matchString = data
            .map(match_id => {
              const match = tableRef.current.data.find(
                x => x.ArrMatch.match_id === parseInt(match_id, 10),
              )
              return `- ${match_id} ${match.ArrMatch.home_name} vs ${match.ArrMatch.away_name}`
            })
            .join(', <br/>')
          const content = (
            <>
              {matchString}
              <br />
              do you still want to continue ?
            </>
          )
          Modal.confirm({
            title: `Sync Market for this match is disabled`,
            content,
            okText: 'Yes',
            cancelText: 'No',
            onOk: () =>
              UpdateSubMatchSyncLeague(
                {
                  ...payload,
                  confirm: true,
                },
                successCallback,
              ),
          })
        }
      }
    }

    return (
      <>
        <Select
          size="small"
          style={{ width: '100px' }}
          placeholder="Select Match Round"
          options={[
            { value: '', label: 'IBC' },
            { value: 'IBC', label: 'GLIVE IBC' },
            { value: 'SBO', label: 'GLIVE SBO' },
          ]}
          value={bookmarker}
          onChange={value => setBookmarker(value)}
        />
        <Button
          size="small"
          type="primary"
          onClick={onClickSyncMarket}
          className="font-weight-bold bg-dark"
        >
          Sync Market
        </Button>
        {page !== 'MOQuick' && (
          <Button
            size="small"
            type="primary"
            onClick={onClickSyncLeague}
            className="font-weight-bold bg-dark"
          >
            Sync League
          </Button>
        )}
      </>
    )
  },
)

export default connect(null, mapDispatchToProps)(ButtonSyncMarketLeague)
