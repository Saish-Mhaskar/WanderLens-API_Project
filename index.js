import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const REST_COUNTRIES_API = "https://restcountries.com/v3.1/name/";
const WEATHER_API = "https://api.weatherapi.com/v1/current.json";
const EXCHANGE_API = "https://v6.exchangerate-api.com/v6";

const app=express();
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res)=>{
    res.render("index");
});

function getLocalTimeFromTimezoneString(tzString) {
    // Example tzString: "UTC+05:30" or "UTC-03:00"
    const match = /^UTC([+-])(\d{2}):?(\d{2})?$/.exec(tzString);
    if (!match) return null;

    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;

    const offsetMinutes = sign * (hours * 60 + minutes);

    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const localMs = utcMs + offsetMinutes * 60000;

    return new Date(localMs).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}


app.post("/submit", async (req,res)=>{
    console.log(req.body);
    const country = req.body.country;
    
    if(!country){
        return res.render("index", { error: "Please enter a country. "});
    }

    try{
        const response = await axios.get(`${REST_COUNTRIES_API}${encodeURIComponent(country)}?fullText=true`);
        const countryData = response.data[0];

        if(!countryData){
            return res.render("index", { error: "Enter a valid country. "});
        }

        const countryName = countryData.name.common;
        const capital = countryData.capital[0];

        const currencyCode = Object.keys(countryData.currencies || {})[0];        
        const currencyInfo = countryData.currencies[currencyCode];              
        const currencyName = currencyInfo?.name;
        
        const languages = Object.values(countryData.languages || {});

        const population = countryData.population;

        const timezones = countryData.timezones || [];
        const primaryTz = timezones[0];
        const time = primaryTz ? getLocalTimeFromTimezoneString(primaryTz) : null;

        const weatherPromise = axios.get(`${WEATHER_API}`,{
            params: {
                key: process.env.WEATHER_API_KEY,
                q: capital,
        },
    });

        const exchangePromise = axios.get(`${EXCHANGE_API}/${process.env.EXCHANGE_API_KEY}/pair/USD/${currencyCode}`);

        const [weatherRes, exchangeRes] = await Promise.all([weatherPromise, exchangePromise]);
        const weatherData = weatherRes.data;
        const exchangeData = exchangeRes.data;

        const temperature = weatherData?.current?.temp_c ?? null;
        const condition = weatherData?.current?.condition?.text ??null;
        const weatherIcon = weatherData?.current?.condition?.icon ?? null;
        const conversionRate = exchangeData?.conversion_rate ?? null;

        console.log("Temperature:", temperature);
        console.log("condition:", condition);
        console.log("Icon:", weatherIcon);
        console.log("Exchange Rate:", conversionRate);

        const dashboardData = {
            country: {
                name: countryName,
                flag: countryData.flags?.svg || countryData.flags?.png,
                population: population,
                region: countryData.region,
                capital: capital,
                languages: languages,
            },
            weather: {
                temp: temperature,
                description: condition,
                icon: weatherIcon,
                localTime: time,
            },
            finance: {
                currencyCode,
                currencyName,
                rate: conversionRate
            },
        };

        return res.render("dashboard", dashboardData);
    }
    catch(error){
        console.error(error.message);
        return res.render("index", { error: "Service error. Please try again." });
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});