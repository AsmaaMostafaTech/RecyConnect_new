/**
 * RecyConnect - Professional Recycling Marketplace
 * Main Application JavaScript
 */

// ==================== GLOBAL VARIABLES ====================
let currentUser = null;
let currentListing = null;
let currentChat = null;
let map = null;
let markers = [];
let currentCategory = '';
let selectedCategory = '';
let currentStep = 1;
let modalMap = null;
let modalMarker = null;

// ==================== DATABASE ====================
const DB = {
    get: function(k) { 
        try { return JSON.parse(localStorage.getItem('rc_' + k)); } catch(e) { return null; } 
    },
    set: function(k, v) { localStorage.setItem('rc_' + k, JSON.stringify(v)); }
};

// ==================== INITIALIZATION ====================
window.onload = function() {
    setTimeout(function() {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(function() { splash.style.display = 'none'; }, 500);
        }
    }, 1000);
};

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initDB();
    checkAuth();
    
    // Intersection Observer for reveal animations
    const obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) { 
            if(entry.isIntersecting) entry.target.classList.add('active'); 
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
    
    // Initialize live users counter
    setInterval(updateLiveUsers, 3000);
});

// ==================== LIVE USERS ====================
function updateLiveUsers() {
    const el = document.getElementById('liveUsers');
    if(el) el.textContent = 100 + Math.floor(Math.random() * 50);
}

// ==================== DATABASE INITIALIZATION ====================
function initDB() {
    if(!DB.get('init')) {
        DB.set('listings', [
            { 
                id: 1, 
                title: 'HDPE Plastic Scrap', 
                category: 'Plastic', 
                quantity: 500, 
                price: 250, 
                location: 'Dubai', 
                lat: 25.20, 
                lng: 55.27, 
                description: 'Clean industrial plastic.', 
                sellerId: 'u1', 
                sellerName: 'Ahmed', 
                createdAt: Date.now(), 
                views: 12 
            },
            { 
                id: 2, 
                title: 'Copper Wire', 
                category: 'Metal', 
                quantity: 120, 
                price: 1200, 
                location: 'Abu Dhabi', 
                lat: 24.45, 
                lng: 54.37, 
                description: 'High purity copper.', 
                sellerId: 'u2', 
                sellerName: 'Sara', 
                createdAt: Date.now()-80000, 
                views: 45 
            }
        ]);
        
        DB.set('users', [
            { id: 'u1', firstName: 'Ahmed', email: 'ahmed@demo.com', password: 'demo123' },
            { id: 'u2', firstName: 'Sara', email: 'sara@demo.com', password: 'demo123' }
        ]);
        
        DB.set('chats', []);
        DB.set('messages', []);
        DB.set('init', true);
    }
}

// ==================== AUTHENTICATION ====================
function checkAuth() { 
    currentUser = DB.get('currentUser'); 
    updateUI(); 
}

function updateUI() {
    const auth = document.getElementById('authBtns');
    const user = document.getElementById('userMenu');
    
    if(currentUser) {
        auth.classList.add('hidden');
        user.classList.remove('hidden');
        document.getElementById('userAvatarNav').textContent = currentUser.firstName[0];
        document.getElementById('userNameNav').textContent = currentUser.firstName;
    } else {
        auth.classList.remove('hidden');
        user.classList.add('hidden');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const pass = e.target.password.value;
    const users = DB.get('users') || [];
    const found = users.find(function(u) { return u.email === email && u.password === pass; });
    
    if(found) {
        currentUser = found;
        DB.set('currentUser', found);
        updateUI();
        showPage('marketplace');
        showToast('Welcome back!');
    } else {
        showToast('Invalid credentials');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const pass = e.target.password.value;
    const users = DB.get('users') || [];
    
    if(users.find(function(u) { return u.email === email; })) {
        showToast('Email exists');
        return;
    }
    
    const newUser = { 
        id: 'u_'+Date.now(), 
        firstName: email.split('@')[0], 
        email: email, 
        password: pass 
    };
    
    users.push(newUser);
    DB.set('users', users);
    currentUser = newUser;
    DB.set('currentUser', newUser);
    updateUI();
    showPage('marketplace');
    showToast('Account created');
}

function logout() {
    localStorage.removeItem('rc_currentUser');
    currentUser = null;
    updateUI();
    showPage('landing');
    showToast('Logged out');
}

// ==================== THEME MANAGEMENT ====================
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    showToast(next === 'light' ? 'Light mode' : 'Dark mode');
}

function loadTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
}

