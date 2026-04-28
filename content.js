(function () {
  const BUTTON_ID = 'netlify-env-shortcut';

  function getSiteSlug() {
    const match = location.pathname.match(/^\/projects\/([^/]+)/);
    return match ? match[1] : null;
  }

  function getEnvVarsUrl(slug) {
    return `/projects/${slug}/configuration/env`;
  }

  function isActive() {
    return /\/configuration\/env/.test(location.pathname);
  }

  function findAnchorByText(text) {
    return Array.from(document.querySelectorAll('a')).find(
      (a) => a.textContent.trim() === text,
    );
  }

  function getInsertTarget(anchor) {
    let node = anchor;
    while (node && node.parentElement && node.parentElement !== document.body) {
      if (node.parentElement.children.length > 1) return node;
      node = node.parentElement;
    }
    return anchor;
  }

  function buildNode(referenceAnchor, slug) {
    const active = isActive();
    const url = getEnvVarsUrl(slug);

    const wrapper = referenceAnchor.parentElement.cloneNode(false);
    wrapper.id = BUTTON_ID;

    const a = referenceAnchor.cloneNode(true);
    a.href = url;
    a.removeAttribute('aria-current');

    const textEl = Array.from(a.querySelectorAll('*')).find((el) => el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE);
    if (textEl) {
      textEl.textContent = 'Env vars';
    } else {
      const textNode = Array.from(a.childNodes).find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (textNode) textNode.textContent = 'Env vars';
      else a.textContent = 'Env vars';
    }

    if (active) {
      a.setAttribute('aria-current', 'page');
      a.style.color = '#00ad9f';
      a.style.fontWeight = '600';
    } else {
      a.style.color = '';
      a.style.fontWeight = '';
    }

    wrapper.appendChild(a);
    return wrapper;
  }

  function inject() {
    if (document.getElementById(BUTTON_ID)) return;

    const slug = getSiteSlug();
    if (!slug) return;

    const projectConfigAnchor = findAnchorByText('Project configuration');
    const deploysAnchor = findAnchorByText('Deploys');
    const referenceAnchor = projectConfigAnchor || deploysAnchor;
    if (!referenceAnchor) return;

    const insertAfter = getInsertTarget(referenceAnchor);
    const node = buildNode(deploysAnchor || referenceAnchor, slug);
    insertAfter.after(node);
  }

  function updateActiveState() {
    const existing = document.getElementById(BUTTON_ID);
    if (!existing) return;
    const a = existing.querySelector('a');
    if (!a) return;
    const active = isActive();
    if (active) {
      a.setAttribute('aria-current', 'page');
      a.style.color = '#00ad9f';
      a.style.fontWeight = '600';
    } else {
      a.removeAttribute('aria-current');
      a.style.color = '';
      a.style.fontWeight = '';
    }
  }

  let lastPath = location.pathname;

  const observer = new MutationObserver(() => {
    const currentPath = location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      document.getElementById(BUTTON_ID)?.remove();
    }
    inject();
    updateActiveState();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  inject();
})();
