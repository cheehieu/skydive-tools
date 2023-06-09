/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// TODO: apply smoothing filter to barometer data stream
// TODO: add GPS location lat/long (altitude)
// TODO: use GPS locaiton to determine barometric pressure at location on the ground (https://www.weather.gov/documentation/services-web-api)
// TODO: allow user to calibrate ground altitude/pressure
// TODO: apply Kalman filtering to combine and refind data from multiple sources
// TODO: watch GPS location and point back to DZ pin
// TODO: allow user to adjust voice, language, pitch, speed, etc.
// TODO: adjust speed based on descent rate (faster if utterance won't finish before next altitude checkpoint)
// TODO: allow user to specify altitude checkpoints and utterances
// TODO: set phrases for audible alerts (seatbelts, 10K, full altitude, etc.) during ascent
// TODO: allow user to use local audio files for utterances

// Measuring precise altitude using only phone sensors can be challenging due to various limitations and factors that can affect accuracy. Environmental factors, weather changes, and sensor limitations can still impact accuracy. Keep in mind that precise altitude estimation using phone sensors alone may not achieve the same level of accuracy as specialized altimeters or surveying instruments.

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { barometer, magnetometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import Geolocation from '@react-native-community/geolocation';
import Tts from 'react-native-tts';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

// Convert sensor pressure to altitude in feet or meters
// https://www.weather.gov/media/epz/wxcalc/pressureAltitude.pdf
function pressureToAltitude(pressure: number, seaLevelPressure: number = 1013.25, metric: boolean = false): number {
  const altitude = (1 - Math.pow(pressure / seaLevelPressure, 0.190284)) * 145366.45;
  if (metric) {
    return altitude * 0.3048;
  }

  return altitude;
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [timestamp, setTimestamp] = useState(0);
  const [magneto, setMagneto] = useState({ x: 0, y: 0, z: 0 });
  const [pressure, setPressure] = useState(0);
  const [location, setLocation] = useState({ lat: 0, long: 0, acc: 0, head: 0, speed: 0, alt: 0, vacc: 0 });

  const pressureHouston = 1010.53;

  useEffect(() => {
    // setUpdateIntervalForType(SensorTypes.barometer, 100);
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000); // Update every 1000ms

    const subBarometer = barometer.subscribe(({ pressure }) =>
      setPressure(pressure)
    );
    const subMagnetometer = magnetometer.subscribe(({ x, y, z, timestamp }) => {
      setMagneto({ x, y, z });
      setTimestamp(timestamp);
    });
    Geolocation.getCurrentPosition(info => {
      console.log(info)
      setLocation({ 
        lat: info.coords.latitude,
        long: info.coords.longitude,
        acc: info.coords.accuracy,
        head: info.coords.heading ?? -1,
        speed: info.coords.speed ?? -1,
        alt: info.coords.altitude ?? -1,
        vacc: info.coords.altitudeAccuracy ?? info.extras.verticalAccuracy ?? -1,
      });
    }, error => {console.log(error)}, { enableHighAccuracy: true });

    Tts.addEventListener('tts-start', (event) => console.log("--- start", event));
    Tts.addEventListener('tts-progress', (event) => console.log("--- progress", event));
    Tts.addEventListener('tts-finish', (event) => console.log("--- finish", event));
    Tts.addEventListener('tts-cancel', (event) => console.log("--- cancel", event));

    Tts.getInitStatus().then(() => {
      Tts.setDucking(true);
      Tts.voices().then(voices => console.log('Voices:', voices));
      // Tts.setDefaultLanguage('en-IE');
      // Tts.setDefaultVoice('com.apple.ttsbundle.siri_male_en-GB_compact');
      // Tts.setDefaultRate(0.5);
      // Tts.setDefaultPitch(1.0);
      Tts.setIgnoreSilentSwitch("ignore");
      Tts.speak('Apes together, fly strong!');
      // Tts.speak('14');
      // Tts.speak('13');
      // Tts.speak('12');
      // Tts.speak('11');
      // Tts.speak('10');
      // Tts.speak('9');
      // Tts.speak('8');
      // Tts.speak('7');
      // Tts.speak('6');
      Tts.speak('5');
      Tts.speak('4');
      Tts.speak('3 5');
      Tts.speak('3');
      // Tts.speak('2 5');
      // Tts.speak('2');
      // Tts.speak('1 5');
      // Tts.speak('1');
      // Tts.speak('800');
      // Tts.speak('600');
      // Tts.speak('400');
      // Tts.speak('200');
      // Tts.speak('100');
    }, (err) => {
      if (err.code === 'no_engine') {
        Tts.requestInstallEngine();
      }
    });

    return () => {
      subBarometer.unsubscribe();
      subMagnetometer.unsubscribe();
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-progress');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Time:">
            <Text>{new Date(timestamp).toLocaleTimeString()}</Text>
          </Section>
          <Section title="Barometer:">
            <View>
              <Text>Pressure (mb): {pressure}</Text>
              <Text>Altitude (ft): {pressureToAltitude(pressure, pressureHouston)}</Text>
              <Text>Altitude (m): {pressureToAltitude(pressure, pressureHouston, true)}</Text>
            </View>

            <Button title="Calibrate" onPress={() => {
              console.log('Calibrate');
            }} />
          </Section>
          {/* <Section title="Magnetometer:">
            <View>
              <Text>X: {magneto.x}</Text>
              <Text>Y: {magneto.y}</Text>
              <Text>Z: {magneto.z}</Text>
            </View>
          </Section>
          <Section title="Geolocation:">
            <View>
              <Text>latitude: {location.lat}</Text>
              <Text>longitude: {location.long}</Text>
              <Text>accuracy (m): {location.acc}</Text>
              <Text>heading (deg): {location.head}</Text>
              <Text>speed (m/s): {location.speed}</Text>
              <Text>altitude (m): {location.alt}</Text>
              <Text>altitudeAccuracy (m): {location.vacc}</Text>
            </View>
          </Section> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
