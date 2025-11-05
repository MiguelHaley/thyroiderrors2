// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { AuthContext, AuthProvider } from "./src/contexts/AuthContext";

import CameraScreen from "./src/screens/CameraScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LocationScreen from "./src/screens/LocationScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SensorScreen from "./src/screens/SensorScreen";
import SymptomLogScreen from "./src/screens/SymptomLogScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user } = React.useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="SymptomLogScreen"
            component={SymptomLogScreen}
            options={{ title: "Log Symptoms" }}
          />
          <Stack.Screen
            name="Sensors"
            component={SensorScreen}
            options={{ title: "Sensor / Tremor Recorder" }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: "Take Photo" }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: "Dashboard" }}
          />
          <Stack.Screen
            name="Location"
            component={LocationScreen}
            options={{ title: "Location Logger" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
