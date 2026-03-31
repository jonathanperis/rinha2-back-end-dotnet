(() => {
  const container = document.getElementById('reports-container');
  if (!container) return;

  const API_URL = 'https://api.github.com/repos/jonathanperis/rinha2-back-end-dotnet/contents/docs/reports?ref=main';
  const BASE_URL = 'https://jonathanperis.github.io/rinha2-back-end-dotnet/reports/';
  const MAX_REPORTS = 10;

  function parseDate(filename) {
    // stress-test-report-YYYYMMDDHHMMSS.html
    const m = filename.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    if (!m) return null;
    return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`);
  }

  function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false
    });
  }

  function renderReports(files) {
    let htmlFiles = files
      .filter(f => f.name.endsWith('.html'))
      .sort((a, b) => b.name.localeCompare(a.name))
      .slice(0, MAX_REPORTS);

    if (!htmlFiles.length) {
      container.innerHTML = '<div class="reports-empty">No reports found.</div>';
      return;
    }

    const list = document.createElement('ul');
    list.className = 'reports-list';

    htmlFiles.forEach((file, i) => {
      const date = parseDate(file.name);
      const li = document.createElement('li');
      li.className = 'report-item';
      li.innerHTML = `
        <div class="report-info">
          <span class="report-icon">${i === 0 ? '&#9679;' : '&#9675;'}</span>
          <span class="report-name">${file.name.replace('.html', '')}</span>
        </div>
        <span class="report-date">${formatDate(date)}</span>
        <a href="${BASE_URL}${file.name}" target="_blank" rel="noopener" class="report-link">View &rarr;</a>
      `;
      list.appendChild(li);
    });

    container.innerHTML = '';
    container.appendChild(list);
  }

  fetch(API_URL)
    .then(r => {
      if (!r.ok) throw new Error(`GitHub API: ${r.status}`);
      return r.json();
    })
    .then(renderReports)
    .catch(err => {
      console.error('Error fetching reports:', err);
      container.innerHTML = '<div class="reports-empty">Failed to load reports. Try refreshing.</div>';
    });
})();
