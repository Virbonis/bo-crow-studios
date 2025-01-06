import React from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Space } from 'antd'
import actions from 'redux/match-assignment/actions'
import { isEqual } from 'lodash'
import produce from 'immer'
import transmuteDataMatch from '../shared-components/match-assignment/transmuteDataMatch'
import TableMatchContent from './table-match-content'

const mapStateToProps = ({ matchAssignment }) => ({
  dataMatch: matchAssignment.dataMatch,
  defaultSelectedMatch: matchAssignment.defaultSelectedMatch,
})
const mapDispatchToProps = dispatch => ({
  UpdateMatches: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MATCH_PICK,
      payload,
      successCallback,
      source: 'Match Assignment',
    })
  },
})

const TableMatch = React.memo(
  ({ dataMatch, defaultSelectedMatch, UpdateMatches, reload }) => {
    const [selectedData, setSelectedData] = React.useState([]) // [{match_id, rb_ht, rb_ft}]
    React.useEffect(() => {
      setSelectedData(defaultSelectedMatch)
    }, [defaultSelectedMatch])

    const newDataSource = React.useMemo(() => {
      const newData = transmuteDataMatch(dataMatch, selectedData)
      return newData
    }, [dataMatch, selectedData])

    const onCheckAllLive = React.useCallback(
      (type, checked) => {
        setSelectedData(prev =>
          produce(prev, draftState => {
            const dataFiltered =
              type === ''
                ? dataMatch
                : dataMatch.filter(x => type.split(',').includes(x.match_time_slot))

            dataFiltered.forEach(curr => {
              const { match_id, match_time_slot } = curr
              const index = draftState.findIndex(e => e.match_id === match_id)
              if (index === -1) {
                draftState.push({
                  match_id,
                  match_time_slot,
                  db_ht: checked,
                  db_ft: checked,
                  rb_ht: checked,
                  rb_ft: checked,
                })
              } else {
                draftState[index] = {
                  ...draftState[index],
                  db_ht: checked,
                  db_ft: checked,
                  rb_ht: checked,
                  rb_ft: checked,
                }
              }
              if (!checked && !draftState[index]?.rb_ht && !draftState[index]?.rb_ft) {
                draftState.splice(index, 1)
              }
            })
          }),
        )
      },
      [setSelectedData, dataMatch],
    )

    const onRow = React.useCallback(
      (record, index) => {
        const { sport_name, match_id, match_time_slot } = record
        const isLastIndexSportName = sport_name !== dataMatch[index + 1]?.sport_name
        let className = 'custom_row_hover'
        if (isLastIndexSportName && index !== dataMatch.length - 1)
          className += ' custom_border_bottom'

        return {
          onClick: e => {
            if (e.target.tagName !== 'DIV') return
            setSelectedData(prev => {
              const item = prev.find(v => v.match_id === match_id)
              if (!item)
                return [
                  ...prev,
                  { match_id, match_time_slot, db_ht: true, db_ft: true, rb_ht: true, rb_ft: true },
                ]
              return prev.filter(v => v.match_id !== match_id)
            })
          },
          className,
          record,
        }
      },
      [dataMatch],
    )

    const updateHandler = () => {
      const tempMatchIds = selectedData.reduce((acc, curr) => {
        const { db_ht = false, db_ft = false, rb_ht = false, rb_ft = false, match_id } = curr
        if (db_ht || db_ft || rb_ht || rb_ft) {
          let gameRoundCodeDB = 0
          let gameRoundCodeRB = 0
          if (db_ht) gameRoundCodeDB += 1
          if (db_ft) gameRoundCodeDB += 2
          if (rb_ht) gameRoundCodeRB += 1
          if (rb_ft) gameRoundCodeRB += 2
          acc = acc.concat(match_id, '~', gameRoundCodeDB, '~', gameRoundCodeRB, ',')
        }
        return acc
      }, '')
      const matchIDs = tempMatchIds.slice(0, tempMatchIds.length - 1)
      UpdateMatches({ match_ids: matchIDs }, reload)
    }

    return (
      <>
        <div className="d-flex flex-row justify-content-between header-style">
          <div>Assign Match</div>
          <Space direction="horizontal" size={8}>
            <div className="filter_all_matches">
              <Checkbox
                className="w-100 h-100 align-items-center p-2"
                style={{ color: 'white' }}
                onChange={e => onCheckAllLive('', e.target.checked)}
              >
                All Matches
              </Checkbox>
            </div>
            <div className="filter_live">
              <Checkbox
                className="w-100 h-100 align-items-center p-2"
                style={{ color: 'white' }}
                onChange={e => onCheckAllLive('Live,Delayed Live,Has Live Today', e.target.checked)}
              >
                Live
              </Checkbox>
            </div>
            <div className="filter_today">
              <Checkbox
                className="w-100 h-100 align-items-center p-2"
                style={{ color: 'black' }}
                onChange={e => onCheckAllLive('Today', e.target.checked)}
              >
                Today
              </Checkbox>
            </div>
            <div className="filter_early">
              <Checkbox
                className="w-100 h-100 align-items-center p-2"
                style={{ color: 'white' }}
                onChange={e => onCheckAllLive('Has Live Early,Early', e.target.checked)}
              >
                Early
              </Checkbox>
            </div>
          </Space>
        </div>
        <div className="submit-style">
          <Button type="primary" onClick={updateHandler}>
            Submit
          </Button>
        </div>
        <TableMatchContent
          dataSource={newDataSource}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          onRow={onRow}
        />
      </>
    )
  },
  (prev, next) => isEqual(prev.dataMatch, next.dataMatch),
)

export default connect(mapStateToProps, mapDispatchToProps)(TableMatch)
