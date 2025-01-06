import React from 'react'
import { Descriptions, Modal } from 'antd'
import { isEqual } from 'lodash'
import Content from './content'

const ButtonLog = React.memo(
  ({ record }) => {
    const [visible, setVisible] = React.useState(false)
    const { match_id, league_name, home_name, away_name } = record

    return (
      <span role="presentation" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="p-0 text-wrap text-left text-black btn-link"
          onClick={() => setVisible(true)}
        >
          {home_name} - {away_name}
        </button>
        <Modal
          title={`Match Assignment Log - ${match_id}`}
          open={visible}
          onCancel={() => setVisible(false)}
          width="50%"
          destroyOnClose
          center
          footer={null}
        >
          <Descriptions column={1}>
            <Descriptions.Item label="League">{league_name}</Descriptions.Item>
            <Descriptions.Item label="Home - Away">
              {home_name} - {away_name}
            </Descriptions.Item>
          </Descriptions>
          <Content {...record} />
        </Modal>
      </span>
    )
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
)

export default ButtonLog
