import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  FaGithub,
  FaLinkedin,
  FaPhoneAlt,
  FaEnvelope,
  FaDownload,
} from "react-icons/fa";
import Profile_Image from "./Profile_Image.jpg"; 

const About = () => {
  return (
    <section className="bg-gradient-to-br from-white to-blue-50 text-gray-800 py-20 px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
      
        <div className="text-center md:text-left">
          <motion.img
            src={Profile_Image}
            alt="Barun Kumar Mishra"
            className="w-40 h-40 mx-auto md:mx-0 rounded-full object-cover shadow-lg border-4 border-blue-600 mb-5"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />

          <h2 className="text-4xl font-extrabold text-blue-700 mb-2">
            Barun Kumar Mishra
          </h2>

          <TypeAnimation
            sequence={[
              "Full-Stack Developer",
              2000,
              "Tech Enthusiast",
              2000,
              "JobSpot Creator",
              2000,
            ]}
            wrapper="span"
            speed={40}
            className="text-lg text-blue-500 font-medium block mb-4"
            repeat={Infinity}
          />

          <p className="text-gray-700 text-base leading-relaxed mb-6">
            I’m a passionate full-stack web developer, dedicated to building
            scalable, efficient, and user-focused applications. With{" "}
            <strong>JobSpot</strong>, my mission is to streamline the job hunt
            and make opportunities more accessible.
          </p>

        
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
            <a
              href="tel:+916205001632"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
            >
              <FaPhoneAlt /> Call Me
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=barun.mishraofficial1505@gmail.com&su=Inquiry%20from%20Website&body=Hello%2C%20I%20would%20like%20to%20ask%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              <FaEnvelope /> Message
            </a>

          
            <a
              href="/resume.pdf"
              download="Barun_Kumar_Mishra_Resume.pdf"
              className="flex items-center gap-2 px-5 py-2 rounded-full hover:bg-[#4A38C2] text-white bg-[#5812d0] transition"
            >
              <FaDownload /> Download Resume
            </a>
          </div>

         
          <div className="flex gap-6 justify-center md:justify-start">
            <a
              href="https://github.com/Barun-Mishra-09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black text-2xl"
            >
              <FaGithub size={39} />
            </a>
            <a
              href="https://www.linkedin.com/in/barun-kumar-mishra-bba651368/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 text-2xl"
            >
              <FaLinkedin size={39} />
            </a>
          </div>
        </div>

       
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">
            My Tech Stack
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              "HTML5",
              "CSS3",
              "JavaScript",
              "React.js",
              "Tailwind CSS",
              "Node.js",
              "Express.js",
              "MongoDB",
              "Redux Toolkit",
              "MySql",
              "C++",
              "C",
              "Git & GitHub",
              "REST APIs",
              "Firebase",
            ].map((skill, index) => (
              <motion.span
                key={index}
                className="bg-white border border-blue-100 text-gray-800 text-sm py-2 px-4 rounded-full shadow-sm text-center hover:shadow-md hover:bg-blue-100 transition-all duration-300 cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
