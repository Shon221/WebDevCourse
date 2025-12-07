// ---------- DATA ----------
let songs = JSON.parse(localStorage.getItem('songs')) || [];

// ---------- ELEMENTS ----------
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const ratingInput = document.getElementById('rating');
const songIdInput = document.getElementById('songId');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');

const tableView = document.getElementById('tableView');
const cardsView = document.getElementById('cardsView');
const viewToggleBtn = document.getElementById('viewToggleBtn');
const searchInput = document.getElementById('search');

let viewMode = 'table'; // 'table' או 'cards'


// ---------- HELPERS ----------
function getYouTubeId(url) {
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtube.com')) {
            return u.searchParams.get('v'); // ?v=VIDEOID
        }
        if (u.hostname.includes('youtu.be')) {
            return u.pathname.slice(1);     // /VIDEOID
        }
    } catch (e) {
        return null;
    }
    return null;
}

function saveAndRender() {
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
}

function updateViewToggleButton() {
    if (viewMode === 'table') {
        viewToggleBtn.innerHTML = '<i class="fas fa-table"></i>';
        tableView.classList.remove('d-none');
        cardsView.classList.add('d-none');
    } else {
        viewToggleBtn.innerHTML = '<i class="fas fa-th-large"></i>';
        tableView.classList.add('d-none');
        cardsView.classList.remove('d-none');
    }
}


// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    // לדאוג שגם שירים ישנים יקבלו videoId
    songs = songs.map(song => ({
        ...song,
        videoId: song.videoId || getYouTubeId(song.url)
    }));

    updateViewToggleButton();
    renderSongs();
});

// מיון
document.querySelectorAll('input[name="sortOption"]').forEach(radio => {
    radio.addEventListener('change', renderSongs);
});

// חיפוש
searchInput.addEventListener('input', renderSongs);

// תצוגה: Table / Cards
viewToggleBtn.addEventListener('click', () => {
    viewMode = (viewMode === 'table') ? 'cards' : 'table';
    updateViewToggleButton();
    // renderSongs כבר רץ על כל פעם שה־songs משתנה,
    // אבל כאן אנחנו רוצים לוודא שהתצוגה תתעדכן מיד
    renderSongs();
});


// ---------- FORM SUBMIT (Add / Update) ----------
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const rating = Number(ratingInput.value);
    const editingId = songIdInput.value;

    if (!title || !url || !rating || rating < 1 || rating > 10) {
        alert('Please fill all fields and rating between 1-10');
        return;
    }

    const videoId = getYouTubeId(url);
    if (!videoId) {
        alert('Please enter a valid YouTube URL');
        return;
    }

    if (editingId) {
        // עדכון רשומה קיימת
        const idNum = Number(editingId);
        const index = songs.findIndex(s => s.id === idNum);
        if (index !== -1) {
            songs[index].title = title;
            songs[index].url = url;
            songs[index].rating = rating;
            songs[index].videoId = videoId;
        }
    } else {
        // הוספת שיר חדש
        const song = {
            id: Date.now(),
            title,
            url,
            rating,
            videoId,
            dateAdded: Date.now()
        };
        songs.push(song);
    }

    saveAndRender();
    resetFormState();
});


// ---------- RENDER (TABLE + CARDS) ----------
function renderSongs() {
    list.innerHTML = '';
    cardsView.innerHTML = '';

    const sortOption = document.querySelector('input[name="sortOption"]:checked').value;
    const searchText = searchInput.value.trim().toLowerCase();

    let filtered = songs.filter(song =>
        song.title.toLowerCase().includes(searchText)
    );

    if (sortOption === 'name') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'date') {
        filtered.sort((a, b) => b.dateAdded - a.dateAdded);
    } else if (sortOption === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    filtered.forEach(song => {
        const videoId = song.videoId || getYouTubeId(song.url);
        const thumbnailUrl = videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : '';

        // ----- TABLE ROW -----
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="align-middle">
                ${thumbnailUrl ? `
                    <img src="${thumbnailUrl}" 
                         alt="${song.title}" 
                         class="img-thumbnail me-2"
                         style="max-width: 120px;">
                ` : ""}
                <span>${song.title}</span>
            </td>
            <td class="align-middle">
                <button class="btn btn-link text-info p-0" onclick="playSong(${song.id})">
                    Watch
                </button>
            </td>
            <td class="align-middle">${song.rating}/10 ⭐</td>
            <td class="text-end align-middle">
                <button class="btn btn-sm btn-primary me-2" onclick="playSong(${song.id})">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        list.appendChild(row);

        // ----- CARD VIEW -----
        const cardCol = document.createElement('div');
        cardCol.className = 'col-sm-6 col-md-4 col-lg-3';

        cardCol.innerHTML = `
<div class="card bg-secondary text-light border-dark h-100">
                ${thumbnailUrl ? `
                    <img src="${thumbnailUrl}" class="card-img-top" alt="${song.title}">
                ` : ""}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text mb-1">Rating: ${song.rating}/10 ⭐</p>
                    <div class="mt-auto d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-info" onclick="playSong(${song.id})">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="editSong(${song.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        cardsView.appendChild(cardCol);
    });

    updateViewToggleButton();
}


// ---------- DELETE / EDIT / RESET ----------
function deleteSong(id) {
    if (confirm('Are you sure?')) {
        songs = songs.filter(song => song.id !== id);
        saveAndRender();

        if (songIdInput.value && Number(songIdInput.value) === id) {
            resetFormState();
        }
    }
}

function editSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    songIdInput.value = song.id;
    titleInput.value = song.title;
    urlInput.value = song.url;
    ratingInput.value = song.rating;

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    submitBtn.classList.remove('btn-success');
    submitBtn.classList.add('btn-primary');
}

function resetFormState() {
    form.reset();
    songIdInput.value = '';

    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    submitBtn.classList.remove('btn-primary');
    submitBtn.classList.add('btn-success');
}


// ---------- PLAYER (MODAL) ----------
function playSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    const videoId = song.videoId || getYouTubeId(song.url);
    if (!videoId) return;

    const modalEl = document.getElementById('videoModal');
    const modal = new bootstrap.Modal(modalEl);

    document.getElementById('modalTitle').textContent = song.title;

    const frame = document.getElementById('videoFrame');
    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    modal.show();

    modalEl.addEventListener('hidden.bs.modal', () => {
        frame.src = "";
    }, { once: true });
}
