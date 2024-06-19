import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
// import "./public/styles.css";

const app = express();
const port = process.env.PORT || 4000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const options = {
    method: 'GET',
    url: 'https://yahoo-weather5.p.rapidapi.com/weather',
    params: {
      location: 'chodavaram',
      format: 'json',
      u: 'f'
    },
    headers: {
      'x-rapidapi-key': 'ec18e1164amsh093e6abc4043a15p102708jsnef2fcc8d950c',
      'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com'
    }
  };
  app.get("/",async (req,res)=>{
    try {
        const response = await axios.request(options);
        // console.log(response.data);
        res.render("forecast.ejs",{
            city: response.data.location.city,
            country: response.data.location.country,
            sunrise: response.data.current_observation.astronomy.sunrise,
            sunset: response.data.current_observation.astronomy.sunset,
            condition: response.data.current_observation.condition.text,
            forecasts: response.data.forecasts,
            forecast_1:  response.data.forecasts[0]       
        })
    } catch (error) {
        console.error(error);
    }
  })

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}.`);
});
