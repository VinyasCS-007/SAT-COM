// frontend/src/components/Hero.tsx
import React from 'react';
import { Satellite, Shield, Cpu, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        {/* Animated Satellite Icon */}
        <div className="mb-8 animate-float">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25">
            <Satellite className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            SatCom AI
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-apple-light-gray mb-8 max-w-3xl mx-auto leading-relaxed">
          AI-augmented error correction for{' '}
          <span className="text-white font-medium">space-grade reliability</span>
          <br />
          simulated on Earth with quantum-inspired resilience
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
            <Shield className="w-8 h-8 text-cyan-400 mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">Fault-Tolerant</h3>
            <p className="text-apple-light-gray text-sm">AI-driven error correction beyond traditional ECC limits</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <Cpu className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">Adaptive Intelligence</h3>
            <p className="text-apple-light-gray text-sm">Self-optimizing algorithms for dynamic space conditions</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <Zap className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-apple-light-gray text-sm">Live performance metrics and BER visualization</p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full blur-sm animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse-slow delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full blur-sm animate-pulse-slow delay-500"></div>
    </section>
  );
};