import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-background via-background/90 to-transparent">
      <div className="container mx-auto px-4 md:px-8 py-3 sm:py-4 md:py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center touch-target">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              <span className="brand-text">Hot</span>
              <span className="text-foreground">Hub</span>
            </h1>
          </Link>

          {/* Right side - Search and Theme toggle */}
          <div className="flex items-center gap-1 sm:gap-2">
            {onSearch && <SearchBar onSearch={onSearch} />}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
