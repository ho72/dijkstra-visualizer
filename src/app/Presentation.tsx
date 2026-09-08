import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";
import { Icon } from "../components/Icon";
import { SlideNavigator } from "../components/SlideNavigator";
import { fitStage } from "./navigation";
import { slides, SlideContent } from "../slides/slides";
import { graphPresentationSteps, gridSteps } from "../dijkstra/snapshots";
import { createPresentationReducer, readLocation } from "./presentationState";
import type { Action } from "./presentationState";

const lengths = slides.map((s) => s.steps);
const reducer = createPresentationReducer(lengths);

export function Presentation() {
  const [state, dispatch] = useReducer(
    reducer,
    window.location.search,
    (search) => readLocation(search, lengths),
  );
  const { index, step, playing, revision } = state;
  const [visible, setVisible] = useState(true);
  const [scale, setScale] = useState(1);
  const [help, setHelp] = useState(false);
  const [notice, setNotice] = useState("");
  const [fullscreenActive, setFullscreenActive] = useState(() => Boolean(document.fullscreenElement));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigationAt = useRef(-Infinity);
  const stageRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const slide = slides[index];
  const reveal = useCallback(() => {
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 2800);
  }, []);
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const resize = () => setScale(fitStage(viewport.clientWidth, viewport.clientHeight));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    reveal();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, [reveal]);
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("scene", String(index + 1));
    url.searchParams.set("step", String(step + 1));
    window.history.replaceState(null, "", url);
  }, [index, step]);
  useEffect(() => {
    const restore = () => {
      const location = readLocation(window.location.search, lengths);
      dispatch({ type: "jump", index: location.index, step: location.step });
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  const navigate = useCallback(
    (type: "next" | "previous" | "skip") => {
      // Ignore input bursts while a transition is running; snapshots never mutate.
      const now = performance.now();
      if (now - navigationAt.current < (reduced ? 0 : 420)) return;
      navigationAt.current = now;
      dispatch({ type });
    },
    [reduced],
  );
  const fullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setNotice("이 브라우저에서는 전체화면을 지원하지 않습니다.");
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      noticeTimer.current = setTimeout(() => setNotice(""), 3500);
    }
  }, []);
  useEffect(() => {
    const update = () => {
      const active = Boolean(document.fullscreenElement);
      if (active && document.activeElement?.closest(".slide-navigator")) {
        stageRef.current?.focus({ preventScroll: true });
      }
      setFullscreenActive(active);
    };
    update();
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  const selectSlide = useCallback((index: number) => {
    dispatch({ type: "jump", index });
    stageRef.current?.focus({ preventScroll: true });
    reveal();
  }, [reveal]);
  const closeHelp = useCallback(() => {
    setHelp(false);
    stageRef.current?.focus({ preventScroll: true });
  }, []);
  const openHelp = useCallback(() => {
    setHelp(true);
    dispatch({ type: "pause" });
  }, []);
  useEffect(() => {
    if (help) helpRef.current?.focus();
  }, [help]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (help) {
        if (key === "escape" || key === "?") {
          event.preventDefault();
          closeHelp();
        }
        if (key === "tab") {
          event.preventDefault();
          helpRef.current?.focus();
        }
        return;
      }
      if (
        event.target instanceof HTMLElement &&
        (event.target.matches('input,textarea,select,[contenteditable="true"]') ||
          (event.target.closest(".slide-navigator") && !["f", "?"].includes(key)) ||
          (key === " " && event.target.closest('button,a[href],[role="button"]')))
      )
        return;
      if (
        ![
          "arrowright",
          " ",
          "pagedown",
          "arrowleft",
          "pageup",
          "home",
          "end",
          "f",
          "r",
          "p",
          "?",
        ].includes(key)
      )
        return;
      event.preventDefault();
      if (event.repeat) return;
      if (["arrowright", " ", "pagedown"].includes(key)) navigate("next");
      else if (["arrowleft", "pageup"].includes(key)) navigate("previous");
      else if (key === "f") void fullscreen();
      else if (key === "?") openHelp();
      else {
        const actions: Record<string, Action> = {
          home: { type: "home" },
          end: { type: "end" },
          r: { type: "reset" },
          p: { type: "play" },
        };
        if (actions[key]) dispatch(actions[key]);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [navigate, fullscreen, help, closeHelp, openHelp]);
  useEffect(() => {
    if (!playing) return;
    const snapshot =
      slide.id === "execution"
        ? graphPresentationSteps[step]
        : slide.id === "grid-execution"
          ? gridSteps[step]
          : undefined;
    const delay = snapshot?.phase === "relax-success" ? 2600 : 1800;
    const id = setTimeout(() => dispatch({ type: "tick" }), delay);
    return () => clearTimeout(id);
  }, [playing, step, slide.id]);
  useEffect(() => {
    const pauseHidden = () => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    document.addEventListener("visibilitychange", pauseHidden);
    return () => document.removeEventListener("visibilitychange", pauseHidden);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`presentation ${visible ? "controls-visible" : ""}`}
        onPointerMove={reveal}
        onPointerDown={reveal}
        data-fullscreen={fullscreenActive}
      >
        {!fullscreenActive && (
          <SlideNavigator
            slides={slides}
            activeIndex={index}
            disabled={help}
            onSelect={selectSlide}
            onPresent={() => void fullscreen()}
          />
        )}
        <div className="stage-viewport" ref={viewportRef}>
        <main
          id="presentation-stage"
          ref={stageRef}
          tabIndex={-1}
          className="stage"
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
          aria-label="SWEA 1249 보급로 발표"
          data-slide={slide.id}
          data-step={step}
          data-playing={playing}
        >
          <header className="slide-header">
            <div>
              <span className="section-number">{slide.section}</span>
              <span className="header-divider" />
              {slide.sectionName}
            </div>
            <span className="context-label">
              SWEA 1249 <i /> 보급로
            </span>
          </header>
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              inert={help}
              className={`slide slide-${slide.id} slide-kind-${slide.kind}`}
              key={`${slide.id}-${revision}`}
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              aria-label={slide.title}
            >
              {slide.kind !== "cover" && slide.kind !== "chapter" && (
                <h1 className="slide-title">{slide.title}</h1>
              )}
              <SlideContent id={slide.id} step={step} />
            </motion.section>
          </AnimatePresence>
          <footer className="slide-footer">
            <div className="step-meta">
              {slide.steps > 1 && (
                <>
                  STEP <b>{String(step + 1).padStart(2, "0")}</b> /{" "}
                  {String(slide.steps).padStart(2, "0")}
                  {playing && (
                    <span className="playing-status"> · 재생 중</span>
                  )}
                </>
              )}
            </div>
            <div className="page-number">
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>/</span>
              {String(slides.length).padStart(2, "0")}
            </div>
          </footer>
          <div
            className="deck-progress"
            style={{ width: `${((index + 1) / slides.length) * 100}%` }}
          />
          <nav
            inert={help}
            className="presenter-controls"
            aria-label="발표 조작"
            onFocus={reveal}
          >
            {slide.steps > 1 && (
              <label className="step-scrubber">
                <span>단계</span>
                <input
                  aria-label="단계 선택"
                  type="range"
                  min="0"
                  max={slide.steps - 1}
                  value={step}
                  onChange={(e) =>
                    dispatch({ type: "step", step: Number(e.target.value) })
                  }
                />
              </label>
            )}
            <button
              onClick={() => navigate("previous")}
              disabled={index === 0 && step === 0}
              aria-label="이전"
              title="이전 (←)"
            >
              <Icon name="previous" />
            </button>
            {slide.steps > 1 && (
              <>
                <button
                  onClick={() => dispatch({ type: "reset" })}
                  aria-label="현재 장면 초기화"
                  title="초기화 (R)"
                >
                  <Icon name="reset" />
                </button>
                <button
                  onClick={() => dispatch({ type: "play" })}
                  aria-label={playing ? "자동재생 정지" : "자동재생"}
                  title="자동재생 / 정지 (P)"
                >
                  <Icon name={playing ? "pause" : "play"} />
                </button>
              </>
            )}
            <button
              onClick={() => navigate("next")}
              disabled={index === slides.length - 1 && step === slide.steps - 1}
              aria-label="다음"
              title="다음 (→ / Space)"
            >
              <Icon name="next" />
            </button>
            {slide.steps > 1 && (
              <button
                onClick={() => navigate("skip")}
                aria-label="현재 장면 건너뛰기"
                title="현재 장면 건너뛰기"
              >
                <Icon name="skip" />
              </button>
            )}
            <span className="control-separator" />
            <button
              onClick={() => void fullscreen()}
              aria-label={fullscreenActive ? "전체화면 종료" : "전체화면"}
              aria-pressed={fullscreenActive}
              title={
                fullscreenActive ? "전체화면 종료 (F / Esc)" : "전체화면 (F)"
              }
            >
              <Icon name="fullscreen" />
            </button>
            <button
              onClick={openHelp}
              aria-label="단축키 도움말"
              title="단축키 (?)"
            >
              <Icon name="help" />
            </button>
          </nav>
          {help && (
            <div className="help-backdrop" onClick={closeHelp}>
              <div
                className="help-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="help-title"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  ref={helpRef}
                  className="close-help"
                  onClick={closeHelp}
                  aria-label="도움말 닫기"
                >
                  <Icon name="close" />
                </button>
                <h2 id="help-title">발표 단축키</h2>
                {[
                  ["→ / Space / PageDown", "다음 슬라이드·단계"],
                  ["← / PageUp", "이전 슬라이드·단계"],
                  ["Home / End", "처음 / 마지막 슬라이드"],
                  ["F / Esc", "전체화면 / 전체화면 종료"],
                  ["P", "현재 장면 자동재생 / 정지"],
                  ["R", "현재 장면 초기화"],
                  ["? / Esc", "도움말 열기 / 닫기"],
                ].map(([key, label]) => (
                  <div className="shortcut" key={key}>
                    <kbd>{key}</kbd>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {notice && (
            <div className="notice" role="status">
              {notice}
            </div>
          )}
        </main>
        </div>
      </div>
    </MotionConfig>
  );
}
