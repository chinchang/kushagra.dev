(function () {
  async function processEmbed(el) {
    const res = await fetch(el.href);
    const content = await res.text();
    const containerEl = document.createElement("div");
    containerEl.classList.add("webmaker-embed-container");
    const codeEl = document.createElement("code");
    const preEl = document.createElement("pre");
    preEl.textContent = content;
    codeEl.appendChild(preEl);
    containerEl.appendChild(codeEl);
    const iframeEl = document.createElement("iframe");
    iframeEl.src = "";
    containerEl.appendChild(iframeEl);

    el.replaceWith(containerEl);

    // Run the code
    // proxy the console

    // GOES INSIDE THE IFRAME
    function addLog(content, styles = {}) {
      const baseStyles = {};
      const el = document.createElement("div");
      el.textContent = content;
      document.body.appendChild(el);
      const overallStyles = { ...baseStyles, ...styles };
      Object.keys(overallStyles).forEach((key) => {
        el.style[key] = overallStyles[key];
      });
    }
    const _console = {};
    if (window.top !== self) {
      _console.log = console.log;
      _console.assert = console.assert;
    }
    console.log = function () {
      _console.log(...arguments);
      addLog(...arguments);
    };
    console.assert = function (condition, message) {
      _console.assert(condition, message);
      if (!condition) {
        addLog(message, { color: "tomato" });
      }
    };
    const html = `
    <body>
    <style>
    .log {
        padding: 0.5rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    .log:not(:last-child) {
        border-bottom: 1px solid rgb(0 0 0 / 10%);
    }
    </style>
    <script>
    function addLog(content, styles = {}) {
        const baseStyles = {
        };
        const el = document.createElement("div");
        el.classList.add('log');
        el.textContent = content;
        document.body.appendChild(el);
        const overallStyles = { ...baseStyles, ...styles };
        Object.keys(overallStyles).forEach((key) => {
          el.style[key] = overallStyles[key];
        });
      }
      const _console = {};
      _console.log = console.log;
      _console.assert = console.assert;
      console.log = function () {
        _console.log(...arguments);
        addLog(...arguments);
      };
      console.assert = function (condition, message) {
        _console.assert(condition, message);
        if (!condition) {
          addLog(message || '❌ Assertion failed: console.assert', { color: "tomato" });
        } else {
            addLog(message || '✅ Assertion passed: console.assert', { color: "green" }); 
        }
      };
    </script>
    <script src="${el.href}"></script>
    </body>

    `;
    iframeEl.contentDocument.open();
    iframeEl.contentDocument.write(html);
    iframeEl.contentDocument.close();
  }
  const els = document.querySelectorAll(".webmaker-embed");
  els.forEach(processEmbed);
})();
