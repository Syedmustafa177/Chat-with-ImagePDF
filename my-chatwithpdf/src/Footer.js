import React from 'react';
import { FaLinkedinIn, FaInstagram, FaTwitter, FaGithub, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { Icon: FaLinkedinIn, label: 'LinkedIn', href: 'https://www.linkedin.com/in/syedmustafa177/' },
    { Icon: FaInstagram, label: 'Instagram', href: 'https://www.linkedin.com/in/syedmustafa177/' },
    { Icon: FaTwitter, label: 'Twitter', href: 'https://x.com/syedmustafa177' },
    { Icon: FaGithub, label: 'GitHub', href: 'https://github.com/Syedmustafa177' },
    { Icon: FaYoutube, label: 'YouTube', href: 'https://www.youtube.com/shorts/SXHMnicI6Pg' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Created & designed by Syed Mustafa Ali
          </p>
          <div className="flex justify-center space-x-6">
            {socialLinks.map(({ Icon, label, href }) => (
              <a 
                key={label} 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
              >
                <span className="sr-only">{label}</span>
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;