import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Form, message } from 'antd'
import actions from 'redux/export/actions'
import { useGetDateTimeDBServer } from 'components/blaise'
import { BetEnquiryFormItems } from 'pages/trading/bet-enquiry'

const mapStateToProps = ({ exportReport }) => ({
  loadingExport: exportReport.loadingExportBetEnquiry,
})
const mapDispatchToProps = dispatch => ({
  Export: payload => {
    dispatch({
      type: actions.EXPORT_BET_ENQUIRY,
      payload,
      source: 'Export',
    })
  },
})

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()
  if (!defaultDateTimeServer) return null
  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const ExportBetEnquiry = wrapperDate(({ defaultDateTimeServer, loadingExport, Export }) => {
  const [form] = Form.useForm()

  return (
    <Card title="Bet Enquiry">
      <Form
        form={form}
        className="w-100"
        initialValues={{
          game_types: [-99],
          bet_status: '',
          branch_id: '',
          sport_ids: [''],
          product: '',
          buyback: 'Include',
          txn_type: '',
          vip_filter: 0,
          currency: '',
          date_range: [
            defaultDateTimeServer.clone().add(-12, 'hours'), // fromDate
            defaultDateTimeServer, // toDate
          ],
        }}
        onFinish={values => {
          const [from, to] = values.date_range
          // range fromdate-todate cannot greater than 24 hours
          if (to.diff(from, 'hours') > 24) {
            message.error('Date range cannot greater than 24 hours')
            return
          }
          Export({
            ...values,
            game_types: values.game_types.toString(),
            sport_ids: values.sport_ids.toString(),
            from_bet_date: values.date_range[0].format('YYYY-MM-DD HH:mm'),
            to_bet_date: values.date_range[1].format('YYYY-MM-DD HH:mm'),
            switch_to_match_date: values.switch_to_match_date ? 'Y' : 'N',
            from_date: values.bet_date?.[0].format('YYYY-MM-DD HH:mm'),
            to_date: values.bet_date?.[1].format('YYYY-MM-DD HH:mm'),
          })
        }}
      >
        <BetEnquiryFormItems fromExportPage />
        <Button loading={loadingExport} type="primary" htmlType="submit">
          Export
        </Button>
      </Form>
    </Card>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(ExportBetEnquiry)
