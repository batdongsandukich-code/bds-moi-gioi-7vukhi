/* ══════════════════════════════════════════════════════════════════════════
   VIDEO VSL — 9 ĐOẠN, RẢI THEO MẠCH TÂM LÝ CỦA TRANG BÁN HÀNG

   ANH CHỈ CẦN SỬA DUY NHẤT BẢNG "VSL" NGAY BÊN DƯỚI.

   Cách làm:
   1. Tải video lên YouTube, chọn chế độ "Không công khai" (Unlisted).
   2. Mở video, nhìn thanh địa chỉ:  youtube.com/watch?v=AbCdEfGh123
      → mã cần lấy là phần sau dấu "=", tức  AbCdEfGh123
   3. Dán mã đó vào ô 'id' tương ứng bên dưới, giữ nguyên dấu nháy.
   4. Lưu file → deploy lại Vercel.

   Ô 'id' để trống ('') thì khối video đó TỰ ẨN, khách không nhìn thấy gì cả.
   Nhờ vậy anh có thể up dần từng video, không cần đủ 9 cái mới đăng được.

   ── TRẠNG THÁI HIỆN TẠI: đang dùng 6 video (ô 1, 2, 5, 7, 8, 9) ──
   Ô 3, 4, 6 CỐ Ý để trống. Quyết định này là có chủ đích, không phải làm thiếu:
   nhồi quá nhiều video vào một trang bán hàng sẽ khiến khách phân vân không biết
   bấm cái nào, kết cục là không xem cái nào cả.

   6 video hiện trải đều ở mốc 4% · 8% · 19% · 66% · 84% · 97% chiều dài trang
   (cộng thêm 2 video demo công cụ ở mốc 47% và 50%) — đủ dày để giữ chân,
   đủ thưa để không loãng.

   Sau này nếu muốn thêm, chỉ cần dán mã vào ô 3, 4 hoặc 6 là nó tự hiện ra.
   ══════════════════════════════════════════════════════════════════════════ */

var VSL = [
  { slot: 1, id: 'ZufRv7yYe90', ten: '01 Hook',
    tua: 'Xem trước 2 phút: vì sao môi giới giỏi vẫn đuối sức',
    mo:  'Nếu bạn chỉ có 2 phút, hãy xem đoạn này trước.' },

  { slot: 2, id: '6Y6C80rC6a8', ten: '02 Authority Intro',
    tua: 'Tôi là ai mà nói chuyện này với bạn?',
    mo:  'Vài phút để bạn biết người đang hướng dẫn mình là ai.' },

  { slot: 3, id: '', ten: '03 Goi ten van de',
    tua: 'Gọi đúng tên vấn đề bạn đang gặp',
    mo:  'Nếu bạn vừa tick vài dấu ở trên, đoạn này nói đúng chuyện của bạn.' },

  { slot: 4, id: '', ten: '04 Ba vong lap be tac',
    tua: 'Ba vòng lặp khiến bạn mãi không thoát ra được',
    mo:  'Không phải bạn lười. Là bạn đang kẹt trong ba vòng lặp này.' },

  { slot: 5, id: 'ekJQW42Jd5s', ten: '05 Nguyen nhan goc',
    tua: 'Nguyên nhân gốc — đoạn quan trọng nhất',
    mo:  'Nếu chỉ xem một đoạn duy nhất trong trang này, hãy xem đoạn này.' },

  { slot: 6, id: '', ten: '06 Dap cach cu',
    tua: 'Vì sao cách làm cũ không còn cứu được bạn',
    mo:  'Làm chăm hơn theo cách cũ chỉ khiến bạn kiệt sức nhanh hơn.' },

  { slot: 7, id: 'lQBg3SWVRqY', ten: '08 Cau chuyen khoi nguon va Giai phap',
    tua: 'Nghe Tiến kể trọn hành trình — và cách giải quyết',
    mo:  'Chuyện bắt đầu từ đâu, và bộ 7 vũ khí ra đời thế nào.' },

  { slot: 8, id: 'mhilsqclHPk', ten: '09 Bang chung va Chao gia neo',
    tua: 'Bằng chứng thật — và vì sao mức giá này',
    mo:  'Xem kết quả thật trước khi quyết định. 6 phút, không vòng vo.' },

  { slot: 9, id: 'h2Bmjqwi-kc', ten: '10 Keu goi hanh dong',
    tua: 'Lời cuối trước khi bạn quyết định',
    mo:  'Hai đường đi — và điều gì xảy ra nếu bạn không chọn gì cả.' }
];

