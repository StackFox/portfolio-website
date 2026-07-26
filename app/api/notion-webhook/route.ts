import { NextRequest } from "next/server";
import crypto from 'crypto';
import { revalidateTag } from "next/cache";

// This route was created to verify the notion webhook connection url

function isValidSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const expected = crypto
    .createHmac('sha256', process.env.NOTION_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');
  return signature === expected;
}

export async function POST(req: NextRequest) {
  if(!isValidSignature){
    return;
  }

  const body = await req.json();

  console.log("[notion-body] ", body)

  switch (body.type) {
    case "page.created":
    case "page.deleted":
    case "page.properties_updated":
    case "page.content_updated":
    case "database.content_updated":
      revalidateTag("blogs");
      break;
  }

  return Response.json({ received: true });
}