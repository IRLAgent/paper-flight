# Mobile Game Development - Project Plan

## Project Overview
**Status:** Planning Phase  
**Last Updated:** November 12, 2025

## Game Concept: "Paper Flight" (Working Title)
**Genre:** Endless runner / Obstacle avoider  
**Style:** 2D side-scrolling, casual arcade  
**Theme:** Office paper airplane adventure

### Core Gameplay

**Player Character:** Paper airplane (side view)
- Tap screen = flap up
- Release = glide down with realistic paper physics
- Slight forward tilt when descending, back tilt when ascending

**Objective:** Fly as far as possible through the office without crashing

**Scoring:**
- Distance traveled (meters)
- Paperclips collected (10 points each)
- Near-miss bonus (flying close to obstacles without hitting)

### Environmental Mechanics

**Air Currents (Key Differentiator):**
- **AC Vents:** Strong upward drafts (visual: blue particles)
  - Automatically lift you up when inside
  - Must actively tap to descend through them
- **Ceiling Fans:** Turbulent zones (visual: rotating blades + wobble effect)
  - Causes erratic movement
  - Player must stabilize with careful tapping
- **Window Drafts:** Horizontal gusts (visual: leaves/papers blowing)
  - Push airplane forward faster (speed boost + danger)

**Office Environments (Procedurally Generated):**
- Cubicle maze (narrow passages)
- Conference rooms (wide open, but ceiling fans)
- Supply closets (tight spaces, shelves)
- Break room (random obstacles)
- Executive offices (fancy but challenging)

### Obstacles

**Static:**
- Desks and chairs
- Filing cabinets
- Potted plants
- Coffee mugs on desks
- Monitor screens
- Whiteboards

**Moving:**
- Office workers walking (slow horizontal movement)
- Rolling chairs sliding across
- Swinging desk lamps
- Opening/closing cabinet drawers
- Staplers that "snap" shut

**Hazards:**
- Ceiling fans (spinning blades)
- Shredders (instant death zone)
- Open windows (you fly out = game over)
- Coffee spills on floor (visual gag if you fly too low)

### Collectibles & Power-ups

**Collectibles:**
- **Paperclips** (common): Basic points
- **Gold stars** (rare): 100 points, sticker from teacher vibe
- **Rubber bands** (rare): Currency for unlocks

**Power-ups (Temporary, ~5 seconds):**
- **Shield (sticky note):** Wraps around plane, one-hit protection
- **Magnet:** Attracts nearby paperclips
- **Slow-Mo:** Everything moves slower, easier to navigate
- **Super Glide:** Less affected by gravity, longer flight

### Unlockable Paper Airplanes

Each with unique physics and visual style:

1. **Classic Dart** (default)
   - Balanced speed and control
   - Standard physics

2. **The Glider**
   - Slower fall rate
   - Longer glide time
   - Best for beginners

3. **Speed Demon**
   - Faster scroll speed
   - Falls quicker
   - Higher score multiplier

4. **Wide Wing**
   - More affected by air currents
   - Floatier controls
   - Good for navigating vents

5. **Origami Crane** (premium)
   - Beautiful design
   - Best overall stats
   - Unlocked at 10,000 points

6. **Napkin** (comedy option)
   - Crumpled, erratic flight
   - Hard mode
   - 2x score multiplier

### Visual Design

**Art Style:** Flat design / minimalist with personality
- Clean lines, simple shapes
- Bright, friendly color palette
- Office items slightly cartoonish
- Subtle parallax scrolling (background layers)

**Backgrounds:**
- Layered office elements
- Windows showing city skyline
- Motivational posters on walls
- Clocks showing time passing
- Plants, artwork, office decor

**Animations:**
- Paper airplane subtle flutter/wobble
- Office workers doing idle animations
- Fans rotating smoothly
- Particle effects for air currents
- Screen shake on near misses

### Audio Design

**Music:**
- Upbeat, light corporate muzak (ironic)
- Tempo increases slightly as you get further
- Loops seamlessly

**Sound Effects:**
- *Fwoosh* - flapping/ascending
- *Whoosh* - near miss
- *Ding* - collecting paperclip
- *Crinkle/crumple* - hitting obstacle (game over)
- *Hum* - fans and air currents (ambient)
- *Chatter* - quiet office background noise
- *Ka-chunk* - stapler snap

### Progression & Retention

**Session Goals:**
- Beat personal high score
- Daily challenge (specific airplane + obstacle pattern)
- Collect X paperclips in one run
- Achieve X near misses

**Meta Progression:**
- Unlock new paper airplane designs
- Achievement system
- Leaderboards (friends + global)
- Statistics tracking (total distance, games played, etc.)

**Monetization Ideas (Optional):**
- Ad-supported free version
- One-time unlock for premium planes
- Cosmetic skins (themed paper: graph paper, newspaper, blueprint)
- Remove ads purchase

