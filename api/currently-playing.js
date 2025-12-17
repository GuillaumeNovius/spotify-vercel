import fetch from "node-fetch";

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64")
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
    })
  });

  const json = await res.json();
  return json.access_token;
}

export default async function handler(req, res) {
  const accessToken = await getAccessToken();

  const spotifyRes = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  if (spotifyRes.status === 204) {
    return res.json({ playing: false });
  }

  const data = await spotifyRes.json();

  res.json({
    playing: true,
    title: data.item.name,
    artists: data.item.artists.map(a => a.name).join(", "),
    album: data.item.album.name
  });
}
