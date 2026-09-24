import './globals.css'

export const metadata = {
  title: 'Aetherion Dragon',
  description: 'Fantasy dragon arcade'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