### Technical Considerations

**Physics:**
- Simple 2D physics with gravity constant
- Flap = upward impulse
- Air currents = force zones
- Collision detection on airplane hitbox (forgiving, centered)

**Procedural Generation:**
- Obstacle spawning based on difficulty curve
- Gap sizes ensure game is always fair (not impossible)
- Pattern library (handcrafted segments stitched together)
- Environmental theme changes every 500m

**Performance:**
- 60 FPS target
- Object pooling for obstacles
- Destroy off-screen objects
- Minimal particle effects on lower-end devices

### Variant Ideas

#### Idea 1: Deep Sea Diver
- **Setting:** Underwater cave exploration
- **Player:** Scuba diver with buoyancy control
- **Unique Twist:** 
  - Tap to dive deeper (fight buoyancy)
  - Release to float upward naturally
  - **Inverted controls** from traditional helicopter game
  - Oxygen meter adds time pressure
  - Collect treasure/artifacts for points
- **Obstacles:** Rock formations, jellyfish, mines, currents
- **Visual Appeal:** Bioluminescent creatures, coral reefs, shipwrecks

#### Idea 2: Rocket Escape (Space Theme)
- **Setting:** Escaping through asteroid field/space tunnel
- **Player:** Small rocket/spaceship
- **Unique Twist:**
  - Fuel management - tapping uses fuel
  - Collect fuel pickups to keep going
  - Zero gravity means momentum carries (floaty physics)
  - Speed increases as you "escape" deeper into space
- **Obstacles:** Asteroids, space debris, laser grids, alien ships
- **Visual Appeal:** Cosmic backgrounds, nebulas, planets in distance

#### Idea 3: Paper Airplane (Office Theme)
- **Setting:** Flying through an office building
- **Player:** Paper airplane
- **Unique Twist:**
  - Air currents from vents push you up/down
  - Fans create turbulence zones
  - Different paper airplane types (unlockables with different physics)
  - Collect paperclips for points
  - Realistic paper physics (glide, flutter)
- **Obstacles:** Office workers, ceiling fans, staplers, coffee mugs, filing cabinets
- **Visual Appeal:** Humorous office setting, relatable theme, could add boss/coworker characters

### Recommended: Paper Airplane
**Why:** Most unique, relatable theme, room for humor and personality, easier to make visually appealing with simple art style

---

## Technology Stack Options

### Option 1: Unity + C# (Recommended)
**Deployment:** WebGL (browser) + iOS/Android apps

**Rationale:**
- Leverages existing C# knowledge
- Industry-standard with extensive documentation
- Deploy to web first for testing, apps later
- Large asset store and community support

**Setup Required:**
- Unity Hub + Unity Editor
- Visual Studio or VS Code
- WebGL build support module
- iOS/Android build modules (when ready)

### Option 2: Phaser.js (Web-First)
**Deployment:** Web browser + Capacitor for mobile apps

**Rationale:**
- Simplest deployment (just upload to web host)
- Good for 2D casual games
- Can wrap as native app later

**Setup Required:**
- Node.js
- Phaser 3 framework
- Basic web hosting
- Capacitor (for app conversion)

### Option 3: .NET MAUI
**Deployment:** Native iOS/Android apps only

**Rationale:**
- Full .NET experience
- Native performance
- No web option (apps only)

**Setup Required:**
- Visual Studio 2022
- .NET 8+ SDK
- iOS/Android workloads

---

## Development Phases

### Phase 1: Planning & Prototype (Current)
- [x] Define game concept and mechanics
- [ ] Choose technology stack (Unity vs Phaser)
- [ ] Set up development environment
- [ ] Create basic prototype
  - [ ] Paper airplane sprite + physics
  - [ ] Tap to rise mechanic
  - [ ] Basic obstacles (static boxes)
  - [ ] Collision detection
  - [ ] Score counter (distance)
- [ ] Test core gameplay loop (is it fun?)

### Phase 2: Core Development
- [ ] **Air current system**
  - [ ] AC vents (upward force)
  - [ ] Ceiling fans (turbulence)
  - [ ] Visual indicators (particles)
- [ ] **Obstacle variety**
  - [ ] Static obstacles (desks, plants, etc.)
  - [ ] Moving obstacles (workers, chairs)
  - [ ] Hazards (fans, shredders)
- [ ] **Procedural generation**
  - [ ] Obstacle spawning system
  - [ ] Difficulty curve
  - [ ] Environment themes
- [ ] **Collectibles**
  - [ ] Paperclips
  - [ ] Power-ups (shield, magnet, slow-mo)
- [ ] **Art assets**
  - [ ] Paper airplane designs (at least 3)
  - [ ] Office environment sprites
  - [ ] Background layers (parallax)
  - [ ] UI elements
