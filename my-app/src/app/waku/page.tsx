'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: string;
  isOwn: boolean;
}

interface Peer {
  id: string;
  status: 'connected' | 'connecting' | 'disconnected';
  lastSeen: Date;
}

export default function WakuPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [peers, setPeers] = useState<Peer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [nodeId, setNodeId] = useState<string>('');

  // Generate a mock node ID
  useEffect(() => {
    setNodeId(`0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`);
  }, []);

  const connectWallet = async () => {
    // Mock wallet connection
    setIsWalletConnected(true);
    setWalletAddress(`0x${Math.random().toString(16).substr(2, 40)}`);
  };

  const connectToWaku = async () => {
    setIsConnected(true);
    // Mock peer connections
    setPeers([
      { id: 'peer1', status: 'connected', lastSeen: new Date() },
      { id: 'peer2', status: 'connected', lastSeen: new Date() },
      { id: 'peer3', status: 'connecting', lastSeen: new Date() },
    ]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        timestamp: new Date(),
        sender: walletAddress,
        isOwn: true,
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans">
      {/* NAVBAR */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="focus:outline-none">
          <div className="bg-[#8B7355] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg cursor-pointer">
            <h1 className="text-2xl font-black text-white">🛡️ SafeCast</h1>
          </div>
        </Link>
      </div>

      {/* WALLET CONNECTION */}
      <div className="absolute top-6 right-6 z-10">
        {isWalletConnected ? (
          <div className="flex items-center gap-3">
            <div className="bg-[#D4A574] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-4 py-2 rounded-lg">
              <div className="text-sm font-bold text-white">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            </div>
            <button 
              onClick={() => setIsWalletConnected(false)}
              className="bg-red-500 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={connectWallet}
            className="bg-[#D4A574] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#D4A574]/90 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
          >
            Connect Wallet
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Connection Status */}
        <div className="mb-8">
          <div className="bg-[#FFF8E7] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#8B7355]">Network Status</h2>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-semibold text-black">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
                <div className="text-sm font-bold text-[#8B7355] mb-1">Node ID</div>
                <div className="text-xs text-black font-mono">{nodeId}</div>
              </div>
              <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
                <div className="text-sm font-bold text-[#8B7355] mb-1">Active Peers</div>
                <div className="text-lg font-bold text-black">{peers.filter(p => p.status === 'connected').length}</div>
              </div>
              <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
                <div className="text-sm font-bold text-[#8B7355] mb-1">Messages Sent</div>
                <div className="text-lg font-bold text-black">{messages.filter(m => m.isOwn).length}</div>
              </div>
            </div>

            {!isConnected && (
              <div className="mt-4">
                <button 
                  onClick={connectToWaku}
                  className="bg-[#8B7355] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#8B7355]/90 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                >
                  Connect to Waku Network
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Peers List */}
        {isConnected && (
          <div className="mb-8">
            <div className="bg-[#FFF8E7] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 rounded-2xl">
              <h2 className="text-xl font-black text-[#8B7355] mb-4">Connected Peers</h2>
              <div className="space-y-3">
                {peers.map((peer) => (
                  <div key={peer.id} className="flex items-center justify-between bg-white border-2 border-[#8B7355] p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        peer.status === 'connected' ? 'bg-green-500' : 
                        peer.status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-semibold text-black">{peer.id}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {peer.status === 'connected' ? 'Active' : 
                       peer.status === 'connecting' ? 'Connecting...' : 'Disconnected'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="mb-8">
          <div className="bg-[#FFF8E7] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 rounded-2xl">
            <h2 className="text-xl font-black text-[#8B7355] mb-4">Messages</h2>
            
            {/* Messages List */}
            <div className="bg-white border-2 border-[#8B7355] rounded-lg p-4 mb-4 h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Send your first encrypted broadcast!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg ${
                        message.isOwn 
                          ? 'bg-[#8B7355] text-white ml-8' 
                          : 'bg-[#D4A574] text-white mr-8'
                      }`}
                    >
                      <div className="text-sm font-semibold mb-1">
                        {message.isOwn ? 'You' : 'Anonymous'}
                      </div>
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            {isWalletConnected && isConnected ? (
              <div className="flex gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your encrypted message..."
                  className="flex-1 border-2 border-[#8B7355] rounded-lg p-3 resize-none focus:outline-none focus:border-[#8B7355]"
                  rows={3}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#8B7355] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#8B7355]/90 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                {!isWalletConnected ? 'Connect your wallet to send messages' : 
                 !isConnected ? 'Connect to Waku network to send messages' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Features Info */}
        <div className="bg-[#FFF8E7] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 rounded-2xl">
          <h2 className="text-xl font-black text-[#8B7355] mb-4">Privacy Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
              <h3 className="font-bold text-[#8B7355] mb-2">🔒 End-to-End Encryption</h3>
              <p className="text-sm text-black">All messages are encrypted before transmission through the Waku network.</p>
            </div>
            <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
              <h3 className="font-bold text-[#8B7355] mb-2">🌐 P2P Network</h3>
              <p className="text-sm text-black">Messages relay through decentralized peer-to-peer nodes.</p>
            </div>
            <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
              <h3 className="font-bold text-[#8B7355] mb-2">🛡️ Censorship Resistant</h3>
              <p className="text-sm text-black">No central servers - messages cannot be blocked or censored.</p>
            </div>
            <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
              <h3 className="font-bold text-[#8B7355] mb-2">🔍 Anonymous</h3>
              <p className="text-sm text-black">Sender identity is protected through cryptographic anonymity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
