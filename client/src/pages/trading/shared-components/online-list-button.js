import { Button, Drawer, Space } from 'antd'
import React from 'react'
import OnlineListDetail from '../online-list/detail'

const OnlineListButton = ({ record, type, fromPage }) => {
  const [visible, setVisible] = React.useState(false)

  let className
  const sub_match_fav_status = record.subMatches.find(e => [0, 2].includes(e.game_type))
    ?.sub_match_fav_status
  switch (type) {
    case 'home':
      className = sub_match_fav_status === -1 ? 'text-danger' : ''
      break
    default:
      className = sub_match_fav_status === 1 ? 'text-danger' : ''
  }

  return (
    <>
      <button
        className={`btn_plain text-primary ${className}`}
        type="button"
        onClick={() => setVisible(true)}
      >
        {type === 'home' ? record.home_name : record.away_name}
      </button>
      <Drawer
        title="Online List"
        width="80%"
        open={visible}
        onClose={() => setVisible(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisible(false)}>Close</Button>
          </Space>
        }
      >
        <OnlineListDetail match_ids={record.match_id.toString()} fromPage={fromPage} />
      </Drawer>
    </>
  )
}

export default OnlineListButton
