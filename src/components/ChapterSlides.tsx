import { chapters } from "../slides/chapters";
import { slides } from "../slides/deck";

export function AgendaSlide() {
  return (
    <ol className="agenda-list" aria-label="발표 목차">
      {chapters.map((chapter) => (
        <li key={chapter.number}>
          <span className="agenda-number">{chapter.number}</span>
          <h2>{chapter.title}</h2>
          <p>{chapter.summary}</p>
          <span className="agenda-page" aria-label="시작 페이지">
            {String(
              slides.findIndex(
                (slide) => slide.id === `chapter-${chapter.number}`,
              ) + 1,
            ).padStart(2, "0")}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function ChapterSlide({ number }: { number: string }) {
  const chapter = chapters.find((item) => item.number === number);
  if (!chapter) return null;
  return (
    <div className="chapter-intro">
      <span className="chapter-numeral" aria-hidden="true">
        {chapter.number}
      </span>
      <div className="chapter-copy">
        <h1>{chapter.title}</h1>
        <p>{chapter.description}</p>
      </div>
    </div>
  );
}
