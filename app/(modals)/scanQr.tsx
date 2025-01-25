import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { addVisitedLocation } from "@/lib/http/mutations";
import Svg, { Rect, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { primary } from "@/constants/Colors";

const QrScanner = () => {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (hasPermission === null) {
      requestPermission();
    }
  }, [hasPermission]);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Location Permission', 'Please grant location access');
      return null;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return loc.coords;
    } catch (error) {
      Alert.alert('Location Error', 'Could not retrieve location');
      return null;
    }
  }

  const visitedStoreMutation = useMutation({
    mutationFn: addVisitedLocation,
    onSuccess: (data) => {
      router.push("/(tabs)");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleBarcodeScanned = async ({ data, type }: BarcodeScanningResult) => {
    setScanned(true);
    const location = await getLocation()

    if (location) {
      const { latitude, longitude } = location;
      visitedStoreMutation.mutate({
        locationId: parseInt(data),
        date: new Date().toISOString(),
        userLatitude: latitude,
        userLongitude: longitude
      });
    }
  };

  const ScannerFrame = () => (
    <Svg width="300" height="300" viewBox="0 0 300 300">
      <Defs>
        <LinearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#00FFD4" stopOpacity="1" />
          <Stop offset="100%" stopColor="#6E2FFF" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Outer rounded rectangle */}
      <Rect
        x="10"
        y="10"
        width="280"
        height="280"
        rx="30"
        ry="30"
        fill="none"
        stroke="url(#borderGradient)"
        strokeWidth="5"
      />

      {/* Corner decorative elements */}
      <Path
        d="M30 40 L40 30 M30 260 L40 270 M260 30 L270 40 M270 260 L260 270"
        stroke="url(#borderGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Svg>
  );

  if (hasPermission?.status !== "granted") {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.text}>Camera access required to scan QR codes</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {
        visitedStoreMutation.isPending && <ActivityIndicator size="large" color={primary} style={{position: "absolute", top: 30, zIndex: 1000, alignSelf: 'center'}}/>
      }
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        ratio={'1:1'}
      >
        <View style={styles.overlay}>
          <View style={styles.scannerFrameContainer}>
            <ScannerFrame />
            {scanned && (
              <View style={styles.scanCompletedOverlay}>
                <Text style={styles.scanCompletedText}>Scan Completed</Text>
                <Text style={styles.scanCompletedText}>Please Wait!!</Text>
              </View>
            )}
          </View>
        </View>
      </CameraView>

      {scanned && (
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 17, 40, 0.7)',
  },
  scannerFrameContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A1128',
  },
  text: {
    color: '#00FFD4',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#6E2FFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#00FFD4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#6E2FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#0A1128',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanCompletedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(110, 47, 255, 0.5)',
    borderRadius: 30,
  },
  scanCompletedText: {
    color: '#00FFD4',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default QrScanner;