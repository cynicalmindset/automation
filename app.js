/* ═══════════════════════════════════════════
   WORKIK – APP JS
   ═══════════════════════════════════════════ */
(function () {
  'use strict';


  /* ── Hamburger ── */
  const ham        = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    ham.classList.remove('open');
    mobileMenu.classList.remove('open');
  }

  if (ham && mobileMenu) {
    ham.addEventListener('click', () => {
      const opening = !mobileMenu.classList.contains('open');
      opening ? (ham.classList.add('open'), mobileMenu.classList.add('open'))
               : closeMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── Tab Filter (Supported Actions) ── */
  const tabs = document.querySelectorAll('.tab');
  const pills = document.querySelectorAll('.action-pill');

  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    t.classList.add('active');
    const f = t.dataset.filter;
    pills.forEach(p => {
      const show = f === 'all' || p.dataset.type === f;
      p.classList.toggle('hidden', !show);
    });
    /* re-check rows: hide row if all pills hidden */
    document.querySelectorAll('.action-row').forEach(row => {
      const anyVisible = [...row.querySelectorAll('.action-pill')].some(p => !p.classList.contains('hidden'));
      row.style.display = anyVisible ? '' : 'none';
    });
  }));

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      /* close all */
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  /* ── Scroll Reveal ── */
  const revealAll = document.querySelectorAll(
    '.headline, .sub, .tmpl-card, .action-pill, .feat-card, .model-item, .step-card, .faq-item, .cta-card, .connect-stage, .ms-item, .dv-node'
  );
  revealAll.forEach(el => el.classList.add('reveal'));

  const ro = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...(entry.target.parentElement?.querySelectorAll('.reveal') || [])];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in'), Math.min(idx * 55, 280));
        ro.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealAll.forEach(el => ro.observe(el));

  /* ── Animated counter ── */
  const counters = document.querySelectorAll('.ms-num[data-target]');
  const co = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let cur = 0; const dur = 800; const step = 16;
      const inc = target / (dur / step);
      const t = setInterval(() => {
        cur = Math.min(cur + inc, target);
        el.textContent = Math.round(cur);
        if (cur >= target) clearInterval(t);
      }, step);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => co.observe(el));

  /* ── Connect your stack: scrolling columns + interactive card ── */
  /* color = tint used on dark column boxes; dark = readable on light card */
  const CONNECT_APPS = [
    { id: 'slack',     abbr: 'SL', name: 'Slack',     color: '#36C5F0', dark: '#0369a1', bg: 'rgba(54,197,240,.18)',   features: ['Get notified on task updates instantly','Create tasks via Slack slash commands','Ask AI, get answers in your thread','Sync team context from Slack conversations','Trigger automations from Slack events'] },
    { id: 'github',    abbr: 'GT', name: 'GitHub',    color: '#94a3b8', dark: '#1e293b', bg: 'rgba(148,163,184,.14)',  features: ['Auto-create issues from CI failures','Track PR status and code reviews','Trigger workflows on every push','Link commits to project tasks','Get real-time code review alerts'] },
    { id: 'jira',      abbr: 'JR', name: 'Jira',      color: '#4C9AFF', dark: '#1d4ed8', bg: 'rgba(76,154,255,.18)',  features: ['Sync sprints with Jira boards','Auto-update issue status on merge','Create subtasks from triggers','Track velocity and burndown metrics','Push deployment notes to tickets'] },
    { id: 'notion',    abbr: 'NT', name: 'Notion',    color: '#94a3b8', dark: '#1e293b', bg: 'rgba(148,163,184,.12)', features: ['Auto-append meeting summaries to pages','Sync task databases in real time','Create pages from workflow templates','Push standup reports automatically','Archive completed sprints to docs'] },
    { id: 'anthropic', abbr: 'AN', name: 'Anthropic', color: '#a78bfa', dark: '#6d28d9', bg: 'rgba(124,58,237,.22)', features: ['Use Claude for intelligent routing','Summarize long threads with AI','Generate PR descriptions automatically','Answer team questions in-context','Draft content from structured data'] },
    { id: 'figma',     abbr: 'FG', name: 'Figma',     color: '#F24E1E', dark: '#c2410c', bg: 'rgba(242,78,30,.18)',   features: ['Export assets on design publish','Notify engineers on spec changes','Create tickets from design comments','Sync component library versions','Track design-to-dev handoff status'] },
    { id: 'aws',       abbr: 'AW', name: 'AWS',        color: '#FF9900', dark: '#b45309', bg: 'rgba(255,153,0,.16)',   features: ['Trigger pipelines on S3 events','Monitor CloudWatch alarms in Slack','Auto-scale based on workflow load','Archive logs to S3 automatically','Get cost anomaly alerts instantly'] },
    { id: 'zoom',      abbr: 'ZM', name: 'Zoom',       color: '#2D8CFF', dark: '#1d4ed8', bg: 'rgba(45,140,255,.18)',  features: ['Transcribe calls and save to Notion','Send post-meeting summaries to Slack','Create action items from recordings','Schedule meetings from task comments','Sync attendees with CRM contacts'] },
    { id: 'hubspot',   abbr: 'HB', name: 'HubSpot',   color: '#FF7A59', dark: '#c2410c', bg: 'rgba(255,122,89,.18)',  features: ['Trigger welcome flows on signup','Sync contacts from form submissions','Update deal stages from task events','Create CRM notes from Slack threads','Push NPS scores to dashboards'] },
    { id: 'linear',    abbr: 'LN', name: 'Linear',    color: '#5E6AD2', dark: '#4338ca', bg: 'rgba(94,106,210,.22)',  features: ['Auto-triage issues to the right team','Sync cycle progress with Slack','Create issues from error reports','Update estimates on PR activity','Track roadmap status in real time'] },
    { id: 'docker',    abbr: 'DK', name: 'Docker',     color: '#2496ED', dark: '#1d4ed8', bg: 'rgba(36,150,237,.18)',  features: ['Build images on git push','Push container alerts to Slack','Auto-tag images on release','Monitor container health metrics','Rollback on failed health checks'] },
    { id: 'sentry',    abbr: 'SN', name: 'Sentry',    color: '#FB4226', dark: '#b91c1c', bg: 'rgba(251,66,38,.18)',   features: ['Auto-create tickets on new errors','Assign bugs to the last committer','Track error rate trends in dashboards','Alert on performance regressions','Link errors to GitHub commits'] },
  ];

  function buildConnectSection() {

    /* Mobile: 3 horizontal scrolling rows — built first, independent of column wrappers */
    const mobileWrap = document.getElementById('connectRowsMobile');
    if (mobileWrap) {
      const rowDefs = [
        { indices: [0,1,2,3,4,5,6,7,8,9,10,11], cls: '' },
        { indices: [6,7,8,9,10,11,0,1,2,3,4,5], cls: 'cr-right' },
        { indices: [3,5,7,9,1,11,0,4,6,8,2,10], cls: 'cr-left2' },
      ];
      rowDefs.forEach(({ indices, cls }) => {
        const apps = [...indices, ...indices].map(i => CONNECT_APPS[i]);
        const row = document.createElement('div');
        row.className = 'cr-row';
        const track = document.createElement('div');
        track.className = 'cr-track' + (cls ? ' ' + cls : '');
        apps.forEach(app => {
          const box = document.createElement('div');
          box.className = 'logo-box';
          const img = document.createElement('img');
          img.src = '';
          img.alt = app.name;
          box.appendChild(img);
          track.appendChild(box);
        });
        row.appendChild(track);
        mobileWrap.appendChild(row);
      });
    }

    const leftWrap  = document.getElementById('connectLeft');
    const rightWrap = document.getElementById('connectRight');
    if (!leftWrap || !rightWrap) return;

    leftWrap.innerHTML  = '';
    rightWrap.innerHTML = '';

    /* [wrapper, appIndices, scrollDir, durationSec] — 3 cols per side */
    const colDefs = [
      [leftWrap,  [0,2,4,6,8,10],  'down', 20],
      [leftWrap,  [1,3,5,7,9,11],  'up',   15],
      [leftWrap,  [0,3,6,9,2,5],   'down', 26],
      [rightWrap, [1,5,9,3,7,11],  'up',   17],
      [rightWrap, [0,2,4,6,8,10],  'down', 23],
      [rightWrap, [4,7,10,1,8,11], 'up',   19],
    ];

    colDefs.forEach(([wrap, indices, dir, speed]) => {
      const apps   = indices.map(i => CONNECT_APPS[i]);
      const doubled = [...apps, ...apps]; /* duplicate for seamless loop */

      const col   = document.createElement('div');
      col.className = 'logo-col';

      const inner = document.createElement('div');
      inner.className = 'logo-col-inner' + (dir === 'down' ? ' dir-down' : '');
      inner.style.animationDuration = speed + 's';

      doubled.forEach(app => {
        const box = document.createElement('div');
        box.className = 'logo-box';
        box.dataset.appId = app.id;
        box.style.background = app.bg;
        box.style.color      = app.color;
        box.textContent      = app.abbr;
        inner.appendChild(box);
      });

      col.appendChild(inner);
      wrap.appendChild(col);
    });


    /* Click → update center card */
    const stage = document.querySelector('.connect-stage');
    if (!stage) return;

    function updateCard(app) {
      const card = document.getElementById('connectCard');
      card.classList.add('fading');
      setTimeout(() => {
        const icon = document.getElementById('ccIcon');
        icon.textContent      = app.abbr;
        icon.style.background = app.bg;
        icon.style.color      = app.dark;
        document.getElementById('ccName').textContent    = app.name;
        document.getElementById('ccHowName').textContent = app.name;
        document.getElementById('ccList').innerHTML =
          app.features.map(f => `<li>${f}</li>`).join('');
        /* snap to below, then let CSS transition slide it back up */
        card.style.transition = 'none';
        card.style.transform  = 'translateX(-50%) translateY(24px)';
        card.classList.remove('fading');
        requestAnimationFrame(() => requestAnimationFrame(() => {
          card.style.transition = '';
          card.style.transform  = '';
        }));
      }, 220);
    }

    stage.addEventListener('click', e => {
      const box = e.target.closest('.logo-box');
      if (!box) return;
      const app = CONNECT_APPS.find(a => a.id === box.dataset.appId);
      if (!app) return;
      document.querySelectorAll('.logo-box.active').forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.logo-box[data-app-id="${app.id}"]`).forEach(b => b.classList.add('active'));
      updateCard(app);
    });
  }

  buildConnectSection();

  /* ── Drag-drop flow node highlight animation ── */
  const dvNodes = document.querySelectorAll('.dv-node');
  if (dvNodes.length) {
    let ci = 0;
    setInterval(() => {
      dvNodes.forEach(n => (n.style.background = ''));
      dvNodes[ci].style.background = 'rgba(124,58,237,.12)';
      ci = (ci + 1) % dvNodes.length;
    }, 1200);
  }

  /* ── Pause marquee on hover ── */
  const track = document.getElementById('modelsTrack');
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

  /* ── How section swiper (mobile only) ── */
  function initHowSwiper() {
    if (window.innerWidth > 640) return;
    const cards = Array.from(document.querySelectorAll('.how-step-card'));
    const dots  = Array.from(document.querySelectorAll('.how-dot'));
    const row   = document.querySelector('.how-steps-row');
    if (!cards.length || !row) return;

    let current = 0;
    let startX  = 0;

    function update() {
      cards.forEach((c, i) => {
        c.classList.remove('swipe-prev', 'swipe-active', 'swipe-next');
        if (i === current)         c.classList.add('swipe-active');
        else if (i === current - 1) c.classList.add('swipe-prev');
        else if (i === current + 1) c.classList.add('swipe-next');
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    row.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    row.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0 && current < cards.length - 1) current++;
      else if (dx > 0 && current > 0) current--;
      update();
    }, { passive: true });

    update();
  }

  initHowSwiper();

})();
