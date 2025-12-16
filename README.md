# 🌍 WanderLens

> **Your journey starts here.**
> A full-stack travel dashboard that aggregates real-time data to help travelers research their next destination.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Tech Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20EJS-blue)

## 📖 Overview

**WanderLens** is a Node.js application that solves the problem of fragmented travel research. Instead of opening multiple tabs to check the weather, exchange rates, and local time, WanderLens aggregates all this data into a single, cohesive dashboard.

The application serves as a backend orchestrator, chaining asynchronous requests to multiple public APIs to deliver a seamless user experience.

## ✨ Key Features

* **🔍 Instant Global Search:** Access data for over 250+ countries instantly.
* **⛅ Real-Time Weather Engine:** displays current temperature, weather conditions (e.g., "Mist", "Sunny"), and visual indicators.
* **💱 Live Currency Conversion:** Automatically fetches the latest exchange rates to show exactly how much 1 USD is worth in the local currency.
* **🕒 "Time-Travel" Logic:** A custom backend algorithm calculates the precise **Local Time** for any country relative to UTC, without relying on extra time APIs.
* **📊 Rich Data Visualization:** Clean, card-based UI displaying population, region, capital city, and languages.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Templating:** EJS (Embedded JavaScript)
* **HTTP Client:** Axios (for API chaining)
* **Styling:** Custom CSS with Flexbox/Grid layouts

## ⚙️ How It Works (The Architecture)

WanderLens uses a "Chain and Aggregate" pattern:

1.  **Step 1:** User searches for a country (e.g., "India").
2.  **Step 2:** Server queries **REST Countries API** to get the capital city (New Delhi), currency code (INR), and coordinates.
3.  **Step 3:** Using `Promise.all`, the server triggers parallel requests:
    * Queries **OpenWeatherMap** using the capital city data.
    * Queries **ExchangeRate-API** using the currency code.
4.  **Step 4:** The server processes the timezone offset to calculate the local time string server-side.
5.  **Step 5:** The combined data object is rendered into the EJS dashboard view.

## 🚀 Getting Started

### Prerequisites
* Node.js installed.
* API Keys for OpenWeatherMap and ExchangeRate-API.

### Installation

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/yourusername/WanderLens.git](https://github.com/yourusername/WanderLens.git)
    cd WanderLens
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file or `keys.js` file and add your keys:
    ```javascript
    const WEATHER_API_KEY = "your_key_here";
    const EXCHANGE_API_KEY = "your_key_here";
    ```

4.  **Run the server**
    ```bash
    node index.js
    ```
    Visit `http://localhost:3000` in your browser.

## 📸 Screenshots

<img width="1918" height="968" alt="image" src="https://github.com/user-attachments/assets/f2ee77db-888b-4311-bd14-3e7616aa5e16" />
<img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/b758ceb0-5158-4890-b0b0-752883830a7b" />



---
*Created by Saish Mhaskar*
