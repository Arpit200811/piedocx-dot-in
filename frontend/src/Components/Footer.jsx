import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount >= 15) {
      setClickCount(0);
      window.open("/developer", "_blank");
    }
  }, [clickCount]);

  const handleSecretClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="bg-zinc-600 pt-12 pb-2 text-white font-sans">
      <div className="mx-auto w-full max-w-[1166px] px-4 xl:px-0">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Column 1: Company Info */}
          <div className="md:w-[316px]">
            <h1 className="font-bold text-2xl tracking-wide text-white">
              <span className="text-blue-500">Piedocx </span>Technologies
            </h1>
            <p className="mt-4 text-sm text-gray-300 leading-6 hover:text-white transition duration-300">
              Piedocx is a top-tier software development company known for
              innovative, high-quality tech solutions and a strong focus on
              client satisfaction across industries.
            </p>
            <div className="mt-4 flex gap-4 flex-wrap">
              <Link to="#" target="_blank" className="hover:scale-110 transition duration-300">
                <img src="Facebook.png" width={36} />
              </Link>
              <Link to="/" target="_blank" className="hover:scale-110 transition duration-300">
                <img src="linke.webp" width={36} />
              </Link>
              <Link
                to="https://www.instagram.com/piedocx?igsh=aTZsbTdmNHdndnlr"
                target="_blank"
                className="hover:scale-110 transition duration-300"
              >
                <img src="instagram.webp" width={36} />
              </Link>
              <Link to="#" target="_blank" className="hover:scale-110 transition duration-300">
                <img src="Twitter.webp" width={36} />
              </Link>
              <Link to="https://www.youtube.com/" target="_blank" className="hover:scale-110 transition duration-300">
                <img src="youtube.webp" width={36} />
              </Link>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="md:w-[316px] space-y-6">
            <div>
              <p className="text-sm font-bold text-white mb-1 uppercase tracking-wide">Support Number</p>
              <Link to="tel:+916307503700" className="block text-sm text-gray-300 hover:text-blue-400 transition">
                +91 6307503700
              </Link>
              <Link to="tel:+918114247881" className="block text-sm text-gray-300 hover:text-blue-400 transition">
                +91 8114247881
              </Link>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1 uppercase tracking-wide">Support Email</p>
              <Link to="mailto:info@piedocx.com" className="text-sm text-gray-300 hover:text-blue-400 transition">
                info@piedocx.com
              </Link>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1 uppercase tracking-wide">Address</p>
              <Link
                to="https://www.google.com/maps/place/Piedocx+Technologies+Pvt.+Ltd./..."
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 leading-relaxed hover:text-blue-400 transition"
              >
                Plot no.5 Chandralok Colony, near Purania Chauraha, Aliganj, Lucknow, UP 226024
              </Link>
            </div>
          </div>

          {/* Column 3: Services & App */}
          <div className="md:max-w-[341px] w-full flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <p className="text-sm font-bold text-white mb-1 uppercase tracking-wide">Services</p>
              <ul className="text-sm mt-2 space-y-2 text-gray-300">
                <li>
                  <Link to="/Custom-Software-Development" className="hover:text-blue-400 transition">
                    Software Development
                  </Link>
                </li>
                <li>
                  <Link to="/full-stackdev" className="hover:text-blue-400 transition">
                    Full-Stack Development
                  </Link>
                </li>
                <li>
                  <Link to="/android-ios" className="hover:text-blue-400 transition">
                    Android & IOS Development
                  </Link>
                </li>
                <li>
                  <Link to="/Domain & Web Hosting" className="hover:text-blue-400 transition">
                    Domain & Web Hosting
                  </Link>
                </li>
                <li>
                  <Link to="/Graphic-design" className="hover:text-blue-400 transition">
                    Graphic Design
                  </Link>
                </li>
                <li>
                  <Link to="/DigitalMarketing" className="hover:text-blue-400 transition">
                    Digital Marketing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold text-white mb-1 uppercase tracking-wide">Download the App</p>
              <div className="flex flex-col gap-3 mt-2">
                <Link to="#" target="_blank" className="hover:scale-105 transition duration-300">
                  <img src="play.png" width={168} height={50} />
                </Link>
                <Link to="#" target="_blank" className="hover:scale-105 transition duration-300">
                  <img src="start.png" width={168} height={50} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="mt-10 border-white/20" />
        <div className="text-center py-6 text-[13px] md:text-sm text-gray-300">
          <p>
            © 2025, All Rights Reserved by Piedocx Team
            &nbsp;&nbsp;|&nbsp;&nbsp; Designed by{" "}
            <span
              onClick={handleSecretClick}
              className="text-blue-300 underline hover:text-blue-400 font-semibold cursor-pointer"
            >
              Piedocx Technical Team
            </span>
            &nbsp;&nbsp;|&nbsp;&nbsp; Developed by{" "}
            <span
              onClick={handleSecretClick}
              className="text-blue-300 underline hover:text-blue-400 font-semibold cursor-pointer"
            >
              Piedocx Team
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
