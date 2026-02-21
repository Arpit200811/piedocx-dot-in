import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const NavBar = () => {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasBeenHidden, setHasBeenHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [studentUser, setStudentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem('studentData');
    if (data) {
      setStudentUser(JSON.parse(data));
    } else {
      setStudentUser(null);
    }
  }, [location]); // Re-check on route change (like after login/logout)

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        setStudentUser(null);

        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/student-login');
        });
      }
    });
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Our Team", path: "/team" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  // Hide/show nav on scroll + auto-close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isLocked) return;

      if (currentScrollY <= 5) {
        setShowNav(true);
        setHasBeenHidden(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 5) {
        setShowNav(false);
        setHasBeenHidden(true);
      } else if (
        currentScrollY < lastScrollY &&
        currentScrollY >= 40 &&
        hasBeenHidden
      ) {
        setShowNav(true);
        setIsLocked(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleMenuCloseOnScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleMenuCloseOnScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleMenuCloseOnScroll);
    };
  }, [lastScrollY, isLocked, hasBeenHidden, isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Auto-close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".menu-toggle")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm transition-transform duration-500 ease-in-out ${showNav ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-14 md:h-16 lg:h-20 flex items-center justify-between font-poppins relative">
        {/* Logo Left */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/pie_logo.png"
            alt="Logo"
            className="h-10 md:h-12 lg:h-14 w-auto object-contain mix-blend-multiply"
          />
        </Link>

        {/* Desktop Nav Links Center */}
        <ul className="hidden lg:flex gap-4 xl:gap-6 font-medium text-xs lg:text-sm xl:text-base items-center justify-center flex-1 px-4">
          {navLinks.map(({ name, path }) => (
            <li key={path} className="relative group flex-shrink-0">
              <Link
                to={path}
                className={`transition-colors duration-300 px-1 py-1 ${isActive(path)
                    ? "text-blue-700 font-bold"
                    : "text-gray-800 hover:text-blue-600"
                  }`}
              >
                {name}
              </Link>
              <span
                className={`absolute left-0 -bottom-1 h-[2.5px] bg-blue-700 transition-all duration-300 group-hover:w-full ${isActive(path) ? "w-full" : "w-0"
                  }`}
              ></span>
            </li>
          ))}
        </ul>

        {/* Desktop Search & Action - Right Side */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
          {studentUser ? (
            <div className="flex items-center gap-3 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <Link to="/student-dashboard" className="flex items-center gap-2 hover:bg-blue-100 rounded-full px-2 py-1 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {studentUser.firstName?.[0] || 'S'}
                </div>
                <span className="text-sm font-bold text-slate-700 mr-2">
                  {studentUser.firstName || 'Student'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/student-login"
                className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 text-[10px] lg:text-xs font-bold uppercase tracking-wide hover:bg-blue-50 transition-all whitespace-nowrap"
              >
                Student Login
              </Link>
              <Link
                to="/student-registration"
                className="px-4 py-2 rounded-full bg-blue-600 text-white text-[10px] lg:text-xs font-bold uppercase tracking-wide shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                Register
              </Link>
            </div>
          )}

          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="flex items-center gap-2 px-3 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all text-sm font-medium group hover:shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
        </div>


        {/* Hamburger Icon (Mobile/Tablet) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="menu-toggle lg:hidden text-gray-800 p-2"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`mobile-menu lg:hidden absolute top-full left-0 w-full bg-white shadow-xl font-poppins z-50 transition-all duration-500 overflow-hidden ${isOpen ? "max-h-screen py-6" : "max-h-0"
          }`}
      >
        <ul className="flex flex-col items-center gap-3 px-6 font-medium text-lg">
          {navLinks.map(({ name, path }) => (
            <li key={path} className="w-full text-center">
              <Link
                to={path}
                className={`block w-full py-3 rounded-xl transition-all duration-300 ${isActive(path)
                    ? "bg-blue-600 text-white font-bold"
                    : "text-gray-800 hover:bg-blue-50"
                  }`}
              >
                {name}
              </Link>
            </li>
          ))}

          <li className="w-full text-center flex flex-col gap-3">
            {studentUser ? (
              <>
                <Link
                  to="/student-dashboard"
                  className="block w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="block w-full py-3 rounded-xl border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/student-login"
                  className="block w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Student Login
                </Link>
                <Link
                  to="/student-registration"
                  className="block w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Register New Student
                </Link>
              </>
            )}
          </li>

          <li className="w-full text-center">
            <button
              onClick={() => { setIsOpen(false); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })); }}
              className="w-full py-3 rounded-xl text-gray-800 hover:bg-blue-50 transition-all duration-300 border border-slate-100 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              Search
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
