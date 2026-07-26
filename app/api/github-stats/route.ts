import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

type ResponseData = {
  totalCommits: number,
  currentStreak: number,
  totalRepos: number,
  totalLCSolved: number
}

const getGithubStats = unstable_cache(
  async () => {
    const query = `
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
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    const totalRepos = data.data.user.repositories.totalCount;
    const totalCommits = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
    const totalLCSolved = await getLCStreak();

    const currentStreak = calculateStreak(weeks);

    function calculateStreak(weeks: any[]) {
      const days = weeks.flatMap(w => w.contributionDays).reverse();
      let streak = 0;
      for (const day of days) {
        if (day.contributionCount > 0) streak++;
        else break;
      }
      return streak;
    }

    async function getLCStreak() {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `;

      const res = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { username: "jacoder69" } }),
      });

      const data = await res.json();
      const totalSolved = data.data.matchedUser.submitStatsGlobal.acSubmissionNum[0].count;
      return totalSolved;
    }

    const githubStats: ResponseData = {
      totalCommits,
      currentStreak,
      totalRepos,
      totalLCSolved
    };

    return githubStats;
  },
  ["github-stats"],
  {
    tags: ['stats'],
    revalidate: 3600, // 10 minutes
  }
)


export async function GET() {

  try {
    const data = await getGithubStats()

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong"
    }, { status: 500 })
  }

}