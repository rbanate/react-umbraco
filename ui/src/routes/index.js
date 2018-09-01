import DocumentUpload from '../views/document-upload';
import Home from '../views/registration';
import Profile from '../views/profile';
import Test from '../views/contextTest';

const indexRoutes = [
  {
    path: '/document-upload',
    name: 'Upload Documents',
    component: DocumentUpload,
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
  },
  {
    path: '/profile',
    name: 'Login',
    component: Profile,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
];

export default indexRoutes;
