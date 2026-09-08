import { useEffect, useRef } from "react";
import type { SlideDefinition } from "../slides/deck";
import { navigationFocusIndex } from "../app/navigation";
import { Icon } from "./Icon";

export function SlideNavigator({
  slides, activeIndex, disabled, onSelect, onPresent,
}: {
  slides: SlideDefinition[];
  activeIndex: number;
  disabled: boolean;
  onSelect: (index: number) => void;
  onPresent: () => void;
}) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  useEffect(() => {
    buttons.current[activeIndex]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeIndex]);

  return (
    <nav className="slide-navigator" aria-label="전체 슬라이드" inert={disabled}>
      <div className="navigator-heading">
        <h2>슬라이드 <span>{slides.length}</span></h2>
        <button type="button" onClick={onPresent} aria-label="전체화면으로 발표" title="전체화면으로 발표 (F)">
          <Icon name="fullscreen" size={18} />
        </button>
      </div>
      <ol className="navigator-list">
        {slides.map((slide, index) => (
          <li key={slide.id}>
            <button
              type="button"
              ref={element => { buttons.current[index] = element; }}
              className={`navigator-slide ${slide.kind === "chapter" ? "navigator-chapter" : ""}`}
              data-slide-id={slide.id}
              aria-label={`${index + 1}페이지: ${slide.title}`}
              title={slide.title}
              aria-current={index === activeIndex ? "page" : undefined}
              aria-controls="presentation-stage"
              onClick={() => onSelect(index)}
              onKeyDown={event => {
                const next = navigationFocusIndex(event.key, index, slides.length);
                if (next === undefined) return;
                event.preventDefault();
                event.stopPropagation();
                buttons.current[next]?.focus();
              }}
            >
              <span className="navigator-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="navigator-preview">
                <img
                  src={`/slide-thumbnails/${slide.id}.jpg`}
                  alt=""
                  width={960}
                  height={540}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