// ==================== NOTIFICATIONS ====================
function toggleNotifications() {
    const dropdown = document.getElementById('notifDropdown');
    if(dropdown) dropdown.classList.toggle('active');
}

function addNotification(message) {
    // This would typically update a notifications array
    console.log('Notification:', message);
}

// ==================== NAVIGATION ====================
function showPage(id) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(function(p) { 
        p.classList.remove('active'); 
    });
    
    // Show selected page
    const pageElement = document.getElementById('page-' + id);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(function(n) { 
        n.classList.remove('active'); 
    });
    
    const navElement = document.getElementById('nav-' + id);
    if (navElement) {
        navElement.classList.add('active');
    }
    
    window.scrollTo(0, 0);
    
    // Page-specific initialization
    if(id === 'marketplace') renderMarketplace();
    if(id === 'map') setTimeout(initMap, 100);
    if(id === 'chat') renderChat();
    if(id === 'profile') renderProfile();
    if(id === 'landing') renderTrending();
}

function toggleMobileSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('mobileOverlay').classList.toggle('hidden');
}

function toggleLang() {
    const lang = document.documentElement.getAttribute('lang') === 'ar' ? 'en' : 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    const langLabel = document.getElementById('langLabel');
    if (langLabel) {
        langLabel.textContent = lang.toUpperCase();
    }
}

// ==================== MARKETPLACE ====================
function renderMarketplace() {
    const grid = document.getElementById('listingGrid');
    if (grid) {
        grid.innerHTML = '<div class="glass-card h-40 animate-pulse"></div><div class="glass-card h-40 animate-pulse"></div>';
        setTimeout(function() { 
            renderGrid(DB.get('listings') || []); 
        }, 200);
    }
}

function setCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-pill').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    filterListings();
}

function filterListings() {
    let listings = DB.get('listings') || [];
    const searchInput = document.getElementById('searchInput');
    
    if(searchInput) {
        const search = searchInput.value.toLowerCase();
        if(search) {
            listings = listings.filter(function(l) { 
                return l.title.toLowerCase().indexOf(search) > -1; 
            });
        }
    }
    
    if(currentCategory) {
        listings = listings.filter(function(l) { 
            return l.category === currentCategory; 
        });
    }
    
    renderGrid(listings);
}

function renderGrid(listings) {
    const grid = document.getElementById('listingGrid');
    const empty = document.getElementById('emptyState');
    
    if(!grid) return;
    
    if(listings.length === 0) { 
        grid.innerHTML = ''; 
        if (empty) empty.classList.remove('hidden'); 
        return; 
    }
    
    if (empty) empty.classList.add('hidden');
    
    grid.innerHTML = listings.map(function(l) {
        return '<div class="glass-card overflow-hidden cursor-pointer" onclick="viewListing(' + l.id + ')">' +
            '<div class="h-24 relative p-3" style="background: var(--bg-tertiary);">' +
            '<span class="px-2 py-1 rounded bg-brand-500/20 text-brand-400 text-[10px] font-bold">' + l.category + '</span></div>' +
            '<div class="p-4"><h3 class="font-bold text-sm truncate" style="color: var(--text-primary);">' + l.title + '</h3>' +
            '<p class="text-[10px]" style="color: var(--text-muted);">' + l.quantity + ' kg</p>' +
            '<div class="flex justify-between mt-2">' +
            '<span class="font-bold text-brand-400">$' + l.price + '</span>' +
            '<span class="text-[9px]" style="color: var(--text-muted);">' + l.location + '</span></div></div></div>';
    }).join('');
}

function viewListing(id) {
    const listings = DB.get('listings') || [];
    const listing = listings.find(function(x) { return x.id === id; });
    
    if(!listing) return;
    
    currentListing = listing;
    listing.views++;
    DB.set('listings', listings);
    
    // Update detail page elements
    const elements = {
        detailTitle: listing.title,
        detailPrice: '$' + listing.price,
        detailQuantity: 'per ' + listing.quantity + ' kg',
        detailLocation: listing.location,
        detailDescription: listing.description,
        detailCategoryBadge: listing.category,
        detailSellerName: listing.sellerName,
        detailSellerAvatar: listing.sellerName[0]
    };
    
    Object.keys(elements).forEach(function(key) {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = elements[key];
        }
    });
    
    const isOwner = currentUser && currentUser.id === listing.sellerId;
    const buyerActions = document.getElementById('buyerActions');
    const ownerActions = document.getElementById('ownerActions');
    
    if (buyerActions) buyerActions.classList.toggle('hidden', isOwner);
    if (ownerActions) ownerActions.classList.toggle('hidden', !isOwner);
    
    showPage('listing');
}

