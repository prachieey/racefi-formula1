import React from 'react';

export default function ColorPaletteDemo() {
  return (
    <div className="bg-motorsport-jet text-motorsport-white min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 stroke-motorsport-red">
            🏁 Motorsport Color Palette
          </h1>
          <p className="text-xl text-motorsport-yellow">
            Ferrari & McLaren Inspired Racing Theme
          </p>
        </div>

        {/* Primary Colors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Primary Colors - Foundation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Jet Black */}
            <div className="space-y-3">
              <div className="bg-motorsport-jet border-2 border-motorsport-silver h-32 rounded-lg"></div>
              <h3 className="font-bold text-motorsport-yellow">Jet Black</h3>
              <p className="text-sm text-motorsport-white">#0f0f0f</p>
              <p className="text-xs text-motorsport-silver">Deep backgrounds</p>
            </div>

            {/* Charcoal */}
            <div className="space-y-3">
              <div className="bg-motorsport-charcoal border-2 border-motorsport-silver h-32 rounded-lg"></div>
              <h3 className="font-bold text-motorsport-yellow">Charcoal</h3>
              <p className="text-sm text-motorsport-white">#2a2a2a</p>
              <p className="text-xs text-motorsport-silver">Cards & containers</p>
            </div>

            {/* Charcoal Light */}
            <div className="space-y-3">
              <div className="bg-motorsport-charcoal-light border-2 border-motorsport-silver h-32 rounded-lg"></div>
              <h3 className="font-bold text-motorsport-yellow">Charcoal Light</h3>
              <p className="text-sm text-motorsport-white">#3d3d3d</p>
              <p className="text-xs text-motorsport-silver">Hover states</p>
            </div>

            {/* White */}
            <div className="space-y-3">
              <div className="bg-motorsport-white border-2 border-motorsport-charcoal h-32 rounded-lg"></div>
              <h3 className="font-bold text-motorsport-yellow">Pure White</h3>
              <p className="text-sm text-motorsport-white">#ffffff</p>
              <p className="text-xs text-motorsport-silver">Text & accents</p>
            </div>
          </div>
        </section>

        {/* Accent Colors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Accent Colors - Speed & Energy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Red */}
            <div className="space-y-3">
              <div className="bg-motorsport-red h-32 rounded-lg glow-motorsport-red"></div>
              <h3 className="font-bold text-motorsport-red">Fiery Red</h3>
              <p className="text-sm text-motorsport-white">#dc2626</p>
              <p className="text-xs text-motorsport-silver">Primary accent, CTAs</p>
            </div>

            {/* Yellow */}
            <div className="space-y-3">
              <div className="bg-motorsport-yellow h-32 rounded-lg glow-motorsport-yellow"></div>
              <h3 className="font-bold text-motorsport-yellow">Racing Yellow</h3>
              <p className="text-sm text-motorsport-white">#fbbf24</p>
              <p className="text-xs text-motorsport-silver">Secondary accent</p>
            </div>

            {/* Orange */}
            <div className="space-y-3">
              <div className="bg-motorsport-orange h-32 rounded-lg glow-motorsport-orange"></div>
              <h3 className="font-bold text-motorsport-orange">Burnt Orange</h3>
              <p className="text-sm text-motorsport-white">#ea580c</p>
              <p className="text-xs text-motorsport-silver">Tertiary accent</p>
            </div>
          </div>
        </section>

        {/* Bright Variants */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Bright Variants - Emphasis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="bg-motorsport-red-bright h-32 rounded-lg glow-motorsport-red-strong"></div>
              <h3 className="font-bold text-motorsport-red-bright">Red Bright</h3>
              <p className="text-sm text-motorsport-white">#ef4444</p>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-yellow-bright h-32 rounded-lg glow-motorsport-yellow"></div>
              <h3 className="font-bold text-motorsport-yellow-bright">Yellow Bright</h3>
              <p className="text-sm text-motorsport-white">#fcd34d</p>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-orange-bright h-32 rounded-lg glow-motorsport-orange"></div>
              <h3 className="font-bold text-motorsport-orange-bright">Orange Bright</h3>
              <p className="text-sm text-motorsport-white">#f97316</p>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Highlights - Premium Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="bg-motorsport-silver h-32 rounded-lg border-2 border-motorsport-charcoal"></div>
              <h3 className="font-bold text-motorsport-silver">Metallic Silver</h3>
              <p className="text-sm text-motorsport-white">#e5e7eb</p>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-silver-light h-32 rounded-lg border-2 border-motorsport-charcoal"></div>
              <h3 className="font-bold text-motorsport-silver">Silver Light</h3>
              <p className="text-sm text-motorsport-white">#f3f4f6</p>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-silver-dark h-32 rounded-lg border-2 border-motorsport-charcoal"></div>
              <h3 className="font-bold text-motorsport-silver">Silver Dark</h3>
              <p className="text-sm text-motorsport-white">#d1d5db</p>
            </div>
          </div>
        </section>

        {/* Gradients */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Gradient Overlays
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="gradient-race-red-to-orange h-32 rounded-lg"></div>
              <h3 className="font-bold text-motorsport-red">Red to Orange</h3>
            </div>

            <div className="space-y-3">
              <div className="gradient-race-yellow-to-orange h-32 rounded-lg"></div>
              <h3 className="font-bold text-motorsport-yellow">Yellow to Orange</h3>
            </div>

            <div className="space-y-3">
              <div className="gradient-race-dark h-32 rounded-lg border-2 border-motorsport-silver"></div>
              <h3 className="font-bold text-motorsport-silver">Dark Gradient</h3>
            </div>

            <div className="space-y-3">
              <div className="gradient-race-charcoal-to-black h-32 rounded-lg border-2 border-motorsport-silver"></div>
              <h3 className="font-bold text-motorsport-silver">Charcoal to Black</h3>
            </div>
          </div>
        </section>

        {/* Patterns */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Pattern Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="pit-lane-stripes h-32 rounded-lg"></div>
              <h3 className="font-bold text-motorsport-yellow">Pit Lane Stripes</h3>
            </div>

            <div className="space-y-3">
              <div className="pit-lane-stripes-h h-32 rounded-lg"></div>
              <h3 className="font-bold text-motorsport-yellow">Pit Lane Horizontal</h3>
            </div>

            <div className="space-y-3">
              <div className="checkered-flag h-32 rounded-lg"></div>
              <h3 className="font-bold text-motorsport-charcoal">Checkered Flag</h3>
            </div>

            <div className="space-y-3">
              <div className="asphalt-texture h-32 rounded-lg border-2 border-motorsport-silver"></div>
              <h3 className="font-bold text-motorsport-silver">Asphalt Texture</h3>
            </div>
          </div>
        </section>

        {/* Texture Effects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Texture Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="matte-charcoal h-32 rounded-lg border-2 border-motorsport-red"></div>
              <h3 className="font-bold text-motorsport-red">Matte Charcoal</h3>
              <p className="text-xs text-motorsport-silver">With glossy accents</p>
            </div>

            <div className="space-y-3">
              <div className="burnout-smoke h-32 rounded-lg border-2 border-motorsport-red"></div>
              <h3 className="font-bold text-motorsport-red">Burnout Smoke</h3>
              <p className="text-xs text-motorsport-silver">Tire smoke effect</p>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Animations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="bg-motorsport-red h-32 rounded-lg animate-pulse-race flex items-center justify-center">
                <span className="text-center">Pulse Race</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-yellow h-32 rounded-lg animate-drift flex items-center justify-center text-motorsport-charcoal font-bold">
                <span>Drift</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-orange h-32 rounded-lg animate-engine-rev flex items-center justify-center">
                <span>Engine Rev</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-red h-32 rounded-lg animate-tire-screech flex items-center justify-center">
                <span>Tire Screech</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-yellow h-32 rounded-lg animate-acceleration flex items-center justify-center text-motorsport-charcoal font-bold">
                <span>Acceleration</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-orange h-32 rounded-lg animate-pit-stop-flash flex items-center justify-center">
                <span>Pit Stop Flash</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Interactive States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="bg-motorsport-red hover-race-glow text-motorsport-white px-6 py-4 rounded-lg font-bold text-lg transition-all">
              Hover Glow
            </button>

            <button className="bg-motorsport-charcoal border-2 border-motorsport-yellow hover-race-lift text-motorsport-yellow px-6 py-4 rounded-lg font-bold text-lg transition-all">
              Hover Lift
            </button>

            <button className="bg-motorsport-orange hover-race-scale text-motorsport-white px-6 py-4 rounded-lg font-bold text-lg transition-all">
              Hover Scale
            </button>

            <button className="bg-motorsport-yellow hover-race-spin text-motorsport-charcoal px-6 py-4 rounded-lg font-bold text-lg transition-all">
              Hover Spin
            </button>
          </div>
        </section>

        {/* Speed Lines */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Speed Lines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="speed-lines-horizontal bg-motorsport-charcoal h-32 rounded-lg flex items-center justify-center">
                <span>Horizontal Motion</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="speed-lines-vertical bg-motorsport-charcoal h-32 rounded-lg flex items-center justify-center">
                <span>Vertical Motion</span>
              </div>
            </div>
          </div>
        </section>

        {/* Glow Effects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Glow Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="bg-motorsport-red glow-motorsport-red h-32 rounded-lg flex items-center justify-center">
                <span>Red Glow</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-red glow-motorsport-red-strong h-32 rounded-lg flex items-center justify-center">
                <span>Red Glow Strong</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-yellow glow-motorsport-yellow h-32 rounded-lg flex items-center justify-center text-motorsport-charcoal font-bold">
                <span>Yellow Glow</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-motorsport-orange glow-motorsport-orange h-32 rounded-lg flex items-center justify-center">
                <span>Orange Glow</span>
              </div>
            </div>
          </div>
        </section>

        {/* Text Effects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Text Effects
          </h2>
          <div className="space-y-6">
            <h3 className="text-4xl font-bold stroke-motorsport-red">
              Red Neon Stroke
            </h3>
            <h3 className="text-4xl font-bold stroke-motorsport-yellow">
              Yellow Neon Stroke
            </h3>
          </div>
        </section>

        {/* Component Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-motorsport-yellow">
            Component Examples
          </h2>

          {/* Card */}
          <div className="mb-8 bg-motorsport-charcoal matte-charcoal border-l-4 border-motorsport-red p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-motorsport-yellow mb-2">
              Premium Card
            </h3>
            <p className="text-motorsport-white mb-4">
              This card demonstrates the matte charcoal background with glossy accents and red border accent.
            </p>
            <button className="bg-motorsport-red hover-race-glow text-motorsport-white px-4 py-2 rounded font-bold">
              Action
            </button>
          </div>

          {/* Badge */}
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <span className="bg-motorsport-red text-motorsport-white px-3 py-1 rounded glow-motorsport-red font-bold">
                Live
              </span>
              <span className="bg-motorsport-yellow text-motorsport-charcoal px-3 py-1 rounded glow-motorsport-yellow font-bold">
                Featured
              </span>
              <span className="bg-motorsport-orange text-motorsport-white px-3 py-1 rounded glow-motorsport-orange font-bold">
                Hot
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center py-8 border-t border-motorsport-charcoal">
          <p className="text-motorsport-silver mb-2">
            🏁 Motorsport Color Palette System
          </p>
          <p className="text-sm text-motorsport-charcoal-light">
            Inspired by Ferrari and McLaren racing themes
          </p>
        </section>
      </div>
    </div>
  );
}
