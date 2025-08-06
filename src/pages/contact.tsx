import Head from "next/head";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa"; 
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us | Western Lighting</title>
      </Head>

      {/* Intro Section */}
      <section className="bg-gray-100 text-white py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Get In Touch</h2>
          <p className="text-gray-600 text-md text-center mb-10 max-w-xl mx-auto">
            Have questions or need assistance? We’re here to help! Reach out to us for inquiries, support, or collaborations.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">Send Us a Message</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                className="w-full border border-gray-300 rounded px-4 py-2 h-32 focus:ring-2 focus:ring-red-600 focus:outline-none"
                required
              ></textarea>
            </div>
            <button
                type="submit"
                className="bg-gray-800 text-white text-sm px-4 py-2 rounded hover:bg-gray-900 transition"
            >
            Submit
            </button>
          </form>
        </div>
      </section>

      {/* Contact Info Section */}
<section className="py-12 bg-white">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-12">
  <div>
    <MapPin className="mx-auto text-gray-600 mb-2" size={32} />
    <h3 className="text-md font-semibold text-gray-800">Address</h3>
    <p className="text-gray-600 text-sm">2020 32 Avenue NE, Unit# E,<br />Calgary, Alberta T2W9A7</p>
  </div>
  <div>
    <Phone className="mx-auto text-gray-600 mb-2" size={32} />
    <h3 className="text-md font-semibold text-gray-800">Call Us</h3>
    <p className="text-gray-600 text-sm">+1 (403) 700 - 1007</p>
  </div>
  <div>
    <Mail className="mx-auto text-gray-600 mb-2" size={32} />
    <h3 className="text-md font-semibold text-gray-800">Email</h3>
    <p className="text-gray-600 text-sm break-all">info@westernledlighting.com</p>
  </div>
  <div>
    <h3 className="text-md font-semibold text-gray-800 mb-2">Follow Us</h3>
    <div className="flex justify-center gap-3">
      <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-black"><FaFacebookF size={22} /></a>
      <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-black"><FaTwitter size={22} /></a>
      <a href="#" aria-label="YouTube" className="text-gray-600 hover:text-black"><FaYoutube size={22} /></a>
    </div>
  </div>
</div>
</section>

      {/* Map */}
      <section className="h-[400px] w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2521.6694242742564!2d-114.00035872336708!3d51.08482004223065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5371654d08d6be7d%3A0x1c35502d156a8cc5!2s2020%2032%20Ave%20NE%20%23E%2C%20Calgary%2C%20AB%20T2E%209A7%2C%20Canada!5e0!3m2!1sen!2sca!4v1698888888888!5m2!1sen!2sca"
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
        ></iframe>
      </section>
    </>
  );
}
