import React, { useContext } from 'react'
import SelectedContext from '../context'

const CheckboxACRJ = ({ id }) => {
  const [voidTicketIDs, setVoidTicketIDs] = useContext(SelectedContext)
  const checked = voidTicketIDs.includes(id)
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={e => {
        if (e.target.checked) setVoidTicketIDs(prev => [...prev, id])
        else setVoidTicketIDs(prev => prev.filter(x => x !== id))
        // ticket="BetIDxMatchID^BetID^GameTypeID^StatusTicket^MatchID"
      }}
    />
  )
}
export default CheckboxACRJ
