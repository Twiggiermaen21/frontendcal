'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Strona główna' },
  { href: '/calendar', label: 'Kalendarz' },
  { href: '/about', label: 'O nas' },
  { href: '/contact', label: 'Kontakt' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex gap-6 items-center">
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`font-medium ${
            pathname === href ? 'text-blue-600 underline' : 'text-gray-700'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
