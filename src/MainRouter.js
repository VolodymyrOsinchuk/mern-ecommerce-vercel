// import React from 'react'
// import { Routes, Route } from 'react-router-dom'
// import PrivateRoute from './auth/PrivateRoute'
// import Login from './auth/Login'
// import Register from './auth/Register'
// import Menu from './components/Menu'
// import Home from './pages/Home'
// import Profile from './user/Profile'
// import EditProfile from './user/EditProfile'
// import Users from './user/Users'

// const MainRouter = () => {
//   return (
//     <div>
//       <Menu />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route element={<PrivateRoute />}>
//           <Route path="/users" element={<Users />} />
//           <Route path="/profile/edit/:userId" element={<EditProfile />} />
//           <Route path="/profile/:userId" element={<Profile />} />
//         </Route>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     </div>
//   )
// }

// export default MainRouter

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Register from './auth/Register'
import Login from './auth/Login'
import Page404 from './pages/Page404'
import HomeLayout from './pages/HomeLayout'
// import Users from './user/Users'
// import Profile from './user/Profile'
// import EditProfile from './user/EditProfile'
import { useAuth } from './context/AuthContext'

// Composant de route privée qui vérifie l'authentification
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  // Pendant le chargement, on peut afficher un spinner ou rien
  if (loading) {
    return <div>Chargement...</div>
  }

  // Si l'utilisateur est authentifié, afficher les routes enfants
  if (isAuthenticated) {
    return <Outlet />
  }

  // Rediriger vers la page de connexion
  return <Navigate to="/login" replace />
}

// Création du routeur avec createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Page404 />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        element: <PrivateRoute />,
        children: [
          // {
          //   path: 'users',
          //   element: <Users />,
          // },
          // {
          //   path: 'profile/:userId',
          //   element: <Profile />,
          // },
          // {
          //   path: 'profile/edit/:userId',
          //   element: <EditProfile />,
          // },
        ],
      },
    ],
  },
])

// Composant principal qui utilise RouterProvider
const MainRouter = () => {
  return <RouterProvider router={router} />
}

export default MainRouter
