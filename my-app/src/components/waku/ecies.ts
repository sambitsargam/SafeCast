/**
 * Waku ECIES Encryption Utilities
 * 
 * ECIES encryption uses a public key for encryption and a private key for decryption.
 * This is useful for one-to-one communication where each user has their own key pair.
 */

import { generatePrivateKey, getPublicKey } from "@waku/message-encryption";
import { createEncoder, createDecoder } from "@waku/message-encryption/ecies";
import type { IRoutingInfo } from "@waku/interfaces";

export interface ECIESEncryptionConfig {
  contentTopic: string;
  publicKey: Uint8Array;
  routingInfo?: IRoutingInfo;
}

export interface ECIESSignedConfig extends ECIESEncryptionConfig {
  sigPrivKey: Uint8Array;
}

/**
 * Generate a random ECDSA private key for ECIES encryption
 * @returns {Uint8Array} Random private key (keep secure!)
 */
export function generateRandomPrivateKey(): Uint8Array {
  return generatePrivateKey();
}

/**
 * Generate a public key from a private key
 * @param privateKey - ECDSA private key
 * @returns {Uint8Array} Corresponding public key
 */
export function generatePublicKeyFromPrivate(privateKey: Uint8Array): Uint8Array {
  return getPublicKey(privateKey);
}

/**
 * Generate a complete ECIES key pair
 * @returns {Object} Object containing privateKey and publicKey
 */
export function generateECIESKeyPair() {
  const privateKey = generateRandomPrivateKey();
  const publicKey = generatePublicKeyFromPrivate(privateKey);
  
  return {
    privateKey,
    publicKey,
  };
}

/**
 * Create an ECIES message encoder for sending encrypted messages
 * @param config - Configuration object containing contentTopic and publicKey
 * @returns {Object} ECIES encoder
 */
export function createECIESEncoder(config: ECIESEncryptionConfig) {
  return createEncoder({
    contentTopic: config.contentTopic,
    publicKey: config.publicKey,
    routingInfo: config.routingInfo || { 
      clusterId: 0, 
      shardId: 0,
      pubsubTopic: '/waku/2/default-waku/proto' 
    },
  });
}

/**
 * Create a signed ECIES message encoder for sending encrypted and signed messages
 * @param config - Configuration object containing contentTopic, publicKey, and sigPrivKey
 * @returns {Object} Signed ECIES encoder
 */
export function createSignedECIESEncoder(config: ECIESSignedConfig) {
  return createEncoder({
    contentTopic: config.contentTopic,
    publicKey: config.publicKey,
    sigPrivKey: config.sigPrivKey,
    routingInfo: config.routingInfo || { 
      clusterId: 0, 
      shardId: 0,
      pubsubTopic: '/waku/2/default-waku/proto' 
    },
  });
}

/**
 * Create an ECIES message decoder for receiving encrypted messages
 * @param contentTopic - Message content topic
 * @param privateKey - Private key for decrypting messages
 * @param routingInfo - Optional routing info for pubsub
 * @returns {Object} ECIES decoder
 */
export function createECIESDecoder(
  contentTopic: string, 
  privateKey: Uint8Array, 
  routingInfo: IRoutingInfo = { 
    clusterId: 0, 
    shardId: 0,
    pubsubTopic: '/waku/2/default-waku/proto' 
  }
) {
  return createDecoder(contentTopic, routingInfo, privateKey);
}

/**
 * Send encrypted message using ECIES encryption
 * @param node - Waku node instance
 * @param encoder - ECIES encoder
 * @param payload - Message payload to send
 */
export async function sendECIESMessage(node: any, encoder: any, payload: any) {
  try {
    await node.lightPush.send(encoder, { payload });
    console.log("ECIES encrypted message sent successfully");
  } catch (error) {
    console.error("Failed to send ECIES encrypted message:", error);
    throw error;
  }
}

/**
 * Subscribe to ECIES encrypted messages
 * @param subscription - Waku subscription instance
 * @param decoder - ECIES decoder
 * @param callback - Callback function to handle received messages
 */
export async function subscribeToECIESMessages(subscription: any, decoder: any, callback: (message: any) => void) {
  try {
    await subscription.subscribe([decoder], callback);
    console.log("Subscribed to ECIES encrypted messages");
  } catch (error) {
    console.error("Failed to subscribe to ECIES messages:", error);
    throw error;
  }
}

/**
 * Query ECIES encrypted messages from Store peers
 * @param node - Waku node instance
 * @param decoder - ECIES decoder
 * @param callback - Callback function to handle retrieved messages
 */
export async function queryECIESMessages(node: any, decoder: any, callback: (message: any) => void) {
  try {
    await node.store.queryWithOrderedCallback([decoder], callback);
    console.log("Queried ECIES encrypted messages from store");
  } catch (error) {
    console.error("Failed to query ECIES messages:", error);
    throw error;
  }
}
