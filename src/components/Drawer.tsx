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
    <div className="flex flex-row w-5/6 md:w-1/5">
      <FontAwesomeIcon
        icon={!toggleMenu ? faBars : faX}
        size="2x"
        className="md:hidden p-8 md:w-0 ease-in-out transition-all duration-300 fixed top-0 right-0"
        onClick={handleToggleMenu}
      />
      <aside
        className={`fixed md:relative md:sticky top-0 h-screen bg-[#f7f2f7] border-r shadow-md md:py-6 pt-2 pb-6 flex flex-col justify-between md:transform-none ease-in-out transition-all duration-300
        ${toggleMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <NavLinks />
        <div className="p-6 pb-0 text-center">
          <img src={siteLogo} alt="graced.is logo" className="w-full" />
        </div>
      </aside>
    </div>
  )
}

export default Drawer
