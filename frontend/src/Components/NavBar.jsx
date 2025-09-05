// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";

// const NavBar = () => {
//   const [showNav, setShowNav] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [isLocked, setIsLocked] = useState(false);
//   const [hasBeenHidden, setHasBeenHidden] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "Services", path: "/services" },
//     { name: "Projects", path: "/projects" },
//     { name: "Our Team", path: "/team" },
//     { name: "About Us", path: "/about" },
//     { name: "Contact", path: "/contact" },
//   ];

//   const isActive = (path) => location.pathname === path;

//   // Hide/show nav on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       if (isLocked) return;

//       if (currentScrollY <= 5) {
//         setShowNav(true);
//         setHasBeenHidden(false);
//       } else if (currentScrollY > lastScrollY && currentScrollY > 5) {
//         setShowNav(false);
//         setHasBeenHidden(true);
//       } else if (
//         currentScrollY < lastScrollY &&
//         currentScrollY >= 40 &&
//         hasBeenHidden
//       ) {
//         setShowNav(true);
//         setIsLocked(true);
//       }

//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY, isLocked, hasBeenHidden]);

//   // Close menu on route change
//   useEffect(() => {
//     setIsOpen(false);
//   }, [location.pathname]);

//   // Lock scroll when mobile menu is open
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "";
//   }, [isOpen]);

//   // Close menu on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         isOpen &&
//         !event.target.closest(".mobile-menu") &&
//         !event.target.closest(".menu-toggle")
//       ) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isOpen]);

//   // Close menu on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       if (isOpen) {
//         setIsOpen(false);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isOpen]);

//   return (
//     <nav
//       className={`fixed top-0 w-full z-50 bg-white shadow-md transition-transform duration-500 ease-in-out ${
//         showNav ? "translate-y-0" : "-translate-y-full"
//       }`}
//     >
//       <div className="max-w-screen-xl mx-auto px-4 py-3 sm:py-3.5 md:py-4 lg:py-5 flex items-center justify-between lg:justify-center font-poppins relative">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2 absolute left-4">
//           <img src="/logo.png" alt="Logo" className="h-10 w-auto lg:h-11" />
//         </Link>

//         {/* Desktop Nav */}
//         <ul className="hidden lg:flex gap-6 font-medium">
//           {navLinks.map(({ name, path }) => (
//             <li key={path} className="relative group">
//               <Link
//                 to={path}
//                 className={`transition-colors duration-300 ${
//                   isActive(path)
//                     ? "text-blue-700 font-semibold"
//                     : "text-gray-800"
//                 }`}
//               >
//                 {name}
//               </Link>
//               <span
//                 className={`absolute left-0 -bottom-1 h-[2px] bg-blue-700 transition-all duration-300 group-hover:w-full ${
//                   isActive(path) ? "w-full" : "w-0"
//                 }`}
//               ></span>
//             </li>
//           ))}
//         </ul>

//         {/* Hamburger / Up Arrow Icon */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="menu-toggle lg:hidden text-gray-800 absolute right-4"
//         >
//           {isOpen ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-6 h-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-6 h-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </button>
//       </div>

//       {/* Mobile Nav */}
//       <div
//         className={`mobile-menu lg:hidden absolute top-full left-0 w-full bg-white shadow-md px-4 font-poppins z-40 transition-all duration-500 ${
//           isOpen ? "max-h-screen py-3.5 sm:py-3.5 md:py-4" : "max-h-0 overflow-hidden"
//         }`}
//       >
//         <ul className="flex flex-col items-start gap-1.5 sm:gap-2 md:gap-2.5 font-medium text-left">
//           {navLinks.map(({ name, path }) => (
//             <li key={path} className="w-full">
//               <Link
//                 to={path}
//                 className={`block w-full py-2.5 sm:py-3 md:py-3.5 px-3 rounded-md transition-all duration-300 ${
//                   isActive(path)
//                     ? "bg-blue-100 text-blue-700 font-semibold"
//                     : "text-gray-800 hover:bg-blue-50"
//                 }`}
//               >
//                 {name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;




import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasBeenHidden, setHasBeenHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Our Team", path: "/team" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  // Track window width for responsive padding
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide/show nav & close menu on scroll (mobile-safe)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Hide/show nav
          if (!isLocked) {
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
          }

          // Close mobile menu on scroll
          if (isOpenRef.current) setIsOpen(false);

          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isLocked, hasBeenHidden]);

  // Close menu on route change
  useEffect(() => setIsOpen(false), [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  // Close menu on outside click
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
      className="fixed top-0 w-full z-50 bg-white shadow-md transition-transform duration-500 ease-in-out"
      style={{ transform: showNav ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div
        className="max-w-screen-xl mx-auto px-4 flex items-center justify-between lg:justify-center font-poppins relative transition-all duration-300 ease-in-out"
        style={{
          paddingTop:
            windowWidth < 1024
              ? isOpen
                ? "1.5rem"
                : "1.5rem"
              : isOpen
              ? "1.2rem"
              : "0.8rem",
          paddingBottom:
            windowWidth < 1024
              ? isOpen
                ? "1.5rem"
                : "1.5rem"
              : isOpen
              ? "1.2rem"
              : "0.8rem",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 absolute left-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto lg:h-11 transition-all duration-300"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-6 font-medium">
          {navLinks.map(({ name, path }) => (
            <li key={path} className="relative group">
              <Link
                to={path}
                className={`transition-colors duration-300 ${
                  isActive(path)
                    ? "text-blue-700 font-semibold"
                    : "text-gray-800"
                }`}
              >
                {name}
              </Link>
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-blue-700 transition-all duration-300 group-hover:w-full ${
                  isActive(path) ? "w-full" : "w-0"
                }`}
              ></span>
            </li>
          ))}
        </ul>

        {/* Hamburger / Page-Up Arrow Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="menu-toggle lg:hidden text-gray-800 absolute right-4 transition-transform duration-500 ease-in-out"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
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
        className="mobile-menu lg:hidden absolute top-full left-0 w-full bg-white shadow-md px-4 font-poppins z-40 transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          height: isOpen ? "auto" : "0",
          paddingTop: isOpen ? "0.8rem" : "0",
          paddingBottom: isOpen ? "0.8rem" : "0",
          transform: "translateZ(0)", // hardware acceleration for mobile
        }}
      >
        <ul className="flex flex-col items-start gap-2 font-medium text-left">
          {navLinks.map(({ name, path }) => (
            <li key={path} className="w-full">
              <Link
                to={path}
                className={`block w-full py-2 px-3 rounded-md transition-all duration-300 ${
                  isActive(path)
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-800 hover:bg-blue-50"
                }`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;

