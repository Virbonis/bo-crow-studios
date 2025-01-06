import React from 'react'
import { connect } from 'react-redux'
import { Card, Checkbox, Divider, Form } from 'antd'
import { isEmpty } from 'lodash'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})

const SectionSportsTicker = React.memo(({ match }) => {
  if (isEmpty(match)) return null

  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        ...match,
        rb_status: match.st_sports_ticker === 'RB',
        bg_status: match.st_sports_ticker === 'BG',
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          RBall
        </Divider>
        <Form.Item label="RBall Status" className="mb-0" name="rb_status" valuePropName="checked">
          <Checkbox disabled={match.rb_status === 'N'} />
        </Form.Item>
      </Card>
    </Form>
  )
})

export default connect(mapStateToProps, null)(SectionSportsTicker)
