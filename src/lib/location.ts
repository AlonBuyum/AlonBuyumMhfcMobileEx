import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { GeoPosition, GeoError } from 'react-native-geolocation-service';

export interface Coords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export class LocationPermissionDeniedError extends Error {
  constructor(public neverAskAgain = false) {
    super(
      neverAskAgain
        ? 'Location permission denied. Enable it manually in app settings.'
        : 'Location permission is required to attach a location to this note.'
    );
    this.name = 'LocationPermissionDeniedError';
  }
}

export class LocationUnavailableError extends Error {
  constructor(public code: number, message: string) {
    super(message);
    this.name = 'LocationUnavailableError';
  }
}

export async function ensureLocationPermission(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission',
      message: 'Notes App needs your location to tag where each note was created.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    }
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) return;
  if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    throw new LocationPermissionDeniedError(true);
  }
  throw new LocationPermissionDeniedError(false);
}

export function getCurrentCoords(timeoutMs = 15000): Promise<Coords> {
  return new Promise<Coords>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error: GeoError) => {
        reject(new LocationUnavailableError(error.code, error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 30_000,
      }
    );
  });
}

export async function captureLocation(): Promise<Coords> {
  await ensureLocationPermission();
  return getCurrentCoords();
}
