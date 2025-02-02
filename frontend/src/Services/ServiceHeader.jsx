import React, { useState } from 'react';
import { ChevronRight, Sparkles, Scissors, Sun, Crown, Star } from 'lucide-react';

const ServiceHeader = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJILTEwem0tMzAgMGg2MHYySC00MHptMC00MGg2MHYySC00MHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2EpIiBkPSJNMCAwaDIwMHYyMDBIMHoiLz48L3N2Zz4=')] opacity-30" />
    <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-pink-300 mr-2" />
          <span className="text-pink-100 text-sm font-medium">Premium Beauty Experience</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Transform Your Beauty Journey
        </h1>
        <p className="text-lg md:text-xl text-pink-100 max-w-2xl mx-auto font-light">
          Discover our curated collection of luxury beauty treatments designed to enhance your natural radiance
        </p>
      </div>
    </div>
  </div>
);

export default ServiceHeader;