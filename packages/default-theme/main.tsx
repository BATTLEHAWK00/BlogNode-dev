import 'remixicon/fonts/remixicon.css';
import './styles/main.css';

import domClient from 'react-dom/client';
import React from 'react';
import App from './components/dom/app';

const root = document.getElementById('__blognode');

if (root) domClient.hydrateRoot(root, <App />);
else throw new Error('No root found.');
