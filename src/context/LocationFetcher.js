import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const LocationFetcher = ({ onLocationFetched }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let logTimeout = null;
    let locationAttemptStarted = false;
    
    const fetchLocation = async () => {
      try {
        if (__DEV__ && !locationAttemptStarted) {
          locationAttemptStarted = true;
          console.log('[Location] Initializing location service...');
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setErrorMsg('Location permission denied');
          }

          if (__DEV__) {
            console.error('[Location] Permission denied');
          }
          return;
        }

        const locationOptions = {
          accuracy: Location.Accuracy.Low,
          timeout: 5000,
          maximumAge: 60000 
        };

        let locationData;
        try {
          locationData = await Promise.race([
            Location.getCurrentPositionAsync(locationOptions),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Location timeout')), 6000)
            )
          ]);
        } catch (error) {

          try {
            locationData = await Location.getLastKnownPositionAsync();
            if (!locationData && isMounted) {
              setErrorMsg('Could not get location');
              return;
            }
          } catch (fallbackError) {
            if (isMounted) {
              setErrorMsg('Could not get location');
            }
            return;
          }
        }
        
        if (!locationData || !locationData.coords) {
          if (isMounted) {
            setErrorMsg('Invalid location data');
          }
          return;
        }

        const { coords } = locationData;

        if (__DEV__) {
          console.log('[Location] Coordinates received');
        }

        const geocodePromise = Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude
        });

        const results = await Promise.race([
          geocodePromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Geocode timeout')), 3000)
          )
        ]);

        if (results && results.length > 0) {
          const { city, region, country, name } = results[0];

          let locationParts = [];
          if (name) locationParts.push(name);
          if (city) locationParts.push(city);
          if (region) locationParts.push(region);
          if (country) locationParts.push(country);
          

          const uniqueParts = locationParts.filter((part, index) => {

            for (let i = 0; i < index; i++) {
              if (locationParts[i].includes(part)) return false;
            }
            return true;
          });
          
          const userLocation = uniqueParts.join(', ');
          
          if (isMounted) {
            setLocation(userLocation);
            onLocationFetched(userLocation);
          }

          if (__DEV__) {
            console.log('[Location] Complete');
          }
        } else {

          const fallbackLocation = `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`;
          
          if (isMounted) {
            setLocation(fallbackLocation);
            onLocationFetched(fallbackLocation);
          }
        }
      } catch (error) {
        if (isMounted) {
          setErrorMsg('Error fetching location');
        }
      }
    };

    if (__DEV__) {
      logTimeout = setTimeout(() => {
        console.log('[Location] Still processing...');
      }, 3000);
    }

    fetchLocation();

    return () => {
      isMounted = false;
      if (logTimeout) clearTimeout(logTimeout);
    };
  }, [onLocationFetched]);

  return null; 
};

export default LocationFetcher;