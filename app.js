/* Personalise via URL params, e.g.
   ?n=Smile+World+Dental&d=Dr.+Ritika+Sharma&q=BDS,+MDS&a=Gaur+City+2,+Greater+Noida+West
   &p=9873577568&r=4.8&rv=508&y=12&g=f
   Add &live=1 to hide the demo banner (for the real client site). */
(function () {
  document.documentElement.classList.remove('no-js');

  var AGENCY_WA = '917376438478'; // SitePilot WhatsApp (shown on demo banner)
  var DOCTOR_IMG = {
    m: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&q=75&auto=format&fit=crop&crop=faces',
    f: 'https://images.unsplash.com/photo-1736289173074-df6009da27c9?w=900&q=75&auto=format&fit=crop&crop=top',
    t: 'https://images.unsplash.com/photo-1657470179447-0f5aa16daa91?w=900&q=75&auto=format&fit=crop'
  };

  var qs = new URLSearchParams(location.search);
  var get = function (k, d) { var v = (qs.get(k) || '').trim(); return v || d; };

  var digits = get('p', '9876543210').replace(/\D/g, '').slice(-10);
  // Personalised link without a named doctor -> talk about the team, show a neutral clinic photo
  var teamMode = qs.has('n') && !get('d', '');
  var cfg = {
    name: get('n', 'Smile Studio Dental'),
    doctor: teamMode ? 'our experienced dentists' : get('d', 'Dr. Ananya Mehra'),
    qual: get('q', teamMode ? 'BDS & MDS specialists in every field of dentistry' : 'BDS, MDS (Prosthodontics & Implantology)'),
    area: get('a', 'Sector 62, Noida'),
    rating: get('r', '4.9'),
    reviews: get('rv', '350'),
    years: get('y', '12'),
    gender: get('g', '') ? (get('g', '') === 'm' ? 'm' : 'f') : (qs.has('n') ? 't' : 'f'),
    phone: digits
  };
  cfg.address = get('addr', cfg.area);
  cfg.phoneFmt = '+91 ' + digits.slice(0, 5) + ' ' + digits.slice(5);

  // Text bindings
  document.querySelectorAll('[data-k]').forEach(function (el) {
    var v = cfg[el.getAttribute('data-k')];
    if (v != null) el.textContent = v;
  });
  document.title = cfg.name + ' | Painless Dentistry in ' + cfg.area;
  document.getElementById('year').textContent = new Date().getFullYear();

  var docImg = document.getElementById('doctorImg');
  docImg.src = DOCTOR_IMG[cfg.gender];
  docImg.alt = cfg.gender === 't' ? 'Dentist treating a patient at the clinic' : 'Portrait of ' + cfg.doctor;
  if (teamMode) {
    document.querySelector('#doctor h2').textContent = 'Gentle, experienced dentists';
    document.querySelector('#doctor .kicker').textContent = 'Meet the team';
    document.querySelector('.nav a[href="#doctor"]').textContent = 'Our Team';
    document.querySelector('.doctor__quote').textContent =
      '"Most people are nervous about the dentist. Our job is to make sure you leave relaxed, informed, and actually looking forward to your next visit."';
    document.querySelector('#doctor .btn').firstChild.textContent = 'Book a consultation ';
  }

  // Links
  var waText = encodeURIComponent('Hi ' + cfg.name + ', I would like to book a dental appointment.');
  var links = {
    tel: 'tel:+91' + digits,
    wa: 'https://wa.me/91' + digits + '?text=' + waText,
    dir: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cfg.name + ' ' + cfg.address)
  };
  document.querySelectorAll('[data-href]').forEach(function (el) {
    var k = el.getAttribute('data-href');
    el.href = links[k];
    if (k === 'wa') { el.target = '_blank'; el.rel = 'noopener'; }
  });
  document.getElementById('mapFrame').src =
    'https://maps.google.com/maps?q=' + encodeURIComponent(cfg.name + ', ' + cfg.address) + '&z=15&output=embed';

  // Demo banner
  var bar = document.getElementById('demoBar');
  var agencyMsg = encodeURIComponent('Hi Nitin, I saw the website preview for ' + cfg.name + '. I would like to make it live.');
  document.getElementById('demoCta').href = 'https://wa.me/' + AGENCY_WA + '?text=' + agencyMsg;
  document.getElementById('creditLink').href = 'https://sitepilot-navy.vercel.app/';
  if (qs.get('live') === '1') bar.hidden = true;
  document.getElementById('demoClose').addEventListener('click', function () { bar.hidden = true; });

  // Header shadow + mobile menu
  var header = document.getElementById('header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  var setMenu = function (open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  };
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var sibs = Array.prototype.indexOf.call(en.target.parentNode.children, en.target);
        en.target.style.transitionDelay = Math.min(sibs, 5) * 70 + 'ms';
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Next available slot (realistic, based on current time)
  (function () {
    var now = new Date();
    var h = now.getHours() + 2;
    var label;
    if (now.getDay() === 0 ? h < 13 : h < 20) {
      var hh = h > 12 ? h - 12 : h;
      label = 'Today, ' + hh + ':30 ' + (h >= 12 ? 'PM' : 'AM');
    } else {
      label = 'Tomorrow, 10:30 AM';
    }
    document.getElementById('nextSlot').textContent = label;
  })();

  // Booking form
  var SLOTS = ['10:00 AM', '11:30 AM', '1:00 PM', '4:00 PM', '5:30 PM', '7:00 PM'];
  var slotWrap = document.getElementById('slots');
  slotWrap.innerHTML = SLOTS.map(function (s, i) {
    return '<div class="slot"><input type="radio" name="slot" id="s' + i + '" value="' + s + '"><label for="s' + i + '">' + s + '</label></div>';
  }).join('');

  var dateEl = document.getElementById('fDate');
  var iso = function (d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  var today = new Date();
  var max = new Date(); max.setDate(max.getDate() + 60);
  dateEl.min = iso(today); dateEl.max = iso(max);

  var form = document.getElementById('bookForm');
  var phoneEl = document.getElementById('fPhone');
  var nameEl = document.getElementById('fName');
  phoneEl.addEventListener('input', function () { phoneEl.value = phoneEl.value.replace(/\D/g, '').slice(0, 10); });

  var setErr = function (id, input, msg) {
    var el = document.getElementById(id);
    el.textContent = msg || '';
    if (input) {
      input.closest('.field').classList.toggle('has-error', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) input.setAttribute('aria-describedby', id); else input.removeAttribute('aria-describedby');
    }
    return !msg;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameEl.value.trim();
    var phone = phoneEl.value;
    var date = dateEl.value;
    var slot = (form.querySelector('input[name="slot"]:checked') || {}).value;
    var ok = true, first = null;
    if (!setErr('errName', nameEl, name.length < 2 ? 'Please enter your name.' : '')) { ok = false; first = first || nameEl; }
    if (!setErr('errPhone', phoneEl, /^[6-9]\d{9}$/.test(phone) ? '' : 'Enter a valid 10-digit mobile number.')) { ok = false; first = first || phoneEl; }
    if (!setErr('errDate', dateEl, date ? '' : 'Please choose a date.')) { ok = false; first = first || dateEl; }
    if (!setErr('errSlot', null, slot ? '' : 'Please pick a time slot.')) { ok = false; first = first || slotWrap.querySelector('input'); }
    if (!ok) { first.focus(); return; }

    var pretty = new Date(date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    var msg = 'Hello ' + cfg.name + ',\nI would like to book an appointment.\n\n' +
      'Name: ' + name + '\nPhone: +91 ' + phone + '\nTreatment: ' + form.treatment.value +
      '\nDate: ' + pretty + '\nTime: ' + slot;
    window.open('https://wa.me/91' + cfg.phone + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');

    form.innerHTML =
      '<div class="book-success" role="status">' +
      '<span class="book-success__icon"><svg class="ic"><use href="#i-check"/></svg></span>' +
      '<h3>Almost done, ' + name.replace(/[<>&"]/g, '') + '!</h3>' +
      '<p>Send the pre-filled WhatsApp message to confirm your visit on <strong>' + pretty + ', ' + slot + '</strong>.</p>' +
      '<a class="btn btn--ghost" href="' + links.tel + '">Prefer to call? ' + cfg.phoneFmt + '</a></div>';
  });
})();
