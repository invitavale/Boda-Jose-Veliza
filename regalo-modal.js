/* ===== Modal de Regalos (módulo reutilizable) =====
   Para usarlo en otra invitación:
   1) Copiar regalo-modal.css, regalo-modal.js y regalo-fondo.jpg a la carpeta.
   2) Enlazar regalo-modal.css en el head (etiqueta link).
   3) Cargar regalo-modal.js al final del body, despues de java2.js.
   4) El botón de regalos llama a openGiftModal()  (o showGifts()).
   5) Código de vestimenta: copiar codigo-vestimenta.jpg; el botón llama a
      openDressCodeModal()  (o showDressCode()). */
(function () {
    // Plantilla de muestra: datos de ejemplo
    const REGALO = {
        mesaRegalosUrl: '',
        titulares: [
            {
                nombre: 'José Toribio Nuñez Lovera',
                cuentas: [
                    ['BHD · Cta. Corriente', '02916430038']
                ]
            },
            {
                nombre: 'Beliza Maldonado',
                cuentas: [
                    ['Banreservas · Cta. Corriente', '7200003230']
                ]
            }
        ]
    };

    function holder(h) {
        return '<div class="rg-holder"><div class="rg-holder-name">' + h.nombre + '</div>' +
            h.cuentas.map(function (c) { return row(c[0], c[1]); }).join('') +
            (h.cedula ? row('Cédula', h.cedula) : '') +
            (h.correo ? row('Correo', h.correo) : '') +
            '</div>';
    }

    const ICON_COPY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    const ICON_CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
    const ICON_BANK = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 21h18"/></svg>';
    const ICON_GIFT = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>';

    function row(label, value) {
        return '<div class="rg-row"><div class="rg-row-text"><span class="rg-label">' + label +
            '</span><span class="rg-value">' + value + '</span></div>' +
            '<button type="button" class="rg-copy" data-copy="' + value + '" aria-label="Copiar ' + label + '">' + ICON_COPY + '</button></div>';
    }

    function build() {
        if (document.getElementById('rgOverlay')) return;
        const html =
            '<div id="rgOverlay" class="rg-overlay" role="dialog" aria-modal="true" aria-label="Regalos">' +
              '<div class="rg-sheet">' +
                '<button type="button" class="rg-close" data-rg="close" aria-label="Cerrar">&times;</button>' +
                '<div class="rg-choose" id="rgChoose">' +
                  '<div class="rg-title">Regalos</div>' +
                  '<p class="rg-sub">Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros:</p>' +
                  '<button type="button" class="rg-option" data-rg="bank">' +
                    '<span class="rg-option-icon">' + ICON_BANK + '</span>' +
                    '<span class="rg-option-text"><strong>Datos bancarios</strong><span>Transferencia o depósito</span></span>' +
                    '<span class="rg-option-arrow">›</span></button>' +
                '</div>' +
                '<div class="rg-bank rg-hidden" id="rgBank">' +
                  
                  '<div class="rg-bank-card">' +
                    '<div class="rg-title">Datos Bancarios</div>' +
                    REGALO.titulares.map(holder).join('') +
                    '<p class="rg-note">¡Gracias por tu cariño!</p>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div id="rgToast" class="rg-toast">Copiado ✓</div>';
        document.body.insertAdjacentHTML('beforeend', html);

        const overlay = document.getElementById('rgOverlay');
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) return closeGiftModal();
            const btn = e.target.closest('[data-rg],[data-copy]');
            if (!btn) return;
            if (btn.dataset.copy !== undefined) return copyValue(btn);
            const a = btn.dataset.rg;
            if (a === 'close') closeGiftModal();
            else if (a === 'back') showStep('choose');
            else if (a === 'bank') showStep('bank');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeGiftModal();
        });
    }

    function showStep(step) {
        document.getElementById('rgChoose').classList.toggle('rg-hidden', step !== 'choose');
        document.getElementById('rgBank').classList.toggle('rg-hidden', step !== 'bank');
    }

    function copyValue(btn) {
        const text = btn.dataset.copy;
        const done = function () {
            btn.classList.add('copied');
            btn.innerHTML = ICON_CHECK;
            const t = document.getElementById('rgToast');
            t.classList.add('show');
            setTimeout(function () {
                btn.classList.remove('copied');
                btn.innerHTML = ICON_COPY;
                t.classList.remove('show');
            }, 1600);
        };
        const fallback = function () {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            ta.setSelectionRange(0, text.length);
            try { document.execCommand('copy'); } catch (_) {}
            document.body.removeChild(ta);
            done();
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done, fallback);
        } else {
            fallback();
        }
    }

    function openGiftModal() {
        build();
        showStep('bank');
        document.getElementById('rgOverlay').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeGiftModal() {
        const o = document.getElementById('rgOverlay');
        if (!o) return;
        o.classList.remove('open');
        document.body.style.overflow = '';
    }

    window.openGiftModal = openGiftModal;
    window.closeGiftModal = closeGiftModal;
    window.showGifts = openGiftModal; // compatibilidad con onclick="showGifts()"
    /* ----- Código de vestimenta (imagen flotante) ----- */
    const DRESS_IMG = 'codigo-vestimenta.jpg?v=5';
    const DRESS_IMG_MOVIL = 'codigo-vestimenta-movil.jpg?v=5';

    function buildDress() {
        if (document.getElementById('rgDressOverlay')) return;
        document.body.insertAdjacentHTML('beforeend',
            '<div id="rgDressOverlay" class="rg-overlay" role="dialog" aria-modal="true" aria-label="Código de vestimenta">' +
              '<div class="rg-sheet rg-dress rg-dress-text">' +
                '<button type="button" class="rg-close" aria-label="Cerrar">&times;</button>' +
                '<div class="rg-title">Código de Vestimenta</div>' +
                '<p class="dc-lead">¡Ven cómodo!</p>' +
                '<p class="rg-sub">No hay código de vestimenta. Queremos que disfrutes la noche a gusto.</p>' +
                '<p class="dc-ask">Solo te pedimos <strong>no utilizar</strong> estos colores:</p>' +
                '<div class="dc-swatches">' +
                  '<span class="dc-sw"><i style="background:#FFFFFF"></i>Blanco</span>' +
                  '<span class="dc-sw"><i style="background:#8E6BBF"></i>Morado</span>' +
                  '<span class="dc-sw"><i style="background:linear-gradient(135deg,#E9CF8A,#C8A45D)"></i>Dorado</span>' +
                '</div>' +
                '<p class="rg-note">¡Gracias por tu comprensión!</p>' +
              '</div>' +
            '</div>');
        const o = document.getElementById('rgDressOverlay');
        o.addEventListener('click', function (e) {
            if (e.target === o || e.target.closest('.rg-close')) closeDressCodeModal();
        });
    }

    function openDressCodeModal() {
        buildDress();
        document.getElementById('rgDressOverlay').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDressCodeModal() {
        const o = document.getElementById('rgDressOverlay');
        if (!o) return;
        o.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDressCodeModal();
    });

    window.openDressCodeModal = openDressCodeModal;
    window.closeDressCodeModal = closeDressCodeModal;
    window.showDressCode = openDressCodeModal; // compatibilidad con onclick="showDressCode()"
})();

