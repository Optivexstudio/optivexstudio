let loadingPromise = null;

export function loadTawk() {
  if (typeof window === "undefined") return Promise.resolve();

  // უკვე ჩატვირთულია
  if (window.Tawk_API && document.getElementById("tawk-script")) {
    return Promise.resolve();
  }

  // უკვე იწყებს ჩატვირთვას
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.id = "tawk-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/69349bbb07cc551984368bf6/1jbqo0lgf";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    s1.onload = () => {
      // ზოგჯერ API მზადდება ცოტა გვიან
      const wait = setInterval(() => {
        if (window.Tawk_API && typeof window.Tawk_API.showWidget === "function") {
          clearInterval(wait);
          resolve();
        }
      }, 50);

      setTimeout(() => {
        clearInterval(wait);
        resolve();
      }, 3000);
    };

    s1.onerror = reject;

    document.head.appendChild(s1);
  });

  return loadingPromise;
}

export async function openTawk() {
  await loadTawk();
  if (window.Tawk_API && typeof window.Tawk_API.showWidget === "function") {
    window.Tawk_API.showWidget();
    window.Tawk_API.maximize();
  }
}

export function hideTawk() {
  if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
    window.Tawk_API.hideWidget();
  }
}
