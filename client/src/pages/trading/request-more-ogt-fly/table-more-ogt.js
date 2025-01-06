import React from 'react'
import { Col, Row, Space, Table, Typography } from 'antd'
import RequestMoreGTLeagueButton from '../deadball-fly/component/button/request-more-gt-button'
import ResetMoreGTButton from '../deadball-fly/component/button/reset-more-gt-button'
import './custom.scss'

const { Text } = Typography

const TableMoreOGT = ({ refetch, ...restProps }) => {
  const columns = [
    {
      title: 'No',
      width: 30,
      onCell: ({ league_group, rowSpan }) => ({
        colSpan: league_group ? 15 : 1,
        rowSpan,
      }),
      render: ({ league_group, league_name, match_ids, rowNumber }) => {
        if (league_group)
          return (
            <Row className="p-1 pl-3">
              <Col span={6}>
                <span className="h5 font-weight-bold text-wrap">{league_name}</span>
              </Col>
              <Col span={14}>
                <Row>
                  <Col span={6}>
                    <RequestMoreGTLeagueButton match_ids={match_ids} successCallback={refetch} />
                  </Col>
                  <Col span={6}>
                    <ResetMoreGTButton match_ids={match_ids} successCallback={refetch} />
                  </Col>
                </Row>
              </Col>
            </Row>
          )
        return <div align="center">{rowNumber}</div>
      },
    },
    {
      title: 'Time',
      align: 'center',
      width: 100,
      onCell: ({ league_group, rowSpan }) => ({
        rowSpan: league_group ? 0 : rowSpan,
      }),
      render: record => {
        if (record.league_group) return null
        return (
          <div className="d-flex flex-column">
            <span>{record.match_date}</span>
            <span>{record.match_hour}</span>
          </div>
        )
      },
    },
    {
      title: 'Home Away',
      width: 300,
      onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
      render: record => {
        if (record.league_group) return null
        return (
          <Space direction="vertical" size={0}>
            <Text>{record.home_name}</Text>
            <Text>{record.away_name}</Text>
          </Space>
        )
      },
    },
    {
      title: 'Last Request Date',
      align: 'center',
      width: 120,
      onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
      render: record => {
        if (record.league_group) return null
        if (record.last_request_date) return record.last_request_date
        return null
      },
    },
    {
      title: 'Status',
      align: 'center',
      width: 400,
      onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
      render: record => {
        if (record.league_group) return null
        return record.more_gt === 1 && 'Queue'
      },
    },
    {
      title: 'Leeching Match',
      children: [
        {
          width: 150,
          onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
          render: record => {
            if (record.league_group) return null
            return `MatchID IBC: ${record.match_id_status}`
          },
        },
        {
          width: 150,
          onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
          render: record => {
            if (record.league_group) return null
            if (record.match_start)
              return (
                <div className="d-flex flex-column">
                  <span>{record.match_start_date}</span>
                  <span>{record.match_start_hour}</span>
                </div>
              )
            return null
          },
        },
        {
          width: 150,
          onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
          render: record => {
            if (record.league_group) return null
            return (
              <Space direction="vertical" size={0}>
                <Text>{record.home_team}</Text>
                <Text>{record.away_team}</Text>
              </Space>
            )
          },
        },
      ],
    },
  ]
  return <Table columns={columns} {...restProps} />
}

export default TableMoreOGT
