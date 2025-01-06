import { Descriptions, Spin } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/bet-enquiry/actions'
import { gameTypeDescription } from 'helper'
import TableResult from './table-result'

const mapStateToProps = ({ betEnquiry }) => ({
  loading: betEnquiry.loadingPopUpData,
  lottery_id: betEnquiry.popUpDataResult[0]?.lottery_id,
  jackpot_id: betEnquiry.popUpDataResult[0]?.jackpot_id,
  tableData: betEnquiry.popUpDataResult,
  tableDataBetBuilder: betEnquiry.popUpDataBetResultBuilder,
})

const mapDispatchToProps = dispatch => ({
  LoadResult: payload => {
    dispatch({
      type: actions.LOAD_TABLE_RESULT,
      payload,
      source: 'Bet Enquiry',
    })
  },
  CleanResult: () => dispatch({ type: actions.CLEAN_UP_RESULT }),
})

const BetEnquiryPopUpResult = ({
  bet_id,
  game_type,
  outright_team_winner,
  // hist,
  loading,
  jackpot_id,
  lottery_id,
  tableData,
  tableDataBetBuilder,
  LoadResult,
  CleanResult,
}) => {
  React.useEffect(() => CleanResult, [CleanResult])

  React.useEffect(() => {
    // only load if not outright
    if (game_type !== 11) LoadResult({ bet_id, game_type })
    // if (game_type !== 11) LoadResult({ bet_id, game_type, hist_or_post: hist ? '_Hist' : '_Post' })
  }, [LoadResult, bet_id, game_type])

  const showLottery = game_type === 4000
  return (
    <Spin spinning={loading}>
      <Descriptions size="small" column={1} className="font-weight-bold">
        <Descriptions.Item label="Bet ID">{bet_id}</Descriptions.Item>
        <Descriptions.Item label="Game Type">
          {gameTypeDescription[game_type]?.long}
        </Descriptions.Item>
        {showLottery && (
          <>
            <Descriptions.Item label="Lottery ID">{lottery_id}</Descriptions.Item>
            <Descriptions.Item label="Jackpot ID">{jackpot_id}</Descriptions.Item>
          </>
        )}
      </Descriptions>
      <TableResult
        game_type={game_type}
        outright_team_winner={outright_team_winner}
        tableData={tableData}
        tableDataBetBuilder={tableDataBetBuilder}
      />
    </Spin>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BetEnquiryPopUpResult)
