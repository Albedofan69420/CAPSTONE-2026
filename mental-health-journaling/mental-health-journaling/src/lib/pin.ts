import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

export const PIN_LENGTH = 4;

//Genera un pin por usuario
const storageKey = (userId: string) => `pin_${userId}`;

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const hashPin = (pin: string, salt: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + pin);

/** Guarda el PIN como hash con sal, nunca en texto plano. */
export async function savePin(userId: string, pin: string) {
  const salt = toHex(Crypto.getRandomBytes(16));
  const hash = await hashPin(pin, salt);
  await SecureStore.setItemAsync(storageKey(userId), JSON.stringify({ salt, hash }));
}

export async function hasPin(userId: string) {
  return (await SecureStore.getItemAsync(storageKey(userId))) !== null;
}

export async function verifyPin(userId: string, pin: string) {
  const raw = await SecureStore.getItemAsync(storageKey(userId));
  if (!raw) return false;

  const { salt, hash } = JSON.parse(raw) as { salt: string; hash: string };
  return (await hashPin(pin, salt)) === hash;
}

export async function removePin(userId: string) {
  await SecureStore.deleteItemAsync(storageKey(userId));
}