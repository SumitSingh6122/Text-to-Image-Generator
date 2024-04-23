import React from "react";
import './style.css';
const Header=()=>{
    return (

    <header className="header">

        <nav>
          <span className="logo">Ding Dong AI</span>  
        </nav>
        <div id="navigation">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
       <li> <a href="mailto:singhsumit61220@gmail.com" class="btn-talk">Let's Talk</a></li>
        </div>
    </header>
    );
}
export default Header;