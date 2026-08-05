/* ══════════════════════════════════════════════════════════════════
   META PIXEL — SỰ KIỆN HÀNH VI DÙNG CHUNG CHO TOÀN BỘ TRANG
   Pixel ID: 2519402271814770

   Mã Pixel gốc + PageView đã nằm trong <head> của từng trang.
   File này CHỈ thêm các sự kiện hành vi (click, cuộn, xem video...).

   Cách gắn: thêm dòng sau ngay trước </body> của mỗi trang:
       <script src="/pixel-events.js" defer></script>

   Hàm dùng chung: vncTrack('TenSuKien', { tham_so: 'giá trị' })
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Tên trang hiện tại (gắn kèm mọi sự kiện để lọc trong Events Manager) ── */
  var PAGE = (function () {
    var p = location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    if (p === '' || p === '/index') return 'salepage';
    return p.replace(/^\//, '') || 'salepage';
  })();

  /* ── Hàm bắn sự kiện, an toàn khi fbq chưa sẵn sàng hoặc bị chặn ── */
  function vncTrack(name, params, standard) {
    try {
      if (typeof window.fbq !== 'function') return;
      var data = params || {};
      data.page = PAGE;
      window.fbq(standard ? 'track' : 'trackCustom', name, data);
    } catch (e) { /* không bao giờ làm vỡ trang vì lỗi tracking */ }
  }
  window.vncTrack = vncTrack;

  /* ── Chống đếm trùng: mỗi sự kiện chỉ bắn 1 lần cho mỗi khoá ── */
  var fired = {};
  function once(key, fn) {
    if (fired[key]) return;
    fired[key] = true;
    fn();
  }
  window.vncTrackOnce = function (key, name, params, standard) {
    once(key, function () { vncTrack(name, params, standard); });
  };

  /* ══ 1. CLICK ZALO / EMAIL / ĐIỆN THOẠI — mọi trang ══ */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';

    if (/zalo\.me|zalo\.vn/i.test(href)) {
      vncTrack('ClickZalo', { link: href });
      return;
    }
    if (/^mailto:/i.test(href)) {
      vncTrack('ClickEmail', { link: href.replace(/^mailto:/i, '') });
      return;
    }
    if (/^tel:/i.test(href)) {
      vncTrack('ClickPhone', { link: href.replace(/^tel:/i, '') });
      return;
    }
    /* Link ra ngoài (YouTube, Facebook, tài liệu...) — bỏ qua link nội bộ */
    if (/^https?:\/\//i.test(href) && href.indexOf(location.hostname) === -1) {
      vncTrack('ClickOutbound', {
        link: href.slice(0, 120),
        label: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80)
      });
    }
  }, true);

  /* ══ 2. ĐỘ SÂU CUỘN — đo người đọc tới đâu thì bỏ ══ */
  (function scrollDepth() {
    var marks = [25, 50, 75, 90];
    function check() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable < 400) return; /* trang ngắn thì không đo */
      var pct = Math.round(((window.pageYOffset || doc.scrollTop) / scrollable) * 100);
      for (var i = 0; i < marks.length; i++) {
        var m = marks[i];
        if (pct >= m) {
          window.vncTrackOnce('scroll' + m, 'ScrollDepth', { percent: m });
        }
      }
    }
    /* Hãm nhịp bằng hẹn giờ (không dùng requestAnimationFrame — hàm đó bị
       trình duyệt tạm dừng khi tab chạy nền, sẽ làm mất sự kiện). */
    var timer = null;
    function onScroll() {
      if (timer) return;
      timer = setTimeout(function () {
        timer = null;
        check();          /* độ sâu cuộn */
        checkSections();  /* đã xem tới khối nào — xem mục 4 bên dưới */
      }, 200);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    /* Chạy một lần sau khi trang dựng xong, để bắt khối đã nằm sẵn trong màn hình */
    setTimeout(function () { check(); checkSections(); }, 300);
  })();

  /* ══ 3. THỜI GIAN Ở LẠI TRANG — tín hiệu chất lượng traffic quảng cáo ══ */
  [30, 90, 180].forEach(function (sec) {
    setTimeout(function () {
      window.vncTrackOnce('time' + sec, 'TimeOnPage', { seconds: sec });
    }, sec * 1000);
  });

  /* ══ 4. XEM TỚI KHỐI QUAN TRỌNG (bảng giá, form) — dùng data-vnc-view ══
     Cách dùng: thêm thuộc tính vào thẻ HTML bất kỳ:
         <section data-vnc-view="BangGia"> ... </section>
     Khi khối đó thật sự hiện ra đủ lâu trên màn hình, ViewSection bắn 1 lần.

     Lưu ý kỹ thuật: KHÔNG dùng IntersectionObserver với ngưỡng phần trăm cố định.
     Nhiều khối trên trang này cao hơn cả màn hình (khối "Bộ 3 Siêu Vũ Khí" cao
     ~2500px, màn hình điện thoại ~700px) — phần trăm hiển thị tối đa chỉ đạt ~29%,
     nên ngưỡng 35% sẽ không bao giờ đạt và sự kiện im lặng không bao giờ bắn.
     Vì vậy đo theo SỐ PIXEL thật sự nhìn thấy, so với màn hình. */
  var viewNodes = document.querySelectorAll('[data-vnc-view]');

  function checkSections() {
    if (!viewNodes.length) return;
    var vh = window.innerHeight;
    Array.prototype.forEach.call(viewNodes, function (el) {
      var nameOfSection = el.getAttribute('data-vnc-view');
      if (fired['view-' + nameOfSection]) return;

      var r = el.getBoundingClientRect();
      var visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (visible <= 0) return;

      /* Coi là "đã xem" khi nhìn thấy nửa màn hình khối đó,
         hoặc 60% khối (với khối thấp hơn màn hình) — lấy mốc nào dễ đạt hơn. */
      var needed = Math.min(vh * 0.5, r.height * 0.6);
      if (visible < needed) return;

      window.vncTrackOnce('view-' + nameOfSection, 'ViewSection', { section: nameOfSection });

      /* Thêm data-vnc-view-content để bắn kèm sự kiện chuẩn ViewContent
         (Meta tối ưu quảng cáo và tạo tệp remarketing tốt hơn với sự kiện chuẩn) */
      if (el.hasAttribute('data-vnc-view-content')) {
        window.vncTrackOnce('vc-' + nameOfSection, 'ViewContent', {
          content_name: nameOfSection,
          content_category: '7-vu-khi-ai'
        }, true);
      }
    });
  }

  /* ══ 5. MỞ CÂU HỎI THƯỜNG GẶP — biết khách vướng mắc điều gì ══ */
  document.addEventListener('click', function (e) {
    var d = e.target && e.target.closest ? e.target.closest('.faq-item') : null;
    if (!d) return;
    /* Lúc click, trạng thái vẫn là cũ → đang mở nghĩa là click này để ĐÓNG, bỏ qua */
    var isOpenNow = d.tagName === 'DETAILS' ? d.open : d.classList.contains('open');
    if (isOpenNow) return;
    var q = d.querySelector('summary, .faq-q');
    vncTrack('OpenFAQ', {
      question: ((q && q.textContent) || '').replace(/\s+/g, ' ').trim().slice(0, 100)
    });
  }, true);

})();
