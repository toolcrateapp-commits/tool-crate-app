const { useState, useEffect, useRef, useCallback, useMemo, memo } = React;

/* ============================================================
   TOOLCRATE — v11 "HANDS ON"
   Builds on v10 "SHOWROOM". Changes in this pass:

   · SWIPE-TO-OPEN — after picking a crate off the rack, the
     ceremony no longer auto-plays. The user swipes UP on the
     crate: latches pop under their thumb, the lid cracks with
     the drag, and only a full swipe breaks it open. Release
     early and it springs shut. The gesture is identical for
     every rarity — nothing is readable early. (Locked rule.)
   · RACK — serial text below the crate removed. The rack is
     just crates and light.
   · SILVER — Starter's brushed silver brightened and given a
     periodic glint sweep while centered on the home carousel.
   · HOME — spotlight cone over the selection zone.
   · NAV — bottom bar: CRATES / GARAGE / PROFILE. Garage is
     its own page now. Profile shows pull stats, wallet and
     sound. Nav hides during pick / ceremony / reveal.
   ============================================================ */

const STARTER_ITEMS = [{n:'Milwaukee Drilling Hammer',v:20.39,o:3.6446,b:'COMMON'},{n:'Milwaukee Pry Bar',v:20.97,o:3.5938,b:'COMMON'},{n:'VEVOR Bolt Extractor Kit',v:20.90,o:3.5999,b:'COMMON'},{n:'VEVOR Hex Key Set',v:21.90,o:3.5167,b:'COMMON'},{n:'VEVOR Folding Knife',v:19.90,o:3.6892,b:'COMMON'},{n:'VEVOR Tool Bag 33-Pocket',v:21.90,o:3.5167,b:'COMMON'},{n:'VEVOR Stud Finder',v:22.90,o:3.4391,b:'COMMON'},{n:'VEVOR Click Torque Wrench Set',v:24.90,o:1.9423,b:'UNCOMMON'},{n:'Milwaukee Magnetic Tape Measure',v:24.97,o:1.9423,b:'UNCOMMON'},{n:'Milwaukee Screwdriver Set',v:24.97,o:1.9396,b:'UNCOMMON'},{n:'Wiha Precision Screwdriver Set',v:24.98,o:1.9392,b:'UNCOMMON'},{n:'VEVOR Drywall Knife Set',v:25.90,o:1.9045,b:'UNCOMMON'},{n:'VEVOR Crimping Tool Kit',v:25.90,o:1.9045,b:'UNCOMMON'},{n:'VEVOR Fishing Magnet',v:25.90,o:1.9045,b:'UNCOMMON'},{n:'Milwaukee Voltage Detector',v:27.97,o:1.8327,b:'UNCOMMON'},{n:'VEVOR Tool Belt',v:28.90,o:1.8029,b:'UNCOMMON'},{n:'VEVOR Drill Bit Set 101pc',v:28.90,o:1.8029,b:'UNCOMMON'},{n:'Milwaukee Wire Stripper',v:30.97,o:1.7416,b:'UNCOMMON'},{n:'VEVOR Torpedo Level Set',v:32.90,o:1.6898,b:'UNCOMMON'},{n:'SKIL Cordless Screwdriver',v:32.99,o:1.6875,b:'UNCOMMON'},{n:'VEVOR Oscillating Multi-Tool',v:35.90,o:1.6176,b:'UNCOMMON'},{n:'VEVOR Laser Tape Measure',v:40.90,o:1.5155,b:'UNCOMMON'},{n:'VEVOR Angle Grinder',v:44.90,o:1.4464,b:'UNCOMMON'},{n:'VEVOR Rotary Tool Kit 136pc',v:48.90,o:1.3860,b:'UNCOMMON'},{n:'VEVOR Impact Socket Set 26pc',v:53.90,o:3.1397,b:'RARE'},{n:'VEVOR Combination Wrench Set',v:50.90,o:3.2309,b:'RARE'},{n:'VEVOR LED Work Light Tripod',v:51.90,o:3.1997,b:'RARE'},{n:'Milwaukee Lineman\'s Pliers',v:51.97,o:3.1975,b:'RARE'},{n:'VEVOR Arm Jack 2pc',v:52.90,o:3.1693,b:'RARE'},{n:'Milwaukee Dead Blow Hammer',v:52.97,o:3.1672,b:'RARE'},{n:'VEVOR Triple Lens Endoscope',v:52.99,o:3.1666,b:'RARE'},{n:'VEVOR Rolling Magnetic Sweeper',v:53.90,o:3.1397,b:'RARE'},{n:'VEVOR Digital Torque Screwdriver',v:54.90,o:3.1110,b:'RARE'},{n:'VEVOR Corded Recip Saw',v:59.90,o:2.9783,b:'RARE'},{n:'VEVOR LED Work Light 13.2Ah',v:60.90,o:1.5098,b:'EPIC'},{n:'VEVOR Torpedo Level 4pc',v:60.90,o:1.5098,b:'EPIC'},{n:'VEVOR Cordless Ratchet Wrench',v:62.90,o:1.4856,b:'EPIC'},{n:'VEVOR Mechanics Tool Set 145pc',v:62.90,o:1.4856,b:'EPIC'},{n:'VEVOR Tool Backpack 65-Pocket',v:71.90,o:1.3895,b:'EPIC'},{n:'Bosch Random Orbital Sander',v:79.00,o:1.3256,b:'EPIC'},{n:'VEVOR Laser Level 100ft',v:82.90,o:1.2941,b:'EPIC'},{n:'VEVOR Mechanics Set 230pc',v:101.00,o:1.2959,b:'LEGENDARY'},{n:'DeWalt Angle Grinder',v:117.19,o:1.2041,b:'LEGENDARY'},{n:'DeWalt 20V 5.0Ah 2-Pack + Free Recip Saw',v:398.00,o:0.5000,b:'MYTHIC'},{n:'DeWalt 20V 5.0Ah 2-Pack + Free Circular Saw',v:398.00,o:0.5000,b:'MYTHIC'}];


const BUILDER_ITEMS = [{n:'VEVOR Laser Tape Measure 135ft',v:40.90,o:3.7134,b:'COMMON'},{n:'VEVOR Folding Mechanic Creeper',v:41.90,o:3.6688,b:'COMMON'},{n:'VEVOR Hydraulic Bottle Jack 20T',v:42.90,o:3.6258,b:'COMMON'},{n:'VEVOR Wire Stripper Machine',v:43.90,o:3.5842,b:'COMMON'},{n:'VEVOR Angle Grinder 5in',v:44.90,o:3.5441,b:'COMMON'},{n:'VEVOR Drill Bit Set 246pc',v:46.90,o:3.4677,b:'COMMON'},{n:'VEVOR Rotary Tool Kit 136pc',v:48.90,o:3.3961,b:'COMMON'},{n:'VEVOR Extension Cord Reel 30FT',v:50.00,o:1.9194,b:'UNCOMMON'},{n:'VEVOR Combination Wrench Set',v:50.90,o:1.9023,b:'UNCOMMON'},{n:'VEVOR LED Work Light Tripod',v:51.90,o:1.8839,b:'UNCOMMON'},{n:'VEVOR Arm Jack 2pc',v:52.90,o:1.8660,b:'UNCOMMON'},{n:'VEVOR Triple Lens Endoscope',v:52.99,o:1.8644,b:'UNCOMMON'},{n:'VEVOR Rolling Magnetic Sweeper',v:53.90,o:1.8486,b:'UNCOMMON'},{n:'VEVOR Impact Socket Set 26pc',v:53.90,o:1.8486,b:'UNCOMMON'},{n:'VEVOR Digital Torque Screwdriver',v:54.90,o:1.8317,b:'UNCOMMON'},{n:'VEVOR Air Hose Reel 50FT',v:55.90,o:1.8153,b:'UNCOMMON'},{n:'VEVOR Pocket Hole Jig Kit 34pc',v:56.90,o:1.7992,b:'UNCOMMON'},{n:'VEVOR Corded Recip Saw',v:59.90,o:1.7536,b:'UNCOMMON'},{n:'VEVOR 12V Drain Auger 25FT',v:59.90,o:1.7536,b:'UNCOMMON'},{n:'VEVOR Torpedo Level Set 4pc',v:60.90,o:1.7391,b:'UNCOMMON'},{n:'VEVOR Rolling Tool Bag 25-Pocket',v:66.90,o:1.6593,b:'UNCOMMON'},{n:'VEVOR 12V Air Compressor Tank',v:71.90,o:1.6006,b:'UNCOMMON'},{n:'VEVOR Laser Level 100ft',v:82.90,o:1.4906,b:'UNCOMMON'},{n:'VEVOR 20V Hammer Drill SDS-Plus',v:90.90,o:1.4235,b:'UNCOMMON'},{n:'DeWalt ATOMIC 20V Drill/Driver Kit',v:100.00,o:3.6303,b:'RARE'},{n:'Gearwrench Stubby Wrench Set 14pc',v:100.49,o:3.6214,b:'RARE'},{n:'VEVOR 8in Benchtop Drill Press',v:101.90,o:3.5963,b:'RARE'},{n:'Milwaukee 1000V Insulated Set 5pc',v:104.97,o:3.5429,b:'RARE'},{n:'VEVOR Drywall Screw Gun 20V',v:105.90,o:3.5277,b:'RARE'},{n:'VEVOR Extension Cord Reel 100FT',v:109.90,o:3.4629,b:'RARE'},{n:'VEVOR Hydraulic Shop Press 6T',v:109.90,o:3.4629,b:'RARE'},{n:'VEVOR Mechanics Tool Set 230pc',v:119.00,o:3.3279,b:'RARE'},{n:'Milwaukee 36in Splitting Axe',v:119.98,o:3.3279,b:'RARE'},{n:'Milwaukee Hole Dozer Kit 15pc',v:119.97,o:1.2952,b:'EPIC'},{n:'VEVOR 6in Random Orbital Sander',v:120.00,o:1.2952,b:'EPIC'},{n:'VEVOR Air Compressor 2gal',v:122.90,o:1.2798,b:'EPIC'},{n:'DeWalt ATOMIC 20V Circular Saw',v:129.00,o:1.2492,b:'EPIC'},{n:'Milwaukee M12 Soldering Iron Kit',v:129.00,o:1.2492,b:'EPIC'},{n:'DeWalt 20V Grinder DCG408B',v:129.00,o:1.2492,b:'EPIC'},{n:'VEVOR Bench Grinder 8in',v:139.90,o:1.1995,b:'EPIC'},{n:'VEVOR Mechanics Tool Set 450pc',v:143.90,o:1.1827,b:'EPIC'},{n:'VEVOR Demolition Jack Hammer 3500W',v:200.00,o:0.4374,b:'LEGENDARY'},{n:'DeWalt ATOMIC 20V Impact Driver Kit',v:219.00,o:0.4179,b:'LEGENDARY'},{n:'STIHL MS 162 16in Chainsaw',v:219.99,o:0.4179,b:'LEGENDARY'},{n:'FLEX 24V 7-1/4in Circular Saw',v:219.00,o:0.4179,b:'LEGENDARY'},{n:'DeWalt ToughSystem 2.0 w/ Lights',v:229.00,o:0.4087,b:'LEGENDARY'},{n:'DeWalt 20V XR Blower Kit',v:239.00,o:0.4001,b:'LEGENDARY'},{n:'DeWalt 20V 2x5.0Ah + Charger + 2 Free Tools',v:767.00,o:1.0000,b:'MYTHIC'}];

const FOREMAN_ITEMS = [{n:'VEVOR 8in Benchtop Drill Press',v:101.90,o:4.3850,b:'COMMON'},{n:'VEVOR Cordless Recip Saw 20V',v:105.90,o:4.3014,b:'COMMON'},{n:'VEVOR Hydraulic Shop Press 6T',v:109.90,o:4.2224,b:'COMMON'},{n:'VEVOR Mechanics Tool Set 230pc',v:119.00,o:4.0577,b:'COMMON'},{n:'VEVOR 6in Random Orbital Sander',v:120.00,o:4.0408,b:'COMMON'},{n:'VEVOR Air Compressor 2gal',v:122.90,o:3.9928,b:'COMMON'},{n:'DeWalt ToughSeries Construction Jack',v:129.00,o:2.3010,b:'UNCOMMON'},{n:'VEVOR Wheel Dolly 8000lb 4pk',v:130.90,o:2.2843,b:'UNCOMMON'},{n:'JET 1/4 Ton Mini-Puller 5ft Lift',v:135.69,o:2.2436,b:'UNCOMMON'},{n:'VEVOR Rolling Tool Chest 5-Drawer',v:136.90,o:2.2337,b:'UNCOMMON'},{n:'VEVOR Bench Grinder 8in',v:139.90,o:2.2096,b:'UNCOMMON'},{n:'VEVOR Extension Cord Reel 100FT',v:139.90,o:2.2096,b:'UNCOMMON'},{n:'VEVOR Mechanics Tool Set 450pc',v:143.90,o:2.1787,b:'UNCOMMON'},{n:'VEVOR Electric Concrete Saw 9in',v:148.90,o:2.1418,b:'UNCOMMON'},{n:'Milwaukee M18 Sheet Sander',v:149.00,o:2.1340,b:'UNCOMMON'},{n:'Milwaukee M18 Compact Heat Gun',v:159.00,o:2.0726,b:'UNCOMMON'},{n:'Bosch BLAZE 165ft Green Laser',v:159.00,o:2.0726,b:'UNCOMMON'},{n:'VEVOR 6.3gal Air Compressor',v:159.90,o:2.0668,b:'UNCOMMON'},{n:'VEVOR Compound Miter Saw 10in',v:170.90,o:1.9992,b:'UNCOMMON'},{n:'Milwaukee M12 FUEL Hackzall Kit',v:199.00,o:1.8526,b:'UNCOMMON'},{n:'VEVOR Telescoping Ladder 20FT',v:254.90,o:3.5493,b:'RARE'},{n:'VEVOR Drain Cleaner Machine 75FT',v:254.90,o:3.5493,b:'RARE'},{n:'VEVOR Rotary Laser Level Kit',v:257.90,o:3.5286,b:'RARE'},{n:'Milwaukee M12 Caulk Gun + Battery',v:258.00,o:3.5279,b:'RARE'},{n:'Metabo HPT 6in Angle Grinder',v:259.00,o:3.5211,b:'RARE'},{n:'FLEX 24V Hammer Drill + Impact Combo',v:259.99,o:3.5144,b:'RARE'},{n:'VEVOR Magnetic Drill 1100W',v:267.90,o:3.4621,b:'RARE'},{n:'Milwaukee PACKOUT Rolling Drawer Box',v:269.00,o:3.4550,b:'RARE'},{n:'Milwaukee M12 FUEL Circular Saw Kit',v:279.00,o:3.3925,b:'RARE'},{n:'DeWalt ATOMIC 20V Cut-Off Tool',v:299.00,o:1.6842,b:'EPIC'},{n:'DeWalt 60V 7-1/4in Circular Saw',v:299.00,o:1.6844,b:'EPIC'},{n:'FLEX 24V Compact Band Saw',v:299.00,o:1.6844,b:'EPIC'},{n:'Milwaukee M12 FUEL INSIDER Ratchet',v:299.00,o:1.6844,b:'EPIC'},{n:'FLEX 24V Brad Nailer 18ga',v:309.00,o:1.6569,b:'EPIC'},{n:'Milwaukee M18 FUEL Drywall Screw Gun',v:329.00,o:1.6057,b:'EPIC'},{n:'DeWalt SDS Rotary Hammer + FlexVolt 9.0Ah Kit',v:478.00,o:1.2869,b:'LEGENDARY'},{n:'Milwaukee M12 Stubby Impact + Tire Inflator',v:538.00,o:1.2131,b:'LEGENDARY'},{n:'DeWalt 4-Tool + 4-Battery Bundle',v:1444.00,o:1.0000,b:'MYTHIC'}];

/* catalogs keyed by tier id — all three boxes live */
const CATALOG = { starter: STARTER_ITEMS, builder: BUILDER_ITEMS, foreman: FOREMAN_ITEMS };

/* Floor / max / tool count are READ FROM THE CATALOG, never typed by hand.
   Hand-entered stats drift the moment a SKU changes; derived stats cannot. */
const tierStats = (id) => {
  const a = CATALOG[id];
  return { floor: Math.min(...a.map((i) => i.v)), max: Math.max(...a.map((i) => i.v)), tools: a.length };
};

/* ============================================================
   TOOL PHOTOS  —  paste image URLs here and nothing else changes.

   Drop a URL between the quotes next to any tool. That tool
   immediately uses the photo everywhere: the reveal, the card,
   the garage wall. Leave it "" and it falls back to the line
   drawing, so a half-finished list is perfectly safe to ship.

     "Milwaukee Pry Bar": "https://cdn.yoursite.com/48-22-9042.webp",

   Any URL works — your CDN, a supplier page, Cloudinary, Drive
   (use the direct-file link, not the share link).

   WHAT TO SHOOT: transparent background, ~800x800, tool at a
   3/4 angle filling about 80% of frame. A white background
   ruins the reveal, since the tool rises out of a glow.

   If a URL is wrong or the file is missing, the app quietly
   falls back to the icon — it will never show a broken image.
   ============================================================ */
