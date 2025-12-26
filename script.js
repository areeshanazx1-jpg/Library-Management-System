// Load XML data when page loads
window.onload = function () {
    loadXMLData();
};

// Function to load XML file
function loadXMLData() {
    fetch("library.xml")
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "application/xml");
            let books = xml.getElementsByTagName("book");

            for (let book of books) {
                addBookToTable(
                    book.getElementsByTagName("id")[0].textContent,
                    book.getElementsByTagName("title")[0].textContent,
                    book.getElementsByTagName("author")[0].textContent,
                    book.getElementsByTagName("category")[0].textContent,
                    book.getElementsByTagName("price")[0].textContent,
                    book.getElementsByTagName("status")[0].textContent
                );
            }
        });
}

// Add book to table dynamically
function addBookToTable(id, title, author, category, price, status) {
    let tableBody = document.querySelector("#bookTable tbody");
    let row = document.createElement("tr");

    let statusClass = status === "Available" ? "available" : "issued";

    row.innerHTML = `
        <td>${id}</td>
        <td>${title}</td>
        <td>${author}</td>
        <td>${category}</td>
        <td>${price}</td>
        <td class="${statusClass}">${status}</td>
    `;

    tableBody.appendChild(row);
}

// Form submission
// Modal helpers + form handling
function openModal() {
    const modal = document.getElementById('addBookModal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    const modal = document.getElementById('addBookModal');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
}

// Attach UI handlers after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.getElementById('openAddBook');
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('addBookModal');

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // close when clicking overlay
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));

    // close on Escape key
    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') closeModal();
    });

    // Form submission inside modal
    const form = document.getElementById('bookForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get highest ID from table
            let rows = document.querySelectorAll('#bookTable tbody tr');
            let highestId = 105; // Starting point from XML
            
            rows.forEach(row => {
                let idCell = row.querySelector('td:first-child');
                if (idCell) {
                    let id = parseInt(idCell.textContent);
                    if (id > highestId) {
                        highestId = id;
                    }
                }
            });
            
            let newId = highestId + 1; // Next sequential ID
            let title = document.getElementById('title').value;
            let author = document.getElementById('author').value;
            let category = document.getElementById('category').value;
            let price = document.getElementById('price').value;
            let status = document.getElementById('status').value;

            // Add new book dynamically (DOM update)
            addBookToTable(newId, title, author, category, price, status);

            // Reset form and close modal
            this.reset();
            closeModal();
        });
    }
});
