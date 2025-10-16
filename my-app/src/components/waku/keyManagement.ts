/**
 * Waku Key Management Utilities
 * 
 * This module provides utilities for storing, retrieving, and managing
 * encryption keys securely using browser storage and hexadecimal encoding.
 */

import { generateSymmetricKey, generatePrivateKey } from "@waku/message-encryption";
import { bytesToHex, hexToBytes } from "@waku/utils/bytes";

export interface KeyStorage {
  symmetricKey?: string;
  privateKey?: string;
  publicKey?: string;
  signingPrivateKey?: string;
  signingPublicKey?: string;
}

export interface KeyPair {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

export interface SymmetricKeyPair {
  symmetricKey: Uint8Array;
}

/**
 * Convert Uint8Array to hexadecimal string for storage
 * @param bytes - Byte array to convert
 * @returns {string} Hexadecimal string representation
 */
export function bytesToHexString(bytes: Uint8Array): string {
  return bytesToHex(bytes);
}

/**
 * Convert hexadecimal string back to Uint8Array
 * @param hexString - Hexadecimal string to convert
 * @returns {Uint8Array} Byte array representation
 */
export function hexStringToBytes(hexString: string): Uint8Array {
  return hexToBytes(hexString);
}

/**
 * Generate a random symmetric key and convert to hex
 * @returns {string} Hexadecimal representation of symmetric key
 */
export function generateSymmetricKeyHex(): string {
  const symmetricKey = generateSymmetricKey();
  return bytesToHexString(symmetricKey);
}

/**
 * Generate a random private key and convert to hex
 * @returns {string} Hexadecimal representation of private key
 */
export function generatePrivateKeyHex(): string {
  const privateKey = generatePrivateKey();
  return bytesToHexString(privateKey);
}

/**
 * Generate a complete key set (symmetric + ECIES + signing keys)
 * @returns {KeyStorage} Object containing all keys in hex format
 */
export function generateCompleteKeySet(): KeyStorage {
  // Generate symmetric key
  const symmetricKey = generateSymmetricKey();
  const symmetricKeyHex = bytesToHexString(symmetricKey);

  // Generate ECIES key pair
  const privateKey = generatePrivateKey();
  const privateKeyHex = bytesToHexString(privateKey);
  
  // Note: Public key would be generated from private key when needed
  // We don't store it here as it can be derived from private key

  // Generate signing key pair
  const signingPrivateKey = generatePrivateKey();
  const signingPrivateKeyHex = bytesToHexString(signingPrivateKey);

  return {
    symmetricKey: symmetricKeyHex,
    privateKey: privateKeyHex,
    signingPrivateKey: signingPrivateKeyHex,
  };
}

/**
 * Restore symmetric key from hex string
 * @param hexString - Hexadecimal string representation
 * @returns {Uint8Array} Restored symmetric key
 */
export function restoreSymmetricKey(hexString: string): Uint8Array {
  return hexStringToBytes(hexString);
}

/**
 * Restore private key from hex string
 * @param hexString - Hexadecimal string representation
 * @returns {Uint8Array} Restored private key
 */
export function restorePrivateKey(hexString: string): Uint8Array {
  return hexStringToBytes(hexString);
}

/**
 * Restore signing private key from hex string
 * @param hexString - Hexadecimal string representation
 * @returns {Uint8Array} Restored signing private key
 */
export function restoreSigningPrivateKey(hexString: string): Uint8Array {
  return hexStringToBytes(hexString);
}

/**
 * Key Storage Manager for browser localStorage
 */
export class KeyStorageManager {
  protected storageKey: string;

  constructor(storageKey: string = 'safecast-waku-keys') {
    this.storageKey = storageKey;
  }

  /**
   * Save keys to localStorage
   * @param keys - Keys to save
   */
  saveKeys(keys: KeyStorage): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(keys));
      console.log("Keys saved to localStorage successfully");
    } catch (error) {
      console.error("Failed to save keys to localStorage:", error);
      throw error;
    }
  }

  /**
   * Load keys from localStorage
   * @returns {KeyStorage | null} Loaded keys or null if not found
   */
  loadKeys(): KeyStorage | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const keys = JSON.parse(stored) as KeyStorage;
        console.log("Keys loaded from localStorage successfully");
        return keys;
      }
      return null;
    } catch (error) {
      console.error("Failed to load keys from localStorage:", error);
      return null;
    }
  }

  /**
   * Clear all stored keys
   */
  clearKeys(): void {
    try {
      localStorage.removeItem(this.storageKey);
      console.log("Keys cleared from localStorage");
    } catch (error) {
      console.error("Failed to clear keys from localStorage:", error);
    }
  }

  /**
   * Check if keys exist in storage
   * @returns {boolean} True if keys exist
   */
  hasKeys(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }

  /**
   * Generate and save a complete key set
   * @returns {KeyStorage} Generated and saved keys
   */
  generateAndSaveKeys(): KeyStorage {
    const keys = generateCompleteKeySet();
    this.saveKeys(keys);
    return keys;
  }

  /**
   * Load existing keys or generate new ones if none exist
   * @returns {KeyStorage} Loaded or generated keys
   */
  loadOrGenerateKeys(): KeyStorage {
    const existingKeys = this.loadKeys();
    if (existingKeys) {
      return existingKeys;
    }
    
    console.log("No existing keys found, generating new key set");
    return this.generateAndSaveKeys();
  }
}

/**
 * Secure Key Manager with additional security features
 */
export class SecureKeyManager extends KeyStorageManager {
  private encryptionKey: string;

  constructor(storageKey: string = 'safecast-waku-keys-secure', encryptionKey?: string) {
    super(storageKey);
    this.encryptionKey = encryptionKey || this.generateEncryptionKey();
  }

  /**
   * Generate a random encryption key for additional security
   * @returns {string} Random encryption key
   */
  private generateEncryptionKey(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Simple XOR encryption for additional key security
   * @param data - Data to encrypt
   * @param key - Encryption key
   * @returns {string} Encrypted data
   */
  private simpleEncrypt(data: string, key: string): string {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result); // Base64 encode
  }

  /**
   * Simple XOR decryption
   * @param encryptedData - Encrypted data
   * @param key - Decryption key
   * @returns {string} Decrypted data
   */
  private simpleDecrypt(encryptedData: string, key: string): string {
    const data = atob(encryptedData); // Base64 decode
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }

  /**
   * Save keys with additional encryption
   * @param keys - Keys to save
   */
  saveKeys(keys: KeyStorage): void {
    try {
      const jsonString = JSON.stringify(keys);
      const encrypted = this.simpleEncrypt(jsonString, this.encryptionKey);
      localStorage.setItem(this.storageKey, encrypted);
      console.log("Keys saved with additional encryption");
    } catch (error) {
      console.error("Failed to save encrypted keys:", error);
      throw error;
    }
  }

  /**
   * Load keys with decryption
   * @returns {KeyStorage | null} Loaded keys or null if not found
   */
  loadKeys(): KeyStorage | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const decrypted = this.simpleDecrypt(stored, this.encryptionKey);
        const keys = JSON.parse(decrypted) as KeyStorage;
        console.log("Keys loaded and decrypted successfully");
        return keys;
      }
      return null;
    } catch (error) {
      console.error("Failed to load and decrypt keys:", error);
      return null;
    }
  }
}
