import { NextResponse } from "next/server";

type LastFmImage = {
  "#text": string;
  size: string;
};

type LastFmTrack = {
  name: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: LastFmImage[];
  date?: { uts: string };
  "@attr"?: { nowplaying?: string };
};

type LastFmResponse = {
  recenttracks: {
    track: LastFmTrack[];
  };
};

export type NowPlayingData = {
  isPlaying: boolean;
  track: string;
  artist: string;
  album: string;
  albumArt: string;
  playedAt?: string;
};

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    return NextResponse.json(
      { error: "Missing LASTFM_API_KEY or LASTFM_USERNAME" },
      { status: 500 }
    );
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

    const res = await fetch(url, { next: { revalidate: 30 } });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Last.fm" },
        { status: res.status }
      );
    }

    const data: LastFmResponse = await res.json();
    const track = data.recenttracks.track?.[0];

    if (!track) {
      return NextResponse.json({ isPlaying: false, track: null });
    }

    const isPlaying = track["@attr"]?.nowplaying === "true";

    // Pick the largest available image (usually the last in the array)
    const albumArt =
      track.image.find((img) => img.size === "large")?.["#text"] ||
      track.image.find((img) => img.size === "medium")?.["#text"] ||
      track.image[track.image.length - 1]?.["#text"] ||
      "";

    const result: NowPlayingData = {
      isPlaying,
      track: track.name,
      artist: track.artist["#text"],
      album: track.album["#text"],
      albumArt,
      playedAt: track.date?.uts,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
