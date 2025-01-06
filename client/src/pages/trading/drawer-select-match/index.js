import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Drawer, Space, Table, Checkbox, Divider } from 'antd'
import produce from 'immer'
import actions from 'redux/match/actions'

const mapStateToProps = ({ match }) => ({
  loading: match.loading,
  data: match.select,
})
const mapDispatchToProps = (dispatch, { group, popup_id, early_date }) => ({
  LoadMatchSelection: () => {
    dispatch({
      type: actions.LOAD_SELECT,
      payload: {
        popup_id,
        group,
        from_early_date: early_date?.[0].format('YYYY-MM-DD'),
        to_early_date: early_date?.[1].format('YYYY-MM-DD'),
      },
    })
  },
  UpdateMatchSelection: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SELECT,
      payload: {
        popup_id,
        group,
        from_early_date: early_date?.[0].format('YYYY-MM-DD'),
        to_early_date: early_date?.[1].format('YYYY-MM-DD'),
        ...payload,
      },
      successCallback,
    })
  },
  CleanUp: () => {
    dispatch({
      type: actions.CLEAN_UP,
    })
  },
})
const DrawerSelectMatch = ({
  loading,
  data,
  LoadMatchSelection,
  UpdateMatchSelection,
  open,
  closeDrawer,
  callbackSubmit,
}) => {
  const tableSelectMatchRef = useRef()
  React.useEffect(() => {
    if (open) LoadMatchSelection()
  }, [open, LoadMatchSelection])

  const filteredData = React.useMemo(
    () =>
      data.map(x => ({
        ...x,
        dbht: x.db_game === 1 || x.db_game === 3,
        dbft: x.db_game === 2 || x.db_game === 3,

        rbht: x.rb_game === 1 || x.rb_game === 3,
        rbft: x.rb_game === 2 || x.rb_game === 3,

        dbht_visible: x.db_game_available === 1 || x.db_game_available === 3,
        dbft_visible: x.db_game_available === 2 || x.db_game_available === 3,

        rbht_visible: x.rb_game_available === 1 || x.rb_game_available === 3,
        rbft_visible: x.rb_game_available === 2 || x.rb_game_available === 3,
      })),
    [data],
  )

  const onSubmit = () =>
    UpdateMatchSelection({ match_ids: tableSelectMatchRef.current.getMatchIds().join(',') }, () => {
      if (typeof callbackSubmit === 'function') callbackSubmit()
      closeDrawer()
    })

  return (
    <Drawer
      title="Select Match"
      width={1000}
      open={open}
      onClose={closeDrawer}
      destroyOnClose
      placement="left"
    >
      <Divider className="m-0" orientation="right">
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Divider>
      <div style={{ overflow: 'auto', height: 'calc(100% - 50px)' }}>
        <TableMatch loading={loading} data={filteredData} ref={tableSelectMatchRef} />
      </div>
      <Divider className="m-0" orientation="right">
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Divider>
    </Drawer>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerSelectMatch)

const TableMatch = React.memo(
  React.forwardRef(({ loading, data = [] }, ref) => {
    const [newData, setNewData] = useState(data)
    useEffect(() => {
      setNewData(data)
    }, [data])

    const updateCheck = (match_id, prop, isChecked) => {
      setNewData(state => {
        return produce(state, draftState => {
          if (match_id) {
            const index = draftState.findIndex(x => x.match_id === match_id)
            if (prop) draftState[index][prop] = isChecked
            else {
              const { dbht, dbft, rbht, rbft } = draftState[index]
              const anyChecked = dbht || dbft || rbht || rbft
              draftState[index].dbht = !anyChecked
              draftState[index].dbft = !anyChecked
              draftState[index].rbht = !anyChecked
              draftState[index].rbft = !anyChecked
            }
          } else {
            draftState.forEach(x => {
              x[prop] = isChecked
            })
          }
        })
      })
    }

    useImperativeHandle(ref, () => ({
      getMatchIds: () =>
        newData
          .filter(x => x.dbht || x.dbft || x.rbht || x.rbft)
          .map(x => {
            const db = x.dbht + (x.dbft ? 2 : 0)
            const rb = x.rbht + (x.rbft ? 2 : 0)
            return `${x.match_id}~${db}~${rb}`
          }),
    }))

    const columns = [
      {
        title: 'Dead Ball',
        children: [
          {
            title: () => (
              <Space direction="vertical" size={0}>
                <div>HT</div>
                <Checkbox
                  checked={newData.length === newData?.filter(x => x.dbht).length}
                  onClick={e => e.stopPropagation()} // prevent table row click event
                  onChange={e => updateCheck(null, 'dbht', e.target.checked)}
                />
              </Space>
            ),
            align: 'center',
            render: record => {
              return record.dbht_visible ? (
                <Checkbox
                  checked={record.dbht}
                  open={false}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateCheck(record.match_id, 'dbht', e.target.checked)}
                />
              ) : null
            },
            width: 50,
            shouldCellUpdate: (record, prevRecord) => prevRecord.dbht !== record.dbht,
          },
          {
            title: () => (
              <Space direction="vertical" size={0}>
                <div>FT</div>
                <Checkbox
                  checked={newData.length === newData?.filter(x => x.dbft).length}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateCheck(null, 'dbft', e.target.checked)}
                />
              </Space>
            ),
            align: 'center',
            render: record => {
              return record.dbft_visible ? (
                <Checkbox
                  checked={record.dbft}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateCheck(record.match_id, 'dbft', e.target.checked)}
                />
              ) : null
            },
            width: 50,
            shouldCellUpdate: (record, prevRecord) => prevRecord.dbft !== record.dbft,
          },
        ],
      },
      {
        title: 'Runnning Ball',
        children: [
          {
            title: () => (
              <Space direction="vertical" size={0}>
                <div>HT</div>
                <Checkbox
                  checked={newData.length === newData?.filter(x => x.rbht).length}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateCheck(null, 'rbht', e.target.checked)}
                />
              </Space>
            ),
            align: 'center',
            render: record => {
              return record.rbht_visible ? (
                <Checkbox
                  checked={record.rbht}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateCheck(record.match_id, 'rbht', e.target.checked)}
                />
              ) : null
            },
            width: 50,
            shouldCellUpdate: (record, prevRecord) => prevRecord.rbht !== record.rbht,
          },
          {
            title: () => (
              <Space direction="vertical" size={0}>
                <div>FT</div>
                <Checkbox
                  checked={newData.length === newData?.filter(x => x.rbft).length}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateCheck(null, 'rbft', e.target.checked)}
                />
              </Space>
            ),
            align: 'center',
            render: record => {
              return record.rbft_visible ? (
                <Checkbox
                  checked={record.rbft}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateCheck(record.match_id, 'rbft', e.target.checked)}
                />
              ) : null
            },
            width: 50,
            shouldCellUpdate: (record, prevRecord) => prevRecord.rbft !== record.rbft,
          },
        ],
      },
      {
        title: 'Sport',
        dataIndex: 'sport_name',
        width: 100,
        shouldCellUpdate: (record, prevRecord) => prevRecord.sport_name !== record.sport_name,
      },
      {
        title: 'League Name',
        dataIndex: 'league_name',
        shouldCellUpdate: (record, prevRecord) => prevRecord.league_name !== record.league_name,
      },
      {
        title: 'Home - Away',
        render: record => `${record.home_name} - ${record.away_name}`,
        shouldCellUpdate: (record, prevRecord) =>
          prevRecord.home_name !== record.home_name || prevRecord.away_name !== record.away_name,
      },
    ]

    return (
      <Table
        rowKey="match_id"
        size="small"
        loading={loading}
        dataSource={newData}
        columns={columns}
        pagination={false}
        bordered
        onRow={record => ({
          onClick: () => updateCheck(record.match_id),
        })}
      />
    )
  }),
)
