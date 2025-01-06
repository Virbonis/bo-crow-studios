import React from 'react'
import { connect } from 'react-redux'
import { Popover, Space, Table } from 'antd'
import actions from 'redux/user-team-matches/actions'
import { CustomizeCell } from 'components/blaise'
//
const mapStateToProps = ({ userTeamMatches }, ownProps) => ({
  loading: userTeamMatches[`loadingData_${ownProps.match_time_slot}`],
  data: userTeamMatches[`data_${ownProps.match_time_slot}`] || [],
})
const mapDispatchToProps = dispatch => ({
  LoadMatches: payload => {
    dispatch({
      type: actions.LOAD_MATCH,
      payload,
      source: 'User Team Matches',
    })
  },
  CleanExtraTable: payload => dispatch({ type: actions.CLEAN_UP_MATCH, payload }),
})

const TableMatch = ({
  user_team_id,
  match_time_slot,

  loading,
  data,
  expanded,
  LoadMatches,
  CleanExtraTable,
}) => {
  React.useEffect(() => {
    LoadMatches({
      user_team_id,
      match_time_slot,
    })
    return () => CleanExtraTable(match_time_slot)
  }, [expanded, user_team_id, match_time_slot, LoadMatches, CleanExtraTable])

  // prevent re-render
  const columns = React.useMemo(() => {
    const colorMatch = getColorMatchTimeSlot(match_time_slot)
    return [
      {
        title: 'No',
        width: 35,
        align: 'center',
        render: (text, record, index) => index + 1,
        onCell: () => ({ style: colorMatch }),
      },
      { title: 'Sport', dataIndex: 'sport_name', width: 100, align: 'center' },
      {
        title: match_time_slot !== 'Outright' ? 'Match Date' : 'Outright Date',
        width: 140,
        render: record => (
          <Space>
            <span>{record.match_date}</span>
            <div className={getIconMatchTimeSlot(record.match_time_slot)} />
          </Space>
        ),
      },
      { title: 'League Name', dataIndex: 'league_name' },
      ...(match_time_slot === 'Outright'
        ? []
        : [
            {
              title: 'Home Away',
              render: ({ home_name, away_name, provider_name }) => (
                <div className="d-flex justify-content-between">
                  <span>
                    {home_name} - {away_name}
                  </span>
                  {provider_name && (
                    <Popover content={provider_name}>
                      <div className="icon_provider" />
                    </Popover>
                  )}
                </div>
              ),
            },
          ]),
      {
        title: 'Open',
        dataIndex: 'open_status',
        align: 'center',
        width: 70,
        render: text => {
          if (text === 'Y') return <span>Open</span>
          return <span className="text-red">Close</span>
        },
      },
      {
        title: 'Dead Ball',
        width: 150,
        children: [
          {
            title: 'HT',
            dataIndex: 'trader_dbht',
            align: 'center',
            width: 80,
            onCell: ({ db_htft }) => {
              const bgcolor = getDBRBColor(db_htft)
              return {
                className: bgcolor[0],
              }
            },
          },
          {
            title: 'FT',
            dataIndex: 'trader_dbft',
            align: 'center',
            width: 80,
            onCell: ({ db_htft }) => {
              const bgcolor = getDBRBColor(db_htft)
              return {
                className: bgcolor[1],
              }
            },
          },
        ],
      },
      {
        title: 'Running Ball',
        width: 150,
        children: [
          {
            title: 'HT',
            dataIndex: 'trader_rbht',
            align: 'center',
            width: 80,
            onCell: ({ rb_htft }) => {
              const bgcolor = getDBRBColor(rb_htft)
              return {
                className: bgcolor[0],
              }
            },
          },
          {
            title: 'FT',
            dataIndex: 'trader_rbft',
            align: 'center',
            width: 80,
            onCell: ({ rb_htft }) => {
              const bgcolor = getDBRBColor(rb_htft)
              return {
                className: bgcolor[1],
              }
            },
          },
        ],
      },
    ]
  }, [match_time_slot])

  return (
    <Table
      bordered
      rowKey="match_id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      components={{
        body: {
          cell: CustomizeCell,
        },
      }}
      scroll={{ y: 350 }}
      onRow={(record, rowIndex) => {
        // if the row is the last index of sport name then give border bottom
        if (data[rowIndex + 1]?.sport_name !== record.sport_name)
          return {
            style: {
              borderBottom: 'solid 3px #294071',
            },
          }
        return {}
      }}
    />
  )
}

const getColorMatchTimeSlot = match_time_slot => {
  switch (match_time_slot) {
    case 'Live':
    case 'Delayed Live':
    case 'Has Live Today':
      return {
        backgroundColor: 'firebrick',
        color: 'white',
      }
    case 'Today':
      return {
        backgroundColor: 'yellow',
      }
    case 'Has Live Early':
    case 'Early':
      return {
        backgroundColor: 'steelblue',
        color: 'white',
      }
    default:
      return {}
  }
}
const getIconMatchTimeSlot = match_time_slot => {
  switch (match_time_slot) {
    case 'Live':
      return 'icon_live'
    case 'Delayed Live':
      return 'icon_delayed'
    case 'Has Live Today':
    case 'Has Live Early':
      return 'icon_has_live'
    default:
      return ''
  }
}
const getDBRBColor = dbrb_status => {
  switch (dbrb_status) {
    case 1:
      return ['bg_trader', '']
    case 2:
      return ['', 'bg_trader']
    case 3:
      return ['bg_trader', 'bg_trader']
    default:
      return ['', '']
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableMatch)
