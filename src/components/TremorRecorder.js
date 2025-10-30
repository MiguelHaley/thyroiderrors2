// src/components/TremorRecorder.js
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function TremorRecorder({ onBatch }) {
  const [subscribed, setSubscribed] = useState(false);
  const bufferRef = useRef([]);
  const sampleInterval = 50; // ms between events (adjust)
  const batchSize = 40; // send every 40 samples (~2s if 50ms each)

  useEffect(() => {
    Accelerometer.setUpdateInterval(sampleInterval);
    return () => {
      Accelerometer.removeAllListeners();
    };
  }, []);

  const _subscribe = () => {
    Accelerometer.addListener((data) => {
      // store timestamp + x,y,z
      bufferRef.current.push({ ...data, ts: Date.now() });
      if (bufferRef.current.length >= batchSize) {
        const batch = bufferRef.current.splice(0, batchSize);
        onBatch && onBatch(batch);
      }
    });
    setSubscribed(true);
  };

  const _unsubscribe = () => {
    Accelerometer.removeAllListeners();
    bufferRef.current = [];
    setSubscribed(false);
  };

  return (
    <View>
      <Text>Recording: {subscribed ? "ON" : "OFF"}</Text>
      <Button title={subscribed ? "Stop" : "Start"} onPress={subscribed ? _unsubscribe : _subscribe} />
    </View>
  );
}
