+++
title = "Road Trip 2026"
date = 2026-02-07
client_type = "personal / travel"
site_type = "new"
live_url = "https://rt2026.benstrawbridge.com"
case_study = true
weight = 2
+++

"The Road" is a nine-day, 3,753-mile drive from Philadelphia to Los Angeles — a father-and-son trip across 14 states in a red Tacoma, kept as photographs and a continuous GPS record, then built into a site you can travel through rather than just look at.

The journey runs day by day: Philly, Charlotte, Montgomery, Jackson, Austin, Terlingua, Big Bend, Tucson, Los Angeles. Each day carries its own photographs next to the stretch of road they came from, so a picture sits with the place and the moment it belongs to instead of in an undifferentiated pile. Every photograph is also collected into one gallery, for anyone who'd rather just look through them. Alongside the journey the site keeps a map book and an almanac.

Underneath all of it are nine GPX files from a Garmin GPS. The site maps each day's route, visualizes elevation profiles, segments speed by terrain, and replays the whole drive as an animation. No backend, no paid APIs. Static HTML, Leaflet for maps, and D3 for data visualization, all served from a CDN.

The interesting technical problem was the data itself. Raw GPS recordings are dense and noisy — the point density needed for archival accuracy is completely wrong for animation. The solution was LTTB downsampling, which preserves peaks and inflections while dramatically reducing point counts. Naive stride sampling, the obvious approach, flattened the elevation charts.

Built with Astro. A personal project where the photographs and the drive are the point, and the data is what makes them navigable.

Read the [full technical write-up](https://www.benstrawbridge.com/projects/road-trip/) for the data pipeline, the GPS cleaning decisions, and the map tile testing.
