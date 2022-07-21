import domClient from 'react-dom/client';
import React from 'react';

function init(): void {
  const root = document.getElementById('__blognode');

  if (root) domClient.hydrateRoot(root, <App />);
  else throw new Error('No root found.');
}

export default {
  init,
};
