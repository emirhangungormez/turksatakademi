document.querySelectorAll(".roadmap-task-row").forEach((button) => {
  button.addEventListener("click", () => {
    const task = button.closest(".roadmap-task");
    const isExpanded = task?.classList.toggle("is-expanded");
    button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  });
});

const searchItems = [
  {
    title: "Kurumsal akademi neden yalnızca video kataloğu değildir?",
    type: "Blog yazısı",
    url: "docs.html#blog",
    text: "Sertifika, doküman, yayın ve kariyer başvurularının aynı platformda birleştiği akademi yaklaşımı."
  },
  {
    title: "Uydu haberleşmesine giriş",
    type: "Blog yazısı",
    url: "docs.html#blog",
    text: "Kapsama, yörünge, yer istasyonu, uplink ve downlink kavramlarına giriş."
  },
  {
    title: "Staj başvurusunda teknik profil nasıl hazırlanır?",
    type: "Kariyer rehberi",
    url: "docs.html#blog",
    text: "Genç yeteneklerin teknik profil, yetkinlik ve ilgi alanlarını hazırlaması."
  },
  {
    title: "LEO ve GEO uydu mimarileri",
    type: "Tez özeti",
    url: "docs.html#tezler",
    text: "Uydu mimarilerinin kurumsal kullanım senaryoları ve eğitim içerikleri."
  },
  {
    title: "Network 101 ders notu",
    type: "Teknik not",
    url: "docs.html#teknik-notlar",
    text: "OSI katmanları, IP adresleme, DNS ve yönlendirme için kısa referans."
  },
  {
    title: "Siber Güvenlik 101 kontrol listesi",
    type: "Teknik not",
    url: "docs.html#teknik-notlar",
    text: "Parola, MFA, e-posta güvenliği ve olay bildirimi kontrol listesi."
  },
  {
    title: "Network 101",
    type: "Eğitim",
    url: "network101.html",
    text: "Ağ temelleri için 8 videoluk başlangıç serisi."
  },
  {
    title: "Siber Güvenlik 101",
    type: "Eğitim",
    url: "siber-guvenlik101.html",
    text: "Siber farkındalık için 10 videoluk başlangıç serisi."
  }
];

