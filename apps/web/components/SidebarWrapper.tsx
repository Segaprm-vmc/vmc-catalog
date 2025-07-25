import { Sidebar } from './Sidebar'

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories`, {
    cache: 'force-cache'
  })
  
  if (!res.ok) {
    return []
  }
  
  return res.json()
}

export async function SidebarWrapper() {
  const categories = await getCategories()
  return <Sidebar categories={categories} />
} 