function init(){
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector(".main"),
    smooth: true
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(".main", {
    scrollTop(value) {
      return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.querySelector(".main").style.transform ? "transform" : "fixed"
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  // videos/images load hone ke baad heights change hoti hain,
  // isliye load complete hote hi scroll height recalc karo
  window.addEventListener("load", () => {
    locoScroll.update();
    ScrollTrigger.refresh();
  });

  return locoScroll;
}

const locoScroll = init();

// custom cursor
var crsr = document.querySelector(".cursor");
document.addEventListener("mousemove", function (dets) {
  crsr.style.left = dets.x + 20 + "px";
  crsr.style.top = dets.y + 20 + "px";
});

// hero scroll animation
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".page1 h2",
    scroller: ".main",
    markers: false,
    start: "top 27%",
    end: "top 0",
    scrub: 2
  }
});

tl.to(".page1 h2", { x: -100 })
  .to(".page1 h3", { x: 100 }, "<")
  .to(".page1 video", { width: "90%" }, "<");

// background flip to white going into page2
let tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".page2 h1",
    scroller: ".main",
    markers: false,
    start: "top 80%",
    end: "top 40%",
    scrub: 2
  }
});

tl2.to(".main", { backgroundColor: "#fff" })
   .to(".page2 h1, .page2-left h2, .page2-right p, .page2-right button", {
      color: "#000"
   }, "<");

// client boxes -> cursor image preview
var boxes = document.querySelectorAll(".box");
boxes.forEach(function (elem) {
  elem.addEventListener("mouseenter", function () {
    var att = elem.getAttribute("data-image");
    crsr.style.width = "470px";
    crsr.style.height = "370px";
    crsr.style.borderRadius = "0";
    crsr.style.backgroundImage = `url(${att})`;
  });
  elem.addEventListener("mouseleave", function () {
    crsr.style.width = "20px";
    crsr.style.height = "20px";
    crsr.style.borderRadius = "50%";
    crsr.style.backgroundImage = "none";
  });
});

// nav hover -> purple panel behind nav
var h4 = document.querySelectorAll("#nav h4");
var purple = document.querySelector("#purple");
h4.forEach(function (elem) {
  elem.addEventListener("mouseenter", function () {
    if (!purple) return;
    purple.style.display = "block";
    purple.style.opacity = "1";
  });
  elem.addEventListener("mouseleave", function () {
    if (!purple) return;
    purple.style.display = "none";
    purple.style.opacity = "0";
  });
});

// nav + footer links: scroll to the section instead of doing nothing
document.querySelectorAll("[data-scroll-target]").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    var target = link.getAttribute("data-scroll-target");
    locoScroll.scrollTo(target);
  });
});

// page2 "About us" button -> jump straight to the about/contact footer
var aboutBtn = document.querySelector("#about-btn");
if (aboutBtn) {
  aboutBtn.addEventListener("click", function () {
    locoScroll.scrollTo("footer");
  });
}

// kuch hotlinked video/image URLs (envato preview links) expire ya block ho
// sakte hain - agar wo load na ho toh us jagah blank khaali box dikhne ke
// bajaye ek gradient placeholder dikha do
document.querySelectorAll(".page1 video, .page3-part1 video, .page3-part1 img").forEach(function (media) {
  media.addEventListener("error", function () {
    media.classList.add("media-fallback");
    media.removeAttribute("src");
  }, { once: true });
});