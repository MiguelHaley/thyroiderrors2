// App.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, AuthContext } from "./src/contexts/AuthContext";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SymptomLogScreen from "./src/screens/SymptomLogScreen";
import SensorScreen from "./src/screens/SensorScreen";
import CameraScreen from "./src/screens/CameraScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!user ? (
        // If user not logged in, show login screen
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        // Logged-in screens
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
