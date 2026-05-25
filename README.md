# Notes App

A location based notes app built with React Native (CLI) for the Moveo React Native home assignment.

Users can register a local account, create notes tagged with their current GPS coordinates, view each note's location on a map, and delete notes. All data persists across app launches.

## Tech Stack

- React Native 0.85 (CLI, not Expo) + TypeScript
- Redux Toolkit + redux-persist + AsyncStorage - state + persistence
- React Navigation 7 (native-stack + bottom-tabs) - routing
- react-native-maps + Google Maps SDK for Android - map view
- react-native-geolocation-service - GPS capture with Android runtime permission
- react-hook-form + zod + @hookform/resolvers - form validation
- react-native-gesture-handler + react-native-safe-area-context - navigation peer deps
- Plain RN `View` / `Text` / `Pressable` styled with `StyleSheet` - no UI library

## Install and Run

### Prerequisites

- Node.js > 20 (tested on 24.12)
- JDK 17 
- Android Studio with:
  - Android SDK Platform 36 + Build-Tools 36.0.0
  - An emulator (tested with Pixel 7 / API 34) or a physical Android device with USB debugging
- `ANDROID_HOME` env var pointing at the SDK
- `$ANDROID_HOME/platform-tools` and `$ANDROID_HOME/emulator` on `PATH`

### Steps

```bash
# 1. Install JS dependencies
npm install

# 2. (Optional) Add your Google Maps API key — see "Known Issues" for context
# Edit android/gradle.properties and set:
#   MAPS_API_KEY=your_google_maps_api_key_here

# 3. Start the emulator from Android Studio (Device Manager → ▶)

# 4. Start Metro (in one terminal)
npm start

# 5. Build and install the app (in a second terminal)
npm run android
```

The first Android build takes 5–15 minutes (downloads Gradle, AGP, native deps). Next builds use the cache and are 30–60 seconds.


## Architecture

```
src/
├── theme.ts                 Designs (colors, spacing, type scale)
├── lib/
│   ├── validation.ts        zod schemas: login, register, createNote
│   └── location.ts          Permission flow + getCurrentPosition wrapper
├── store/
│   ├── index.ts             configureStore + persistReducer + persistor
│   ├── authSlice.ts         users dict keyed by email + currentUserId
│   ├── notesSlice.ts        notes dict keyed by userId
│   ├── selectors.ts         Memoized derived state
│   └── hooks.ts             Typed useAppDispatch / useAppSelector
├── components/
│   ├── Button.tsx           Primary/secondary/danger/ghost variants
│   ├── Card.tsx             Surface container
│   ├── FormField.tsx        Label + RHF Controller + error text
│   └── ErrorBanner.tsx      Inline error block
├── navigation/
│   ├── types.ts             Stack/tab param-list types
│   ├── AppNavigator.tsx     Root navigator — switches Auth vs Main based on isAuthenticated
│   └── MainTabs.tsx         Bottom tabs (NotesList, CreateNote)
└── screens/
    ├── LoginScreen.tsx
    ├── RegisterScreen.tsx
    ├── NotesListScreen.tsx
    ├── CreateNoteScreen.tsx
    └── NoteDetailScreen.tsx
```

### State shape

```typescript
{
  auth: {
    usersByEmail: { [email]: { id, email, name, password, createdAt } },
    currentUserId: string | null,
  },
  notes: {
    byUserId: { [userId]: Note[] }
  }
}
```

Persisted to AsyncStorage under the key `persist:notes-app-root` via `redux-persist`. Both slices are whitelisted, so closing and reopening the app restores the user and their notes.

## Main Libraries - Reasoning

| Library | Why I chose it |
|---|---|
| **Redux Toolkit** | Set by the brief.  |
| **redux-persist + AsyncStorage** | Mandated requirement (data persists between launches). `redux-persist` integrates directly with the RTK store via a single `persistReducer` wrap so no manual save/load code. AsyncStorage is the standard RN key-value persistence (built on platform `SharedPreferences` on Android). |
| **React Navigation 7 (native-stack + bottom-tabs)** | The standard navigation library for RN . `native-stack` uses the platform's native UINavigationController/FragmentManager for transitions (faster than the older JS stack). `bottom-tabs` for the two-tab layout the brief asks for. |
| **react-native-maps** | The standard RN maps library. Wraps Google Maps SDK on Android and Apple Maps on iOS. Renders as a real native MapView with marker support, gestures, etc.  not a WebView fallback. |
| **react-native-geolocation-service** | Better permission UX and accuracy than the older `@react-native-community/geolocation`. Uses Google Play Services' `FusedLocationProviderClient` under the hood, which fuses GPS / Wi-Fi / cell signals for a faster, more accurate fix. ( see Known Issues.) |
| **react-hook-form + zod + @hookform/resolvers** | Same validation stack we'd use on web. RHF's uncontrolled-by-default model means fewer rerenders on every keystroke; zod gives us a single TS-typed schema with `infer` for free; `@hookform/resolvers/zod` glues them together so RHF speaks zod natively. |
| **react-native-gesture-handler** | Required dependency of React Navigation 7 , enables the swipe-back gesture on the native stack. Imported at the top of `index.js` so the native side initializes before the JS app boots. |
| **react-native-safe-area-context** | Provides safe area insets so headers / footers don't slide under notches and status bars. Required peer dep of React Navigation. |
| **No UI library (plain RN + StyleSheet)** | I considered react-native-paper but skipped it. Plain RN with `StyleSheet` + a small `theme.ts`. |

