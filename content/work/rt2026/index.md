+++
title = "Road Trip 2026"
date = 2026-01-01
client_type = "personal / travel"
site_type = "new"
live_url = "https://rt2026.benstrawbridge.com"
case_study = true
weight = 5
+++

A 9-day, 3,753-mile drive from Philadelphia to Los Angeles — documented through nine GPX files from a Garmin GPS and turned into an interactive web experience.

The site maps each day's route, visualizes elevation profiles, segments speed by terrain, and replays the trip as an animation. No backend, no paid APIs. Static HTML, Leaflet for maps, and D3 for data visualization, all served from a CDN.

The interesting technical problem was the data itself. Raw GPS recordings are dense and noisy — the point density needed for archival accuracy is completely wrong for animation. The solution was LTTB downsampling (Largest Triangle Three Buckets), which preserves peaks and inflections while dramatically reducing point counts. Naive stride sampling, the obvious approach, flattened the elevation charts.

GPS noise also clusters predictably in urban corridors and under overpasses, which made cleaning decisions systematic rather than arbitrary. One day's GPX file had to be replaced entirely after an early error surfaced in the data pipeline.

The tile provider for the map matters more than it seems — eight providers tested, Carto Voyager for overview context, Dark Matter for dense overlays.

Built with Astro. A personal project that turned a road trip into a data story.
