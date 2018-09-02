import DocumentUpload from '../views/document-upload';
import Home from '../views/registration';
import Profile from '../views/profile';
import UpdateProfile from '../views/profile/update';

const indexRoutes = [
  {
    path: '/document-upload',
    name: 'Upload Documents',
    component: DocumentUpload,
  },

  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/update',
    name: 'Update Profile',
    component: UpdateProfile,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
];

export default indexRoutes;