function createSearchModal() {
  const modal = document.createElement("div");
  modal.className = "search-modal";
  modal.innerHTML = `
    <div class="search-dialog" role="dialog" aria-modal="true" aria-label="Doküman araması">
      <div class="search-dialog-head">
        <strong>Dokümanlarda ara</strong>
        <button type="button" class="search-close" aria-label="Aramayı kapat">×</button>
      </div>
      <input class="search-input" type="search" placeholder="Blog, tez, eğitim veya teknik not ara" autocomplete="off">
      <div class="search-results"></div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

const searchModal = createSearchModal();
const searchInput = searchModal.querySelector(".search-input");
const searchResults = searchModal.querySelector(".search-results");

function renderSearchResults(query = "") {
  const normalized = query.trim().toLocaleLowerCase("tr-TR");
  const results = normalized
    ? searchItems.filter((item) => `${item.title} ${item.type} ${item.text}`.toLocaleLowerCase("tr-TR").includes(normalized))
    : searchItems.slice(0, 5);

  searchResults.innerHTML = results.length
    ? results.map((item) => `
        <a class="search-result" href="${item.url}">
          <span>${item.type}</span>
          <strong>${item.title}</strong>
          <p>${item.text}</p>
        </a>
      `).join("")
    : `<p class="search-empty">Sonuç bulunamadı. "network", "uydu" veya "siber" deneyebilirsiniz.</p>`;
}

function openSearch() {
  searchModal.classList.add("is-open");
  renderSearchResults(searchInput.value);
  setTimeout(() => searchInput.focus(), 20);
}

function closeSearch() {
  searchModal.classList.remove("is-open");
}

document.querySelectorAll(".search-pill, .search-launch").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openSearch();
  });
});

searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
searchModal.querySelector(".search-close").addEventListener("click", closeSearch);
searchModal.addEventListener("click", (event) => {
  if (event.target === searchModal) closeSearch();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSearch();
});
renderSearchResults();

const internshipForm = document.getElementById("internshipForm");
const applicationCard = document.getElementById("applicationCard");
const internshipRequestsBody = document.getElementById("internshipRequestsBody");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if (internshipForm && applicationCard) {
  internshipForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(internshipForm);
    const name = escapeHtml(data.get("name") || "Demo aday");
    const school = escapeHtml(data.get("school") || "Üniversite bilgisi");
    const grade = escapeHtml(data.get("grade") || "Sınıf bilgisi");
    const track = escapeHtml(data.get("track") || "Genel başvuru");
    const skills = String(data.get("skills") || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    const escapedSkills = skills.map(escapeHtml);

    applicationCard.innerHTML = `
      <span class="application-label">Aktif stajyer başvurusu</span>
      <h2>${name}</h2>
      <p>${school} · ${grade}</p>
      <div class="skill-strip">
        ${escapedSkills.map((skill) => `<span>${skill}</span>`).join("")}
      </div>
      <div class="application-status">
        <span></span>
        <p>${track} alanı için başvuru demo ortamında aktif.</p>
      </div>
    `;

    if (internshipRequestsBody) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${name}</strong><span>${grade}</span></td>
        <td>${school}</td>
        <td>${track}</td>
        <td>${escapedSkills.join(", ") || "Yetkinlik bilgisi bekleniyor"}</td>
        <td><span class="request-status is-active">Aktif</span></td>
      `;
      internshipRequestsBody.prepend(row);
    }
  });
}

const satelliteInfo = document.getElementById("satelliteInfo");
const satelliteDots = document.querySelectorAll(".satellite-dot");
const satelliteData = {
  "6A": {
    title: "Türksat 6A",
    text: "Türkiye'nin yerli haberleşme uydusu. Akademi tarafında teknoloji yetkinliği, stratejik bağımsızlık ve uydu haberleşmesi anlatısının merkezinde konumlanır.",
    orbit: "42° Doğu",
    focus: "Yerli uydu kabiliyeti",
    academy: "Uydu Haberleşmesi 101"
  },
  "5B": {
    title: "Türksat 5B",
    text: "Yüksek kapasiteli uydu servisleri, veri iletişimi ve geniş bant senaryoları için akademi içinde örnek servis altyapısı olarak anlatılır.",
    orbit: "42° Doğu",
    focus: "Yüksek kapasite",
    academy: "Kapasite ve servis modeli"
  },
  "5A": {
    title: "Türksat 5A",
    text: "Kapsama, frekans yönetimi ve yayın hizmetleri başlıklarının görselleştirilmesi için uydu merkezi içinde referans noktasıdır.",
    orbit: "31° Doğu",
    focus: "Kapsama ve yayın",
    academy: "Uydu kapsama okuryazarlığı"
  },
  "4A": {
    title: "Türksat 4A",
    text: "Yayıncılık, haberleşme sürekliliği ve operasyonel uydu hizmetleri için temel akademi örneklerinden biri olarak konumlandırılır.",
    orbit: "42° Doğu",
    focus: "Yayıncılık",
    academy: "Operasyonel uydu hizmetleri"
  },
  "4B": {
    title: "Türksat 4B",
    text: "Veri servisleri, Ka-bant uygulamaları ve coğrafi erişim senaryolarının anlatımı için teknik bilgi katmanına bağlanır.",
    orbit: "50° Doğu",
    focus: "Veri servisleri",
    academy: "Ka-bant uygulamaları"
  },
  "3A": {
    title: "Türksat 3A",
    text: "Uydu filosunun tarihsel sürekliliği ve yayın operasyonlarının gelişimi için arşiv ve eğitim bağlamı sağlar.",
    orbit: "42° Doğu",
    focus: "Filo sürekliliği",
    academy: "Uydu tarihi ve gelişim"
  }
};

