"use client";
import React, { useContext, useEffect, useRef, useState, useId } from "react";
import PageContent from "@/components/PageContent";
import { useParams } from "next/navigation";
import { PageContext } from "@/contexts/main";
import { getBookPages } from "@/actions/api";

/* PageWrapper — improved: scale-safe scrolling + body-height sync + rect-based scroll detection */
export default function PageWrapper() {
  const {
    currentPage,
    setCurrentPage,
    zoom,
    isShowAllPages,
    pagesCache,
    setPagesCache,
    setApplyZoom,
  } = useContext(PageContext);

  const params = useParams();
  const pageId = useId();

  const [loading, setLoading] = useState(false);
  const [renderPages, setRenderPages] = useState([]);

  const pageRefs = useRef({}); // pageNumber -> DOM element
  const manualScrollInProgressRef = useRef(false);

  const rangeCacheRef = useRef(new Map());
  const currentRangeKeyRef = useRef(null);

  const RANGE_SIZE = 20;
  const MAX_RANGES = 3;

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const now = () => Date.now();

  // image load listeners to recalc height after images arrive
  const imageListenersRef = useRef([]);

  const waitFor = async (fn, { interval = 80, timeout = 3000 } = {}) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const v = fn();
        if (v) return v;
      } catch (e) { }
      // eslint-disable-next-line no-await-in-loop
      await delay(interval);
    }
    return null;
  };

  const rangeStartForPage = (page) => Math.floor((page - 1) / RANGE_SIZE) * RANGE_SIZE + 1;
  const rangeKeyForStart = (start) => `${start}-${start + RANGE_SIZE - 1}`;

  const markRangeUsed = (key) => {
    const map = rangeCacheRef.current;
    if (!map.has(key)) return;
    const entry = map.get(key);
    entry.lastUsed = now();
    map.set(key, entry);
  };

  const addRangeToCache = (key, pagesArray) => {
    const map = rangeCacheRef.current;
    map.set(key, { pages: pagesArray, lastUsed: now() });
    if (map.size > MAX_RANGES) {
      let lruKey = null;
      let lruTime = Infinity;
      for (const [k, v] of map.entries()) {
        if (v.lastUsed < lruTime) {
          lruTime = v.lastUsed;
          lruKey = k;
        }
      }
      if (lruKey) map.delete(lruKey);
    }
  };

  const fetchPagesRange = async (startPage, limit = RANGE_SIZE) => {
    if (!params?.id) return [];
    setLoading(true);
    try {
      const resp = await getBookPages(params.id, startPage, limit);
      const pages = resp?.data || [];
      const newCache = { ...(pagesCache || {}) };
      pages.forEach((p) => {
        newCache[p.page_number] = p;
      });
      setPagesCache(newCache);
      return pages;
    } catch (e) {
      console.error("fetchPagesRange error", e);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const ensureRangeCached = async (pageNum) => {
    const start = rangeStartForPage(pageNum);
    const key = rangeKeyForStart(start);
    const map = rangeCacheRef.current;
    if (map.has(key)) {
      markRangeUsed(key);
      return map.get(key).pages;
    }
    const pages = await fetchPagesRange(start, RANGE_SIZE);
    addRangeToCache(key, pages);
    return pages;
  };

  const fetchAndReplaceRange = async (pageNum) => {
    const start = rangeStartForPage(pageNum);
    const key = rangeKeyForStart(start);
    const pages = await fetchPagesRange(start, RANGE_SIZE);
    addRangeToCache(key, pages);
    currentRangeKeyRef.current = key;
    setRenderPages(pages);
    return pages;
  };

  // ---------- helper: compute doc Y position of an element (visual) ----------
  const getElementDocTop = (el) => {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
  };

  // ---------- recalc body.height to visual wrapper height and attach image listeners ----------
  const recalcBodyHeightAndAttachImageHandlers = () => {
    const wrapper = document.getElementById("wrapper");
    if (!wrapper) return;

    const visualHeight = wrapper.getBoundingClientRect().height;
    if (visualHeight && isFinite(visualHeight)) {
      document.body.style.height = `${Math.ceil(visualHeight)}px`;
    }

    // attach image load listeners (so if images load later we recalc)
    // clear previous listeners
    if (imageListenersRef.current.length) {
      imageListenersRef.current.forEach(({ img, handler }) => img.removeEventListener("load", handler));
      imageListenersRef.current = [];
    }
    const imgs = Array.from(wrapper.querySelectorAll("img"));
    imgs.forEach((img) => {
      const handler = () => {
        // slight debounce to let layout settle
        setTimeout(recalcBodyHeightAndAttachImageHandlers, 50);
      };
      img.addEventListener("load", handler);
      imageListenersRef.current.push({ img, handler });
    });
  };

  const raf = () => new Promise((r) => requestAnimationFrame(r));

  const applyZoomNow = async ({ animate = false, keepPage = currentPage } = {}) => {
    const wrapper = document.getElementById("wrapper");
    if (!wrapper) return;
    const scroller = document.scrollingElement || document.documentElement || document.body;

    // 0. turn off scroll anchoring (prevent browser from auto-adjust)
    const prevHtmlAnchor = document.documentElement.style.overflowAnchor;
    const prevBodyAnchor = document.body.style.overflowAnchor;
    document.documentElement.style.overflowAnchor = "none";
    document.body.style.overflowAnchor = "none";

    // before
    const prevScrollTop = scroller.scrollTop;
    const wrapperRectBefore = wrapper.getBoundingClientRect();
    const wrapperAbsTopBefore = wrapperRectBefore.top + prevScrollTop;
    const wrapperVisualHeightBefore = wrapperRectBefore.height;
    const keepEl = pageRefs.current[keepPage];
    const keepAbsBefore = keepEl ? (keepEl.getBoundingClientRect().top + prevScrollTop) : null;

    manualScrollInProgressRef.current = true;

    // compute safe zoom
    wrapper.style.transform = "scale(1)";
    wrapper.style.transformOrigin = "top center";
    const container = wrapper.parentElement?.parentElement;
    const containerWidth = container ? container.offsetWidth : document.documentElement.clientWidth;
    const originalWidth = wrapper.getBoundingClientRect().width;
    const maxZoom = originalWidth > containerWidth ? Math.floor((containerWidth / originalWidth) * 100) : 200;
    const requestedZoom = zoom || 100;
    const safeZoom = Math.min(requestedZoom, maxZoom);

    // apply transition if animate
    if (animate) wrapper.style.transition = "transform 160ms ease";
    else wrapper.style.transition = "";

    // apply transform
    wrapper.style.transformOrigin = "top center";
    wrapper.style.transform = `scale(${safeZoom / 100})`;

    // wait two frames for stable repaint
    await raf();
    await raf();

    // after measurements
    const afterScrollTop = scroller.scrollTop;
    const wrapperRectAfter = wrapper.getBoundingClientRect();
    const wrapperAbsTopAfter = wrapperRectAfter.top + afterScrollTop;
    const wrapperVisualHeightAfter = wrapperRectAfter.height;
    const visualTotalAfter = Math.ceil(wrapperAbsTopAfter + wrapperVisualHeightAfter);
    let keepAbsAfter;

    // set html/body heights to visual bottom + small buffer
    const buffer = 4;
    const minHeight = Math.max(window.innerHeight + 1, visualTotalAfter + buffer);
    document.documentElement.style.height = `${minHeight}px`;
    document.body.style.height = `${minHeight}px`;

    // compute delta for anchor (if exists) and compensate
    if (keepAbsBefore != null && keepEl) {
      keepAbsAfter = keepEl.getBoundingClientRect().top + afterScrollTop;
      const delta = keepAbsAfter - keepAbsBefore;
      if (Math.abs(delta) > 0.5) {
        scroller.scrollTo({ top: scroller.scrollTop + delta, left: 0, behavior: "auto" });
      }
    } else {
      // fallback ratio approach
      const prevScrollable = Math.max((wrapperAbsTopBefore + wrapperVisualHeightBefore) - window.innerHeight, 0);
      const newScrollable = Math.max(visualTotalAfter - window.innerHeight, 0);
      if (prevScrollable > 0) {
        const ratio = prevScrollTop / prevScrollable;
        const newTop = Math.round(ratio * newScrollable);
        scroller.scrollTo({ top: newTop, left: 0, behavior: "auto" });
      } else {
        scroller.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    }

    // install a short-lived ResizeObserver to handle late image loads
    let ro;
    try {
      ro = new ResizeObserver(() => {
        const r = wrapper.getBoundingClientRect();
        const newVisualTotal = Math.ceil(r.top + (scroller.scrollTop || window.scrollY) + r.height);
        const newMin = Math.max(window.innerHeight + 1, newVisualTotal + 2);
        document.documentElement.style.height = `${newMin}px`;
        document.body.style.height = `${newMin}px`;
      });
      ro.observe(wrapper);
      // disconnect after 300ms
      setTimeout(() => { try { ro.disconnect(); } catch (e) { } }, 300);
    } catch (e) { }

    // short settle and restore
    setTimeout(() => {
      manualScrollInProgressRef.current = false;
      if (animate) wrapper.style.transition = "";
      // restore overflow anchor
      document.documentElement.style.overflowAnchor = prevHtmlAnchor || "";
      document.body.style.overflowAnchor = prevBodyAnchor || "";
    }, 140);


    console.log("before", { prevScrollTop, wrapperAbsTopBefore, wrapperVisualHeightBefore, keepAbsBefore });
    console.log("after", { afterScrollTop, wrapperAbsTopAfter, wrapperVisualHeightAfter, visualTotalAfter });
    console.log("computed", { minHeight, delta: (keepAbsAfter ? keepAbsAfter - keepAbsBefore : null) });
  };




  // expose applyZoom to context
  useEffect(() => {
    setApplyZoom(() => (opts = {}) => applyZoomNow(opts));
  }, [setApplyZoom, zoom]); // eslint-disable-line

  // auto-apply zoom when pages render or zoom changes
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      if (!cancelled) applyZoomNow({ animate: true }).catch(() => { });
    }, 60);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderPages, zoom]);

  // ---------- robust scrollToPage ----------
  const scrollToPage = async (pageNum) => {
    if (!pageNum) return;
    await ensureRangeCached(pageNum);

    if (isShowAllPages) {
      const targetStart = rangeStartForPage(pageNum);
      const targetKey = rangeKeyForStart(targetStart);
      const cached = rangeCacheRef.current.get(targetKey);
      if (cached) {
        if (currentRangeKeyRef.current !== targetKey) {
          currentRangeKeyRef.current = targetKey;
          setRenderPages(cached.pages);
        }
      } else {
        await fetchAndReplaceRange(pageNum);
      }
    } else {
      await ensureRangeCached(pageNum);
      const pageObj =
        pagesCache[pageNum] ||
        (rangeCacheRef.current.get(rangeKeyForStart(rangeStartForPage(pageNum)))?.pages || []).find((p) => p.page_number === pageNum);
      setRenderPages(pageObj ? [pageObj] : []);
    }

    const el = await waitFor(() => pageRefs.current[pageNum], { interval: 60, timeout: 2500 });
    if (!el) {
      setCurrentPage(pageNum);
      if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${pageNum}`);
      return;
    }

    manualScrollInProgressRef.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // wait until element's visual top close to viewport top
    await waitFor(() => {
      const rect = el.getBoundingClientRect();
      return Math.abs(rect.top) < 8;
    }, { interval: 40, timeout: 1400 });

    await delay(120);
    setCurrentPage(pageNum);
    if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${pageNum}`);
    manualScrollInProgressRef.current = false;
  };

  // expose window.pdfNavigator.goTo
  useEffect(() => {
    window.pdfNavigator = window.pdfNavigator || {};
    window.pdfNavigator.goTo = async (page) => {
      const p = Number(page) || Number(currentPage) || 1;
      await scrollToPage(p);
    };
    return () => {
      if (window.pdfNavigator && window.pdfNavigator.goTo) delete window.pdfNavigator.goTo;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isShowAllPages]);

  // ---------- initialization ----------
  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      const qp = new URLSearchParams(window.location.search).get("page");
      const fromUrl = qp ? parseInt(qp, 10) : null;
      const initialPage = Number.isFinite(fromUrl) && fromUrl > 0 ? fromUrl : currentPage || 1;
      await ensureRangeCached(initialPage);

      if (isShowAllPages) {
        const start = rangeStartForPage(initialPage);
        const key = rangeKeyForStart(start);
        const cached = rangeCacheRef.current.get(key);
        if (cached) {
          currentRangeKeyRef.current = key;
          setRenderPages(cached.pages);
        } else {
          const pages = await fetchAndReplaceRange(initialPage);
          setRenderPages(pages);
        }
      } else {
        const pageObj =
          pagesCache[initialPage] ||
          (rangeCacheRef.current.get(rangeKeyForStart(rangeStartForPage(initialPage)))?.pages || []).find((p) => p.page_number === initialPage);
        setRenderPages(pageObj ? [pageObj] : []);
      }

      if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${initialPage}`);
      setCurrentPage(initialPage);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  // ---------- respond to currentPage changes ----------
  useEffect(() => {
    if (manualScrollInProgressRef.current) return;
    (async () => {
      const target = currentPage;
      if (!target) return;
      if (isShowAllPages) {
        const start = rangeStartForPage(target);
        const targetKey = rangeKeyForStart(start);
        const currentKey = currentRangeKeyRef.current;

        if (targetKey === currentKey) {
          const el = await waitFor(() => pageRefs.current[target], { interval: 60, timeout: 1000 });
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${target}`);
            return;
          }
        }

        if (rangeCacheRef.current.has(targetKey)) {
          currentRangeKeyRef.current = targetKey;
          setRenderPages(rangeCacheRef.current.get(targetKey).pages);
          const el2 = await waitFor(() => pageRefs.current[target], { interval: 60, timeout: 1200 });
          if (el2) {
            el2.scrollIntoView({ behavior: "smooth", block: "start" });
            if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${target}`);
            return;
          }
        }

        await fetchAndReplaceRange(target);
        const el3 = await waitFor(() => pageRefs.current[target], { interval: 60, timeout: 1200 });
        if (el3) el3.scrollIntoView({ behavior: "smooth", block: "start" });
        if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${target}`);
      } else {
        await ensureRangeCached(target);
        const pageObj =
          pagesCache[target] ||
          (rangeCacheRef.current.get(rangeKeyForStart(rangeStartForPage(target)))?.pages || []).find((p) => p.page_number === target);
        setRenderPages(pageObj ? [pageObj] : []);
        if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${target}`);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isShowAllPages]);

  // ---------- scroll listener: use getBoundingClientRect() and page-center distance ----------
  useEffect(() => {
    if (!isShowAllPages) return;
    let raf = null;
    let timeoutId = null;

    const onScroll = () => {
      if (manualScrollInProgressRef.current) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const viewportCenter = window.innerHeight / 2;
          let bestPage = currentPage;
          let bestDistance = Infinity;
          for (let i = 0; i < renderPages.length; i++) {
            const p = renderPages[i];
            const el = pageRefs.current[p.page_number];
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            const pageCenter = rect.top + rect.height / 2;
            const dist = Math.abs(pageCenter - viewportCenter);
            if (dist < bestDistance) {
              bestDistance = dist;
              bestPage = p.page_number;
            }
          }
          if (bestPage !== currentPage && bestDistance < window.innerHeight) { // sanity check
            setCurrentPage(bestPage);
            if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${bestPage}`);
          }
        }, 80);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [renderPages, currentPage, isShowAllPages, params?.id]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      // remove image listeners
      if (imageListenersRef.current.length) {
        imageListenersRef.current.forEach(({ img, handler }) => img.removeEventListener("load", handler));
        imageListenersRef.current = [];
      }
      // reset body height
      document.body.style.height = "";
      if (window.pdfNavigator && window.pdfNavigator.goTo) delete window.pdfNavigator.goTo;
    };
  }, []);

  const cleanPageData = (raw) => String(raw || "").replace(/<!DOCTYPE[^>]*>/gi, "").replace(/<\/?(html|body)[^>]*>/gi, "").trim();

  const loader = loading && (!renderPages || renderPages.length === 0);

  return (
    <div className="w-full flex justify-center mt-10">
      <div id="wrapper" className="min-h-max w-fit">
        {loader ? (
          <div className="w-full flex justify-center mt-10">
            <span className="text-lg">در حال بارگذاری...</span>
          </div>
        ) : isShowAllPages ? (
          renderPages.map((page) => {
            const content = cleanPageData(page.page_data || "");
            return (
              <div
                key={`${pageId}-${page.page_number}`}
                ref={(el) => {
                  if (el) pageRefs.current[page.page_number] = el;
                }}
                data-page={page.page_number}
                className="mb-10"
              >
                <PageContent content={content} image={page.page_image} />
              </div>
            );
          })
        ) : (
          <div className="w-full flex justify-center">
            <PageContent
              {...(() => {
                const cp = renderPages[0] || pagesCache[currentPage] || {};
                return { image: cp.page_image, content: cleanPageData(cp.page_data || "") };
              })()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
