# W7-8c — Shared photography-frame consistency

Status: implementation-complete  
Reviewed: 2026-09-30

## Scope

Normalize the reusable city-photography surfaces found during the Wave 7 site-wide consistency pass.

## Change

- `CityPhoto` and `PhotoCarousel` now share the `bm-photo-frame` visual primitive.
- The frame uses the established Wave 7 soft border, card radius, paper surface and resting elevation tokens.
- Existing crops, object positions, aspect ratios, loading priority, fallbacks, carousel behavior, attribution and accessibility remain unchanged.

## Guard

`check:wave7-photo-frame` verifies both shared photo components consume the common frame and that the frame retains its Wave 7 token contract. The guard runs in build and quality.

## Next

After CI verifies this slice, continue W7-8 with the next bounded site-wide visual/responsive QA class.
