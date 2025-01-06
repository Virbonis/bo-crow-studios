import React from 'react'
import { QueryBetListCS } from './query'
import TableBetListCS from './table-betlist-cs'

const ContentCS = React.memo(({ editValue }) => {
  const { data } = QueryBetListCS(editValue)

  return <TableBetListCS data={data} />
})

export default ContentCS
