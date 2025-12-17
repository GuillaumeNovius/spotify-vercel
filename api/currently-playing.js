import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const token = process.env.SPOTIFY_REFRESH_TOKEN;
    if (!token) return res.status(400).send("Refresh token manquant");

    // Obtenir un access token via refresh token
    const authRes = await fetch("https://accounts.spotify.com/api/token", {
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
        refresh_token: token
      })
    });

    const authData = await authRes.json();
    const accessToken = authData.access_token;
    if (!accessToken) return res.status(500).send("Impossible d'obtenir access token");

    // Récupérer la lecture en cours
    const nowRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (nowRes.status === 204) return res.status(200).json({ playing: false });

    const nowData = await nowRes.json();
    const track = nowData.item;

    const result = {
      playing: nowData.is_playing,
      title: track.name,
      artists: track.artists.map(a => a.name).join(", "),
      album: track.album.name
    };

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
}
