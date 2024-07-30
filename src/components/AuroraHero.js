import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useMotionTemplate, useMotionValue, motion, animate } from "framer-motion";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const apiKey = '8be41b61aaa481eec5274d9d0cb1ae2b';
const geoCodingUrl = 'https://api.openweathermap.org/data/2.5/geo/1.0/reverse';

export const AuroraHero = () => {
  const color = useMotionValue(COLORS_TOP[0]);
  const [location, setLocation] = useState('Fetching location...');
  const [weather, setWeather] = useState('Fetching weather...');
  const [city, setCity] = useState('');

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);

        // Reverse geocoding to get the closest city
        const reverseGeoUrl = `${geoCodingUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        fetch(reverseGeoUrl)
          .then(response => response.json())
          .then(data => {
            if (data && data.length > 0) {
              const nearestCity = data[0].name;
              setCity(nearestCity);
              const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${nearestCity}&appid=${apiKey}&units=metric`;
              fetchWeather(weatherUrl);
            } else {
              setLocation('Unable to find a nearby city.');
            }
          })
          .catch(error => {
            setLocation('Unable to retrieve location.');
            console.error('Error retrieving location:', error);
          });
      }, error => {
        setLocation('Unable to retrieve location.');
        console.error('Error retrieving location:', error);
      });
    } else {
      setLocation('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchWeather = (url) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          const weather = data.weather[0].description;
          const temp = data.main.temp;
          setWeather(`Weather: ${weather}, Temperature: ${temp}°C`);
        } else {
          setWeather('City not found.');
        }
      })
      .catch(error => {
        setWeather('Unable to retrieve weather data.');
        console.error('Error fetching weather data:', error);
      });
  };

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  const handleSearch = () => {
    if (city) {
      setLocation(`Searching for weather in ${city}...`);
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      fetchWeather(weatherUrl);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          Weather App
        </h1>
        <motion.p 
          className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Get real-time weather updates for your current location or any city you choose.
        </motion.p>
        <motion.div 
          className="my-4 text-center text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          {location}
        </motion.div>
        <motion.div 
          className="my-4 text-center text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          {weather}
        </motion.div>
        <motion.div 
          className="mt-4 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            className="p-2 border border-gray-300 rounded-lg mb-4 bg-gray-800 text-white placeholder-gray-400"
            placeholder="Enter city name"
          />
          <motion.button
            onClick={handleSearch}
            style={{ border, boxShadow }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
          >
            Search
            <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
};
