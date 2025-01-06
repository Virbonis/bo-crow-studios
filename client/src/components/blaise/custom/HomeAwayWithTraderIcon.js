import React from 'react'
import { Popover, Space } from 'antd'
import { getTraderDBRBPick } from 'helper'
import './HomeAwayWithTraderIcon.scss'

export const HomeAwayWithTraderIcon = ({ trader, home_name, away_name, provider_name }) => {
  const [dataRB, dataDB, dataPick] = React.useMemo(() => getTraderDBRBPick(trader), [trader])

  return (
    <div className="w-100 position-relative">
      <span title={home_name}>{home_name}</span>
      <br />
      <span title={away_name}>{away_name}</span>
      <div className="position-absolute" style={{ top: 5, right: 0 }}>
        {provider_name && (
          <Popover content={provider_name} role="definition">
            <div className="icon_provider" />
          </Popover>
        )}
        {dataRB.length > 0 && (
          <Popover
            content={
              <Space direction="vertical" size={0}>
                {dataRB}
              </Space>
            }
            role="definition"
          >
            <div className="icon_rb" />
          </Popover>
        )}
        {dataDB.length > 0 && (
          <Popover
            content={
              <Space direction="vertical" size={0}>
                {dataDB}
              </Space>
            }
            role="definition"
          >
            <div className="icon_db" />
          </Popover>
        )}
        {dataPick.length > 0 && (
          <Popover
            content={
              <Space direction="vertical" size={0}>
                {dataPick}
              </Space>
            }
            role="definition"
          >
            <div className="icon_pick" />
          </Popover>
        )}
      </div>
    </div>
  )
}

export default HomeAwayWithTraderIcon