## Assumptions and Architectural Decisions

- **Local only authentication.** The brief mentions a "logged-in user" and email/password validation rules but does not require a backend. I persist user accounts locally in `redux-persist`. Each device is independent - no sync, no shared accounts. Passwords are stored in plaintext inside the encrypted-at-rest device storage.
- **Notes are scoped to the signed-in user.** The notes slice keys all notes under `byUserId`. Signing out only flips `currentUserId` to `null` — your notes stay in storage and reappear when you sign back in with the same email.
- **Optional location per note.** The user can toggle off the "Attach current location" switch on Create Note - useful when the user denies location permission, when GPS is unavailable, or when they simply don't want a note geo-tagged . The `NoteDetail` screen handles `location: null` with a "No location was captured" message                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
-  **Sort order.** Notes are stored newest first by prepending to the array on `addNote`.
 - **Delete UX.** Long press a note on the list (or use the Delete button on the detail screen). Both paths                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   show a confirmation Alert with a destructive                                                  style button. We avoided a           swipe-to-delete row because it relies on `react-native-gesture-handler` Swipeable, which adds visual noise to a small list and is harder to discover for first-time users.
- **Navigation tree.** A single root native-stack switches its registered screens based on `isAuthenticated` from the Redux store: when `false`, only `Login` + `Register` are mounted; when `true`, only `MainTabs` + `NoteDetail` are mounted. Sign-in / sign-out triggers the swap automatically without any imperative `navigation.reset()` calls — this is the official React Navigation pattern for auth flows. `NoteDetail` lives *outside* the tabs so the tab bar disappears on the detail screen (standard mobile UX for drill-down).
- **Android target only.** The native dev environment is Windows. iOS would require macOS + Xcode. The `ios/` folder exists from the RN template but isn't tested or wired up.
- **Memory tuned Gradle.** `gradle.properties` was modified with `-Xmx4096m`, `kotlin.compiler.execution.strategy=in-process`, and `org.gradle.workers.max=4` after the default config OOM-killed the Kotlin daemon mid compile on a low RAM moment. Documented in case a reviewer hits the same on their machine.
- **Pinned `play-services-location = 21.0.1`.** Newer Play Services made `FusedLocationProviderClient` an interface rather than a class, which breaks `react-native-geolocation-service`'s precompiled bytecode with `IncompatibleClassChangeError`. Pinning in `android/build.gradle.ext` fixes it. If we ever update the geolocation library to a version compiled against the new interface, this pin can be removed.

## Known Issues / Incomplete Development

- **Google Maps API key is not configured.** Without a key, the `MapView` on the Note Detail screen renders as a blank gray rectangle (the marker is invisible and the map tiles never load). Coordinates are still captured correctly and shown as text below the map, so functionality is preserved. To enable the map:
  1. Get a free key from https://console.cloud.google.com/google/maps-apis/credentials and enable **Maps SDK for Android**.
  2. Edit `android/gradle.properties` and set `MAPS_API_KEY=your_key_here`.
  3. Rebuild (`npm run android`).
  
  **Note:** My Google account triggered a security alert when attempting to enable the Maps API, so the submitted build runs without a key. The basis - manifest meta-data, gradle manifestPlaceholder, build.gradle wiring - is all in place. only the key value is missing. A reviewer with a Google Cloud account can plug one in and the map will render immediately.
- **iOS not built or tested.** `ios/` folder exists from the RN template but the project was developed on Windows. To run on iOS, a Mac with Xcode is needed plus `cd ios && bundle exec pod install`.
- **No automated tests.** The project ships with the default Jest config but no test files. End-to-end was verified manually on the emulator (register → login → create note → see on list → tap to detail → delete → sign out → sign in → notes persist).
- **Plaintext password storage** I didn't use encryption since this a home assignment . production would either move auth to a backend or use `react-native-keychain`.
- **Map view is per note, not all-pins-on-one-map.** Tapping a note opens a detail screen with a map showing just that one note's pin. An all-pins overview map would be straightforward to add as a third tab if the brief intended that - the brief phrase "view where each note was created on an interactive map" was read as per-note.
- **No offline indicator.** The app is local only so connectivity doesn't affect data, but the map tiles need internet to render. There's no UI cue when offline, Google's MapView shows a blank tile background instead.
- **Bundle-time deprecation warning.** Gradle 9.3 warns about deprecated features incompatible with Gradle 10. These come from React Native's gradle plugin .
