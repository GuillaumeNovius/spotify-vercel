export default function handler(req, res) {
  res.status(200).json({
    client_id: process.env.SPOTIFY_CLIENT_ID ? true : false,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET ? true : false,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || null,
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN ? true : false
  });
}
