import React from 'react'
import { Button } from 'antd'
import AutoAddSubMatch from 'pages/trading/auto-add-sub-match'
import { DragableModal } from 'components/blaise'

// frompage = moedit
const ButtonAddAutoSubMatch = React.memo(
  ({ match }) => {
    const [visible, setVisible] = React.useState(false)

    if (match.is_show_auto_add_match !== 'Y') return null

    return (
      <>
        <Button className=" w-100 bg-green text-white" onClick={() => setVisible(true)}>
          Add Auto Sub Match
        </Button>
        <DragableModal
          title={`Auto Add Sub Match - ${match.match_id}`}
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          width="80%"
          destroyOnClose
        >
          <AutoAddSubMatch match={match} />
        </DragableModal>
      </>
    )
  },
  (prevProps, nextProps) => prevProps.match.match_id === nextProps.match.match_id, // prevent re-render if match_id is the same
)

export default ButtonAddAutoSubMatch
