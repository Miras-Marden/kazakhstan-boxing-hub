import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Боксёры', href: '/fighters' },
  { label: 'Бои', href: '/fights' },
  { label: 'События', href: '/events' },
  { label: 'Рейтинги', href: '/rankings' },
  { label: 'Новости', href: '/news' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/photo1.png"
            alt="KPBF logo"
            className="h-9 w-9 rounded-md object-cover"
          />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            KPBF <span className="text-accent">REC</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/search">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          {user ? (
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{profile?.full_name || 'Профиль'}</span>
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="gold-gradient text-accent-foreground border-0">
                Войти
              </Button>
            </Link>
          )}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-card md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary">
                  Профиль
                </Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-secondary">
                  Выйти
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-accent hover:bg-secondary">
                Войти
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