const PHOTOS = {

  /* ---------- $50  BUILDER ---------- */
  // COMMON
  "Milwaukee Drilling Hammer": "assets/milwaukee-drilling-hammer.webp",
  "Milwaukee Pry Bar": "assets/milwaukee-pry-bar.webp",
  "VEVOR Bolt Extractor Kit": "assets/vevor-bolt-extractor-kit.webp",
  "VEVOR Hex Key Set": "assets/vevor-hex-key-set.webp",
  "VEVOR Folding Knife": "assets/vevor-folding-knife.webp",
  "VEVOR Tool Bag 33-Pocket": "assets/vevor-tool-bag-33-pocket.webp",
  "VEVOR Stud Finder": "assets/vevor-stud-finder.webp",
  // UNCOMMON
  "VEVOR Click Torque Wrench Set": "assets/vevor-click-torque-wrench-set.webp",
  "Milwaukee Magnetic Tape Measure": "assets/milwaukee-magnetic-tape-measure.webp",
  "Milwaukee Screwdriver Set": "assets/milwaukee-screwdriver-set.webp",
  "Wiha Precision Screwdriver Set": "assets/wiha-precision-screwdriver-set.webp",
  "VEVOR Drywall Knife Set": "assets/vevor-drywall-knife-set.webp",
  "VEVOR Crimping Tool Kit": "assets/vevor-crimping-tool-kit.webp",
  "VEVOR Fishing Magnet": "assets/vevor-fishing-magnet.webp",
  "Milwaukee Voltage Detector": "assets/milwaukee-voltage-detector.webp",
  "VEVOR Tool Belt": "assets/vevor-tool-belt.webp",
  "VEVOR Drill Bit Set 101pc": "assets/vevor-drill-bit-set-101pc.webp",
  "Milwaukee Wire Stripper": "assets/milwaukee-wire-stripper.webp",
  "VEVOR Torpedo Level Set": "assets/vevor-torpedo-level-set.webp",
  "SKIL Cordless Screwdriver": "assets/skil-cordless-screwdriver.webp",
  "VEVOR Oscillating Multi-Tool": "assets/vevor-oscillating-multi-tool.webp",
  "VEVOR Laser Tape Measure": "assets/vevor-laser-tape-measure.webp",
  "VEVOR Angle Grinder": "assets/vevor-angle-grinder.webp",
  "VEVOR Rotary Tool Kit 136pc": "assets/vevor-rotary-tool-kit-136pc.webp",
  // RARE
  "VEVOR Impact Socket Set 26pc": "assets/vevor-impact-socket-set-26pc.webp",
  "VEVOR Combination Wrench Set": "assets/vevor-combination-wrench-set.webp",
  "VEVOR LED Work Light Tripod": "assets/vevor-led-work-light-tripod.webp",
  "Milwaukee Lineman's Pliers": "assets/milwaukee-lineman-s-pliers.webp",
  "VEVOR Arm Jack 2pc": "assets/vevor-arm-jack-2pc.webp",
  "Milwaukee Dead Blow Hammer": "assets/milwaukee-dead-blow-hammer.webp",
  "VEVOR Triple Lens Endoscope": "assets/vevor-triple-lens-endoscope.webp",
  "VEVOR Rolling Magnetic Sweeper": "assets/vevor-rolling-magnetic-sweeper.webp",
  "VEVOR Digital Torque Screwdriver": "assets/vevor-digital-torque-screwdriver.webp",
  "VEVOR Corded Recip Saw": "assets/vevor-corded-recip-saw.webp",
  // EPIC
  "VEVOR LED Work Light 13.2Ah": "assets/vevor-led-work-light-13-2ah.webp",
  "VEVOR Torpedo Level 4pc": "assets/vevor-torpedo-level-4pc.webp",
  "VEVOR Cordless Ratchet Wrench": "assets/vevor-cordless-ratchet-wrench.webp",
  "VEVOR Mechanics Tool Set 145pc": "assets/vevor-mechanics-tool-set-145pc.webp",
  "VEVOR Tool Backpack 65-Pocket": "assets/vevor-tool-backpack-65-pocket.webp",
  "Bosch Random Orbital Sander": "assets/bosch-random-orbital-sander.webp",
  "VEVOR Laser Level 100ft": "assets/vevor-laser-level-100ft.webp",
  // LEGENDARY
  "VEVOR Mechanics Set 230pc": "assets/vevor-mechanics-set-230pc.webp",
  "DeWalt Angle Grinder": "assets/dewalt-angle-grinder.webp",
  // MYTHIC
  "DeWalt 20V 5.0Ah 2-Pack + Free Recip Saw": "assets/dewalt-20v-5-0ah-2-pack-free-recip-saw.webp",
  "DeWalt 20V 5.0Ah 2-Pack + Free Circular Saw": "assets/dewalt-20v-5-0ah-2-pack-free-circular-saw.webp",
  /* ---------- $100 FOREMAN ---------- */
  // COMMON
  "VEVOR Laser Tape Measure 135ft": "assets/vevor-laser-tape-measure-135ft.webp",
  "VEVOR Folding Mechanic Creeper": "assets/vevor-folding-mechanic-creeper.webp",
  "VEVOR Hydraulic Bottle Jack 20T": "assets/vevor-hydraulic-bottle-jack-20t.webp",
  "VEVOR Wire Stripper Machine": "assets/vevor-wire-stripper-machine.webp",
  "VEVOR Angle Grinder 5in": "assets/vevor-angle-grinder-5in.webp",
  "VEVOR Drill Bit Set 246pc": "assets/vevor-drill-bit-set-246pc.webp",
  // (dupe of above) "VEVOR Rotary Tool Kit 136pc"
  // UNCOMMON
  "VEVOR Extension Cord Reel 30FT": "assets/vevor-extension-cord-reel-30ft.webp",
  // (dupe of above) "VEVOR Combination Wrench Set"
  // (dupe of above) "VEVOR LED Work Light Tripod"
  // (dupe of above) "VEVOR Arm Jack 2pc"
  // (dupe of above) "VEVOR Triple Lens Endoscope"
  // (dupe of above) "VEVOR Rolling Magnetic Sweeper"
  // (dupe of above) "VEVOR Impact Socket Set 26pc"
  // (dupe of above) "VEVOR Digital Torque Screwdriver"
  "VEVOR Air Hose Reel 50FT": "assets/vevor-air-hose-reel-50ft.webp",
  "VEVOR Pocket Hole Jig Kit 34pc": "assets/vevor-pocket-hole-jig-kit-34pc.webp",
  // (dupe of above) "VEVOR Corded Recip Saw"
  "VEVOR 12V Drain Auger 25FT": "assets/vevor-12v-drain-auger-25ft.webp",
  "VEVOR Torpedo Level Set 4pc": "assets/vevor-torpedo-level-set-4pc.webp",
  "VEVOR Rolling Tool Bag 25-Pocket": "assets/vevor-rolling-tool-bag-25-pocket.webp",
  "VEVOR 12V Air Compressor Tank": "assets/vevor-12v-air-compressor-tank.webp",
  // (dupe of above) "VEVOR Laser Level 100ft"
  "VEVOR 20V Hammer Drill SDS-Plus": "assets/vevor-20v-hammer-drill-sds-plus.webp",
  // RARE
  "DeWalt ATOMIC 20V Drill/Driver Kit": "assets/dewalt-atomic-20v-drill-driver-kit.webp",
  "Gearwrench Stubby Wrench Set 14pc": "assets/gearwrench-stubby-wrench-set-14pc.webp",
  "VEVOR 8in Benchtop Drill Press": "assets/vevor-8in-benchtop-drill-press.webp",
  "Milwaukee 1000V Insulated Set 5pc": "assets/milwaukee-1000v-insulated-set-5pc.webp",
  "VEVOR Drywall Screw Gun 20V": "assets/vevor-drywall-screw-gun-20v.webp",
  "VEVOR Extension Cord Reel 100FT": "assets/vevor-extension-cord-reel-100ft.webp",
  "VEVOR Hydraulic Shop Press 6T": "assets/vevor-hydraulic-shop-press-6t.webp",
  "VEVOR Mechanics Tool Set 230pc": "assets/vevor-mechanics-tool-set-230pc.webp",
  "Milwaukee 36in Splitting Axe": "assets/milwaukee-36in-splitting-axe.webp",
  // EPIC
  "Milwaukee Hole Dozer Kit 15pc": "assets/milwaukee-hole-dozer-kit-15pc.webp",
  "VEVOR 6in Random Orbital Sander": "assets/vevor-6in-random-orbital-sander.webp",
  "VEVOR Air Compressor 2gal": "assets/vevor-air-compressor-2gal.webp",
  "DeWalt ATOMIC 20V Circular Saw": "assets/dewalt-atomic-20v-circular-saw.webp",
  "Milwaukee M12 Soldering Iron Kit": "assets/milwaukee-m12-soldering-iron-kit.webp",
  "DeWalt 20V Grinder DCG408B": "assets/dewalt-20v-grinder-dcg408b.webp",
  "VEVOR Bench Grinder 8in": "assets/vevor-bench-grinder-8in.webp",
  "VEVOR Mechanics Tool Set 450pc": "assets/vevor-mechanics-tool-set-450pc.webp",
  // LEGENDARY
  "VEVOR Demolition Jack Hammer 3500W": "assets/vevor-demolition-jack-hammer-3500w.webp",
  "DeWalt ATOMIC 20V Impact Driver Kit": "assets/dewalt-atomic-20v-impact-driver-kit.webp",
  "STIHL MS 162 16in Chainsaw": "assets/stihl-ms-162-16in-chainsaw.webp",
  "FLEX 24V 7-1/4in Circular Saw": "assets/flex-24v-7-1-4in-circular-saw.webp",
  "DeWalt ToughSystem 2.0 w/ Lights": "assets/dewalt-toughsystem-2-0-w-lights.webp",
  "DeWalt 20V XR Blower Kit": "assets/dewalt-20v-xr-blower-kit.webp",
  // MYTHIC
  "DeWalt 20V 2x5.0Ah + Charger + 2 Free Tools": "assets/dewalt-20v-2x5-0ah-charger-2-free-tools.webp",
  /* ---------- $250 CONTRACTOR ---------- */
  // COMMON
  // (dupe of above) "VEVOR 8in Benchtop Drill Press"
  "VEVOR Cordless Recip Saw 20V": "assets/vevor-cordless-recip-saw-20v.webp",
  // (dupe of above) "VEVOR Hydraulic Shop Press 6T"
  // (dupe of above) "VEVOR Mechanics Tool Set 230pc"
  // (dupe of above) "VEVOR 6in Random Orbital Sander"
  // (dupe of above) "VEVOR Air Compressor 2gal"
  // UNCOMMON
  "DeWalt ToughSeries Construction Jack": "assets/dewalt-toughseries-construction-jack.webp",
  "VEVOR Wheel Dolly 8000lb 4pk": "assets/vevor-wheel-dolly-8000lb-4pk.webp",
  "JET 1/4 Ton Mini-Puller 5ft Lift": "assets/jet-1-4-ton-mini-puller-5ft-lift.webp",
  "VEVOR Rolling Tool Chest 5-Drawer": "assets/vevor-rolling-tool-chest-5-drawer.webp",
  // (dupe of above) "VEVOR Bench Grinder 8in"
  // (dupe of above) "VEVOR Extension Cord Reel 100FT"
  // (dupe of above) "VEVOR Mechanics Tool Set 450pc"
  "VEVOR Electric Concrete Saw 9in": "assets/vevor-electric-concrete-saw-9in.webp",
  "Milwaukee M18 Sheet Sander": "assets/milwaukee-m18-sheet-sander.webp",
  "Milwaukee M18 Compact Heat Gun": "assets/milwaukee-m18-compact-heat-gun.webp",
  "Bosch BLAZE 165ft Green Laser": "assets/bosch-blaze-165ft-green-laser.webp",
  "VEVOR 6.3gal Air Compressor": "assets/vevor-6-3gal-air-compressor.webp",
  "VEVOR Compound Miter Saw 10in": "assets/vevor-compound-miter-saw-10in.webp",
  "Milwaukee M12 FUEL Hackzall Kit": "assets/milwaukee-m12-fuel-hackzall-kit.webp",
  // RARE
  "VEVOR Telescoping Ladder 20FT": "assets/vevor-telescoping-ladder-20ft.webp",
  "VEVOR Drain Cleaner Machine 75FT": "assets/vevor-drain-cleaner-machine-75ft.webp",
  "VEVOR Rotary Laser Level Kit": "assets/vevor-rotary-laser-level-kit.webp",
  "Milwaukee M12 Caulk Gun + Battery": "assets/milwaukee-m12-caulk-gun-battery.webp",
  "Metabo HPT 6in Angle Grinder": "assets/metabo-hpt-6in-angle-grinder.webp",
  "FLEX 24V Hammer Drill + Impact Combo": "assets/flex-24v-hammer-drill-impact-combo.webp",
  "VEVOR Magnetic Drill 1100W": "assets/vevor-magnetic-drill-1100w.webp",
  "Milwaukee PACKOUT Rolling Drawer Box": "assets/milwaukee-packout-rolling-drawer-box.webp",
  "Milwaukee M12 FUEL Circular Saw Kit": "assets/milwaukee-m12-fuel-circular-saw-kit.webp",
  // EPIC
  "DeWalt ATOMIC 20V Cut-Off Tool": "assets/dewalt-atomic-20v-cut-off-tool.webp",
  "DeWalt 60V 7-1/4in Circular Saw": "assets/dewalt-60v-7-1-4in-circular-saw.webp",
  "FLEX 24V Compact Band Saw": "assets/flex-24v-compact-band-saw.webp",
  "Milwaukee M12 FUEL INSIDER Ratchet": "assets/milwaukee-m12-fuel-insider-ratchet.webp",
  "FLEX 24V Brad Nailer 18ga": "assets/flex-24v-brad-nailer-18ga.webp",
  "Milwaukee M18 FUEL Drywall Screw Gun": "assets/milwaukee-m18-fuel-drywall-screw-gun.webp",
  // LEGENDARY
  "DeWalt SDS Rotary Hammer + FlexVolt 9.0Ah Kit": "assets/dewalt-sds-rotary-hammer-flexvolt-9-0ah-kit.png",
  "Milwaukee M12 Stubby Impact + Tire Inflator": "assets/milwaukee-m12-stubby-impact-tire-inflator.png",
  // MYTHIC
  "DeWalt 4-Tool + 4-Battery Bundle": "assets/dewalt-4-tool-4-battery-bundle.webp",
};

/* photo if one is pasted for this tool, otherwise null */
const photoFor = (name) => PHOTOS[name] || null;

/* Ask the CDN for the size we actually render. The garage shows tools at
   ~120px; pulling a 573px file for each one is wasted bandwidth on mobile.
   Non-OPT urls pass through untouched. */
const sizedPhoto = (url, px) =>
  url && /height=\d+/.test(url)
    ? url.replace(/height=\d+/, "height=" + px).replace(/width=\d+/, "width=" + px)
    : url;

const YEL = "#E8B90F", YEL_HI = "#FFE873", YEL_DK = "#C79A08", INK = "#15171B";
const RARITIES = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
const RACK_SIZE = 9;
const SWIPE_PX = 180;           // full vertical travel to break a crate open
const mod = (n, m) => ((n % m) + m) % m;

const GRADE = {
  COMMON:    { accent: "#AEB5BE", glow: "rgba(190,198,208,0.75)", label: "COMMON",    pips: 1 },
  UNCOMMON:  { accent: "#59B978", glow: "rgba(89,185,120,0.75)",  label: "UNCOMMON",  pips: 2 },
  RARE:      { accent: "#4D9BEF", glow: "rgba(77,155,239,0.8)",   label: "RARE",      pips: 3 },
  EPIC:      { accent: "#A45CEC", glow: "rgba(164,92,236,0.8)",   label: "EPIC",      pips: 4 },
  LEGENDARY: { accent: "#EF5450", glow: "rgba(239,84,80,0.8)",    label: "LEGENDARY", pips: 5 },
  MYTHIC:    { accent: "#F0C64E", glow: "rgba(240,198,78,0.85)",  label: "MYTHIC",    pips: 6 },
};

/* ============================================================
   CEREMONY LIGHTING
   The room is lit with white studio light. Rarity only *tints*
   that light — it never becomes a coloured beam. Values stay low
   on purpose: the read comes from reflections and falloff, not
   from saturation.
   ============================================================ */
const LIGHT = {
  COMMON:    { key: "#F4F7FB", tint: "rgba(203,214,228,",  spec: "rgba(226,236,248," },
  UNCOMMON:  { key: "#F3FAF4", tint: "rgba(176,214,186,",  spec: "rgba(214,240,222," },
  RARE:      { key: "#F1F6FD", tint: "rgba(172,197,232,",  spec: "rgba(212,229,252," },
  EPIC:      { key: "#F6F2FD", tint: "rgba(196,178,230,",  spec: "rgba(228,216,250," },
  LEGENDARY: { key: "#FDF4EF", tint: "rgba(228,178,166,",  spec: "rgba(250,222,210," },
  MYTHIC:    { key: "#FDF6E6", tint: "rgba(226,196,132,",  spec: "rgba(250,234,190," },
};
const lit = (grade, chan, a) => (LIGHT[grade] || LIGHT.COMMON)[chan] + a + ")";

/* Premium easing. A real cubic-bezier solver so the motion curves match
   what a motion designer would specify, instead of the handful of shapes
   you can reach with arithmetic. Newton-Raphson, then bisection fallback. */
const bezier = (x1, y1, x2, y2) => {
  const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, C = (a) => 3 * a;
  const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 5; i++) {
      const d = slope(t, x1, x2);
      if (d === 0) break;
      t -= (calc(t, x1, x2) - x) / d;
    }
    let lo = 0, hi = 1;
    for (let i = 0; i < 12 && (t < 0 || t > 1); i++) {
      const cx = calc(t, x1, x2);
      if (cx < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return calc(t, y1, y2);
  };
};
/* a heavy hinged lid: reluctant to start, long graceful settle */
const EASE_LID   = bezier(0.32, 0.02, 0.16, 1);

/* Published values must be literally true. money() shows the EXACT price —
   cents whenever they exist, thousands separated, no rounding anywhere.
   $53.90 stays $53.90. $199.00 shows as $199 because that IS the value. */
