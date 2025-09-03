# react-native-installed-app-checker

`react-native-installed-app-checker` is a React Native module that allows you to check if a specific application is installed on the device and get the list of installed applications. This module supports Android platform.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/react-native-installed-app-checker) to install react-native-installed-app-checker.

```bash
npm install react-native-installed-app-checker@1.0.7
```
If any error u can use 1.0.4 version
```bash
npm install react-native-installed-app-checker@1.0.4
```
## Android Specific Setup

Permissions
In order to check if an app is installed or get the list of installed apps, you'll need to request the QUERY_ALL_PACKAGES permission. Add the following permission to your AndroidManifest.xml:

```bash
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
```
This permission allows the app to query the list of all installed apps on the device. Note that using this permission requires justification, and you should check the Google Play policies if you plan to distribute your app through the Play Store.

Android 11 and Above
Starting with Android 11 (API level 30), Google has introduced additional restrictions for accessing installed apps. To handle this properly, you may need to provide a rationale for why your app requires the QUERY_ALL_PACKAGES permission. For more information, see the [Google Play policies](https://play.google/developer-content-policy/).
## Usage

### Check if a specific app is installed

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
      <Button title="Check App Installation" onPress={() => checkAppInstalled('com.example.otherapp')} />
    </View>
  );
};

export default App;
```

### Get list of installed user apps (excluding system apps)

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

### Get list of all installed apps (including system apps)

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

### `isAppInstalled(packageName, callback)`

Checks if a specific app is installed on the device.

**Parameters:**
- `packageName` (string): The package name of the app to check
- `callback` (function): Callback function that receives a boolean indicating if the app is installed

### `getInstalledApps(callback)`

Gets the list of installed user apps (excludes system apps).

**Parameters:**
- `callback` (function): Callback function that receives an array of app objects

**App object structure:**
```javascript
{
  packageName: string,    // Package name of the app
  appName: string,        // Display name of the app
  versionName: string,    // Version name (e.g., "1.0.0")
  versionCode: number     // Version code (e.g., 1)
}
```

### `getAllInstalledApps(callback)`

Gets the list of all installed apps (includes both user and system apps).

**Parameters:**
- `callback` (function): Callback function that receives an array of app objects

**App object structure:**
```javascript
{
  packageName: string,    // Package name of the app
  appName: string,        // Display name of the app
  versionName: string,    // Version name (e.g., "1.0.0")
  versionCode: number,    // Version code (e.g., 1)
  isSystemApp: boolean    // Whether the app is a system app
}
```

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