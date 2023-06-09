/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
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
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { barometer, magnetometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

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

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [timestamp, setTimestamp] = useState(0);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [magneto, setMagneto] = useState({ x: 0, y: 0, z: 0 });
  const [pressure, setPressure] = useState(0);

  useEffect(() => {
    // setUpdateIntervalForType(SensorTypes.barometer, 10);
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000); // Update every 1000ms

    const subBarometer = barometer.subscribe(({ pressure }) =>
      setPressure(pressure)
    );
    const subMagnetometer = magnetometer.subscribe(({ x, y, z, timestamp }) => {
      setMagneto({ x, y, z });
      setTimestamp(timestamp);
  });

    return () => {
      subBarometer.unsubscribe();
      subMagnetometer.unsubscribe();
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
              <Text>{pressure}</Text>
            </View>
          </Section>
          <Section title="Magnetometer:">
            <View>
              <Text>X: {magneto.x}</Text>
              <Text>Y: {magneto.y}</Text>
              <Text>Z: {magneto.z}</Text>
            </View>
          </Section>
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
