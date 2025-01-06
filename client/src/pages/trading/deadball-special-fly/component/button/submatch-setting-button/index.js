import React from 'react'
import { Button, Modal } from 'antd'
import { isEqual } from 'lodash'
import Content from './content'

const SubMatchSettingButton = React.memo(
  ({ record, successCallback, lastFetchGameType }) => {
    const [visible, setVisible] = React.useState(false)

    const wrappedCallback = React.useCallback(() => {
      successCallback()
      setVisible(false)
    }, [successCallback])

    return (
      <>
        <Button type="text" className="p-0 btn_plain" onClick={() => setVisible(true)}>
          Setting
        </Button>
        {visible && (
          <Modal
            title={`Setting - ${record.home_name} - ${record.away_name}`}
            open={visible}
            onCancel={() => setVisible(false)}
            focusTriggerAfterClose={false}
            autoFocusButton={null}
            width={lastFetchGameType !== '35' ? '60%' : '100%'}
            destroyOnClose
            okText="Submit"
            footer={
              <Button type="primary" htmlType="submit" form="deadball-special-edit">
                Submit
              </Button>
            }
          >
            <Content
              record={{
                match_id: record.match_id,
                sub_match_id: record.sub_match_id,
                game_type: record.game_type,
                // match_time_slot: record.match_time_slot,
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
              lastFetchGameType={lastFetchGameType}
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
