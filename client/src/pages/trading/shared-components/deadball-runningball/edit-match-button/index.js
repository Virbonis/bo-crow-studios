import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Drawer, Space } from 'antd'
import authEnum from 'authorize'
import EditMatch from 'pages/match/match-list/edit'

const mapStateToProps = ({ auth }) => ({
  canEditMatch: !auth.user.user_auth_ids.includes(authEnum.DISALLOW_EDIT_MATCH),
})

const EditMatchButton = React.memo(
  ({ record, canEditMatch }) => {
    const [visible, setVisible] = useState(false)
    const btnSubmitEditRef = React.useRef()

    return (
      <>
        <button
          className="p-0 btn_plain text-primary"
          type="button"
          onClick={() => {
            setVisible(true)
          }}
        >
          Edit Match
        </button>
        {visible && (
          <Drawer
            title="Edit Match"
            width={800}
            open={visible}
            onClose={() => setVisible(false)}
            destroyOnClose
            footer={
              <Space>
                <Button onClick={() => setVisible(false)}>Close</Button>
                {canEditMatch && (
                  <Button
                    form="edit-match-form"
                    type="primary"
                    htmlType="submit"
                    ref={btnSubmitEditRef}
                  >
                    Submit
                  </Button>
                )}
              </Space>
            }
          >
            <EditMatch
              editValue={record}
              btnSubmitEditRef={btnSubmitEditRef}
              successCallback={() => setVisible(false)}
            />
          </Drawer>
        )}
      </>
    )
  },
  (prevProps, nextProps) => prevProps.record.match_id === nextProps.record.match_id, // prevent re-render if match_id is the same
)

export default connect(mapStateToProps)(EditMatchButton)
