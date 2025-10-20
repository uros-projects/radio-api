import { fetchWeatherApi } from 'openmeteo';

const params = {
	latitude: 36.67676137824202,
	longitude: -121.78811793089169,
	daily: [
		'wind_speed_10m_max',
		'wind_gusts_10m_max',
		'wind_direction_10m_dominant',
	],
	hourly: [
		'temperature_2m',
		'relative_humidity_2m',
		'apparent_temperature',
		'pressure_msl',
		'dew_point_2m',
		'precipitation_probability',
		'precipitation',
		'rain',
		'showers',
		'surface_pressure',
		'cloud_cover',
		'cloud_cover_high',
		'cloud_cover_mid',
		'cloud_cover_low',
		'visibility',
		'wind_speed_10m',
		'uv_index',
	],
	models: 'best_match',
	current: [
		'temperature_2m',
		'relative_humidity_2m',
		'apparent_temperature',
		'rain',
		'showers',
		'precipitation',
		'cloud_cover',
	],
	timezone: 'America/Los_Angeles',
	wind_speed_unit: 'mph',
	temperature_unit: 'fahrenheit',
	precipitation_unit: 'inch',
	bounding_box: '-90,-180,90,180',
	start_date: '2025-10-09',
	end_date: '2025-10-23',
};
const url = 'https://api.open-meteo.com/v1/forecast';
const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log(
	`\nCoordinates: ${latitude}°N ${longitude}°E`,
	`\nElevation: ${elevation}m asl`,
	`\nTimezone: ${timezone} ${timezoneAbbreviation}`,
	`\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
);

const current = response.current()!;
const hourly = response.hourly()!;
const daily = response.daily()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	current: {
		time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
		temperature_2m: current.variables(0)!.value(),
		relative_humidity_2m: current.variables(1)!.value(),
		apparent_temperature: current.variables(2)!.value(),
		rain: current.variables(3)!.value(),
		showers: current.variables(4)!.value(),
		precipitation: current.variables(5)!.value(),
		cloud_cover: current.variables(6)!.value(),
	},
	hourly: {
		time: [
			...Array(
				(Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
			),
		].map(
			(_, i) =>
				new Date(
					(Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
						1000
				)
		),
		temperature_2m: hourly.variables(0)!.valuesArray(),
		relative_humidity_2m: hourly.variables(1)!.valuesArray(),
		apparent_temperature: hourly.variables(2)!.valuesArray(),
		pressure_msl: hourly.variables(3)!.valuesArray(),
		dew_point_2m: hourly.variables(4)!.valuesArray(),
		precipitation_probability: hourly.variables(5)!.valuesArray(),
		precipitation: hourly.variables(6)!.valuesArray(),
		rain: hourly.variables(7)!.valuesArray(),
		showers: hourly.variables(8)!.valuesArray(),
		surface_pressure: hourly.variables(9)!.valuesArray(),
		cloud_cover: hourly.variables(10)!.valuesArray(),
		cloud_cover_high: hourly.variables(11)!.valuesArray(),
		cloud_cover_mid: hourly.variables(12)!.valuesArray(),
		cloud_cover_low: hourly.variables(13)!.valuesArray(),
		visibility: hourly.variables(14)!.valuesArray(),
		wind_speed_10m: hourly.variables(15)!.valuesArray(),
		uv_index: hourly.variables(16)!.valuesArray(),
	},
	daily: {
		time: [
			...Array(
				(Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
			),
		].map(
			(_, i) =>
				new Date(
					(Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
						1000
				)
		),
		wind_speed_10m_max: daily.variables(0)!.valuesArray(),
		wind_gusts_10m_max: daily.variables(1)!.valuesArray(),
		wind_direction_10m_dominant: daily.variables(2)!.valuesArray(),
	},
};

// 'weatherData' now contains a simple structure with arrays with datetime and weather data
console.log(
	`\nCurrent time: ${weatherData.current.time}`,
	`\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
	`\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
	`\nCurrent apparent_temperature: ${weatherData.current.apparent_temperature}`,
	`\nCurrent rain: ${weatherData.current.rain}`,
	`\nCurrent showers: ${weatherData.current.showers}`,
	`\nCurrent precipitation: ${weatherData.current.precipitation}`,
	`\nCurrent cloud_cover: ${weatherData.current.cloud_cover}`
);
console.log('\nHourly data', weatherData.hourly);
console.log('\nDaily data', weatherData.daily);
