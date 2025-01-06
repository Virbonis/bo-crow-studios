import React from 'react'
import { Form, Radio, Select, Space } from 'antd'
import { InputDecimal } from 'components/blaise'
import { getValidatorOdds } from 'helper'
import {
  optionsHDPNumber,
  optionsOUNumber,
} from 'pages/trading/mo-components/select-handicap-number'
import { FormGT, TableGameType } from '../table'
import { defaultColumnsGT } from '../hooks'

const TableQT = ({ tableData, defaultColumns, onSubmit }) => {
  const stFavValue = React.useMemo(
    () =>
      tableData
        .filter(e => e.key === 'result5')[0]
        .data.reduce((acc, curr) => {
          const { game_type, st_fav } = curr
          acc[game_type] = {
            ...acc,
            st_fav,
          }
          return acc
        }, {}),
    [tableData],
  )
  const [stFavIndirect, setSTFavIndirect] = React.useState()
  React.useEffect(() => setSTFavIndirect(stFavValue), [stFavValue])
  const getColumns = key => {
    if (key === 'result1') {
      const columns = [
        {
          title: '0',
          align: 'center',
          width: 75,
          render: ({ game_type, odds1 }) => (
            <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds1} />
            </Form.Item>
          ),
        },
        {
          title: '1+',
          align: 'center',
          width: 75,
          render: ({ game_type, odds2 }) => (
            <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds2} />
            </Form.Item>
          ),
        },
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result2') {
      const scoreList = [
        'Home/Home',
        'Home/Draw',
        'Home/Away',
        'Draw/Home',
        'Draw/Draw',
        'Draw/Away',
        'Away/Home',
        'Away/Draw',
        'Away/Away',
      ]
      const columns = [
        ...scoreList.map((e, idx) => ({
          title: e,
          align: 'center',
          width: 75,
          render: record => {
            return (
              <Form.Item
                name={`odds${idx + 1}`}
                rules={[{ validator: getValidatorOdds(record.game_type) }]}
                noStyle
              >
                <InputDecimal oldValue={record[`odds${idx + 1}`]} />
              </Form.Item>
            )
          },
        })),
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result3') {
      const scoreList = ['Q1 & Q2', 'Q1 & Q3', 'Q1 & Q4', 'Q2 & Q3', 'Q2 & Q4', 'Q3 & Q4']
      const columns = [
        ...scoreList.map((e, idx) => ({
          title: e,
          align: 'center',
          width: 125,
          render: record => {
            const startingKey1 = 1
            const startingKey2 = 2
            const startingKey3 = 3
            return (
              <Space direction="vertical" size={0}>
                <Form.Item
                  label="Home"
                  name={`odds${startingKey1 + idx + idx * 2}`}
                  rules={[{ validator: getValidatorOdds(record.game_type) }]}
                >
                  <InputDecimal oldValue={record[`odds${startingKey1 + idx + idx * 2}`]} />
                </Form.Item>
                <Form.Item
                  label="Away"
                  name={`odds${startingKey2 + idx + idx * 2}`}
                  rules={[{ validator: getValidatorOdds(record.game_type) }]}
                >
                  <InputDecimal oldValue={record[`odds${startingKey2 + idx + idx * 2}`]} />
                </Form.Item>
                <Form.Item
                  label="AOS"
                  name={`odds${startingKey3 + idx + idx * 2}`}
                  rules={[{ validator: getValidatorOdds(record.game_type) }]}
                >
                  <InputDecimal oldValue={record[`odds${startingKey3 + idx + idx * 2}`]} />
                </Form.Item>
              </Space>
            )
          },
        })),
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result4') {
      const columns = [
        {
          title: 'Home',
          align: 'center',
          width: 75,
          render: ({ game_type, odds1 }) => (
            <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds1} />
            </Form.Item>
          ),
        },
        {
          title: 'Away',
          align: 'center',
          width: 75,
          render: ({ game_type, odds2 }) => (
            <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
              <InputDecimal oldValue={odds2} />
            </Form.Item>
          ),
        },
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result5') {
      const columns = [
        {
          title: 'Handicap',
          align: 'center',
          width: 200,
          render: ({ game_type }) => (
            <Space.Compact>
              <Radio.Group
                className="d-flex flex-row justify-content-between"
                value={stFavIndirect?.[game_type].st_fav}
                onChange={e => setSTFavIndirect({ [game_type]: { st_fav: e.target.value } })}
                style={{ gap: 8 }}
              >
                <Radio value={-1} className="m-0 radio_right">
                  Home
                </Radio>
                <Form.Item name="handicap">
                  <Select options={optionsHDPNumber} size="small" style={{ width: 60 }} />
                </Form.Item>
                <Radio value={1} className="m-0">
                  Away
                </Radio>
              </Radio.Group>
            </Space.Compact>
          ),
        },
        {
          title: 'Home',
          align: 'center',
          width: 75,
          render: ({ odds1 }) => (
            <Form.Item name="odds1" noStyle>
              <InputDecimal oldValue={odds1} />
            </Form.Item>
          ),
        },
        {
          title: 'Away',
          align: 'center',
          width: 75,
          render: ({ odds2 }) => (
            <Form.Item name="odds2" noStyle>
              <InputDecimal oldValue={odds2} />
            </Form.Item>
          ),
        },
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result6') {
      const columns = [
        {
          title: 'Handicap',
          align: 'center',
          width: 75,
          render: () => (
            <Form.Item name="handicap">
              <Select
                options={optionsOUNumber}
                suffixIcon={null}
                size="small"
                style={{ width: 60 }}
              />
            </Form.Item>
          ),
        },
        {
          title: 'Over',
          align: 'center',
          width: 75,
          render: ({ odds1 }) => (
            <Form.Item name="odds1" noStyle>
              <InputDecimal oldValue={odds1} />
            </Form.Item>
          ),
        },
        {
          title: 'Under',
          align: 'center',
          width: 75,
          render: ({ odds2 }) => (
            <Form.Item name="odds2" noStyle>
              <InputDecimal oldValue={odds2} />
            </Form.Item>
          ),
        },
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result7') {
      const scoreList = ['2-1', '3-0', '3-1', '4-0', '2-2', '1-2', '0-3', '1-3', '0-4', 'AOS']
      const columns = [
        ...scoreList.map((e, idx) => ({
          title: e,
          align: 'center',
          width: 75,
          render: record => {
            return (
              <Form.Item
                name={`odds${idx + 1}`}
                rules={[{ validator: getValidatorOdds(record.game_type) }]}
                noStyle
              >
                <InputDecimal oldValue={record[`odds${idx + 1}`]} />
              </Form.Item>
            )
          },
        })),
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    if (key === 'result8') {
      const scoreList = [
        'Odd/Odd/Odd/Odd',
        'Odd/Odd/Odd/Even',
        'Odd/Odd/Even/Odd',
        'Odd/Even/Odd/Odd',
        'Even/Odd/Odd/Odd',
        'Even/Even/Even/Even',
        'Even/Even/Even/Odd',
        'Even/Even/Odd/Even',
        'Even/Odd/Even/Even',
        'Odd/Even/Even/Even',
        'Odd/Odd/Even/Even',
        'Odd/Even/Odd/Even',
        'Even/Odd/Even/Odd',
        'Even/Even/Odd/Odd',
        'Even/Odd/Odd/Even',
        'Odd/Even/Even/Odd',
      ]
      const columns = [
        ...scoreList.map((e, idx) => ({
          title: e,
          align: 'center',
          width: 120,
          render: record => {
            return (
              <Form.Item
                name={`odds${idx + 1}`}
                rules={[{ validator: getValidatorOdds(record.game_type) }]}
                noStyle
              >
                <InputDecimal oldValue={record[`odds${idx + 1}`]} />
              </Form.Item>
            )
          },
        })),
        ...defaultColumnsGT,
      ]
      return defaultColumns.concat(columns)
    }
    return null
  }
  return (
    <>
      {tableData.map(e =>
        e.data.map((dataSource, index) => (
          <FormGT
            key={dataSource.game_type}
            data={dataSource}
            onSubmit={onSubmit}
            game_type={dataSource.game_type}
            st_fav={dataSource.st_fav && stFavIndirect}
          >
            <TableGameType
              dataSource={[dataSource]}
              columns={getColumns(e.key)}
              showHeader={index === 0}
            />
          </FormGT>
        )),
      )}
    </>
  )
}

export default TableQT
