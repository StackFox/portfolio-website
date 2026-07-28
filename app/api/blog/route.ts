import { NextResponse } from "next/server";
import { getBlogPosts } from "@/src/lib/blog";

export const revalidate = 600;

export async function GET() {
  try {
    const data = await getBlogPosts();
    return Response.json(data);
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong", error
    }, { status: 500 })
  }
}
