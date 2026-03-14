+++
title = "Gordon Landreth Photography"
date = 2023-06-01
client_type = "family archive"
site_type = "new"
live_url = "https://gordon-landreth-photography.arts-link.com"
case_study = true
weight = 35
+++

Gordon Landreth was a photographer whose archive spanned six decades — 3,416 scanned family photo album pages. The challenge wasn't displaying the images; it was making them searchable.

Every album page had handwritten captions: names, dates, locations, events. The solution was an OCR pipeline that read those captions and built a search index, so relatives could find specific photographs by typing a name or a place.

The pipeline went through two phases. Tesseract and OpenCV handled rapid iteration during development. For production, a vision model (MiniCPM-V 2.6, run locally via LM Studio) handled the hard cases — faded ink, handwritten annotations, unusual formatting — significantly improving accuracy over the simpler OCR approach.

The search itself runs entirely in the browser. A pre-generated JSON index (~100KB gzipped) is loaded once, and Fuse.js handles fuzzy matching with a 0.4 threshold — loose enough to catch OCR errors and typos without returning noise. Results are grouped by album title matches versus caption matches.

The final site is a static Hugo build, hosted on AWS CloudFront. No backend, no infrastructure to maintain. Thumbnail previews and a PhotoSwipe lightbox ended up being more valuable than any of the query logic that was originally planned — a lesson in what users actually need versus what seems technically interesting.
