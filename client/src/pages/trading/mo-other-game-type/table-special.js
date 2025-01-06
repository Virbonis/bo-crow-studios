import React from 'react'
import { Form } from 'antd'
import { listGT } from 'helper'
import { isEqual } from 'lodash'
import InputDecimal from 'components/blaise/custom/InputDecimal'
import { getValidatorOdds } from 'helper/form-validator'
import { defaultColumnsGT } from './hooks'
import { setOddsXClass, FormGT, TableGameType } from './table'

const TableSpecial = React.memo(
  ({ list, defaultColumns, onSubmit }) => {
    const mapColumns = React.useMemo(
      () => ({
        YN: [
          ...defaultColumns,
          {
            title: 'Yes',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} className={setOddsXClass(game_type, 'odds1')} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'No',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} className={setOddsXClass(game_type, 'odds2')} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        HA: [
          ...defaultColumns,
          {
            title: 'Home',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} className={setOddsXClass(game_type, 'odds1')} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Away',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} className={setOddsXClass(game_type, 'odds2')} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        HNB: [
          ...defaultColumns,
          {
            title: 'Away Team',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Draw',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} className="bg-yellow" />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        ANB: [
          ...defaultColumns,
          {
            title: 'Home Team',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Draw',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} className="bg-yellow" />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
        '12HD': [
          ...defaultColumns,
          {
            title: '1st Half',
            render: ({ game_type, odds1 }) => (
              <Form.Item name="odds1" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds1} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: '2nd Half',
            render: ({ game_type, odds2 }) => (
              <Form.Item name="odds2" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds2} />
              </Form.Item>
            ),
            width: 75,
          },
          {
            title: 'Draw',
            render: ({ game_type, odds3 }) => (
              <Form.Item name="odds3" rules={[{ validator: getValidatorOdds(game_type) }]} noStyle>
                <InputDecimal oldValue={odds3} />
              </Form.Item>
            ),
            width: 75,
          },
          ...defaultColumnsGT,
        ],
      }),
      [defaultColumns],
    )

    return (
      <>
        {Object.entries(mapColumns)
          .map(([gt, columns]) => [gt, columns, list.filter(y => listGT[gt].includes(y.game_type))]) // addlist to array
          .filter(([, , data]) => data.length > 0) // filter empty list
          .map(([gt, columns, data]) =>
            listGT[gt] // transform to single gametype
              .filter(x => data.some(y => y.game_type === x)) // filter gametype
              .map((game_type, index) => {
                const dataSource = data.find(y => y.game_type === game_type)
                return (
                  <FormGT
                    key={game_type}
                    game_type={game_type}
                    data={dataSource}
                    onSubmit={onSubmit}
                  >
                    <TableGameType
                      dataSource={[dataSource]}
                      columns={columns}
                      showHeader={index === 0}
                    />
                  </FormGT>
                )
              }),
          )}
      </>
    )
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
)

export default TableSpecial
