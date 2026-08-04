# portfolio-website

My personal portfolio. Built with Next.js 15, Notion API, and a terminal noir aesthetic.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **CMS:** Notion API (blog)
- **Data:** GitHub GraphQL API, LeetCode API, Last.fm API
- **Deployment:** Vercel

## Features

- Projects showcase with architecture diagrams
- Notion-powered blog with per-post OG images
- GitHub / LeetCode contribution heatmaps
- Last.fm now playing widget
- Interactive terminal CLI
- SEO: metadata, JSON-LD, sitemap, robots.txt

## Setup

```bash
npm install
```

Create `.env.local`:

```
GITHUB_TOKEN=your_github_token
NOTION_API_KEY=your_notion_integration_key
NOTION_DATA_SOURCE_ID=your_notion_database_id
LASTFM_API_KEY=your_lastfm_api_key
LASTFM_USERNAME=your_lastfm_username
```

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
