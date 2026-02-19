import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (isOpen && query) {
      setQuery('');
      onSearch('');
    }
    setIsOpen(!isOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'w-40 sm:w-56 md:w-64' : 'w-0'
        }`}
      >
        <div className="relative w-full">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar..."
            value={query}
            onChange={handleChange}
            className="h-8 sm:h-9 pr-8 bg-muted/50 border-muted-foreground/20 text-sm"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <button
        onClick={handleToggle}
        className="p-2 rounded-full hover:bg-muted/50 transition-colors touch-target"
        aria-label={isOpen ? 'Fechar pesquisa' : 'Pesquisar'}
      >
        <Search className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
};

export default SearchBar;
