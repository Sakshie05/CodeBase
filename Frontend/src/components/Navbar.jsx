import React from 'react';
import {Link} from "react-router-dom";
import logo from "../assets/github-mark-white.svg"

const Navbar = async () => {
    return(
        <nav>
            <img src={logo}></img>
        </nav>
    );
}

export default Navbar;