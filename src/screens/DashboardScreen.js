// src/screens/DashboardScreen.js
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function DashboardScreen() {
  const [dataPoints, setDataPoints] = useState([10, 20, 30, 40, 25, 35]);

  useEffect(() => {
    // In a real app, fetch Appwrite data here
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Thyroid Dashboard</Text>
      <Text style={styles.subtitle}>Symptom Trends</Text>

      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [{ data: dataPoints }],
        }}
        width={Dimensions.get("window").width - 30}
        height={220}
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#f5f5f5",
          backgroundGradientFrom: "#f5f5f5",
          backgroundGradientTo: "#fff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 12 },
  chart: { borderRadius: 12 },
});
