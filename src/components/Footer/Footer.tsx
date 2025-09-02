import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <footer className="flex flex-col w-full p-8 lg:p-16 items-center">
      <div className="font-bold text-[32px]">CONTACT</div>
      <div className="flex flex-col lg:flex-row w-full justify-around items-center pt-16 px-16">
        <div className="flex flex-col items-center w-[240px]">
          <a
            href="https://www.linkedin.com/in/andersonheidrich/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon
              style={{ width: "64px", height: "64px", cursor: "pointer" }}
            />
          </a>
        </div>
        <div className="flex flex-col items-center w-[240px]">
          <a
            href="https://github.com/andersonheidrich/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon
              style={{ width: "64px", height: "64px", cursor: "pointer" }}
            />
          </a>
        </div>
        <div className="flex flex-col items-center w-[240px]">
          <EmailIcon style={{ width: "64px", height: "64px" }} />
          <span>andersonheidrichleite@gmail.com</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
