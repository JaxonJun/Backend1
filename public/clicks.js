
fetch("/get-clicks")
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector("#clickTable tbody");
    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.time}</td>
        <td>${row.page}</td>
        <td>${row.slot}</td>
        <td>${row.ip}</td>
      `;
      tbody.appendChild(tr);
    });
  });
