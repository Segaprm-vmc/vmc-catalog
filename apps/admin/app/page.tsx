'use client'

import dynamic from 'next/dynamic'

// Динамический импорт React Admin для избежания SSR проблем
const AdminApp = dynamic(() => import('../src/App'), { ssr: false })

export default function AdminPage() {
  return <AdminApp />
} 