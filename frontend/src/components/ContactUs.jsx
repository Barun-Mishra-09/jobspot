import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";


import { useState } from "react";
import axios from "axios";
import { CONTACT_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";

const ContactUs = () => {
 
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${CONTACT_API_END_POINT}/send`, form, {
        withCredentials: true,
      });

      toast.success(res?.data?.message);

     
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending message");
    }
  };

  return (
    <section className="bg-gradient-to-br from-white to-blue-50 py-20 px-6 md:px-16 text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
      >
        {/* Left Section: Info & Icons */}
        <div>
          <h2 className="text-4xl font-extrabold text-blue-700 mb-6">
            Let’s Connect!
          </h2>
          <p className="text-gray-700 mb-6">
            Have questions, feedback, or opportunities? Feel free to reach out —
            I’d love to hear from you.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-green-600" />
              <span className="text-gray-800 text-lg">+91 6205001632</span>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-blue-600" />
              <span className="text-gray-800 text-lg">
                barun.mishraofficial1505@gmail.com
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-red-500" />
              <span className="text-gray-800 text-lg">
                Dhanbad, Jharkhand, India
              </span>
            </div>

           
            <div className="flex gap-6 mt-6">
              <a
                href="https://www.linkedin.com/in/barun-kumar-mishra-bba651368/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 text-2xl"
              >
                <FaLinkedin size={39} />
              </a>
              <a
                href="https://github.com/Barun-Mishra-09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-black text-2xl"
              >
                <FaGithub size={39} />
              </a>
            </div>
          </div>
        </div>

        
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border-t-4 border-b-4 border-blue-600"
        >
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              placeholder="Write your message..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Send Message
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default ContactUs;
