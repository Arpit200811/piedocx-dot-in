import { lazy } from "react";
import { Route } from "react-router-dom";

const Home = lazy(() => import("../Components/Home"));
const AboutUscompany = lazy(() => import("../Components/AboutUscompany"));
const Contact = lazy(() => import("../Components/Contact"));
const TeamSection = lazy(() => import("../Components/TeamSection"));
const Project = lazy(() => import("../Components/Project"));
const Services = lazy(() => import("../Components/Services"));
const Emplogin = lazy(() => import("../Components/Emplogin"));
const Empsignup = lazy(() => import("../Components/Empsignup"));
const StudentRegistration = lazy(() => import("../Components/StudentRegistration"));
const StudentLogin = lazy(() => import("../Components/StudentLogin"));
const StudentDashboard = lazy(() => import("../Components/StudentDashboard"));
const PrivacyPolicy = lazy(() => import("../Components/PrivacyPolicy"));
const TermsConditions = lazy(() => import("../Components/TermsConditions"));
const RefundPolicy = lazy(() => import("../Components/RefundPolicy"));
const Careers = lazy(() => import("../Components/Careers"));
const FAQ = lazy(() => import("../Components/FAQ"));
const PageNotfound = lazy(() => import("../Components/PageNotfound"));

// Service Detail Pages
const FullStackdev = lazy(() => import("../Components/FullStackdev"));
const AndroidDev = lazy(() => import("../Components/AndroidDev"));
const DigitalMarketing = lazy(() => import("../Components/DigitalMarketing"));
const GraphicsDev = lazy(() => import("../Components/GraphicsDev"));
const WebDevelopment = lazy(() => import("../Components/WebDevelopment"));
const Domain = lazy(() => import("../Components/Domain"));
const CustomSoftware = lazy(() => import("../Components/CustomSoftware"));
const ErpSolution = lazy(() => import("../Components/ErpSolution"));
const CMSSolution = lazy(() => import("../Components/CMSSolution"));
const IotSmartSystems = lazy(() => import("../Components/IotSmartSystems"));
const AiMachineLearning = lazy(() => import("../Components/AiMachineLearning"));
const BlockchainSolutions = lazy(() => import("../Components/BlockchainSolutions"));

// Technology Sub-routes
const Mern = lazy(() => import("../Components/Mern"));
const DotNetCoreServices = lazy(() => import("../Components/DotNet-core"));
const PhpCoreServices = lazy(() => import("../Components/PHP-core"));
const PythonServices = lazy(() => import("../Components/Python"));
const AdvanceJavaServices = lazy(() => import("../Components/Advance-java"));
const FlutterKotlinServices = lazy(() => import("../Components/Flutter-kotlin"));

export const PublicRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="team" element={<TeamSection />} />
    <Route path="developer" element={<TeamSection />} />
    <Route path="projects" element={<Project />} />
    <Route path="services" element={<Services />} />
    <Route path="about" element={<AboutUscompany />} />
    <Route path="contact" element={<Contact />} />
    <Route path="emp-signup" element={<Empsignup />} />
    <Route path="emp-login" element={<Emplogin />} />
    
    {/* Service Sub-routes */}
    <Route path="services/full-stack" element={<FullStackdev />} />
    <Route path="services/android-ios" element={<AndroidDev />} />
    <Route path="services/digital-marketing" element={<DigitalMarketing />} />
    <Route path="services/graphic-design" element={<GraphicsDev />} />
    <Route path="services/web-development" element={<WebDevelopment />} />
    <Route path="services/domain-web-hosting" element={<Domain />} />
    <Route path="services/custom-software" element={<CustomSoftware />} />
    <Route path="services/erp-solutions" element={<ErpSolution />} />
    <Route path="services/cms-solution" element={<CMSSolution />} />
    <Route path="services/iot" element={<IotSmartSystems />} />
    <Route path="services/ai-ml" element={<AiMachineLearning />} />
    <Route path="services/blockchain" element={<BlockchainSolutions />} />
    
    {/* Technology Sub-routes */}
    <Route path="aboutus1/mern" element={<Mern />} />
    <Route path="aboutus1/dotnet-core" element={<DotNetCoreServices />} />
    <Route path="aboutus1/php-core" element={<PhpCoreServices />} />
    <Route path="aboutus1/python" element={<PythonServices />} />
    <Route path="aboutus1/advance-java" element={<AdvanceJavaServices />} />
    <Route path="aboutus1/flutter-kotlin" element={<FlutterKotlinServices />} />

    {/* Legal & Extra Routes */}
    <Route path="privacy-policy" element={<PrivacyPolicy />} />
    <Route path="terms-conditions" element={<TermsConditions />} />
    <Route path="refund-policy" element={<RefundPolicy />} />
    <Route path="careers" element={<Careers />} />
    <Route path="faq" element={<FAQ />} />
    
    {/* Student Related (Public entry points) */}
    <Route path="student-registration" element={<StudentRegistration />} />
    <Route path="student-login" element={<StudentLogin />} />

    <Route path="*" element={<PageNotfound />} />
  </>
);
