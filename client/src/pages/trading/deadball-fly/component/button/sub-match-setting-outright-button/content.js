import React from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Form, Table } from 'antd'
import actionsSubMatchSetting from 'redux/edit-sub-match-setting/actions'
import { InputDecimal } from 'components/blaise'

const mapStateToProps = ({ editSubMatchSetting }) => ({
  loading: editSubMatchSetting.loading,
  data: editSubMatchSetting.data,
})

const mapDispatchMapToProps = (dispatch, { successCallback }) => ({
  LoadOutrightSetting: payload => {
    dispatch({
      type: actionsSubMatchSetting.LOAD_OUTRIGHT,
      payload,
      source: 'Deadball Outright',
    })
  },
  UpdateOutrightSetting: payload => {
    dispatch({
      type: actionsSubMatchSetting.UPDATE_OUTRIGHT,
      payload,
      source: 'Deadball Outright',
      successCallback,
    })
  },
  CleanUp: () => dispatch({ type: actionsSubMatchSetting.CLEAN_UP }),
})

const Content = ({
  outright_id,
  loading,
  data,
  LoadOutrightSetting,
  UpdateOutrightSetting,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])
  const [form] = Form.useForm()
  React.useEffect(() => {
    LoadOutrightSetting({ outright_id })
  }, [outright_id, LoadOutrightSetting])

  React.useEffect(() => {
    const initialValue = data?.reduce((acc, cur) => {
      const { sub_match_seq, auto_odds, lock_shift, auto_pause, odds } = cur
      acc = {
        ...acc,
        [sub_match_seq]: {
          sub_match_seq,
          auto_odds: auto_odds === 1,
          lock_shift: lock_shift === 1,
          auto_pause: auto_pause === 1,
          odds: parseFloat(odds.toFixed(2)),
        },
      }
      return acc
    }, {})
    form.setFieldsValue(initialValue)
  }, [data, form])

  const columns = [
    {
      title: 'Team',
      dataIndex: 'team_name',
      align: 'center',
      width: '40%',
    },
    {
      title: 'Odds',
      align: 'center',
      render: record => {
        return (
          <Form.Item name={[record.sub_match_seq, 'odds']}>
            <InputDecimal max={1000} style={{ width: '100%' }} />
          </Form.Item>
        )
      },
    },
    {
      title: 'Lock Leeching',
      align: 'center',
      render: record => {
        return (
          <Form.Item name={[record.sub_match_seq, 'lock_shift']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        )
      },
    },
    {
      title: 'Follow Leeching',
      align: 'center',
      render: record => {
        return (
          <Form.Item name={[record.sub_match_seq, 'auto_odds']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        )
      },
    },
    {
      title: 'Auto Pause',
      align: 'center',
      render: record => {
        return (
          <Form.Item name={[record.sub_match_seq, 'auto_pause']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        )
      },
    },
  ]

  return (
    <>
      <Form
        form={form}
        onFinish={value => {
          const payload = Object.entries(value).reduce((acc, [key, values]) => {
            acc.push({
              outright_id,
              sub_match_seq: Number(key),
              odds: values.odds,
              lock_shift: values.lock_shift ? 1 : 0,
              auto_odds: values.auto_odds ? 1 : 0,
              auto_pause: values.auto_pause ? 1 : 0,
            })

            return acc
          }, [])

          UpdateOutrightSetting(payload)
        }}
      >
        <Table
          columns={columns}
          loading={loading}
          dataSource={data}
          rowKey="sub_match_seq"
          pagination={false}
          scroll={{ y: 400 }}
        />

        <div align="right">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchMapToProps)(Content)
