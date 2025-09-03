
import { NativeModules } from 'react-native';

const { RNInstalledAppChecker } = NativeModules;

export default {
  /**
   * Belirli bir uygulamanın yüklü olup olmadığını kontrol eder
   * @param {string} packageName - Kontrol edilecek uygulamanın paket adı
   * @param {function} callback - Sonucu döndüren callback fonksiyonu
   */
  isAppInstalled: (packageName, callback) => {
    RNInstalledAppChecker.isAppInstalled(packageName, callback);
  },

  /**
   * Sadece kullanıcı tarafından yüklenen uygulamaların listesini döndürür (sistem uygulamaları hariç)
   * @param {function} callback - Uygulama listesini döndüren callback fonksiyonu
   */
  getInstalledApps: (callback) => {
    RNInstalledAppChecker.getInstalledApps(callback);
  },

  /**
   * Tüm yüklü uygulamaların listesini döndürür (sistem uygulamaları dahil)
   * @param {function} callback - Uygulama listesini döndüren callback fonksiyonu
   */
  getAllInstalledApps: (callback) => {
    RNInstalledAppChecker.getAllInstalledApps(callback);
  }
};
