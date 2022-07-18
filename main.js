// openweathermap api key
const API_KEY = "68ef3e56f0b9847d0fd587b0fa3c4373";


// time -------------------------------------------------------------------------
function padTime(v) { return v.toString().padStart(2, "0"); }

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
function toWeekDay(v) { return days[v]; }

const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
function toMonth(v) { return months[v]; }

function clock()
{
    /** @type {HTMLDivElement} */
    const timeEle = document.querySelector(".clock-time");

    /** @type {HTMLDivElement} */
    const dateEle = document.querySelector(".clock-date");

    setInterval(() =>
    {
        const date = new Date();

        const timeStr = `${padTime(date.getHours())}:${padTime(date.getMinutes())}:${padTime(date.getSeconds())}`;
        if(timeEle.innerHTML !== timeStr) { timeEle.innerHTML = timeStr; }

        const dateStr = `${toWeekDay(date.getDay())} / ${padTime(date.getDate())} / ${toMonth(date.getMonth())} / ${date.getFullYear()}`;
        if(dateEle.innerHTML !== dateStr) { dateEle.innerHTML = dateStr; }
    }, 100);
}


// weather ----------------------------------------------------------------------------
function getLocation()
{
    return new Promise((res, rej) =>
    {
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(res);
        }
        else
        {
            res(undefined);
        }
    });
}

function idToIcon(id)
{
    // see https://openweathermap.org/weather-conditions
    switch(id)
    {
        case 200:
        case 201:
        case 202:
        case 210:
        case 211:
        case 212:
        case 221:
        case 230:
        case 231:
        case 232:
            return "thunderstorm";

        // drizzle
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:

        // rain
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 511:
        case 520:
        case 521:
        case 522:
        case 531:
            return "rain";

        // snow
        case 600:
        case 601:
        case 602:
        case 611:
        case 612:
        case 613:
        case 615:
        case 616:
        case 620:
        case 621:
        case 622:
            return "snow";

        case 701:
        case 711:
        case 721:
        case 741:
            return "mist";

        case 731:
        case 751:
        case 761:
        case 762:
            return "sand";

        case 771:
        case 781:
            return "tornado";

        case 800:
            return "clear";

        case 801:
        case 802:
            return "cloudy";

        case 803:
        case 804:
            return "cloud";

        default: return "cloud";
    }
}


async function getWeather({lat, lon})
{

    const res = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)).json();

    return {
        /** @type {{main: string, description: string, icon: string, id: number}[]} */
        descr : res.weather,
        temp: res.main.temp,
        feelsLike: res.main.feels_like,
        sun: { rise: res.sys.sunrise, set: res.sys.sunset }
    };
}

async function weather()
{
    const tempEle = document.querySelector(".temp");
    const feelsLikeEle = document.querySelector(".feels-like-temp");
    const descrEle = document.querySelector(".descr-text");
    /** @type {HTMLImageElement} */
    const img = document.querySelector(".weather-image");

    try
    {
        const loc = await getLocation();
    
        const weather = await getWeather({ lat: loc.coords.latitude, lon: loc.coords.longitude });

        tempEle.innerHTML = `${weather.temp}°C`;
        feelsLikeEle.innerHTML = `feels like ${weather.feelsLike}°C`;
        descrEle.innerHTML = weather.descr[0].description;

        const icon = idToIcon(weather.descr[0].id);
        img.src = `assets/weather-icons/${icon}.svg`;
    }
    catch(err)
    {
        console.error(err.message);

        document.querySelector(".weather-bar-container").remove();
    }
}

// search
function search()
{
    /** @type {HTMLFormElement} */
    const searchForm = document.querySelector(".search-form");
    const searchBar = document.querySelector(".search-input");

    searchForm.addEventListener("submit", ev =>
    {
        ev.preventDefault();
        const searchString = "https://www.google.com/search";

        const searchTerm = searchBar.value;

        const url = new URL(searchString);
        url.searchParams.append("q", searchTerm);

        const urlString = url.toString();

        window.location.href = urlString;
        return false;
    });
}

// links
function createLink(name, url)
{
    const div = document.createElement("div");
    const ele = document.createElement("a");
    ele.classList.add("quick-link");
    ele.setAttribute("href", url);
    ele.innerHTML = name;
    div.append(ele);
    return div;
}

function links()
{
    /** @type {HTMLDivElement} */
    const container = document.querySelector(".quicklinks-container");
    const urls = [
        {
            title: "dev",
            color: "orange",
            links: [
                {name: "github",        url: "https://github.com/davidHarwardt"},
                {name: "personal-site", url: "https://davidHarwardt.github.io"},
                {name: "fritz-box",     url: "http://fritz.box"},
            ],
        },
        {
            title: "entertainment",
            color: "red",
            links: [
                {name: "youtube",       url: "https://www.youtube.com/"},
                {name: "netflix",       url: "https://www.netflix.com/browse"},
                {name: "disney-plus",   url: "https://www.disneyplus.com/home"},
            ],
        },
        {
            title: "misc",
            color: "blue",
            links: [
                {name: "icloud",        url: "https://www.icloud.com/"},
                {name: "onerdive",      url: "https://onedrive.live.com/"},
            ],
        },
        {
            title: "creative",
            color: "purple",
            links: [
                {name: "figma",         url: "https://www.figma.com/"},
                {name: "tldraw",        url: "https://www.tldraw.com/"},
            ],
        },
        {
            title: "shopping",
            color: "green",
            links: [
                {name: "amazon",        url: "https://www.amazon.de/"},
                {name: "reichelt",      url: "https://www.reichelt.de/"},
                {name: "apple",         url: "https://www.apple.com/"},
            ],
        },
    ];

    container.style.gridTemplateColumns = `repeat(${Math.min(urls.length,3)}, 1fr)`;

    urls.forEach(v => 
    {
        const divEle = document.createElement("div");

        const titleEle = document.createElement("div");
        titleEle.classList.add("quick-link-title");
        titleEle.innerHTML = v.title;
        divEle.append(titleEle);

        divEle.style.color = `var(--color-${v.color})`;

        v.links.forEach(link =>
        {
            divEle.append(createLink(link.name, link.url));
        });

        container.append(divEle);
    });
}

function main()
{
    clock();
    weather();
    search();
    links();
}

main();

