# ZQM Labs website source

This repository contains the canonical public website content and Hugo source
for **ZQM Labs — Z's Quests & Mischief**.

ZQM Labs is a community-centered game studio. **Wisp's Lost Lanterns** is the
current featured Halloween experience; the site is structured to support
additional games as they become ready for public play.

## Production and validation

The production website is published through the Cloudflare Pages deployment
pipeline. This repository runs CI to validate the shared marketing pages,
fetch the canonical player app, verify script order and offline precache
assets, and build the Hugo site. It does not publish a second competing
GitHub Pages deployment.

The public copy describes current availability honestly: a global audience
and community-centered design do not imply that every game, language, event
kit, or in-person service is available worldwide.

## Build locally

```sh
hugo --gc --minify
hugo server -D
```

To refresh the bundled player before a local build:

```sh
bash scripts/sync-player.sh main
```

## Main pages

- Home: current featured game and studio overview
- Games: the growing collection of experiences
- Community: playtesting, feedback, and participation
- Halloween: the current Halloween game category
- Host a Game: current Wisp's Lost Lanterns hosting options
- About and FAQ: studio and availability details
