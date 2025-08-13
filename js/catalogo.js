// Modal personalizado de confirmación de compra
const purchaseModalHtml = `
  <div id="purchaseModal" role="dialog" aria-modal="true" aria-labelledby="purchaseModalTitle" style="position:fixed;inset:0;z-index:2000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px)">
    <div class="purchase-modal-card" style="background:rgba(255,255,255,0.98);border-radius:16px;box-shadow:0 20px 60px rgba(212,175,55,0.35);max-width:520px;width:92%;overflow:hidden;border:1px solid rgba(212,175,55,0.4)">
      <div style="background:linear-gradient(135deg,#0c1f3f,#0047ab);padding:16px 20px;color:#fff;display:flex;align-items:center;gap:10px">
        <i class="fas fa-shopping-bag" aria-hidden="true"></i>
        <h3 id="purchaseModalTitle" style="margin:0;font-family:'Playfair Display',serif;font-size:1.15rem">Confirmar compra</h3>
      </div>
      <div style="padding:18px 20px;color:#1a1a1a">
        <p id="purchaseModalMessage" style="margin:0 0 12px 0;font-weight:600">¿Desea continuar con su compra?</p>
        <p id="purchaseModalProduct" style="margin:0;color:#555;font-size:.95rem"></p>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;padding:16px 20px;background:#fffaf0;border-top:1px solid #f6e7b3">
        <button type="button" id="btnStayCatalog" style="background:#fff;color:#0c1f3f;border:2px solid #0c1f3f;padding:10px 16px;border-radius:999px;font-weight:700;cursor:pointer">Seguir viendo</button>
        <button type="button" id="btnGoCart" style="background:linear-gradient(135deg,#d4af37,#f4d03f);color:#0c1f3f;border:none;padding:10px 16px;border-radius:999px;font-weight:800;box-shadow:0 8px 22px rgba(212,175,55,.35);cursor:pointer">Ir al carrito</button>
      </div>
    </div>
  </div>`;

document.body.insertAdjacentHTML('beforeend', purchaseModalHtml);

function showPurchaseModal(productName, onConfirm) {
  const modal = document.getElementById('purchaseModal');
  const productEl = document.getElementById('purchaseModalProduct');
  const btnStay = document.getElementById('btnStayCatalog');
  const btnGo = document.getElementById('btnGoCart');

  productEl.textContent = productName ? `Producto: ${productName}` : '';
  modal.style.display = 'flex';

  const close = () => { modal.style.display = 'none'; cleanup(); };
  const cleanup = () => {
    btnStay.removeEventListener('click', onStay);
    btnGo.removeEventListener('click', onGo);
    modal.removeEventListener('click', onBackdrop);
    document.removeEventListener('keydown', onEsc);
  };
  const onStay = () => close();
  const onGo = () => { close(); if (typeof onConfirm === 'function') onConfirm(); };
  const onBackdrop = (e) => { if (e.target === modal) close(); };
  const onEsc = (e) => { if (e.key === 'Escape') close(); };

  btnStay.addEventListener('click', onStay);
  btnGo.addEventListener('click', onGo);
  modal.addEventListener('click', onBackdrop);
  document.addEventListener('keydown', onEsc);
}

