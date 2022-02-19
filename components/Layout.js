import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'
import Head from 'next/head'
import Header from './Header'
import ErrorModal from './ErrorModal'

const Layout = ({ children }) => (
  <Container>
    <Head>
      <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.14/semantic.min.css"
      />
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
    </Head>

    <Header />
    <Container style={{ marginTop: '7em' }}>
      { children }
    </Container>
    <ErrorModal />
  </Container>
)

Layout.propTypes = {
  children: PropTypes.node,
}

Layout.defaultProps = {
  children: null,
}

export default Layout
