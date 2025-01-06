import React from 'react'
import { Button, Tooltip } from 'antd'
import AutoAddSubMatchMore from 'pages/trading/auto-add-sub-match-more'
import { DragableModal } from 'components/blaise'
import { PlusCircleFilled } from '@ant-design/icons'

// frompage = moedit/motennis/deadball
const ButtonAddAutoSubMatchMore = React.memo(
  ({ match, frompage = 'moedit' }) => {
    const [visible, setVisible] = React.useState(false)

    if (![10, 11, 32].includes(match.sport_id)) return null

    let className
    switch (frompage) {
      case 'motennis':
        className = 'p-0 text-green'
        break
      case 'deadball':
        className = 'bg-green text-white'
        break
      case 'moedit':
        className = 'w-100 bg-green text-white'
        break
      default:
        return null
    }
    const isMOTennis = frompage === 'motennis'

    return (
      <>
        <Button
          size="small"
          className={className}
          type={isMOTennis && 'text'}
          onClick={() => setVisible(true)}
        >
          {/* {isMOTennis ? <PlusOutlined /> : 'Add More Game Type'} */}
          {isMOTennis ? (
            <Tooltip title="Add Auto Sub Match More">
              <PlusCircleFilled />
            </Tooltip>
          ) : (
            'Add Auto Sub Match More'
          )}
        </Button>
        <DragableModal
          title={`Auto Add Sub Match More - ${match.match_id}`}
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          width="80%"
          destroyOnClose
        >
          <AutoAddSubMatchMore match={match} />
        </DragableModal>
      </>
    )
  },
  (prevProps, nextProps) => prevProps.match.match_id === nextProps.match.match_id, // prevent re-render if match_id is the same
)

export default ButtonAddAutoSubMatchMore
