import Web3 from 'web3'

const PROVIDER_URI = `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`

let web3

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum)
} else {
  const provider = new Web3.providers.HttpProvider(PROVIDER_URI)
  web3 = new Web3(provider)
}

export default web3

export const getProvider = () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    window.ethereum.enable()
    return window.ethereum
  }
  const provider = new Web3.providers.HttpProvider(PROVIDER_URI)
  return provider
}
