import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Таро - Главная страница',
  description: 'Сайт для гадания на картах Таро',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}