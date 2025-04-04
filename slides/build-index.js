const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Read all HTML files in directory
const files = fs.readdirSync('.')
  .filter(file => file.endsWith('.html') && file !== 'index.html');

// Extract titles and create index entries
const indexItems = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const dom = new JSDOM(content);
  const title = dom.window.document.querySelector('title').textContent;

  indexItems.push({
    path: `./${file}`,
    title: title
  });
});

// Read the existing index.html
const indexPath = './index.html';
const indexContent = fs.readFileSync(indexPath, 'utf8');
const indexDom = new JSDOM(indexContent);
const document = indexDom.window.document;

// Find the index section
const indexSection = document.querySelector('section[data-header="Índice"]');
const olElement = indexSection.querySelector('ol');

// Clear existing list items
while (olElement.firstChild) {
  olElement.removeChild(olElement.firstChild);
}

// Add new items
indexItems.forEach(item => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = item.path;
  a.textContent = item.title;
  li.appendChild(a);
  olElement.appendChild(li);
});

// Write updated index.html
fs.writeFileSync(indexPath, indexDom.serialize());

console.log('Index successfully updated!');