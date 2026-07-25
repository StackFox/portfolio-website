import { NextRequest } from "next/server";

// app/api/notion-webhook/route.ts
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Verification challenge — respond immediately
  if (body.verification_token) {
    console.log(body.verification_token);
    return Response.json({ challenge: body.verification_token });
  }

  // ... handle real events below
}