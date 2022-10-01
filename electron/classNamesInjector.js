run(); document.addEventListener('load', () => { run() })
function run() {
  Array.from(document.querySelectorAll('[style*="--realClassName"]')).map(el => {
    const realClassName = el.style.cssText.match(/--realClassName:([a-zA-Z0-9_]+)/)
    if(!realClassName[1]) return
    el.classList.add(realClassName[1])
  })
}