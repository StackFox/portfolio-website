import { NextResponse } from "next/server";
import { Client, type PageObjectResponse } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function isFullPage(page: unknown): page is PageObjectResponse {
    return (
        typeof page === "object" &&
        page !== null &&
        "properties" in page
    );
}

export async function GET() {
    try {
        // find published blogs/(data sources) from the database.
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

        function extractExcerpt(markdown: string, maxLength = 160): string {
            // Remove code blocks first (so code doesn't leak into the excerpt)
            let text = markdown.replace(/```[\s\S]*?```/g, "");

            // Remove markdown syntax: headings, bold/italic, links, blockquotes, list markers
            text = text
                .replace(/^#{1,6}\s+/gm, "")           // headings
                .replace(/\*\*(.+?)\*\*/g, "$1")       // bold
                .replace(/\*(.+?)\*/g, "$1")           // italic
                .replace(/\[(.+?)\]\(.+?\)/g, "$1")    // links -> just the label
                .replace(/^>\s+/gm, "")                // blockquotes
                .replace(/^[-*]\s+/gm, "")             // bullet list markers
                .replace(/^\d+\.\s+/gm, "")            // numbered list markers
                .replace(/^---$/gm, "")                // horizontal rules
                .trim();

            // Split into paragraphs (double newline or single newline blocks),
            // find the first non-empty one after the first heading's content
            const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
            const firstParagraph = paragraphs[0] || "";

            // Truncate to maxLength at a word boundary
            if (firstParagraph.length <= maxLength) return firstParagraph;
            return firstParagraph.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
        }

        const posts = await Promise.all(
            res.results
                .filter(isFullPage)
                .map(async (page) => {
                    const {markdown} = await notion.pages.retrieveMarkdown({
                        page_id: page.id,
                    });

                    return {
                        id: page.id,
                        title: (page.properties.Name as { title: { plain_text: string }[] }).title.at(0)?.plain_text ?? "",
                        date: (page.properties["Published date"] as { date: { start: string } | null }).date?.start ?? null,
                        excerpt: extractExcerpt(markdown),
                        markdown: markdown,
                    };
                })
        );

        return Response.json(posts);
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong", error
        }, { status: 500 })
    }
}