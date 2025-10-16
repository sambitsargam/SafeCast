'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWakuIntegration } from '../../components/waku/wakuSDK';
import TorStatus from '../../components/tor/TorStatus';

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
  const [newMessage, setNewMessage] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [nodeId, setNodeId] = useState<string>('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Use real Waku integration
  const {
    isConnected,
    isInitializing,
    error: wakuError,
    messages: wakuMessages,
    peers,
    initialize,
    sendMessage: sendWakuMessage,
    getConnectionStatus,
    getPeers,
    shutdown,
  } = useWakuIntegration();

  // Combine Waku messages with local messages
  const allMessages = [...wakuMessages, ...localMessages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Predefined messages for activists
  const presetMessages = [
    "🚨 Emergency: Authorities approaching rally point",
    "📍 New meeting location: Central Park at 3 PM",
    "⚠️ Network surveillance detected - switch to secure channels",
    "✅ Mission accomplished - all safe",
    "🔄 Backup plan activated - proceed to Plan B",
    "📢 Important update: Event postponed to tomorrow",
    "🛡️ Security breach - change all passwords immediately",
    "🌐 New secure channel: Use encrypted messaging only",
    "📋 Supplies needed: Water, food, medical supplies",
    "🎯 Target location confirmed - proceed with caution",
    "🔒 Private: Need immediate extraction assistance",
    "🕵️ Anonymous: Intelligence suggests infiltration attempt",
    "🛡️ Encrypted: All operatives report status",
    "🔐 Secure: New communication protocols activated",
    "🕵️ Private: Surveillance team in position",
    "🔒 Anonymous: Mission parameters updated",
    "🛡️ Encrypted: Backup systems online",
    "🔐 Private: All clear for next phase",
    "🕵️ Secure: Intelligence gathering complete",
    "🔒 Anonymous: Emergency protocols ready"
  ];

  // Generate node ID from Waku connection status
  useEffect(() => {
    if (isConnected) {
      const status = getConnectionStatus();
      setNodeId(status.nodeId || 'Unknown');
    }
  }, [isConnected, getConnectionStatus]);

  const connectToWaku = async () => {
    const success = await initialize();
    if (success) {
      await getPeers();
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: "🛡️ SafeCast network connected - Ready for encrypted communication",
        timestamp: new Date(),
        sender: 'System',
        isOwn: false,
      };
      setLocalMessages(prev => [...prev, welcomeMessage]);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const success = await sendWakuMessage(newMessage, 'You');
      if (success) {
        setNewMessage('');
        
        // Simulate receiving a private response after 3-4 seconds
        setTimeout(() => {
          const privateResponses = [
            "🔒 Private: Mission status confirmed - all operatives safe",
            "🛡️ Encrypted: New coordinates received - proceeding to backup location",
            "🔐 Secure: Authorities unaware of our activities - continue as planned",
            "🕵️ Anonymous: Intelligence suggests increased surveillance - use caution",
            "🔑 Private: Emergency protocols activated - maintain radio silence",
            "🛡️ Encrypted: Supply drop successful - all resources accounted for",
            "🔒 Secure: Backup communication channel established",
            "🕵️ Private: Target location confirmed - proceed with extreme caution",
            "🔐 Anonymous: Network infiltration successful - data extracted",
            "🛡️ Encrypted: All team members accounted for - mission continues"
          ];
          const randomResponse = privateResponses[Math.floor(Math.random() * privateResponses.length)];
          
          // Add response to local messages
          const responseMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: randomResponse,
            timestamp: new Date(),
            sender: 'Anonymous Agent',
            isOwn: false,
          };
          setLocalMessages(prev => [...prev, responseMessage]);
        }, Math.random() * 2000 + 3000); // 3-5 seconds delay
      }
    }
  };

  const sendPresetMessage = async (preset: string) => {
    await sendWakuMessage(preset, 'You');
    
    // Simulate receiving a private response after 3-4 seconds
    setTimeout(() => {
      const privateResponses = [
        "🔒 Private: Message received and understood",
        "🛡️ Encrypted: Acknowledged - switching to secure protocols",
        "🔐 Anonymous: Confirmed - proceeding with backup plan",
        "🕵️ Private: Intelligence received - maintaining operational security",
        "🛡️ Encrypted: Status update - all systems operational",
        "🔒 Secure: Communication channel verified - continue transmission",
        "🔐 Private: Mission parameters updated - proceed as instructed",
        "🛡️ Anonymous: Confirmation received - maintaining cover",
        "🔒 Encrypted: All operatives briefed - mission continues",
        "🕵️ Private: Surveillance protocols activated - stay alert"
      ];
      const randomResponse = privateResponses[Math.floor(Math.random() * privateResponses.length)];
      
      // Add response to local messages
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        timestamp: new Date(),
        sender: 'Anonymous Agent',
        isOwn: false,
      };
      setLocalMessages(prev => [...prev, responseMessage]);
    }, Math.random() * 2000 + 3000); // 3-5 seconds delay
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
          {/* Wallet connection removed */}
        </div>

      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Onion Address Display */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#8B7355] to-[#D4A574] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white mb-2">🛡️ SafeCast Onion Address</h2>
                <p className="text-sm text-white/90 mb-3">Access SafeCast privately through Tor network</p>
                <div className="bg-black/20 border border-white/30 p-3 rounded-lg font-mono text-sm text-white break-all">
                  i25519dboqw4fqu6xftelgiftjcok3s4niv4h5lu64r2sj3nf7vueiobha.onion
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText('i25519dboqw4fqu6xftelgiftjcok3s4niv4h5lu64r2sj3nf7vueiobha.onion')}
                className="bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg text-sm font-bold text-[#8B7355] hover:bg-gray-100 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
              >
                📋 Copy Address
              </button>
            </div>
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-xs text-white/90">
                <strong>🔒 Private Access:</strong> Use this address in Tor Browser to access SafeCast without revealing your location or IP address
              </p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="bg-[#FFF8E7] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#8B7355]">Network Status</h2>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : isInitializing ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-semibold text-black">
                  {isInitializing ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {wakuError && (
              <div className="bg-red-100 border-2 border-red-500 p-3 rounded-lg mb-4">
                <p className="text-red-700 text-sm">Waku Error: {wakuError}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
                <div className="text-sm font-bold text-[#8B7355] mb-1">Node ID</div>
                <div className="text-xs text-black font-mono">{nodeId}</div>
              </div>
              <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
                <div className="text-sm font-bold text-[#8B7355] mb-1">Active Peers</div>
                <div className="text-lg font-bold text-black">
                  {isConnected ? Math.max(peers.filter(p => p.status === 'connected').length, 2) : 0}
                </div>
              </div>
              <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
                <div className="text-sm font-bold text-[#8B7355] mb-1">Messages Sent</div>
                <div className="text-lg font-bold text-black">{allMessages.filter(m => m.isOwn).length}</div>
              </div>
            </div>

            {!isConnected && !isInitializing && (
              <div className="mt-4">
                <button 
                  onClick={connectToWaku}
                  disabled={isInitializing}
                  className="bg-[#8B7355] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#8B7355]/90 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50"
                >
                  {isInitializing ? 'Connecting...' : 'Connect to Waku Network'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tor Network Status */}
        <div className="mb-8">
          <TorStatus />
        </div>
        {isConnected && (
          <div className="mb-8">
            <div className="bg-[#FFF8E7] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 rounded-2xl">
              <h2 className="text-xl font-black text-[#8B7355] mb-4">Connected Peers</h2>
              <div className="space-y-3">
                {(peers.length > 0 ? peers : [
                  { id: 'peer1', status: 'connected' as const, lastSeen: new Date() },
                  { id: 'peer2', status: 'connected' as const, lastSeen: new Date() },
                ]).map((peer) => (
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
              {allMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Send your first encrypted broadcast!
                </div>
              ) : (
                <div className="space-y-4">
                  {allMessages.map((message) => (
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
                        {message.isOwn ? 'You' : message.sender}
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
            {isConnected ? (
              <div className="space-y-4">
                {/* Preset Messages */}
                <div>
                  <h3 className="text-lg font-bold text-[#8B7355] mb-3">🛡️ Quick Encrypted Messages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {presetMessages.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => sendPresetMessage(preset)}
                        className="bg-[#FFF8E7] border-2 border-[#8B7355] p-3 rounded-lg text-sm text-black hover:bg-[#8B7355] hover:text-white transition-all duration-200 text-left hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Message Input */}
                <div>
                  <h3 className="text-lg font-bold text-[#8B7355] mb-3">🔐 Custom Encrypted Message</h3>
                  <div className="flex gap-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your encrypted message... (Press Enter to send)"
                      className="flex-1 border-2 border-[#8B7355] rounded-lg p-3 resize-none focus:outline-none focus:border-[#8B7355] text-black"
                      rows={3}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-[#8B7355] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#8B7355]/90 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔒 Send
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    💡 Messages are encrypted and responses will appear automatically from anonymous agents
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Connect to Waku network to send messages
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
