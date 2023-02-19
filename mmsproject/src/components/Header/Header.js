import React, {useState} from 'react';

import './Header.css';

import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import Logo from '../../assets/logo.jpg';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

import { NavLink, Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
} from 'reactstrap';


const Header = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);
  return (
    <header onClick={toggleNavbar} className="header">
      
       <Navbar color="white" light className="navbar-main">
       
        <NavbarBrand href="/" className="me-auto">
<Container className="navbrand">
  
<Link style={{textDecoration: 'none'}} to="/"  exact>
<img src={Logo} alt="logo" className="login__logo" />
<h1>Assessment</h1>
        
        </Link>
</Container>
       

        </NavbarBrand>
        <Collapse isOpen={!collapsed} navbar className="collapse-menu">
          <Nav navbar>
            <NavItem>
            <NavLink to="/" exact>
        <HomeOutlinedIcon />
        Dashboard
      </NavLink>
            </NavItem>
            <NavItem>
            <NavLink to="/locations" exact>
        <LocationOnOutlinedIcon />
        Locations
      </NavLink>
            </NavItem>
            <NavItem>
            <NavLink to="/search">
        <SearchOutlinedIcon />
        Search
      </NavLink>
            </NavItem>
            <NavItem>
            <NavLink to="/newpost">
        <AddBoxOutlinedIcon />
        New Location
      </NavLink>
            </NavItem>
            <NavItem>
            <NavLink to="/profile">
        <AccountCircleOutlinedIcon />
        Profile
      </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
        <NavbarToggler onClick={toggleNavbar} className="me-2" />

      </Navbar>
     
      {/* <div>
       <h5>MMS Image Geolocation App</h5>
      </div>
      <NavLink to="/" exact>
        <HomeOutlinedIcon />
      </NavLink>
      <NavLink to="/search">
        <SearchOutlinedIcon />
      </NavLink>
      <NavLink to="/newpost">
        <AddBoxOutlinedIcon />
      </NavLink>
      <NavLink to="/profile">
        <AccountCircleOutlinedIcon />
      </NavLink> */}
    </header>
  );
}

export default Header;