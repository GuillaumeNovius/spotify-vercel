import fetch from "node-fetch";
import { Buffer } from "buffer";

export default async function handler(req, res) {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("Code manquant");

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
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
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI
      })
    });

    const data = await tokenRes.json();

    if (!data.refresh_token) {
      console.log("Erreur token :", data);
      return res.status(500).send("Impossible de récupérer le refresh token");
    }

    console.log("🔥 REFRESH TOKEN :", data.refresh_token);

    res.status(200).send(
      "Spotify connecté ✔️<br>Tu peux fermer cette page.<br>Regarde les logs Vercel pour le refresh_token."
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
}
