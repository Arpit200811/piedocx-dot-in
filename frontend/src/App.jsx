import React, { Suspense, useEffect } from "react";
import NavBar from "./Components/NavBar";
import Slider from "./Components/Slider";
import Card from "./Components/Card";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AboutUs from "./Components/Aboutus1";
import AOS from "aos";
import "aos/dist/aos.css";
import Aboutus2 from "./Components/Aboutus2";
import Counter from "./Components/Counter";
import TeamSection from "./Components/TeamSection";
import Project from "./Components/Project";

// const Pricing = React.lazy(()=> { import("./Components/Pricing") })
import Pricing from "./Components/Pricing";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import AboutUscompany from "./Components/AboutUscompany";
import Contact from "./Components/Contact";
import Empsignup from "./Components/Empsignup";
import Emplogin from "./Components/Emplogin";
import Dashboard from "./Components/Dashboard";
import AdminDashboard from "./Components/AdminDashboard";
import Profile from "./Components/Profile";
import RootLayout from "./Components/RootLayout";
import Task from "./Components/Task";
import DashboardProject from "./Components/DashboardProject";
import GenTask from "./Components/GenTask";
import FullStackdev from "./Components/FullStackdev";
import AndroidDev from "./Components/AndroidDev";
import Services from "./Components/Services";
import DigitalMarketing from "./Components/DigitalMarketing";
// import termsconditions from './Components/termsconditions'
import PageNotfound from "./Components/PageNotfound";
import GraphicsDev from "./Components/GraphicsDev";
import WebDevelopment from "./Components/WebDevelopment";
import Domain from "./Components/Domain";
import CustomSoftware from "./Components/CustomSoftware";
import ErpSolution from "./Components/ErpSolution";
import CMSSolution from "./Components/CMSSolution";

import "./App.css";


function App() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      <BrowserRouter>
        <div className="overflow-x-hidden">
          
            <Routes>
              <Route path="/" element={<RootLayout><Home /> </RootLayout>} />
              <Route path="/team" element={<RootLayout><TeamSection /> </RootLayout>} />
              <Route path="/projects" element={<RootLayout><Project /> </RootLayout>} />
              <Route path="/services" element={<RootLayout><Services /> </RootLayout>} />
              <Route path="about" element={<RootLayout><AboutUscompany /> </RootLayout>} />
              <Route path="/contact" element={<RootLayout><Contact /> </RootLayout>} />
              <Route path="/emp-signup" element={<RootLayout><Empsignup /> </RootLayout>} />
              <Route path="/emp-login" element={<RootLayout><Emplogin /> </RootLayout>} />
              <Route path="/profile" element={<Dashboard><Profile /></Dashboard>} />
              <Route path="/task" element={<Dashboard><Task /></Dashboard>} />
              <Route path="/dashboard-project" element={<Dashboard><DashboardProject /></Dashboard>} />
              
              <Route path="full-stackdev" element={<RootLayout><FullStackdev /></RootLayout>} />
              <Route path="android-ios" element={<RootLayout><AndroidDev /></RootLayout>} />
              <Route path="DigitalMarketing" element={<RootLayout><DigitalMarketing /></RootLayout>} />
              <Route path="Graphic-design" element={<RootLayout><GraphicsDev /></RootLayout>} />
              <Route path="Web-Development" element={<RootLayout><WebDevelopment /></RootLayout>} />
              <Route path="Domain & Web Hosting" element={<RootLayout><Domain /></RootLayout>} />
              <Route path="Custom-Software-Development" element={<RootLayout><CustomSoftware /></RootLayout>} />
              <Route path="ERP-Solutions" element={<RootLayout><ErpSolution /></RootLayout>} />
              <Route path="cms-Solution" element={<RootLayout><CMSSolution/></RootLayout>} />
              <Route path="/services/full-stack" element={<RootLayout><FullStackdev /></RootLayout>} />
              <Route path="/services/android-ios" element={<RootLayout><AndroidDev /></RootLayout>} />
              <Route path="/services/DigitalMarketing" element={<RootLayout><DigitalMarketing /></RootLayout>} />
              <Route path="/services/Graphic-design" element={<RootLayout><GraphicsDev /></RootLayout>} />
              <Route path="/services/Web-Development" element={<RootLayout><WebDevelopment /></RootLayout>} />
              <Route path="/services/Domain & Web Hosting" element={<RootLayout><Domain /></RootLayout>} />
              <Route path="/services/Custom-Software-Development" element={<RootLayout><CustomSoftware /></RootLayout>} />
              <Route path="/services/ERP-Solutions" element={<RootLayout><ErpSolution /></RootLayout>} />
              <Route path="/services/cms-Solution" element={<RootLayout><CMSSolution /></RootLayout>} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/gen-task" element={<Dashboard><GenTask /></Dashboard>} />
              <Route path="*" element={<RootLayout><PageNotfound /></RootLayout>} />
            


              {/* <Route path='/terms-and-conditions' element={<termsconditions/>}/> */}
            </Routes>
         

          
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
