import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/useUser";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

const Header = () => {
  const { authenticated, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const allMenuItems = [
    {
      label: "Início",
      path: "/",
      icon: <HomeIcon />,
      activeClasses: "bg-gray-600 text-white border-b-gray-600",
      baseClasses:
        "border-b-gray-600 hover:bg-gray-600 hover:text-white transition-colors duration-300",
    },
    {
      label: "Novo Torneio",
      path: "/new-tournament",
      icon: <EmojiEventsIcon />,
      activeClasses: "bg-violet-600 text-white border-b-violet-600",
      baseClasses:
        "border-b-violet-600 hover:bg-violet-600 hover:text-white transition-colors duration-300",
    },
    {
      label: "Meus Torneios",
      path: "/my-tournaments",
      icon: <EmojiEventsIcon />,
      activeClasses: "bg-yellow-500 text-white border-b-yellow-500",
      baseClasses:
        "border-b-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors duration-300",
    },
    {
      label: "Entrar",
      path: "/login",
      icon: <LoginIcon />,
      activeClasses: "bg-green-600 text-white border-b-green-600",
      baseClasses:
        "border-b-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300",
    },
    {
      label: "Cadastrar",
      path: "/register",
      icon: <PersonAddIcon />,
      activeClasses: "bg-blue-600 text-white border-b-blue-600",
      baseClasses:
        "border-b-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300",
    },
    {
      label: "Perfil",
      path: "/profile",
      icon: <PersonIcon />,
      activeClasses: "bg-green-600 text-white border-b-green-600",
      baseClasses:
        "border-b-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300",
    },
    {
      label: "Sair",
      path: "/logout",
      icon: <LogoutIcon />,
      activeClasses: "bg-red-600 text-white border-b-red-600",
      baseClasses:
        "border-b-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300",
    },
  ];

  const menuItems = allMenuItems.filter((item) => {
    if (!authenticated && ["Perfil", "Sair"].includes(item.label)) return false;
    if (authenticated && ["Entrar", "Cadastrar"].includes(item.label))
      return false;
    return true;
  });

  const handleClick = (item: { label: string; path: string }) => {
    if (item.label === "Sair") {
      logout();
      navigate("/");
    } else {
      navigate(item.path);
    }
  };

  return (
    <header className="flex w-full h-23 justify-center items-center fixed z-1000 bg-white border-b-4 border-b-gray-300 font-bold gap-2">
      <nav className="flex w-full h-24 justify-center">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              className={`flex flex-col min-w-16 w-32 justify-center items-center text-center cursor-pointer border-b-4 text-sm sm:text-base ${
                isActive ? item.activeClasses : item.baseClasses
              }`}
              aria-label={item.label}
              onClick={() => handleClick(item)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
