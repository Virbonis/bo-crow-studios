import React from 'react'
import { connect } from 'react-redux'
import { Alert, Button, Card, Checkbox, Divider, Form, Popconfirm, Space } from 'antd'
import { isEmpty } from 'lodash'
import actions from 'redux/mo-match-edit/actions'
import { DeleteOutlined } from '@ant-design/icons'
import { listGT } from 'helper'

const mapStateToProps = ({ moEdit }) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,
  match: moEdit.data.match,
  ticket_AH:
    moEdit.data.submatch?.findLast(x => listGT.Handicap.includes(x.game_type))?.total_ticket || 0,
  ticket_OU:
    moEdit.data.submatch?.findLast(x => listGT.OverUnder.includes(x.game_type))?.total_ticket || 0,
})
const mapDispatchToProps = dispatch => ({
  AddSubMatch: (payload, successCallback) => {
    dispatch({
      type: actions.ADD_SUB_MATCH,
      payload,
      successCallback,
    })
  },
  DeleteSubMatch: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_SUB_MATCH,
      payload,
      successCallback,
    })
  },
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
})

const SectionAddSubMatch = ({
  match_id,
  display_admin,
  match,
  ticket_AH,
  ticket_OU,
  AddSubMatch,
  DeleteSubMatch,
  CancelEdit,
  page,
}) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  // display_admin s1-s5
  if ([11, 14, 17, 20, 23].includes(display_admin)) return null

  if (match.is_follow === 'Y')
    return (
      <Card size="small">
        <Divider orientation="left" className="m-0">
          + Add Sub Match
        </Divider>
        <Alert message="* Hidden if Match is Follow" type="warning" />
      </Card>
    )
  const anyTickets = ticket_AH + ticket_OU > 0
  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        ...match,
      }}
      onFinish={values => {
        if (!isEmpty(values.htft))
          AddSubMatch({
            match_id,
            htft: values.htft
              .sort()
              .reverse()
              .join(''), // HT, FT, HTFT
          })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          + Add Sub Match
        </Divider>
        <Form.Item className="mb-0" label="Market" name="htft">
          <Checkbox.Group>
            <Space direction="vertical" size={0}>
              {page === 'MOTennis' ? (
                <Checkbox value="FT">Full Time</Checkbox>
              ) : (
                <>
                  <Checkbox value="HT">Half Time</Checkbox>
                  <Checkbox value="FT">Full Time</Checkbox>
                </>
              )}
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Divider orientation="right" className="m-0">
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Divider>
        {display_admin !== 1 && display_admin !== 31 ? (
          <>
            <Divider orientation="left" className="m-0">
              Delete this Sub Match
            </Divider>
            {anyTickets ? (
              'Cannot Delete, Sub Match already have tickets'
            ) : (
              <Divider orientation="right" className="m-0">
                <Popconfirm
                  title="Are you sure delete this submatch?"
                  onConfirm={() =>
                    DeleteSubMatch(
                      {
                        match_id,
                        display_admin,
                      },
                      CancelEdit,
                    )
                  }
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Divider>
            )}
          </>
        ) : null}
      </Card>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionAddSubMatch)
