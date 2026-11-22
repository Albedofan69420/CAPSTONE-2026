import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const PIN_LENGTH = 4;

//Genera un pin por usuario
const storageKey = (userId: string) => `pin_${userId}`;

type WebStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

// SecureStore solo existe en Android/iOS. La versión web se usa para poder probar
// el flujo en navegador; no ofrece la misma protección que Keychain/Keystore.
const getWebStorage = () =>
  (globalThis as typeof globalThis & { localStorage?: WebStorage }).localStorage;

async function readStoredPin(key: string) {
  if (Platform.OS === "web") {
    try {
      return getWebStorage()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  return SecureStore.getItemAsync(key);
}

async function writeStoredPin(key: string, value: string) {
  if (Platform.OS === "web") {
    const storage = getWebStorage();
    if (!storage) throw new Error("El almacenamiento del navegador no está disponible.");
    storage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function deleteStoredPin(key: string) {
  if (Platform.OS === "web") {
    try {
      getWebStorage()?.removeItem(key);
    } catch {
      // Si el navegador bloquea su almacenamiento, no queda nada que eliminar.
    }
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const hashPin = (pin: string, salt: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + pin);

const parseStoredPin = (raw: string) => {
  try {
    const value = JSON.parse(raw) as { salt?: string; hash?: string };
    return value.salt && value.hash ? { salt: value.salt, hash: value.hash } : null;
  } catch {
    return null;
  }
};

/** Guarda el PIN como hash con sal, nunca en texto plano. */
export async function savePin(userId: string, pin: string) {
  const salt = toHex(Crypto.getRandomBytes(16));
  const hash = await hashPin(pin, salt);
  await writeStoredPin(storageKey(userId), JSON.stringify({ salt, hash }));
}

export async function hasPin(userId: string) {
  const key = storageKey(userId);
  const raw = await readStoredPin(key);
  if (!raw) return false;
  if (parseStoredPin(raw)) return true;

  await deleteStoredPin(key);
  return false;
}

export async function verifyPin(userId: string, pin: string) {
  const raw = await readStoredPin(storageKey(userId));
  if (!raw) return false;

  const stored = parseStoredPin(raw);
  if (stored) return (await hashPin(pin, stored.salt)) === stored.hash;

  // Un valor antiguo o dañado no debe impedir que la aplicación inicie.
  await deleteStoredPin(storageKey(userId));
  return false;
}

export async function removePin(userId: string) {
  await deleteStoredPin(storageKey(userId));
}
