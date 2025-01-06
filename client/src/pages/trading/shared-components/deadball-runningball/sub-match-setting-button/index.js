import React from 'react'
import { Modal } from 'antd'
import { isEqual } from 'lodash'
import Content from './content'

const SubMatchSettingButton = React.memo(
  ({ record, fromPage, successCallback }) => {
    const [visible, setVisible] = React.useState(false)

    const getWidthModal = () => {
      if ([0, 2, 3, 5, 6, 9, 16, 12, 63, 64].includes(record.game_type)) {
        return '60%'
      }
      if ([10, 13].includes(record.game_type)) {
        return '60%'
      }
      return '40%'
    }
    const wrappedCallback = React.useCallback(() => {
      successCallback()
      setVisible(false)
    }, [successCallback])

    return (
      <>
        {fromPage === 'MO' ? (
          <button type="button" className="p-0 btn_plain" onClick={() => setVisible(true)}>
            Detail
          </button>
        ) : (
          <button type="button" className="p-0 btn_plain" onClick={() => setVisible(true)}>
            Setting
          </button>
        )}
        {visible && (
          <Modal
            title={
              fromPage === 'MO' ? 'Setting' : `Setting - ${record.home_name} - ${record.away_name}`
            }
            open={visible}
            onCancel={() => setVisible(false)}
            destroyOnClose
            width={getWidthModal()}
            footer={null}
          >
            <Content
              record={{
                match_id: record.match_id,
                sub_match_id: record.sub_match_id,
                game_type: record.game_type,
                match_time_slot: record.match_time_slot,
              }}
              match={{
                sport_id: record.sport_id,
                league_id: record.league_id,
                match_id: record.match_id,
                match_date: record.match_date,
                sport_name: record.sport_name,
                league_name: record.league_name,
                home_name: record.home_name,
                away_name: record.away_name,
              }}
              successCallback={wrappedCallback}
            />
          </Modal>
        )}
      </>
    )
  },
  (prev, next) => isEqual(prev.record, next.record),
)

export default SubMatchSettingButton