- [ ] **Audio**
  - [ ] Background music
  - [ ] Sound effects library
- [ ] **Game states**
  - [ ] Main menu
  - [ ] Playing state
  - [ ] Game over screen
  - [ ] Pause menu

### Phase 3: Polish & Testing
- [ ] **Unlockable airplanes**
  - [ ] Implement airplane selection
  - [ ] Different physics per type
  - [ ] Unlock progression system
- [ ] **Juice & feel**
  - [ ] Screen shake on near misses
  - [ ] Particle effects polish
  - [ ] Animation polish
  - [ ] Satisfying audio feedback
- [ ] **Tutorial/onboarding**
  - [ ] First-time player experience
  - [ ] Visual cues for air currents
  - [ ] Progressive difficulty introduction
- [ ] **Save system**
  - [ ] High score persistence
  - [ ] Unlocks tracking
  - [ ] Settings (sound volume, etc.)
- [ ] **Performance optimization**
  - [ ] Object pooling
  - [ ] Frame rate targets (60 FPS)
  - [ ] Memory management
- [ ] **Testing**
  - [ ] Balance testing (difficulty curve)
  - [ ] Bug fixes
  - [ ] User testing (friends/family)
  - [ ] Multiple device testing

### Phase 4: Deployment
- [ ] Web deployment (if applicable)
- [ ] App Store preparation (if applicable)
  - [ ] Developer account setup
  - [ ] App icons and screenshots
  - [ ] Store listing content
  - [ ] Submit for review
- [ ] Launch and marketing

---

## Ideas & Features Backlog

### Core Mechanics (Common to all variants)
- Tap/hold to rise
- Release to fall (gravity)
- Auto-scrolling screen
- Obstacle avoidance
- Score tracking (distance or collectibles)
- Progressive difficulty

### Feature Ideas for Future Development
- **Power-ups:** Shield, slow-motion, magnet for collectibles
- **Unlockables:** Different vehicles/characters with unique abilities
- **Daily challenges:** Special obstacle courses
- **Leaderboards:** Global/friend high scores
- **Sound effects:** Satisfying feedback for actions
- **Achievements:** Milestones and challenges
- **Endless mode** vs **Level-based progression**

### Art & Audio Requirements

**Art Assets Needed:**
- Paper airplane sprites (6+ variations)
- Office furniture and obstacles (20+ items)
- Office workers (2-3 variations, animated)
- Background layers (office walls, windows, skyline)
- UI elements (buttons, score display, menus)
- Particle effects (air currents, impact)
- Icons (power-ups, collectibles)

**Asset Sources:**
- Create in: Figma, Inkscape, or Aseprite
- Or source from: OpenGameArt, Kenney.nl, itch.io
- Or commission: Fiverr, Upwork (if budget allows)

**Audio Assets Needed:**
- Background music (1-2 looping tracks)
- 10-15 sound effects
- Ambient office sounds

**Audio Sources:**
- Freesound.org
- OpenGameArt
- Incompetech (music)
- Zapsplat
- Or create with: BFXR, ChipTone

---

## Resources & Learning

### Documentation
- Unity Docs: https://docs.unity3d.com/
- Phaser Docs: https://phaser.io/learn
- .NET MAUI Docs: https://learn.microsoft.com/dotnet/maui/

### Deployment Resources
- WebGL hosting: GitHub Pages, Netlify, itch.io
- App stores: Apple Developer, Google Play Console

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-11-12 | Project initiated | Starting mobile game development |
| 2025-11-12 | Game style: Helicopter/Copter variant | Simple, proven mechanic; mobile-friendly; quick to prototype |
| 2025-11-12 | Three variants proposed | Deep Sea Diver, Rocket Escape, Paper Airplane - awaiting selection |
| 2025-11-12 | Selected: Paper Flight (office paper airplane game) | Most unique theme, relatable, good scope for first game |
| 2025-11-12 | Technology: Phaser.js + Vite (web-first) | Simpler than Unity, everything in VS Code, instant browser testing |

---

## Next Steps

### Immediate Actions
1. ✅ Game concept defined (Paper Flight)
2. **Choose technology stack** (Unity C# vs Phaser.js)
   - Unity = More powerful, C# skills, better mobile export
   - Phaser = Simpler, web-first, faster prototype
3. Set up development environment
4. Create "Hello World" prototype
   - Airplane sprite on screen
   - Tap to make it move up
   - Gravity pulls it down
5. Add one obstacle and collision detection
6. If fun, continue; if not, iterate on feel

### This Week
- Make technology decision
- Install tools
- Create first playable prototype
- Test core mechanic (is tapping fun?)

### This Month  
- Complete Phase 1 (prototype)
- Get basic obstacle course working
- Add air current mechanic
- Test with 2-3 people for feedback