/* ── Từ đây trở xuống là phần kỹ thuật, anh không cần sửa ────────────────── */
(function () {
  'use strict';

  /* ══ CHỈ CHO PHÉP MỘT VIDEO CHẠY TẠI MỘT THỜI ĐIỂM ══
     Không có phần này thì khách bấm ô 1 nghe một lúc, cuộn xuống bấm ô 5,
     hai giọng nói sẽ đè lên nhau — khách bực và thoát trang.
     Cách xử lý: video nào đang chạy mà không phải video vừa bấm thì trả về
     ảnh đại diện (gỡ khung nhúng đi là tiếng tắt luôn). */
  var dsVideo = [];

  window.vncDangKyVideo = function (khung, tatDi) {
    dsVideo.push({ khung: khung, tatDi: tatDi });
  };

  window.vncTatVideoKhac = function (khungDangPhat) {
    dsVideo.forEach(function (v) {
      if (v.khung === khungDangPhat) return;
      if (!v.khung.querySelector('iframe')) return;   /* nó có chạy đâu mà tắt */
      try { v.tatDi(); } catch (e) {}
    });
  };

  function dungKhoiVideo(cfg) {
    var boc = document.createElement('div');
    boc.className = 'vsl-block';

    /* Ô 1 nằm ngay đầu trang → tải ngay và ưu tiên cao, tránh khoảng trống
       nhấp nháy đúng lúc khách vừa vào. Các ô sau nằm sâu dưới → tải trễ cho nhẹ trang. */
    var dauTrang = (cfg.slot === 1);
    var cachTai = dauTrang
      ? 'loading="eager" fetchpriority="high"'
      : 'loading="lazy"';

    boc.innerHTML =
      '<p class="vsl-tua">' + cfg.tua + '</p>' +
      '<div class="vsl-frame" role="button" tabindex="0" aria-label="Phát video: ' + cfg.tua + '">' +
        /* Dùng ảnh nét cao 1280x720 (đúng tỷ lệ 16:9). Video nào không có bản này
           thì tự lùi về hqdefault — xem hàm loiAnh bên dưới. */
        '<img class="vsl-thumb" src="https://img.youtube.com/vi/' + cfg.id + '/maxresdefault.jpg" ' +
             'alt="' + cfg.tua + '" ' + cachTai + '>' +
        '<span class="vsl-play"><span class="vsl-tri">▶</span></span>' +
      '</div>' +
      '<p class="vsl-mo">' + cfg.mo + '</p>';

    /* Ảnh nét cao không phải video nào cũng có → lùi về bản chắc chắn tồn tại */
    var anh = boc.querySelector('.vsl-thumb');
    anh.addEventListener('error', function loiAnh() {
      anh.removeEventListener('error', loiAnh);
      anh.src = 'https://img.youtube.com/vi/' + cfg.id + '/hqdefault.jpg';
    });

    var khung = boc.querySelector('.vsl-frame');

    /* Trả khối về lại ảnh đại diện — dùng khi khách bấm sang video khác */
    var htmlAnh = null;
    function tatDi() {
      if (htmlAnh === null) return;
      khung.innerHTML = htmlAnh;
      khung.setAttribute('tabindex', '0');
    }
    window.vncDangKyVideo(khung, tatDi);

    function phat() {
      if (khung.querySelector('iframe')) return;   /* đang chạy rồi, bấm nữa không làm gì */

      /* Nhớ lại ảnh đại diện đang dùng (có thể là bản dự phòng hqdefault)
         để lát nữa trả về đúng cái đó, không bị vỡ ảnh. */
      htmlAnh = khung.innerHTML;

      /* Tắt mọi video khác trước — mỗi lúc chỉ một clip được nói */
      window.vncTatVideoKhac(khung);

      khung.innerHTML =
        '<iframe src="https://www.youtube.com/embed/' + cfg.id +
        '?autoplay=1&rel=0&modestbranding=1&playsinline=1" ' +
        'title="' + cfg.tua + '" ' +
        'style="position:absolute;inset:0;width:100%;height:100%;border:0;" ' +
        'allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      khung.removeAttribute('tabindex');   /* nhường phím Tab cho khung nhúng */

      /* Meta Pixel — biết đoạn VSL nào được bấm xem, đoạn nào bị bỏ qua */
      if (typeof window.vncTrack === 'function') {
        window.vncTrack('VideoPlay', {
          video_id: cfg.id, video_name: cfg.ten, vsl_slot: cfg.slot
        });
      }
    }
    khung.addEventListener('click', phat);
    khung.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); phat(); }
    });
    return boc;
  }

  function chay() {
    VSL.forEach(function (cfg) {
      var oCho = document.querySelector('[data-vsl="' + cfg.slot + '"]');
      if (!oCho) return;
      /* Nếu khối video nằm trong một section riêng (đánh dấu data-vsl-wrap) thì
         ẩn/hiện cả section — nếu không, khi chưa có mã sẽ còn lại một dải màu trống. */
      var boc = oCho.closest ? oCho.closest('[data-vsl-wrap]') : null;
      var ma = (cfg.id || '').trim();

      if (!ma) {                                          /* chưa có mã → ẩn hẳn */
        (boc || oCho).style.display = 'none';
        return;
      }
      if (boc) boc.style.display = '';
      oCho.style.display = '';
      oCho.innerHTML = '';
      oCho.appendChild(dungKhoiVideo(cfg));
    });

    dangKyVideoDemo();
  }

  /* Hai video demo công cụ (Content Hàng Loạt, Tool Định Giá) dùng hàm playVideo
     viết sẵn trong trang. Đăng ký chúng vào cùng danh sách để chúng cũng tắt đi
     khi khách bấm sang video khác — nếu không, bấm demo vẫn đè tiếng lên VSL. */
  function dangKyVideoDemo() {
    var ds = document.querySelectorAll('[onclick^="playVideo"]');
    Array.prototype.forEach.call(ds, function (el) {
      var htmlAnh = el.innerHTML;   /* chụp lại lúc trang vừa dựng, chưa ai bấm */
      window.vncDangKyVideo(el, function () { el.innerHTML = htmlAnh; });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', chay);
  } else { chay(); }
})();
