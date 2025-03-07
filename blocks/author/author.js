import { fetchPlaceholders, getMetadata } from "../../scripts/aem.js";

export default async function decorate(block){

  const placeholders = await fetchPlaceholders(getMetadata("locale"));

  console.log("Placeholders:", placeholders);

  const headerText = placeholders.header;

  // create the heading section
  const headingDiv = document.createElement("div");
  headingDiv.classList.add('table-heading');
  const headingH1 = document.createElement('h1');
  headingH1.textContent = headerText;
  headingDiv.append(headingH1);

  
/*

  const table = document.createElement('table');

  const headerRow = document.createElement("tr");

  const fnameKey = placeholders.fnameKey;
  const lnameKey = placeholders.lnameKey;
  const roleKey = placeholders.roleKey;
  const orgKey = placeholders.orgKey;
  const countryKey = placeholders.countryKey;

  const headers = [fnameKey, lnameKey, roleKey, orgKey, countryKey];
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.append(th);
  });

  table.append(headerRow);

 const dataRow = document.createElement("tr");

  const firstName = placeholders.firstName;
  const lastName = placeholders.lastName;
  const role = placeholders.role;
  const organization = placeholders.organization;
  const country = placeholders.country;
  
  const values = [firstName, lastName, role, organization, country];
  values.forEach(value => {
    const td = document.createElement("td");
    td.textContent = value;
    dataRow.append(td);
  });

  table.append(dataRow); 

   [...block.children].forEach((row) => {
    const trow = document.createElement("tr");
    [...row.children].forEach((col) => {
      const tcol = document.createElement("td");
      tcol.append(col);
      trow.append(tcol);
    });
    table.append(trow);
  });  */

  // Create the vertical table
  const table = document.createElement('table');
    
  // Get field labels and values
  const fields = [
    { key: placeholders.fnameKey, value: placeholders.firstName},
    { key: placeholders.lnameKey, value: placeholders.lastName},
    { key: placeholders.roleKey, value: placeholders.role},
    { key: placeholders.orgKey, value: placeholders.organization},
    { key: placeholders.countryKey, value: placeholders.country}
  ];
  
  // Create a row for each field (vertical layout)
  fields.forEach(field => {
    const row = document.createElement('tr');
    
    // Create the label cell as th
    const labelCell = document.createElement('th');
    labelCell.textContent = field.key;
    row.appendChild(labelCell);
    
    // Create the value cell
    const valueCell = document.createElement('td');
    valueCell.textContent = field.value;
    row.appendChild(valueCell);
    
    table.appendChild(row);
  });


  block.innerHTML = '';
  block.append(headingDiv);
  block.append(table);



}