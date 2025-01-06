import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, message, Row, Select, Space, Table, Typography } from 'antd'
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import actions from 'redux/mapping-bg-match/actions'
import { useDrop, useDrag } from 'react-dnd'

const { Text } = Typography
const mapStateToProps = ({ mappingBGMatch }) => ({
  loadingLeagueOptions: mappingBGMatch.loading_select_league,
  leagueOptions: mappingBGMatch.select_league.map(e => ({
    value: e.league_id,
    label: e.league_name,
  })),
  loadingLeagueBGOptions: mappingBGMatch.loading_select_league_bg,
  leagueBGOptions: mappingBGMatch.select_league_bg.map(e => ({
    value: e.league_id,
    label: e.league_name,
  })),
  loading: mappingBGMatch.loading_match,
  loadingBG: mappingBGMatch.loading_match_bg,
  tableDataTarget: mappingBGMatch.data_match,
  tableDataSource: mappingBGMatch.data_match_bg,
})

const mapDispatchToProps = dispatch => ({
  LoadMatch: payload =>
    dispatch({
      type: actions.LOAD_MATCH,
      payload,
      source: 'Mapping BG',
    }),
  LoadMatchBG: payload =>
    dispatch({
      type: actions.LOAD_MATCH_BG,
      payload,
      source: 'Mapping BG',
    }),
  Update: (payload, successCallback) =>
    dispatch({
      type: actions.UPDATE_MAPPING,
      successCallback,
      payload,
      source: 'Mapping BG',
    }),
})

const getRowClass = record => {
  if (record.booked === false && record.home_name !== '') {
    return 'text-danger'
  }
  return ''
}

const TableList = ({
  loadingLeagueOptions,
  loadingLeagueBGOptions,
  leagueOptions,
  leagueBGOptions,
  loading,
  loadingBG,
  tableDataTarget,
  tableDataSource,

  LoadMatch,
  LoadMatchBG,
  Update,

  formValue,
}) => {
  const [formTable] = Form.useForm()
  const [formTableBG] = Form.useForm()

  const [targetValue, setTargetValue] = useState([])
  React.useEffect(() => {
    setTargetValue([...tableDataTarget]) // clone the data with new reference
  }, [tableDataTarget])

  React.useEffect(() => {
    formTable.resetFields()
    formTableBG.resetFields()
  }, [formValue, formTable, formTableBG])

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
      dataIndex: 'bg_league',
      width: 85,
      render: (text, record) => {
        const className = getRowClass(record)
        return <Text className={className}>{text}</Text>
      },
    },
    {
      title: 'Match Date',
      dataIndex: 'bg_match_date',
      width: 100,
      render: (text, record) => {
        const className = getRowClass(record)
        return <Text className={className}>{text}</Text>
      },
    },
    {
      title: 'Home',
      dataIndex: 'bg_home_name',
      width: 85,
      render: (text, record) => {
        const className = getRowClass(record)
        return <Text className={className}>{text}</Text>
      },
    },
    {
      title: 'Away',
      dataIndex: 'bg_away_name',
      width: 85,
      render: (text, record) => {
        const className = getRowClass(record)
        return <Text className={className}>{text}</Text>
      },
    },
    {
      align: 'center',
      width: 20,
      render: (record, _, index) => (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() =>
            setTargetValue(prev => {
              prev[index] = {
                ...record,
                sports_ticker_id: 0,
                bg_league: '',
                bg_away_name: '',
                bg_home_name: '',
                bg_match_date: '',
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
      dataIndex: 'bg_league',
      width: 90,
    },
    {
      title: 'Match Date',
      dataIndex: 'bg_match_date',
      width: 90,
    },
    {
      title: 'Home',
      dataIndex: 'bg_home_name',
      width: 90,
    },
    {
      title: 'Away',
      dataIndex: 'bg_away_name',
      width: 90,
    },
  ]

  const reload = () => formTable.submit()
  const reloadBG = () => formTableBG.submit()

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
                    <Text className="text-danger">Click & Drag from BG League to this grid</Text>
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
          form={formTableBG}
          className="w-100 h-100"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          onValuesChange={reloadBG}
          onFinish={values => {
            LoadMatchBG({
              ...formValue,
              league_id: values.league_id,
            })
          }}
          onFinishFailed={({ outOfDate }) => {
            if (outOfDate) reloadBG()
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
            loading={loadingBG}
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
                label="BG League"
                labelAlign="left"
                labelCol={{ span: 5 }}
                rules={[{ required: true, message: 'Please select league' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  loading={loadingLeagueBGOptions}
                  options={leagueBGOptions}
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
          `BG Match (${item.record.bg_home_name} - ${item.record.bg_away_name}) is already mapped to : ${targetData.home_name} - ${targetData.away_name}. Please remove the Map First!`,
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
