import SearchBar from "./SearchBar";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => (
  <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
    <h1 className="text-2xl font-bold">Weather App</h1>
    <div className="flex items-center gap-4">

      <ThemeSwitcher />
    </div>
  </header>
);

export default Header;
