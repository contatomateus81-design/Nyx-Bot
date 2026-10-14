/*
  RF Imports — catálogo de beleza
  Edite os produtos abaixo para atualizar a vitrine de beleza.
  Para ativar o WhatsApp, preencha WHATSAPP_NUMBER com DDI + DDD + número,
  somente dígitos (ex.: 5554999999999).
*/
const WHATSAPP_NUMBER = "";
const products = [
  { id: 1, name: "Batons importados", category: "maquiagem", categoryLabel: "Maquiagem", description: "Cores e acabamentos para combinar com o seu estilo.", price: "Consulte o valor", image: "" },
  { id: 2, name: "Shampoo e condicionador", category: "cabelos", categoryLabel: "Cabelos", description: "Cuidados para completar sua rotina capilar.", price: "Consulte o valor", image: "" },
  { id: 3, name: "Maquiagem e cuidados", category: "cuidados", categoryLabel: "Cuidados", description: "Descubra opções de beleza selecionadas pela RF Imports., price: "Consulte o valor", image: "" }
];
const grid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const contactLink = document.querySelector("#contact-link");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

function askAbout(product) {
  const message = `Olá! Tenho interesse em "${product.name}" da RF Imports. Poderia me informar o preço e a disponibilidade?`;
  if (!WHATSAPP_NUMBER) {
    alert("O contato pelo WhatsApp ainda precisa ser configurado. Fale com a RF Imports para consultar este produto.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}
function renderProducts(filter = "todos") {
  const visible = filter === "todos" ? products : products.filter(p => p.category === filter);
  grid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy">` : `<span class="product-placeholder">RF</span>`}
        <span class="product-category">${product.categoryLabel}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${product.price}</span>
          <a class="product-ask" href="#contato" data-product="${product.id}">Tenho interesse ↗</a>
        </div>
      </div>
    </article>`).join("");
  emptyState.hidden = visible.length > 0;
}
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === button));
    renderProducts(button.dataset.filter);
  });
});
grid.addEventListener("click", event => {
  const link = event.target.closest("[data-product]");
  if (!link) return;
  event.preventDefault();
  const product = products.find(p => p.id === Number(link.dataset.product));
  if (product) askAbout(product);
});
contactLink.addEventListener("click", event => {
  event.preventDefault();
  if (!WHATSAPP_NUMBER) {
    alert("O WhatsApp da loja ainda não foi configurado. Depois, basta preencher WHATSAPP_NUMBER no arquivo script.js.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim pela vitrine da RF Imports e gostaria de informações.")}`, "_blank", "noopener,noreferrer");
});
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.querySelector("#year").textContent = new Date().getFullYear();
renderProducts();