function deleteListing() {
    if(!confirm('Delete?')) return;
    
    let listings = DB.get('listings') || [];
    listings = listings.filter(function(x) { return x.id !== currentListing.id; });
    DB.set('listings', listings);
    showPage('marketplace');
    showToast('Deleted');
}

// ==================== TRENDING ====================
function renderTrending() {
    const listings = DB.get('listings') || [];
    const grid = document.getElementById('trendingGrid');
    
    if(!grid) return;
    
    grid.innerHTML = listings.slice(0, 4).map(function(l) {
        return '<div class="glass-card p-4 cursor-pointer" onclick="viewListing(' + l.id + ')">' +
            '<span class="text-[9px] text-brand-400 font-bold uppercase">' + l.category + '</span>' +
            '<h3 class="font-bold mt-1 text-sm" style="color: var(--text-primary);">' + l.title + '</h3>' +
            '<p class="text-[10px]" style="color: var(--text-muted);">' + l.location + '</p>' +
            '<div class="mt-3 flex justify-between"><span class="font-bold" style="color: var(--text-primary);">$' + l.price + '</span></div></div>';
    }).join('') || '<p class="col-span-4 text-center" style="color: var(--text-muted);">No listings</p>';
}

// ==================== MAP ====================
function initMap() {
    if(map) map.remove();
    
    map = L.map('map', { zoomControl: true }).setView([25.0, 55.0], 6);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '' }).addTo(map);
    addMarkers();
}

function addMarkers(filter) {
    if(!filter) filter = '';
    
    // Clear existing markers
    markers.forEach(function(m) { 
        if (map && m) map.removeLayer(m); 
    });
    markers = [];
    
    const listings = DB.get('listings') || [];
    const filteredListings = filter ? listings.filter(function(l) { return l.category === filter; }) : listings;
    
    filteredListings.forEach(function(l) {
        if(!l.lat || !map) return;
        
        const icon = L.divIcon({
            className: '',
            html: '<div style="background:linear-gradient(135deg,#22c55e,#16a34a);width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:bold;">' + l.category[0] + '</div>',
            iconSize: [24, 24], 
            iconAnchor: [12, 12]
        });
        
        const marker = L.marker([l.lat, l.lng], { icon: icon }).addTo(map);
        marker.bindPopup('<b style="color:#22c55e;">' + l.title + '</b><br>$' + l.price);
        markers.push(marker);
    });
}

function filterMapMarkers(cat) { 
    addMarkers(cat); 
}

// ==================== CHAT ====================
function renderChat() {
    if(!currentUser) return;
    
    const chats = DB.get('chats') || [];
    const userChats = chats.filter(function(c) { 
        return c.participants.indexOf(currentUser.id) > -1; 
    });
    
    const chatList = document.getElementById('chatList');
    if (!chatList) return;
    
    chatList.innerHTML = userChats.map(function(c) {
        const otherId = c.participants.find(function(p) { return p !== currentUser.id; });
        const name = c.participantNames[otherId];
        return '<div class="p-4 hover:bg-white/5 cursor-pointer border-b flex items-center gap-3" style="border-color: var(--border-color);" onclick="openChat(\'' + c.id + '\')">' + name + '</div>';
    }).join('') || '<div class="p-6 text-center text-xs" style="color: var(--text-muted);">No conversations</div>';
}

