#A weather app

Features:
- Geolocation aware
- Current temperature + weather
- 7-day forecast heatmap



To run:

- Sign up for a free account on https://darksky.net/
- Grab your API key and create a file named `.env` in the root of this project
- Paste it in that file assigning it to a variable named DARKSKY_SECRET (as DARKSKY_SECRET=your_api_key)
- `npm install`
- open 1 terminal window and run:
  `node src/server/index.js`
- open another terminal and:
  `npm run start`
- visit http://localhost:3000/ and accept the geolocation popup