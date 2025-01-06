import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, message, Row, Select, Space, Table, Typography } from 'antd'
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import actions from 'redux/mapping-rball-match/actions'
import { useDrop, useDrag } from 'react-dnd'

const { Text } = Typography
const mapStateToProps = ({ mappingRBallMatch }) => ({
  loadingLeagueOptions: mappingRBallMatch.loading_select_league,
  leagueOptions: mappingRBallMatch.select_league.map(e => ({
    value: e.league_id,
    label: e.league_name,
  })),
  loadingLeagueRBOptions: mappingRBallMatch.loading_select_league_rb,
  leagueRBOptions: mappingRBallMatch.select_league_rb.map(e => ({
    value: e.league_id,
    label: e.league_name,
  })),
  loading: mappingRBallMatch.loading_match,
  loadingRB: mappingRBallMatch.loading_match_rb,
  tableDataTarget: mappingRBallMatch.data_match,
  tableDataSource: mappingRBallMatch.data_match_rb,
})

const mapDispatchToProps = dispatch => ({
  LoadMatch: payload =>
    dispatch({
      type: actions.LOAD_MATCH,
      payload,
      source: 'Mapping RB',
    }),
  LoadMatchRB: payload =>
    dispatch({
      type: actions.LOAD_MATCH_RB,
      payload,
      source: 'Mapping RB',
    }),
  Update: (payload, successCallback) =>
    dispatch({
      type: actions.UPDATE_MAPPING,
      successCallback,
      payload,
      source: 'Mapping RB',
    }),
})

