const INTERVAL_DURATION = 5000;
const ANIMATION_DURATION = 500;
const ANIMATION_EASING = "ease-in-out";

const slides = document.querySelector<HTMLUListElement>(
  ".slideshow > .slides",
)!;

const firstSlide = document.querySelector<HTMLLIElement>(
  ".slideshow > .slides > li:first-of-type",
)!;
const lastSlide = document.querySelector<HTMLLIElement>(
  ".slideshow > .slides > li:last-of-type",
)!;

const slidesCount = slides.querySelectorAll("img").length;

const bullets = document.querySelectorAll<HTMLElement>(
  ".slideshow > .bullets > li > .bullet",
);

const previousButton = document.querySelector<HTMLButtonElement>(
  ".slideshow > button.previous",
)!;
const nextButton = document.querySelector<HTMLButtonElement>(
  ".slideshow > button.next",
)!;

let currentSlideIndex = 0;
let timeout: number | undefined;
let isAnimating = false;

const initializeEventListeners = (): void => {
  previousButton.addEventListener("click", goToThePreviousSlide);
  nextButton.addEventListener("click", goToTheNextSlide);
};

const goToThePreviousSlide = (): void => {
  if (isAnimating) return;
  isAnimating = true;

  const shouldFallback = currentSlideIndex === 0;
  if (shouldFallback)
    lastSlide.style.transform = `translateX(${slidesCount * -100}%)`;

  changeSlide(
    currentSlideIndex - 1,
    shouldFallback,
    slidesCount - 1,
    lastSlide,
  );
};

const goToTheNextSlide = (): void => {
  if (isAnimating) return;
  isAnimating = true;

  const shouldFallback = currentSlideIndex === slidesCount - 1;
  if (shouldFallback)
    firstSlide.style.transform = `translateX(${slidesCount * 100}%)`;

  changeSlide(currentSlideIndex + 1, shouldFallback, 0, firstSlide);
};

const changeSlide = (
  index: number,
  shouldFallback: boolean,
  fallbackIndex: number,
  fallbackSlide: HTMLLIElement,
): void => {
  clearTimeout(timeout);

  const animation = slides.animate(
    [
      { transform: `translateX(${currentSlideIndex * -100}%)` },
      { transform: `translateX(${index * -100}%)` },
    ],
    {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
      fill: "forwards",
    },
  );

  currentSlideIndex = index;
  syncActiveBullet(shouldFallback ? fallbackIndex : currentSlideIndex);

  animation.addEventListener("finish", () => {
    if (shouldFallback) {
      currentSlideIndex = fallbackIndex;
      slides.animate([{ transform: `translateX(${fallbackIndex * -100}%)` }], {
        fill: "forwards",
      });
      fallbackSlide.style.transform = "translateX(0)";
    }

    resetTimeout();
    isAnimating = false;
  });
};

const syncActiveBullet = (index: number): void => {
  bullets.forEach((bullet) => bullet.classList.remove("active"));
  bullets[index].classList.add("active");
};

const resetTimeout = (): void => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    goToTheNextSlide();
  }, INTERVAL_DURATION);
};

const main = (): void => {
  initializeEventListeners();
  resetTimeout();
};

main();