const money = (v) =>
  "$" + (Number(v) % 1 === 0
    ? Number(v).toLocaleString("en-US")
    : Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

/* Rounded display for tool values everywhere EXCEPT the odds screen.
   Cleaner to read at a glance; the odds page keeps the exact figure so the
   published values stay literally true. Money the customer actually PAYS
   (box price, shipping, totals) always uses money() — never rounded. */
const moneyR = (v) => "$" + Math.round(Number(v)).toLocaleString("en-US");

/* per-catalog bracket odds + value ranges, computed once per catalog */
const _statCache = {};
const catalogStats = (items) => {
  const key = items.length + ":" + items[0].n;
  if (_statCache[key]) return _statCache[key];
  const odds = {}, lo = {}, hi = {};
  for (const it of items) {
    odds[it.b] = (odds[it.b] || 0) + it.o;
    lo[it.b] = lo[it.b] === undefined ? it.v : Math.min(lo[it.b], it.v);
    hi[it.b] = hi[it.b] === undefined ? it.v : Math.max(hi[it.b], it.v);
  }
  const range = {};
  for (const b of Object.keys(odds)) {
    range[b] = lo[b] === hi[b] ? money(lo[b]) : `${money(lo[b])}–${money(hi[b])}`;
  }
  return (_statCache[key] = { odds, range });
};

const DUST = [
  { l: 12, d: 0,   t: 26, s: 2.0, o: 0.20 }, { l: 26, d: 7,  t: 34, s: 1.4, o: 0.13 },
  { l: 38, d: 15,  t: 29, s: 1.8, o: 0.17 }, { l: 51, d: 3,  t: 38, s: 1.2, o: 0.11 },
  { l: 63, d: 11,  t: 31, s: 2.2, o: 0.19 }, { l: 74, d: 19, t: 27, s: 1.5, o: 0.14 },
  { l: 85, d: 5,   t: 36, s: 1.3, o: 0.12 }, { l: 92, d: 13, t: 30, s: 1.9, o: 0.16 },
  { l: 19, d: 22,  t: 40, s: 1.1, o: 0.10 }, { l: 57, d: 25, t: 33, s: 1.6, o: 0.15 },
];

/* ---- THREE TIERS ---- */
const TIERS = [
  {
    /* BUILDER ($50) — brushed silver. Near-white crests, deeper
       shadow floor, hotter rim. Carries a glint sweep when centered. */
    id: "starter", ship: 5.99, name: "BUILDER", price: 50, live: true,
    accent: "#D6DEE7", accentDk: "#7E8896", wash: "rgba(207,215,224,0.06)",
    pal: { hi: "#FAFCFE", mid: "#B6BFCA", dk: "#646C76", deep: "#333840",
           plateA: "#B4BCC6", plateB: "#D8DFE7", plateC: "#FBFDFF", plateD: "#6E767F",
           guard: "yellow", rim: "rgba(255,255,255,0.95)", stencil: "#2C3138",
           gloss: 0.42, seam: "rgba(0,0,0,0.28)", seamHi: "rgba(255,255,255,0.12)" },
  },
  {
    id: "builder", ship: 5.99, name: "FOREMAN", price: 100, live: true,
    accent: "#E9C566", accentDk: "#9E7A1C", wash: "rgba(233,197,102,0.07)",
    pal: { hi: "#F9EBC0", mid: "#CBA64C", dk: "#82651F", deep: "#463509",
           plateA: "#CDA748", plateB: "#E6C87E", plateC: "#FAEFC8", plateD: "#82651F",
           guard: "gunmetal", rim: "rgba(255,248,220,0.9)", stencil: "#3A2C08",
           gloss: 0.46, seam: "rgba(46,32,4,0.35)", seamHi: "rgba(255,244,200,0.14)" },
  },
  {
    id: "foreman", ship: 0, name: "CONTRACTOR", price: 250, live: true,
    accent: "#FF6A62", accentDk: "#8E1A1C", wash: "rgba(255,106,98,0.07)",
    pal: { hi: "#DE5860", mid: "#8E1E29", dk: "#520D16", deep: "#26050A",
           plateA: "#98222C", plateB: "#C33C45", plateC: "#F08486", plateD: "#520D16",
           guard: "gunmetal", rim: "rgba(255,210,210,0.75)", stencil: "#FFE6E6",
           gloss: 0.55, seam: "rgba(0,0,0,0.40)", seamHi: "rgba(255,170,170,0.10)" },
  },
];

/* ---- tool icons ---- */
const ICON_RULES = [
  /* Builder additions — matched before the generic power-tool rules */
  [/2x5\.0ah|redlithium|battery|2-pack/i, "impact"],
  [/creeper|shop press|bottle jack|drill press|bench grinder|mini-puller|wheel dolly|construction jack/i, "kit"],
  [/magnetic drill|mag drill/i, "drill"],
  [/concrete saw|band saw|circular saw|miter saw|cut-off|hackzall|recip/i, "saw"],
  [/tool chest|packout|rolling drawer|toughsystem/i, "storage"],
  [/rivet tool|caulk gun|brad nailer|screw gun/i, "impact"],
  [/heat gun|tire inflator|air compressor/i, "compressor"],
  [/rotary hammer|sds/i, "drill"],
  [/laser|distance measurer|green beam/i, "tester"],
  [/cord reel|hose reel|extension cord/i, "compressor"],
  [/jack hammer|splitting axe|demolition/i, "striking"],
  [/chainsaw|circular saw|hole dozer|hole saw/i, "saw"],
  [/blower|air compressor|drain auger|screw gun/i, "compressor"],
  [/soldering|toughsystem|pocket hole|wire stripper machine/i, "kit"],
  [/5\.0ah|20v|m18/i, "impact"],
  [/recip|sawzall|hackzall/i, "saw"],
  [/tape measure|laser tape/i, "tester"],
  [/backpack|belt|apron|tool bag|pouch|tote|organizer|bucket|sweeper/i, "storage"],
  [/knife|scraper|drywall/i, "striking"],
  [/hex key|allen|extractor|jack/i, "wrench"],
  [/endoscope|inspection|stud finder|scanner|magnet/i, "tester"],
  [/crimp/i, "pliers"],
  [/mechanics (tool )?set|socket set/i, "socket"],
  [/bit set|driver bit set|micro ?driver/i, "bitset"],
  [/table saw|miter saw|circular saw|cut-off|jig saw/i, "saw"], [/grinder/i, "grinder"], [/sander/i, "sander"],
  [/oscillating|multi tool kit|rotary/i, "oscillating"], [/impact|combo kit|drill\/driver|drill\/impact/i, "impact"],
  [/drill/i, "drill"], [/compressor|inflator|fan/i, "compressor"], [/light|flood/i, "light"],
  [/bit set|bit &|bit socket|driver bit|multi-bit|nut driver/i, "bitset"], [/socket|ratchet|torx/i, "socket"],
  [/wrench/i, "wrench"], [/plier|stripper|crimper|cutter/i, "pliers"], [/screwdriver/i, "screwdriver"],
  [/mallet|hammer|pry bar|wrecking|nail puller|scraper|bevel/i, "striking"], [/tester|voltage|meter/i, "tester"],
  [/bag|tote|pouch|apron|organizer|bucket/i, "storage"],
  [/multi-tool|magnet|inspection|hook|pick|general tool|residential tool/i, "kit"],
];
const iconFor = (n) => (ICON_RULES.find(([re]) => re.test(n)) || [null, "kit"])[1];

const ToolIcon = memo(function ToolIcon({ type, color = "#EDEBE6", size = 128 }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" };
  const p2 = { ...p, strokeWidth: 1.1, opacity: 0.55 };
  const G = {
    drill: <><path {...p} d="M14 26h26l6 5h14v10H46l-6 5H14z" /><path {...p} d="M54 33h16v6H54z" /><path {...p} d="M70 34h14v4H70z" /><path {...p} d="M22 46l-4 18h14l3-18" /><path {...p} d="M18 64h16v5H18z" /><path {...p2} d="M20 30h14M20 40h10" /><circle {...p2} cx="77" cy="36" r="2.2" /></>,
    impact: <><path {...p} d="M16 24h24l7 6h10v14H47l-7 6H16z" /><path {...p} d="M57 32h10v10H57z" /><path {...p} d="M67 34h6v6h-6z" /><path {...p} d="M73 33l6-3v14l-6-3z" /><path {...p} d="M24 50l-5 20h16l3-20" /><path {...p} d="M19 70h18v5H19z" /><path {...p2} d="M22 29h14M22 40h9" /></>,
    saw: <><circle {...p} cx="52" cy="42" r="22" /><circle {...p2} cx="52" cy="42" r="6" /><path {...p} d="M14 50h26" /><path {...p} d="M14 50v10h20" /><path {...p} d="M18 60l-4 12h12l2-12" /><path {...p2} d="M52 20v6M74 42h-6M52 64v-6M30 42h6M67 27l-4 4M67 57l-4-4M37 57l4-4M37 27l4 4" /></>,
    grinder: <><path {...p} d="M12 32h34v18H12z" /><path {...p} d="M46 30h12v22H46z" /><circle {...p} cx="70" cy="41" r="16" /><circle {...p2} cx="70" cy="41" r="4" /><path {...p} d="M58 24h16v6H58z" /><path {...p2} d="M16 36h22M16 46h22" /></>,
    sander: <><path {...p} d="M20 28h40a8 8 0 018 8v6H20z" /><path {...p} d="M16 42h60v8H16z" /><path {...p} d="M20 50h52v8a4 4 0 01-4 4H24a4 4 0 01-4-4z" /><path {...p2} d="M26 56h40" /><path {...p} d="M60 22h14v6H60z" /></>,
    oscillating: <><path {...p} d="M18 34h30v14H18z" /><path {...p} d="M48 36h14v10H48z" /><path {...p} d="M62 38l14-6v18l-14-6z" /><path {...p2} d="M22 38h20M22 44h14" /><path {...p2} d="M80 30c4 4 4 18 0 22" /></>,
    wrench: <><path {...p} d="M26 20a13 13 0 00-6 22l30 30a13 13 0 0018-18L38 24a13 13 0 00-12-4z" /><path {...p} d="M22 24l10 10-6 6-10-10" /><circle {...p2} cx="62" cy="62" r="5" /></>,
    socket: <><path {...p} d="M40 18l16 9v18l-16 9-16-9V27z" /><path {...p2} d="M40 28l7 4v8l-7 4-7-4v-8z" /><path {...p} d="M46 50l26 26" /><path {...p} d="M68 68l10 10-6 6-10-10z" /><circle {...p2} cx="40" cy="36" r="14" /></>,
    pliers: <><path {...p} d="M24 18l24 30M64 18L40 48" /><circle {...p} cx="44" cy="46" r="4" /><path {...p} d="M40 50L26 78M48 50l14 28" /><path {...p2} d="M28 72h8M52 72h8" /></>,
    screwdriver: <><path {...p} d="M40 12h12v30H40z" /><path {...p2} d="M43 16v22M49 16v22" /><path {...p} d="M42 42h8v26h-8z" /><path {...p} d="M44 68h4v12l-2 4-2-4z" /></>,
    striking: <><path {...p} d="M18 24h34v18H18z" /><path {...p2} d="M24 24v18M46 24v18" /><path {...p} d="M52 28h8v10h-8z" /><path {...p} d="M34 42l4 34h-8l4-34" /><path {...p} d="M28 76h12v6H28z" /></>,
    bitset: <><path {...p} d="M14 24h60v44H14z" /><path {...p2} d="M14 34h60M14 46h60M14 58h60" /><path {...p2} d="M28 24v44M44 24v44M60 24v44" /><circle {...p} cx="21" cy="29" r="2" /></>,
    storage: <><path {...p} d="M14 36h60v34a4 4 0 01-4 4H18a4 4 0 01-4-4z" /><path {...p} d="M28 36V26a6 6 0 016-6h20a6 6 0 016 6v10" /><path {...p2} d="M14 48h60" /><path {...p} d="M36 44h16v8H36z" /></>,
    light: <><path {...p} d="M22 26h40v26H22z" /><path {...p2} d="M28 32h28M28 40h28M28 46h20" /><path {...p} d="M38 52h8v14h-8z" /><path {...p} d="M28 66h28v8H28z" /><path {...p2} d="M68 30l10-6M70 40h12M68 50l10 6" /></>,
    compressor: <><path {...p} d="M18 44a12 12 0 0112-12h28a12 12 0 010 24H30a12 12 0 01-12-12z" /><path {...p2} d="M30 32v24M58 32v24" /><path {...p} d="M40 32V22h10v10" /><path {...p} d="M24 56v8h6M52 56v8h6" /><circle {...p2} cx="66" cy="24" r="6" /></>,
    tester: <><path {...p} d="M26 22h28v40H26z" /><path {...p2} d="M32 30h16v10H32z" /><circle {...p2} cx="34" cy="50" r="2.5" /><circle {...p2} cx="46" cy="50" r="2.5" /><path {...p} d="M34 62v16M46 62v16" /><path {...p2} d="M30 78h8M42 78h8" /></>,
    kit: <><path {...p} d="M14 34h60v36H14z" /><path {...p} d="M30 34v-8h28v8" /><path {...p2} d="M14 48h60" /><path {...p2} d="M26 56h10M44 56h18M26 62h22" /><circle {...p} cx="44" cy="41" r="3" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 90 90" style={{ overflow: "visible" }}>{G[type] || G.kit}</svg>;
});

/* ============================================================
   TOOL RENDER — dimensional placeholder renders.
   Brushed-aluminum bodies, textured rubber grips, real
   highlights and cast shadows, a few degrees of perspective.
   Same 17 type keys as ToolIcon, so every caller routes through
   unchanged. Used until licensed photography lands in PHOTOS.
   Each render is authored in a 100x100 box, lit top-left.
   ============================================================ */
const ToolRender = memo(function ToolRender({ type, size = 128, accent = "#E8B90F" }) {
  const uid = useRef("tr" + Math.random().toString(36).slice(2, 8)).current;
  const id = (s) => `${s}-${uid}`;
  // shared material stops
  const defs = (
    <defs>
      {/* brushed aluminium — cross-lit steel, cool with a warm kick */}
      <linearGradient id={id("alu")} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#F4F7FA" />
        <stop offset="22%" stopColor="#CAD2DB" />
        <stop offset="55%" stopColor="#9AA4B0" />
        <stop offset="80%" stopColor="#6C7681" />
        <stop offset="100%" stopColor="#474E57" />
      </linearGradient>
      <linearGradient id={id("alu2")} x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor="#E4E9EF" />
        <stop offset="50%" stopColor="#AEB7C2" />
        <stop offset="100%" stopColor="#5E666F" />
      </linearGradient>
      {/* black textured rubber grip */}
      <linearGradient id={id("rub")} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#3A3F45" />
        <stop offset="45%" stopColor="#212528" />
        <stop offset="100%" stopColor="#0C0E10" />
      </linearGradient>
      {/* accent housing (tool body colour) */}
      <linearGradient id={id("acc")} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
        <stop offset="55%" stopColor={accent} stopOpacity="0.7" />
        <stop offset="100%" stopColor="#1A1C20" />
      </linearGradient>
      {/* soft top-left key light */}
      <radialGradient id={id("spec")} cx="34%" cy="26%" r="60%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id={id("sh")} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2.2" stdDeviation="2.4" floodColor="#000" floodOpacity="0.42" />
      </filter>
      {/* fine brushed striations */}
      <pattern id={id("brush")} width="3" height="100" patternUnits="userSpaceOnUse">
        <rect width="3" height="100" fill="transparent" />
        <line x1="1" y1="0" x2="1" y2="100" stroke="#fff" strokeWidth="0.4" opacity="0.05" />
        <line x1="2.4" y1="0" x2="2.4" y2="100" stroke="#000" strokeWidth="0.4" opacity="0.06" />
      </pattern>
      {/* rubber diamond knurl */}
      <pattern id={id("knurl")} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <rect width="5" height="5" fill="transparent" />
        <path d="M2.5 0l2.5 2.5-2.5 2.5L0 2.5z" fill="#fff" opacity="0.05" />
      </pattern>
    </defs>
  );

  // alu | alu2 | rub | acc surface refs
  const al = `url(#${id("alu")})`, al2 = `url(#${id("alu2")})`,
        ru = `url(#${id("rub")})`, ac = `url(#${id("acc")})`,
        sp = `url(#${id("spec")})`, br = `url(#${id("brush")})`,
        kn = `url(#${id("knurl")})`, sh = `url(#${id("sh")})`;
  const edge = { stroke: "#0A0C0E", strokeWidth: 0.6, strokeLinejoin: "round" };
  const rimL = { stroke: "#FFFFFF", strokeWidth: 0.5, strokeOpacity: 0.4, fill: "none" };

  const bodies = {
    drill: (
      <g filter={sh}>
        <path d="M20 30 h30 l10 4 h18 a4 4 0 014 4 v12 a4 4 0 01-4 4 h-18 l-10 4 h-30 a6 6 0 01-6-6 v-16 a6 6 0 016-6 z" fill={ac} {...edge} />
        <rect x="66" y="36" width="18" height="16" rx="3" fill={al} {...edge} />
        <rect x="66" y="36" width="18" height="16" rx="3" fill={br} />
        <ellipse cx="84" cy="44" rx="3" ry="7" fill={ru} {...edge} />
        {/* grip */}
        <path d="M26 54 l-5 26 a4 4 0 004 5 h10 a4 4 0 004-4 l3-27 z" fill={ru} {...edge} />
        <path d="M26 54 l-5 26 a4 4 0 004 5 h10 a4 4 0 004-4 l3-27 z" fill={kn} />
        {/* trigger + chuck accents */}
        <path d="M48 52 h6 l-1 6 h-6 z" fill={al2} {...edge} />
        <rect x="20" y="34" width="26" height="14" rx="4" fill={sp} />
        <path d="M20 30 h30 l10 4 h18" {...rimL} />
      </g>
    ),
    impact: (
      <g filter={sh}>
        <path d="M22 30 h26 l8 5 h14 a4 4 0 014 4 v10 a4 4 0 01-4 4 h-14 l-8 5 h-26 a6 6 0 01-6-6 v-16 a6 6 0 016-6z" fill={ac} {...edge} />
        <rect x="68" y="37" width="10" height="14" rx="2" fill={al} {...edge} />
        <path d="M78 39 l6-3 v12 l-6-3z" fill={al2} {...edge} />
        <path d="M28 54 l-5 24 a4 4 0 004 5 h11 a4 4 0 004-4 l3-25z" fill={ru} {...edge} />
        <path d="M28 54 l-5 24 a4 4 0 004 5 h11 a4 4 0 004-4 l3-25z" fill={kn} />
        <rect x="22" y="34" width="24" height="13" rx="4" fill={sp} />
        <circle cx="73" cy="44" r="2" fill="#0A0C0E" opacity="0.5" />
      </g>
    ),
    saw: (
      <g filter={sh}>
        <circle cx="54" cy="46" r="26" fill={al} {...edge} />
        <circle cx="54" cy="46" r="26" fill={br} />
        <circle cx="54" cy="46" r="26" fill="none" stroke="#0A0C0E" strokeWidth="1" />
        <circle cx="54" cy="46" r="7" fill={al2} {...edge} />
        <circle cx="54" cy="46" r="2.5" fill="#0A0C0E" />
        {[...Array(16)].map((_, i) => {
          const a = (i / 16) * Math.PI * 2, r1 = 26, r2 = 29.5;
          return <line key={i} x1={54 + Math.cos(a) * r1} y1={46 + Math.sin(a) * r1} x2={54 + Math.cos(a) * r2} y2={46 + Math.sin(a) * r2} stroke="#8A939E" strokeWidth="1.4" />;
        })}
        <path d="M14 44 h20 a4 4 0 014 4 v6 a4 4 0 01-4 4 h-16 a4 4 0 01-4-4 z" fill={ac} {...edge} />
        <path d="M16 60 l-3 18 a4 4 0 004 5 h8 a4 4 0 004-4 l2-19z" fill={ru} {...edge} />
        <path d="M16 60 l-3 18 a4 4 0 004 5 h8 a4 4 0 004-4 l2-19z" fill={kn} />
        <ellipse cx="46" cy="34" rx="14" ry="9" fill={sp} opacity="0.7" />
      </g>
    ),
    grinder: (
      <g filter={sh}>
        <rect x="14" y="36" width="40" height="20" rx="8" fill={ru} {...edge} />
        <rect x="14" y="36" width="40" height="20" rx="8" fill={kn} />
        <rect x="50" y="34" width="16" height="24" rx="4" fill={ac} {...edge} />
        <circle cx="78" cy="46" r="18" fill={al} {...edge} />
        <circle cx="78" cy="46" r="18" fill={br} />
        <circle cx="78" cy="46" r="5" fill={al2} {...edge} />
        <circle cx="78" cy="46" r="1.8" fill="#0A0C0E" />
        <path d="M62 30 a18 18 0 0132 0 z" fill={al2} {...edge} opacity="0.9" />
        <rect x="18" y="39" width="30" height="7" rx="3" fill={sp} />
      </g>
    ),
    sander: (
      <g filter={sh}>
        <path d="M24 30 h30 a10 10 0 0110 10 v6 h-50 v-6 a10 10 0 0110-10z" fill={ac} {...edge} />
        <rect x="12" y="46" width="66" height="10" rx="3" fill={al} {...edge} />
        <rect x="12" y="46" width="66" height="10" rx="3" fill={br} />
        <rect x="16" y="56" width="58" height="12" rx="3" fill={ru} {...edge} />
        <rect x="16" y="56" width="58" height="12" rx="3" fill={kn} />
        <ellipse cx="40" cy="38" rx="16" ry="7" fill={sp} />
        <path d="M12 46 h66" {...rimL} />
      </g>
    ),
    oscillating: (
      <g filter={sh}>
        <path d="M18 38 h30 a4 4 0 014 4 v8 a4 4 0 01-4 4 h-30 a8 8 0 01-8-8 a8 8 0 018-8z" fill={ru} {...edge} />
        <path d="M18 38 h30 a4 4 0 014 4 v8 a4 4 0 01-4 4 h-30 a8 8 0 01-8-8 a8 8 0 018-8z" fill={kn} />
        <rect x="48" y="38" width="20" height="16" rx="3" fill={ac} {...edge} />
        <path d="M66 42 l16-5 v18 l-16-5z" fill={al} {...edge} />
        <path d="M66 42 l16-5 v18 l-16-5z" fill={br} />
        <rect x="20" y="41" width="24" height="6" rx="3" fill={sp} />
      </g>
    ),
    wrench: (
      <g filter={sh}>
        <path d="M30 22 a15 15 0 00-7 25 l32 32 a12 12 0 0017-17 l-32-32 a15 15 0 00-10-8z m-2 8 l10 10 -7 7 -10-10 a8 8 0 017-7z" fill={al} {...edge} />
        <path d="M30 22 a15 15 0 00-7 25 l32 32 a12 12 0 0017-17 l-32-32 a15 15 0 00-10-8z" fill={br} opacity="0.5" />
        <circle cx="64" cy="64" r="5" fill={ru} {...edge} />
        <path d="M26 28 l9 9 -5 5" fill="none" stroke="#fff" strokeWidth="1" strokeOpacity="0.4" />
      </g>
    ),
    socket: (
      <g filter={sh}>
        <path d="M44 16 l18 10 v20 l-18 10 -18-10 v-20z" fill={al} {...edge} />
        <path d="M44 16 l18 10 v20 l-18 10 -18-10 v-20z" fill={br} />
        <path d="M44 26 l8 5 v9 l-8 5 -8-5 v-9z" fill={ru} {...edge} />
        <path d="M50 52 l24 24" stroke={al2} strokeWidth="7" strokeLinecap="round" {...edge} />
        <rect x="66" y="66" width="14" height="14" rx="3" transform="rotate(45 73 73)" fill={ru} {...edge} />
        <path d="M30 24 l14 8 v4 l-14-8z" fill={sp} />
      </g>
    ),
    pliers: (
      <g filter={sh}>
        <path d="M30 16 l20 26 -6 6 -22-24 a5 5 0 018-8z" fill={al} {...edge} />
        <path d="M62 16 l-20 26 6 6 22-24 a5 5 0 00-8-8z" fill={al2} {...edge} />
        <circle cx="46" cy="46" r="4" fill={ru} {...edge} />
        <path d="M42 50 l-14 28 a3 3 0 003 4 h5 a3 3 0 003-3 l9-25z" fill={ru} {...edge} />
        <path d="M50 50 l14 28 a3 3 0 01-3 4 h-5 a3 3 0 01-3-3 l-9-25z" fill={ru} {...edge} />
        <path d="M42 50 l-14 28 a3 3 0 003 4 h5 a3 3 0 003-3 l9-25z" fill={kn} />
        <path d="M50 50 l14 28 a3 3 0 01-3 4 h-5 a3 3 0 01-3-3 l-9-25z" fill={kn} />
      </g>
    ),
    screwdriver: (
      <g filter={sh}>
        <rect x="38" y="46" width="20" height="30" rx="8" fill={ac} {...edge} />
        <rect x="38" y="46" width="20" height="30" rx="8" fill={kn} />
        <rect x="42" y="40" width="12" height="10" rx="2" fill={al2} {...edge} />
        <rect x="45" y="12" width="6" height="30" rx="1" fill={al} {...edge} />
        <path d="M45 12 h6 l-1 -4 h-4z" fill={al2} {...edge} />
        <rect x="46" y="14" width="1.5" height="26" fill="#fff" opacity="0.5" />
        <ellipse cx="48" cy="54" rx="6" ry="10" fill={sp} />
      </g>
    ),
    striking: (
      <g filter={sh}>
        <rect x="20" y="24" width="40" height="18" rx="4" fill={al} {...edge} />
        <rect x="20" y="24" width="40" height="18" rx="4" fill={br} />
        <rect x="56" y="26" width="12" height="14" rx="2" fill={al2} {...edge} />
        <rect x="18" y="24" width="8" height="18" rx="2" fill="#5E666F" {...edge} />
        <path d="M40 42 l4 34 a4 4 0 01-4 4 h-2 a4 4 0 01-4-4 l4-34z" fill={ru} {...edge} />
        <path d="M40 42 l4 34 a4 4 0 01-4 4 h-2 a4 4 0 01-4-4 l4-34z" fill={kn} />
        <rect x="24" y="27" width="28" height="6" rx="2" fill={sp} />
      </g>
    ),
    bitset: (
      <g filter={sh}>
        <rect x="14" y="26" width="60" height="44" rx="5" fill={ru} {...edge} />
        <rect x="14" y="26" width="60" height="44" rx="5" fill={kn} />
        <rect x="18" y="30" width="52" height="36" rx="3" fill={al2} {...edge} opacity="0.25" />
        {[0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => (
          <g key={`${r}${c}`}>
            <rect x={22 + c * 10} y={34 + r * 11} width="6" height="8" rx="1" fill={al} {...edge} />
            <rect x={23.5 + c * 10} y={34 + r * 11} width="1" height="8" fill="#fff" opacity="0.4" />
          </g>
        )))}
        <rect x="18" y="30" width="52" height="6" rx="2" fill={sp} />
      </g>
    ),
    storage: (
      <g filter={sh}>
        <path d="M14 40 h60 v28 a5 5 0 01-5 5 h-50 a5 5 0 01-5-5z" fill={ac} {...edge} />
        <path d="M28 40 v-8 a6 6 0 016-6 h20 a6 6 0 016 6 v8" fill="none" {...edge} stroke="#0A0C0E" strokeWidth="2" />
        <rect x="14" y="40" width="60" height="10" rx="2" fill={al} {...edge} />
        <rect x="14" y="40" width="60" height="10" rx="2" fill={br} />
        <rect x="34" y="52" width="20" height="9" rx="2" fill={al2} {...edge} />
        <rect x="18" y="42" width="52" height="4" rx="2" fill={sp} />
      </g>
    ),
    light: (
      <g filter={sh}>
        <rect x="20" y="26" width="44" height="30" rx="4" fill={al} {...edge} />
        <rect x="20" y="26" width="44" height="30" rx="4" fill={br} />
        <rect x="24" y="30" width="36" height="22" rx="2" fill="#FFF6D6" opacity="0.9" />
        <rect x="24" y="30" width="36" height="22" rx="2" fill={sp} />
        <rect x="36" y="56" width="12" height="12" fill={ru} {...edge} />
        <rect x="28" y="68" width="28" height="8" rx="3" fill={al2} {...edge} />
        {[...Array(4)].map((_, i) => <line key={i} x1={26 + i * 9} y1="33" x2={26 + i * 9} y2="49" stroke="#fff" strokeWidth="0.6" opacity="0.3" />)}
      </g>
    ),
    compressor: (
      <g filter={sh}>
        <ellipse cx="44" cy="48" rx="30" ry="16" fill={ac} {...edge} />
        <ellipse cx="44" cy="48" rx="30" ry="16" fill={br} opacity="0.4" />
        <ellipse cx="20" cy="48" rx="5" ry="14" fill={al2} {...edge} />
        <ellipse cx="68" cy="48" rx="5" ry="14" fill={al2} {...edge} />
        <rect x="38" y="24" width="12" height="14" rx="2" fill={al} {...edge} />
        <circle cx="60" cy="30" r="8" fill={al} {...edge} />
        <circle cx="60" cy="30" r="8" fill={br} />
        <circle cx="60" cy="30" r="2" fill="#0A0C0E" />
        <path d="M26 62 l-3 10 h6 M58 62 l3 10 h-6" fill="none" {...edge} stroke="#3A3F45" strokeWidth="3" />
        <ellipse cx="34" cy="40" rx="16" ry="6" fill={sp} />
      </g>
    ),
    tester: (
      <g filter={sh}>
        <rect x="30" y="20" width="30" height="46" rx="5" fill={ac} {...edge} />
        <rect x="30" y="20" width="30" height="46" rx="5" fill={kn} opacity="0.6" />
        <rect x="35" y="26" width="20" height="14" rx="2" fill="#1A2B22" {...edge} />
        <rect x="37" y="28" width="16" height="10" rx="1" fill="#7CFF9B" opacity="0.55" />
        <circle cx="40" cy="50" r="3.5" fill={al2} {...edge} />
        <circle cx="50" cy="50" r="3.5" fill={ru} {...edge} />
        <rect x="42" y="66" width="3" height="16" fill={al} {...edge} />
        <rect x="46" y="66" width="3" height="16" fill={ru} {...edge} />
        <rect x="35" y="24" width="20" height="4" rx="2" fill={sp} />
      </g>
    ),
    kit: (
      <g filter={sh}>
        <path d="M16 36 h58 a2 2 0 012 2 v30 a4 4 0 01-4 4 h-54 a4 4 0 01-4-4 v-30 a2 2 0 012-2z" fill={ac} {...edge} />
        <path d="M30 36 v-6 a4 4 0 014-4 h22 a4 4 0 014 4 v6" fill="none" {...edge} stroke="#0A0C0E" strokeWidth="2" />
        <rect x="14" y="46" width="62" height="8" rx="2" fill={al} {...edge} />
        <rect x="14" y="46" width="62" height="8" rx="2" fill={br} />
        <rect x="38" y="38" width="14" height="6" rx="2" fill={al2} {...edge} />
        <rect x="20" y="39" width="52" height="4" rx="2" fill={sp} />
      </g>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", display: "block" }}>
      {defs}
      {bodies[type] || bodies.kit}
    </svg>
  );
});


/* One place that decides photo-vs-icon. Every surface uses this, so
   pasting a URL updates the reveal, the card and the wall at once. */
const ToolArt = memo(function ToolArt({ name, size, color = "#EDEBE6", accent = "#E8B90F", plate = true, style }) {
  const src = photoFor(name);
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    /* Supplier product shots come on white. On a dark UI a bare white
       rectangle reads as a bug, so the photo sits on a light plate and
       becomes a deliberate product card. */
    /* Cutouts are already transparent — they need no plate and no blend
       trick, just a soft contact shadow so they sit in the scene.

       Known cutouts: inline data: URIs, and any file in assets/ (every
       one of those was exported from an embedded cutout, so all 113 have
       a real alpha channel).

       For an EXTERNAL url that is also transparent, tag it with #cutout:
         "Milwaukee Pry Bar": "https://cdn.yoursite.com/prybar.webp#cutout",
       The browser ignores the fragment when fetching, so it costs nothing.
       Leave it off and the photo gets the white product-card treatment,
       which is what a supplier shot on white actually wants. */
    const cutout =
      src.startsWith("data:") || src.startsWith("assets/") || src.includes("#cutout");
    const img = (
      <img
        src={cutout ? src : sizedPhoto(src, Math.round(size * 1.6))}
        alt=""
        draggable={false}
        loading="lazy"
        onError={() => setBroken(true)}
        style={{
          width: "100%", height: "100%", objectFit: "contain", display: "block",
          ...(cutout ? { filter: `drop-shadow(0 ${size * 0.03}px ${size * 0.04}px rgba(0,0,0,0.55))` }
                     : { mixBlendMode: "multiply" }),
        }}
      />
    );
    if (cutout || !plate) return <div style={{ width: size, height: size, ...style }}>{img}</div>;
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.1, padding: size * 0.06,
        background: "linear-gradient(168deg,#FFFFFF 0%,#F1F3F6 62%,#DFE3E9 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 14px rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", ...style,
      }}>
        {img}
      </div>
    );
  }
  return <ToolRender type={iconFor(name)} size={size} accent={accent} />;
});

/* ============================================================
   GARAGE — mounting logic
   Tools are not poured into a uniform grid. Where a tool hangs is
   decided by what it physically is: hand tools go on hooks, power
   tools sit on shelves, and the big floor-standing gear gets a wide
   bay. That is what stops the wall reading as an inventory list.
   ============================================================ */
const MOUNT_FLOOR = /miter saw|table saw|compressor|tool chest|ladder|shop press|drill press|creeper|wheel dolly|cord reel|hose reel|drain cleaner|bottle jack|generator|bench grinder|magnetic drill|concrete saw|packout|rolling tool|jack hammer|mini-puller|rotary laser|work light tripod|miter/i;
const MOUNT_HOOK = /wrench|plier|screwdriver|hammer|knife|torpedo|level set|tape measure|stripper|hex key|magnet|torque|pry bar|axe|detector|extractor|bit set|socket|endoscope|stud finder|multi-tool|caulk|tool belt|apron/i;

const mountFor = (name) =>
  MOUNT_FLOOR.test(name) ? "floor" : MOUNT_HOOK.test(name) ? "hook" : "shelf";

/* brand reads off the front of the product name — the catalog is
   consistently "BRAND Model ..." so this is reliable enough to show. */
const brandOf = (name) => (String(name).trim().split(/\s+/)[0] || "").toUpperCase();

/* Display-name override — VEVOR is a fine SKU on cost, but the name
   doesn't need to carry the brand into the odds list or the reveal
   ceremony. Strips it there only. Everything the name is a KEY for —
   photo lookup, ToolArt icon matching, the garage BRAND field, the
   underlying catalog data — still uses the full original name, so
   sourcing/margin tracking is unaffected. */
const dispName = (n) => (n.startsWith("VEVOR ") ? n.slice(6) : n);

/* Scale: pulled back ~18% from the first pass. Big enough to read at a
   glance, small enough that the wall reads as a showroom rather than a
   stack of oversized inventory cards. */
const ART_SIZE = { floor: 122, shelf: 100, hook: 86 };

/* Deterministic per-slot drop + nudge. Real pegboard is never a perfect
   lattice — hooks land on whatever hole lines up. Index-derived (not
   random) so tiles never jitter between renders. */
const DROP = [0, 17, 7, 22, 4, 13, 26, 9];
const NUDGE = [0, 3, -4, 2, -2, 5, -3, 1];

