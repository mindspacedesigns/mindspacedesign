(function () {
  /* show /about-us instead of /about-us/ in the address bar */
  if (location.pathname.length > 1 && location.pathname.slice(-1) === "/") {
    history.replaceState(
      null,
      "",
      location.pathname.slice(0, -1) + location.search + location.hash,
    );
  }
  var nav = document.getElementById("nav"),
    mq = window.matchMedia("(max-width:1099px)"),
    items = [].slice.call(nav.querySelectorAll(".has-dd")),
    burger = document.getElementById("burger"),
    timer;
  function setOpen(li, on) {
    li.classList.toggle("open", on);
    li.querySelector(".dd-toggle").setAttribute("aria-expanded", on);
  }
  function closeAll(x) {
    items.forEach(function (li) {
      if (li !== x) setOpen(li, false);
    });
  }
  items.forEach(function (li) {
    var b = li.querySelector(".dd-toggle");
    b.addEventListener("click", function (ev) {
      ev.preventDefault();
      var on = !li.classList.contains("open");
      closeAll(li);
      setOpen(li, on);
    });
    li.addEventListener("pointerenter", function (ev) {
      if (mq.matches || ev.pointerType !== "mouse") return;
      clearTimeout(timer);
      closeAll(li);
      setOpen(li, true);
    });
    li.addEventListener("pointerleave", function (ev) {
      if (mq.matches || ev.pointerType !== "mouse") return;
      timer = setTimeout(function () {
        setOpen(li, false);
      }, 160);
    });
    li.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && li.classList.contains("open")) {
        setOpen(li, false);
        b.focus();
        ev.stopPropagation();
      }
      if (ev.key === "ArrowDown" && ev.target === b) {
        ev.preventDefault();
        setOpen(li, true);
        li.querySelector(".dd a").focus();
      }
    });
    li.addEventListener("focusout", function (ev) {
      if (!mq.matches && !li.contains(ev.relatedTarget)) setOpen(li, false);
    });
  });
  document.addEventListener("click", function (ev) {
    if (!nav.contains(ev.target)) closeAll();
  });
  function setDrawer(on) {
    nav.classList.toggle("drawer", on);
    burger.setAttribute("aria-expanded", on);
    burger.setAttribute("aria-label", on ? "Close menu" : "Open menu");
    document.body.style.overflow = on ? "hidden" : "";
    if (!on) closeAll();
  }
  burger.addEventListener("click", function () {
    setDrawer(!nav.classList.contains("drawer"));
  });
  nav.addEventListener("click", function (ev) {
    if (mq.matches && ev.target.closest("a")) setDrawer(false);
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && nav.classList.contains("drawer")) {
      setDrawer(false);
      burger.focus();
    }
  });
  mq.addEventListener
    ? mq.addEventListener("change", function () {
        setDrawer(false);
        closeAll();
      })
    : mq.addListener(function () {
        setDrawer(false);
      });
  /* SEO: SiteNavigationElement JSON-LD built from the real links */
  var list = [].map.call(nav.querySelectorAll('a[href^="/"]'), function (a, i) {
    return {
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: a.textContent.trim(),
      url: new URL(a.getAttribute("href"), location.origin).href,
    };
  });
  var s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: "Mindspace Design",
        telephone: "+91 98860 12345",
        email: "info@mindspacedesign.in",
        areaServed: "Bangalore",
        url: location.origin + "/",
      },
      { "@type": "ItemList", itemListElement: list },
    ],
  });
  document.head.appendChild(s);
  document.querySelectorAll("form.f").forEach(function (f) {
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var o = f.parentNode.querySelector(".ok");
      o.textContent = f.getAttribute("data-thanks");
      o.style.display = "block";
      f.reset();
    });
  });
})();
