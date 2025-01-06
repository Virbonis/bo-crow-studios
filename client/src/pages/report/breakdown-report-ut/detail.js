import React from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Col, Collapse, Descriptions, Flex, Row } from 'antd'
import actions from 'redux/breakdown-report/actions'
import TableBetDetail from '../shared-components/table-bet-detail'
import useReportOptions from '../shared-components/useReportOptions'

const { Panel } = Collapse
const mapStateToProps = ({ breakdownReport }, { hist }) => ({
  loadingData: hist ? breakdownReport.loadingDetail_Hist : breakdownReport.loadingDetail_Post,
  tableData: hist
    ? breakdownReport.betDetailData_Hist.result || []
    : breakdownReport.betDetailData_Post.result || [],
  totalData: hist
    ? breakdownReport.betDetailData_Hist.total
    : breakdownReport.betDetailData_Post.total,
  summary: hist
    ? breakdownReport.betDetailData_Hist.summary
    : breakdownReport.betDetailData_Post.summary,
})

const mapDispatchToProps = dispatch => ({
  LoadBetDetail: payload => {
    dispatch({
      type: actions.LOAD_BET_DETAIL,
      payload,
      source: 'Breakdown Report UT',
    })
  },
  CleanUpDetail: () => dispatch({ type: actions.CLEAN_UP_DETAIL }),
})

const BreakdownReportDetail = ({
  detailValue,
  prevMode,

  loadingData,
  tableData,
  totalData,
  summary,

  LoadBetDetail,
  CleanUpDetail,
}) => {
  React.useEffect(() => CleanUpDetail, [CleanUpDetail])

  const {
    getBreakdownReportTypeDescription,
    getBranchDescription,
    getUserTeamDescription,
    getGameTypeDescription,
    getSportDescription,
    getSpecialCodeDescription,
    getCompetitionDescription,
    getProductDescription,
    getDrawDescription,
    getGTGroupDescription,
  } = useReportOptions()

  const onChange = React.useCallback(
    pagination => {
      LoadBetDetail({ ...detailValue, ...pagination })
    },
    [LoadBetDetail, detailValue],
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
                <Descriptions.Item label="Report Type">
                  {getBreakdownReportTypeDescription(detailValue.report_type)}
                </Descriptions.Item>
                <Descriptions.Item label="Match ID">{detailValue.match_id}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Branch">
                  {getBranchDescription(detailValue.branch_id)}
                </Descriptions.Item>
                <Descriptions.Item label="User Team">
                  {getUserTeamDescription(detailValue.user_team)}
                </Descriptions.Item>
                <Descriptions.Item label="Game Type">
                  {getGameTypeDescription(detailValue.game_type)}
                </Descriptions.Item>
                <Descriptions.Item label="Sport">
                  {getSportDescription(detailValue.sport_id)}
                </Descriptions.Item>
                <Descriptions.Item label="Match">
                  {getSpecialCodeDescription(detailValue.special_match)}
                </Descriptions.Item>
                <Descriptions.Item label="Competition">
                  {getCompetitionDescription(detailValue.competition)}
                </Descriptions.Item>
                <Descriptions.Item label="Product">
                  {getProductDescription(detailValue.product)}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Draw">
                  {getDrawDescription(detailValue.draw)}
                </Descriptions.Item>
                <Descriptions.Item label="GT Group">
                  {getGTGroupDescription(detailValue.st_live)}
                </Descriptions.Item>
                {/* <Descriptions.Item label="Currency">
                  {getCurrencyDescription(detailValue.currency)}
                </Descriptions.Item>
                <Descriptions.Item label="Platform">
                  {getPlatformDescription(detailValue.txn_type)}
                </Descriptions.Item>
                <Descriptions.Item label="Group">
                  {getGroupDescription(detailValue.price_group)}
                </Descriptions.Item> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownReportDetail)
