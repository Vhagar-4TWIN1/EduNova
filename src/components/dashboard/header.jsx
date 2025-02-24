import React from 'react';

const Header = () => {
  return (
    <header className="app-header fixed-top">
      <div className="app-header-inner">
        <div className="container-fluid py-2">
          <div className="app-header-content">
            <div className="row justify-content-between align-items-center">
              <div className="col-auto">
                <a id="sidepanel-toggler" className="sidepanel-toggler d-inline-block d-xl-none" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" role="img">
                    <title>Menu</title>
                    <path stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M4 7h22M4 15h22M4 23h22"></path>
                  </svg>
                </a>
              </div>
              <div className="col">
                <div className="app-search-box">
                  <form className="app-search-form">
                    <input type="text" placeholder="Search..." name="search" className="form-control search-input" />
                    <button type="submit" className="btn search-btn btn-primary" value="Search">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-auto">
                <div className="app-utilities">
                  {/* Ajoutez les icônes et les menus ici */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;