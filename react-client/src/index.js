// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/app';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
