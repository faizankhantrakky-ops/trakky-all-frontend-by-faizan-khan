import React, { useEffect, useLayoutEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import "./offerguide.css";

const STEPS = [
  {
    title: "Live Offers Available",
    description:
      "This salon currently has these special offers running — exclusive deals available for a limited time.",
    targetSelector: ".N-Profile-page-offers",
    padding: 6,
  },
  {
    title: "Tap to view details",
    description:
      "Tap on any offer card to view full details, services and terms.",
    targetSelector: ".N-Profile-page-offer-card",
    padding: 8,
  },
  {
    title: "Book & Claim Offer",
    description:
      "Click 'Book Now' in the details modal to claim the offer and enjoy savings at this salon.",
    targetSelector: ".N-Profile-page-offer-card",
    padding: 8,
  },
];

const STORAGE_KEY = "trakky_offer_guide_seen_v1";
const TOOLTIP_WIDTH = 300;
const TOOLTIP_GAP = 14;
const VIEWPORT_PAD = 12;

const OfferGuide = ({ enabled }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, placement: "bottom" });

  // Open ONLY first time AND only when offer section actually scrolls into view
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch (e) {}

    const targetSelector = STEPS[0].targetSelector;
    let observer = null;
    let pollInterval = null;
    let openTimer = null;
    let triggered = false;

    const attach = () => {
      const el = document.querySelector(targetSelector);
      if (!el) return false;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (triggered) return;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
              triggered = true;
              // Mark seen immediately so it never re-triggers, even if user scrolls away
              try {
                window.localStorage.setItem(STORAGE_KEY, "1");
              } catch (e) {}
              openTimer = setTimeout(() => setOpen(true), 250);
              observer.disconnect();
            }
          });
        },
        { threshold: [0, 0.3, 0.6] }
      );
      observer.observe(el);
      return true;
    };

    if (!attach()) {
      // Element not yet in DOM (data still loading) — poll briefly
      pollInterval = setInterval(() => {
        if (attach()) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
      }, 250);
    }

    return () => {
      if (observer) observer.disconnect();
      if (pollInterval) clearInterval(pollInterval);
      if (openTimer) clearTimeout(openTimer);
    };
  }, [enabled]);

  // NOTE: We intentionally DO NOT lock body scroll. The parent salon profile page
  // already manages body.style.overflow for its own modals — locking here would
  // (a) collide with that, and (b) cause a layout shift (scrollbar removal)
  // which moves the offer cards by a few pixels => spotlight mismatch.
  // Instead, the .offer-guide-blocker (pointer-events: auto, position: fixed)
  // captures clicks so users must use Skip/Next/Back, and a scroll listener
  // keeps the spotlight glued to the target if the page scrolls.

  const measure = useCallback(() => {
    const step = STEPS[stepIndex];
    if (!step) return;
    const el = document.querySelector(step.targetSelector);
    if (!el) {
      setRect(null);
      return;
    }

    const r = el.getBoundingClientRect();

    // Skip update if rect is empty (element hidden / detached)
    if (r.width === 0 && r.height === 0) {
      setRect(null);
      return;
    }

    const pad = step.padding ?? 8;
    const spotRect = {
      top: r.top - pad,
      left: r.left - pad,
      width: r.width + pad * 2,
      height: r.height + pad * 2,
    };
    setRect(spotRect);

    // Decide placement: below if room, otherwise above
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const spaceBelow = vh - (spotRect.top + spotRect.height);
    const placement = spaceBelow > 200 ? "bottom" : "top";

    let top =
      placement === "bottom"
        ? spotRect.top + spotRect.height + TOOLTIP_GAP
        : spotRect.top - TOOLTIP_GAP;
    let left = spotRect.left + spotRect.width / 2 - TOOLTIP_WIDTH / 2;
    left = Math.max(VIEWPORT_PAD, Math.min(vw - TOOLTIP_WIDTH - VIEWPORT_PAD, left));

    setTooltipPos({ top, left, placement });
  }, [stepIndex]);

  // Bring target into view smoothly when step changes (does not measure here —
  // measurement runs on every scroll frame via the listener below).
  useEffect(() => {
    if (!open) return;
    const step = STEPS[stepIndex];
    const el = step ? document.querySelector(step.targetSelector) : null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const fullyVisible = r.top >= 0 && r.bottom <= window.innerHeight;
    if (!fullyVisible) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }, [open, stepIndex]);

  // Live alignment: measure on mount, on scroll (anywhere), on resize, and on
  // any size change of the target element. This guarantees the spotlight stays
  // glued to the target even during smooth-scroll, layout shifts, or font load.
  useLayoutEffect(() => {
    if (!open) return;

    let rafId = null;
    const schedule = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        measure();
      });
    };

    // First measurement immediately, then keep tracking every frame for ~600ms
    // to catch the smooth scroll settling.
    measure();
    let frames = 0;
    const trackUntilSettled = () => {
      measure();
      frames += 1;
      if (frames < 40) {
        rafId = requestAnimationFrame(trackUntilSettled);
      } else {
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(trackUntilSettled);

    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);

    let ro = null;
    const step = STEPS[stepIndex];
    const el = step ? document.querySelector(step.targetSelector) : null;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(schedule);
      ro.observe(el);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      if (ro) ro.disconnect();
    };
  }, [open, stepIndex, measure]);

  const close = () => {
    setOpen(false);
    setStepIndex(0);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {}
  };

  const next = () => {
    if (stepIndex < STEPS.length - 1) setStepIndex(stepIndex + 1);
    else close();
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  if (!open || !rect) return null;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const isFirst = stepIndex === 0;

  // Tooltip "translate" so top placement anchors the bottom of tooltip at the gap
  const tooltipStyle = {
    top: tooltipPos.top,
    left: tooltipPos.left,
    width: TOOLTIP_WIDTH,
    transform: tooltipPos.placement === "top" ? "translateY(-100%)" : "none",
  };

  // Portal directly to document.body so the guide escapes any parent
  // stacking context (transform/filter/will-change/isolation on ancestors)
  // that would otherwise cap our z-index and make page content bleed through.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="offer-guide-root" role="dialog" aria-modal="true" aria-label="Offer guide">
      {/* Click-blocking layer */}
      <div className="offer-guide-blocker" onClick={close} />

      {/* Spotlight cut-out (uses box-shadow trick to dim everything else) */}
      <div
        className="offer-guide-spotlight"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }}
      />

      {/* Tooltip */}
      <div className={`offer-guide-tooltip placement-${tooltipPos.placement}`} style={tooltipStyle}>
        <div className="offer-guide-step-meta">
          Step {stepIndex + 1} of {STEPS.length}
        </div>
        <h4 className="offer-guide-title">{step.title}</h4>
        <p className="offer-guide-desc">{step.description}</p>

        <div className="offer-guide-progress">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`offer-guide-dot ${i === stepIndex ? "active" : ""} ${
                i < stepIndex ? "done" : ""
              }`}
            />
          ))}
        </div>

        <div className="offer-guide-actions">
          <button type="button" className="offer-guide-skip" onClick={close}>
            Skip
          </button>
          <div className="offer-guide-actions-right">
            {!isFirst && (
              <button type="button" className="offer-guide-back" onClick={back}>
                Back
              </button>
            )}
            <button type="button" className="offer-guide-next" onClick={next}>
              {isLast ? "Got it" : "Next"}
              {!isLast && <span className="offer-guide-next-arrow">→</span>}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OfferGuide;
