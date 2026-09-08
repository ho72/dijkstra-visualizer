// Run with playwright-cli run-code --filename scripts/capture-slide-thumbnails.js.
// The browser must already be on the local presentation with the navigator visible.
async (page) => {
  const originalUrl = page.url();
  const origin = await page.evaluate(() => location.origin);
  await page.setViewportSize({ width: 960, height: 540 });
  // Entry-only animations show their complete content in thumbnail captures.
  await page.emulateMedia({ reducedMotion: "reduce" });
  const slides = await page.locator(".navigator-slide").evaluateAll(buttons =>
    buttons.map((button, index) => ({ id: button.dataset.slideId, scene: index + 1 })),
  );
  if (!slides.length || slides.some(slide => !/^[a-z0-9-]+$/.test(slide.id))) {
    throw new Error("The complete slide navigator must be visible before capture.");
  }
  for (const slide of slides) {
    await page.goto(`${origin}/?scene=${slide.scene}&step=1`);
    await page.addStyleTag({ content: `
      .slide-navigator, .presenter-controls, .notice { display: none !important; }
      .stage { box-shadow: none !important; }
    ` });
    await page.locator("#presentation-stage").waitFor({ state: "visible" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.querySelectorAll(".stage img"), img =>
        img.decode().catch(() => {}),
      ));
    });
    await page.waitForFunction(() => {
      const stage = document.querySelector("#presentation-stage");
      return stage && Math.abs(stage.getBoundingClientRect().width - 960) < 1;
    });
    await page.waitForTimeout(200);
    await page.locator("#presentation-stage").screenshot({
      path: `output/playwright/slide-thumbnails/${slide.id}.jpg`,
      type: "jpeg", quality: 82, animations: "disabled", scale: "css",
    });
  }
  console.log(`Captured ${slides.length} slides at 960×540.`);
  await page.goto(originalUrl);
}
