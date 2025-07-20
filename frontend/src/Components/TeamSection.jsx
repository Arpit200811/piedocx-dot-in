import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const teamMembers = [
  {
    name: "Savan Rai",
    role: "CEO & Founder",
    img: "/Savanrai.jpg",
    description:
      "With over 6 years of experience in leadership and software development, I founded this company to turn innovation into real impact. My vision is to drive sustainable growth through agility, accountability, and purpose-driven execution. Together, we build more than products—we build lasting value.",
  },
  {
    name: "Arpit Gupta",
    role: "MERN STACK Developer",
    img: "/Arpit.jpg",
    description:
      "Arpit Gupta is a results-driven MERN stack developer specializing in building modern, scalable web applications using MongoDB, Express.js, React, and Node.js. He focuses on clean code, RESTful design, and optimized performance to deliver seamless user experiences.",
  },
  {
    name: "Manju Yadav",
    role: ".NET Developer",
    img: "/Manju.jpg",
    description:
      "Manju Yadav is a skilled software engineer in the Microsoft .NET ecosystem. She specializes in building robust enterprise applications using ASP.NET MVC, C#, and SQL Server. Her strengths lie in backend development, architecture design, and creating user-friendly, high-performance solutions..",
  },
  {
    name: "Madhu Verma",
    role: "Graphics Designer",
    img: "/Madhu.jpg",
    description:
      "Madhu Verma is a visionary graphic designer skilled in visual storytelling, UX/UI, and brand development. She has crafted website interfaces, branding campaigns, and motion graphics, focusing on clarity, elegance, and emotional impact in every design.",
  },
  {
    name: "Sameer Sharma",
    role: "Java Developer",
    img: "/Sameer.jpg",
    description:
      "Sameer Sharma is a skilled Java Developer focused on building robust backend systems using Spring Boot, Hibernate, and RESTful APIs. He writes clean, scalable code, follows TDD and agile practices, and is passionate about performance, quality, and efficient development.",
  },
  {
    name: "Aditya Kumar",
    role: "React Native Developer",
    img: "/Aditya.jpg",
    description:
      "Aditya Kumar is a dedicated React Native Developer with expertise in building high-quality cross-platform mobile apps using React Native, Redux, and Firebase. He focuses on performance, clean UI, and delivering smooth, scalable, and user-friendly mobile experiences.",
  },
];

const TeamSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <header className="bg-blue-500 text-white text-center py-16 px-6 shadow-xl">
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4"
          data-aos="fade-down"
        >
          Meet the Minds Behind the Magic
        </h1>
        <p
          className="text-lg max-w-3xl mx-auto"
          data-aos="fade-up"
        >
          Our team of passionate developers, designers, and innovators work
          together to build solutions that make a difference. Collaboration,
          creativity, and commitment drive everything we do.
        </p>
      </header>

      <section id="our-team" className="bg-gray-50 px-3 py-12 max-w-4xl mx-auto">
        <h2
          className="text-4xl font-extrabold text-center text-blue-500 mb-10"
          data-aos="fade-up"
        >
          Meet Our Team
        </h2>

        <div className="space-y-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              data-aos="zoom-in-up"
              className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-xl shadow-md p-6 md:p-8 transition duration-300 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="flex-shrink-0 w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {member.description.length > 300
                    ? member.description.slice(0, 300) + "..."
                    : member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default TeamSection;
