(async () => {
  startProgress();

  const intro = document.querySelector("#canvas-container");
  const imageframes = document.querySelector('input[name="frames-url"]');
  const text = intro.querySelector("h1");
  if (!intro || !imageframes) {
    throw new Error("Element missing!");
  }

  const framesUrlPattern = imageframes.value;
  const framesUrlStart = parseInt(imageframes.dataset.frameStart, 10);
  const framesUrlEnd = parseInt(imageframes.dataset.frameEnd, 10);
  const framesIdPadding = parseInt(imageframes.dataset.frameIdPadding, 10);

  const frames = await FrameUnpacker.unpack({
    urlPattern: framesUrlPattern,
    start: framesUrlStart,
    end: framesUrlEnd,
    padding: framesIdPadding
  });

  const canvas = document.createElement("canvas");
  canvas.classList.add("canvas");
  canvas.height = frames[0].height;
  canvas.width = frames[0].width;
  const context = canvas.getContext("2d");
  context.drawImage(frames[0], 0, 0);

  intro.appendChild(canvas);

  const observer = CanvasFrameScrubber.create(context, frames);

  const observable = new ScrollObservable();
  observable.subscribe(observer);

  //stopProgress();

  //SCROLLMAGIC
  const controller = new ScrollMagic.Controller();

  //Scenes
  let scene = new ScrollMagic.Scene({
    duration: 1000,
    triggerElement: intro,
    triggerHook: 0
  })
    .setPin(intro)
    .addTo(controller);

  //Text Animation
  const textAnim = TweenMax.fromTo(text, 3, { opacity: 1 }, { opacity: 0 });

  let scene2 = new ScrollMagic.Scene({
    duration: 2000,
    triggerElement: intro,
    triggerHook: 0
  })
    .setTween(textAnim)
    .addTo(controller);

  //Video Animation
  let accelamount = 0.1;
  let scrollpos = 0;
  let delay = 0;

  scene.on("update", e => {
    scrollpos = e.scrollPos / 1000;
  });

  setInterval(() => {
    delay += (scrollpos - delay) * accelamount;
    console.log(scrollpos, delay);

    video.currentTime = delay;
  }, 33.3);
})();