const GarageTile = memo(function GarageTile({ it, index, isNew, onPick }) {
  const g = GRADE[it.b];
  const mount = mountFor(it.n);
  const rank = RARITIES.indexOf(it.b);
  const elite = rank >= 4;              // legendary / mythic
  const mythic = it.b === "MYTHIC";
  const art = ART_SIZE[mount];

  return (
    <div
      className={`gar-tile${isNew ? " gar-new" : ""}`}
      data-mount={mount}
      style={{
        gridColumn: mount === "floor" ? "span 2" : "span 1",
        animationDelay: `${Math.min(index, 14) * 45}ms`,
        /* organic placement — varied hook height + a hair of side nudge.
           Uses margins, not transform: transform stays free for the hover
           lift and the landing animation (inline styles would beat them). */
        marginTop: DROP[index % DROP.length],
        marginLeft: NUDGE[index % NUDGE.length],
      }}
      onClick={() => onPick(it)}
      role="button"
      aria-label={it.n}
    >
      {/* per-tool spotlight — premium items simply catch more light */}
      <div
        className="gar-spot"
        style={{
          background: `radial-gradient(60% 70% at 50% 0%, ${elite ? g.glow : "rgba(255,246,214,0.30)"} 0%, transparent 72%)`,
          opacity: mythic ? 0.95 : elite ? 0.7 : 0.28,
        }}
      />

      {/* mounting hardware: twin-prong hook for hand tools, bracketed plank otherwise */}
      {mount === "hook" ? (
        <div className="gar-hookWrap">
          <span className="gar-hole" />
          <span className="gar-hole gar-hole2" />
          <span className="gar-hook" />
        </div>
      ) : (
        <span className="gar-holeRow" />
      )}

      <div className="gar-art" style={{ height: art }}>
        {/* soft shadow cast back onto the wall behind the tool */}
        <div className="gar-wallShadow" />
        <div
          className="gar-halo"
          style={{ background: `radial-gradient(circle, ${g.glow} 0%, transparent 68%)`, opacity: elite ? 0.55 : 0.3 }}
        />
        {mythic && <span className="gar-shimmer" />}
        <div className="gar-artInner">
          <ToolArt name={it.n} size={art} accent={g.accent} />
        </div>
      </div>

      {mount === "hook" ? (
        <div className="gar-contact" />
      ) : (
        <div className={`gar-shelf${elite ? " gar-shelfElite" : ""}`}>
          <span className="gar-shelfLip" />
          <span className="gar-shelfFace" />
          <span className="gar-brkL" />
          <span className="gar-brkR" />
        </div>
      )}

      <div className="gar-plate">
        <span className="gar-pip" style={{ background: g.accent, boxShadow: `0 0 8px ${g.glow}` }} />
        <span className="gar-name">{it.n}</span>
      </div>
      <div className="gar-val" style={{ color: elite ? g.accent : "#E9EBEE" }}>{moneyR(it.v)}</div>
    </div>
  );
}, (a, b) => a.it.id === b.it.id && a.isNew === b.isNew && a.index === b.index);

const pull = (items) => {
  const r = Math.random() * 100; let c = 0;
  for (const it of items) { c += it.o; if (r <= c) return it; }
  return items[items.length - 1];
};

/* ---- synthesized SFX ---- */
function useSfx(enabled) {
  const ctx = useRef(null);
  const get = () => {
    if (!ctx.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx.current = new AC();
    }
    if (ctx.current.state === "suspended") ctx.current.resume();
    return ctx.current;
  };
  const noise = (c, dur) => {
    const b = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = b; return s;
  };
  return useCallback((kind) => {
    if (!enabled) return;
    const c = get(); if (!c) return;
    const t = c.currentTime;
    const g = c.createGain(); g.connect(c.destination);
    if (kind === "clunk") {
      const s = noise(c, 0.25);
      const f = c.createBiquadFilter(); f.type = "lowpass";
      f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(120, t + 0.2);
      const o = c.createOscillator(); o.type = "triangle";
      o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.18);
      g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      s.connect(f); f.connect(g); o.connect(g); s.start(t); o.start(t); o.stop(t + 0.28);
    } else if (kind === "settle") {
      const o = c.createOscillator(); o.type = "triangle";
      o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.12);
      g.gain.setValueAtTime(0.14, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.connect(g); o.start(t); o.stop(t + 0.18);
    } else if (kind === "shut") {
      /* lid seating home — felt more than heard */
      const sN = noise(c, 0.1);
      const f = c.createBiquadFilter(); f.type = "lowpass";
      f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(140, t + 0.09);
      const o = c.createOscillator(); o.type = "triangle";
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.1);
      g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      sN.connect(f); f.connect(g); o.connect(g); sN.start(t); o.start(t); o.stop(t + 0.17);
    } else if (kind === "creak") {
      const o = c.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(140, t); o.frequency.linearRampToValueAtTime(320, t + 1.2);
      const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 800; f.Q.value = 9;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.09, t + 0.35); g.gain.linearRampToValueAtTime(0.0001, t + 1.3);
      o.connect(f); f.connect(g); o.start(t); o.stop(t + 1.4);
    } else if (kind === "rumble") {
      const s = noise(c, 1.6);
      const f = c.createBiquadFilter(); f.type = "lowpass";
      f.frequency.setValueAtTime(90, t); f.frequency.linearRampToValueAtTime(280, t + 1.4);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.32, t + 1.3); g.gain.linearRampToValueAtTime(0.0001, t + 1.6);
      s.connect(f); f.connect(g); s.start(t);
    } else if (kind === "burst") {
      const s = noise(c, 0.9);
      const f = c.createBiquadFilter(); f.type = "highpass";
      f.frequency.setValueAtTime(200, t); f.frequency.exponentialRampToValueAtTime(3800, t + 0.5);
      const o = c.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(35, t + 0.5);
      const og = c.createGain(); og.gain.setValueAtTime(0.55, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      g.gain.setValueAtTime(0.42, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
      s.connect(f); f.connect(g); o.connect(og); og.connect(c.destination);
      s.start(t); o.start(t); o.stop(t + 0.6);
    } else if (kind === "chime") {
      [880, 1320, 1760].forEach((hz, i) => {
        const o = c.createOscillator(); o.type = "sine"; o.frequency.value = hz;
        const gg = c.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.06);
        gg.gain.linearRampToValueAtTime(0.15, t + i * 0.06 + 0.02);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.06 + 1.1);
        o.connect(gg); gg.connect(c.destination); o.start(t + i * 0.06); o.stop(t + i * 0.06 + 1.2);
      });
    } else if (kind === "slide") {
      const s = noise(c, 0.09);
      const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2600; f.Q.value = 2;
      g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      s.connect(f); f.connect(g); s.start(t);
    } else if (kind === "lift") {
      const o = c.createOscillator(); o.type = "triangle";
      o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(520, t + 0.22);
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); o.start(t); o.stop(t + 0.32);
    } else if (kind === "stingLow" || kind === "stingMid" || kind === "stingBig") {
      const tier = kind === "stingBig" ? 3 : kind === "stingMid" ? 2 : 1;
      const s = noise(c, 0.12);
      const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1200;
      const sg = c.createGain(); sg.gain.setValueAtTime(0.18 + tier * 0.06, t); sg.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
      s.connect(hp); hp.connect(sg); sg.connect(c.destination); s.start(t);
      const roots = [196, 262, 330];
      const chords = { 1: [roots[0], roots[1]], 2: [roots[0], roots[1], roots[2]], 3: [roots[0], roots[1], roots[2], roots[2] * 1.5] };
      const dur = 0.4 + tier * 0.35;
      chords[tier].forEach((hz, i) => {
        const o = c.createOscillator(); o.type = tier === 3 ? "sawtooth" : "triangle";
        o.frequency.setValueAtTime(hz, t);
        if (tier === 3) o.frequency.exponentialRampToValueAtTime(hz * 1.5, t + dur);
        const og = c.createGain();
        og.gain.setValueAtTime(0.0001, t + i * 0.04);
        og.gain.linearRampToValueAtTime(0.11 + tier * 0.02, t + i * 0.04 + 0.03);
        og.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900 + tier * 700;
        o.connect(f); f.connect(og); og.connect(c.destination);
        o.start(t + i * 0.04); o.stop(t + dur + 0.1);
      });
    }
  }, [enabled]);
}

/* ============================================================
   CRATE — v10 construction + optional glint sweep (v11)
   ============================================================ */