function addItemToLocalStorageCart(name, price, image) {
    try {
        const key = 'cart';
        const existing = localStorage.getItem(key);
        let cart = [];
        if (existing) {
            cart = JSON.parse(existing);
        }
        const found = cart.find(item => item.name === name);
        if (found) {
            found.quantity = (found.quantity || 0) + 1;
        } else {
            cart.push({ id: Date.now(), name, price, image, quantity: 1 });
        }
        localStorage.setItem(key, JSON.stringify(cart));
    } catch (e) {
        console.error("Error adding to cart:", e);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const womenTbody = document.getElementById('perfumes-femeninos-body');
    const menTbody = document.getElementById('perfumes-masculinos-body');

    fetch('../perfumes.json')
        .then(response => response.json())
        .then(data => {
            populateTable(data.femeninos, womenTbody);
            populateTable(data.masculinos, menTbody);
            initializePageScripts();
        })
        .catch(error => {
            console.error('Error loading perfumes:', error);
        });

    function populateTable(perfumes, tbody) {
        if (!tbody) return;
        let content = '';
        for (const perfume of perfumes) {
            const notesHtml = perfume.notes.map(note => `<span class="note-tag">${note}</span>`).join('');
            const categoryClass = perfume.category.toLowerCase() === 'nicho' ? 'nicho' : 'diseñador';
            content += `
                <tr>
                    <td class="brand-name">${perfume.brand}</td>
                    <td class="product-name">${perfume.product}</td>
                    <td class="text-center"><span class="category-badge ${categoryClass}">${perfume.category}</span></td>
                    <td><div class="notes-container">${notesHtml}</div></td>
                </tr>
            `;
        }
        tbody.innerHTML = content;
    }

    function initializePageScripts() {
        // ORIGINAL SCRIPT BLOCK 1
        document.querySelectorAll('.notes-container').forEach(function(container) {
            if (container.children.length === 0) {
                container.innerHTML = '<span class="note-tag" style="opacity:0.5">N/A</span>';
            }
        });
        document.querySelectorAll('.gender-icon').forEach(function(icon) {
            icon.setAttribute('aria-hidden', 'true');
        });
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
            if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        });
        try {
            document.querySelectorAll('.luxury-table table').forEach(table => {
                const theadRow = table.querySelector('thead tr');
                if (theadRow && !theadRow.querySelector('[data-col="comprar"]')) {
                    const th = document.createElement('th');
                    th.setAttribute('data-col', 'comprar');
                    th.className = 'text-center';
                    th.textContent = 'COMPRAR';
                    theadRow.appendChild(th);
                }
                table.querySelectorAll('tbody tr').forEach(row => {
                    if (row.querySelector('[data-cell="comprar"]')) return;
                    const td = document.createElement('td');
                    td.setAttribute('data-cell', 'comprar');
                    td.style.textAlign = 'center';
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.textContent = 'Comprar';
                    btn.style.cssText = `
                        background: linear-gradient(135deg, #d4af37, #f4d03f);
                        color: #0c1f3f;
                        border: none;
                        padding: 8px 14px;
                        border-radius: 999px;
                        font-weight: 800;
                        letter-spacing: .3px;
                        box-shadow: 0 6px 18px rgba(212,175,55,.25);
                        cursor: pointer;
                        transition: transform .15s ease, box-shadow .15s ease;
                    `;
                    btn.addEventListener('mouseenter', () => btn.style.boxShadow = '0 10px 28px rgba(212,175,55,.35)');
                    btn.addEventListener('mouseleave', () => btn.style.boxShadow = '0 6px 18px rgba(212,175,55,.25)');
                    btn.addEventListener('click', () => {
                        const brand = row.querySelector('.brand-name')?.textContent.trim() || '';
                        const product = row.querySelector('.product-name')?.textContent.trim() || '';
                        const name = `${brand} ${product}`.trim();
                        const price = 20000;
                        const image = '../logo_eco_header.png';
                        addItemToLocalStorageCart(name, price, image);
                        showPurchaseModal(name, () => { window.location.href = '../index.html?openCart=1'; });
                    });
                    td.appendChild(btn);
                    row.appendChild(td);
                });
            });
        } catch (e) {}

        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        const originalRows = {};
        document.querySelectorAll('.luxury-table tbody').forEach((tbody, idx) => {
            originalRows[idx] = Array.from(tbody.children);
        });

        function rowMatchesQuery(row, query) {
            if (!query) return false;
            const brand = row.querySelector('.brand-name')?.textContent.toLowerCase() || '';
            const product = row.querySelector('.product-name')?.textContent.toLowerCase() || '';
            const category = row.querySelector('.category-badge')?.textContent.toLowerCase() || '';
            const notes = Array.from(row.querySelectorAll('.notes-container .note-tag')).map(n => n.textContent.toLowerCase()).join(' ');
            return brand.includes(query) || product.includes(query) || category.includes(query) || notes.includes(query);
        }

        function applySearch(query) {
            const normalized = (query || '').trim().toLowerCase();
            let anyFound = false;
            document.querySelectorAll('.luxury-table tbody').forEach((tbody) => {
                const rows = Array.from(tbody.children);
                const matches = [];
                const nonMatches = [];
                rows.forEach((row) => {
                    const isMatch = normalized && rowMatchesQuery(row, normalized);
                    if (isMatch) {
                        row.style.background = 'rgba(212, 175, 55, 0.25)';
                        row.style.boxShadow = '0 0 16px 0 #d4af37cc';
                        matches.push(row);
                        anyFound = true;
                    } else {
                        row.style.background = '';
                        row.style.boxShadow = '';
                        nonMatches.push(row);
                    }
                });
                matches.concat(nonMatches).forEach((row) => tbody.appendChild(row));
                if (matches.length > 0) {
                    matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            if (!anyFound && normalized) {
                alert('No se hallaron resultados');
            }
            return anyFound;
        }

        searchForm.addEventListener('submit', function(e) { e.preventDefault(); applySearch(searchInput.value); });
        searchInput.addEventListener('input', function() {
            if (!this.value.trim()) {
                document.querySelectorAll('.luxury-table tbody').forEach((tbody, idx) => {
                    if(originalRows[idx]) {
                        originalRows[idx].forEach(row => tbody.appendChild(row));
                        Array.from(tbody.children).forEach(row => {
                            row.style.background = '';
                            row.style.boxShadow = '';
                        });
                    }
                });
            }
        });

        const autocompleteList = document.createElement('ul');
        autocompleteList.id = 'autocompleteList';
        Object.assign(autocompleteList.style, { position: 'absolute', top: '100%', right: '0', left: '0', zIndex: '100', background: 'rgba(255,255,255,0.98)', border: '1px solid #d4af37', borderTop: 'none', maxHeight: '220px', overflowY: 'auto', listStyle: 'none', margin: '0', padding: '0', boxShadow: '0 8px 24px 0 #d4af3722', fontWeight: '600', color: '#b8860b', display: 'none' });
        searchForm.style.position = 'relative';
        searchForm.appendChild(autocompleteList);

        function normalizeStr(str) { return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

        function getAllPerfumes() {
            const perfumes = [];
            document.querySelectorAll('.luxury-table tbody tr').forEach(function(row) {
                perfumes.push({ brand: row.querySelector('.brand-name')?.textContent.trim() || '', product: row.querySelector('.product-name')?.textContent.trim() || '', category: row.querySelector('.category-badge')?.textContent.trim() || '', notes: Array.from(row.querySelectorAll('.notes-container .note-tag')).map(n => n.textContent.trim()), row });
            });
            return perfumes;
        }

        searchInput.addEventListener('input', function() {
            const rawValue = this.value.trim();
            const value = normalizeStr(rawValue);
            if (!value) { autocompleteList.style.display = 'none'; return; }
            const perfumes = getAllPerfumes();
            const matches = perfumes.filter(p => {
                const b = normalizeStr(p.brand);
                const pr = normalizeStr(p.product);
                const c = normalizeStr(p.category);
                const ns = p.notes.map(normalizeStr);
                return b.startsWith(value) || pr.startsWith(value) || c.startsWith(value) || ns.some(n => n.startsWith(value));
            }).slice(0, 30);
            autocompleteList.innerHTML = '';
            if (matches.length > 0) {
                matches.forEach(match => {
                    const li = document.createElement('li');
                    const notesPreview = (match.notes && match.notes.length) ? ` • Notas: ${match.notes.slice(0,3).join(', ')}` : '';
                    const catPreview = match.category ? ` • Cat: ${match.category}` : '';
                    li.textContent = `${match.brand} - ${match.product}${catPreview}${notesPreview}`;
                    Object.assign(li.style, { padding: '8px 16px', cursor: 'pointer', borderBottom: '1px solid #f3e5ab' });
                    li.addEventListener('mouseenter', () => li.style.background = '#fffbe6');
                    li.addEventListener('mouseleave', () => li.style.background = '');
                    li.addEventListener('click', function() {
                        searchInput.value = rawValue;
                        autocompleteList.style.display = 'none';
                        applySearch(searchInput.value);
                    });
                    autocompleteList.appendChild(li);
                });
                autocompleteList.style.display = 'block';
            } else {
                autocompleteList.style.display = 'none';
            }
        });
        searchInput.addEventListener('blur', () => setTimeout(() => autocompleteList.style.display = 'none', 200));

        // ORIGINAL SCRIPT BLOCK 2 (JSON-LD)
        (function(){
          try {
            const rows = Array.from(document.querySelectorAll('.luxury-table tbody tr'));
            const products = [];
            for (let i = 0; i < rows.length && products.length < 100; i++) {
              const row = rows[i];
              const brand = row.querySelector('.brand-name')?.textContent.trim();
              const product = row.querySelector('.product-name')?.textContent.trim();
              if (brand && product) { products.push({ brand, product }); }
            }
            if (products.length > 0) {
              const itemList = { "@context": "https://schema.org", "@type": "ItemList", "itemListElement": products.map(p => ({ "@type": "Product", "name": p.product, "brand": p.brand })) };
              const script = document.createElement('script');
              script.type = 'application/ld+json';
              script.textContent = JSON.stringify(itemList);
              document.head.appendChild(script);
            }
          } catch (e) { /* silencioso */ }
        })();

        // ORIGINAL SCRIPT BLOCK 3 (Card View)
        (function(){
          try {
            const tables = Array.from(document.querySelectorAll('table'));
            if (!tables.length) return;

            const controls = document.createElement('div');
            controls.className = 'catalog-controls';
            const btnTable = document.createElement('button');
            btnTable.className = 'btn-toggle active';
            btnTable.type = 'button';
            btnTable.textContent = 'Vista: Tabla';
            const btnCards = document.createElement('button');
            btnCards.className = 'btn-toggle';
            btnCards.type = 'button';
            btnCards.textContent = 'Vista: Tarjetas';
            controls.appendChild(btnTable);
            controls.appendChild(btnCards);

            const grid = document.createElement('div');
            grid.id = 'catalogGrid';
            grid.className = 'catalog-grid';
            grid.style.display = 'none';

            const firstTable = tables[0];
            firstTable.parentElement.insertBefore(controls, firstTable);
            controls.insertAdjacentElement('afterend', grid);

            const getText = (el) => (el && el.textContent ? el.textContent.trim() : '');

            const rows = [];
            tables.forEach(t => {
              const tbodies = Array.from(t.tBodies || []);
              tbodies.forEach(tb => rows.push(...Array.from(tb.rows)));
            });

            rows.forEach(row => {
              const cells = Array.from(row.cells || []);
              if (!cells.length) return;
              const brandEl = row.querySelector('.brand-name') || cells[0];
              const productEl = row.querySelector('.product-name') || cells[1];
              const categoryEl = row.querySelector('.category-badge') || cells[2];
              const notesEl = row.querySelector('.notes-container') || cells[3];

              const brand = getText(brandEl);
              const product = getText(productEl);
              const category = getText(categoryEl);
              const notes = getText(notesEl);
              if (!brand && !product) return;

              const card = document.createElement('article');
              card.className = 'product-card';

              const header = document.createElement('div');
              header.className = 'card-header';
              const brandSpan = document.createElement('span');
              brandSpan.className = 'brand';
              brandSpan.textContent = brand;
              const badge = document.createElement('span');
              badge.className = 'card-badge';
              badge.textContent = category || 'Fragancia';
              header.appendChild(brandSpan);
              header.appendChild(badge);

              const body = document.createElement('div');
              body.className = 'card-body';
              const title = document.createElement('h3');
              title.className = 'title';
              title.textContent = product;
              const notesP = document.createElement('p');
              notesP.className = 'notes';
              notesP.textContent = notes;

              const actions = document.createElement('div');
              actions.className = 'card-actions';
              const btnView = document.createElement('button');
              btnView.className = 'btn';
              btnView.type = 'button';
              btnView.textContent = 'Ver en tabla';
              btnView.addEventListener('click', () => {
                try {
                  row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  const oldBg = row.style.background;
                  row.style.background = 'rgba(212,175,55,0.25)';
                  setTimeout(() => row.style.background = oldBg, 1200);
                  if (grid.style.display !== 'none') switchToTable();
                } catch (e) {}
              });
              const btnWa = document.createElement('a');
              btnWa.className = 'btn whatsapp';
              btnWa.target = '_blank';
              const msg = encodeURIComponent(`Hola, me interesa la fragancia ${product} de ${brand}. ¿Me brindas más detalles?`);
              btnWa.href = `https://wa.me/573176339319?text=${msg}`;
              btnWa.innerHTML = '<i class="fab fa-whatsapp"></i> Consultar';

              actions.appendChild(btnView);
              actions.appendChild(btnWa);

              body.appendChild(title);
              if (notes && notes !== 'N/A') body.appendChild(notesP);
              body.appendChild(actions);

              card.appendChild(header);
              card.appendChild(body);
              grid.appendChild(card);
            });

            function switchToCards(){
              btnTable.classList.remove('active');
              btnCards.classList.add('active');
              grid.style.display = 'grid';
              tables.forEach(t => t.parentElement.style.display = 'none');
            }
            function switchToTable(){
              btnCards.classList.remove('active');
              btnTable.classList.add('active');
              grid.style.display = 'none';
              tables.forEach(t => t.parentElement.style.display = '');
            }

            btnCards.addEventListener('click', switchToCards);
            btnTable.addEventListener('click', switchToTable);
          } catch (e) { console.error("Error setting up card view:", e); }
        })();
    }
});