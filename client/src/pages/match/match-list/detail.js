import React, { useEffect } from 'react'
import { Button, Table, Typography } from 'antd'
import actions from 'redux/match-list/actions'
import { connect } from 'react-redux'
import authEnum from 'authorize'
import { gameTypeDescription, getScoreGameTypeSpecial, getBetChoice } from 'helper'

const { Text } = Typography
const mapStateToProps = ({ matchList, auth }) => ({
  loading: matchList.loadingDetail,
  dataDetail: matchList.dataDetail,
  canDelete: !auth.user.user_auth_ids.includes(authEnum.DISALLOW_DELETE_MATCH),
})

const mapDispatchToProps = dispatch => ({
  LoadSpecial: payload => {
    dispatch({
      type: actions.LOAD_DETAIL_SPECIAL,
      payload,
      source: 'Match List',
    })
  },
  DeleteSpecial: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_DETAIL_SPECIAL,
      payload,
      successCallback,
      source: 'Match List',
    })
  },
})

const getChoice = choices => {
  const choicesList = choices.trim().split(',')

  const stringChoices = choicesList.map(x => getBetChoice(x)).join(', ')
  return stringChoices
}

const DetailMatchList = ({
  detailValue,
  loading,
  dataDetail,
  canDelete,
  LoadSpecial,
  DeleteSpecial,
  successCallback,
}) => {
  useEffect(() => {
    LoadSpecial(detailValue)
  }, [LoadSpecial, detailValue])

  const [selectedRowKeys, setSelectedRowKey] = React.useState([])

  const column = [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      width: 300,
      render: game_type => {
        if (game_type === 1241) return 'Quarter 1(Handicap, Over / Under, Odd / Even, Money Line)'
        if (game_type === 1242) return 'Quarter 2(Handicap, Over / Under, Odd / Even, Money Line)'
        if (game_type === 1243) return 'Quarter 3(Handicap, Over / Under, Odd / Even, Money Line)'
        if (game_type === 1244) return 'Quarter 4(Handicap, Over / Under, Odd / Even, Money Line)'

        return gameTypeDescription[game_type]?.long
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (text, { status, is_processed }) => {
        const StatusText = () => {
          if (status === 'Cancelled') return <Text type="danger">{status}</Text>
          return status
        }
        const ProcessText = () => {
          if (is_processed === 'Y') return <Text type="success">Processed</Text>
          return null
        }
        return (
          <>
            <StatusText />
            <br />
            <ProcessText />
          </>
        )
      },
    },
    {
      title: 'Selection',
      width: 100,
      render: (_, { game_type, selection }) => {
        if (game_type === 59 || game_type === 60) return selection
        return '-'
      },
    },
    {
      title: 'Score',
      width: 100,
      render: (_, record) => {
        const {
          game_type,
          status,
          cancel_type,
          home_score,
          away_score,
          ht_home,
          ht_away,
          fs_home,
          fs_away,
        } = record
        if ([50, 59, 60].includes(game_type)) return `${home_score} - ${away_score}`
        if (cancel_type === 'GameType') return null
        if (status === 'Scored' || status === 'Cancelled')
          return getScoreGameTypeSpecial(game_type, ht_home, ht_away, fs_home, fs_away)
        return null
      },
    },
    {
      title: 'Cancel Type',
      width: 100,
      render: (_, record) => {
        if (record.status === 'Cancelled')
          return (
            <>
              <Text>By {record.cancel_type}</Text>
              {record.cancel_type === 'Choice' && (
                <>
                  <br />
                  <Text>{getChoice(record.void_choice)}</Text>
                </>
              )}
            </>
          )
        return null
      },
    },
    {
      title: 'Reason',
      dataIndex: 'void_desc',
      width: 100,
    },
    // {
    //   title: 'Delete',
    //   dataIndex: 'is_allowed_delete',
    //   render: (text, record) => {
    //     if (text === 'Y') {
    //       return (
    //         <>
    //           <Checkbox
    //             onChange={ev => {
    //               record.checked = ev.target.checked
    //             }}
    //           />
    //         </>
    //       )
    //     }
    //     return ''
    //   },
    // },
  ]

  const onSubmitDelete = () => {
    const payload = {
      match_id: detailValue.match_id,
      game_types: dataDetail
        .filter(x => selectedRowKeys.includes(x.game_type))
        .map(x => x.game_type)
        .join(','),
    }
    DeleteSpecial(payload, successCallback)
  }

  return (
    <Table
      rowKey="game_type"
      loading={loading}
      dataSource={dataDetail}
      columns={column}
      pagination={false}
      rowSelection={{
        selectedRowKeys,
        onChange: setSelectedRowKey,
        getCheckboxProps: record => ({
          disabled: record.is_allowed_delete !== 'Y',
        }),
      }}
      title={() => (
        <Button
          type="primary"
          onClick={onSubmitDelete}
          disabled={selectedRowKeys.length === 0 || !canDelete}
        >
          Delete Special
        </Button>
      )}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailMatchList)
