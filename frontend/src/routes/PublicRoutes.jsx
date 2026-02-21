import { lazy } from "react";
import { Route } from "react-router-dom";

const Home = lazy(() => import("../components/Home"));
const AboutUscompany = lazy(() => import("../components/AboutUscompany"));
const Contact = lazy(() => import("../components/Contact"));
const TeamSection = lazy(() => import("../components/TeamSection"));
const Project = lazy(() => import("../components/Project"));
const Services = lazy(() => import("../components/Services"));
const Emplogin = lazy(() => import("../components/Emplogin"));
const Empsignup = lazy(() => import("../components/Empsignup"));
const StudentRegistration = lazy(() => import("../components/StudentRegistration"));
const StudentLogin = lazy(() => import("../components/StudentLogin"));
const StudentDashboard = lazy(() => import("../components/StudentDashboard"));
const PrivacyPolicy = lazy(() => import("../components/PrivacyPolicy"));
const TermsConditions = lazy(() => import("../components/TermsConditions"));
const RefundPolicy = lazy(() => import("../components/RefundPolicy"));
const Careers = lazy(() => import("../components/Careers"));
const FAQ = lazy(() => import("../components/FAQ"));
const PageNotfound = lazy(() => import("../components/PageNotfound"));

// Service Detail Pages
const FullStackdev = lazy(() => import("../components/FullStackdev"));
const AndroidDev = lazy(() => import("../components/AndroidDev"));
const DigitalMarketing = lazy(() => import("../components/DigitalMarketing"));
const GraphicsDev = lazy(() => import("../components/GraphicsDev"));
const WebDevelopment = lazy(() => import("../components/WebDevelopment"));
const Domain = lazy(() => import("../components/Domain"));
const CustomSoftware = lazy(() => import("../components/CustomSoftware"));
const ErpSolution = lazy(() => import("../components/ErpSolution"));
const CMSSolution = lazy(() => import("../components/CMSSolution"));
const IotSmartSystems = lazy(() => import("../components/IotSmartSystems"));
const AiMachineLearning = lazy(() => import("../components/AiMachineLearning"));
const BlockchainSolutions = lazy(() => import("../components/BlockchainSolutions"));
const SecuritySolutions = lazy(() => import("../components/SecuritySolutions"));
const DataScience = lazy(() => import("../components/DataScience"));
const UiUxDesign = lazy(() => import("../components/UiUxDesign"));

// Technology Sub-routes
const Mern = lazy(() => import("../components/Mern"));
const DotNetCoreServices = lazy(() => import("../components/DotNet-core"));
const PhpCoreServices = lazy(() => import("../components/PHP-core"));
const PythonServices = lazy(() => import("../components/Python"));
const AdvanceJavaServices = lazy(() => import("../components/Advance-java"));
const FlutterKotlinServices = lazy(() => import("../components/Flutter-kotlin"));

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
    <Route path="services/security" element={<SecuritySolutions />} />
    <Route path="services/data-science" element={<DataScience />} />
    <Route path="services/ui-ux" element={<UiUxDesign />} />

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
  </>
);
