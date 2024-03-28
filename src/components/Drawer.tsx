import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import NavLinks from './NavLinks'
import siteLogo from '../assets/icon.svg'

function Drawer() {
  const [toggleMenu, setToggleMenu] = useState(false)
  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu)
  }
  return (
    <div className="flex flex-row w-full md:w-2/5">
      <FontAwesomeIcon
        icon={!toggleMenu ? faBars : faX}
        size="2x"
        className="md:hidden p-8 fixed top-0 right-0 z-10"
        onClick={handleToggleMenu}
      />
      <aside
        className={`
        drawer
        ${toggleMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <NavLinks />
        <div className="p-6 pb-12 md:pb-0 text-center">
          <img
            src={siteLogo}
            alt="graced.is logo"
            className="md:w-full w-2/3 mx-auto"
          />
        </div>
      </aside>
    </div>
  )
}

export default Drawer