/* ----- Confirmar asistencia por WhatsApp (Lucía o Héctor) ----- */
(function () {
    const CONTACTOS = [
        { nombre: 'Lucía', telefono: '18099620570' },
        { nombre: 'Héctor', telefono: '18097760290' }
    ];
    const ICON_WA = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.24 8.24 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z"/></svg>';

    function invitados() {
        const p = new URLSearchParams(window.location.search);
        const inv = p.get('invitados');
        const fam = p.get('familia');
        if (inv) return inv.split(',').map(function (n) { return n.trim(); }).filter(Boolean).join(', ');
        if (fam) return 'Familia ' + fam.trim();
        return '';
    }

    function mensaje(nombre) {
        const quien = invitados();
        return 'Hola ' + nombre + ', confirmo mi asistencia a la boda de Lucía y Héctor 💍' +
            (quien ? '\nInvitados: ' + quien : '') +
            '\nSábado 13 de febrero de 2027 · Villa Palmar';
    }

    function build() {
        if (document.getElementById('rsvpOverlay')) return;
        const opciones = CONTACTOS.map(function (c) {
            return '<a class="rg-option rsvp-option" target="_blank" rel="noopener" href="https://wa.me/' + c.telefono +
                '?text=' + encodeURIComponent(mensaje(c.nombre)) + '">' +
                '<span class="rg-option-icon rsvp-wa">' + ICON_WA + '</span>' +
                '<span class="rg-option-text"><strong>Confirmar con ' + c.nombre + '</strong><span>Enviar mensaje por WhatsApp</span></span>' +
                '<span class="rg-option-arrow">›</span></a>';
        }).join('');
        document.body.insertAdjacentHTML('beforeend',
            '<div id="rsvpOverlay" class="rg-overlay" role="dialog" aria-modal="true" aria-label="Confirmar asistencia">' +
              '<div class="rg-sheet">' +
                '<button type="button" class="rg-close" aria-label="Cerrar">&times;</button>' +
                '<div class="rg-choose">' +
                  '<div class="rg-title">Confirma tu asistencia</div>' +
                  '<p class="rg-sub">Elige a quién deseas enviarle tu confirmación:</p>' +
                  opciones +
                '</div>' +
              '</div>' +
            '</div>');
        const o = document.getElementById('rsvpOverlay');
        o.addEventListener('click', function (e) {
            if (e.target === o || e.target.closest('.rg-close')) closeRsvp();
            else if (e.target.closest('.rsvp-option')) setTimeout(closeRsvp, 300);
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeRsvp(); });
    }

    function openRsvp() {
        build();
        document.getElementById('rsvpOverlay').classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeRsvp() {
        const o = document.getElementById('rsvpOverlay');
        if (!o) return;
        o.classList.remove('open');
        document.body.style.overflow = '';
    }
    window.openRsvpModal = openRsvp;
    window.confirmAttendance = openRsvp;
})();