const Crate = memo(function Crate({ tier, uid, size = 260, grade = null, lid = 0, latch = 0, glowing = 0, sheen = false,
                                    gesture = false, lidRef = null, bodyRef = null, interiorRef = null, shadowRef = null, crateRef = null }) {
  const P = tier.pal;
  const w = size, h = size * 0.78;
  const gd = grade ? GRADE[grade] : null;
  const stripe = gd ? gd.accent : tier.accent;
  const guardY = P.guard === "yellow";
  const g1 = guardY ? "#FFDE5C" : "#7C858F";
  const g2 = guardY ? "#F0BE14" : "#4B535C";
  const g3 = guardY ? "#B8890A" : "#2A3037";
  const gStroke = guardY ? "#8F6C06" : "#191D22";
  const gl = Number(glowing) || 0;
  const id = (s) => `${s}-${uid}`;

  return (
    <div ref={crateRef} style={{ position: "relative", width: w, height: h, perspective: 900,
                                 transformStyle: "preserve-3d", willChange: "transform" }}>
      <svg ref={shadowRef} style={{ position: "absolute", left: "50%", bottom: -h * 0.05, transform: "translateX(-50%)", zIndex: 0, willChange: "transform, opacity" }} width={w * 0.94} height={h * 0.16} viewBox="0 0 200 30">
        <defs>
          <radialGradient id={id("sh")} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.66)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="15" rx="96" ry="13" fill={`url(#${id("sh")})`} />
      </svg>

      {/* halo — TIER accent until the crate learns its grade, rarity glow after.
          `glowing` is a level (0..1) so the pre-commit state can sit softer. */}
      <div style={{
        position: "absolute", left: "50%", top: "28%", transform: "translate(-50%,-50%)", zIndex: 1,
        width: gl ? w * 1.7 : 0, height: gl ? w * 1.7 : 0, opacity: gl,
        background: `radial-gradient(circle, ${gd ? gd.glow : tier.accent} 0%, transparent 60%)`,
        transition: "width .7s ease, height .7s ease, opacity .7s ease", pointerEvents: "none",
      }} />

      {/* INTERIOR — the cavity. Hidden behind the closed lid; fades and
          lifts into view as the opening angle grows. */}
      <div ref={interiorRef} style={{
        position: "absolute", left: "11.3%", top: "30%", width: "77.4%", height: "18%",
        zIndex: 2, opacity: 0, pointerEvents: "none", willChange: "opacity, transform",
      }}>
        <svg width="100%" height="100%" viewBox="0 0 232 42" preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id={id("cav")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#02040A" />
              <stop offset="55%" stopColor="#0A0F17" />
              <stop offset="100%" stopColor="#151B24" />
            </linearGradient>
            <linearGradient id={id("cavl")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gd ? gd.accent : "rgba(255,241,204,0.9)"} stopOpacity="0.55" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {/* cavity box */}
          <rect x="0" y="6" width="232" height="36" fill={`url(#${id("cav")})`} />
          {/* back wall catching light */}
          <rect x="8" y="8" width="216" height="12" fill={`url(#${id("cavl")})`} opacity="0.5" />
          {/* rim light on the front lip */}
          <rect x="0" y="6" width="232" height="1.6" fill={P.rim} opacity="0.8" />
          {/* contents — tool silhouettes packed in foam */}
          <g opacity="0.9">
            <rect x="18" y="18" width="52" height="9" rx="2" fill="#232A33" />
            <rect x="18" y="18" width="52" height="2.4" rx="1.2" fill="#39424E" />
            <rect x="78" y="16" width="34" height="13" rx="2" fill="#1E252E" />
            <rect x="78" y="16" width="34" height="2.4" rx="1.2" fill="#333C47" />
            <circle cx="136" cy="23" r="8" fill="#232A33" />
            <circle cx="136" cy="23" r="3.2" fill="#0D1117" />
            <rect x="154" y="17" width="60" height="11" rx="2" fill="#1E252E" />
            <rect x="154" y="17" width="60" height="2.4" rx="1.2" fill="#333C47" />
          </g>
          {/* inner glow spilling out of the box */}
          <rect x="0" y="6" width="232" height="20" fill={gd ? gd.accent : "#FFF1CC"} opacity="0.13" />
        </svg>
      </div>

      {/* LID lifts straight up and fades on open — no hinge. The old static
          rear-wall panel and hinge barrels that used to fill the gap behind a
          swinging lid have been removed; they served no purpose once the lid
          rises off the box, and the rear wall was the black slab above the box. */}

      {/* ============ HINGE PIVOT ============
          This node IS the hinge. Its transform-origin is the hinge axis and
          it is the ONLY node in the crate that is ever transformed during
          opening — and the only transform it may ever receive is rotateX.

          INVARIANTS (do not break):
            · never translate this node       — the hinge would move
            · never scale this node           — the lid would change size
            · never transform its children    — the mesh would deform
            · never transform the crate root  — it carries `perspective`, so
                                                animating it re-projects the
                                                lid relative to the body

          Its two children are the lid's outer and inner faces, both pinned
          at inset:0. They carry no animation of their own, so the lid is a
          rigid mesh rigidly parented to the hinge. */}
      <div ref={lidRef} style={{
        position: "absolute", left: 0, top: 0, width: "100%", height: "43%",
        zIndex: 3, willChange: "transform, opacity",
        ...(gesture ? { transition: "none" }
                    : { /* simple lift & fade — the lid rises straight up off the
                           box and fades. No rotation: nothing to flare or detach.
                           `lid` runs 0..104, normalize to progress. */
                        transform: `translateY(${-(lid / 104) * (h * 0.42)}px)`,
                        opacity: 1 - Math.min(1, Math.max(0, ((lid / 104) - 0.15) / 0.7)),
                        transition: "transform .5s cubic-bezier(.33,0,.15,1), opacity .5s ease" }),
      }}>
        {/* UNDERSIDE — plain pressed steel, warm cavity light catching its
            lip. Deliberately unmarked: it must read identical for every crate. */}
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id={id("us")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#232830" /><stop offset="55%" stopColor="#151A21" /><stop offset="100%" stopColor="#0B0E13" />
              </linearGradient>
            </defs>
            <path d="M 52 74 L 248 74 L 272 48 L 28 48 Z" fill={`url(#${id("us")})`} />
            <rect x="28" y="6" width="244" height="42" rx="5" fill={`url(#${id("us")})`} />
            {/* stiffening ribs */}
            <rect x="44" y="14" width="212" height="1.4" fill="rgba(255,255,255,0.05)" />
            <rect x="44" y="30" width="212" height="1.4" fill="rgba(255,255,255,0.05)" />
            {/* cavity light licking the lip */}
            <rect x="28" y="44" width="244" height="4" fill="#FFE9B8" opacity="0.22" />
            <path d="M 52 74 L 248 74 L 272 48 L 28 48 Z" fill="#FFE9B8" opacity="0.07" />
          </svg>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
        <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none" style={{ overflow: "hidden" }}>
          <defs>
            <pattern id={id("dp")} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="skewX(-24) scale(1,0.6)">
              <rect width="14" height="14" fill={P.plateA} />
              <path d="M3 7l4-4 4 4-4 4z" fill={P.plateB} />
              <path d="M3 7l4-4 4 4" fill="none" stroke={P.plateC} strokeWidth="0.8" />
              <path d="M3 7l4 4 4-4" fill="none" stroke={P.plateD} strokeWidth="0.8" />
            </pattern>
            <linearGradient id={id("lt")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.07)" />
              <stop offset="100%" stopColor="rgba(4,8,14,0.55)" />
            </linearGradient>
            <linearGradient id={id("lf")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={P.hi} /><stop offset="26%" stopColor={P.mid} />
              <stop offset="82%" stopColor={P.dk} /><stop offset="100%" stopColor={P.deep} />
            </linearGradient>
            <linearGradient id={id("st")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E9EDF2" /><stop offset="45%" stopColor="#9AA6B4" />
              <stop offset="55%" stopColor="#788595" /><stop offset="100%" stopColor="#C4CDD8" />
            </linearGradient>
            <linearGradient id={id("sw")} x1="0" y1="0" x2="1" y2="0.6">
              <stop offset="0%" stopColor="rgba(255,255,255,0.46)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id={id("gg")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={g1} /><stop offset="50%" stopColor={g2} /><stop offset="100%" stopColor={g3} />
            </linearGradient>
            <linearGradient id={id("gl")} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          <path d="M 52 26 L 248 26 L 272 52 L 28 52 Z" fill={`url(#${id("dp")})`} />
          <path d="M 52 26 L 248 26 L 272 52 L 28 52 Z" fill={`url(#${id("lt")})`} />
          <path d="M 52 26 L 248 26" stroke={P.rim} strokeWidth="2" strokeLinecap="round" />
          <path d="M 53 27.6 L 247 27.6" stroke="rgba(0,0,0,0.35)" strokeWidth="0.9" strokeLinecap="round" />

          {[92, 150, 208].map((x) => (
            <g key={x}>
              <rect x={x - 8} y="22.4" width="16" height="7.2" rx="3.6" fill={`url(#${id("st")})`} stroke="#2E353E" strokeWidth="0.8" />
              <rect x={x - 8} y="23.6" width="16" height="1.6" rx="0.8" fill="rgba(255,255,255,0.5)" />
              <circle cx={x - 8} cy="26" r="1.6" fill="#39414C" />
              <circle cx={x + 8} cy="26" r="1.6" fill="#39414C" />
              <circle cx={x - 8.4} cy="25.5" r="0.7" fill="#B8C2CD" />
              <circle cx={x + 7.6} cy="25.5" r="0.7" fill="#B8C2CD" />
            </g>
          ))}

          <rect x="106" y="24.5" width="14" height="5" rx="2" fill={`url(#${id("st")})`} stroke="#39414C" strokeWidth="0.7" />
          <rect x="180" y="24.5" width="14" height="5" rx="2" fill={`url(#${id("st")})`} stroke="#39414C" strokeWidth="0.7" />
          <rect x="112" y="8" width="9" height="20" rx="3" fill={`url(#${id("st")})`} stroke="#39414C" strokeWidth="0.8" />
          <rect x="179" y="8" width="9" height="20" rx="3" fill={`url(#${id("st")})`} stroke="#39414C" strokeWidth="0.8" />
          <circle cx="116.5" cy="26.5" r="2.2" fill="#39414C" />
          <circle cx="183.5" cy="26.5" r="2.2" fill="#39414C" />
          <rect x="104" y="1" width="92" height="13" rx="6.5" fill="#1B1E23" stroke="#0B0D10" strokeWidth="1" />
          <rect x="108" y="3" width="84" height="4" rx="2" fill="rgba(255,255,255,0.22)" />
          {[118, 130, 142, 154, 166, 178].map((x) => <rect key={x} x={x} y="2.5" width="2.4" height="10" rx="1.2" fill="rgba(0,0,0,0.42)" />)}

          <rect x="28" y="52" width="244" height="42" rx="5" fill={`url(#${id("lf")})`} />
          <rect x="28" y="52" width="244" height="3.5" fill={P.rim} />
          <rect x="28" y="55.5" width="244" height="1.2" fill="rgba(0,0,0,0.3)" />
          <rect x="28" y="62" width="244" height="7" fill={stripe} opacity="0.92" />
          <rect x="28" y="62" width="244" height="2" fill="rgba(255,255,255,0.35)" />
          <rect x="34" y="78" width="232" height="1.1" fill={P.seam} />
          <rect x="34" y="79.1" width="232" height="1.1" fill={P.seamHi} />
          <rect x="29.5" y="54" width="1" height="38" fill="rgba(255,255,255,0.12)" />
          <rect x="269.5" y="54" width="1" height="38" fill="rgba(0,0,0,0.25)" />
          {/* no text on the crate — the lid stays clean metal */}
          <path d="M 28 52 h 26 v 8 h -18 v 26 h -8 z" fill={`url(#${id("gg")})`} stroke={gStroke} strokeWidth="0.8" />
          <path d="M 272 52 h -26 v 8 h 18 v 26 h 8 z" fill={`url(#${id("gg")})`} stroke={gStroke} strokeWidth="0.8" />
          {[[36, 57], [47, 57], [33, 74], [264, 57], [253, 57], [267, 74]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="2.3" fill="rgba(0,0,0,0.45)" />
              <circle cx={x} cy={y} r="1.9" fill={gStroke} />
              <circle cx={x - 0.55} cy={y - 0.65} r="1" fill={guardY ? "#FFE896" : "#A9B2BC"} />
            </g>
          ))}
          <rect x="28" y="91" width="244" height="3.5" rx="1.5" fill="rgba(0,0,0,0.55)" />
          <path d="M 52 26 L 128 26 L 78 94 L 28 94 L 28 52 Z" fill={`url(#${id("sw")})`} opacity={P.gloss + 0.16} />
          {/* glint sweep — only when this crate is the centered subject */}
          {sheen && <rect className="glint" x="-70" y="0" width="56" height="100" fill={`url(#${id("gl")})`} transform="skewX(-16)" style={{ mixBlendMode: "screen" }} />}
        </svg>
        </div>
      </div>

      {/* BODY */}
      <div ref={bodyRef} style={{ position: "absolute", left: 0, top: "39.5%", width: "100%", height: "60.5%", zIndex: 2,
                                  transformOrigin: "50% 100%", willChange: "transform" }}>
        <svg width="100%" height="100%" viewBox="0 0 300 118" preserveAspectRatio="none" style={{ overflow: "hidden" }}>
          <defs>
            <linearGradient id={id("bf")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={P.hi} /><stop offset="20%" stopColor={P.mid} />
              <stop offset="76%" stopColor={P.dk} /><stop offset="100%" stopColor={P.deep} />
            </linearGradient>
            <linearGradient id={id("bs")} x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%" stopColor="rgba(255,255,255,0.26)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.03)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id={id("st2")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E9EDF2" /><stop offset="45%" stopColor="#9AA6B4" />
              <stop offset="55%" stopColor="#788595" /><stop offset="100%" stopColor="#C4CDD8" />
            </linearGradient>
            <linearGradient id={id("gg2")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={g1} /><stop offset="50%" stopColor={g2} /><stop offset="100%" stopColor={g3} />
            </linearGradient>
            <linearGradient id={id("ly")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE873" /><stop offset="55%" stopColor="#E8B90F" /><stop offset="100%" stopColor="#A87E08" />
            </linearGradient>
            <linearGradient id={id("streak")} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="46%" stopColor={`rgba(255,255,255,${P.gloss * 0.5})`} />
              <stop offset="54%" stopColor={`rgba(255,255,255,${P.gloss * 0.5})`} />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id={id("gl2")} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <pattern id={id("br")} width="300" height="4" patternUnits="userSpaceOnUse">
              <rect width="300" height="4" fill="transparent" />
              <line x1="0" y1="1" x2="300" y2="1" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
              <line x1="0" y1="3" x2="300" y2="3" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
            </pattern>
          </defs>

          <rect x="34" y="0" width="232" height="14" fill="#05080D" />
          <rect x="28" y="8" width="244" height="92" rx="6" fill={`url(#${id("bf")})`} />
          <rect x="28" y="8" width="244" height="92" rx="6" fill={`url(#${id("br")})`} />
          <rect x="30" y="8" width="240" height="2.8" rx="1.4" fill={P.rim} />
          <rect x="30" y="10.8" width="240" height="1" fill="rgba(0,0,0,0.3)" />
          <path d="M 96 8 L 144 8 L 108 100 L 66 100 Z" fill={`url(#${id("streak")})`} />
          {[110, 190].map((x) => (
            <g key={x}>
              <rect x={x} y="16" width="1.1" height="66" fill={P.seam} />
              <rect x={x + 1.1} y="16" width="1.1" height="66" fill={P.seamHi} />
            </g>
          ))}
          <rect x="28" y="84" width="244" height="12" fill={`url(#${id("st2")})`} />
          <rect x="28" y="84" width="244" height="1.6" fill="rgba(0,0,0,0.4)" />
          <rect x="28" y="94.4" width="244" height="1.2" fill="rgba(255,255,255,0.14)" />

          {[[76, 1], [200, 2]].map(([x, order]) => {
            const popped = latch >= order;
            return (
              <g key={x}>
                <rect x={x + 6} y="1" width="14" height="7" rx="1.5" fill={`url(#${id("st2")})`} stroke="#252B33" strokeWidth="0.7" />
                <rect x={x + 8} y="2.4" width="10" height="1.4" rx="0.7" fill="rgba(255,255,255,0.4)" />
                <rect x={x - 2} y="15" width="30" height="17" rx="3" fill={`url(#${id("st2")})`} stroke="#252B33" strokeWidth="0.8" />
                <circle cx={x + 0.6} cy="17.8" r="1.3" fill="#39414C" />
                <circle cx={x + 25.4} cy="17.8" r="1.3" fill="#39414C" />
                <circle cx={x + 0.6} cy="29.2" r="1.3" fill="#39414C" />
                <circle cx={x + 25.4} cy="29.2" r="1.3" fill="#39414C" />
                <g style={{
                  transform: popped ? "translateY(5px) rotate(9deg)" : "none",
                  transformOrigin: `${x + 13}px 30px`,
                  transition: "transform .4s cubic-bezier(.2,1.6,.4,1)",
                }}>
                  <path d={`M ${x + 8} ${popped ? 12 : 7} q 5 -3 10 0 L ${x + 18} 16 L ${x + 8} 16 Z`}
                    fill="none" stroke="#8A939E" strokeWidth="1.6" strokeLinecap="round" />
                  <rect x={x} y="9" width="26" height="20" rx="4" fill={`url(#${id("ly")})`} stroke="#8F6C06" strokeWidth="1" />
                  <rect x={x + 3} y="11.5" width="20" height="6.5" rx="2.2" fill="#FFF3BC" opacity="0.85" />
                  <rect x={x + 6} y="20" width="14" height="6" rx="2" fill="#39414C" />
                  <rect x={x + 6} y="20" width="14" height="2.2" rx="1" fill="#6E7885" />
                </g>
              </g>
            );
          })}

          <rect x="134" y="4" width="32" height="18" rx="3" fill={`url(#${id("st2")})`} stroke="#39414C" strokeWidth="0.9" />
          <circle cx="150" cy="13" r="3.4" fill="#0F1216" />
          <circle cx="150" cy="12.2" r="1.2" fill="#3A424D" />

          <rect x="118" y="40" width="64" height="18" rx="3" fill="rgba(6,10,16,0.55)" stroke={stripe} strokeWidth="1.4" />
          <rect x="122" y="43" width="56" height="1.2" rx="0.6" fill="rgba(255,255,255,0.12)" />
          <circle cx="124" cy="53" r="1.4" fill={stripe} opacity="0.5" />
          <circle cx="176" cy="53" r="1.4" fill={stripe} opacity="0.5" />

          <path d="M 28 100 v -30 h 8 v 22 h 18 v 8 z" fill={`url(#${id("gg2")})`} stroke={gStroke} strokeWidth="0.8" />
          <path d="M 272 100 v -30 h -8 v 22 h -18 v 8 z" fill={`url(#${id("gg2")})`} stroke={gStroke} strokeWidth="0.8" />
          {[[32, 76], [32, 88], [46, 96], [268, 76], [268, 88], [254, 96]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="2.3" fill="rgba(0,0,0,0.45)" />
              <circle cx={x} cy={y} r="1.9" fill={gStroke} />
              <circle cx={x - 0.55} cy={y - 0.65} r="1" fill={guardY ? "#FFE896" : "#A9B2BC"} />
            </g>
          ))}
          {[64, 114, 186, 236].map((x) => (
            <g key={x}><circle cx={x} cy="14" r="1.9" fill="rgba(0,0,0,0.4)" /><circle cx={x - 0.4} cy="13.4" r="1" fill="rgba(220,234,252,0.45)" /></g>
          ))}
          <path d="M 28 60 q 0 40 30 40 L 28 100 Z" fill="rgba(0,0,0,0.25)" />
          <path d="M 272 60 q 0 40 -30 40 L 272 100 Z" fill="rgba(0,0,0,0.25)" />
          <path d="M 28 8 L 96 8 L 52 100 L 28 100 Z" fill={`url(#${id("bs")})`} />
          {sheen && <rect className="glint" x="-70" y="0" width="56" height="118" fill={`url(#${id("gl2")})`} transform="skewX(-16)" style={{ mixBlendMode: "screen" }} />}
          <rect x="44" y="98" width="42" height="10" rx="4" fill="#0B0D11" />
          <rect x="214" y="98" width="42" height="10" rx="4" fill="#0B0D11" />
          <rect x="44" y="98" width="42" height="2.6" rx="1.3" fill="rgba(255,255,255,0.08)" />
          <rect x="214" y="98" width="42" height="2.6" rx="1.3" fill="rgba(255,255,255,0.08)" />
        </svg>
      </div>
    </div>
  );
});

/* ============================================================
   CAROUSEL — unchanged mechanics.
   ============================================================ */
function Loop({ count, index, setIndex, sfx, step = 250, render, onCenterTap, locked = false, loop = true, paged = false, height, marginTop }) {
  const [pos, setPos] = useState(index);
  /* settled = at rest on a whole index. Drives the landing grow. */
  const [settled, setSettled] = useState(true);
  const wrapRef = useRef(null);
  const posRef = useRef(index);
  const raf = useRef(null);
  const lastTick = useRef(Math.round(index));
  const st = useRef({ down: false, x0: 0, last: 0, lastT: 0, v: 0, moved: false, start: 0 });

  const write = (p) => { posRef.current = p; setPos(p); };
  const stop = () => { if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; } };
  useEffect(() => stop, []);

  const tick = (p) => {
    const r = Math.round(p);
    if (r !== lastTick.current) { lastTick.current = r; sfx("slide"); }
  };

  const snapTo = (target) => {
    stop();
    const t = loop ? target : Math.max(0, Math.min(count - 1, target));
    const from = posRef.current;
    if (Math.abs(t - from) < 0.0005) { write(t); setIndex(t); setSettled(true); return; }
    const t0 = performance.now(), DUR = 300;
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const frame = () => {
      const k = Math.min((performance.now() - t0) / DUR, 1);
      const p = from + (t - from) * ease(k);
      write(p); tick(p);
      if (k < 1) raf.current = requestAnimationFrame(frame);
      else { raf.current = null; write(t); setIndex(t); setSettled(true); }
    };
    raf.current = requestAnimationFrame(frame);
  };

  const coast = (v0) => {
    stop();
    let v = v0, last = performance.now();
    const DRAG = 0.0042;
    const frame = () => {
      const now = performance.now();
      const dt = Math.min(now - last, 32); last = now;
      v *= Math.exp(-DRAG * dt);
      let p = posRef.current + v * dt;
      if (!loop) {
        if (p < 0) { p = 0; v = 0; }
        if (p > count - 1) { p = count - 1; v = 0; }
      }
      write(p); tick(p);
      if (Math.abs(v) < 0.00045) { snapTo(Math.round(p)); return; }
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  };

  const down = (e) => {
    if (locked) return;
    stop();
    setSettled(false);
    const now = performance.now();
    st.current = { down: true, x0: e.clientX, last: e.clientX, lastT: now, v: 0, moved: false, start: posRef.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    if (!st.current.down) return;
    const dx = e.clientX - st.current.x0;
    if (Math.abs(dx) > 5) st.current.moved = true;
    let p = st.current.start - dx / step;
    if (!loop) {
      if (p < 0) p *= 0.35;
      else if (p > count - 1) p = (count - 1) + (p - (count - 1)) * 0.35;
    }
    const now = performance.now();
    const dt = Math.max(now - st.current.lastT, 1);
    st.current.v = -((e.clientX - st.current.last) / step) / dt;
    st.current.last = e.clientX; st.current.lastT = now;
    write(p); tick(p);
  };
  const up = (e) => {
    if (!st.current.down) return;
    st.current.down = false;
    const v = st.current.v;

    /* TAP — pointer went down and up without travelling. Pointer capture
       swallows the child's click event, so resolve the tap here from the
       release position: which crate was under the finger/cursor? */
    if (!st.current.moved) {
      const box = wrapRef.current?.getBoundingClientRect();
      const x = e && typeof e.clientX === "number" ? e.clientX : null;
      if (box && x !== null) {
        const cellsFromCentre = Math.round((x - (box.left + box.width / 2)) / step);
        const target = Math.round(posRef.current) + cellsFromCentre;
        const inRange = loop || (target >= 0 && target <= count - 1);
        if (cellsFromCentre === 0) { snapTo(Math.round(posRef.current)); if (onCenterTap) onCenterTap(); }
        else if (inRange) snapTo(target);
        else snapTo(Math.round(posRef.current));
        return;
      }
    }
    if (paged) {
      /* one crate per gesture — no momentum, no flying past. A flick or a
         drag past a third of a slot advances exactly one step; anything
         less returns to where it started. */
      const from = st.current.start;
      const moved = posRef.current - from;
      let target = from;
      if (Math.abs(v) > 0.0011) target = from + (v > 0 ? 1 : -1);
      else if (Math.abs(moved) > 0.34) target = from + (moved > 0 ? 1 : -1);
      snapTo(Math.round(target));
      return;
    }
    if (Math.abs(v) > 0.0009) coast(v);
    else snapTo(Math.round(posRef.current));
  };

  const cells = [];
  const base = Math.round(pos);
  const lo = loop ? base - 3 : Math.max(0, base - 3);
  const hi = loop ? base + 3 : Math.min(count - 1, base + 3);
  for (let i = lo; i <= hi; i++) {
    const off = i - pos, a = Math.abs(off);
    if (a > 2.6) continue;
    cells.push({ i, off, a });
  }

  return (
    <div ref={wrapRef} style={{
      ...S.loop,
      ...(height != null ? { height } : null),
      ...(marginTop != null ? { marginTop } : null),
    }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      {cells.map(({ i, off, a }) => (
        <div key={i}
          style={{
            position: "absolute", left: "50%", top: "50%",
            transform: `translate(-50%,-50%) translateX(${off * step}px) translateY(${Math.min(a, 2) * 13}px) scale(${1 - Math.min(a, 2) * 0.2})`,
            zIndex: 20 - Math.round(a * 10),
            opacity: 1 - Math.min(a, 2) * 0.4,
            filter: `blur(${Math.min(a, 2) * 1.8}px) brightness(${1 - Math.min(a, 2) * 0.26})`,
            cursor: locked ? "default" : "pointer",
            pointerEvents: a > 1.6 ? "none" : "auto",
            touchAction: "pan-y",
            willChange: "transform",
          }}>
          {render(i, a, settled && a < 0.05)}
        </div>
      ))}
    </div>
  );
}

/* ---- bottom nav glyphs ---- */
function NavIcon({ kind, color }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "crates") return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path {...p} d="M3.5 9.5h17v10h-17z" /><path {...p} d="M5.5 9.5v-3h13v3" /><path {...p} d="M3.5 13.5h17" /><path {...p} d="M10 12h4v3h-4z" />
    </svg>
  );
  if (kind === "garage") return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path {...p} d="M4 20V9l8-5 8 5v11" /><path {...p} d="M8 20v-7h8v7" /><path {...p} d="M8 16h8" />
    </svg>
  );
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle {...p} cx="12" cy="8.5" r="3.5" /><path {...p} d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
    </svg>
  );
}

/* ================= App ================= */
/* The home stage was sized for a phone held upright. On a laptop the browser
   chrome eats enough height that the crate, the tier block and the CTA stop
   fitting together, so the header scrolls away and the crate clips against the
   top edge. Rather than let the page scroll, the stage scales to whatever
   height is actually there: full phone-sized design at 780px+, easing down to
   0.76 on short windows so the whole composition stays on one screen. */
function useStageFit() {
  const read = () => (typeof window === "undefined" ? 900 : window.innerHeight);
  const [h, setH] = useState(read);
  useEffect(() => {
    const on = () => setH(read());
    window.addEventListener("resize", on);
    window.addEventListener("orientationchange", on);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("orientationchange", on);
    };
  }, []);
  return Math.max(0.76, Math.min(1, (h - 150) / 630));
}

function ToolCrate() {
  const fit = useStageFit();
  const [credits, setCredits] = useState(500);
  const [screen, setScreen] = useState("home");   // home | garage | profile | odds | pick | stage | reveal
  const [tierI, setTierI] = useState(0);
  const [pulled, setPulled] = useState(null);
  const [pullId, setPullId] = useState(0);
  const [garage, setGarage] = useState([]);
  const [sound, setSound] = useState(true);
  const sfx = useSfx(sound);

  const [oddsTier, setOddsTier] = useState("starter");
  const [rackI, setRackI] = useState(0);
  const [taken, setTaken] = useState(false);

  const [stage, setStage] = useState(0);
  const [lid, setLid] = useState(0);
  const [latch, setLatch] = useState(0);
  const [showIcon, setShowIcon] = useState(false);
  const [dim, setDim] = useState(0);
  /* Cinematic channels. These replace the old shake / white-flash / colour
     column entirely — the drama now comes from light building, not from
     the screen being hit with saturation. */
  const [seam, setSeam] = useState(0);      // light escaping the lid seam, 0..1
  const [bloom, setBloom] = useState(0);    // interior bloom, brightest inside
  const [camPush, setCamPush] = useState(0);// slow push-in, 0..1
  const [phase, setPhase] = useState("idle"); // idle|armed|locked|opening|risen
  const [shake, setShake] = useState("");     // crate shake as the lid comes off

  /* ---- gesture-driven lid ----
     The lid is animated IMPERATIVELY: pointermove and the release
     spring write transforms straight to the DOM every frame, so the
     352px crate SVG never re-renders mid-gesture. React state is only
     touched at discrete events (latch pops, threshold crossed). That
     is what keeps this at 60fps. */
  const [armed, setArmed] = useState(false);      // lid is grabbable
  const [gesture, setGesture] = useState(false);  // imperative mode on
  const [dragging, setDragging] = useState(false);
  const lidEl = useRef(null), bodyEl = useRef(null), intEl = useRef(null), shadowEl = useRef(null), crateEl = useRef(null);
  const raf = useRef(null);
  const swipe = useRef({ down: false, y0: 0, yLast: 0, tLast: 0, startP: 0, p: 0, v: 0,
                         l1: false, l2: false, crk: false, done: false });

  const timers = useRef([]);

  const tIdx = mod(tierI, TIERS.length);
  const tier = TIERS[tIdx];
  const tStats = tierStats(tier.id);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  const resetCeremony = () => {
    setStage(0); setLid(0); setLatch(0); setShowIcon(false);
    setDim(0); setTaken(false);
    setSeam(0); setBloom(0); setCamPush(0); setPhase("idle"); setShake("");
    setArmed(false); setDragging(false); setGesture(false);
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
    for (const el of [lidEl, bodyEl, intEl, shadowEl, crateEl]) {
      if (el.current) { el.current.style.transform = ""; el.current.style.opacity = ""; el.current.style.transition = ""; }
    }
    swipe.current = { down: false, y0: 0, yLast: 0, tLast: 0, startP: 0, p: 0, v: 0,
                      l1: false, l2: false, crk: false, done: false };
  };

  const buy = () => {
    if (!tier.live || credits < tier.price) return;
    clear();
    setCredits((c) => c - tier.price);
    setPulled(pull(CATALOG[tier.id]));  // outcome locked here — everything after is theater
    setPullId((n) => n + 1);
    setRackI(0);
    resetCeremony();
    setScreen("pick");
  };

  /* pick a crate off the rack → move to the stage and ARM the swipe */
  const pickCrate = () => {
    if (taken) return;
    setTaken(true);
    setGesture(true);      // from this moment the crate renders rarity-blind
    sfx("lift");
    at(600, () => setScreen("stage"));
    at(850, () => { setStage(1); setDim(1); });
    at(1400, () => setArmed(true));                          // lid becomes grabbable
  };

  /* ---- LID PHYSICS ----
     TWO RIGID MESHES, ONE FIXED HINGE.

     p = 0 closed … 1 fully open. This function writes exactly ONE transform:
     a rotation of the hinge pivot. Nothing else in the crate is ever
     transformed while opening.

     What used to be here and why it was wrong:
       · crateEl got rotateX/rotateZ/translateY. That node is the PARENT of
         both meshes and carries `perspective: 900`, so animating it re-
         projected the lid relative to the body every frame — the hinge
         appeared to drift and the box appeared to change shape.
       · bodyEl got translateY + scaleY/scaleX ("settle and squash"), which
         pulled the base away from the lid.
       · shadowEl got scaleX/scaleY.
       · intEl got translateY.
     All of that is gone. The base is immovable; the lid only ever rotates. */
  const LID_OPEN = 104;                 // kept as the normalization ceiling so
                                        // every existing setLid(...) call still
                                        // maps cleanly to progress 0..1
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  /* ceremony crate renders at size 352; the lid band is 42% of h (=size*0.78),
     so a full lift ≈ 352*0.78*0.42 ≈ 115px. Explicit constant because the
     crate's internal `h` isn't in scope here. */
  const LID_LIFT = 352 * 0.78 * 0.42;

  /* ---- SIMPLE OPEN: lift & fade ----
     The 3D-hinge lid is gone. A flat 2D card can't be rotated in perspective
     without the painted 3/4 view fighting the rotation (that was the flare/
     stretch). So the lid no longer rotates at all: it lifts straight up off
     the box and fades out while the interior lights up. Pure translate +
     opacity — geometrically impossible to flare, stretch, or detach, and it
     reads clearly as the box opening. */
  const applyLid = (p) => {
    const a = clamp01(p);
    if (lidEl.current) {
      lidEl.current.style.transform = `translateY(${-a * LID_LIFT}px)`;
      lidEl.current.style.opacity = String(1 - clamp01((a - 0.15) / 0.7));
    }
    if (intEl.current) {
      intEl.current.style.opacity = String(clamp01((p - 0.02) / 0.4));
    }
  };

  /* discrete mechanical events — fire once per threshold crossing, both directions */
  const lidEvents = (p) => {
    const s = swipe.current;
    if (!s.l1 && p > 0.16) { s.l1 = true; setLatch(1); sfx("clunk"); }
    if (s.l1 && p < 0.11)  { s.l1 = false; setLatch(0); sfx("clunk"); }
    if (!s.l2 && p > 0.30) { s.l2 = true; setLatch(2); sfx("clunk"); }
    if (s.l2 && p < 0.24)  { s.l2 = false; setLatch(1); sfx("clunk"); }
    if (!s.crk && p > 0.42) { s.crk = true; sfx("creak"); }
    if (s.crk && p < 0.30)  { s.crk = false; }
  };

  /* spring — used on release. Critically damped toward 0, with a little
     overshoot toward 1 so completing the pull lands with a snap. */
  const springTo = (target, onRest) => {
    const s = swipe.current;
    if (raf.current) cancelAnimationFrame(raf.current);
    /* tuned numerically: open lands in ~480ms with ~3% overshoot (the snap);
       close settles in ~480ms with zero bounce (a lid doesn't rebound shut). */
    const K = target === 1 ? 0.12 : 0.08;
    const D = target === 1 ? 0.70 : 0.62;
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min((now - last) / 16.667, 2.5); last = now;
      const dx = target - s.p;
      s.v = (s.v + dx * K * dt) * Math.pow(D, dt);
      s.p += s.v * dt;
      if (s.p < 0) { s.p = 0; s.v = 0; }
      lidEvents(s.p);
      applyLid(s.p);
      if (Math.abs(target - s.p) < 0.0015 && Math.abs(s.v) < 0.0015) {
        s.p = target; s.v = 0; applyLid(target); raf.current = null;
        if (onRest) onRest();
        return;
      }
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  };

  /* generic tween on a premium easing curve — no linear motion anywhere */
  const tween = (from, to, dur, easeFn, onFrame, onDone) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      onFrame(from + (to - from) * easeFn(k), k);
      if (k < 1) { raf.current = requestAnimationFrame(step); }
      else { raf.current = null; if (onDone) onDone(); }
    };
    raf.current = requestAnimationFrame(step);
  };

  const lidDown = (e) => {
    const s = swipe.current;
    if (!armed || s.done) return;
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
    s.down = true; s.y0 = e.clientY; s.yLast = e.clientY; s.tLast = performance.now();
    s.startP = s.p; s.v = 0;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const lidMove = (e) => {
    const s = swipe.current;
    if (!s.down || s.done) return;
    let p = s.startP + (s.y0 - e.clientY) / SWIPE_PX;
    /* believable resistance: the lid gets heavier the further it travels,
       so the last third of the pull takes real intent */
    if (p > 0) p = p * (1 - 0.16 * Math.min(1, p));
    /* rubber-band past the ends so it never feels like it hit a wall */
    if (p < 0) p *= 0.3;
    if (p > 1) p = 1 + (p - 1) * 0.12;
    const now = performance.now();
    const dt = Math.max(now - s.tLast, 1);
    s.v = (((s.yLast - e.clientY) / SWIPE_PX) / dt) * 16.667;
    s.yLast = e.clientY; s.tLast = now;
    s.p = p;
    lidEvents(p);
    applyLid(p);
    /* seam light tracks the gap in real time while dragging */
    if (p > 0.04) setSeam(Math.min(0.5, p * 0.7));
    /* COMMIT — crossing 70% commits exactly once; done latches it */
    if (p >= 0.70) {
      s.done = true; s.down = false; setDragging(false);
      lockIn();
    }
  };

  const lidUp = () => {
    const s = swipe.current;
    if (!s.down || s.done) return;
    s.down = false;
    setDragging(false);
    /* released early → everything settles smoothly back home, seam closes */
    const hadLift = s.p > 0.06;
    setSeam(0);
    springTo(0, () => { if (hadLift) sfx("shut"); });
  };

  /* ---- COMMIT → LATCH RELEASE ----
     0.00–0.15s. The swipe is complete. The lid FREEZES exactly where the
     finger left it — it must not travel backwards (that reads as re-closing)
     and it must not jump forwards. The only thing that happens is the latch
     letting go. */
  const lockIn = () => {
    setArmed(false);
    setPhase("locked");
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
    applyLid(swipe.current.p);             // hold position, no drift
    setLatch(2);                           // latches released
    sfx("clunk");
    setShake("shake-mid");                 // rattle STARTS here — lid still on,
    sfx("rumble");                         // building the burst before it pops
    at(420, openLid);                      // let the shake build, THEN lift off
  };

  /* ---- ROTATION ----
     0.15–0.45s. One continuous rotation about the fixed hinge to the stop.
     Nothing else in the crate moves. */
  const openLid = () => {
    setPhase("opening");
    sfx("creak");
    /* shake is already running from lockIn — it continues through the lift and
       stops in holdStill once the lid is clear */
    const from = swipe.current.p;
    tween(from, 1, 300, EASE_LID,
      (v) => {
        swipe.current.p = v;
        applyLid(v);                       // single rotation, that is all
        setSeam(0.25 + v * 0.35);          // light through the widening gap
      },
      () => { swipe.current.p = 1; applyLid(1); holdStill(); });
  };

  /* ---- THE PAUSE ----
     0.45–0.90s. Absolutely nothing happens. No motion, no light change, no
     camera move. The crate is a still object sitting fully open. This dead
     air is what makes the reveal feel deliberate rather than automatic. */
  const holdStill = () => {
    setPhase("held");
    setShake("");                          // lid is off — settle, shake stops
    at(450, breakOpen);
  };

  /* ---- THE REVEAL ----
     Only now does light begin. The crate itself still never moves; the
     camera push and the tool rise happen around it. */
  const breakOpen = () => {
    setArmed(false);
    setPhase("risen");
    setGesture(false);
    setLatch(2); setLid(LID_OPEN);         // hand back to React at the SAME angle
    setCamPush(1);                         // camera only — not the crate

    const big = RARITIES.indexOf(pulled.b) >= 4;

    at(0,    () => setBloom(0.45));        // light starts to build inside
    at(260,  () => setBloom(1));
    at(420,  () => { setStage(7); setShowIcon(true); sfx("settle"); });
    at(1060, () => setBloom(0.42));
    at(1560, () => { setBloom(0.2); setSeam(0.35); });
    const hold = big ? 2560 : 2060;
    at(hold, () => { setStage(8); sfx("chime"); });
    at(hold + 260, () => { setScreen("reveal"); setSeam(0); setBloom(0); setCamPush(0); });
  };

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  /* ---- THE REVEAL ----
     Lid is home. Nothing jolts. The interior light peaks, the tool rises
     out of the cavity through the glow, the bloom decays, and only then
     do we move to the card. Rarity changes the *pacing and warmth*, never
     the amount of colour thrown at the screen. */
  useEffect(() => clear, []);

  /* the tool is YOURS the moment it's revealed — no claim step. Racks
     itself on the wall as the reveal lands. Guarded by pullId so pulling
     the same SKU twice still records twice. */
  const stashed = useRef(-1);
  useEffect(() => {
    if (screen === "reveal" && pulled && stashed.current !== pullId) {
      stashed.current = pullId;
      setGarage((g) => [{ ...pulled, ts: Date.now(), id: pullId, tier: tier.id }, ...g]);
    }
  }, [screen, pulled, pullId, tier.id]);

  const goHome = () => { clear(); resetCeremony(); setScreen("home"); };

  /* --- Garage: detail card + "camera" move to the newest tool ---------
     The newest pull should announce itself. On entering the garage we
     scroll it into view once, sweep a light over it and play the metal
     placement tick, then mark it seen so it never replays. */
  const [garageSel, setGarageSel] = useState(null);
  const [freshId, setFreshId] = useState(null);
  const seenTop = useRef(null);
  const freshRef = useRef(null);

  useEffect(() => {
    if (screen !== "garage" || !garage.length) return;
    const top = garage[0];
    if (seenTop.current === top.id) return;
    seenTop.current = top.id;
    setFreshId(top.id);
    const t1 = setTimeout(() => {
      freshRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      sfx("settle");
    }, 260);
    const t2 = setTimeout(() => setFreshId(null), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [screen, garage, sfx]);

  const pickTool = useCallback((it) => { setGarageSel(it); sfx("slide"); }, [sfx]);

  /* Workshop tiers — the room visibly levels up as the wall fills. */
  const garageRank = useMemo(() => {
    const TIERS = [
      { at: 0, label: "EMPTY BAY" }, { at: 3, label: "STARTER BENCH" },
      { at: 8, label: "WORKING SHOP" }, { at: 16, label: "OUTFITTED SHOP" },
      { at: 28, label: "PRO GARAGE" }, { at: 45, label: "DREAM WORKSHOP" },
    ];
    const n = garage.length;
    let i = 0;
    for (let k = 0; k < TIERS.length; k++) if (n >= TIERS[k].at) i = k;
    const cur = TIERS[i], nxt = TIERS[i + 1];
    const pct = nxt ? Math.min(100, ((n - cur.at) / (nxt.at - cur.at)) * 100) : 100;
    return { label: cur.label, next: nxt?.label ?? null, remain: nxt ? nxt.at - n : 0, pct };
  }, [garage.length]);

  /* keep some bare hooks on the wall so there's always visible room to grow */
  const emptyHooks = useMemo(() => {
    const n = garage.length;
    return n === 0 ? 0 : Math.max(2, Math.min(6, 8 - (n % 6)));
  }, [garage.length]);

  /* The outcome is known at purchase, so there are 8-15 seconds of pick
     screen and ceremony to fetch one image. By the time the lid opens it
     is in cache and appears instantly instead of a beat late. */
  useEffect(() => {
    if (!pulled) return;
    const src = photoFor(pulled.n);
    if (!src) return;
    const im = new Image();
    im.src = src;
  }, [pulled]);

  const gd = pulled ? GRADE[pulled.b] : null;
  const showNav = ["home", "garage", "profile", "odds"].includes(screen);
  const navTab = screen === "odds" ? "home" : screen;

  /* profile stats */
  const stats = useMemo(() => {
    if (!garage.length) return { pulls: 0, total: 0, best: null, rarest: null };
    const total = garage.reduce((a, g) => a + g.v, 0);
    const best = garage.reduce((a, g) => (g.v > a.v ? g : a), garage[0]);
    const rarest = garage.reduce((a, g) => (RARITIES.indexOf(g.b) > RARITIES.indexOf(a.b) ? g : a), garage[0]);
    return { pulls: garage.length, total, best, rarest };
  }, [garage]);

  return (
    <div style={S.app}>
      <style>{CSS}</style>

      {/* ---- warehouse atmosphere ---- */}
      <div style={S.columns} />
      <div className="pool pool-a" style={S.poolA} />
      <div className="pool pool-b" style={S.poolB} />
      <div style={S.dustField} aria-hidden="true">
        {DUST.map((d, i) => (
          <span key={i} className="dust" style={{
            left: `${d.l}%`, width: d.s, height: d.s, opacity: d.o,
            animationDuration: `${d.t}s`, animationDelay: `-${d.d}s`,
          }} />
        ))}
      </div>
      <div style={S.grain} />
      <div style={{ ...S.tierWash, background: `radial-gradient(900px 460px at 50% -4%, ${tier.wash}, transparent 62%)` }} />
      <div style={{ ...S.houseLights, opacity: dim }} />
      {/* No full-screen colour wash, no white flash. The room only ever
          brightens a little, tinted by the pull, in sympathy with the
          light coming out of the crate. */}
      <div style={{
        ...S.roomLift,
        background: pulled ? `radial-gradient(circle at 50% 40%, ${lit(pulled.b, "spec", 0.30)} 0%, ${lit(pulled.b, "tint", 0.10)} 42%, transparent 74%)` : "transparent",
        opacity: bloom * 0.45,
      }} />

      <header style={S.header}>
        {/* the mark is a global home button — works from ANY screen, including
            mid-ceremony (goHome cancels pending timers so nothing snaps back) */}
        <div style={{ ...S.logo, cursor: "pointer" }} onClick={goHome} role="button" aria-label="Go to home">
          <div style={S.mark} className="logo-sheen">TC</div>
          <div style={S.logoT}>TOOLCRATE</div>
        </div>
        <div style={S.hRight}>
          <button className="press" style={S.mute} onClick={() => setSound((s) => !s)} aria-label={sound ? "Mute sound" : "Unmute sound"}>{sound ? "◉" : "○"}</button>
          <div style={S.wallet}>
            <span style={S.wAmt}>${credits}</span>
            <button className="press" style={S.top} onClick={() => setCredits((c) => c + 250)} aria-label="Add credits">+</button>
          </div>
        </div>
      </header>

      {/* ============ HOME ============ */}
      {screen === "home" && (
        <main key="home" className="fade" style={{ ...S.main, ...S.mainHome }}>
          <div style={{ ...S.stageZone, ...S.stageZoneHome }}>
            {/* warehouse depth behind the crate */}
            <div style={S.homeHaze} />
            {/* volumetric spotlight cone + soft key */}
            <div style={S.homeSpot} />
            <div style={S.homeCone} />
            {/* faint drifting dust in the beam */}
            <div style={S.dustField} aria-hidden>
              {DUST.map((d, i) => (
                <span key={i} className="dust" style={{
                  left: `${d.l}%`, width: d.s, height: d.s, opacity: d.o,
                  animationDuration: `${d.t}s`, animationDelay: `-${d.d}s`,
                }} />
              ))}
            </div>
            <div style={S.homeSpotPool} />
            {/* reflection beneath the crate */}
            <div style={S.homeReflect} />
            <Loop
              count={TIERS.length}
              index={tierI}
              setIndex={setTierI}
              sfx={sfx}
              step={Math.round(252 * fit)}
              height={Math.round(268 * fit)}
              marginTop={Math.round(22 * fit)}
              loop={false}
              paged={true}
              /* tapping the centred crate does the same thing as the BUY CRATE
                 button. Off-centre taps still just slide that crate in (handled
                 inside Loop), and buy() self-guards on tier.live / credits. */
              onCenterTap={buy}
              render={(i, a, landed) => {
                const t = TIERS[i];
                if (!t) return null;
                return (
                  /* the grow lives on its own wrapper so it never fights the
                     rAF-driven positioning transform on the cell above */
                  <div style={{
                    transform: `scale(${landed ? 1.055 : 1})`,
                    transition: "transform .5s cubic-bezier(.22,1.4,.36,1)",
                    willChange: "transform",
                  }}>
                    <div className={a < 0.2 ? "crate-float" : ""}>
                      <Crate tier={t} uid={`h${i}`} size={Math.round(286 * fit)} sheen={a < 0.2 && t.id === "starter"} />
                    </div>
                  </div>
                );
              }}
            />
          </div>

          <div style={S.marks}>
            {TIERS.map((t, i) => (
              <span key={t.id} style={{
                ...S.markDot,
                ...(i === tIdx
                  ? { width: 20, background: t.accent, boxShadow: `0 0 10px ${t.accent}66` }
                  : {}),
              }} />
            ))}
          </div>

          <div key={tier.id} className="tier-in" style={{ ...S.tierBlock, marginTop: Math.round(20 * fit) }}>
            <h1 style={{ ...S.h1, fontSize: Math.round(44 * fit) }}>{tier.name}</h1>

            <div style={{ ...S.specs, margin: `${Math.round(20 * fit)}px 0 ${Math.round(22 * fit)}px` }}>
              <div style={S.spec}><span style={S.specV}>{moneyR(tStats.max)}</span><span style={S.specL}>MAX VALUE</span></div>
              <span style={S.specDiv} />
              <div style={S.spec}><span style={S.specV}>{money(tier.price)}</span><span style={S.specL}>BOX PRICE</span></div>
              <span style={S.specDiv} />
              <div style={S.spec}><span style={S.specV}>{moneyR(tStats.floor)}</span><span style={S.specL}>FLOOR VALUE</span></div>
            </div>

            {tier.live ? (
              <>
                <button className="press gold" style={S.cta} onClick={buy} disabled={credits < tier.price}>
                  BUY CRATE · {money(tier.price)}
                </button>
                {/* stated BEFORE payment — no fee may appear after the reveal */}
                <div style={S.shipLine}>
                  {tier.ship > 0
                    ? <>+ {money(tier.ship)} shipping · <b style={{ color: "#9AA2AB" }}>{money(tier.price + tier.ship)}</b> total</>
                    : <b style={{ color: "#7BC08A", letterSpacing: "0.14em" }}>FREE SHIPPING</b>}
                </div>
                <button className="link" style={S.oddsLink} onClick={() => { setOddsTier(tier.id); setScreen("odds"); }}>Odds &amp; full tool list</button>
              </>
            ) : (
              <>
                <button style={S.ctaLocked} disabled>NOT YET DROPPED</button>
                <div style={S.lockNote}>Locked until the pool is filled and audited.</div>
              </>
            )}
          </div>
        </main>
      )}

      {/* ============ GARAGE — the dream workshop ============ */}
      {screen === "garage" && (
        <main key="garage" className="fade" style={S.main}>
          <div style={S.pageHead}>
            <h2 style={S.h2}>GARAGE</h2>
            {garage.length > 0 && <span style={S.gCount}>{garage.length}</span>}
          </div>

          {garage.length === 0 ? (
            <div style={S.emptyWrap}>
              <div style={S.emptyIcon}><NavIcon kind="garage" color="#4A5058" /></div>
              <div style={S.emptyTitle}>The wall is bare</div>
              <div style={S.emptyBody}>Break open a crate. Every tool you pull gets mounted here for good.</div>
              <button className="press gold" style={{ ...S.cta, marginTop: 22 }} onClick={() => setScreen("home")}>GO TO CRATES</button>
            </div>
          ) : (
            <>
              {/* progression — the shop itself levels up as the wall fills */}
              <div style={S.garProg}>
                <div style={S.garProgTop}>
                  <span style={S.garProgLabel}>WORKSHOP</span>
                  <span style={S.garProgTier}>{garageRank.label}</span>
                </div>
                <div style={S.garProgBar}>
                  <div className="bar" style={{ ...S.garProgFill, width: `${garageRank.pct}%` }} />
                </div>
                <div style={S.garProgFoot}>
                  <span>{garage.length} mounted</span>
                  <span>{garageRank.next ? `${garageRank.remain} to ${garageRank.next}` : "FULLY STOCKED"}</span>
                </div>
              </div>

              {/* the room: perspective shell → wall → bench → floor */}
              <div style={S.garRoom}>
                <div className="gar-drift" style={S.garStage}>
                  <div style={S.garWall}>
                    {/* overhead warm fixtures + the light they throw */}
                    <div style={S.garFixture} />
                    <div style={S.garFixtureGlow} />
                    <div style={S.garSheen} />
                    <div style={S.garHaze} />
                    <div style={S.garVignette} />

                    <div style={S.garGrid}>
                      {garage
                        .slice()                       // copy so state order is untouched
                        .sort((a, b) => b.v - a.v)      // by price, highest first
                        .map((it, i) => (
                        <div key={it.id ?? it.ts} ref={it.id === freshId ? freshRef : null} style={{ display: "contents" }}>
                          <GarageTile it={it} index={i} isNew={it.id === freshId} onPick={pickTool} />
                        </div>
                      ))}

                      {/* empty hooks stay visible — the room you haven't filled yet */}
                      {Array.from({ length: emptyHooks }).map((_, i) => (
                        <div key={`e${i}`} className="gar-tile gar-empty">
                          <div className="gar-hookWrap">
                            <span className="gar-hole" />
                            <span className="gar-hook" />
                          </div>
                          <div className="gar-emptyGhost" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* wood workbench + concrete floor give the wall somewhere to stand */}
                  <div style={S.garBench}>
                    <div style={S.garBenchTop} />
                    <div style={S.garBenchEdge} />
                  </div>
                  <div style={S.garFloor} />
                </div>
              </div>
            </>
          )}
        </main>
      )}

      {/* ---- tool detail card ---- */}
      {garageSel && (() => {
        const g = GRADE[garageSel.b];
        return (
          <div style={S.tdWrap} onClick={() => setGarageSel(null)}>
            <div style={S.tdScrim} />
            <div className="td-in" style={S.tdCard} onClick={(e) => e.stopPropagation()}>
              <div style={{ ...S.tdBar, background: g.accent }} />
              <button className="press" style={S.tdClose} onClick={() => setGarageSel(null)}>✕</button>
              <div style={S.tdArtWrap}>
                <div style={{ ...S.tdHalo, background: `radial-gradient(circle, ${g.glow} 0%, transparent 66%)` }} />
                <ToolArt name={garageSel.n} size={186} accent={g.accent} />
              </div>
              <div style={{ ...S.tdRarity, color: g.accent }}>
                <RarityMark grade={garageSel.b} size={26} />
                <span>{g.label}</span>
              </div>
              <div style={S.tdName}>{garageSel.n}</div>
              <div style={S.tdRows}>
                <div style={S.tdRow}><span style={S.tdK}>BRAND</span><span style={S.tdV}>{brandOf(garageSel.n)}</span></div>
                <div style={S.tdRow}><span style={S.tdK}>VALUE</span><span style={S.tdV}>{money(garageSel.v)}</span></div>
                <div style={S.tdRow}><span style={S.tdK}>OBTAINED</span><span style={S.tdV}>
                  {new Date(garageSel.ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span></div>
                <div style={S.tdRow}><span style={S.tdK}>MOUNT</span><span style={S.tdV}>{mountFor(garageSel.n).toUpperCase()}</span></div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ============ PROFILE ============ */}
      {screen === "profile" && (
        <main key="profile" className="fade" style={S.main}>
          <div style={S.pageHead}>
            <h2 style={S.h2}>PROFILE</h2>
          </div>

          <div style={S.profCard}>
            <div style={S.profMono}>TC</div>
            <div>
              <div style={S.profName}>OPERATOR</div>
              <div style={S.profSub}>DROP 001 · BUILDER ACCESS</div>
            </div>
          </div>

          <div style={S.statRow}>
            <div style={S.statBox}>
              <span style={S.statV}>{stats.pulls}</span>
              <span style={S.statL}>PULLS</span>
            </div>
            <div style={S.statBox}>
              <span style={S.statV}>{moneyR(stats.total)}</span>
              <span style={S.statL}>TOTAL RETAIL</span>
            </div>
            <div style={S.statBox}>
              <span style={S.statV}>{money(credits)}</span>
              <span style={S.statL}>WALLET</span>
            </div>
          </div>

          {stats.best && (
            <div style={S.profList}>
              <div style={S.profItem}>
                <span style={S.profItemL}>BEST PULL</span>
                <span style={{ ...S.profItemAccent, color: GRADE[stats.best.b].accent }}>{stats.best.n}</span>
                <span style={S.profItemV}>{moneyR(stats.best.v)}</span>
              </div>
              <div style={S.profItem}>
                <span style={S.profItemL}>RAREST</span>
                <span style={{ ...S.profItemAccent, color: GRADE[stats.rarest.b].accent }}>{GRADE[stats.rarest.b].label}</span>
                <span style={S.profItemV}>{stats.rarest.n.split(" ").slice(0, 2).join(" ")}</span>
              </div>
            </div>
          )}

          <div style={S.profList}>
            <div style={S.profItem}>
              <span style={S.profItemL}>SOUND</span>
              <span style={{ flex: 1 }} />
              <button className="press" style={{ ...S.toggle, ...(sound ? S.toggleOn : {}) }} onClick={() => setSound((s) => !s)}>
                <span style={{ ...S.toggleKnob, transform: sound ? "translateX(16px)" : "none" }} />
              </button>
            </div>
            <div style={S.profItem}>
              <span style={S.profItemL}>ODDS &amp; TOOL LIST</span>
              <span style={{ flex: 1 }} />
              <button className="link" style={S.profLink} onClick={() => setScreen("odds")}>VIEW →</button>
            </div>
          </div>

          <div style={S.profFoot}>ToolCrate · Drop 001 · Every crate ships a real tool.</div>
        </main>
      )}

      {/* ============ PICK — the rack (no serial text) ============ */}
      {screen === "pick" && (
        <main key="pick" className="fade" style={{ ...S.main, ...S.center }}>
          <div style={{ ...S.pickHead, opacity: taken ? 0 : 1 }}>
            <div style={{ ...S.pickTier, color: tier.accent }}>{tier.name}</div>
            <h2 style={S.pickTitle}>PICK YOUR CRATE</h2>
          </div>

          <div style={S.rackWrap}>
            <div style={S.rackRail} />
            <div style={S.spotCone} />
            <Loop
              count={RACK_SIZE}
              index={rackI}
              setIndex={setRackI}
              sfx={sfx}
              step={240}
              locked={taken}
              onCenterTap={pickCrate}
              render={(i, a, landed) => {
                const isCentre = a < 0.05;
                return (
                  <div
                    className={landed && !taken ? "crate-ready" : ""}
                    style={{
                      transform: taken && a < 0.2 ? "translateY(-18px) scale(1.06)" : "none",
                      opacity: taken && a >= 0.2 ? 0 : 1,
                      transition: "transform .55s cubic-bezier(.2,1,.3,1), opacity .45s",
                      cursor: isCentre && !taken ? "pointer" : "default",
                    }}
                  >
                    {/* pad of light under the centred crate — reads as the
                        one that's live without adding another control */}
                    <div style={{
                      ...S.readyPad,
                      opacity: isCentre && !taken ? 1 : 0,
                      background: `radial-gradient(ellipse at 50% 50%, ${tier.accent}, transparent 70%)`,
                    }} />
                    <Crate tier={tier} uid={`r${mod(i, RACK_SIZE)}`} size={282} />
                  </div>
                );
              }}
            />
          </div>

          <div style={{ ...S.pickFoot, opacity: taken ? 0 : 1 }}>
            {/* no button — the crate itself is the target */}
            <div className="tap-cue" style={S.tapCue}>
              <span style={S.tapRule} />
              <span style={S.tapTxt}>TAP A CRATE TO TAKE IT</span>
              <span style={S.tapRule} />
            </div>
            <div style={S.honest}>Every crate carries the same published odds.</div>
          </div>
        </main>
      )}

      {/* ============ STAGE — grab the lid, pull it open ============ */}
      {screen === "stage" && pulled && (
        <main key="stage" style={{ ...S.main, ...S.center }}>
          <div style={S.ceremony}>
            {/* ---- volumetric studio lighting ----
                Three soft overhead sources, no hard edges anywhere. The
                rarity only warms or cools the white; it never becomes a
                coloured beam. */}
            <div style={{ ...S.ceilKey, opacity: stage >= 1 ? 1 : 0,
              background: `radial-gradient(58% 44% at 50% 0%, ${lit(pulled.b, "spec", 0.20)} 0%, ${lit(pulled.b, "tint", 0.09)} 38%, transparent 74%)` }} />
            <div style={{ ...S.ceilFillL, opacity: stage >= 1 ? 1 : 0,
              background: `radial-gradient(50% 40% at 50% 0%, ${lit(pulled.b, "tint", 0.10)} 0%, transparent 72%)` }} />
            <div style={{ ...S.ceilFillR, opacity: stage >= 1 ? 1 : 0,
              background: `radial-gradient(50% 40% at 50% 0%, ${lit(pulled.b, "tint", 0.08)} 0%, transparent 72%)` }} />

            {/* atmosphere the light passes through — this is what makes it
                read as volume instead of a gradient */}
            <div style={{ ...S.atmos, opacity: stage >= 1 ? (phase === "opening" || phase === "risen" ? 0.75 : 0.45) : 0,
              background: `radial-gradient(64% 50% at 50% 12%, ${lit(pulled.b, "spec", 0.07)} 0%, transparent 76%)` }} />

            {/* soft pool under the crate — feathered, barely tinted */}
            <div style={{ ...S.deckPool, opacity: stage >= 1 ? 1 : 0,
              background: `radial-gradient(ellipse at 50% 50%, ${lit(pulled.b, "tint", 0.22)} 0%, ${lit(pulled.b, "tint", 0.07)} 45%, transparent 72%)` }} />

            {/* interior bloom — the brightest point stays INSIDE the crate */}
            <div style={{ ...S.interiorBloom, opacity: bloom,
              background: `radial-gradient(circle at 50% 50%, #FFFFFF 0%, ${lit(pulled.b, "spec", 0.85)} 22%, ${lit(pulled.b, "tint", 0.35)} 46%, transparent 72%)` }} />

            {/* light escaping the lid seam as the gap opens */}
            <div style={{ ...S.seamGlow, opacity: seam,
              background: `radial-gradient(ellipse at 50% 50%, ${lit(pulled.b, "spec", 0.55)} 0%, ${lit(pulled.b, "tint", 0.18)} 40%, transparent 70%)` }} />

            {/* camera: slow push-in, plus an always-on breath of drift */}
            <div className="cam-drift" style={{
              ...S.camRig,
              transform: `scale(${1 + camPush * 0.075}) translateY(${camPush * -10}px)`,
            }}>
              <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 2 }}>
                <div className={shake} style={{ position: "relative" }}>
                  <Crate tier={tier} uid="ceremony" size={352} grade={pulled.b} lid={lid} latch={latch}
                    glowing={phase === "risen" ? 1 : stage >= 1 ? 0.55 : 0} gesture={gesture}
                    lidRef={lidEl} bodyRef={bodyEl} interiorRef={intEl} shadowRef={shadowEl} crateRef={crateEl} />
                  {/* the grab zone IS the lid — the top of the crate */}
                  {armed && (
                    <div
                      style={{ ...S.lidHit, cursor: dragging ? "grabbing" : "grab" }}
                      onPointerDown={lidDown}
                      onPointerMove={lidMove}
                      onPointerUp={lidUp}
                      onPointerCancel={lidUp}
                    />
                  )}
                  {/* the tool rises OUT of the cavity, through the glow */}
                  {showIcon && (
                    <div className="icon-emerge" style={{ ...S.iconRise,
                      filter: `drop-shadow(0 14px 26px rgba(0,0,0,0.55)) drop-shadow(0 0 18px ${lit(pulled.b, "spec", 0.4)})` }}>
                      <ToolArt name={pulled.n} size={photoFor(pulled.n) ? 215 : 140} color="#FFFDF2" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* prompt — fades once the lid is moving, returns if the
              crate is closed back up */}
          {armed && !dragging && (
            <div className="prompt-in" style={{ ...S.swipePrompt, opacity: dragging ? 0 : 1, transition: "opacity .25s" }}>
              <div className="chev-pulse" style={S.chevStack}>
                <svg width="26" height="30" viewBox="0 0 26 30">
                  <path d="M3 18 L13 8 L23 18" fill="none" stroke={YEL} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
                  <path d="M3 26 L13 16 L23 26" fill="none" stroke={YEL} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={S.swipeLabel}>LIFT THE LID</div>
            </div>
          )}


        </main>
      )}

      {/* ============ REVEAL ============ */}
      {screen === "reveal" && pulled && (
        <main key="reveal" style={{ ...S.main, ...S.center }}>
          <div className="reveal-in" style={S.cardOuter}>
            <div style={{ ...S.cardTop, background: gd.accent }} />
            <div style={S.card}>
              <div style={{ ...S.cRar, color: gd.accent }}>{gd.label}</div>
              <div style={S.cIcon}>
                <div style={{ ...S.cIconGlow, background: `radial-gradient(circle, ${gd.accent}30 0%, transparent 65%)` }} />
                <ToolArt name={pulled.n} size={photoFor(pulled.n) ? 190 : 140} color={gd.accent} />
              </div>
              <div style={S.cName}>{dispName(pulled.n)}</div>
              <div style={S.cVal}>{moneyR(pulled.v)}<span style={S.cRt}> retail</span></div>

              {/* it's already yours — this states it, it doesn't ask */}
              <div className="stash-in" style={S.cStash}>
                <svg width="13" height="13" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                  <path d="M2 7.4 L5.4 10.8 L12 3.6" fill="none" stroke="#7BC08A" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>RACKED IN YOUR GARAGE · SHIPS TO YOU</span>
              </div>

              <div style={S.cActions}>
                <button className="press gold" style={S.again} onClick={buy} disabled={credits < tier.price}>
                  AGAIN<span style={S.bSub}>{money(tier.price)}</span>
                </button>
                <button className="press" style={S.home} onClick={goHome}>
                  RETURN HOME<span style={S.bSub}>view the garage</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ============ ODDS — per box, switchable ============ */}
      {screen === "odds" && (() => {
        const cat = CATALOG[oddsTier];
        const { odds: bOdds, range: bRange } = catalogStats(cat);
        const oTier = TIERS.find((t) => t.id === oddsTier);
        const oStats = tierStats(oddsTier);
        return (
          <main key="odds" className="fade" style={S.main}>
            <button className="link" style={S.back} onClick={() => setScreen("home")}>← BACK</button>
            <h2 style={S.h2}>PUBLISHED ODDS</h2>

            {/* which box's table you're reading */}
            <div style={S.oddsTabs}>
              {TIERS.filter((t) => t.live).map((t) => (
                <button key={t.id} className="press" onClick={() => setOddsTier(t.id)}
                  style={{ ...S.oddsTab, ...(oddsTier === t.id ? { color: t.accent, borderColor: t.accent, background: "rgba(255,255,255,0.04)" } : {}) }}>
                  {t.name} · ${t.price}
                </button>
              ))}
            </div>

            <p style={S.oddsNote}>Every item is real, in stock, and pullable. Odds are fixed per drop and don't change based on who you are, what you've spent, or which crate you take off the rack.</p>

            <div style={S.oddsSummary}>
              <div style={S.oSum}><span style={S.oSumV}>{cat.length}</span><span style={S.oSumL}>TOOLS</span></div>
              <span style={S.specDiv} />
              <div style={S.oSum}><span style={S.oSumV}>{(bOdds.RARE + bOdds.EPIC + bOdds.LEGENDARY + bOdds.MYTHIC).toFixed(1)}%</span><span style={S.oSumL}>ABOVE BOX</span></div>
              <span style={S.specDiv} />
              <div style={S.oSum}><span style={S.oSumV}>{money(oStats.floor)}</span><span style={S.oSumL}>FLOOR</span></div>
              <span style={S.specDiv} />
              <div style={S.oSum}><span style={S.oSumV}>{money(oStats.max)}</span><span style={S.oSumL}>MAX</span></div>
              <span style={S.specDiv} />
              <div style={S.oSum}>
                <span style={{ ...S.oSumV, color: oTier.ship > 0 ? "#E9EBEE" : "#7BC08A" }}>
                  {oTier.ship > 0 ? money(oTier.ship) : "FREE"}
                </span>
                <span style={S.oSumL}>SHIPPING</span>
              </div>
            </div>

            {RARITIES.filter((b) => bOdds[b]).map((b) => (
              <div key={b} className="row" style={{ ...S.oRow, ...(b === "MYTHIC" ? S.oMythic : {}) }}>
                <div style={S.oTop}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <span style={{ ...S.chip, background: GRADE[b].accent }} />
                    <div>
                      <div style={{ ...S.oLbl, color: GRADE[b].accent }}>{GRADE[b].label}</div>
                      <div style={S.oRng}>{cat.filter((i) => i.b === b).length} TOOLS · {bRange[b]}</div>
                    </div>
                  </div>
                  <div style={S.oPct}>{bOdds[b].toFixed(1)}%</div>
                </div>
                <div style={S.oBarBg}>
                  <div className="bar" style={{ ...S.oBar, width: `${Math.max(bOdds[b], 1.2)}%`, background: `linear-gradient(90deg,${YEL_DK},${YEL})` }} />
                </div>
                <div style={S.oList}>
                  {cat.filter((i) => i.b === b).map((i, k) => (
                    <div key={i.n + k} style={S.oItem}>
                      <span style={S.oThumb}><ToolArt name={i.n} size={30} accent={GRADE[b].accent} /></span>
                      <span style={S.oItemN}>{i.n}</span>
                      {/* per-SKU odds — every item's exact chance, always visible */}
                      <span style={S.oItemO}>{i.o.toFixed(2)}%</span>
                      <span style={S.oItemV}>{money(i.v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </main>
        );
      })()}

      {/* ============ BOTTOM NAV ============ */}
      {showNav && (
        <nav style={S.nav}>
          {[
            { id: "home", label: "CRATES", icon: "crates" },
            { id: "garage", label: "GARAGE", icon: "garage" },
            { id: "profile", label: "PROFILE", icon: "profile" },
          ].map((t) => {
            const active = navTab === t.id;
            return (
              <button key={t.id} className="press" style={S.navBtn} onClick={() => setScreen(t.id)} aria-label={t.label}>
                <NavIcon kind={t.icon} color={active ? YEL : "#5F656C"} />
                <span style={{ ...S.navLbl, color: active ? YEL : "#5F656C" }}>{t.label}</span>
                <span style={{ ...S.navDot, opacity: active ? 1 : 0 }} />
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

/* ================= styles ================= */
const S = {
  app: {
    minHeight: "100vh", color: "#E9EBEE", fontFamily: "'Barlow',system-ui,sans-serif",
    overflowX: "hidden", position: "relative", userSelect: "none",
    background: `
      radial-gradient(ellipse at 50% 128%, rgba(0,0,0,0.6), transparent 66%),
      linear-gradient(180deg,#15171C 0%,#1A1D23 54%,#0F1114 100%)`,
  },

  columns: {
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    background: `
      repeating-linear-gradient(90deg, rgba(255,255,255,0.010) 0 1px, transparent 1px 140px),
      repeating-linear-gradient(90deg, transparent 0 138px, rgba(0,0,0,0.05) 138px 141px, transparent 141px 280px)`,
  },
  poolA: {
    position: "fixed", left: "8%", top: "-16%", width: "44%", height: "56%",
    zIndex: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at 50% 30%, rgba(255,246,214,0.035), transparent 66%)",
  },
  poolB: {
    position: "fixed", right: "4%", top: "-20%", width: "50%", height: "60%",
    zIndex: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at 50% 28%, rgba(214,228,255,0.028), transparent 66%)",
  },
  dustField: { position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" },

  tierWash: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", transition: "background .7s ease" },
  grain: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.45, background: "repeating-linear-gradient(112deg, rgba(255,255,255,0.011) 0 1px, transparent 1px 3px)" },
  houseLights: { position: "fixed", inset: 0, zIndex: 5, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 34%, transparent 22%, rgba(0,0,0,0.88) 78%)", transition: "opacity 1.4s ease" },

  header: { position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(12,14,17,0.72)", backdropFilter: "blur(14px)" },
  logo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  mark: { width: 32, height: 32, borderRadius: 8, position: "relative", overflow: "hidden", background: `linear-gradient(155deg,${YEL_HI},${YEL} 45%,${YEL_DK})`, color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 900, fontSize: 15, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 3px 12px rgba(232,185,15,0.22)" },
  logoT: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.14em" },
  hRight: { display: "flex", alignItems: "center", gap: 8 },
  mute: { width: 30, height: 30, borderRadius: 8, background: "#1E2228", border: "1px solid rgba(255,255,255,0.07)", color: "#8B919A", fontSize: 11, cursor: "pointer" },
  wallet: { display: "flex", alignItems: "center", gap: 8, background: "#1E2228", padding: "6px 8px 6px 12px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.07)" },
  wAmt: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 17, color: YEL },
  top: { background: `linear-gradient(155deg,${YEL_HI},${YEL})`, border: "none", color: INK, fontWeight: 800, fontSize: 13, width: 20, height: 20, lineHeight: "18px", cursor: "pointer", borderRadius: 6, padding: 0 },

  main: { position: "relative", zIndex: 6, maxWidth: 760, margin: "0 auto", padding: "0 20px 108px" },

  /* Home is a single composed screen, not a scrolling document, so it centres
     itself in whatever space is left between the header and the tab bar.
     minHeight rather than height: if the content ever does outgrow the window
     the block simply grows and the page scrolls normally, instead of centring
     and putting the top of the crate somewhere unreachable. */
  mainHome: {
    minHeight: "calc(100dvh - 172px)",
    display: "flex", flexDirection: "column", justifyContent: "center",
    paddingBottom: 96,
  },
  /* the carousel blurs and fades neighbours, so it needs to bleed past the
     760px column — clipping it at the column edge cuts the falloff short */
  stageZoneHome: { overflow: "visible" },

  /* home selection zone + spotlight */
  stageZone: { position: "relative", overflow: "hidden" },
  homeHaze: {
    position: "absolute", left: "50%", top: "8%", transform: "translateX(-50%)",
    width: "88%", height: "84%", pointerEvents: "none", zIndex: 0,
    background: "radial-gradient(ellipse at 50% 40%, rgba(120,130,145,0.10), transparent 66%)",
    filter: "blur(8px)",
  },
  homeCone: {
    position: "absolute", left: "50%", top: -16, transform: "translateX(-50%)",
    width: "70%", height: "120%", pointerEvents: "none", zIndex: 0,
    background: "linear-gradient(180deg, rgba(255,246,214,0.06) 0%, rgba(255,246,214,0.015) 40%, transparent 72%)",
    clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)", mixBlendMode: "screen",
  },
  dustField: { position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" },
  homeReflect: {
    position: "absolute", left: "50%", bottom: -6, transform: "translateX(-50%) scaleY(-1)",
    width: 150, height: 46, pointerEvents: "none", zIndex: 0, opacity: 0.16,
    background: "linear-gradient(180deg, rgba(180,190,205,0.5), transparent 72%)",
    filter: "blur(3px)", borderRadius: "50%",
  },
  homeSpot: {
    position: "absolute", left: "50%", top: -12, transform: "translateX(-50%)",
    width: "52%", height: "112%", pointerEvents: "none", zIndex: 0,
    background: "linear-gradient(180deg, rgba(255,246,214,0.11) 0%, rgba(255,246,214,0.03) 46%, transparent 74%)",
    clipPath: "polygon(41% 0, 59% 0, 100% 100%, 0 100%)",
  },
  homeSpotPool: {
    position: "absolute", left: "50%", bottom: 4, transform: "translateX(-50%)",
    width: 300, height: 44, pointerEvents: "none", zIndex: 0,
    background: "radial-gradient(ellipse at 50% 50%, rgba(255,246,214,0.06), transparent 68%)",
  },

  loop: { position: "relative", width: "100%", height: 268, touchAction: "pan-y", cursor: "grab", marginTop: 22 },
  marks: { display: "flex", justifyContent: "center", gap: 6, marginTop: 4 },
  markDot: { width: 5, height: 5, borderRadius: 3, background: "#33383E", transition: "width .35s cubic-bezier(.2,1,.3,1), background .35s, box-shadow .35s" },

  tierBlock: { textAlign: "center", marginTop: 20 },
  h1: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 900, fontSize: 44, letterSpacing: "0.06em", margin: 0, lineHeight: 1 },
  specs: { display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0 22px" },
  spec: { flex: 1, display: "flex", flexDirection: "column", gap: 3, maxWidth: 110 },
  specV: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 21 },
  specL: { fontSize: 8.5, letterSpacing: "0.16em", color: "#5F656C" },
  specDiv: { width: 1, height: 26, background: "rgba(255,255,255,0.08)" },

  cta: {
    background: `linear-gradient(160deg,${YEL_HI},#EFC118 48%,${YEL_DK})`, color: INK, border: "none",
    padding: "15px 32px", borderRadius: 11, fontFamily: "'Big Shoulders Display',sans-serif",
    fontWeight: 800, fontSize: 19, letterSpacing: "0.12em", cursor: "pointer", display: "block",
    margin: "0 auto", width: "100%", maxWidth: 300,
    boxShadow: "0 10px 26px rgba(232,185,15,0.2), inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -3px 6px rgba(0,0,0,0.14)",
  },
  ctaLocked: { background: "#1E2228", color: "#5F656C", border: "1px solid rgba(255,255,255,0.07)", padding: "15px 32px", borderRadius: 11, fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 19, letterSpacing: "0.12em", display: "block", margin: "0 auto", width: "100%", maxWidth: 300, cursor: "not-allowed" },
  shipLine: { fontSize: 11.5, color: "#5F656C", textAlign: "center", marginTop: 10, letterSpacing: "0.02em" },
  lockNote: { fontSize: 11.5, color: "#5F656C", marginTop: 12 },
  oddsLink: { background: "none", border: "none", color: "#8B919A", margin: "14px auto 0", display: "block", cursor: "pointer", fontSize: 12.5, borderBottom: "1px solid rgba(139,145,154,0.3)", paddingBottom: 2 },

  pickHead: { textAlign: "center", paddingTop: 26, transition: "opacity .5s" },
  pickTier: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.3em", marginBottom: 7, transition: "color .4s" },
  pickTitle: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 900, fontSize: 34, letterSpacing: "0.06em", margin: 0 },

  rackWrap: { position: "relative", width: "100%" },
  rackRail: { position: "absolute", left: "-30%", right: "-30%", bottom: 30, height: 10, zIndex: 0, background: "linear-gradient(180deg,#3A4048,#171A1E 55%,#0C0E11)", boxShadow: "0 6px 18px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.14)" },
  spotCone: { position: "absolute", left: "50%", top: -10, transform: "translateX(-50%)", width: "56%", height: "118%", pointerEvents: "none", zIndex: 1, background: "linear-gradient(180deg, rgba(255,246,214,0.09) 0%, rgba(255,246,214,0.025) 45%, transparent 76%)", clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)" },

  pickFoot: { width: "100%", maxWidth: 320, marginTop: 26, transition: "opacity .5s" },
  tapCue: { display: "flex", alignItems: "center", gap: 12, width: "100%" },
  tapRule: { flex: 1, height: 1, background: "rgba(255,255,255,0.10)" },
  tapTxt: {
    fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800,
    fontSize: 11.5, letterSpacing: "0.26em", color: YEL, whiteSpace: "nowrap", paddingLeft: "0.26em",
  },
  readyPad: {
    position: "absolute", left: "50%", bottom: "6%", transform: "translateX(-50%)",
    width: 240, height: 40, pointerEvents: "none", zIndex: 0,
    filter: "blur(9px)", opacity: 0, transition: "opacity .45s ease",
  },
  honest: { fontSize: 11, color: "#5F656C", lineHeight: 1.55, textAlign: "center", marginTop: 16 },

  /* swipe prompt */
  swipePrompt: { position: "absolute", bottom: "12%", left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 8, pointerEvents: "none" },
  /* grab zone over the crate's lid — generous enough for a thumb,
     tall enough to ride the whole pull without losing the pointer */
  lidHit: {
    position: "absolute", left: "-6%", top: "-18%", width: "112%", height: "62%",
    zIndex: 6, touchAction: "none",
  },
  chevStack: { display: "flex", justifyContent: "center", marginBottom: 8 },
  swipeLabel: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.26em", color: YEL },

  /* pages */
  pageHead: { display: "flex", alignItems: "center", gap: 10, padding: "24px 0 14px" },
  gCount: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 11, color: INK, background: YEL, borderRadius: 5, padding: "1px 7px" },

  emptyWrap: { textAlign: "center", padding: "64px 20px" },
  emptyIcon: { display: "flex", justifyContent: "center", marginBottom: 14, opacity: 0.7 },
  emptyTitle: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "0.06em", color: "#8B919A" },
  emptyBody: { fontSize: 13, color: "#5F656C", marginTop: 6 },

  /* ---------- GARAGE: the workshop ---------- */
  garProg: {
    marginTop: 4, marginBottom: 14, padding: "13px 15px", borderRadius: 13,
    background: "linear-gradient(180deg,#1B1F24,#141719)",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  garProgTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline" },
  garProgLabel: { fontSize: 9.5, letterSpacing: "0.26em", color: "#6B7078", fontWeight: 700 },
  garProgTier: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 900, fontSize: 17, letterSpacing: "0.08em", color: YEL },
  garProgBar: { height: 5, background: "#0D0F12", borderRadius: 3, overflow: "hidden", marginTop: 9 },
  garProgFill: { height: "100%", borderRadius: 3, transformOrigin: "left", background: `linear-gradient(90deg,${YEL_DK},${YEL_HI})`, boxShadow: `0 0 12px ${YEL}55` },
  garProgFoot: { display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#5F656C", marginTop: 7, letterSpacing: "0.04em" },

  /* perspective shell — the room is not a flat plane */
  garRoom: { perspective: "1400px", perspectiveOrigin: "50% 22%" },
  garStage: { transformStyle: "preserve-3d", willChange: "transform" },

  garWall: {
    position: "relative", padding: "44px 16px 30px", borderRadius: "16px 16px 0 0",
    /* dark matte wall: fine texture + pegboard perforation with a lit top
       edge on each hole so the board reads as punched metal, not dots */
    background: `
      radial-gradient(130% 62% at 50% -8%, rgba(255,238,196,0.10), transparent 62%),
      repeating-linear-gradient(27deg, rgba(255,255,255,0.010) 0 1px, transparent 1px 4px),
      repeating-linear-gradient(-63deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 5px),
      radial-gradient(circle at 1.5px 1.2px, rgba(255,255,255,0.055) 1.4px, transparent 1.5px) 0 0 / 19px 19px,
      radial-gradient(circle at 1.5px 1.9px, rgba(0,0,0,0.62) 1.25px, transparent 1.35px) 0 0 / 19px 19px,
      linear-gradient(168deg, #23272C 0%, #191C20 48%, #101316 100%)`,
    borderTop: "1px solid rgba(255,255,255,0.07)",
    borderLeft: "1px solid rgba(255,255,255,0.04)",
    borderRight: "1px solid rgba(255,255,255,0.04)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -60px 90px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },
  /* brushed-metal sheen raking across the board */
  garSheen: {
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.5,
    background: "linear-gradient(104deg, transparent 18%, rgba(255,250,235,0.055) 38%, rgba(255,250,235,0.015) 52%, transparent 72%)",
    mixBlendMode: "screen",
  },
  /* light falls off toward the edges — premium, not evenly flood-lit */
  garVignette: {
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
    background: "radial-gradient(112% 78% at 50% 6%, transparent 42%, rgba(0,0,0,0.42) 88%)",
  },
  garFixture: {
    position: "absolute", left: "16%", right: "16%", top: 8, height: 5, borderRadius: 4,
    background: "linear-gradient(90deg, transparent, #FFF3CE 12%, #FFE9A8 50%, #FFF3CE 88%, transparent)",
    boxShadow: "0 0 26px 7px rgba(255,238,180,0.35), 0 2px 10px rgba(0,0,0,0.6)",
    pointerEvents: "none", zIndex: 3,
  },
  garFixtureGlow: {
    position: "absolute", left: "-10%", right: "-10%", top: 0, height: 300, pointerEvents: "none", zIndex: 0,
    background: "linear-gradient(180deg, rgba(255,241,205,0.16) 0%, rgba(255,241,205,0.05) 34%, transparent 72%)",
    clipPath: "polygon(26% 0, 74% 0, 100% 100%, 0 100%)",
  },
  garHaze: {
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, opacity: 0.5,
    background: "radial-gradient(90% 45% at 50% 8%, rgba(255,240,205,0.09), transparent 70%)",
    mixBlendMode: "screen",
  },
  garGrid: {
    position: "relative", zIndex: 1,
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(146px, 1fr))",
    /* generous row gap is what buys the showroom feel — smaller tools,
       more air, ~5-6 in view before the first scroll */
    gap: "52px 18px", alignItems: "start", paddingBottom: 10,
  },

  garBench: { position: "relative", height: 30 },
  garBenchTop: {
    position: "absolute", inset: 0,
    background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0 2px, transparent 2px 26px), linear-gradient(180deg,#6B4A2E 0%,#553A24 42%,#3E2A1A 100%)",
    boxShadow: "inset 0 2px 0 rgba(255,214,160,0.22), 0 10px 26px rgba(0,0,0,0.6)",
  },
  garBenchEdge: {
    position: "absolute", left: 0, right: 0, bottom: -6, height: 7,
    background: "linear-gradient(180deg,#2C1E13,#1A110A)",
    boxShadow: "0 8px 18px rgba(0,0,0,0.7)",
  },
  garFloor: {
    height: 54, borderRadius: "0 0 16px 16px", marginTop: 6,
    background: `
      radial-gradient(90% 120% at 50% -30%, rgba(255,240,205,0.10), transparent 62%),
      repeating-linear-gradient(97deg, rgba(255,255,255,0.014) 0 3px, transparent 3px 9px),
      linear-gradient(180deg,#212429 0%,#17191D 60%,#0E1013 100%)`,
    boxShadow: "inset 0 12px 26px rgba(0,0,0,0.55)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },

  /* ---------- tool detail card ---------- */
  tdWrap: { position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  tdScrim: { position: "absolute", inset: 0, background: "rgba(6,8,11,0.78)", backdropFilter: "blur(7px)" },
  tdCard: {
    position: "relative", width: "100%", maxWidth: 360, borderRadius: 18, overflow: "hidden",
    background: "linear-gradient(180deg,#24282F,#171A1E)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 40px 90px rgba(0,0,0,0.75)",
  },
  tdBar: { height: 4 },
  tdClose: {
    position: "absolute", top: 12, right: 12, zIndex: 2, width: 30, height: 30, borderRadius: 9,
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)",
    color: "#C6CBD2", fontSize: 13, cursor: "pointer", lineHeight: 1,
  },
  tdArtWrap: { position: "relative", display: "flex", justifyContent: "center", padding: "26px 0 8px" },
  tdHalo: { position: "absolute", top: "48%", left: "50%", transform: "translate(-50%,-50%)", width: 260, height: 260, pointerEvents: "none" },
  tdRarity: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.3em",
  },
  tdName: { fontSize: 17, fontWeight: 600, color: "#E9EBEE", textAlign: "center", padding: "9px 26px 0", lineHeight: 1.35 },
  tdRows: { padding: "18px 22px 24px", display: "grid", gap: 1 },
  tdRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 2px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  tdK: { fontSize: 9.5, letterSpacing: "0.22em", color: "#6B7078", fontWeight: 700 },
  tdV: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 16, color: "#E9EBEE" },

  gWall: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(106px, 1fr))", gap: 10,
    padding: 12, borderRadius: 14,
    background: "linear-gradient(180deg,#181B20,#121418)",
    border: "1px solid rgba(255,255,255,0.05)",
    backgroundImage: "radial-gradient(rgba(255,255,255,0.032) 1px, transparent 1.4px)",
    backgroundSize: "16px 16px",
    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.4)",
  },
  gTile: {
    position: "relative", textAlign: "center", borderRadius: 10, overflow: "hidden",
    background: "linear-gradient(180deg,#1D2127,#15181D)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "16px 8px 10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
  },
  gTileStripe: { position: "absolute", left: 0, right: 0, top: 0, height: 3 },
  gTileIcon: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, minHeight: 52 },
  gTileName: { fontSize: 10.5, fontWeight: 500, color: "#B9BFC7", lineHeight: 1.35, height: 28, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  gTileVal: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 15, marginTop: 5, color: "#E9EBEE" },

  /* profile */
  profCard: {
    display: "flex", alignItems: "center", gap: 14, padding: "18px 18px",
    background: "linear-gradient(180deg,#1D2127,#171A1F)", borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)", marginBottom: 12,
  },
  profMono: {
    width: 52, height: 52, borderRadius: 13, flexShrink: 0,
    background: `linear-gradient(155deg,${YEL_HI},${YEL} 45%,${YEL_DK})`, color: INK,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 900, fontSize: 22,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 6px 18px rgba(232,185,15,0.2)",
  },
  profName: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 900, fontSize: 21, letterSpacing: "0.08em" },
  profSub: { fontSize: 10, letterSpacing: "0.2em", color: "#5F656C", marginTop: 3 },

  statRow: { display: "flex", gap: 10, marginBottom: 12 },
  statBox: {
    flex: 1, display: "flex", flexDirection: "column", gap: 3, alignItems: "center",
    background: "#191C21", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: "14px 6px",
  },
  statV: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 20 },
  statL: { fontSize: 8.5, letterSpacing: "0.16em", color: "#5F656C" },

  profList: { background: "#191C21", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 12, overflow: "hidden" },
  profItem: { display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  profItemL: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", color: "#8B919A", flexShrink: 0 },
  profItemAccent: { fontSize: 12.5, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  profItemV: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 14, color: "#C6CBD2", flexShrink: 0 },
  profLink: { background: "none", border: "none", color: YEL, cursor: "pointer", fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.12em" },
  profFoot: { textAlign: "center", fontSize: 10.5, color: "#4A4F56", marginTop: 22, letterSpacing: "0.04em" },

  toggle: { position: "relative", width: 40, height: 24, borderRadius: 13, background: "#2A2E35", border: "1px solid rgba(255,255,255,0.09)", cursor: "pointer", padding: 0 },
  toggleOn: { background: `linear-gradient(160deg,${YEL_HI},${YEL})`, border: "1px solid rgba(0,0,0,0.2)" },
  toggleKnob: { position: "absolute", left: 3, top: 3, width: 16, height: 16, borderRadius: 9, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.4)", transition: "transform .2s cubic-bezier(.2,1,.3,1)" },

  back: { background: "none", border: "none", color: YEL, cursor: "pointer", fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.12em", padding: "22px 0 6px" },
  h2: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 900, fontSize: 27, letterSpacing: "0.05em", margin: 0 },
  oddsNote: { color: "#6B7078", fontSize: 13, lineHeight: 1.6, maxWidth: 520, margin: "8px 0 20px" },
  oddsTabs: { display: "flex", gap: 8, marginBottom: 16 },
  oddsTab: {
    flex: 1, background: "none", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9,
    color: "#7C838B", cursor: "pointer", padding: "9px 4px",
    fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 11.5,
    letterSpacing: "0.06em", transition: "color .25s, border-color .25s, background .25s",
  },
  oddsSummary: {
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#191C21", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)",
    padding: "14px 8px", marginBottom: 14,
  },
  oSum: { flex: 1, display: "flex", flexDirection: "column", gap: 3, alignItems: "center" },
  oSumV: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 16 },
  oSumL: { fontSize: 7.5, letterSpacing: "0.13em", color: "#5F656C" },
  oRow: { background: "#191C21", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: "14px 15px", marginBottom: 9 },
  oMythic: { borderColor: "rgba(232,185,15,0.35)", background: "linear-gradient(180deg, rgba(232,185,15,0.05), #191C21)" },
  oTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 },
  chip: { width: 26, height: 9, borderRadius: 2, flexShrink: 0, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)" },
  oLbl: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "0.08em" },
  oRng: { fontSize: 10.5, color: "#5F656C", marginTop: 2, letterSpacing: "0.06em" },
  oPct: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 23 },
  oBarBg: { height: 5, background: "#101215", borderRadius: 3, overflow: "hidden" },
  oBar: { height: "100%", borderRadius: 3, transformOrigin: "left" },
  oList: { marginTop: 11, display: "grid", gap: 2 },
  oItem: { display: "flex", alignItems: "center", fontSize: 12, color: "#7C838B", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" },
  oThumb: { width: 30, height: 30, flexShrink: 0, marginRight: 9, display: "flex", alignItems: "center", justifyContent: "center" },
  oItemN: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 10 },
  oItemO: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 700, color: "#5F656C", flexShrink: 0, width: 48, textAlign: "right", paddingRight: 10 },
  oItemV: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 700, color: "#AEB5BE", flexShrink: 0, width: 64, textAlign: "right" },

  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" },
  ceremony: { position: "relative", width: "100%", display: "flex", justifyContent: "center", padding: "132px 0 52px", zIndex: 6 },

  /* ---- volumetric lighting. No clip-paths anywhere: every edge is a
     gradient stop so the light feathers out instead of ending. ---- */
  ceilKey: {
    position: "absolute", left: "50%", top: -140, transform: "translateX(-50%)",
    width: "150%", height: "190%", pointerEvents: "none", zIndex: 1,
    filter: "blur(26px)", mixBlendMode: "screen",
    transition: "opacity 1.6s cubic-bezier(.4,0,.2,1), background .9s ease",
  },
  ceilFillL: {
    position: "absolute", left: "16%", top: -110, transform: "translateX(-50%)",
    width: "88%", height: "150%", pointerEvents: "none", zIndex: 1,
    filter: "blur(34px)", mixBlendMode: "screen",
    transition: "opacity 1.9s cubic-bezier(.4,0,.2,1), background .9s ease",
  },
  ceilFillR: {
    position: "absolute", left: "84%", top: -110, transform: "translateX(-50%)",
    width: "88%", height: "150%", pointerEvents: "none", zIndex: 1,
    filter: "blur(34px)", mixBlendMode: "screen",
    transition: "opacity 2.1s cubic-bezier(.4,0,.2,1), background .9s ease",
  },
  atmos: {
    position: "absolute", inset: "-10% -20%", pointerEvents: "none", zIndex: 1,
    filter: "blur(40px)", mixBlendMode: "screen",
    transition: "opacity 1.4s cubic-bezier(.4,0,.2,1)",
  },
  deckPool: {
    position: "absolute", left: "50%", bottom: "20%", transform: "translateX(-50%)",
    width: 420, height: 96, pointerEvents: "none", zIndex: 1,
    filter: "blur(16px)", transition: "opacity 1.4s ease",
  },
  interiorBloom: {
    position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-50%)",
    width: 400, height: 300, pointerEvents: "none", zIndex: 3,
    filter: "blur(22px)", mixBlendMode: "screen",
    transition: "opacity .85s cubic-bezier(.4,0,.2,1)",
  },
  seamGlow: {
    position: "absolute", left: "50%", top: "44%", transform: "translate(-50%,-50%)",
    width: 300, height: 70, pointerEvents: "none", zIndex: 4,
    filter: "blur(11px)", mixBlendMode: "screen",
    transition: "opacity .5s cubic-bezier(.4,0,.2,1)",
  },
  camRig: {
    position: "relative", zIndex: 2, width: "100%",
    transformOrigin: "50% 46%", willChange: "transform",
    transition: "transform 1.6s cubic-bezier(.4,0,.2,1)",
  },
  /* room only lifts a little — never a flash */
  roomLift: {
    position: "fixed", inset: 0, zIndex: 55, pointerEvents: "none",
    mixBlendMode: "screen", filter: "blur(30px)",
    transition: "opacity .9s cubic-bezier(.4,0,.2,1)",
  },

  iconRise: { position: "absolute", left: "50%", top: "30%", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 8 },

  cardOuter: { maxWidth: 380, width: "100%", borderRadius: 16, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)" },
  cardTop: { height: 4 },
  card: { background: "linear-gradient(180deg,#23272E,#191C21)", padding: "30px 32px", textAlign: "center" },
  cRar: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 11.5, letterSpacing: "0.32em" },
  cIcon: { position: "relative", display: "flex", justifyContent: "center", margin: "20px 0 14px" },
  cIconGlow: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 220, height: 220, pointerEvents: "none" },
  cName: { fontSize: 16.5, fontWeight: 600, lineHeight: 1.4, color: "#DDE1E6" },
  cVal: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 900, fontSize: 38, marginTop: 4, background: `linear-gradient(180deg,${YEL_HI},${YEL_DK})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  cRt: { fontSize: 11.5, color: "#6B7078", fontFamily: "'Barlow',sans-serif", fontWeight: 400, WebkitTextFillColor: "#6B7078" },
  cActions: { display: "flex", gap: 10, marginTop: 18 },
  cStash: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
    marginTop: 16, padding: "9px 12px", borderRadius: 9,
    background: "rgba(123,192,138,0.07)", border: "1px solid rgba(123,192,138,0.22)",
    color: "#7BC08A", fontFamily: "'Big Shoulders Display',sans-serif",
    fontWeight: 700, fontSize: 10, letterSpacing: "0.16em",
  },
  again: { flex: 1.25, background: `linear-gradient(160deg,${YEL_HI},${YEL})`, color: INK, border: "none", padding: "13px 8px", borderRadius: 10, fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "0.08em", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.55), 0 8px 20px rgba(232,185,15,0.18)" },
  home: { flex: 1, background: "#262A31", color: "#C6CBD2", border: "1px solid rgba(255,255,255,0.09)", padding: "13px 8px", borderRadius: 10, fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 800, fontSize: 13.5, letterSpacing: "0.06em", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 },
  bSub: { fontFamily: "'Barlow',sans-serif", fontWeight: 400, fontSize: 9.5, letterSpacing: 0, opacity: 0.65 },

  /* bottom nav */
  nav: {
    position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 30,
    display: "flex", justifyContent: "center", gap: 4,
    padding: "8px 16px calc(10px + env(safe-area-inset-bottom, 0px))",
    background: "rgba(12,14,17,0.82)", backdropFilter: "blur(16px)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  navBtn: {
    flex: 1, maxWidth: 150, background: "none", border: "none", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    padding: "6px 4px 4px", position: "relative",
  },
  navLbl: { fontFamily: "'Big Shoulders Display',sans-serif", fontWeight: 700, fontSize: 9.5, letterSpacing: "0.2em", transition: "color .25s" },
  navDot: { width: 14, height: 2, borderRadius: 1, background: YEL, transition: "opacity .25s", boxShadow: `0 0 8px ${YEL}88` },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
* { -webkit-tap-highlight-color: transparent; }
::-webkit-scrollbar { display: none; }
button:focus-visible { outline: 2px solid rgba(232,185,15,0.8); outline-offset: 2px; }

@keyframes fadeIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:none;} }
.fade { animation: fadeIn .45s cubic-bezier(.2,.8,.2,1) both; }
@keyframes rowIn { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:none;} }
.row { animation: rowIn .4s ease both; }
@keyframes barIn { from{transform:scaleX(0);} to{transform:scaleX(1);} }
.bar { animation: barIn .8s cubic-bezier(.2,.8,.2,1) both; }
@keyframes tierIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:none;} }
.tier-in { animation: tierIn .42s cubic-bezier(.2,.8,.2,1) both; }
@keyframes crateReady { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-5px) scale(1.012);} }
.crate-ready { animation: crateReady 2.8s ease-in-out infinite; }
@keyframes tapCue { 0%,100%{opacity:.55;} 50%{opacity:1;} }
.tap-cue { animation: tapCue 2.2s ease-in-out infinite; }
@keyframes crateFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-7px);} }
.crate-float { animation: crateFloat 4.5s ease-in-out infinite; }

/* medium-aggressive shake — plays only while the lid lifts off, for the jolt
   of excitement. Fast, punchy, small-amplitude translation + a touch of
   rotation so it reads as the box rattling rather than sliding. */
@keyframes crateShakeMid {
  0%,100% { transform: translate(0,0) rotate(0); }
  10% { transform: translate(-4px,2px) rotate(-1deg); }
  20% { transform: translate(5px,-2px) rotate(1.1deg); }
  30% { transform: translate(-5px,1px) rotate(-1.2deg); }
  40% { transform: translate(5px,-1px) rotate(1deg); }
  50% { transform: translate(-4px,2px) rotate(-0.9deg); }
  60% { transform: translate(4px,-2px) rotate(1deg); }
  70% { transform: translate(-3px,1px) rotate(-0.8deg); }
  80% { transform: translate(3px,-1px) rotate(0.7deg); }
  90% { transform: translate(-2px,1px) rotate(-0.5deg); }
}
.shake-mid { animation: crateShakeMid 0.09s linear infinite; }

/* silver glint — sweeps across the centered crate every few seconds */
@keyframes glintSweep { 0%,72% { transform: skewX(-16deg) translateX(0); } 88%,100% { transform: skewX(-16deg) translateX(430px); } }
.glint { animation: glintSweep 5.2s ease-in-out infinite; }

/* atmosphere */
@keyframes poolDriftA { from{transform:translateX(-2.5%);} to{transform:translateX(2.5%);} }
@keyframes poolDriftB { from{transform:translateX(2%);} to{transform:translateX(-2%);} }
.pool-a { animation: poolDriftA 34s ease-in-out infinite alternate; }
.pool-b { animation: poolDriftB 27s ease-in-out infinite alternate; }
@keyframes dustFloat {
  0%   { transform: translateY(104vh) translateX(0); }
  50%  { transform: translateY(48vh) translateX(14px); }
  100% { transform: translateY(-6vh) translateX(-8px); }
}
.dust { position:absolute; top:0; border-radius:50%; background:#fff; animation: dustFloat linear infinite; }

/* ceremony */


/* The tool doesn't pop — it resolves out of the light and settles,
   with a whisper of rotation so it reads as a real object being lifted. */
@keyframes iconEmerge {
  0%   { opacity: 0; transform: translate(-50%, -14%) scale(.72) rotate(-3.5deg); filter: blur(9px) brightness(1.9); }
  30%  { opacity: 1; filter: blur(4px) brightness(1.45); }
  70%  { transform: translate(-50%, calc(-50% - 100px)) scale(1.015) rotate(.8deg); filter: blur(.6px) brightness(1.1); }
  100% { opacity: 1; transform: translate(-50%, calc(-50% - 96px)) scale(1) rotate(0deg); filter: blur(0) brightness(1); }
}
.icon-emerge { animation: iconEmerge 1.9s cubic-bezier(.22,.61,.16,1) both; }

/* the camera is never perfectly locked off */
@keyframes camDrift {
  0%   { transform: translate3d(-4px, 1px, 0) rotate(-0.18deg); }
  100% { transform: translate3d(4px, -1px, 0) rotate(0.18deg); }
}
.cam-drift > * { animation: camDrift 13s ease-in-out infinite alternate; }

/* swipe prompt */
@keyframes promptIn { from{opacity:0;transform:translate(-50%,10px);} to{opacity:1;transform:translate(-50%,0);} }
.prompt-in { animation: promptIn .5s cubic-bezier(.2,.9,.3,1) both; }
@keyframes chevPulse { 0%,100%{transform:translateY(4px);opacity:.6;} 50%{transform:translateY(-4px);opacity:1;} }
.chev-pulse { animation: chevPulse 1.5s ease-in-out infinite; }

@keyframes stashIn { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:none;} }
.stash-in { animation: stashIn .5s cubic-bezier(.2,.9,.3,1) .45s both; }
@keyframes revealIn { from{opacity:0;transform:translateY(14px) scale(.97);} to{opacity:1;transform:none;} }
.reveal-in { animation: revealIn .6s cubic-bezier(.2,.9,.25,1) .08s both; }

@keyframes tileIn { from{opacity:0;transform:translateY(8px) scale(.96);} to{opacity:1;transform:none;} }

/* ================= GARAGE ================= */
/* gentle camera drift — the room breathes instead of sitting flat */
@keyframes garDrift {
  0%   { transform: rotateX(2.2deg) rotateY(-0.7deg) translate3d(-5px,0,0); }
  100% { transform: rotateX(2.2deg) rotateY(0.7deg)  translate3d(5px,0,0); }
}
.gar-drift { animation: garDrift 19s ease-in-out infinite alternate; }

@keyframes garTileIn { from{opacity:0;transform:translate3d(0,14px,0) scale(.94);} to{opacity:1;transform:none;} }
.gar-tile {
  position: relative; display: flex; flex-direction: column; align-items: center;
  padding-top: 16px; cursor: pointer;
  animation: garTileIn .5s cubic-bezier(.2,.8,.2,1) both;
  transition: transform .34s cubic-bezier(.2,1,.3,1), filter .34s;
  transform-origin: 50% 90%; will-change: transform;
}
/* tap/hover: slight lift + gentle rotation, shadow expands under it */
.gar-tile:hover   { transform: translate3d(0,-6px,0) rotate(-0.9deg) scale(1.03); filter: brightness(1.06); }
.gar-tile:active  { transform: translate3d(0,-2px,0) rotate(-.4deg) scale(1.012); }
.gar-tile:hover .gar-contact,
.gar-tile:hover .gar-shelf { transform: scaleX(1.13); opacity: .95; }
.gar-tile:hover .gar-spot  { opacity: 1 !important; }
.gar-tile:hover .gar-wallShadow { transform: translateX(-46%) rotate(-2deg) scale(1.14); opacity: .85; }
.gar-wallShadow { transition: transform .34s cubic-bezier(.2,1,.3,1), opacity .34s; }

.gar-spot { position:absolute; top:-16px; left:50%; transform:translateX(-50%); width:150%; height:150%; pointer-events:none; transition:opacity .34s; z-index:0; }
.gar-halo { position:absolute; top:46%; left:50%; transform:translate(-50%,-50%); width:130%; height:130%; pointer-events:none; }

.gar-hookWrap { position:relative; height:16px; width:100%; display:flex; justify-content:center; }
.gar-hole {
  position:absolute; top:0; left:calc(50% - 9px); width:7px; height:7px; border-radius:50%;
  background:radial-gradient(circle at 40% 30%, #000 0%, #05070A 72%);
  box-shadow: inset 0 1.5px 1px rgba(0,0,0,.95), 0 1px 0 rgba(255,255,255,.09);
}
.gar-hole2 { left:calc(50% + 2px); }
/* twin-prong hook with a visible mounting screw */
.gar-hook {
  position:absolute; top:5px; left:50%; transform:translateX(-50%);
  width:18px; height:14px; border-bottom:2.5px solid #AEB8C4; border-left:2px solid #8E98A4; border-right:2px solid #7A838E;
  border-radius:0 0 9px 9px;
  box-shadow:0 2px 3px rgba(0,0,0,.65), inset 0 -1px 0 rgba(255,255,255,.28);
}
.gar-holeRow {
  position:absolute; top:2px; left:50%; transform:translateX(-50%); width:58px; height:7px;
  background:
    radial-gradient(circle at 3px 2.2px, rgba(255,255,255,.06) 1.4px, transparent 1.5px) 0 0 / 19px 7px,
    radial-gradient(circle at 3px 3px, rgba(0,0,0,.62) 1.25px, transparent 1.35px) 0 0 / 19px 7px;
}

.gar-art { position:relative; display:flex; align-items:flex-end; justify-content:center; width:100%; }
.gar-artInner { position:relative; z-index:1; filter: drop-shadow(0 9px 9px rgba(0,0,0,.5)); }
/* the tool throws a soft shadow back onto the pegboard */
.gar-wallShadow {
  position:absolute; left:50%; bottom:2px; transform:translateX(-46%) rotate(-2deg);
  width:74%; height:72%; border-radius:44%; pointer-events:none; z-index:0;
  background:radial-gradient(closest-side, rgba(0,0,0,.5), transparent 78%);
  filter:blur(7px);
}

/* mythic shimmer — a slow specular pass, nothing gaudy */
@keyframes garShimmer { 0%,68% { transform: translateX(-140%) skewX(-18deg); } 88%,100% { transform: translateX(240%) skewX(-18deg); } }
.gar-shimmer {
  position:absolute; inset:0; z-index:2; pointer-events:none; overflow:hidden;
  background:linear-gradient(100deg, transparent 34%, rgba(255,246,214,.5) 50%, transparent 66%);
  animation: garShimmer 4.6s ease-in-out infinite; mix-blend-mode:screen;
}

/* contact shadow for hanging tools; real plank for shelved ones */
.gar-contact {
  width:58px; height:9px; border-radius:50%; margin-top:6px;
  background:rgba(0,0,0,.55); filter:blur(5px);
  transition: transform .34s cubic-bezier(.2,1,.3,1), opacity .34s; opacity:.8;
}
.gar-shelf {
  position:relative; width:86%; height:8px; margin-top:8px; border-radius:2px 2px 0 0;
  /* top surface catching the overhead light */
  background:linear-gradient(180deg,#A3AEBA 0%,#7C8691 44%,#59626B 100%);
  box-shadow:0 10px 18px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.45);
  transition: transform .34s cubic-bezier(.2,1,.3,1), opacity .34s;
}
.gar-shelfElite { background:linear-gradient(180deg,#DCC489 0%,#AE8F4E 44%,#6E5828 100%); }
.gar-shelfLip { position:absolute; left:0; right:0; top:-2px; height:2px; background:rgba(255,255,255,.32); border-radius:2px; }
/* front edge — this is what sells shelf depth */
.gar-shelfFace {
  position:absolute; left:0; right:0; top:8px; height:6px; border-radius:0 0 2px 2px;
  background:linear-gradient(180deg,#3F464E 0%,#262C32 60%,#171B1F 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.13), 0 6px 12px rgba(0,0,0,.55);
}
.gar-brkL, .gar-brkR {
  position:absolute; top:13px; width:6px; height:13px; border-radius:0 0 2px 2px;
  background:linear-gradient(180deg,#5B646E,#2B3137);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.2);
}
.gar-brkL { left:15%; } .gar-brkR { right:15%; }

.gar-plate { display:flex; align-items:center; gap:6px; margin-top:12px; max-width:100%; padding:0 4px; }
.gar-pip { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.gar-name {
  font-size:11.5px; font-weight:500; color:#BFC5CD; line-height:1.3; text-align:center;
  overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
}
.gar-val { font-family:'Big Shoulders Display',sans-serif; font-weight:800; font-size:16px; margin-top:3px; }

/* empty hooks — visible room to grow */
.gar-empty { cursor:default; opacity:.5; }
.gar-empty:hover { transform:none; filter:none; }
.gar-emptyGhost {
  width:60px; height:60px; margin-top:26px; border-radius:10px;
  border:1px dashed rgba(255,255,255,.09); background:rgba(255,255,255,.012);
}

/* newly won tool: slides into its slot, then a light sweeps across it */
@keyframes garLand {
  0%   { opacity:0; transform: translate3d(0,-38px,0) scale(.9) rotate(-5deg); }
  62%  { opacity:1; transform: translate3d(0,5px,0)   scale(1.03) rotate(1.2deg); }
  100% { opacity:1; transform:none; }
}
@keyframes garSweep { 0% { transform:translateX(-130%) skewX(-20deg); opacity:0; } 18%,52% { opacity:1; } 100% { transform:translateX(230%) skewX(-20deg); opacity:0; } }
.gar-new { animation: garLand .78s cubic-bezier(.2,1,.3,1) both; }
.gar-new::after {
  content:""; position:absolute; inset:0; z-index:3; pointer-events:none;
  background:linear-gradient(100deg, transparent 36%, rgba(255,248,220,.62) 50%, transparent 64%);
  animation: garSweep 1.15s ease-out .5s 2 both; mix-blend-mode:screen;
}

@keyframes tdIn { from{opacity:0;transform:translateY(18px) scale(.96);} to{opacity:1;transform:none;} }
.td-in { animation: tdIn .34s cubic-bezier(.2,.9,.25,1) both; }
.tile { animation: tileIn .45s cubic-bezier(.2,.9,.3,1) both; transition: transform .18s ease, box-shadow .18s ease; }
.tile:hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(0,0,0,0.5); }

.logo-sheen::after { content:""; position:absolute; inset:0; background: linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.5) 46%, rgba(255,255,255,0.12) 54%, transparent 68%); transform: translateX(-110%); animation: logoSweep 6s ease-in-out infinite; }
@keyframes logoSweep { 0%,74%{transform:translateX(-110%);} 88%,100%{transform:translateX(110%);} }

.press { transition: transform .1s, filter .15s, box-shadow .2s; }
.press:hover { filter: brightness(1.07); }
.press:active { transform: scale(.97); }
.gold:hover { box-shadow: 0 14px 34px rgba(232,185,15,0.28), inset 0 2px 0 rgba(255,255,255,0.65); }
.link:hover { color: #E9EBEE !important; }
button:disabled { opacity:.4; cursor:not-allowed; }

@media (prefers-reduced-motion: reduce) {
  .fade,.row,.bar,.tier-in,.crate-float,.reveal-in,.shake-mid,
  .icon-emerge,.pool-a,.pool-b,.dust,.tile,.glint,.chev-pulse,.prompt-in,.stash-in,.crate-ready,.tap-cue,
  .gar-drift,.gar-tile,.gar-new,.gar-shimmer,.td-in,.cam-drift > * { animation: none !important; }
  .gar-new::after, .logo-sheen::after { animation: none !important; }
  .gar-tile:hover { transform: none; }
}
`;


ReactDOM.createRoot(document.getElementById("root")).render(<ToolCrate />);
