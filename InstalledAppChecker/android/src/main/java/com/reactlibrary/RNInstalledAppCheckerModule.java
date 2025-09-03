
package com.reactlibrary;

import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import java.util.List;
import java.util.ArrayList;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

public class RNInstalledAppCheckerModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNInstalledAppCheckerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNInstalledAppChecker";
  }
    @ReactMethod
    public void isAppInstalled(String packageName, Callback callback) {
        PackageManager packageManager = getReactApplicationContext().getPackageManager();
        boolean isInstalled;
        try {
            packageManager.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
            isInstalled = true;
        } catch (PackageManager.NameNotFoundException e) {
            isInstalled = false;
        }
        callback.invoke(isInstalled);
    }

    @ReactMethod
    public void getInstalledApps(Callback callback) {
        PackageManager packageManager = getReactApplicationContext().getPackageManager();
        List<PackageInfo> packages = packageManager.getInstalledPackages(PackageManager.GET_META_DATA);
        WritableArray installedApps = Arguments.createArray();

        for (PackageInfo packageInfo : packages) {
            // Sadece kullanıcı uygulamalarını dahil et (sistem uygulamalarını hariç tut)
            if ((packageInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {
                WritableMap appInfo = Arguments.createMap();
                appInfo.putString("packageName", packageInfo.packageName);
                appInfo.putString("appName", packageInfo.applicationInfo.loadLabel(packageManager).toString());
                appInfo.putString("versionName", packageInfo.versionName != null ? packageInfo.versionName : "Unknown");
                appInfo.putInt("versionCode", packageInfo.versionCode);
                appInfo.putDouble("firstInstallTime", packageInfo.firstInstallTime); // 毫秒
                appInfo.putDouble("lastUpdateTime", packageInfo.lastUpdateTime);     // 毫秒

                installedApps.pushMap(appInfo);
            }
        }

        callback.invoke(installedApps);
    }

    @ReactMethod
    public void getAllInstalledApps(Callback callback) {
        PackageManager packageManager = getReactApplicationContext().getPackageManager();
        List<PackageInfo> packages = packageManager.getInstalledPackages(PackageManager.GET_META_DATA);
        WritableArray installedApps = Arguments.createArray();

        for (PackageInfo packageInfo : packages) {
            WritableMap appInfo = Arguments.createMap();
            appInfo.putString("packageName", packageInfo.packageName);
            appInfo.putString("appName", packageInfo.applicationInfo.loadLabel(packageManager).toString());
            appInfo.putString("versionName", packageInfo.versionName != null ? packageInfo.versionName : "Unknown");
            appInfo.putInt("versionCode", packageInfo.versionCode);
            appInfo.putBoolean("isSystemApp", (packageInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0);
            installedApps.pushMap(appInfo);
        }

        callback.invoke(installedApps);
    }
}
