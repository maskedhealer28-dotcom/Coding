import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';

export const ThemeToggle = ({ theme, onToggle }: { theme: 'light' | 'dark'; onToggle: () => void }) => (
  <Button className="h-10 w-10 p-0" onClick={onToggle}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</Button>
);
