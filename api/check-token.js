// api/check-token.js
export default function handler(req, res) {
  res.status(200).send(
    process.env.SPOTIFY_REFRESH_TOKEN
      ? `Token lu ✅ : ${process.env.SPOTIFY_REFRESH_TOKEN.substring(0,10)}...`
      : "Token manquant ❌"
  );
}
