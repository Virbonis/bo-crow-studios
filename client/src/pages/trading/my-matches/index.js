import React, { useEffect } from 'react'
import { Button, Tooltip, Collapse, Spin } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/my-matches/actions'
import TableMatch from './table-match'
import './custom.scss'

const { Panel } = Collapse
const mapStateToProps = ({ myMatches }) => ({
  loadingTable: myMatches.loadingCounter,
  dataTable: myMatches.dataCounter,
})

const mapDispatchToProps = dispatch => ({
  LoadCounter: payload => {
    dispatch({
      type: actions.LOAD_COUNTER,
      payload,
      source: 'My Matches',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const MyMatches = ({ loadingTable, dataTable, LoadCounter, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  useEffect(() => {
    LoadCounter()
  }, [LoadCounter])
  const [activeKey, setActiveKey] = React.useState()
  React.useEffect(() => {
    setActiveKey([])
  }, [dataTable])

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse justify-content-between">
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={() => LoadCounter()} />
          </Tooltip>
        </div>
        <div className="card-body h-100 overflow-auto">
          <Spin spinning={loadingTable}>
            <Collapse destroyInactivePanel activeKey={activeKey} onChange={setActiveKey}>
              {dataTable.map(({ match_time_slot, counter }) => (
                <Panel key={match_time_slot} header={`${match_time_slot} (${counter})`}>
                  <TableMatch match_time_slot={match_time_slot} />
                </Panel>
              ))}
            </Collapse>
          </Spin>
        </div>
        <div className="card-footer">
          <div>
            <b>LEGEND</b>
          </div>
          <span className="icon_live" /> Live Games
          <br />
          <span className="icon_delayed" /> Delayed Live Games
          <br />
          <span className="icon_has_live" /> Has Live Games
          <br />
          <span className="icon_trader" /> My Games
          <br />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MyMatches)
