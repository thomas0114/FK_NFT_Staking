import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

import Layout from './Layout'

const Loading = () => (
  <Layout>
    <Dimmer active inverted page>
      <Loader size="massive">Loading...</Loader>
    </Dimmer>
  </Layout>
)

export default Loading
