document.addEventListener('DOMContentLoaded', () => {
  const Theme = {
    toggleBtn: document.getElementById('theme-toggle'),
    init() {
      const root = document.documentElement;
      const saved = localStorage.getItem('theme');
      if (saved) root.setAttribute('data-theme', saved);
      this.toggleBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }
  };

  const Gallery = {
    filterBtns: document.querySelectorAll('.filter-btn'),
    items: document.querySelectorAll('.gallery-item'),
    init() {
      this.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.activateBtn(btn);
          const filter = btn.getAttribute('data-filter');
          this.filterItems(filter);
        });
        btn.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
      });
      const defaultBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (defaultBtn) this.activateBtn(defaultBtn);
      this.filterItems('all');
      this.lazyLoadFallback();
    },
    activateBtn(btn) {
      this.filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    },
    filterItems(filter) {
      this.items.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.classList.remove('hidden');
          item.style.display = '';
        } else {
          item.classList.add('hidden');
          setTimeout(() => {
            if (item.classList.contains('hidden')) item.style.display = 'none';
          }, 300);
        }
      });
    },
    lazyLoadFallback() {
      const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              obs.unobserve(img);
            }
          });
        });
        lazyImgs.forEach(img => {
          if (img.dataset.src) observer.observe(img);
        });
      } else {
        lazyImgs.forEach(img => {
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        });
      }
    }
  };

  const Calculator = {
    form: document.getElementById('calc-form'),
    input: document.getElementById('price-input'),
    resultEl: document.getElementById('result'),
    init() {
      this.form.addEventListener('submit', e => {
        e.preventDefault();
        this.calculate();
      });
    },
    validate() {
      const val = this.input.value;
      if (val === '' || isNaN(val) || Number(val) < 0) {
        this.input.setCustomValidity('Please enter a valid non-negative number.');
        this.input.reportValidity();
        return false;
      }
      this.input.setCustomValidity('');
      return true;
    },
    calculate() {
      if (!this.validate()) return;
      const val = parseFloat(this.input.value);
      const computed = (val * 1.08).toFixed(2);
      this.resultEl.textContent = `Result: $${computed}`;
    }
  };

  Theme.init();
  Gallery.init();
  Calculator.init();
});
