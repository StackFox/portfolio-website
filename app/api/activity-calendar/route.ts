import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

type ActivityData = {
    date: string;      // "2026-07-19"
    count: number;
    level: 0 | 1 | 2 | 3 | 4; // intensity bucket, like GitHub's shading
};

type ResponseData = {
    githubCalendar: Object[],
    leetcodeCalendar: Object[],
}

const getActivityCalendar = unstable_cache(
    async () => {
        const queryGithub = `
            query {
                user(login: "StackFox") {
                repositories(privacy: PUBLIC) {
                    totalCount
                }
                contributionsCollection {
                    contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                        date
                        contributionCount
                        }
                    }
                    }
                }
                }
            }
            `;

        const res = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: queryGithub }),
        });

        const data = await res.json();

        const days =
            data.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
                (week: any) => week.contributionDays
            );

        function toActivityData(days: { date: string; contributionCount: number }[]): ActivityData[] {
            const max = Math.max(...days.map(d => d.contributionCount), 1);
            return days.map(d => ({
                date: d.date,
                count: d.contributionCount,
                level: d.contributionCount === 0 ? 0 : Math.min(4, Math.ceil((d.contributionCount / max) * 4)) as 0 | 1 | 2 | 3 | 4,
            }));
        }

        const queryLeetcode = `
            query getUserCalendar($username: String!) {
                matchedUser(username: $username) {
                userCalendar {
                    submissionCalendar
                }
                }
            }
        `;

        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: queryLeetcode, variables: { username: "jacoder69" } }),
        });

        const resData = await response.json();
        const submissionCalendar = resData?.data?.matchedUser?.userCalendar?.submissionCalendar ?? null;

        function parseLeetcodeCalendar(submissionCalendarStr: string | object | null): ActivityData[] {
            if (!submissionCalendarStr) return [];
            const raw = typeof submissionCalendarStr === 'string'
                ? JSON.parse(submissionCalendarStr)
                : submissionCalendarStr;

            // Find the year span from the submission data
            const timestamps = Object.keys(raw).map(Number);
            const minTs = Math.min(...timestamps);
            const maxTs = Math.max(...timestamps);
            const startDate = new Date(minTs * 1000);
            const endDate = new Date(maxTs * 1000);

            // Build a map of date -> count from submissions
            const submissionsByDate = new Map<string, number>();
            for (const [ts, count] of Object.entries(raw)) {
                const date = new Date(Number(ts) * 1000).toISOString().slice(0, 10);
                submissionsByDate.set(date, Number(count));
            }

            // Fill in every day from first to last submission
            const days: ActivityData[] = [];
            const current = new Date(startDate);
            current.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(0, 0, 0, 0);

            while (current <= end) {
                const dateStr = current.toISOString().slice(0, 10);
                const count = submissionsByDate.get(dateStr) ?? 0;
                days.push({ date: dateStr, count, level: 0 });
                current.setDate(current.getDate() + 1);
            }

            // Compute levels based on max count across the span
            const max = Math.max(...days.map(d => d.count), 1);
            return days.map(d => ({
                ...d,
                level: d.count === 0 ? 0 : Math.min(4, Math.ceil((d.count / max) * 4)) as 0 | 1 | 2 | 3 | 4,
            }));
        }

        const activityData: ResponseData = {
            githubCalendar: toActivityData(days),
            leetcodeCalendar: parseLeetcodeCalendar(submissionCalendar)
        }

        return activityData;
    },
    ["activity-calendar"],
    {
        tags: ["calendar"],
        revalidate: 36000, // 10 hours
    }
)

export async function GET() {
    try {
        const data = await getActivityCalendar();

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            message: "something went wrong",
            error,
        }, { status: 404 })
    }
}