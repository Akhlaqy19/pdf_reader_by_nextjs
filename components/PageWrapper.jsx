"use client";
import React, { useContext, useEffect, useRef, useState, useId } from "react";
import PageContent from "@/components/PageContent";
import { useParams } from "next/navigation";
import { PageContext } from "@/contexts/main";
import { getBookPages } from "@/actions/api";

/**
 * Safe PageWrapper
 * - همهٔ هوک‌ها در بالای کامپوننت تعریف شده‌اند (هیچ شرطی قبل از آنها وجود ندارد).
 * - هیچ early-return ای قبل از هوک‌ها وجود ندارد.
 * - وضعیت loading در JSX پردازش می‌شود.
 * - API برنامه‌ای window.pdfNavigator.goTo صفحه را صدا می‌زند.
 */

export default function PageWrapper() {
  // --- all hooks first ---
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

  const [allPages, setAllPages] = useState([]); // loaded page objects
  const [loading, setLoading] = useState(false);

  const isInitializedRef = useRef(false);
  const pageRefs = useRef({}); // pageNumber -> element
  const loadedRanges = useRef(new Set());
  const manualScrollInProgressRef = useRef(false);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // small waitFor helper (polling)
  const waitFor = async (fn, { interval = 80, timeout = 3000 } = {}) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const v = fn();
        if (v) return v;
      } catch (e) {
        // ignore and retry
      }
      // eslint-disable-next-line no-await-in-loop
      await delay(interval);
    }
    return null;
  };

  // --- setApplyZoom (stable) ---
  useEffect(() => {
    setApplyZoom(() => () => {
      const wrapper = document.getElementById("wrapper");
      const container = wrapper?.parentElement?.parentElement;
      if (!wrapper || !container) return;
      wrapper.style.transform = "scale(1)";
      const containerWidth = container.offsetWidth;
      const originalWidth = wrapper.getBoundingClientRect().width;
      const maxZoom =
        originalWidth > containerWidth ? Math.floor((containerWidth / originalWidth) * 100) : 200;
      const requestedZoom = zoom || 100;
      const safeZoom = Math.min(requestedZoom, maxZoom);
      wrapper.style.transform = `scale(${safeZoom / 100})`;
      wrapper.style.transformOrigin = "top center";
    });
  }, [setApplyZoom, zoom]);

  // --- fetchPages ---
  const fetchPages = async (startPage, limitPage) => {
    if (!params?.id) return [];
    setLoading(true);
    try {
      const res = await getBookPages(params.id, startPage, limitPage);
      const pages = res?.data || [];
      // update cache
      const newCache = { ...(pagesCache || {}) };
      pages.forEach((p) => {
        newCache[p.page_number] = p;
      });
      setPagesCache(newCache);
      // merge into allPages
      setAllPages((prev) => {
        const map = new Map(prev.map((x) => [x.page_number, x]));
        pages.forEach((p) => map.set(p.page_number, p));
        return Array.from(map.values()).sort((a, b) => a.page_number - b.page_number);
      });
      return pages;
    } catch (err) {
      console.error("fetchPages error", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // --- ensureRangeForPage (20 page range) ---
  const ensureRangeForPage = async (pageNumber) => {
    if (!pageNumber || pageNumber <= 0) return;
    const startPage = Math.floor((pageNumber - 1) / 20) * 20 + 1;
    const rangeKey = `${startPage}-${startPage + 19}`;
    if (!loadedRanges.current.has(rangeKey)) {
      loadedRanges.current.add(rangeKey);
      await fetchPages(startPage, 20);
    }
  };

  // --- robust scrollToPage ---
  const scrollToPage = async (pageNumber) => {
    if (!pageNumber) return;
    // ensure range loaded
    await ensureRangeForPage(pageNumber);

    // wait for element node
    const el = await waitFor(() => pageRefs.current[pageNumber], { interval: 80, timeout: 3000 });
    if (!el) {
      // fallback: update state & url
      setCurrentPage(pageNumber);
      if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${pageNumber}`);
      return;
    }

    manualScrollInProgressRef.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // wait until window.scrollY near element top or timeout
    const finished = await waitFor(
      () => {
        const top = el.offsetTop;
        return Math.abs(window.scrollY - top) < 8 || Math.abs(window.pageYOffset - top) < 8;
      },
      { interval: 40, timeout: 1400 }
    );

    // small settle
    // eslint-disable-next-line no-await-in-loop
    await delay(120);

    setCurrentPage(pageNumber);
    if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${pageNumber}`);

    // release manual scroll flag slightly after
    manualScrollInProgressRef.current = false;
    return finished;
  };

  // --- expose API for toolbar / zoomTool ---
  useEffect(() => {
    window.pdfNavigator = window.pdfNavigator || {};
    window.pdfNavigator.goTo = async (page) => {
      const p = Number(page) || Number(currentPage) || 1;
      await scrollToPage(p);
    };
    return () => {
      if (window.pdfNavigator && window.pdfNavigator.goTo) delete window.pdfNavigator.goTo;
    };
    // intentionally depend on allPages so API sees updates
  }, [allPages, currentPage, params?.id]);

  // --- init currentPage from URL once ---
  useEffect(() => {
    if (isInitializedRef.current) return;
    if (!params?.id) return;
    const qp = new URLSearchParams(window.location.search).get("page");
    const pageFromUrl = qp ? parseInt(qp, 10) : null;
    if (pageFromUrl && !Number.isNaN(pageFromUrl)) {
      setCurrentPage(pageFromUrl);
    } else {
      if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${currentPage}`);
    }
    isInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  // --- when currentPage changes programmatically, ensure content / scroll ---
  useEffect(() => {
    if (manualScrollInProgressRef.current) return;
    const run = async () => {
      if (isShowAllPages) {
        await scrollToPage(currentPage);
      } else {
        await ensureRangeForPage(currentPage);
        if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${currentPage}`);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isShowAllPages]);

  // --- initial load / lazy load when currentPage moves ---
  useEffect(() => {
    if (!params?.id) return;
    const run = async () => {
      if (!isShowAllPages) {
        if (pagesCache && pagesCache[currentPage]) {
          setAllPages([pagesCache[currentPage]]);
        } else {
          await fetchPages(currentPage, 1);
        }
      } else {
        await ensureRangeForPage(currentPage);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, isShowAllPages, currentPage]);

  // --- update currentPage while user scrolls (debounced) ---
  useEffect(() => {
    if (!isShowAllPages) return;

    let rafId = null;
    let tickTimeout = null;

    const onScroll = () => {
      if (manualScrollInProgressRef.current) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (tickTimeout) clearTimeout(tickTimeout);
        tickTimeout = setTimeout(() => {
          const checkY = window.scrollY + window.innerHeight / 3;
          let chosen = currentPage;
          for (let i = 0; i < allPages.length; i++) {
            const p = allPages[i];
            const el = pageRefs.current[p.page_number];
            if (!el) continue;
            if (checkY >= el.offsetTop) {
              chosen = p.page_number;
            } else {
              break;
            }
          }
          if (chosen !== currentPage) {
            setCurrentPage(chosen);
            if (params?.id) window.history.replaceState(null, "", `/book/${params.id}?page=${chosen}`);
          }
        }, 80);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (tickTimeout) clearTimeout(tickTimeout);
    };
  }, [allPages, currentPage, isShowAllPages, params?.id]);

  // --- helper: clean html ---
  const cleanPageData = (raw) =>
    String(raw || "")
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .replace(/<\/?(html|body)[^>]*>/gi, "")
      .trim();

  // --- render (no early returns that skip hooks) ---
  const loader = loading && allPages.length === 0;

  return (
    <div className="w-full flex justify-center mt-10">
      <div id="wrapper" className="min-h-max w-fit">
        {loader ? (
          <div className="w-full flex justify-center mt-10">
            <span className="text-lg">در حال بارگذاری...</span>
          </div>
        ) : isShowAllPages ? (
          allPages.map((page) => {
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
                const cp = pagesCache[currentPage] || allPages.find((p) => p.page_number === currentPage) || {};
                return { image: cp.page_image, content: cleanPageData(cp.page_data || "") };
              })()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
