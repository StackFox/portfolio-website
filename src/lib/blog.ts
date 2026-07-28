import { Client, type PageObjectResponse } from "@notionhq/client";
import { unstable_cache } from "next/cache";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function isFullPage(page: unknown): page is PageObjectResponse {
  return (
    typeof page === "object" &&
    page !== null &&
    "properties" in page
  );
}

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractExcerpt(markdown: string, maxLength = 160): string {
  let text = markdown.replace(/```[\s\S]*?```/g, "");
  text = text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^---$/gm, "")
    .trim();

  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  const firstParagraph = paragraphs[0] || "";

  if (firstParagraph.length <= maxLength) return firstParagraph;
  return firstParagraph.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  markdown: string;
  date: string | null;
}

export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPostData[]> => {
    const res = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID!,
      filter: {
        property: "Status",
        status: {
          equals: "Published",
        },
      },
      sorts: [
        {
          property: "Published date",
          direction: "descending",
        },
      ],
    });

    const posts = await Promise.all(
      res.results
        .filter(isFullPage)
        .map(async (page) => {
          const { markdown } = await notion.pages.retrieveMarkdown({
            page_id: page.id,
          });

          const title =
            (page.properties.Name as { title: { plain_text: string }[] }).title.at(0)
              ?.plain_text ?? "";

          return {
            id: page.id,
            slug: titleToSlug(title),
            title,
            date: (page.properties["Published date"] as { date: { start: string } | null }).date?.start ?? null,
            excerpt: extractExcerpt(markdown),
            markdown,
          };
        })
    );

    return posts;
  },
  ["blog-posts"],
  {
    tags: ["blogs"],
    revalidate: 600,
  }
);

export async function getBlogPostBySlug(slug: string): Promise<BlogPostData | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
