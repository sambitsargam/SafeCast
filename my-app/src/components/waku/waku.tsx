import { generateSymmetricKey } from "@waku/message-encryption";

// Generate a random symmetric key
const symmetricKey = generateSymmetricKey();

import { createEncoder } from "@waku/message-encryption/symmetric";

// Create a symmetric message encoder
const encoder = createEncoder({
  contentTopic: contentTopic, // message content topic
  symKey: symmetricKey, // symmetric key for encrypting messages
});

// Send the message using Light Push
await node.lightPush.send(encoder, { payload });

import { createDecoder } from "@waku/message-encryption/symmetric";

// Create a symmetric message decoder
const decoder = createDecoder(contentTopic, symmetricKey);

// Receive messages from a Filter subscription
await subscription.subscribe([decoder], callback);

// Retrieve messages from Store peers
await node.store.queryWithOrderedCallback([decoder], callback);

import { generatePrivateKey, getPublicKey } from "@waku/message-encryption";

// Generate a random ECDSA private key, keep secure
const privateKey = generatePrivateKey();

// Generate a public key from the private key, provide to the sender
const publicKey = getPublicKey(privateKey);

import { createEncoder } from "@waku/message-encryption/ecies";

// Create an ECIES message encoder
const encoder = createEncoder({
  contentTopic: contentTopic, // message content topic
  publicKey: publicKey, // ECIES public key for encrypting messages
});

// Send the message using Light Push
await node.lightPush.send(encoder, { payload });

import { createDecoder } from "@waku/message-encryption/ecies";

// Create an ECIES message decoder
const decoder = createDecoder(contentTopic, privateKey);

// Receive messages from a Filter subscription
await subscription.subscribe([decoder], callback);

// Retrieve messages from Store peers
await node.store.queryWithOrderedCallback([decoder], callback);

import { generatePrivateKey, getPublicKey } from "@waku/message-encryption";
import { createEncoder as createSymmetricEncoder } from "@waku/message-encryption/symmetric";
import { createEncoder as createECIESEncoder } from "@waku/message-encryption/ecies";

// Generate a random ECDSA private key for signing messages
// ECIES encryption and message signing both use ECDSA keys
// For this example, we'll call the sender of the message Alice
const alicePrivateKey = generatePrivateKey();
const alicePublicKey = getPublicKey(alicePrivateKey);

// Create a symmetric encoder that signs messages
const symmetricEncoder = createSymmetricEncoder({
  contentTopic: contentTopic, // message content topic
  symKey: symmetricKey, // symmetric key for encrypting messages
  sigPrivKey: alicePrivateKey, // private key for signing messages before encryption
});

// Create an ECIES encoder that signs messages
const ECIESEncoder = createECIESEncoder({
  contentTopic: contentTopic, // message content topic
  publicKey: publicKey, // ECIES public key for encrypting messages
  sigPrivKey: alicePrivateKey, // private key for signing messages before encryption
});

// Send and receive your messages as usual with Light Push and Filter
await subscription.subscribe([symmetricEncoder], callback);
await node.lightPush.send(symmetricEncoder, { payload });

await subscription.subscribe([ECIESEncoder], callback);
await node.lightPush.send(ECIESEncoder, { payload });

import { generatePrivateKey } from "@waku/message-encryption";
import { createEncoder } from "@waku/message-encryption/symmetric";

// Generate a random private key for signing messages
// For this example, we'll call the receiver of the message Bob
const bobPrivateKey = generatePrivateKey();

// Create an encoder that signs messages
const encoder = createEncoder({
  contentTopic: contentTopic,
  symKey: symmetricKey,
  sigPrivKey: bobPrivateKey,
});

// Modify the callback function to verify message signature
const callback = (wakuMessage) => {
  // Extract the message signature and public key of the signature
  // You can compare the signaturePublicKey with Alice public key
  const signature = wakuMessage.signature;
  const signaturePublicKey = wakuMessage.signaturePublicKey;

  // Verify the message was actually signed and sent by Alice
  // Alice's public key can be gotten from broadcasting or out-of-band methods
  if (wakuMessage.verifySignature(alicePublicKey)) {
    console.log("This message was signed by Alice");
  } else {
    console.log("This message was NOT signed by Alice");
  }
};

await subscription.subscribe([encoder], callback);

import { bytesToHex, hexToBytes } from "@waku/utils/bytes";

// Generate random symmetric and private keys
const symmetricKey = generateSymmetricKey();
const privateKey = generatePrivateKey();

// Store the keys in hexadecimal format
const symmetricKeyHex = bytesToHex(symmetricKey);
const privateKeyHex = bytesToHex(privateKey);

// Restore the keys from hexadecimal format
const restoredSymmetricKey = hexToBytes(symmetricKeyHex);
const restoredPrivateKey = hexToBytes(privateKeyHex);