const groundStationData = {
  "golbasi-campus": {
    title: "Genel Müdürlük Kampüsü",
    text: "Yağlıpınar Mahallesi Türksat Küme Evler No:1 Gölbaşı / Ankara adresindeki ana Türksat kampüsü.",
    orbit: "Gölbaşı / Ankara",
    focus: "Genel müdürlük ve uydu yerleşkesi",
    academy: "Kurumsal merkez"
  },
  "ovecler": {
    title: "Öveçler Hizmet Binası",
    text: "Cevizlidere Mahallesi, Cevizlidere Caddesi No:31 Çankaya / Ankara adresindeki Türksat hizmet binası.",
    orbit: "Çankaya / Ankara",
    focus: "Hizmet binası",
    academy: "Kurumsal operasyon"
  },
  "macunkoy": {
    title: "Macunköy Yerleşkesi",
    text: "Çamlıca Mahallesi, 147. Sokak No:21/D Yenimahalle / Ankara adresindeki Türksat yerleşkesi.",
    orbit: "Yenimahalle / Ankara",
    focus: "Yerleşke",
    academy: "Operasyonel destek"
  },
  "ankara-teknokent": {
    title: "Ankara Üniversitesi Teknokent",
    text: "Ankara Üniversitesi Teknoloji Geliştirme Bölgesi, Bahçelievler Mahallesi 319. Sokak No:35 Gölbaşı / Ankara lokasyonu.",
    orbit: "Gölbaşı / Ankara",
    focus: "Teknoloji geliştirme",
    academy: "Bilişim ve Ar-Ge"
  },
  "kahramankazan": {
    title: "Uydu Yer Sistemleri Yedeklilik Merkezi",
    text: "Kahramankazan Uzay ve Havacılık İhtisas OSB içinde yer alan uydu yer sistemleri yedeklilik merkezi.",
    orbit: "Kahramankazan / Ankara",
    focus: "Coğrafi yedeklilik",
    academy: "Uydu yer sistemleri"
  }
};

function renderSatelliteInfo(key) {
  const data = satelliteData[key] || groundStationData[key];
  if (!satelliteInfo || !data) return;
  const isSatellite = Boolean(satelliteData[key]);

  satelliteInfo.innerHTML = `
    <span>${isSatellite ? "Seçili uydu" : "Seçili lokasyon"}</span>
    <h2>${data.title}</h2>
    <p>${data.text}</p>
    <dl>
      <div><dt>${isSatellite ? "Yörünge" : "Konum"}</dt><dd>${data.orbit}</dd></div>
      <div><dt>Odak</dt><dd>${data.focus}</dd></div>
      <div><dt>Akademi bağı</dt><dd>${data.academy}</dd></div>
    </dl>
  `;
}

satelliteDots.forEach((dot) => {
  dot.addEventListener("click", (event) => {
    event.stopPropagation();
    satelliteDots.forEach((item) => item.classList.remove("is-active"));
    dot.classList.add("is-active");
    renderSatelliteInfo(dot.dataset.satellite);
  });
});

const satelliteMapContainer = document.getElementById("satelliteMap");
const satelliteMapLoader = document.getElementById("satelliteMapLoader");

function buildArcCoordinates(from, to, curvature = 0.18, samples = 72) {
  const [x0, y0] = from;
  const [x2, y2] = to;
  const dx = x2 - x0;
  const dy = y2 - y0;
  const distance = Math.hypot(dx, dy);
  if (!distance) return [from, to];

  const mx = (x0 + x2) / 2;
  const my = (y0 + y2) / 2;
  const nx = -dy / distance;
  const ny = dx / distance;
  const cx = mx + nx * distance * curvature;
  const cy = my + ny * distance * curvature;
  const points = [];

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const inv = 1 - t;
    points.push([
      inv * inv * x0 + 2 * inv * t * cx + t * t * x2,
      inv * inv * y0 + 2 * inv * t * cy + t * t * y2
    ]);
  }

  return points;
}

