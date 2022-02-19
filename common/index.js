import moment from 'moment'

import web3 from '../lib/web3'

export const categoryOptions = [
  {
    text: 'Sports',
    value: 'Sports',
    // image: { avatar: true, src: '/assets/images.jpg'}
  },
  {
    text: 'Politics',
    value: 'Politics',
    // image: { avatar: true, src: '/assets/images.jpg'}
  },
  {
    text: 'Entertainment',
    value: 'Entertainment',
    // image: { avatar: true, src: '/assets/images.jpg'}
  },
  {
    text: 'Other',
    value: 'Other',
    // image: { avatar: true, src: '/assets/images.jpg'}
  },
]

const UNDEFINED_ADDRESS = '0x0000000000000000000000000000000000000000'

export const isDefinedAddress = address => address !== UNDEFINED_ADDRESS

export const unixToDisplayDate = timestamp =>
  moment.utc(moment.unix(timestamp)).local().format('MM/DD/YYYY hh:mm A')

export const isValidAddress = address => web3.utils.isAddress(address) && isDefinedAddress(address)
export const isPositiveValue = value => parseInt(value, 10) > 0
