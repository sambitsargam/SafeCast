/**
 * Real Waku SDK Integration for SafeCast
 * 
 * This module provides actual Waku SDK integration for real P2P communication
 * between browsers running SafeCast.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createLightNode, LightNode } from '@waku/sdk';
import { createEncoder, createDecoder } from '@waku/message-encryption/symmetric';
import { generateSymmetricKey } from '@waku/message-encryption';
import { bytesToHex, hexToBytes } from '@waku/utils/bytes';

export interface WakuMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: string;
  isOwn: boolean;
}

export interface WakuConfig {
  contentTopic: string;
  symKey: Uint8Array;
}

export class SafeCastWaku {
  private node: LightNode | null = null;
  private encoder: any = null;
  private decoder: any = null;
  private isConnected: boolean = false;
  private messageCallback: ((message: WakuMessage) => void) | null = null;
  private config: WakuConfig;

  constructor() {
    // Generate a shared symmetric key for demo purposes
    // In production, this would be shared through a secure channel
    const symKey = generateSymmetricKey();
    this.config = {
      contentTopic: '/safecast/1/message/proto',
      symKey: symKey,
    };
  }

  /**
   * Initialize Waku node and set up encryption
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🚀 Initializing Waku node...');
      
      // Create light node
      this.node = await createLightNode({
        defaultBootstrap: true,
      });

      // Start the node
      await this.node.start();
      console.log('✅ Waku node started');

      // Create encoder and decoder
      this.encoder = createEncoder({
        contentTopic: this.config.contentTopic,
        symKey: this.config.symKey,
      });

      this.decoder = createDecoder(this.config.contentTopic, this.config.symKey);

      // Set up message subscription
      await this.setupMessageSubscription();

      this.isConnected = true;
      console.log('✅ Waku integration ready');
      return true;
    } catch (error) {
      console.error('Failed to initialize Waku:', error);
      return false;
    }
  }

  /**
   * Set up message subscription to receive messages
   */
  private async setupMessageSubscription(): Promise<void> {
    if (!this.node || !this.decoder) return;

    try {
      // Subscribe to messages
      await this.node.filter.subscribe([this.decoder], (wakuMessage) => {
        this.handleReceivedMessage(wakuMessage);
      });
      
      console.log('✅ Message subscription active');
    } catch (error) {
      console.error('Failed to set up message subscription:', error);
    }
  }

  /**
   * Handle received Waku messages
   */
  private handleReceivedMessage(wakuMessage: any): void {
    try {
      if (!wakuMessage.payload) return;

      // Decode the message
      const messageData = JSON.parse(new TextDecoder().decode(wakuMessage.payload));
      
      const message: WakuMessage = {
        id: messageData.id || Date.now().toString(),
        content: messageData.content,
        timestamp: new Date(messageData.timestamp),
        sender: messageData.sender || 'Anonymous',
        isOwn: false,
      };

      console.log('📨 Received Waku message:', message);
      
      // Call the callback if set
      if (this.messageCallback) {
        this.messageCallback(message);
      }
    } catch (error) {
      console.error('Failed to handle received message:', error);
    }
  }

  /**
   * Send a message through Waku network
   */
  async sendMessage(content: string, sender: string = 'You'): Promise<boolean> {
    if (!this.node || !this.encoder || !this.isConnected) {
      console.error('Waku not initialized or connected');
      return false;
    }

    try {
      // Create message payload
      const messageData = {
        id: Date.now().toString(),
        content: content,
        timestamp: new Date().toISOString(),
        sender: sender,
      };

      // Encode the message
      const payload = new TextEncoder().encode(JSON.stringify(messageData));

      // Send through light push
      await this.node.lightPush.send(this.encoder, { payload });
      
      console.log('📤 Message sent through Waku:', messageData);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  /**
   * Set callback for received messages
   */
  setMessageCallback(callback: (message: WakuMessage) => void): void {
    this.messageCallback = callback;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; nodeId?: string } {
    return {
      connected: this.isConnected,
      nodeId: this.node ? bytesToHex(this.node.libp2p.peerId.toBytes()).slice(0, 16) + '...' : undefined,
    };
  }

  /**
   * Get peer information
   */
  async getPeers(): Promise<Array<{ id: string; status: string }>> {
    if (!this.node || !this.isConnected) return [];

    try {
      const peers = this.node.libp2p.getPeers();
      return Array.from(peers).map(peerId => ({
        id: peerId.toString().slice(0, 8) + '...',
        status: 'connected',
      }));
    } catch (error) {
      console.error('Failed to get peers:', error);
      return [];
    }
  }

  /**
   * Shutdown Waku node
   */
  async shutdown(): Promise<void> {
    if (this.node) {
      await this.node.stop();
      this.node = null;
    }
    this.isConnected = false;
    this.messageCallback = null;
    console.log('🔌 Waku node shutdown');
  }

  /**
   * Get symmetric key for sharing (demo purposes)
   */
  getSymmetricKey(): string {
    return bytesToHex(this.config.symKey);
  }

  /**
   * Set symmetric key from hex string
   */
  setSymmetricKey(hexKey: string): void {
    this.config.symKey = hexToBytes(hexKey);
    
    // Recreate encoder and decoder with new key
    if (this.config.contentTopic) {
      this.encoder = createEncoder({
        contentTopic: this.config.contentTopic,
        symKey: this.config.symKey,
      });
      this.decoder = createDecoder(this.config.contentTopic, this.config.symKey);
    }
  }
}

/**
 * React hook for Waku integration
 */
export function useWakuIntegration() {
  const [waku] = useState(() => new SafeCastWaku());
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<WakuMessage[]>([]);
  const [peers, setPeers] = useState<Array<{ id: string; status: string }>>([]);

  // Initialize Waku
  const initialize = useCallback(async (): Promise<boolean> => {
    setIsInitializing(true);
    setError(null);

    try {
      const success = await waku.initialize();
      setIsConnected(success);
      
      if (success) {
        // Set up message callback
        waku.setMessageCallback((message) => {
          setMessages(prev => [...prev, message]);
        });

        // Get initial peers
        const peerList = await waku.getPeers();
        setPeers(peerList);
      } else {
        setError('Failed to initialize Waku');
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsConnected(false);
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, [waku]);

  // Send message
  const sendMessage = useCallback(async (content: string, sender: string = 'You'): Promise<boolean> => {
    try {
      const success = await waku.sendMessage(content, sender);
      
      if (success) {
        // Add message to local state
        const message: WakuMessage = {
          id: Date.now().toString(),
          content: content,
          timestamp: new Date(),
          sender: sender,
          isOwn: true,
        };
        setMessages(prev => [...prev, message]);
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      return false;
    }
  }, [waku]);

  // Get connection status
  const getConnectionStatus = useCallback(() => {
    return waku.getConnectionStatus();
  }, [waku]);

  // Get peers
  const getPeers = useCallback(async () => {
    try {
      const peerList = await waku.getPeers();
      setPeers(peerList);
      return peerList;
    } catch (err) {
      console.error('Failed to get peers:', err);
      return [];
    }
  }, [waku]);

  // Shutdown
  const shutdown = useCallback(async () => {
    await waku.shutdown();
    setIsConnected(false);
    setMessages([]);
    setPeers([]);
    setError(null);
  }, [waku]);

  return {
    isConnected,
    isInitializing,
    error,
    messages,
    peers,
    initialize,
    sendMessage,
    getConnectionStatus,
    getPeers,
    shutdown,
  };
}
