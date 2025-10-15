/**
 * Waku Message Signing Utilities
 * 
 * Message signing helps in proving the authenticity of received messages.
 * By attaching a signature to a message, you can verify its origin and integrity.
 * 
 * Note: Signing messages is only possible when encrypted, but if your application
 * does not require encryption, you can generate a symmetric key through hardcoded
 * or deterministic methods using information available to all users.
 */

import { generatePrivateKey, getPublicKey } from "@waku/message-encryption";

export interface SignatureVerificationResult {
  isValid: boolean;
  signature?: Uint8Array;
  signaturePublicKey?: Uint8Array;
  message?: string;
}

/**
 * Generate a random ECDSA private key for message signing
 * @returns {Uint8Array} Random private key for signing
 */
export function generateSigningPrivateKey(): Uint8Array {
  return generatePrivateKey();
}

/**
 * Generate a public key from a private key for signature verification
 * @param privateKey - ECDSA private key
 * @returns {Uint8Array} Corresponding public key
 */
export function generateSigningPublicKey(privateKey: Uint8Array): Uint8Array {
  return getPublicKey(privateKey);
}

/**
 * Generate a complete signing key pair
 * @returns {Object} Object containing signingPrivateKey and signingPublicKey
 */
export function generateSigningKeyPair() {
  const signingPrivateKey = generateSigningPrivateKey();
  const signingPublicKey = generateSigningPublicKey(signingPrivateKey);
  
  return {
    signingPrivateKey,
    signingPublicKey,
  };
}

/**
 * Verify message signature to ensure authenticity
 * @param wakuMessage - Decoded Waku message
 * @param expectedPublicKey - Expected public key of the sender
 * @returns {SignatureVerificationResult} Verification result with details
 */
export function verifyMessageSignature(wakuMessage: any, expectedPublicKey: Uint8Array): SignatureVerificationResult {
  try {
    // Extract signature and public key from the message
    const signature = wakuMessage.signature;
    const signaturePublicKey = wakuMessage.signaturePublicKey;

    if (!signature || !signaturePublicKey) {
      return {
        isValid: false,
        message: "No signature found in message"
      };
    }

    // Verify the signature using Waku's built-in verification
    const isValid = wakuMessage.verifySignature(expectedPublicKey);

    return {
      isValid,
      signature,
      signaturePublicKey,
      message: isValid ? "Message signature verified successfully" : "Message signature verification failed"
    };
  } catch (error) {
    console.error("Error verifying message signature:", error);
    return {
      isValid: false,
      message: `Signature verification error: ${error}`
    };
  }
}

/**
 * Create a callback function for handling signed messages
 * @param expectedPublicKey - Expected public key of the sender
 * @param onMessageVerified - Callback when message is verified
 * @param onMessageInvalid - Callback when message verification fails
 * @returns {Function} Callback function for message handling
 */
export function createSignedMessageCallback(
  expectedPublicKey: Uint8Array,
  onMessageVerified?: (message: any) => void,
  onMessageInvalid?: (message: any, reason: string) => void
) {
  return (wakuMessage: any) => {
    const verificationResult = verifyMessageSignature(wakuMessage, expectedPublicKey);
    
    if (verificationResult.isValid) {
      console.log("✅ Message signature verified:", verificationResult.message);
      onMessageVerified?.(wakuMessage);
    } else {
      console.log("❌ Message signature verification failed:", verificationResult.message);
      onMessageInvalid?.(wakuMessage, verificationResult.message || "Unknown error");
    }
  };
}

/**
 * Example usage for Alice (sender) and Bob (receiver) communication
 * This demonstrates how to set up signed message communication
 */
export class SignedMessageExample {
  private aliceKeyPair: { privateKey: Uint8Array; publicKey: Uint8Array };
  private bobKeyPair: { privateKey: Uint8Array; publicKey: Uint8Array };

  constructor() {
    // Generate key pairs for Alice and Bob
    this.aliceKeyPair = generateSigningKeyPair();
    this.bobKeyPair = generateSigningKeyPair();
  }

  /**
   * Get Alice's public key for sharing with Bob
   */
  getAlicePublicKey(): Uint8Array {
    return this.aliceKeyPair.publicKey;
  }

  /**
   * Get Bob's public key for sharing with Alice
   */
  getBobPublicKey(): Uint8Array {
    return this.bobKeyPair.publicKey;
  }

  /**
   * Get Alice's private key for signing messages
   */
  getAlicePrivateKey(): Uint8Array {
    return this.aliceKeyPair.privateKey;
  }

  /**
   * Get Bob's private key for signing messages
   */
  getBobPrivateKey(): Uint8Array {
    return this.bobKeyPair.privateKey;
  }

  /**
   * Create a callback for Bob to verify Alice's messages
   */
  createBobCallbackForAlice(): (message: any) => void {
    return createSignedMessageCallback(
      this.aliceKeyPair.publicKey,
      (message) => {
        console.log("Bob received verified message from Alice");
        // Handle verified message from Alice
      },
      (message, reason) => {
        console.log("Bob received invalid message from Alice:", reason);
        // Handle invalid message
      }
    );
  }

  /**
   * Create a callback for Alice to verify Bob's messages
   */
  createAliceCallbackForBob(): (message: any) => void {
    return createSignedMessageCallback(
      this.bobKeyPair.publicKey,
      (message) => {
        console.log("Alice received verified message from Bob");
        // Handle verified message from Bob
      },
      (message, reason) => {
        console.log("Alice received invalid message from Bob:", reason);
        // Handle invalid message
      }
    );
  }
}
