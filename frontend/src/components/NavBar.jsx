import React from 'react'
import {Link, NavLink} from 'react-router-dom';
export default function NavBar(props) {
  return (
<div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">E-Commerce</a>
  </div>
  <div className="flex flex-row gap-4">

    {/* <div>
      <button><Link to="/">Home</Link></button>
    </div>
    <div>
      <button><Link to="/add-product">Add Product</Link></button>
    </div>
    <div>
      <button><Link to="/about">About</Link></button>
    </div>
    <div>
      <Link to="/cart">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white bg-red-400 rounded-full px-2 py-1">
        {props.noOfItemInCart}
      </span>
        </div>
      </Link>
    </div> */}

<ul className="menu menu-horizontal px-1">
<li>
        <NavLink
            className={({ isActive }) => (isActive ? "font-bold" : "")}
            to="/menu"
        >
            Menu
        </NavLink>
    </li>
    <li>
        <NavLink
            className={({ isActive }) => (isActive ? "font-bold" : "")}
            to="/"
        >
            Home
        </NavLink>
    </li>
    <li>
        <NavLink
            className={({ isActive }) => (isActive ? "font-bold" : "")}
            to="/about"
        >
            About
        </NavLink>
    </li>
    <li>
        <NavLink
            className={({ isActive }) => (isActive ? "font-bold" : "")}
            to="/add-product"
        >
            Add Product
        </NavLink>
    </li>
    <li>
      <Link to="/cart">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white bg-red-400 rounded-full px-2 py-1">
        {props.noOfItemInCart}
      </span>
        </div>
      </Link>
    </li>
</ul>
  </div>
</div>
  )
}