function openChat(id) {
    const chats = DB.get('chats') || [];
    currentChat = chats.find(function(c) { return c.id === id; });
    
    if(!currentChat) return;
    
    const otherId = currentChat.participants.find(function(p) { return p !== currentUser.id; });
    const chatPartnerName = document.getElementById('chatPartnerName');
    const chatPartnerAvatar = document.getElementById('chatPartnerAvatar');
    
    if (chatPartnerName) chatPartnerName.textContent = currentChat.participantNames[otherId];
    if (chatPartnerAvatar) chatPartnerAvatar.textContent = currentChat.participantNames[otherId][0];
    
    const msgs = (DB.get('messages') || []).filter(function(m) { return m.chatId === id; });
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatMessages) {
        chatMessages.innerHTML = msgs.map(function(m) {
            return '<div class="flex ' + (m.senderId === currentUser.id ? 'justify-end' : 'justify-start') + '">' +
                '<div class="' + (m.senderId === currentUser.id ? 'chat-bubble-user' : 'chat-bubble-bot') + ' px-3 py-2 text-xs">' + m.text + '</div></div>';
        }).join('');
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function sendMessage() {
    if(!currentChat || !currentUser) return;
    
    const input = document.getElementById('msgInput');
    if(!input || !input.value.trim()) return;
    
    const msgs = DB.get('messages') || [];
    msgs.push({ 
        id: Date.now(), 
        chatId: currentChat.id, 
        senderId: currentUser.id, 
        text: input.value, 
        timestamp: Date.now() 
    });
    DB.set('messages', msgs);
    
    const otherId = currentChat.participants.find(function(p) { return p !== currentUser.id; });
    addNotification('New message received');
    
    input.value = '';
    openChat(currentChat.id);
}

function contactSeller() {
    if(!currentUser) { 
        showToast('Login first'); 
        showPage('login'); 
        return; 
    }
    
    if(!currentListing) return;
    
    const chats = DB.get('chats') || [];
    const chatId = [currentUser.id, currentListing.sellerId].sort().join('_');
    
    if(!chats.find(function(c) { return c.id === chatId; })) {
        const newChat = { 
            id: chatId, 
            participants: [currentUser.id, currentListing.sellerId], 
            participantNames: {} 
        };
        
        newChat.participantNames[currentUser.id] = currentUser.firstName;
        newChat.participantNames[currentListing.sellerId] = currentListing.sellerName;
        
        chats.push(newChat);
        DB.set('chats', chats);
    }
    
    currentChat = { id: chatId };
    addNotification('Chat started with ' + currentListing.sellerName);
    showPage('chat');
}

function makeOffer() {
    if(!currentUser) { 
        showToast('Login first'); 
        showPage('login'); 
        return; 
    }
    
    const offer = prompt('Your offer ($):');
    if(offer) { 
        showToast('Offer sent!'); 
        contactSeller(); 
    }
}

// ==================== CHATBOT ====================
function toggleChatbot() { 
    const chatbotWindow = document.getElementById('chatbot-window');
    if (chatbotWindow) {
        chatbotWindow.classList.toggle('active'); 
    }
}

function sendBotMessage() {
    const input = document.getElementById('chatbot-input');
    const container = document.getElementById('chatbot-messages');
    
    if(!input || !container) return;
    
    const text = input.value.trim();
    if(!text) return;
    
    container.innerHTML += '<div class="flex justify-end"><div class="chat-bubble-user px-3 py-2 text-xs">' + text + '</div></div>';
    input.value = '';
    
    setTimeout(function() {
        let response = "I can help with materials.";
        if(text.toLowerCase().indexOf('plastic') > -1) response = "Plastic: HDPE $320/ton";
        else if(text.toLowerCase().indexOf('metal') > -1) response = "Copper $8500/ton";
        
        container.innerHTML += '<div class="flex justify-start"><div class="chat-bubble-bot px-3 py-2 text-xs">' + response + '</div></div>';
    }, 300);
}

// ==================== MODAL LOGIC ====================
function openAddListingModal() {
    const overlay = document.getElementById('modalOverlay');
    const template = document.getElementById('addListingModalTemplate');
    
    if (!overlay || !template) return;
    
    overlay.innerHTML = template.innerHTML;
    overlay.classList.add('active');
    currentStep = 1;
    selectedCategory = '';
    
    setTimeout(function() { 
        updateProgressUI(1); 
    }, 10);
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.innerHTML = '';
    }
    
    if(modalMap) { 
        modalMap.remove(); 
        modalMap = null; 
        modalMarker = null; 
    }
}

function selectCategory(el, cat) {
    document.querySelectorAll('.category-card').forEach(function(c) { 
        c.classList.remove('selected'); 
    });
    
    el.classList.add('selected');
    selectedCategory = cat;
    
    const step1Next = document.getElementById('step1Next');
    if (step1Next) {
        step1Next.disabled = false;
    }
}

