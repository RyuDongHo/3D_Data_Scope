/**
 * App Layer - 애플리케이션 진입점
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { UploadPage } from '../pages/UploadPage/ui/UploadPage';
import { MappingPage } from '../pages/MappingPage/ui/MappingPage';
import { ViewerPage } from '../pages/ViewerPage/ui/ViewerPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/mapping" element={<MappingPage />} />
      <Route path="/viewer" element={<ViewerPage />} />
    </Routes>
  );
}
