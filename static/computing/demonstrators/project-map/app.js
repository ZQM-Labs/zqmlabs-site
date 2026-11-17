(function () {
  'use strict';

  var map = L.map('map', { keyboard: true, scrollWheelZoom: true, zoomControl: false }).setView([29.022, -80.918], 13);
  L.control.zoom({ position: 'topright' }).addTo(map);
  var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  var aerialLayer = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    maxNativeZoom: 16,
    attribution: 'Imagery: USDA, USGS The National Map: Orthoimagery'
  });
  osmLayer.addTo(map);

  /* Basemap switcher (Streets | Aerial). The fieldset markup lives in
     index.html (#basemap-switcher); this moves it into the map's top-right
     corner, directly beneath the zoom control. Streets is the default on
     every visit; the choice is not persisted. Only the base raster swaps;
     markers, filter and list are unaffected. */
  var basemapControl = L.control({ position: 'topright' });
  basemapControl.onAdd = function () { return document.getElementById('basemap-switcher'); };
  basemapControl.addTo(map);
  function setBasemap(which) {
    if (which === 'aerial') {
      if (map.hasLayer(osmLayer)) { map.removeLayer(osmLayer); }
      if (!map.hasLayer(aerialLayer)) { aerialLayer.addTo(map); }
    } else {
      if (map.hasLayer(aerialLayer)) { map.removeLayer(aerialLayer); }
      if (!map.hasLayer(osmLayer)) { osmLayer.addTo(map); }
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll('input[name="basemap"]'), function (radio) {
    radio.addEventListener('change', function () { if (radio.checked) { setBasemap(radio.value); } });
  });

  var allProjects = [];      // every row from projects.csv, in file order
  var visibleProjects = [];  // rows passing the current category filter, in file order
  var markers = {};          // id -> Leaflet marker
  var markerLayer = L.layerGroup().addTo(map);
  var selectedId = null;
  var lastInvoker = null;    // element to return focus to when detail is closed

  var listEl = document.getElementById('project-list');
  var filterEl = document.getElementById('category-filter');
  var countEl = document.getElementById('result-count');
  var emptyEl = document.getElementById('empty-state');
  var detailBody = document.getElementById('detail-body');
  var detailHeading = document.getElementById('detail-heading');
  var detailClose = document.getElementById('detail-close');

  /* --- Data loading: live projects.csv first, embedded copy as file:// fallback --- */
  function parseCsvText(text, sourceLabel) {
    var parsed = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: false });
    if (parsed.errors.length) {
      showLoadError('Could not parse ' + sourceLabel + ': ' + parsed.errors[0].message);
      return;
    }
    var rows = parsed.data.filter(function (r) { return r && r.id; });
    allProjects = rows.map(function (r) {
      return {
        id: String(r.id).trim(),
        name: String(r.name || '').trim(),
        category: String(r.category || '').trim(),
        status: String(r.status || '').trim(),
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        description: String(r.description || '').trim(),
        source: String(r.source || '').trim()
      };
    });
    buildFilterOptions();
    render();
  }

  function showLoadError(message) {
    detailBody.innerHTML = '<p><strong>Data could not be loaded.</strong> ' + message + '</p>';
  }

  function loadProjects() {
    fetch('projects.csv')
      .then(function (response) {
        if (!response.ok) { throw new Error('HTTP ' + response.status); }
        return response.text();
      })
      .then(function (text) { parseCsvText(text, 'projects.csv'); })
      .catch(function () {
        // file:// open: browsers commonly block fetch of a local file.
        var embedded = document.getElementById('embedded-csv').textContent;
        parseCsvText(embedded, 'the embedded copy of projects.csv');
        var note = document.createElement('p');
        note.textContent = 'Note: this copy loaded the embedded CSV because the browser blocked reading projects.csv directly from a file:// open. When served over HTTP the live projects.csv is used.';
        detailBody.appendChild(note);
      });
  }

  /* --- Filter --- */
  function buildFilterOptions() {
    var categories = [];
    allProjects.forEach(function (p) {
      if (categories.indexOf(p.category) === -1) { categories.push(p.category); }
    });
    categories.sort();
    categories.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      filterEl.appendChild(opt);
    });
  }

  function currentFilter() { return filterEl.value; }

  /* --- Rendering: markers + list stay in the same file order --- */
  function render() {
    var wanted = currentFilter();
    visibleProjects = allProjects.filter(function (p) {
      return !wanted || p.category === wanted;
    });

    markerLayer.clearLayers();
    markers = {};
    visibleProjects.forEach(function (project, index) {
      var number = index + 1;
      var label = 'Place ' + number + ' of ' + visibleProjects.length + ': ' +
        project.name + ', ' + project.category + ', status ' + project.status;
      var icon = L.divIcon({
        className: 'place-marker',
        html: '<button type="button" class="marker-btn" data-id="' + project.id +
          '" aria-label="' + escapeAttr(label) + '. Press Enter to open details.">' +
          number + '</button>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      var marker = L.marker([project.lat, project.lon], { icon: icon, keyboard: false, title: project.name });
      marker.addTo(markerLayer);
      markers[project.id] = marker;
      // The marker's DOM node is created by Leaflet; wire the inner <button>.
      var btn = marker.getElement() && marker.getElement().querySelector('.marker-btn');
      if (btn) {
        btn.addEventListener('click', function () { openProject(project.id, btn); });
        btn.addEventListener('keydown', onProjectKeydown);
      }
    });

    renderList();
    countEl.textContent = visibleProjects.length + ' of ' + allProjects.length + ' places shown.';
    emptyEl.hidden = visibleProjects.length !== 0;
    if (visibleProjects.length) {
      var bounds = L.latLngBounds(visibleProjects.map(function (p) { return [p.lat, p.lon]; }));
      map.fitBounds(bounds.pad(0.15));
    }
  }

  function renderList() {
    listEl.innerHTML = '';
    visibleProjects.forEach(function (project, index) {
      var li = document.createElement('li');
      var number = index + 1;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'project-open';
      btn.dataset.id = project.id;
      btn.textContent = number + '. ' + project.name;
      btn.setAttribute('aria-label', 'Place ' + number + ' of ' + visibleProjects.length +
        ': ' + project.name + ', ' + project.category + ', status ' + project.status +
        '. Press Enter to open details.');
      btn.addEventListener('click', function () { openProject(project.id, btn); });
      btn.addEventListener('keydown', onProjectKeydown);
      var meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = project.category + ' — ' + project.status;
      var desc = document.createElement('p');
      desc.className = 'meta';
      desc.textContent = project.description;
      li.appendChild(btn);
      li.appendChild(meta);
      li.appendChild(desc);
      listEl.appendChild(li);
    });
  }

  /* --- Keyboard: arrows move focus between projects in list order --- */
  function onProjectKeydown(event) {
    var key = event.key;
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'ArrowDown' && key !== 'ArrowUp') {
      return; // Enter/Space are handled natively by <button> (fires click).
    }
    event.preventDefault();
    event.stopPropagation(); // keep Leaflet's own map-pan arrow keys from also firing
    var id = event.currentTarget.dataset.id;
    var index = visibleProjects.findIndex(function (p) { return p.id === id; });
    if (index === -1) { return; }
    var forward = (key === 'ArrowRight' || key === 'ArrowDown');
    var nextIndex = forward
      ? (index + 1) % visibleProjects.length
      : (index - 1 + visibleProjects.length) % visibleProjects.length;
    focusProject(visibleProjects[nextIndex].id);
  }

  // Focus the marker button if it is in the DOM, else the list button.
  function focusProject(id) {
    var marker = markers[id];
    var markerBtn = marker && marker.getElement() && marker.getElement().querySelector('.marker-btn');
    if (markerBtn) { markerBtn.focus(); return; }
    var listBtn = listEl.querySelector('button[data-id="' + id + '"]');
    if (listBtn) { listBtn.focus(); }
  }

  /* --- Detail panel + focus management --- */
  function openProject(id, invoker) {
    var project = allProjects.find(function (p) { return p.id === id; });
    if (!project) { return; }
    selectedId = id;
    lastInvoker = invoker || null;
    Object.keys(markers).forEach(function (key) {
      var btn = markers[key].getElement() && markers[key].getElement().querySelector('.marker-btn');
      if (btn) { btn.setAttribute('aria-pressed', key === id ? 'true' : 'false'); }
    });
    var badgeClass = project.status === 'Active' ? 'badge-active' : 'badge-other';
    detailBody.innerHTML =
      '<h3>' + escapeHtml(project.name) + '</h3>' +
      '<p><span class="badge ' + badgeClass + '">' + escapeHtml(project.status) + '</span>' +
      '<strong>Category:</strong> ' + escapeHtml(project.category) + '</p>' +
      '<p>' + escapeHtml(project.description) + '</p>' +
      '<p><strong>Location (county record):</strong> ' + project.lat.toFixed(4) + '&deg; N, ' +
      Math.abs(project.lon).toFixed(4) + '&deg; W</p>' +
      '<p><strong>Source:</strong> ' + escapeHtml(project.source) + '</p>';
    detailClose.hidden = false;
    detailHeading.focus(); // move focus into the detail panel
    map.panTo([project.lat, project.lon]);
  }

  function closeDetail() {
    detailBody.innerHTML = '<p>Select a marker on the map or a place in the list to see its details here.</p>';
    detailClose.hidden = true;
    selectedId = null;
    Object.keys(markers).forEach(function (key) {
      var btn = markers[key].getElement() && markers[key].getElement().querySelector('.marker-btn');
      if (btn) { btn.setAttribute('aria-pressed', 'false'); }
    });
    if (lastInvoker && document.contains(lastInvoker)) { lastInvoker.focus(); } // return focus
  }

  detailClose.addEventListener('click', closeDetail);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !detailClose.hidden) { closeDetail(); }
  });

  filterEl.addEventListener('change', function () {
    selectedId = null;
    detailBody.innerHTML = '<p>Select a marker on the map or a place in the list to see its details here.</p>';
    detailClose.hidden = true;
    render();
  });

  document.getElementById('reset-view').addEventListener('click', function () {
    if (visibleProjects.length) {
      var bounds = L.latLngBounds(visibleProjects.map(function (p) { return [p.lat, p.lon]; }));
      map.fitBounds(bounds.pad(0.15));
    } else {
      map.setView([29.022, -80.918], 13);
    }
    var first = document.querySelector('.marker-btn');
    if (first) { first.focus(); }
  });

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escapeAttr(s) { return escapeHtml(s); }

  loadProjects();
})();
