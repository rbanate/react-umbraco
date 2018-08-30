import DocumentUpload from '../layouts/DocumentUpload';
import Home from '../layouts/Home';

const indexRoutes = [
  {
    path: '/document-upload',
    name: 'Upload Documents',
    component: DocumentUpload,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
];

export default indexRoutes;
