import React from 'react';

const Sidebar = () => {
  return (
    <div id="app-sidepanel" className="app-sidepanel">
      <div id="sidepanel-drop" className="sidepanel-drop"></div>
      <div className="sidepanel-inner d-flex flex-column">
        <a href="#" id="sidepanel-close" className="sidepanel-close d-xl-none">&times;</a>
        <div className="app-branding">
          <a className="app-logo" href="index.html">
            <img className="logo-icon me-2" src="assets/images/app-logo.svg" alt="logo" />
            <span className="logo-text">PORTAL</span>
          </a>
        </div>
        <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
          <ul className="app-menu list-unstyled accordion" id="menu-accordion">
            {/* Ajoutez les éléments du menu ici */}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;