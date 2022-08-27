import React from 'react';
import ReactDOM from 'react-dom';

// plugins styles from node_modules
import 'react-notification-alert/dist/animate.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
// plugins styles downloaded
import 'assets/vendor/fullcalendar/dist/fullcalendar.min.css';
import 'assets/vendor/sweetalert2/dist/sweetalert2.min.css';
import 'assets/vendor/select2/dist/css/select2.min.css';
import 'assets/vendor/quill/dist/quill.core.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/@fortawesome/fontawesome-free/css/all.css';
import 'assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';
// core styles
import 'assets/scss/argon-dashboard-pro-react.scss?v1.1.0';

// import "https://kit.fontawesome.com/4fc64c9303.js";

import App from './App.js';
import './assets/scss/custom-scss/App.scss';

ReactDOM.render(<App />, document.getElementById('root'));
