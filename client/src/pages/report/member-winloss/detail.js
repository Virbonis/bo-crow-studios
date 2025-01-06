import React from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Col, Collapse, Descriptions, Flex, Row } from 'antd'
import actions from 'redux/member-winloss/actions'
import TableBetDetail from '../shared-components/table-bet-detail'
import useReportOptions from '../shared-components/useReportOptions'

const { Panel } = Collapse
const mapStateToProps = ({ memberWinloss }, { hist }) => ({
  loadingData: hist ? memberWinloss.loadingDetail_Hist : memberWinloss.loadingDetail_Post,
  tableData: hist ? memberWinloss.betDetailData_Hist || [] : memberWinloss.betDetailData_Post || [],
  totalData: hist ? memberWinloss.betDetailTotal_Hist : memberWinloss.betDetailTotal_Post,
  summary: hist ? memberWinloss.betDetailSummary_Hist : memberWinloss.betDetailSummary_Post,
})

const mapDispatchToProps = dispatch => ({
  LoadBetDetail: payload => {
    dispatch({
      type: actions.LOAD_TABLE_DETAIL,
      payload,
      source: 'Member Winloss',
    })
  },
  CleanUpDetail: () => dispatch({ type: actions.CLEAN_UP_DETAIL }),
})

const WinlossBetDetail = ({
  detailValue,
  prevMode,
  hist,
  loadingData,
  tableData,
  totalData,
  summary,

  LoadBetDetail,
  CleanUpDetail,
}) => {
  React.useEffect(() => CleanUpDetail, [CleanUpDetail])

  const {
    getBranchDescription,
    getSportDescription,
    getGameTypeDescription,
    getProductDescription,
    getCurrencyDescription,
    getVIPDescription,
    getPlatformDescription,
    getGTGroupDescription,
  } = useReportOptions()

  const onChange = React.useCallback(
    pagination => {
      LoadBetDetail({ ...detailValue, ...pagination, hist_or_post: hist ? '_Hist' : '_Post' })
    },
    [LoadBetDetail, detailValue, hist],
  )

  const header = (
    <Breadcrumb separator=">>">
      {prevMode.map(x => (
        <Breadcrumb.Item key={x.key}>{x.label}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )

  return (
    <Flex vertical className="h-100">
      <Collapse bordered={false}>
        <Panel key="1" header={header}>
          <Row>
            <Col span={8}>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="GL Date">{`${detailValue.gl_date_from} - ${detailValue.gl_date_to}`}</Descriptions.Item>
                <Descriptions.Item label="Match ID">{detailValue.match_id}</Descriptions.Item>
                <Descriptions.Item label="League ID">{detailValue.league_id}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Branch">
                  {getBranchDescription(detailValue.branch_id)}
                </Descriptions.Item>
                <Descriptions.Item label="Sport">
                  {getSportDescription(detailValue.sport_id)}
                </Descriptions.Item>
                <Descriptions.Item label="Game Type">
                  {getGameTypeDescription(detailValue.game_type)}
                </Descriptions.Item>
                <Descriptions.Item label="Product">
                  {getProductDescription(detailValue.product)}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Currency">
                  {getCurrencyDescription(detailValue.currency)}
                </Descriptions.Item>
                <Descriptions.Item label="Customer VIP">
                  {getVIPDescription(detailValue.vip_code)}
                </Descriptions.Item>
                <Descriptions.Item label="GT Group">
                  {getGTGroupDescription(detailValue.st_live)}
                </Descriptions.Item>
                <Descriptions.Item label="Platform">
                  {getPlatformDescription(detailValue.txn_type)}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Panel>
      </Collapse>

      <TableBetDetail
        loading={loadingData}
        data={tableData}
        total={totalData}
        onChange={onChange}
        summary={summary}
      />
    </Flex>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(WinlossBetDetail)
