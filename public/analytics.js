// Simple analytics tracking script for Speak About AI website
(function() {
  'use strict';

  // Disable analytics if blocked by extensions or in certain environments
  try {
    const isBlocked = window.location.protocol === 'chrome-extension:' || 
                     window.location.protocol === 'moz-extension:';
    
    if (isBlocked) {
      console.debug('Analytics disabled: browser extension environment detected');
      return;
    }
  } catch (e) {
    // Continue if check fails
  }

  // Check if analytics is opted in
  function hasAnalyticsConsent() {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) return false;
      const parsed = JSON.parse(consent);
      return parsed.analytics === true;
    } catch {
      return false;
    }
  }

  // Track page view with additional client-side data
  function trackPageView() {
    if (!hasAnalyticsConsent()) return;
    
    try {
      // Get page title and send it to the middleware via header
      const pageTitle = document.title;
      
      // Send page title via fetch to a tracking endpoint
      // This allows us to capture the title after client-side rendering
      fetch('/api/analytics/page-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageTitle: pageTitle,
          screenResolution: `${screen.width}x${screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          referrer: document.referrer || undefined
        })
      }).catch(() => {
        // Fail silently - don't break the site if analytics fails
      });
    } catch (error) {
      // Fail silently
    }
  }

  // Track custom events
  function trackEvent(eventName, eventCategory, eventValue, metadata) {
    if (!hasAnalyticsConsent()) return;
    
    try {
      // Check if fetch is available and not blocked
      if (typeof fetch === 'undefined') return;
      
      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName,
          eventCategory,
          eventValue,
          metadata
        }),
        signal: controller.signal
      }).then(() => {
        clearTimeout(timeoutId);
      }).catch((error) => {
        clearTimeout(timeoutId);
        // Fail silently - analytics should not break the site
        if (error.name !== 'AbortError') {
          console.debug('Analytics event failed:', eventName);
        }
      });
    } catch (error) {
      // Fail silently - analytics should not break the site
      console.debug('Analytics error:', error.message);
    }
  }

  // Auto-track common events
  function setupEventTracking() {
    // Track contact form submissions
    document.addEventListener('submit', function(e) {
      if (e.target.matches('form[data-track="contact"]') || 
          e.target.querySelector('input[type="email"]')) {
        trackEvent('contact_form_submit', 'conversion', null, {
          form: e.target.action || window.location.pathname
        });
      }
    });

    // Track speaker card interactions
    document.addEventListener('click', function(e) {
      if (e.target.closest('[data-speaker-id]')) {
        const speakerId = e.target.closest('[data-speaker-id]').dataset.speakerId;
        trackEvent('speaker_view', 'engagement', null, {
          speakerId: speakerId,
          page: window.location.pathname
        });
      }
    });

    // Track external link clicks
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href]');
      if (link && link.hostname !== window.location.hostname) {
        trackEvent('external_link_click', 'engagement', null, {
          url: link.href,
          text: link.textContent?.trim() || 'unknown'
        });
      }
    });

    // Track video plays (if any)
    document.addEventListener('play', function(e) {
      if (e.target.tagName === 'VIDEO') {
        trackEvent('video_play', 'engagement', null, {
          src: e.target.src || e.target.currentSrc,
          duration: e.target.duration || null
        });
      }
    }, true);

    // Track scroll depth
    let maxScroll = 0;
    let scrollTracked = false;
    let scrollTimer = null;
    
    function trackScrollDepth() {
      try {
        // Prevent division by zero
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) return;
        
        const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
        maxScroll = Math.max(maxScroll, scrollPercent);
        
        // Track at 25%, 50%, 75%, and 100% scroll
        if (!scrollTracked && (maxScroll >= 75)) {
          scrollTracked = true;
          trackEvent('scroll_depth', 'engagement', maxScroll, {
            page: window.location.pathname
          });
        }
      } catch (error) {
        // Fail silently
        console.debug('Scroll tracking error:', error.message);
      }
    }
    
    // Throttle scroll events to prevent excessive calls
    function handleScroll() {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(trackScrollDepth, 150);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Initialize when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      trackPageView();
      setupEventTracking();
    });
  } else {
    trackPageView();
    setupEventTracking();
  }

  // Track page changes in SPA
  let lastPath = window.location.pathname;
  
  function checkForPageChange() {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      trackPageView();
    }
  }

  // Monitor for navigation changes (for SPA behavior)
  setInterval(checkForPageChange, 1000);

  // Expose trackEvent function globally for manual tracking
  window.trackEvent = trackEvent;

})();