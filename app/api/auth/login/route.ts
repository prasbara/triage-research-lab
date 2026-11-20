import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/database/server"

export async function POST(request: NextRequest) {
  let email = ""
  let password = ""

  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}))
    email = body.email || ""
    password = body.password || ""
  } else {
    const formData = await request.formData()
    email = (formData.get("email") as string) || ""
    password = (formData.get("password") as string) || ""
  }

  if (!email || !password) {
    if (contentType.includes("application/json")) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 })
    }
    return NextResponse.redirect(new URL("/login?error=missing_fields", request.url))
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (contentType.includes("application/json")) {
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login?error=invalid_credentials", request.url))
  }

  if (contentType.includes("application/json")) {
    return NextResponse.json({ success: true, user: data.user })
  }

  const redirectTarget = request.nextUrl.searchParams.get("redirect") || "/dashboard"
  return NextResponse.redirect(new URL(redirectTarget, request.url))
}
