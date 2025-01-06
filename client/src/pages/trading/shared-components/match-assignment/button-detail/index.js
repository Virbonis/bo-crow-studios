import React from 'react'
import { Button, Descriptions, Modal } from 'antd'
import { isEqual, startsWith } from 'lodash'
import Content from './content'

const getTraderText = (trader_name, traderType) => {
  const traderText = trader_name
    .split(';')
    .find(x => startsWith(x, traderType))
    ?.split('~')

  return traderText?.[1]
}
const ButtonDetail = React.memo(
  ({
    record,

    traderType, // RBFT/RBHT/DBFT/DBHT
    isPick = false, // matchAssignmentPick, Y/N,
    isLive = true, // matchAssignmentPick, Y/N, runningball or deadball
    isReadOnly = false, // matchAssignmentRO, true/false
    children,
    ...restProps
  }) => {
    const [visible, setVisible] = React.useState(false)
    const { match_id, league_name, home_name, away_name, trader_name } = record

    const statusLive = isLive === 'Y' ? 'Running Ball' : 'Dead Ball'
    // if traderType is set, then children is getTraderText
    if (traderType) {
      children = getTraderText(trader_name, traderType)
    }

    if (!children || children.length === 0) return null
    if (isReadOnly) return children
    return (
      <span role="presentation" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="btn btn-link p-0 text-wrap text-left"
          onClick={() => setVisible(true)}
          {...restProps}
        >
          {children}
        </button>
        <Modal
          title={`Match Assignment Detail - ${match_id}`}
          open={visible}
          onCancel={() => setVisible(false)}
          width="50%"
          destroyOnClose
          center
          footer={
            <Button type="primary" htmlType="submit" form="detail-match-assignment">
              Submit
            </Button>
          }
        >
          <Descriptions column={1}>
            <Descriptions.Item label="League">{league_name}</Descriptions.Item>
            <Descriptions.Item label="Home - Away">
              {home_name} - {away_name}
            </Descriptions.Item>
          </Descriptions>
          {isPick ? statusLive : null}
          <Content
            {...record}
            is_pick={isPick ? 'Y' : 'N'}
            match_status_live={isLive ? 'Y' : 'N'}
            successCallback={() => setVisible(false)}
          />
        </Modal>
      </span>
    )
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
)

export default ButtonDetail