async function loadGlobeStyle() {
  const response = await fetch("https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json");
  const style = await response.json();
  style.projection = { type: "globe" };
  style.sky = {
    "atmosphere-blend": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      0.72,
      4,
      0.18
    ]
  };
  return style;
}

if (satelliteMapContainer && window.maplibregl) {
  const ankaraHub = [32.8597, 39.9334];
  const orbitVisualHub = [31.5, 7];
  const groundStations = [
    {
      key: "golbasi-campus",
      name: "Genel Müdürlük Kampüsü",
      lng: 32.798,
      lat: 39.664,
      type: "Ana kampüs"
    },
    {
      key: "ovecler",
      name: "Öveçler Hizmet Binası",
      lng: 32.817,
      lat: 39.879,
      type: "Hizmet binası"
    },
    {
      key: "macunkoy",
      name: "Macunköy Yerleşkesi",
      lng: 32.739,
      lat: 39.973,
      type: "Yerleşke"
    },
    {
      key: "ankara-teknokent",
      name: "Ankara Üniversitesi Teknokent",
      lng: 32.772,
      lat: 39.787,
      type: "Teknoloji geliştirme"
    },
    {
      key: "kahramankazan",
      name: "Kahramankazan Yedeklilik Merkezi",
      lng: 32.676,
      lat: 40.173,
      type: "Coğrafi yedeklilik"
    }
  ];
  const satellitePoints = [
    { key: "6A", name: "Türksat 6A", lng: 42, lat: 0, slot: "42°E", stack: -42 },
    { key: "5B", name: "Türksat 5B", lng: 42, lat: 0, slot: "42°E", stack: -18 },
    { key: "4A", name: "Türksat 4A", lng: 42, lat: 0, slot: "42°E", stack: 6 },
    { key: "3A", name: "Türksat 3A", lng: 42, lat: 0, slot: "42°E", stack: 30 },
    { key: "5A", name: "Türksat 5A", lng: 31, lat: 0, slot: "31°E", stack: 0 },
    { key: "4B", name: "Türksat 4B", lng: 50, lat: 0, slot: "50°E", stack: 0 }
  ];

  loadGlobeStyle()
    .then((style) => {
      const map = new maplibregl.Map({
        container: satelliteMapContainer,
        style,
        center: [25, 24],
        zoom: 1.72,
        pitch: 0,
        bearing: -10,
        renderWorldCopies: false,
        attributionControl: false,
        interactive: true
      });
      const orbitOverlay = document.createElement("div");
      orbitOverlay.className = "satellite-orbit-overlay";
      satelliteMapContainer.parentElement?.appendChild(orbitOverlay);
      const orbitMarkerElements = [];

      map.on("load", () => {
        try {
          map.setProjection({ type: "globe" });
        } catch {
          // MapLibre projection is already provided through the style object.
        }

    satelliteMapLoader?.classList.add("is-hidden");

        satellitePoints.forEach((satellite) => {
          const markerElement = document.createElement("button");
          markerElement.type = "button";
          markerElement.className = `satellite-orbit-marker${satellite.key === "6A" ? " is-active" : ""}`;
          markerElement.setAttribute("aria-label", `${satellite.name} bilgisi`);
          markerElement.dataset.satellite = satellite.key;
          markerElement.innerHTML = `<span class="satellite-map-label">${satellite.name} · ${satellite.slot}</span>`;
          markerElement.addEventListener("click", (event) => {
            event.stopPropagation();
            document.querySelectorAll(".satellite-orbit-marker").forEach((item) => item.classList.remove("is-active"));
            document.querySelectorAll(".ground-station-marker").forEach((item) => item.classList.remove("is-active"));
            markerElement.classList.add("is-active");
            renderSatelliteInfo(satellite.key);
          });
          orbitOverlay.appendChild(markerElement);
          orbitMarkerElements.push({ satellite, markerElement });
        });

        groundStations.forEach((station) => {
          const stationElement = document.createElement("button");
          stationElement.type = "button";
          stationElement.className = "ground-station-marker";
          stationElement.setAttribute("aria-label", `${station.name} bilgisi`);
          stationElement.innerHTML = `<span class="satellite-map-label">${station.name}</span>`;
          stationElement.addEventListener("click", (event) => {
            event.stopPropagation();
            document.querySelectorAll(".satellite-orbit-marker").forEach((item) => item.classList.remove("is-active"));
            document.querySelectorAll(".ground-station-marker").forEach((item) => item.classList.remove("is-active"));
            stationElement.classList.add("is-active");
            renderSatelliteInfo(station.key);
          });

          new maplibregl.Marker({
            element: stationElement,
            anchor: "center"
          })
            .setLngLat([station.lng, station.lat])
            .setPopup(new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(`<strong>${station.name}</strong><br>${station.type}`))
            .addTo(map);
        });

        const updateOrbitMarkers = () => {
          const bounds = satelliteMapContainer.getBoundingClientRect();
          const center = {
            x: bounds.width / 2,
            y: bounds.height / 2
          };
          orbitMarkerElements.forEach(({ satellite, markerElement }) => {
            const projected = map.project([satellite.lng, satellite.lat]);
            const dx = projected.x - center.x;
            const dy = projected.y - center.y;
            const distance = Math.max(Math.hypot(dx, dy), 1);
            const altitude = 118;
            const x = projected.x + (dx / distance) * altitude;
            const y = projected.y + (dy / distance) * altitude + satellite.stack;
            markerElement.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            markerElement.style.opacity = Number.isFinite(x) && Number.isFinite(y) ? "1" : "0";
          });
        };

        map.on("move", updateOrbitMarkers);
        map.on("zoom", updateOrbitMarkers);
        map.on("rotate", updateOrbitMarkers);
        window.addEventListener("resize", updateOrbitMarkers);
        updateOrbitMarkers();
      });
    })
    .catch((error) => {
      satelliteMapLoader?.classList.add("is-hidden");
      console.error("MapLibre globe style could not be loaded.", error);
    });
}

