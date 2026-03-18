
export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = "https://subhamagarwal.vercel.app/api/spotify/callback";

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json(data);
    }

    // Display the refresh_token so the user can save it in their .env
    return res.status(200).send(`
      <html>
        <body>
          <h1>Success!</h1>
          <p>Please copy this <strong>refresh_token</strong> and add it to your .env file as <code>SPOTIFY_REFRESH_TOKEN</code>.</p>
          <textarea rows="5" cols="80" readonly>${data.refresh_token}</textarea>
          <br/><br/>
          <p>You can close this tab and optionally delete this API route when done, as you only need to do this once.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
