import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return <div className="navbar is-primary">
    <div className="navbar-start ">
      {/* <img className="logo" src="https://i.imgur.com/9j8FdC2.png" alt="logo" width="100" height="20"/> */}
    </div>
    <div className="navbar-end">
      <div className="navbar-brand">
        <a role="button" className="navbar-item">
          <Link to={'/project-2'}>Home</Link>
        </a>
        <a className="navbar-item">
          <Link to={'/project-2/allcocktails'}>All Cocktails</Link>
        </a>
      </div>
    </div>
  </div >
}