const shaderContainer = document.getElementById("heroAurora");

if (shaderContainer) {
  import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js")
    .then((THREE) => {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.className = "shader-canvas";
      shaderContainer.appendChild(renderer.domElement);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float iTime;
          uniform vec2 iResolution;

          #define NUM_OCTAVES 3

          float rand(vec2 n) {
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);

            float res = mix(
              mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
              mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
            return res * res;
          }

          float fbm(vec2 x) {
            float v = 0.0;
            float a = 0.3;
            vec2 shift = vec2(100);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
            for (int i = 0; i < NUM_OCTAVES; ++i) {
              v += a * noise(x);
              x = rot * x * 2.0 + shift;
              a *= 0.4;
            }
            return v;
          }

          void main() {
            vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
            vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
            vec2 v;
            vec4 o = vec4(0.0);

            float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

            for (float i = 0.0; i < 35.0; i++) {
              v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
              float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
              vec4 auroraColors = vec4(
                0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
                0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
                0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
                1.0
              );
              vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
              float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
              o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
            }

            o = tanh(pow(o / 100.0, vec4(1.6)));
            gl_FragColor = o * 1.5;
          }
        `
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let frameId = 0;
      const animate = () => {
        material.uniforms.iTime.value += 0.016;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };

      const handleResize = () => {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);
      animate();

      window.addEventListener("beforeunload", () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", handleResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      });
    })
    .catch((error) => {
      console.error("Three.js shader background could not be loaded.", error);
    });
}
