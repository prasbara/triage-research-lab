import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Sidebar } from './sidebar'
import { Header } from './header'

async function getUser() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return {
      name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Pengguna',
      email: user.email ?? '',
      role: user.user_metadata?.role ?? 'Peneliti',
      avatarUrl: user.user_metadata?.avatar_url,
    }
  } catch {
    return null
  }
}

interface AppShellProps {
  children: React.ReactNode
}

export async function AppShell({ children }: AppShellProps) {
  const user = await getUser()

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      <Sidebar user={user} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--surface)]">
          {children}
        </main>
      </div>
    </div>
  )
}
