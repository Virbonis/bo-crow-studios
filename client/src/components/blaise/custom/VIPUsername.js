import React from 'react'
import { getVIPColorClass } from 'helper'
import { Badge } from 'antd'

export const VIPUsername = ({ username, vip_code, sign_up_week, showBadge }) => {
  const VIPClassName = getVIPColorClass(vip_code)
  const vipNumber = Number(VIPClassName.match(/\d+/)) // for taking the number of vip, e.g. vip_29 => 29

  const vipTitle = vipNumber ? `VIP ${vipNumber}` : ''
  const prefix = sign_up_week === 0 ? '+ ' : ''

  if (!showBadge)
    return (
      <span title={`${prefix}${username} ${vipTitle}`} className={VIPClassName}>
        {prefix}
        {username}
      </span>
    )

  return (
    <Badge size="small" status="warning" title={vipTitle} count={vipNumber} className="w-100">
      <span title={`${prefix}${username} ${vipTitle}`} className={VIPClassName}>
        {prefix}
        {username}
      </span>
    </Badge>
  )
}
export default VIPUsername
