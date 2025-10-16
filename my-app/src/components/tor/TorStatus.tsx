/**
 * Tor Status Component for SafeCast
 * 
 * Displays Tor connection status and provides controls for Tor functionality
 */

import React from 'react';
import { useTorStatus } from './useTor';

export default function TorStatus() {
  const {
    isConnected,
    isInitializing,
    error,
    statusColor,
    statusText,
    socksConfig,
    activeOnionServices,
    availableRPCs,
    initialize,
    createOnionService,
    shutdown,
  } = useTorStatus();

  const handleCreateOnionService = async () => {
    const service = await createOnionService(3000);
    if (service) {
      console.log('Onion service created:', service);
    }
  };

  return (
    <div className="bg-[#FFF8E7] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-[#8B7355]">Tor Network Status</h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full bg-${statusColor}-500`}></div>
          <span className="text-sm font-semibold text-black">{statusText}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 p-3 rounded-lg mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
          <div className="text-sm font-bold text-[#8B7355] mb-1">SOCKS5 Proxy</div>
          <div className="text-xs text-black font-mono">{socksConfig || 'Not connected'}</div>
        </div>
        <div className="bg-white border-2 border-[#8B7355] p-4 rounded-lg">
          <div className="text-sm font-bold text-[#8B7355] mb-1">Active Onion Services</div>
          <div className="text-lg font-bold text-black">{activeOnionServices.length}</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#8B7355] mb-2">Available Private RPCs</h3>
        <div className="space-y-2">
          {availableRPCs.map((rpc) => (
            <div key={rpc} className="bg-white border-2 border-[#8B7355] p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black">{rpc}</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#8B7355] mb-2">Active Onion Services</h3>
        {activeOnionServices.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No active onion services
          </div>
        ) : (
          <div className="space-y-2">
            {activeOnionServices.map((service) => (
              <div key={service.serviceId} className="bg-white border-2 border-[#8B7355] p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-black">{service.serviceId}.onion</div>
                    <div className="text-xs text-gray-600">Port: {service.port}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!isConnected && !isInitializing && (
          <button
            onClick={initialize}
            className="bg-[#8B7355] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#8B7355]/90 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
          >
            Connect to Tor
          </button>
        )}

        {isConnected && (
          <>
            <button
              onClick={handleCreateOnionService}
              className="bg-[#D4A574] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#D4A574]/90 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
            >
              Create Onion Service
            </button>
            <button
              onClick={shutdown}
              className="bg-red-500 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg text-sm font-bold text-white hover:bg-red-600 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
            >
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
}
