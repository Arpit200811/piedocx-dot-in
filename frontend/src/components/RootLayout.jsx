import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import BackButton from './BackButton'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.tidio.co/cak8dqn9vcafx7uuglwy7uhygemdiwma.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script if necessary, though Tidio might persist in DOM
      const tidioWidget = document.getElementById('tidio-chat');
      if (tidioWidget) tidioWidget.remove();
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <BackButton />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
