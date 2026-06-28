// Weather API service
const API_KEY: string = '18fd240128d24a6a8b3a0d5b9ac45b3c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface WeeklyForecast {
  day: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  description?: string;
}

export interface FullWeatherData {
  current: WeatherData;
  hourly: HourlyForecast[];
  weekly: WeeklyForecast[];
}

// Fixed Validation Function
const isApiKeyValid = (): boolean => {
  const cleanKey = API_KEY.trim();
  return cleanKey !== '' && cleanKey.length > 10;
};

// Generates fallback mock data if a location is completely missing or offline
const generateMockWeatherData = (city: string): FullWeatherData => {
  const cityName = city.trim();
  const cleanCity = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();

  let seed = 0;
  for (let i = 0; i < cleanCity.length; i++) {
    seed += cleanCity.charCodeAt(i);
  }

  const baseTemp = 10 + (seed % 20);
  const conditions = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'];
  const condition = conditions[seed % conditions.length];

  let description = 'clear sky';
  let icon = '01d';
  let humidity = 45 + (seed % 40);
  let speed = 2.5 + (seed % 10) / 2;

  switch (condition) {
    case 'Clear': description = 'clear sky'; icon = '01d'; break;
    case 'Clouds': description = 'broken clouds'; icon = '04d'; break;
    case 'Rain': description = 'moderate rain'; icon = '10d'; break;
    case 'Snow': description = 'light snow'; icon = '13d'; break;
    case 'Thunderstorm': description = 'thunderstorm with rain'; icon = '11d'; break;
  }

  const current: WeatherData = {
    name: cleanCity,
    main: {
      temp: parseFloat(baseTemp.toFixed(1)),
      feels_like: parseFloat((baseTemp + (seed % 4 - 2) * 0.8).toFixed(1)),
      temp_min: parseFloat((baseTemp - 4).toFixed(1)),
      temp_max: parseFloat((baseTemp + 5).toFixed(1)),
      humidity,
      pressure: 1008 + (seed % 15),
    },
    weather: [{ id: 800 + (seed % 100), main: condition, description, icon }],
    wind: { speed, deg: (seed * 12) % 360 },
  };

  const hourly: HourlyForecast[] = [];
  const hours = ['Now', '3 PM', '6 PM', '9 PM', '12 AM', '3 AM', '6 AM', '9 AM'];
  for (let i = 0; i < 8; i++) {
    const hrTemp = baseTemp + Math.sin(i / 1.5) * 2;
    const hrCondIndex = (seed + i) % conditions.length;
    let hrIcon = '01d';
    switch (conditions[hrCondIndex]) {
      case 'Clear': hrIcon = '01d'; break;
      case 'Clouds': hrIcon = '02d'; break;
      case 'Rain': hrIcon = '09d'; break;
      case 'Snow': hrIcon = '13d'; break;
      case 'Thunderstorm': hrIcon = '11d'; break;
    }
    hourly.push({
      time: hours[i],
      temp: parseFloat(hrTemp.toFixed(1)),
      condition: conditions[hrCondIndex],
      icon: hrIcon,
    });
  }

  const weekly: WeeklyForecast[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = new Date().getDay();

  for (let i = 1; i <= 5; i++) {
    const dayName = days[(todayIndex + i - 1) % 7];
    const dayTempMin = baseTemp - 5 + Math.sin((seed + i) * 1.7) * 2;
    const dayTempMax = baseTemp + 4 + Math.cos((seed + i) * 1.3) * 3;
    const dayCondIndex = (seed + i * 3) % conditions.length;
    let dayIcon = '01d';
    switch (conditions[dayCondIndex]) {
      case 'Clear': dayIcon = '01d'; break;
      case 'Clouds': dayIcon = '03d'; break;
      case 'Rain': dayIcon = '10d'; break;
      case 'Snow': dayIcon = '13d'; break;
      case 'Thunderstorm': dayIcon = '11d'; break;
    }
    weekly.push({
      day: dayName,
      tempMin: parseFloat(dayTempMin.toFixed(1)),
      tempMax: parseFloat(dayTempMax.toFixed(1)),
      condition: conditions[dayCondIndex],
      icon: dayIcon,
      humidity: 50 + ((seed + i) % 30),
      windSpeed: parseFloat((3.0 + ((seed + i) % 5)).toFixed(1)),
    });
  }

  return { current, hourly, weekly };
};

// Helper to extract clean data from the OpenWeather 5-day / 3-hour forecast API
const parseHourlyAndWeekly = (list: any[]): { hourly: HourlyForecast[], weekly: WeeklyForecast[] } => {
  // 1. Hourly: Just take the next 8 items
  const hourly: HourlyForecast[] = list.slice(0, 8).map((item: any, index: number) => ({
    time: index === 0 ? 'Now' : new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
    temp: item.main.temp,
    condition: item.weather[0].main,
    icon: item.weather[0].icon,
  }));

  // 2. Weekly: Group by date and summarize
  const dailyMap: { [key: string]: any[] } = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(item);
  });

  // Convert map to array and compute averages
  const weekly: WeeklyForecast[] = Object.keys(dailyMap)
    .slice(1, 6) // Skip today, get next 5 days
    .map((dateStr) => {
      const dayData = dailyMap[dateStr];
      const temps = dayData.map((d) => d.main.temp);
      
      // We use the middle of the day (mid-day forecast) for representative weather/icon/description
      const midDayIndex = Math.floor(dayData.length / 2);
      const rep = dayData[midDayIndex];

      // Average values for Humidity and Wind
      const avgHumidity = dayData.reduce((sum, d) => sum + d.main.humidity, 0) / dayData.length;
      const avgWind = dayData.reduce((sum, d) => sum + d.wind.speed, 0) / dayData.length;

      return {
        day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        tempMin: Math.min(...temps),
        tempMax: Math.max(...temps),
        condition: rep.weather[0].main,
        icon: rep.weather[0].icon,
        humidity: Math.round(avgHumidity),
        windSpeed: Number(avgWind.toFixed(1)),
        description: rep.weather[0].description,
      };
    });

  return { hourly, weekly };
};
export const fetchWeatherByCity = async (city: string): Promise<FullWeatherData> => {
  const cleanCity = city.trim();
  const cleanKey = API_KEY.trim();

  if (!cleanCity) {
    return generateMockWeatherData('London');
  }

  if (!isApiKeyValid()) {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    return generateMockWeatherData(cleanCity);
  }

  try {
    // Fetch both endpoints simultaneously to populate current AND hourly structures accurately
    const currentUrl = `${BASE_URL}/weather?q=${encodeURIComponent(cleanCity)}&appid=${cleanKey}&units=metric`;
    const forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(cleanCity)}&appid=${cleanKey}&units=metric`;

    console.log('response', currentUrl)
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);
    console.log('response', currentRes)

    if (currentRes.status === 404 || forecastRes.status === 404) {
      throw new Error('City not found');
    }

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('City lookup failure across operational endpoints.');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const { hourly, weekly } = parseHourlyAndWeekly(forecastData.list);

    return {
      current: currentData,
      hourly,
      weekly,
    };
  } catch (error: any) {
    if (error.message === 'City not found') {
      throw error;
    }
    console.error('Live city fetch failed, using fallback mock:', error);
    return generateMockWeatherData(cleanCity);
  }
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<FullWeatherData> => {
  const cleanKey = API_KEY.trim();

  if (!isApiKeyValid()) {
    return generateMockWeatherData('My Location');
  }

  try {
    const currentUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${cleanKey}&units=metric`;
    const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${cleanKey}&units=metric`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('Coordinate lookup failure across operational endpoints.');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const { hourly, weekly } = parseHourlyAndWeekly(forecastData.list);

    return {
      current: currentData,
      hourly,
      weekly,
    };
  } catch (error) {
    console.error('Live coordinate fetch failed, using fallback mock:', error);

    return generateMockWeatherData('My Location');
  }
};