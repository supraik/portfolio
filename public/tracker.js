/**
 * First-Party Privacy-Preserving Analytics Tracker
 * Size: < 2 KB minified
 * Features: Cookieless, zero third-party dependencies, DNT/GPC compliance.
 */
(function() {
  "use strict";

  // Check admin opt-out flag
  try {
    if (localStorage.getItem("analytics_ignore") === "true") return;
  } catch(e) {}

  // Check DNT and Global Privacy Control
  var dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.msDoNotTrack === "1";
  var gpc = navigator.globalPrivacyControl === true;

  var currentPath = window.location.pathname;
  var startTime = Date.now();
  var maxScroll = 0;
  var sessionId = null;

  // Extract share link identifier ?r=acme-backend-role
  var urlParams = new URLSearchParams(window.location.search);
  var shareLink = urlParams.get("r") || undefined;

  function sendTelemetry(type, extra) {
    if (dnt || gpc) {
      // Respect DNT/GPC: anonymized count without session linking
      extra = extra || {};
      extra.sessionId = undefined;
      extra.shareLink = undefined;
    }

    var payload = Object.assign({
      type: type,
      path: currentPath,
      title: document.title,
      referrer: document.referrer || undefined,
      shareLink: shareLink,
      durationMs: Math.max(0, Date.now() - startTime),
      scrollPct: maxScroll,
      sessionId: sessionId,
    }, extra || {});

    var body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/collect", body);
    } else {
      fetch("/api/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        keepalive: true,
      }).catch(function() {});
    }
  }

  // Scroll tracking
  function onScroll() {
    var h = document.documentElement;
    var b = document.body;
    var st = "scrollTop";
    var sh = "scrollHeight";
    var percent = Math.round(((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100);
    if (!isNaN(percent) && percent > maxScroll) {
      maxScroll = Math.min(100, percent);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Initial pageview
  sendTelemetry("pageview");

  // Page leave / visibilitychange flush
  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
      sendTelemetry("pageview", {
        durationMs: Date.now() - startTime,
        scrollPct: maxScroll,
      });
    }
  });

  // Global event tracker API for client clicks
  window.__trackEvent = function(name, props) {
    sendTelemetry("event", {
      eventName: name,
      eventProps: props || {},
    });
  };
})();
