/**
 * Waku Symmetric Encryption Utilities
 * 
 * Symmetric encryption uses a single, shared key for message encryption and decryption.
 * This is useful for group chats or when all participants share the same key.
 */

import { generateSymmetricKey } from "@waku/message-encryption";
import { createEncoder, createDecoder } from "@waku/message-encryption/symmetric";
import type { IRoutingInfo } from "@waku/interfaces";

export interface SymmetricEncryptionConfig {
  contentTopic: string;
  symKey: Uint8Array;
  routingInfo?: IRoutingInfo;
}

export interface SymmetricSignedConfig extends SymmetricEncryptionConfig {
  sigPrivKey: Uint8Array;
}

/**
 * Generate a random symmetric key for encryption/decryption
 * @returns {Uint8Array} Random symmetric key
 */
export function generateRandomSymmetricKey(): Uint8Array {
  return generateSymmetricKey();
}

/**
 * Create a symmetric message encoder for sending encrypted messages
 * @param config - Configuration object containing contentTopic and symKey
 * @returns {Object} Symmetric encoder
 */
export function createSymmetricEncoder(config: SymmetricEncryptionConfig) {
  return createEncoder({
    contentTopic: config.contentTopic,
    symKey: config.symKey,
    routingInfo: config.routingInfo || { 
      clusterId: 0, 
      shardId: 0,
      pubsubTopic: '/waku/2/default-waku/proto' 
    },
  });
}

/**
 * Create a signed symmetric message encoder for sending encrypted and signed messages
 * @param config - Configuration object containing contentTopic, symKey, and sigPrivKey
 * @returns {Object} Signed symmetric encoder
 */
export function createSignedSymmetricEncoder(config: SymmetricSignedConfig) {
  return createEncoder({
    contentTopic: config.contentTopic,
    symKey: config.symKey,
    sigPrivKey: config.sigPrivKey,
    routingInfo: config.routingInfo || { 
      clusterId: 0, 
      shardId: 0,
      pubsubTopic: '/waku/2/default-waku/proto' 
    },
  });
}

/**
 * Create a symmetric message decoder for receiving encrypted messages
 * @param contentTopic - Message content topic
 * @param symKey - Symmetric key for decrypting messages
 * @param routingInfo - Optional routing info for pubsub
 * @returns {Object} Symmetric decoder
 */
export function createSymmetricDecoder(
  contentTopic: string, 
  symKey: Uint8Array,
  routingInfo: IRoutingInfo = { 
    clusterId: 0, 
    shardId: 0,
    pubsubTopic: '/waku/2/default-waku/proto' 
  }
) {
  return createDecoder(contentTopic, routingInfo, symKey);
}

/**
 * Send encrypted message using symmetric encryption
 * @param node - Waku node instance
 * @param encoder - Symmetric encoder
 * @param payload - Message payload to send
 */
export async function sendSymmetricMessage(node: any, encoder: any, payload: any) {
  try {
    await node.lightPush.send(encoder, { payload });
    console.log("Symmetric encrypted message sent successfully");
  } catch (error) {
    console.error("Failed to send symmetric encrypted message:", error);
    throw error;
  }
}

/**
 * Subscribe to symmetric encrypted messages
 * @param subscription - Waku subscription instance
 * @param decoder - Symmetric decoder
 * @param callback - Callback function to handle received messages
 */
export async function subscribeToSymmetricMessages(subscription: any, decoder: any, callback: (message: any) => void) {
  try {
    await subscription.subscribe([decoder], callback);
    console.log("Subscribed to symmetric encrypted messages");
  } catch (error) {
    console.error("Failed to subscribe to symmetric messages:", error);
    throw error;
  }
}

/**
 * Query symmetric encrypted messages from Store peers
 * @param node - Waku node instance
 * @param decoder - Symmetric decoder
 * @param callback - Callback function to handle retrieved messages
 */
export async function querySymmetricMessages(node: any, decoder: any, callback: (message: any) => void) {
  try {
    await node.store.queryWithOrderedCallback([decoder], callback);
    console.log("Queried symmetric encrypted messages from store");
  } catch (error) {
    console.error("Failed to query symmetric messages:", error);
    throw error;
  }
}
