import React from 'react'
import { Tooltip, Button, Col, Row, Spin } from 'antd'
import { connect } from 'react-redux'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/match-assignment/actions'
import TableLeague from '../shared-components/match-assignment/table-league'
import '../shared-components/match-assignment/custom-virtualize.scss'
import TableMatchVirtualize from './table-match-virtualize'

const mapStateToProps = ({ matchAssignment }) => ({
  loadingLeague: matchAssignment.loadingLeague,
  loadingMatch: matchAssignment.loadingMatch,
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actions.LOAD_LEAGUE,
      payload,
      source: 'Match Assignment',
    })
  },
  LoadMatch: payload => {
    dispatch({
      type: actions.LOAD_MATCH_PICK,
      payload,
      source: 'Match Assignment',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const MatchAssignmentPick = ({ LoadLeague, LoadMatch, CleanUp, loadingLeague, loadingMatch }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const reload = React.useCallback(() => {
    LoadLeague({ is_pick: 'Y' })
    LoadMatch()
  }, [LoadLeague, LoadMatch])

  React.useEffect(() => {
    LoadLeague({ is_pick: 'Y' })
    LoadMatch()
  }, [LoadLeague, LoadMatch])

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div align="right">
            <Tooltip placement="top" title="Refresh list" className="mb-2">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
          </div>
          <div
            className="d-flex flex-row-reverse justify-content-between                                           "
            style={{ gap: '4px' }}
          >
            <Row gutter={[8, 8]}>
              <Col span={6}>
                <Spin spinning={loadingLeague}>
                  <TableLeague reload={reload} isPick="Y" />
                </Spin>
              </Col>
              <Col span={18}>
                <Spin spinning={loadingMatch}>
                  <TableMatchVirtualize reload={reload} />
                </Spin>
              </Col>
            </Row>
          </div>
        </div>
        <div className="card-footer">
          <div>
            <b>LEGEND</b>
          </div>
          <span className="icon_counter_unassigned_games">11</span> Counter Unassigned Games
          <br />
          <span className="icon_live" /> Live Games
          <br />
          <span className="icon_delayed_live" /> Delayed Live Games
          <br />
          <span className="icon_has_live" /> Has Live Games
          <br />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchAssignmentPick)
