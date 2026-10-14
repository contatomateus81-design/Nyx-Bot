/*
  RF Imports — catálogo de beleza
  Edite os produtos abaixo para atualizar a vitrine de beleza.
  O número de WhatsApp usa DDI + DDD + número, somente dígitos.
*/
const WHATSAPP_NUMBER = "555492563106";
const products = [
  { id: 1, name: "Batons importados", category: "maquiagem", categoryLabel: "Maquiagem", description: "Cores e acabamentos para combinar com o seu estilo.", price: "Consulte o valor", image: "" },
  { id: 2, name: "Shampoo e condicionador", category: "cabelos", categoryLabel: "Cabelos", description: "Cuidados para completar sua rotina capilar.", price: "Consulte o valor", image: "" },
  { id: 3, name: "Maquiagem e cuidados", category: "cuidados", categoryLabel: "Cuidados", description: "Descubra opções de beleza selecionadas pela RF Imports.", price: "Consulte o valor", image: "" }
];
const grid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const contactLink = document.querySelector("#contact-link");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

function askAbout(product) {
  const message = `Olá! Tenho interesse em ${product.name}. Poderia me passar mais informações e o valor, por favor?`;
  if (!WHATSAPP_NUMBER) {
    alert("O WhatsApp ainda não foi configurado.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function renderProducts(category = "todos") {
  const filtered = products.filter(product => category === "todos" || product.category === category);
  grid.innerHTML = "";
  emptyState.hidden = filtered.length > 0;

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    const imageMarkup = product.image
      ? `<img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">`
      : `<div class="product-placeholder" aria-label="Foto de ${product.name}"><span>RF</span><small>RF IMPORTS</small></div>`;
    card.innerHTML = `
      ${imageMarkup}
      <div class="product-info">
        <span class="product-category">${product.categoryLabel}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <strong>${product.price}</strong>
          <button class="product-contact" type="button">Consultar</button>
        </div>
      </div>`;
    card.querySelector(".product-contact").addEventListener("click", () => askAbout(product));
    grid.appendChild(card);
  });
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(item => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    renderProducts(button.dataset.filter);
  });
});

if (contactLink) {
  contactLink.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  contactLink.target = "_blank";
  contactLink.rel = "noopener noreferrer";
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open", !expanded);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
  }));
}

renderProducts();
