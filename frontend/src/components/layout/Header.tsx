'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Search } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',         label: 'Головна' },
  { href: '/about',    label: 'Про нас' },
  { href: '/reports',  label: 'Звіти' },
  { href: '/events',   label: 'Події' },
  { href: '/contacts', label: 'Контакти' },
];

const RESERVED_KEYS = ['home', 'about', 'contacts', 'mission'];

interface PageNav {
  key: string;
  title: string;
}

interface HeaderProps {
  pages?: PageNav[];
}

export default function Header({ pages = [] }: HeaderProps) {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled,    setScrolled]    = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  const extraPages = pages.filter(p => !RESERVED_KEYS.includes(p.key));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.other-dropdown')) setDropOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [dropOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  }

  const navLinkStyle = (isActive: boolean) => ({
    fontFamily: 'var(--font-main)',
    fontSize: '1.125rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? 'var(--teal)' : 'var(--charcoal)',
    padding: '0.5rem 1rem',
    borderBottom: isActive ? '2px solid var(--teal)' : '2px solid transparent',
    textDecoration: 'none',
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
    transition: 'color 0.2s, border-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    cursor: 'pointer',
    height: '42px',
    boxSizing: 'border-box' as const,
    lineHeight: 1,
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: scrolled ? '2px solid var(--teal)' : '2px solid var(--border)',
        boxShadow: scrolled ? '0 2px 20px rgba(78,153,128,0.1)' : 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.5rem' }}>

        <Link href="/" aria-label="Місто Сили — головна">
          <Image
            src="/images/logo.png"
            alt="Місто Сили"
            width={180}
            height={60}
            style={{ objectFit: 'contain', height: '52px', width: 'auto' }}
            priority
          />
        </Link>

        <nav aria-label="Основна навігація" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                style={navLinkStyle(isActive)}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)'; }}
              >
                {link.label}
              </Link>
            );
          })}

          {extraPages.length > 0 && (
            <div className="other-dropdown" style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                aria-expanded={dropOpen}
                aria-haspopup="true"
                onMouseEnter={e => { if (!dropOpen) (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                onMouseLeave={e => { if (!dropOpen) (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)'; }}
                style={{
                  ...navLinkStyle(dropOpen),
                  background: 'none',
                  appearance: 'none' as const,
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: dropOpen ? '2px solid var(--teal)' : '2px solid transparent',
                }}
              >
                Інше
                <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {dropOpen && (
                <div role="menu" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid var(--border)', borderTop: '3px solid var(--teal)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: '200px', zIndex: 200 }}>
                  {extraPages.map(page => (
                    <Link
                      key={page.key}
                      href={`/${page.key}`}
                      role="menuitem"
                      style={{ display: 'block', padding: '0.875rem 1.25rem', fontSize: '1rem', fontWeight: 500, color: pathname === `/${page.key}` ? 'var(--teal)' : 'var(--charcoal)', textDecoration: 'none', borderBottom: '1px solid var(--light-gray)', transition: 'background 0.15s, color 0.15s', fontFamily: 'var(--font-main)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--off-white)'; e.currentTarget.style.color = 'var(--teal)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = pathname === `/${page.key}` ? 'var(--teal)' : 'var(--charcoal)'; }}
                    >
                      {page.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Пошук"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: searchOpen ? 'var(--teal)' : 'var(--charcoal)', padding: '0.5rem', display: 'flex', alignItems: 'center', transition: 'color 0.2s', marginLeft: '0.25rem' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
            onMouseLeave={e => { if (!searchOpen) e.currentTarget.style.color = 'var(--charcoal)'; }}
          >
            <Search size={20} />
          </button>
        </nav>

        <div style={{ display: 'none' }} className="mobile-btns">
          <Link href="/search" aria-label="Пошук" style={{ color: 'var(--charcoal)', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <Search size={22} />
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={menuOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '0.875rem 1.5rem', background: 'var(--off-white)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--charcoal)', pointerEvents: 'none' }} />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Введіть запит..."
                autoFocus
                style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', fontSize: '1rem', fontFamily: 'var(--font-main)', border: '2px solid var(--border)', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = 'var(--teal)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '1rem' }}>
              Шукати
            </button>
            <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <X size={20} />
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <nav aria-label="Мобільна навігація" style={{ background: 'var(--white)', borderTop: '1px solid var(--border)', padding: '1rem 1.5rem' }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} style={{ display: 'block', fontFamily: 'var(--font-main)', fontSize: '1.25rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--teal)' : 'var(--charcoal)', padding: '0.875rem 0', borderBottom: '1px solid var(--light-gray)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {link.label}
              </Link>
            );
          })}

          {extraPages.length > 0 && (
            <>
              <div style={{ padding: '0.875rem 0 0.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Інше
              </div>
              {extraPages.map(page => (
                <Link key={page.key} href={`/${page.key}`} style={{ display: 'block', fontFamily: 'var(--font-main)', fontSize: '1.125rem', fontWeight: pathname === `/${page.key}` ? 700 : 400, color: pathname === `/${page.key}` ? 'var(--teal)' : 'var(--charcoal)', padding: '0.75rem 0 0.75rem 1rem', borderBottom: '1px solid var(--light-gray)', textDecoration: 'none' }}>
                  {page.title}
                </Link>
              ))}
            </>
          )}
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-btns { display: flex !important; align-items: center; gap: 0.25rem; }
        }
      `}</style>
    </header>
  );
}