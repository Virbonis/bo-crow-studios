import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, message, Row, Select, Space, Table, Typography } from 'antd'
import actions from 'redux/mapping-glive-stream/actions'
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { useDrop, useDrag } from 'react-dnd'

const { Text } = Typography
const mapStateToProps = ({ mappingGLiveStream }) => ({
  loadingLeagueOptions: mappingGLiveStream.loading_select_league,
  leagueOptions: mappingGLiveStream.select_league.map(e => ({
    value: e.league_id,
    label: e.league_name,
  })),
  loadingLeagueGLOptions: mappingGLiveStream.loading_select_league_gl,
  leagueGLOptions: mappingGLiveStream.select_league_gl.map(e => ({
    value: e.g_league,
    label: e.g_league,
  })),
  loading: mappingGLiveStream.loading_match,
  loadingGL: mappingGLiveStream.loading_match_gl,
  tableDataTarget: mappingGLiveStream.data_match,
  tableDataSource: mappingGLiveStream.data_match_gl,
})

const mapDispatchToProps = dispatch => ({
  LoadMatch: payload =>
    dispatch({
      type: actions.LOAD_MATCH,
      payload,
      source: 'Mapping GLive Stream',
    }),
  LoadMatchGL: payload =>
    dispatch({
      type: actions.LOAD_MATCH_GL,
      payload,
      source: 'Mapping GLive Stream',
    }),

  Update: (payload, successCallback) =>
    dispatch({
      type: actions.UPDATE_MAPPING,
      successCallback,
      payload,
      source: 'Mapping GLive Stream',
    }),
})

const getRowClass = record => {
  if (record.is_live === false) {
    return 'text-danger'
  }
  return ''
}
const TableList = ({
  loadingLeagueOptions,
  loadingLeagueGLOptions,
  leagueOptions,
  leagueGLOptions,
  loading,
  loadingGL,
  tableDataTarget,
  tableDataSource,

  LoadMatch,
  LoadMatchGL,
  Update,

  formValue,
}) => {
  const [formTable] = Form.useForm()
  const [formTableGL] = Form.useForm()

  const [targetValue, setTargetValue] = useState([])
  React.useEffect(() => {
    setTargetValue([...tableDataTarget]) // clone the data with new reference
  }, [tableDataTarget])

  React.useEffect(() => {
    formTable.resetFields()
    formTableGL.resetFields()
  }, [formValue, formTable, formTableGL])

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
      dataIndex: 'g_league',
      width: 85,
      render: (text, record) => {
        const className = getRowClass(record)
        return <Text className={className}>{text}</Text>
      },
    },
    {
      title: 'Match Date',
      dataIndex: 'g_match_date',
      width: 100,
      render: (text, record) => {
        const className = getRowClass(record)
        return <Text className={className}>{text}</Text>
      },
    },
    {
      title: 'Home',
      dataIndex: 'g_home_name',
      width: 85,
      render: (text, record) => {
        const className = getRowClass(record)
        return <Text className={className}>{text}</Text>
      },
    },
    {
      title: 'Away',
      dataIndex: 'g_away_name',
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
                g_match_id: 0,
                g_away_name: '',
                g_home_name: '',
                g_league: '',
                g_match_date: '',
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
      dataIndex: 'g_league',
      width: 90,
    },
    {
      title: 'Match Date',
      dataIndex: 'g_match_date',
      width: 90,
    },
    {
      title: 'Home',
      dataIndex: 'g_home_name',
      width: 90,
    },
    {
      title: 'Away',
      dataIndex: 'g_away_name',
      width: 90,
    },
  ]

  const reload = () => formTable.submit()
  const reloadGL = () => formTableGL.submit()

  const updateHandler = () => {
    const updateValue = targetValue
      // only update the changed value
      .filter(x => x.g_match_id !== tableDataTarget.find(y => y.match_id === x.match_id).g_match_id)
      // (reverse logic) reverse match_id if new g_match_id is empty
      .map(x => ({
        match_id: x.g_match_id === 0 ? x.match_id * -1 : x.match_id,
        g_match_id:
          x.g_match_id === 0
            ? tableDataTarget.find(y => y.match_id === x.match_id)?.g_match_id // old g_match_id
            : x.g_match_id, // new g_match_id
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
                    <Text className="text-danger">Click & Drag from GLS League to this grid</Text>
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
          form={formTableGL}
          className="w-100 h-100"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          onValuesChange={reloadGL}
          onFinish={values => {
            LoadMatchGL({
              ...formValue,
              g_league: values.g_league,
            })
          }}
          onFinishFailed={({ outOfDate }) => {
            if (outOfDate) reloadGL()
          }}
        >
          <Table
            size="small"
            rowKey="g_match_id"
            components={{
              body: {
                row: DraggableBodySourceRow,
              },
            }}
            loading={loadingGL}
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
                name="g_league"
                label="GLS League"
                labelAlign="left"
                rules={[{ required: true, message: 'Please select league' }]}
                labelCol={{ span: 6 }}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  loading={loadingLeagueGLOptions}
                  options={leagueGLOptions}
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
  const [{ isOver, canDrop, isExist }, drop] = useDrop({
    accept: type,
    drop: item => {
      // const targetData = targetValue.find(data => data.g_match_id === item.record.g_match_id)
      // if (targetData) {
      //   message.error(
      //     `GLS Match (${item.record.g_match_id}) is already mapped to Match ID (${targetData.match_id}). Please remove the Map First!`,
      //   )
      //   return
      // }
      onSelectMatch(index, item.record)
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isExist: targetValue?.find(data => data.g_match_id === monitor.getItem()?.record.g_match_id),
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
