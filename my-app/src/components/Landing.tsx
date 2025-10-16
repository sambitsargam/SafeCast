'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'What is SafeCast?',
    a: 'SafeCast is a Web3-powered decentralized broadcast system that enables activists to share messages, updates, or warnings securely — resistant to censorship and metadata tracking.'
  },
  {
    q: 'How does SafeCast ensure privacy?',
    a: 'SafeCast uses Waku for encrypted peer-to-peer message relaying and Tor for private RPC submissions, ensuring no message traceability while maintaining secure communications.'
  },
  {
    q: 'Does SafeCast work in restricted networks?',
    a: 'Yes! SafeCast works offline-first and is censorship-resistant. Messages are stored on IPFS/Arweave with content hash anchors on Ethereum, ensuring resilience even when traditional web access is blocked.'
  },
  {
    q: 'Is SafeCast open source?',
    a: 'Yes! SafeCast is fully open source and available on GitHub for transparency, community contribution, and independent security audits.'
  },
];

export default function Landing() {
  // Only 2 circles on each side, with cream/brown colors
  const backgroundCircles = [
    // Left corners
    { className: 'fixed left-[-40px] top-[-40px] w-40 h-40', color: 'bg-[#8B7355]/70', blur: 'blur-sm', delay: 0 },
    { className: 'fixed left-[-32px] bottom-[-32px] w-32 h-32', color: 'bg-[#D4A574]/70', blur: 'blur', delay: 0.2 },
    // Right corners
    { className: 'fixed right-[-40px] top-[-40px] w-40 h-40', color: 'bg-[#8B7355]/70', blur: 'blur-sm', delay: 0.4 },
    { className: 'fixed right-[-32px] bottom-[-32px] w-32 h-32', color: 'bg-[#D4A574]/70', blur: 'blur', delay: 0.6 },
  ];

  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans tracking-tight relative overflow-x-hidden">
      {/* Animated cream/brown background circles */}
      {backgroundCircles.map((circle, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 10, repeat: Infinity, delay: circle.delay, ease: 'easeInOut' }}
          className={`${circle.className} ${circle.color} ${circle.blur} rounded-full border-2 border-[#D4A574]/30 pointer-events-none z-0`}
        />
      ))}

      {/* HEADER */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="focus:outline-none">
          <div className="bg-[#8B7355] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg cursor-pointer">
            <h1 className="text-2xl font-black text-white">🛡️ SafeCast</h1>
          </div>
        </Link>
      </div>

      {/* SOCIAL MEDIA LINKS */}
      <div className="absolute top-6 right-6 z-10 flex gap-3">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">
          <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">
          <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
      </div>
     

      {/* HERO */}
      <div className="relative pt-24 pb-8 px-4 mb-8">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-5xl bg-gradient-to-r from-[#D4A574] via-[#B8936F] to-[#8B7355] shadow-2xl flex items-center justify-center py-12 px-8 rounded-[3rem]" style={{ clipPath: 'polygon(5% 20%, 15% 5%, 35% 0%, 65% 0%, 85% 5%, 95% 20%, 100% 50%, 95% 80%, 85% 95%, 65% 100%, 35% 100%, 15% 95%, 5% 80%, 0% 50%)' }}>
            <div className="text-center">
              <p className="text-sm font-black mb-8 text-white bg-black px-3 py-2 rounded-lg inline-block">Decentralized, Private, and Resilient</p>
              <h3 className="text-5xl font-bold font-black text-white italic mb-2">
                CENSORSHIP-RESISTANT Broadcasting
              </h3>
              <h2 className="text-5xl font-black mb-2 text-[#8B7355] bg-[#FFF8E7] px-3 py-2 rounded-lg inline-block italic">for Activists & Communities</h2>
            </div>
          </div>
        </div>
      </div>


      <div className="text-center mb-6">
        <Link href="/waku">
          <button className="bg-[#8B7355] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-12 py-4 rounded-lg text-xl font-bold text-white hover:bg-[#8B7355]/90 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]">
            Get Started
          </button>
        </Link>
      </div>

      {/* MAIN CONTENT - BENTO GRID */}
      <div className="max-w-5xl mx-auto px-4 pb-20 mt-16">
        <div className="grid grid-cols-12 gap-6 auto-rows-[180px]">
          {/* Why SafeCast */}
          <div className="col-span-12 md:col-span-6 row-span-2 bg-[#FFF8E7] border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 rounded-2xl flex flex-col justify-center">
            <h2 className="text-xl font-black mb-4 text-white bg-[#8B7355] px-3 py-2 rounded-lg inline-block">Why SafeCast</h2>
            <p className="text-sm text-black leading-relaxed">SafeCast empowers activists and communities with a censorship-resistant broadcast system. Share critical messages securely via encrypted P2P networks, ensuring your communications remain private and accessible even in restricted environments.</p>
          </div>
          {/* Powered by Advanced Tech */}
          <div className="col-span-12 md:col-span-6 row-span-2 bg-[#8B7355] border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 rounded-2xl flex flex-col justify-center">
            <h2 className="text-xl font-black mb-4 text-white bg-black px-3 py-2 rounded-lg inline-block">Powered by Web3 Stack</h2>
            <p className="text-sm text-white mb-4 leading-relaxed">Built with cutting-edge decentralized technologies:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><span className="w-2 h-2 rounded-full mr-3 bg-[#FFF8E7]"></span><span className="text-white font-semibold">Waku for encrypted P2P messaging</span></li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full mr-3 bg-[#FFF8E7]"></span><span className="text-white font-semibold">Tor for private RPC submissions</span></li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full mr-3 bg-[#FFF8E7]"></span><span className="text-white font-semibold">IPFS/Arweave for resilient storage</span></li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full mr-3 bg-[#FFF8E7]"></span><span className="text-white font-semibold">Ethereum for message authenticity</span></li>
            </ul>
          </div>
          {/* How It Works */}
          <div className="col-span-12 md:col-span-8 row-span-2 bg-[#FFF8E7] border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 rounded-2xl flex flex-col justify-center">
            <h2 className="text-xl font-black mb-4 text-white bg-[#8B7355] px-3 py-2 rounded-lg inline-block">How It Works</h2>
            <p className="text-sm text-black mb-4 leading-relaxed">Broadcast securely in three simple steps:</p>
            <div className="space-y-3">
              <div className="flex items-start"><span className="text-lg font-extrabold text-[#8B7355] mr-3">1</span><div><div className="font-bold text-black mb-1 text-sm">Connect Wallet</div><div className="text-xs text-black">Link your EVM-compatible wallet securely—your identity stays private, always.</div></div></div>
              <div className="flex items-start"><span className="text-lg font-extrabold text-[#8B7355] mr-3">2</span><div><div className="font-bold text-black mb-1 text-sm">Create Your Message</div><div className="text-xs text-black">Compose your broadcast—SafeCast encrypts it end-to-end before transmission via Waku network.</div></div></div>
              <div className="flex items-start"><span className="text-lg font-extrabold text-[#8B7355] mr-3">3</span><div><div className="font-bold text-black mb-1 text-sm">Broadcast Globally</div><div className="text-xs text-black">Message distributed across P2P nodes with hash anchored on Ethereum—censorship-resistant and verifiable.</div></div></div>
            </div>
          </div>
          {/* Activist Resilience */}
          <div className="col-span-12 md:col-span-4 row-span-1 bg-[#FFF8E7] border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 rounded-2xl flex flex-col justify-center">
            <h3 className="text-lg font-black mb-2 text-white bg-[#8B7355] px-3 py-1 rounded-lg inline-block">Offline-First Design</h3>
            <p className="text-black text-sm mt-2">SafeCast works even when traditional web access is blocked—messages persist on decentralized storage, accessible from anywhere.</p>
          </div>
          {/* Privacy Infrastructure */}
          <div className="col-span-12 md:col-span-4 row-span-1 bg-[#FFF8E7] border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 rounded-2xl flex flex-col justify-center">
            <h4 className="text-lg font-bold text-white bg-[#D4A574] px-3 py-1 rounded-lg inline-block">Privacy Infrastructure</h4>
            <p className="text-black text-sm mt-2">Messages relayed via Waku with encrypted payloads—no metadata tracking, no message traceability, just secure communication.</p>
          </div>
        </div>

        {/* FAQ SECTION - moved up */}
        <section className="relative z-10 px-4 py-16 border-t border-[#8B7355]/20 mt-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-black font-black mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-2 border-[#8B7355] rounded-2xl overflow-hidden bg-[#FFF8E7]">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between text-black hover:bg-[#8B7355] hover:text-white transition-all duration-300 focus:outline-none"
                  >
                    <span className="font-medium text-lg">{faq.q}</span>
                    <span className="text-2xl">{expandedFaq === index ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-black/80 animate-fade-in bg-[#FFF8E7]">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

    
       
      </div>
    </div>
  );
}