const TableList = ({
  loadingLeagueOptions,
  loadingLeagueRBOptions,
  leagueOptions,
  leagueRBOptions,
  loading,
  loadingRB,
  tableDataTarget,
  tableDataSource,

  LoadMatch,
  LoadMatchRB,
  Update,

  formValue,
}) => {
  const [formTable] = Form.useForm()
  const [formTableRB] = Form.useForm()

  const [targetValue, setTargetValue] = useState([])
  React.useEffect(() => {
    setTargetValue([...tableDataTarget]) // clone the data with new reference
  }, [tableDataTarget])

  React.useEffect(() => {
    formTable.resetFields()
    formTableRB.resetFields()
  }, [formValue, formTable, formTableRB])

  const onSelectMatch = React.useCallback((indexTarget, record) => {
    setTargetValue(prev => {
      prev[indexTarget] = { ...prev[indexTarget], ...record }
      return [...prev]
    })
  }, [])

  const columnsTarget = [
    {
      title: 'Match Date',
      dataIndex: 'match_date',
      align: 'center',
      width: 100,
    },
    {
      title: 'Home',
      dataIndex: 'home_name',
      width: 85,
    },
    {
      title: 'Away',
      dataIndex: 'away_name',
      width: 85,
    },
    {
      title: 'League',
      dataIndex: 'rb_league',
      width: 85,
      render: text => <Text className="text-danger">{text}</Text>,
    },
    {
      title: 'Match Date',
      dataIndex: 'time_stamp',
      width: 100,
      render: text => <Text className="text-danger">{text}</Text>,
    },
    {
      title: 'Home',
      dataIndex: 'rb_home_name',
      width: 85,
      render: text => <Text className="text-danger">{text}</Text>,
    },
    {
      title: 'Away',
      dataIndex: 'rb_away_name',
      width: 85,
      render: text => <Text className="text-danger">{text}</Text>,
    },
    {
      align: 'center',
      width: 20,
      render: (record, _, index) =>
        record.sports_ticker_id !== 0 && (
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() =>
              setTargetValue(prev => {
                prev[index] = {
                  ...record,
                  sports_ticker_id: 0,
                  rb_league: '',
                  rb_away_name: '',
                  rb_home_name: '',
                  time_stamp: '',
                }
                return [...prev]
              })
            }
          />
        ),
    },
  ]

  const columnsSource = [
    {
      title: 'League',
      dataIndex: 'rb_league',
      width: 90,
    },
    {
      title: 'Match Date',
      dataIndex: 'time_stamp',
      width: 90,
      render: text => <Text>{text}</Text>,
    },
    {
      title: 'Home',
      dataIndex: 'rb_home_name',
      width: 90,
    },
    {
      title: 'Away',
      dataIndex: 'rb_away_name',
      width: 90,
    },
  ]

  const reload = () => formTable.submit()
  const reloadRB = () => formTableRB.submit()

  const updateHandler = () => {
    const updateValue = targetValue.map(data => ({
      match_id: data.match_id,
      sports_ticker_id: data.sports_ticker_id,
    }))
    if (updateValue.length === 0) {
      message.error('No data to update')
      return
    }
    Update(updateValue, reload)
  }

  return (
    <Row gutter={[8, 8]} className="h-100">
      <Col span={16} className="h-100">
        <Form
          form={formTable}
          className="w-100 h-100"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          onValuesChange={reload}
          onFinish={values =>
            LoadMatch({
              ...formValue,
              league_id: values.league_id,
            })
          }
          onFinishFailed={({ outOfDate }) => {
            if (outOfDate) reload()
          }}
        >
          <Table
            size="small"
            rowKey="match_id"
            components={{
              body: {
                row: DraggableBodyTargetRow,
              },
            }}
            loading={loading}
            dataSource={targetValue}
            columns={columnsTarget}
            className="w-100"
            onRow={(record, index) => ({
              record,
              index,
              targetValue,
              onSelectMatch,
            })}
            bordered
            pagination={false}
            title={() => (
              <Row justify="space-between">
                <Col span={12}>
                  <Form.Item
                    name="league_id"
                    label="League"
                    labelAlign="left"
                    rules={[{ required: true, message: 'Please select league' }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      loading={loadingLeagueOptions}
                      options={leagueOptions}
                      style={{ width: '200px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} align="right">
                  <Space>
                    <Text className="text-danger">Click & Drag from RBall League to this grid</Text>
                    <Button type="link" icon={<ReloadOutlined />} onClick={reload} />
                    <Button type="primary" onClick={updateHandler}>
                      Update
                    </Button>
                  </Space>
                </Col>
              </Row>
            )}
          />
        </Form>
      </Col>
      <Col span={8} className="h-100">
        <Form
          form={formTableRB}
          className="w-100 h-100"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 8 }}
          onValuesChange={reloadRB}
          onFinish={values => {
            LoadMatchRB({
              ...formValue,
              league_id: values.league_id,
            })
          }}
          onFinishFailed={({ outOfDate }) => {
            if (outOfDate) reloadRB()
          }}
        >
          <Table
            size="small"
            rowKey="sports_ticker_id"
            components={{
              body: {
                row: DraggableBodySourceRow,
              },
            }}
            loading={loadingRB}
            dataSource={tableDataSource}
            columns={columnsSource}
            className="w-100"
            bordered
            pagination={false}
            onRow={record => ({
              record,
            })}
            title={() => (
              <Form.Item
                name="league_id"
                label="RBall League"
                labelAlign="left"
                rules={[{ required: true, message: 'Please select league' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  loading={loadingLeagueRBOptions}
                  options={leagueRBOptions}
                  style={{ width: '200px' }}
                />
              </Form.Item>
            )}
          />
        </Form>
      </Col>
    </Row>
  )
}

const type = 'DraggableMatch'
const DraggableBodySourceRow = ({ index, record, className, style, ...restProps }) => {
  const [, drag] = useDrag({
    type,
    item: {
      record,
    },
  })

  if (!record) return <tr {...restProps} className={className} style={style} {...restProps} />
  return (
    <tr
      ref={drag}
      className={className}
      style={{
        cursor: 'move',
        ...style,
      }}
      {...restProps}
    />
  )
}
const DraggableBodyTargetRow = props => {
  const { index, record, className, style, onSelectMatch, targetValue, ...restProps } = props
  const [{ isOver, isExist, canDrop }, drop] = useDrop({
    accept: type,
    drop: item => {
      const targetData = targetValue.find(
        data => data.sports_ticker_id === item.record.sports_ticker_id,
      )
      if (targetData) {
        message.error(
          `RB Match (${item.record.rb_home_name} - ${item.record.rb_away_name}) is already mapped to : ${targetData.home_name} - ${targetData.away_name}. Please remove the Map First!`,
        )
        return
      }
      onSelectMatch(index, item.record)
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isExist: targetValue?.find(
        data => data.sports_ticker_id === monitor.getItem()?.record.sports_ticker_id,
      ),
    }),
  })

  if (!record) return <tr {...restProps} className={className} style={style} {...restProps} />

  const rowColor = isExist ? '#ff948f' : '#c6ffd4'
  return (
    <tr
      ref={drop}
      style={{ backgroundColor: isOver && canDrop ? rowColor : '' }}
      className={className}
      {...restProps}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TableList)
