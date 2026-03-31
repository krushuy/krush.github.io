/* ============================================================
   KRUSH PATCH — agregar este <script> justo antes de </body>
   en index.html. Aplica TODOS los cambios automáticamente.
   ============================================================ */
(function(){
'use strict';

const IMG_URL = 'https://krushuy.github.io/krush.github.io/krush.png';

/* ── 1. CAMBIAR TÍTULO Y TEXTOS "Russian Fishing / pesca" ─────────────── */
document.title = 'Krush.UY – Tu red social para conocer y estar en contacto con tus amigos';

// Meta description
var metaDesc = document.querySelector('meta[name="description"]');
if(metaDesc) metaDesc.setAttribute('content','Krush es tu red social para conocer y estar en contacto con tus amigos. Compartí momentos, chateá y conectá con personas reales. Krush.UY');

// Todos los textos del DOM que mencionan pesca/RF4
function reemplazarTextos(root){
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  var node;
  var replacements = [
    [/red social de pesca/gi, 'tu red social para conocer y estar en contacto con tus amigos'],
    [/Red social para los amantes de Russian Fishing/gi, 'Tu red social para conocer y estar en contacto con tus amigos'],
    [/Russian Fishing 4/gi, 'Krush'],
    [/comunidad RF4/gi, 'comunidad Krush'],
    [/amantes de la pesca/gi, 'tus amigos'],
    [/jugadores de RF4/gi, 'usuarios de Krush'],
    [/RF4 Latam/gi, 'Krush'],
  ];
  while((node = walker.nextNode())){
    var t = node.nodeValue;
    replacements.forEach(function(r){ t = t.replace(r[0], r[1]); });
    if(t !== node.nodeValue) node.nodeValue = t;
  }
}

/* ── 2. IMAGEN KRUSH EN SPLASH / LOGIN ────────────────────────────────── */
function addImgToSplash(){
  // Buscar el splash/login modal
  var splash = document.getElementById('authModal') ||
               document.getElementById('loginModal') ||
               document.getElementById('splashScreen') ||
               document.querySelector('.auth-modal') ||
               document.querySelector('.splash-screen') ||
               document.querySelector('[id*="splash"]') ||
               document.querySelector('[id*="auth"]');

  if(splash && !splash.querySelector('.krush-banner-img')){
    var img = document.createElement('img');
    img.src = IMG_URL;
    img.className = 'krush-banner-img';
    img.alt = 'Krush';
    img.style.cssText = 'width:100%;max-width:340px;display:block;margin:0 auto 16px;border-radius:16px;';
    splash.insertBefore(img, splash.firstChild);
  }
}

/* ── 3. IMAGEN KRUSH EN EL FEED (INICIO) — DOS LADOS ─────────────────── */
function addImgToFeed(){
  var feed = document.getElementById('feedSection') ||
             document.getElementById('homeFeed') ||
             document.getElementById('mainFeed') ||
             document.querySelector('.feed-container') ||
             document.querySelector('[id*="feed"]');

  if(!feed) return;
  if(feed.querySelector('.krush-feed-banner')) return;

  // Banner superior del feed
  var banner = document.createElement('div');
  banner.className = 'krush-feed-banner';
  banner.style.cssText = [
    'display:flex','justify-content:space-between','align-items:center',
    'gap:12px','padding:12px 0 8px','margin-bottom:8px'
  ].join(';');

  var makeImg = function(){
    var i = document.createElement('img');
    i.src = IMG_URL;
    i.alt = 'Krush';
    i.style.cssText = 'width:140px;height:auto;border-radius:14px;flex-shrink:0;';
    return i;
  };

  var center = document.createElement('div');
  center.style.cssText = 'flex:1;text-align:center;font-family:Orbitron,monospace;font-size:.8rem;color:#2ec4b6;font-weight:700;letter-spacing:1px;';
  center.textContent = 'Tu red social para conocer y estar en contacto con tus amigos';

  banner.appendChild(makeImg());
  banner.appendChild(center);
  banner.appendChild(makeImg());
  feed.insertBefore(banner, feed.firstChild);
}

/* ── 4. IMAGEN EN FOOTER / REGLAS ────────────────────────────────────── */
function addImgToFooter(){
  var footer = document.getElementById('footerSection') ||
               document.querySelector('footer') ||
               document.querySelector('.footer') ||
               document.querySelector('[id*="footer"]') ||
               document.querySelector('[id*="rules"]') ||
               document.querySelector('[id*="reglas"]');
  if(!footer) return;
  if(footer.querySelector('.krush-footer-img')) return;
  var wrap = document.createElement('div');
  wrap.style.cssText = 'text-align:center;padding:16px 0 8px;';
  var img = document.createElement('img');
  img.src = IMG_URL;
  img.alt = 'Krush';
  img.className = 'krush-footer-img';
  img.style.cssText = 'max-width:220px;border-radius:14px;opacity:.9;';
  wrap.appendChild(img);
  footer.insertBefore(wrap, footer.firstChild);
}

/* ── 5. NOTIFICACIONES SEPARADAS: CHAT VS NOTIFICACIONES ─────────────── */
function patchNotifications(){
  // Separar el badge/botón de chat del de notificaciones
  var notifBtn = document.getElementById('notifBtn') ||
                 document.querySelector('[id*="notif"]') ||
                 document.querySelector('.notif-btn');
  var chatBtn  = document.getElementById('chatBtn') ||
                 document.querySelector('[id*="chat"]') ||
                 document.querySelector('.chat-btn');

  // Si existen, aseguramos que sean visualmente distintos
  if(notifBtn){
    notifBtn.setAttribute('title','Notificaciones');
    notifBtn.style.position = 'relative';
  }
  if(chatBtn){
    chatBtn.setAttribute('title','Chat / Mensajes');
    chatBtn.style.position = 'relative';
  }

  // Listener Firestore para notificaciones en tiempo real (si Firebase está cargado)
  function setupRealtimeNotifs(){
    if(!window.db || !window.CU) return;
    var { collection, query, where, onSnapshot, orderBy, limit } = window._firestore || {};
    if(!onSnapshot) return;

    // Notificaciones generales
    try{
      var notifQ = query(
        collection(window.db, 'notifications'),
        where('toUid','==', window.CU.uid),
        where('read','==', false),
        orderBy('createdAt','desc'),
        limit(50)
      );
      onSnapshot(notifQ, function(snap){
        var count = snap.size;
        var badge = document.getElementById('notifBadge') ||
                    (notifBtn && notifBtn.querySelector('.badge'));
        if(badge){ badge.textContent = count > 0 ? (count > 99 ? '99+' : count) : ''; }
      });
    }catch(e){}

    // Mensajes de chat no leídos por separado
    try{
      var chatQ = query(
        collection(window.db, 'chats'),
        where('participants','array-contains', window.CU.uid),
        where('unread_' + window.CU.uid, '>', 0),
        limit(50)
      );
      onSnapshot(chatQ, function(snap){
        var count = snap.size;
        var badge = document.getElementById('chatBadge') ||
                    (chatBtn && chatBtn.querySelector('.badge'));
        if(badge){ badge.textContent = count > 0 ? (count > 99 ? '99+' : count) : ''; }
      });
    }catch(e){}
  }

  // Esperar a que Firebase esté listo
  var ntry = 0;
  var ni = setInterval(function(){
    ntry++;
    if(window.db && window.CU){ clearInterval(ni); setupRealtimeNotifs(); }
    if(ntry > 60) clearInterval(ni);
  }, 1000);
}

/* ── 6. MATCH — MOSTRAR TODOS LOS USUARIOS ───────────────────────────── */
function patchMatch(){
  // Sobrescribir la función de carga de matches para traer TODOS los usuarios
  function waitForMatch(){
    if(typeof window.loadMatches === 'function'){
      var origLoad = window.loadMatches;
      window.loadMatches = async function(){
        // Intentar cargar desde Firestore directamente
        try{
          if(window.db && window.CU){
            var { collection, getDocs, query, limit: lim, orderBy } = window._firestore || {};
            if(getDocs){
              var snap = await getDocs(query(
                collection(window.db,'users'),
                orderBy('displayName'),
                lim(200)
              ));
              window._allUsers = [];
              snap.forEach(function(doc){
                var d = doc.data();
                if(d.uid !== window.CU.uid) window._allUsers.push({id:doc.id,...d});
              });
              // Renderizar si hay función
              if(typeof window.renderMatches === 'function') window.renderMatches(window._allUsers);
              return;
            }
          }
        }catch(e){}
        return origLoad.apply(this, arguments);
      };
    } else {
      setTimeout(waitForMatch, 800);
    }
  }
  waitForMatch();
}

/* ── 7. EDITAR PERFIL — ARREGLAR ────────────────────────────────────── */
function patchEditProfile(){
  function waitForEdit(){
    // Buscar el botón de editar perfil
    var editBtn = document.getElementById('editProfileBtn') ||
                  document.querySelector('[onclick*="editProfile"]') ||
                  document.querySelector('[id*="editProfile"]') ||
                  document.querySelector('.edit-profile-btn');

    if(editBtn){
      // Remover handler viejo y agregar uno nuevo
      var newBtn = editBtn.cloneNode(true);
      editBtn.parentNode.replaceChild(newBtn, editBtn);
      newBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        openEditProfileModal();
      });
    } else {
      setTimeout(waitForEdit, 1000);
    }
  }

  function openEditProfileModal(){
    // Si ya existe el modal de edición, mostrarlo
    var modal = document.getElementById('editProfileModal') ||
                document.getElementById('profileEditModal') ||
                document.querySelector('.edit-profile-modal');
    if(modal){
      modal.style.display = 'flex';
      modal.classList.add('active');
      return;
    }

    // Si no existe, crear uno básico funcional
    var overlay = document.createElement('div');
    overlay.id = 'krushEditProfileModal';
    overlay.style.cssText = [
      'position:fixed','inset:0','background:rgba(0,0,0,.7)',
      'z-index:9999','display:flex','align-items:center','justify-content:center'
    ].join(';');

    var box = document.createElement('div');
    box.style.cssText = [
      'background:#161b22','border:1px solid #30363d','border-radius:12px',
      'padding:24px','max-width:420px','width:90%','color:#e6edf3'
    ].join(';');

    var cu = window.CU || {};
    box.innerHTML = `
      <h3 style="font-family:Orbitron,monospace;color:#2ec4b6;margin-bottom:16px;">Editar Perfil</h3>
      <label style="display:block;margin-bottom:8px;font-size:.85rem;color:#8b949e;">Nombre</label>
      <input id="kep_name" type="text" value="${cu.displayName||''}"
        style="width:100%;background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:10px;color:#e6edf3;margin-bottom:12px;">
      <label style="display:block;margin-bottom:8px;font-size:.85rem;color:#8b949e;">Bio</label>
      <textarea id="kep_bio" rows="3"
        style="width:100%;background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:10px;color:#e6edf3;resize:vertical;margin-bottom:16px;">${cu.bio||''}</textarea>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button id="kep_cancel" style="padding:8px 16px;border-radius:8px;border:1px solid #30363d;background:transparent;color:#8b949e;cursor:pointer;">Cancelar</button>
        <button id="kep_save" style="padding:8px 20px;border-radius:8px;border:none;background:#2ec4b6;color:#0d1117;font-weight:700;cursor:pointer;">Guardar</button>
      </div>
      <p id="kep_msg" style="font-size:.8rem;margin-top:8px;text-align:center;"></p>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById('kep_cancel').onclick = function(){ overlay.remove(); };
    document.getElementById('kep_save').onclick = async function(){
      var msg = document.getElementById('kep_msg');
      msg.style.color = '#8b949e';
      msg.textContent = 'Guardando...';
      var name = document.getElementById('kep_name').value.trim();
      var bio  = document.getElementById('kep_bio').value.trim();
      try{
        if(window.auth && window.auth.currentUser){
          // Firebase Auth
          var { updateProfile } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js');
          await updateProfile(window.auth.currentUser, { displayName: name });
        }
        if(window.db && window.CU && window.CU.uid){
          // Firestore
          var { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js');
          await updateDoc(doc(window.db,'users', window.CU.uid), { displayName: name, bio: bio, updatedAt: new Date() });
        }
        if(window.CU){ window.CU.displayName = name; window.CU.bio = bio; }
        msg.style.color = '#3fb950';
        msg.textContent = '¡Perfil actualizado!';
        setTimeout(function(){ overlay.remove(); location.reload(); }, 1200);
      }catch(err){
        msg.style.color = '#f85149';
        msg.textContent = 'Error: ' + (err.message || 'No se pudo guardar');
      }
    };
  }

  waitForEdit();
}

/* ── EJECUTAR CUANDO EL DOM ESTÁ LISTO ──────────────────────────────── */
function runAll(){
  reemplazarTextos(document.body);
  addImgToSplash();
  addImgToFeed();
  addImgToFooter();
  patchNotifications();
  patchMatch();
  patchEditProfile();

  // Re-ejecutar tras navegación SPA (tabs, modales)
  var _lastSection = '';
  setInterval(function(){
    var active = document.querySelector('.nav-item.active, [data-section].active, .tab.active');
    var sec = active ? (active.dataset.section || active.id || '') : '';
    if(sec !== _lastSection){
      _lastSection = sec;
      reemplazarTextos(document.body);
      addImgToFeed();
      addImgToFooter();
    }
  }, 800);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', runAll);
} else {
  runAll();
}

})();
