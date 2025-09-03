// test.jsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  RefreshControl,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import RNInstalledAppChecker from "react-native-installed-app-checker";

const Button = ({ title, onPress, disabled }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.btn,
      disabled ? { opacity: 0.5 } : null,
    ]}
  >
    <Text style={styles.btnText}>{title}</Text>
  </Pressable>
);

const Pill = ({ label, tone = "muted" }) => (
  <View
    style={[
      styles.pill,
      tone === "ok" && { backgroundColor: "#E6F7EE", borderColor: "#B6E4C7" },
      tone === "warn" && { backgroundColor: "#FFF4E5", borderColor: "#FFD6A5" },
      tone === "muted" && { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
    ]}
  >
    <Text
      style={[
        styles.pillText,
        tone === "ok" && { color: "#13795B" },
        tone === "warn" && { color: "#A15C07" },
        tone === "muted" && { color: "#374151" },
      ]}
    >
      {label}
    </Text>
  </View>
);

export default function InstalledAppsTester() {
  const [pkgQuery, setPkgQuery] = useState("com.android.chrome"); // örnek paket
  const [checkResult, setCheckResult] = useState(null); // true | false | null
  const [userApps, setUserApps] = useState([]);
  const [allApps, setAllApps] = useState([]);
  const [filter, setFilter] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  const listRef = useRef(null);

  const onCheck = useCallback(() => {
    if (!pkgQuery?.trim()) {
      Alert.alert("Uyarı", "Lütfen bir paket adı girin (örn: com.android.chrome).");
      return;
    }
    RNInstalledAppChecker.isAppInstalled(pkgQuery.trim(), (isInstalled) => {
      setCheckResult(!!isInstalled);
    });
  }, [pkgQuery]);

  const onGetUserApps = useCallback(() => {
    if (Platform.OS !== "android") {
      Alert.alert("Sadece Android", "Bu test yalnızca Android'de çalışır.");
      return;
    }
    setLoadingUser(true);
    RNInstalledAppChecker.getInstalledApps((apps) => {
      // apps: [{packageName, appName, versionName, versionCode}]
      setUserApps(Array.isArray(apps) ? apps : []);
      setLoadingUser(false);
    });
  }, []);

  const onGetAllApps = useCallback(() => {
    if (Platform.OS !== "android") {
      Alert.alert("Sadece Android", "Bu test yalnızca Android'de çalışır.");
      return;
    }
    setLoadingAll(true);
    RNInstalledAppChecker.getAllInstalledApps((apps) => {
      // apps: [{... , isSystemApp: boolean}]
      setAllApps(Array.isArray(apps) ? apps : []);
      setLoadingAll(false);
    });
  }, []);

  const clearLists = useCallback(() => {
    setUserApps([]);
    setAllApps([]);
    setFilter("");
  }, []);

  const filteredUser = useMemo(() => {
    if (!filter.trim()) return userApps;
    const q = filter.toLowerCase();
    return userApps.filter(
      (a) =>
        a.appName?.toLowerCase().includes(q) ||
        a.packageName?.toLowerCase().includes(q)
    );
  }, [userApps, filter]);

  const filteredAll = useMemo(() => {
    if (!filter.trim()) return allApps;
    const q = filter.toLowerCase();
    return allApps.filter(
      (a) =>
        a.appName?.toLowerCase().includes(q) ||
        a.packageName?.toLowerCase().includes(q)
    );
  }, [allApps, filter]);

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.appName}>{item.appName || "(İsimsiz Uygulama)"}</Text>
        <Text style={styles.pkg}>{item.packageName}</Text>
        <View style={styles.metaRow}>
          <Pill label={`v${item.versionName ?? "?"} (${item.versionCode ?? "?"})`} />
          {"isSystemApp" in item ? (
            <Pill
              label={item.isSystemApp ? "Sistem Uygulaması" : "Kullanıcı Uygulaması"}
              tone={item.isSystemApp ? "warn" : "ok"}
            />
          ) : null}
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item) => item.packageName, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>react-native-installed-app-checker — Test</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Paket Adı</Text>
        <TextInput
          value={pkgQuery}
          onChangeText={setPkgQuery}
          placeholder="com.example.app"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <View style={styles.row}>
          <Button title="Yüklü mü?" onPress={onCheck} />
          {checkResult === true && <Pill label="Yüklü" tone="ok" />}
          {checkResult === false && <Pill label="Bulunamadı" tone="warn" />}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Liste İşlemleri</Text>
        <View style={styles.rowWrap}>
          <Button title="Kullanıcı Uygulamaları" onPress={onGetUserApps} disabled={loadingUser} />
          <Button title="Tüm Uygulamalar" onPress={onGetAllApps} disabled={loadingAll} />
          <Button title="Temizle" onPress={clearLists} />
        </View>

        <TextInput
          value={filter}
          onChangeText={setFilter}
          placeholder="Ara: app adı veya paket adı"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        {/* Kullanıcı uygulamaları */}
        <Text style={styles.subTitle}>
          Kullanıcı Uygulamaları ({filteredUser.length})
        </Text>
        <FlatList
          ref={listRef}
          data={filteredUser}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={loadingUser} onRefresh={onGetUserApps} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              Liste boş. "Kullanıcı Uygulamaları"na basarak yükle.
            </Text>
          }
          style={{ maxHeight: 240 }}
        />

        {/* Tüm uygulamalar */}
        <Text style={[styles.subTitle, { marginTop: 16 }]}>
          Tüm Uygulamalar ({filteredAll.length})
        </Text>
        <FlatList
          data={filteredAll}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={loadingAll} onRefresh={onGetAllApps} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              Liste boş. "Tüm Uygulamalar"a basarak yükle.
            </Text>
          }
          style={{ maxHeight: 320 }}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.note}>
          Not: Android 11+ sürümlerde uygulama listesine erişim için{" "}
          <Text style={styles.mono}>QUERY_ALL_PACKAGES</Text> izni manifest’te tanımlı olmalı
          ve Play politikalarına uygun bir gerekçe sunulmalıdır.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFFFFF" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#111827" },
  section: { marginBottom: 16, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#FAFAFA" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  btn: {
    backgroundColor: "#111827",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnText: { color: "#FFFFFF", fontWeight: "600" },
  subTitle: { fontSize: 16, fontWeight: "700", marginTop: 8, marginBottom: 8, color: "#111827" },
  empty: { fontSize: 13, color: "#6B7280", paddingVertical: 8 },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  appName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  pkg: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 8, alignItems: "center" },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: { fontSize: 12, fontWeight: "700" },
  mono: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), color: "#111827" },
  note: { fontSize: 12, color: "#4B5563" },
  footer: { marginTop: 8 },
});
