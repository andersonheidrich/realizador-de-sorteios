import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-col w-full p-8 lg:p-16 items-center">
      <div className="font-bold text-3xl">CONTACT</div>
      <div className="flex flex-col lg:flex-row w-full justify-around items-center pt-16 px-16">
        <div className="flex flex-col items-center w-60">
          <a
            href="https://www.linkedin.com/in/andersonheidrich/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin
              style={{ width: "64px", height: "64px", cursor: "pointer" }}
            />
          </a>
        </div>
        <div className="flex flex-col items-center w-60">
          <a
            href="https://github.com/andersonheidrich/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub
              style={{ width: "64px", height: "64px", cursor: "pointer" }}
            />
          </a>
        </div>
        <div className="flex flex-col items-center w-60">
          <Mail style={{ width: "64px", height: "64px" }} />
          <span>andersonheidrichleite@gmail.com</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
