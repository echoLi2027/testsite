/* export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
 */

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Setup image columns
  [...block.children].forEach((row) => {
      [...row.children].forEach((col) => {
          const pic = col.querySelector('picture');
          if (pic) {
              const picWrapper = pic.closest('div');
              if (picWrapper && picWrapper.children.length === 1) {
                  // Picture is only content in column
                  picWrapper.classList.add('columns-img-col');
              }
          }
      });
  });

  // Fetch dynamic column content
  async function fetchColumnsData() {
      try {
          const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
          const data = await response.json();
          renderColumns(data);
      } catch (error) {
          console.error("Failed to load column data", error);
      }
  }

  // Render dynamic content into columns
  function renderColumns(data) {
      const rows = block.children;
      data.forEach((item, index) => {
          if (rows[index]) {
              const col = rows[index].children[0];
              if (col) {
                  col.innerHTML += `
                      <div class="column-content">
                          <h3>${item.title}</h3>
                          <p>${item.body.substring(0, 100)}...</p>
                      </div>
                  `;
              }
          }
      });
  }

  // Load dynamic content
  fetchColumnsData();

  // Scroll animation effect
  window.addEventListener("scroll", () => {
      document.querySelectorAll(".column").forEach(column => {
          if (column.getBoundingClientRect().top < window.innerHeight * 0.8) {
              column.classList.add("visible");
          }
      });
  });
}