function goToStep(step) {
    if(step === 2 && !selectedCategory) { 
        showToast('Select category'); 
        return; 
    }
    
    if(step === 3) {
        const title = document.getElementById('listingTitle');
        const qty = document.getElementById('listingQty');
        const price = document.getElementById('listingPrice');
        
        if (!title || !qty || !price) return;
        
        if(!title.value || !qty.value || !price.value) { 
            showToast('Fill all fields'); 
            return; 
        }
        
        // Update preview
        const previewTitle = document.getElementById('previewTitle');
        const previewInfo = document.getElementById('previewInfo');
        const previewPrice = document.getElementById('previewPrice');
        
        if (previewTitle) previewTitle.textContent = title.value;
        if (previewInfo) previewInfo.textContent = qty.value + ' kg - $' + price.value;
        if (previewPrice) previewPrice.textContent = '$' + price.value;
    }
    
    currentStep = step;
    updateProgressUI(step);
    
    // Hide all steps
    for(let i = 1; i <= 3; i++) {
        const stepElement = document.getElementById('modalStep' + i);
        if (stepElement) stepElement.classList.remove('active');
    }
    
    const successStep = document.getElementById('modalSuccess');
    if (successStep) successStep.classList.remove('active');
    
    // Show current step
    if(step === 4) {
        if (successStep) successStep.classList.add('active');
    } else {
        const currentStepElement = document.getElementById('modalStep' + step);
        if (currentStepElement) currentStepElement.classList.add('active');
    }
    
    const numEl = document.getElementById('currentStepNum');
    if(numEl) numEl.textContent = step;
    
    if(step === 2) {
        setTimeout(initModalMap, 100);
    }
}

function updateProgressUI(step) {
    const fill = document.getElementById('progressBarFill');
    if(fill) {
        const pct = (step / 3) * 100;
        fill.style.width = pct + '%';
    }
}

// ==================== MODAL MAP ====================
function initModalMap() {
    if(modalMap) { 
        modalMap.remove(); 
    }
    
    const modalMapElement = document.getElementById('modalMap');
    if (!modalMapElement) return;
    
    modalMap = L.map('modalMap', { center: [25.0, 55.0], zoom: 4, zoomControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '' }).addTo(modalMap);
    
    modalMap.on('click', function(e) {
        setModalMarker(e.latlng);
    });
    
    setTimeout(function() { 
        if(modalMap) modalMap.invalidateSize(); 
    }, 200);
}

function setModalMarker(latlng) {
    if(modalMarker && modalMap) {
        modalMap.removeLayer(modalMarker);
    }
    
    const icon = L.divIcon({
        className: '',
        html: '<div style="background:#22c55e;width:20px;height:20px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px rgba(34,197,94,0.5);"></div>',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]
    });
    
    if (modalMap) {
        modalMarker = L.marker(latlng, { icon: icon, draggable: true }).addTo(modalMap);
        
        const latInput = document.getElementById('listingLat');
        const lngInput = document.getElementById('listingLng');
        
        if (latInput) latInput.value = latlng.lat;
        if (lngInput) lngInput.value = latlng.lng;
    }
}

function locateMe() {
    if(!navigator.geolocation) { 
        showToast('Geolocation not supported'); 
        return; 
    }
    
    showToast('Locating...');
    
    navigator.geolocation.getCurrentPosition(function(pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        
        if(modalMap) {
            modalMap.setView([lat, lng], 13);
            setModalMarker({ lat: lat, lng: lng });
        }
    }, function() {
        showToast('Could not get location');
    });
}

function submitListing() {
    if(!currentUser) { 
        showToast('Login first'); 
        closeModal(); 
        showPage('login'); 
        return; 
    }
    
    const listings = DB.get('listings') || [];
    
    const title = document.getElementById('listingTitle');
    const qty = document.getElementById('listingQty');
    const price = document.getElementById('listingPrice');
    const location = document.getElementById('listingLocation');
    const lat = document.getElementById('listingLat');
    const lng = document.getElementById('listingLng');
    
    if (!title || !qty || !price || !location || !lat || !lng) {
        showToast('Please fill all fields');
        return;
    }
    
    const newListing = {
        id: Date.now(),
        title: title.value,
        category: selectedCategory,
        quantity: Number(qty.value) || 0,
        price: Number(price.value) || 0,
        location: location.value || 'Unknown',
        lat: parseFloat(lat.value) || 25.0,
        lng: parseFloat(lng.value) || 55.0,
        description: '',
        sellerId: currentUser.id,
        sellerName: currentUser.firstName,
        createdAt: Date.now(),
        views: 0
    };
    
    listings.unshift(newListing);
    DB.set('listings', listings);
    
    addNotification('New listing: ' + title.value);
    goToStep(4);
}

// ==================== 3D CARD INTERACTION ====================
function handle3DTilt(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10; 
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function reset3DTilt(card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

// ==================== PROFILE ====================
function renderProfile() {
    if(!currentUser) return;
    
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    
    if (profileAvatar) profileAvatar.textContent = currentUser.firstName[0];
    if (profileName) profileName.textContent = currentUser.firstName;
    if (profileEmail) profileEmail.textContent = currentUser.email;
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = msg;
    toast.classList.add('show');
    
    setTimeout(function() { 
        toast.classList.remove('show'); 
    }, 2500);
}
