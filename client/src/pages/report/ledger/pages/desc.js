export const getDrillCustomerType = status7 => {
  let customer_type
  if (status7 === '0') customer_type = 'C'
  else if (status7 === '1') customer_type = 'H'
  else if (status7 === '2') customer_type = 'MC'
  else if (status7 === '9') customer_type = 'B'
  else if (status7 === '11') customer_type = 'HA'
  else if (status7 === '21') customer_type = 'MCA'
  else if (status7 === '96') customer_type = 'MS6'
  else if (status7 === '199') customer_type = 'HCMM'
  else if (status7 === '1199') customer_type = 'HACMM'

  return customer_type
}

export const getCustomerTypeDescription = currentCustomerType => {
  switch (currentCustomerType) {
    case 'C': // 0
      return 'Credit and Kiosk'
    case 'H': // 1
    case 'HCMM': // 199
      return 'Cash'
    case 'MC': // 2
      return 'M-Card'
    case 'B': // 9
      return 'Buyback'
    case 'HA': // 11
    case 'HACMM': // 1199
      return 'Cash Affiliate'
    case 'MCA': // 21
      return 'M-Card Affiliate'
    case 'MS6': // 96
      return 'Buyback II'
    default:
      return 'Combine Credit, Kiosk and Cash'
  }
}

export default getCustomerTypeDescription
