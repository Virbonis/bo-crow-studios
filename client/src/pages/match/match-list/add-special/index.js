import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import '../custom.scss'
import { Descriptions, Spin, Divider } from 'antd'
import actions from 'redux/match-list/actions'
import Badminton from './badminton'
import Cricket from './cricket'
import ESport from './e-sport'
import Pool from './pool'
import Tennis from './tennis'
import Volley from './volley'
import Basket from './basket'
import Soccer from './soccer'

const mapStateToProps = ({ matchList }) => ({
  loadingHeader: matchList.loadingEdit,
  dataHeader: matchList.dataEdit,
  loadingSpecial: matchList.loadingSpecial,

  dataMatchSpecial: matchList.dataMatchSpecial,
  dataMatchSpecialMore: matchList.dataMatchSpecialMore,
})

const mapDispatchToProps = (dispatch, { addSpecialValue, successCallback }) => ({
  LoadSpecial: payload => {
    dispatch({
      type: actions.LOAD_MATCH_EDIT,
      payload,
      source: 'Match List',
    })
    dispatch({
      type: actions.LOAD_MATCH_SPECIAL,
      payload,
      source: 'Match List',
    })
    dispatch({
      type: actions.LOAD_MATCH_SPECIAL_MORE,
      payload,
      source: 'Match List',
    })
  },
  UpdateSpecial: payload => {
    dispatch({
      type: actions.UPDATE_MATCH_SPECIAL,
      payload: {
        ...payload,
        match_id: addSpecialValue.match_id,
        sport_id: addSpecialValue.sport_id,
      },
      successCallback,
      source: 'Match List',
    })
  },
  UpdateSpecialMore: payload => {
    dispatch({
      type: actions.UPDATE_MATCH_SPECIAL_MORE,
      payload: {
        ...payload,
        match_id: addSpecialValue.match_id,
        sport_id: addSpecialValue.sport_id,
      },
      successCallback,
      source: 'Match List',
    })
  },
  CleanUpSpecial: () => {
    dispatch({ type: actions.CLEAN_UP_DATA_EDIT })
    dispatch({ type: actions.CLEAN_UP_MATCH_SPECIAL })
    dispatch({ type: actions.CLEAN_UP_MATCH_SPECIAL_MORE })
  },
})

const AddSpecialMatch = ({
  addSpecialValue,
  loadingHeader,
  dataHeader,
  loadingSpecial,
  dataMatchSpecial,
  dataMatchSpecialMore,
  LoadSpecial,
  UpdateSpecial,
  UpdateSpecialMore,
  CleanUpSpecial,
}) => {
  useEffect(() => {
    LoadSpecial(addSpecialValue)
    return CleanUpSpecial
  }, [addSpecialValue, LoadSpecial, CleanUpSpecial])

  const Content = React.useMemo(() => {
    // 10, 11, 12, 16, 32, 38, 52, 35, 22
    switch (addSpecialValue.sport_id) {
      case 10:
        return Soccer
      case 11:
        return Tennis
      case 12:
        return Basket
      case 16:
      case 35:
        return Volley
      case 22:
        return Cricket
      case 32:
        return Badminton
      case 38:
        return Pool
      case 52:
        return ESport
      default:
        return null
    }
  }, [addSpecialValue.sport_id])

  return (
    <>
      <Spin spinning={loadingHeader}>
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="Match ID">{dataHeader?.match_id}</Descriptions.Item>
          <Descriptions.Item label="League">{dataHeader?.league_name}</Descriptions.Item>
          <Descriptions.Item label="Sport">{dataHeader?.sport_name}</Descriptions.Item>
          <Descriptions.Item label="Home - Away">
            {dataHeader?.home_name} - {dataHeader?.away_name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
      <Divider />
      <Spin spinning={loadingHeader || loadingSpecial}>
        <Content
          dataHeader={dataHeader}
          dataMatchSpecial={dataMatchSpecial}
          dataMatchSpecialMore={dataMatchSpecialMore}
          UpdateSpecial={UpdateSpecial}
          UpdateSpecialMore={UpdateSpecialMore}
        />
      </Spin>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSpecialMatch)
