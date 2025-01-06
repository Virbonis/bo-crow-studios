import React from 'react'
// import { Table } from 'antd'
import {
  Amount,
  // CustomizeCell,
  HDPColumn,
  VIPUsername,
  TextHomeFav,
  TextAwayFav,
  GameTypeColumn,
} from 'components/blaise'
import { connect } from 'react-redux'
import authEnum from 'authorize'
import { getPlatform, listGT } from 'helper'
import { isEqual } from 'lodash'
import { TableMO } from 'pages/trading/mo-components'
import CheckboxACRJ from './checkbox-acrj'
import SelectedContext from '../context'

const mapStateToProps = ({ auth }) => ({
  allowedVoidOutstandingTickets: auth.user.user_auth_ids.includes(
    authEnum.ALLOWED_TO_VOID_OUTSTANDING_TICKETS,
  ),
})
const TableInstantBet = React.memo(
  React.forwardRef(({ data, viewParameter, allowedVoidOutstandingTickets }, ref) => {
    const { shown_columns } = viewParameter

    const [voidTicketIDs, setVoidTicketIDs] = React.useState([])
    React.useImperativeHandle(ref, () => ({
      columnsTitle: columns.map(x => x.title),
      data,
      voidTicketIDs,
      resetVoidTicketIDs: () => setVoidTicketIDs([]),
    }))

    const columns = React.useMemo(
      () => [
        {
          title: 'SSMA',
          dataIndex: 'ssma',
          width: 55,
        },
        {
          title: 'Username',
          dataIndex: 'username',
          render: (text, record) => <VIPUsername {...record} />,
          width: 125,
          // ellipsis: true,
        },
        {
          title: 'Branch',
          width: 60,
          render: ({ branch_alias, branchColorClass }) => {
            // if (comp_type !== 'H' && comp_type !== 'B')
            //   return <Typography.Text className="text-blue">{branch_alias}</Typography.Text>
            // return branch_alias
            return <span className={branchColorClass}>{branch_alias}</span>
          },
        },
        { title: 'League', dataIndex: 'league_name', width: 150, ellipsis: true },
        {
          title: 'DS',
          render: ({ statusBet }) => {
            // const result = getStatusAcRj(status, void_id, early_counter, ev_round)
            if (['RC', 'RG', 'RP', 'Rj', 'CR'].includes(statusBet))
              return <span className="text-danger">{statusBet}</span>
            return statusBet
          },
          width: 35,
          align: 'center',
        },
        {
          title: 'Home',
          render: record => <TextHomeFav {...record} />,
          width: 135,
          ellipsis: true,
        },
        {
          title: 'Away',
          render: record => <TextAwayFav {...record} />,
          width: 135,
          ellipsis: true,
        },
        {
          title: 'Type',
          align: 'center',
          render: record => <GameTypeColumn {...record} />,
          width: 50,
        },
        {
          title: 'Score',
          align: 'center',
          render: ({ st_live, home_posisi, away_posisi }) => {
            if (st_live === 'Y') return `${home_posisi} - ${away_posisi}`
            return null
          },
          width: 50,
        },
        // getHandicapColumn(row["GameType"].ToString(), row["Handicap"].ToString(), row["BetCode"].ToString()));
        {
          title: 'Hdp',
          align: 'center',
          render: record => <HDPColumn {...record} bet_fav_status={record.st_fav} />,
          width: 50,
        },
        {
          title: 'Odds',
          dataIndex: 'odds',
          align: 'center',
          render: text => <Amount value={text} />,
          width: 50,
        },
        {
          title: 'Curr',
          align: 'center',
          dataIndex: 'currency',
          width: 50,
        },
        {
          title: 'C.Amt',
          dataIndex: 'bet_amount_comp',
          render: (text, { vip_code }) => {
            if (vip_code.split('^').includes('13')) return null
            return <Amount value={text} int />
          },
          width: 50,
          align: 'right',
        },
        {
          title: 'Amt',
          dataIndex: 'bet_amount',
          render: (text, { vip_code }) => {
            if (vip_code.split('^').includes('13')) return null
            return <Amount value={text} int className="font-weight-bold text-magenta" />
          },
          width: 65,
          align: 'right',
        },
        {
          title: 'Payout',
          dataIndex: 'win',
          render: (text, { vip_code }) => {
            if (vip_code.split('^').includes('13')) return null
            return <Amount value={text} int className="font-weight-bold text-magenta" />
          },
          width: 50,
          align: 'right',
        },
        {
          title: 'Date/Time',
          dataIndex: 'bet_date',
          render: text => text.formatDateTimeSecond(),
          width: 120,
        },
        {
          title: 'AcRj Date',
          dataIndex: 'acrj_date',
          render: text => text && text.formatDateTimeSecond(),
          width: 120,
        },
        { title: 'PT(s)', dataIndex: 'pending_times', width: 50, align: 'center' },
        {
          title: 'Bet ID',
          align: 'center',
          render: ({ bet_id, p_bet_id }) => (
            <>
              {bet_id} <br />
              {p_bet_id}
            </>
          ),
          width: 80,
        },
        { title: 'IP', dataIndex: 'ip', width: 90, align: 'center' },
        { title: 'Ctry', dataIndex: 'country', width: 50, align: 'center' },
        { title: 'Profile', dataIndex: 'limit_profile_id', width: 100 },
        {
          title: 'Platform',
          dataIndex: 'txn_type',
          render: text => getPlatform(text),
          width: 65,
          align: 'center',
        },
        { title: 'Stamp User', dataIndex: 'stamp_user', width: 100, align: 'center' },
        ...(allowedVoidOutstandingTickets
          ? [
              {
                title: 'AcRj',
                align: 'center',
                width: 50,
                render: ({ status_ticket, game_type, is_parlay_live, id }) => {
                  return (
                    getTicketVisibility(status_ticket, game_type, is_parlay_live) && (
                      <CheckboxACRJ id={id} />
                      // <input
                      //   type="checkbox"
                      //   onChange={e => {
                      //     const { checked } = e.target
                      //     if (checked) setVoidTicketIDs(prev => [...prev, bet_id])
                      //     else setVoidTicketIDs(prev => prev.filter(id => id !== bet_id))
                      //     // ticket="BetIDxMatchID^BetID^GameTypeID^StatusTicket^MatchID"
                      //   }}
                      // />
                    )
                  )
                },
              },
            ]
          : []),
      ],
      [allowedVoidOutstandingTickets],
    )
    const filteredColumns = React.useMemo(() => {
      return columns.filter((x, index) => shown_columns.includes(index))
    }, [columns, shown_columns])
    return (
      <SelectedContext.Provider value={[voidTicketIDs, setVoidTicketIDs]}>
        <TableMO
          tableRef={ref}
          rowKey="id"
          columns={filteredColumns}
          dataSource={data}
          onRow={onRow}
          lastRowElementRef={null}
        />
      </SelectedContext.Provider>
    )
    // return (
    //   <Table
    //     id="table-trading"
    //     size="small"
    //     bordered
    //     rowKey="id"
    //     columns={filteredColumns}
    //     dataSource={data}
    //     pagination={false}
    //     components={{
    //       body: {
    //         cell: CustomizeCell,
    //       },
    //     }}
    //     scroll={{
    //       x: '100%',
    //       y: true,
    //     }}
    //     rowClassName={rowClassName}
    //   />
    // )
  }),
  (prev, next) =>
    isEqual(prev.data, next.data) &&
    isEqual(prev.viewParameter.shown_columns, next.viewParameter.shown_columns),
)

const getTicketVisibility = (status_ticket, game_type, is_parlay_live) => {
  if (game_type === -1 && is_parlay_live === 1 && status_ticket === 0) return true
  if (status_ticket === 1 || status_ticket === 2) return false
  return true
}

const rowClassName = (record, index) => {
  const { is_long_pending, game_type, statusBet } = record
  if (is_long_pending > 0) return 'pending_long'
  if (statusBet === '[P]') {
    if (listGT['1X2'].includes(game_type)) return 'pending_1x2'
    if (listGT.Handicap.includes(game_type)) return 'pending_hdp'
    if (listGT.OverUnder.includes(game_type)) return 'pending_ou'
    return 'pending_hdp'
  }
  if (['', 'E', 'A', 'HT', 'B'].includes(statusBet)) {
    if (index % 2 === 1) return null
    return 'speedy'
  }
  return 'reject'
}
const onRow = (record, index) => ({
  className: rowClassName(record, index),
})

export default connect(mapStateToProps, null, null, { forwardRef: true })(TableInstantBet)
