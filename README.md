# react-native-installed-app-checker

`react-native-installed-app-checker` is a React Native module that allows you to check if a specific application is installed on the device and get the list of installed applications. This module supports both Android and iOS platforms.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/react-native-installed-app-checker) to install react-native-installed-app-checker.

```bash
npm install react-native-installed-app-checker@1.1.1
```

If you want just android you can use 1.0.7 version (just android)
```bash
npm install react-native-installed-app-checker@1.0.7
```

If any error you can use 1.0.4 version (just android)
```bash
npm install react-native-installed-app-checker@1.0.4
```


### iOS Setup

For iOS, you need to run:

```bash
cd ios && pod install && cd ..
```

## Platform Specific Setup

### Android Setup

Permissions
In order to check if an app is installed or get the list of installed apps, you'll need to request the QUERY_ALL_PACKAGES permission. Add the following permission to your AndroidManifest.xml:

```bash
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
```
This permission allows the app to query the list of all installed apps on the device. Note that using this permission requires justification, and you should check the Google Play policies if you plan to distribute your app through the Play Store.

Android 11 and Above
Starting with Android 11 (API level 30), Google has introduced additional restrictions for accessing installed apps. To handle this properly, you may need to provide a rationale for why your app requires the QUERY_ALL_PACKAGES permission. For more information, see the [Google Play policies](https://play.google/developer-content-policy/).

### iOS Setup

iOS has different limitations compared to Android:

1. **URL Scheme Based Detection**: iOS uses URL schemes to detect installed apps. The module includes a comprehensive list of popular apps and their URL schemes.

2. **Limited App Detection**: Unlike Android, iOS cannot detect all installed apps due to sandboxing restrictions. Only apps with known URL schemes can be detected.

3. **No Additional Permissions Required**: iOS doesn't require special permissions for URL scheme detection.

4. **Supported Apps**: The module can detect popular apps like WhatsApp, Instagram, Facebook, Twitter, YouTube, Spotify, Netflix, and many more.

**Note**: iOS can only detect apps that have registered URL schemes. If an app doesn't have a public URL scheme, it cannot be detected by this method.
## Usage

### Check if a specific app is installed

**Android Usage:**
```javascript
import React from 'react';
import { View, Button, Alert } from 'react-native';
import RNInstalledAppChecker from 'react-native-installed-app-checker';

const App = () => {
  const checkAppInstalled = (packageName) => {
    RNInstalledAppChecker.isAppInstalled(packageName, (isInstalled) => {
      if (isInstalled) {
        Alert.alert('App Installed', `${packageName} is installed.`);
      } else {
        Alert.alert('App Not Found', `${packageName} is not installed.`);
      }
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Check App Installation" onPress={() => checkAppInstalled('com.whatsapp')} />
    </View>
  );
};

export default App;
```

**iOS Usage:**
```javascript
import React from 'react';
import { View, Button, Alert } from 'react-native';
import RNInstalledAppChecker from 'react-native-installed-app-checker';

const App = () => {
  const checkAppInstalled = (urlScheme) => {
    RNInstalledAppChecker.isAppInstalled(urlScheme, (isInstalled) => {
      if (isInstalled) {
        Alert.alert('App Installed', `${urlScheme} is installed.`);
      } else {
        Alert.alert('App Not Found', `${urlScheme} is not installed.`);
      }
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Check WhatsApp" onPress={() => checkAppInstalled('whatsapp://')} />
      <Button title="Check Instagram" onPress={() => checkAppInstalled('instagram://')} />
    </View>
  );
};

export default App;
```

### Get list of installed apps

**Android - Get user apps (excluding system apps):**
```javascript
import React from 'react';
import { View, Button, Alert, FlatList, Text } from 'react-native';
import RNInstalledAppChecker from 'react-native-installed-app-checker';

const App = () => {
  const [installedApps, setInstalledApps] = React.useState([]);

  const getInstalledApps = () => {
    RNInstalledAppChecker.getInstalledApps((apps) => {
      setInstalledApps(apps);
      console.log('Installed Apps:', apps);
    });
  };

  const renderAppItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.appName}</Text>
      <Text style={{ color: '#666' }}>{item.packageName}</Text>
      <Text style={{ color: '#999' }}>Version: {item.versionName} ({item.versionCode})</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Get Installed Apps" onPress={getInstalledApps} />
      <FlatList
        data={installedApps}
        keyExtractor={(item) => item.packageName}
        renderItem={renderAppItem}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default App;
```

**iOS - Get detected apps:**
```javascript
import React from 'react';
import { View, Button, Alert, FlatList, Text } from 'react-native';
import RNInstalledAppChecker from 'react-native-installed-app-checker';

const App = () => {
  const [installedApps, setInstalledApps] = React.useState([]);

  const getInstalledApps = () => {
    RNInstalledAppChecker.getInstalledApps((apps) => {
      setInstalledApps(apps);
      console.log('Detected Apps:', apps);
    });
  };

  const renderAppItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.appName}</Text>
      <Text style={{ color: '#666' }}>{item.urlScheme}</Text>
      <Text style={{ color: '#999' }}>URL Scheme: {item.urlScheme}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Get Detected Apps" onPress={getInstalledApps} />
      <FlatList
        data={installedApps}
        keyExtractor={(item) => item.urlScheme}
        renderItem={renderAppItem}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default App;
```

### Get list of all installed apps (Android only)

**Note**: This feature is only available on Android. On iOS, `getAllInstalledApps()` returns the same result as `getInstalledApps()`.

```javascript
import React from 'react';
import { View, Button, Alert, FlatList, Text } from 'react-native';
import RNInstalledAppChecker from 'react-native-installed-app-checker';

const App = () => {
  const [allApps, setAllApps] = React.useState([]);

  const getAllInstalledApps = () => {
    RNInstalledAppChecker.getAllInstalledApps((apps) => {
      setAllApps(apps);
      console.log('All Installed Apps:', apps);
    });
  };

  const renderAppItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.appName}</Text>
      <Text style={{ color: '#666' }}>{item.packageName}</Text>
      <Text style={{ color: '#999' }}>
        Version: {item.versionName} ({item.versionCode})
        {item.isSystemApp ? ' - System App' : ' - User App'}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Get All Apps" onPress={getAllInstalledApps} />
      <FlatList
        data={allApps}
        keyExtractor={(item) => item.packageName}
        renderItem={renderAppItem}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default App;
```

## API Reference

### `isAppInstalled(identifier, callback)`

Checks if a specific app is installed on the device.

**Parameters:**
- `identifier` (string): 
  - **Android**: Package name of the app (e.g., "com.whatsapp")
  - **iOS**: URL scheme of the app (e.g., "whatsapp://")
- `callback` (function): Callback function that receives a boolean indicating if the app is installed

### `getInstalledApps(callback)`

Gets the list of installed apps.

**Parameters:**
- `callback` (function): Callback function that receives an array of app objects

**Android App object structure:**
```javascript
{
  packageName: string,    // Package name of the app
  appName: string,        // Display name of the app
  versionName: string,    // Version name (e.g., "1.0.0")
  versionCode: number     // Version code (e.g., 1)
}
```

**iOS App object structure:**
```javascript
{
  appName: string,        // Display name of the app
  packageName: string,    // URL scheme of the app
  urlScheme: string,      // URL scheme of the app
  isInstalled: boolean    // Always true for detected apps
}
```

### `getAllInstalledApps(callback)`

Gets the list of all installed apps.

**Android**: Includes both user and system apps.
**iOS**: Returns the same result as `getInstalledApps()`.

**Parameters:**
- `callback` (function): Callback function that receives an array of app objects

**Android App object structure:**
```javascript
{
  packageName: string,    // Package name of the app
  appName: string,        // Display name of the app
  versionName: string,    // Version name (e.g., "1.0.0")
  versionCode: number,    // Version code (e.g., 1)
  isSystemApp: boolean    // Whether the app is a system app
}
```

**iOS App object structure:**
```javascript
{
  appName: string,        // Display name of the app
  packageName: string,    // URL scheme of the app
  urlScheme: string,      // URL scheme of the app
  isInstalled: boolean    // Always true for detected apps
}
```

## Platform Differences

### Android
- Can detect all installed apps (with proper permissions)
- Returns detailed app information including version
- Supports system app detection
- Requires `QUERY_ALL_PACKAGES` permission

### iOS
- Can only detect apps with registered URL schemes
- Limited to popular apps with known schemes
- No version information available
- No additional permissions required
- Sandboxing restrictions apply

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contact

For any inquiries or further assistance, please reach out to the author:

- **Author:** Harun Selçuk Çetin  
- **Instagram:** [https://instagram.com/selcukctn](https://instagram.com/selcukctn)  
- **GitHub:** [https://github.com/selcukctn](https://github.com/selcukctn)
- **Linkedin:** [https://www.linkedin.com/in/harun-selcuk-cetin-375b03a0/](https://www.linkedin.com/in/harun-selcuk-cetin-375b03a0/)