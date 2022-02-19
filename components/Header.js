import React from 'react'
import { Menu } from 'semantic-ui-react'

import { Link } from '../server/routes'

const Header = () => (
  <Menu fixed="top" inverted>
    <Link route="/">
      <a className="item">EthWager</a>
    </Link>
    <Menu.Menu position="right">
      <Link route="/">
        <a className="item">Wagers</a>
      </Link>
      <Link route="/token">
        <a className="item">Token</a>
      </Link>
      <Link route="/wager/new">
        <a className="item">+ Create Wager</a>
      </Link>
    </Menu.Menu>
  </Menu>
)

export default Header
