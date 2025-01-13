import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DemoApp from './demotest/DemoApp';
import DemoApp2 from './demotest/TestApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* <Route
          path="/"
          element={<DemoApp introContent={true} isMultiplayer={false} />}
        /> */}
        <Route
          path="/"
          element={<DemoApp2 introContent={true} isMultiplayer={false} />}
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
