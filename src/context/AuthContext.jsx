// import React, { createContext, useContext, useEffect, useState } from 'react'

// // Create the AuthContext
// const AuthContext = createContext()

// // Fonction pour récupérer le JWT du localStorage
// const getJWT = () => {
//   return localStorage.getItem('authToken')
// }

// // Fonction pour vérifier si un JWT est valide (fonction simplifiée pour l'exemple)
// const verifyJWT = (token) => {
//   if (!token) return false
//   // Ici, tu peux implémenter une validation de ton token, comme la vérification de son expiration
//   return true // Supposons qu'il est valide pour cet exemple
// }

// // Provider component
// export const AuthProvider = ({ children }) => {
//   const [authData, setAuthData] = useState(null) // Contient les informations de l'utilisateur
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [isAdmin, setIsAdmin] = useState(false) // Pour savoir si l'utilisateur est un admin
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const token = getJWT()
//     if (token && verifyJWT(token)) {

//       const decoded = JSON.parse(atob(token.split('.')[1])) // Décoder le JWT
//       setAuthData(decoded)
//       setIsAuthenticated(true)
//       setIsAdmin(decoded.role === 'admin') // Exemple : vérifier le rôle dans le JWT
//     }
//     setLoading(false)
//   }, [])

//   const login = (userData) => {
// ``
//     const token = 'fake-jwt-token' // Cela devrait être le token renvoyé par ton API
//     localStorage.setItem('authToken', token) // Stocker le token dans le localStorage

//     const decoded = JSON.parse(atob(token.split('.')[1])) // Décoder le JWT
//     setAuthData(decoded)
//     setIsAuthenticated(true)
//     setIsAdmin(decoded.role === 'admin') // Vérifie si l'utilisateur est un admin
//   }

//   const logout = () => {
//     localStorage.removeItem('authToken') // Supprimer le JWT du localStorage
//     setAuthData(null)
//     setIsAuthenticated(false)
//     setIsAdmin(false)
//   }

//   const authenticate = () => {
//     return isAuthenticated
//   }

//   const clearJWT = () => {
//     localStorage.removeItem('authToken')
//     setAuthData(null)
//     setIsAuthenticated(false)
//     setIsAdmin(false)
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         authData,
//         isAuthenticated,
//         login,
//         logout,
//         authenticate,
//         clearJWT,
//         isAdmin,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   return useContext(AuthContext)
// }
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react'
// import jwtDecode from 'jwt-decode' // Recommandé d'utiliser une bibliothèque pour décoder les JWT

// Constantes
const LOCAL_STORAGE_TOKEN_KEY = 'authToken'
const DEFAULT_USER_ROLE = 'user'

// Création du contexte d'authentification
const AuthContext = createContext(null)

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns {Object} Le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}

/**
 * Récupère le token JWT du localStorage
 * @returns {string|null} Le token JWT ou null s'il n'existe pas
 */
const getStoredToken = () => localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)

/**
 * Vérifie si un token JWT est valide
 * @param {string} token - Le token JWT à vérifier
 * @returns {boolean} True si le token est valide, false sinon
 */
const isTokenValid = (token) => {
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    // Vérifie si le token a expiré
    return decoded.exp > Date.now() / 1000
  } catch (error) {
    console.error('Erreur lors de la validation du token:', error)
    return false
  }
}

/**
 * Fournisseur du contexte d'authentification
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Valeurs mémorisées dérivées de l'état de l'utilisateur
  const isAuthenticated = useMemo(() => Boolean(user), [user])
  const isAdmin = useMemo(() => user?.role === 'admin', [user])

  // Initialise l'état d'authentification lors du montage du composant
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = getStoredToken()

        if (token && isTokenValid(token)) {
          const decoded = jwtDecode(token)
          setUser(decoded)
        } else {
          // Si le token est invalide ou a expiré, on le supprime
          localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de l'authentification:",
          error
        )
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  /**
   * Connecte un utilisateur et stocke son token
   * @param {Object} credentials - Les identifiants de l'utilisateur
   * @returns {Promise} Une promesse résolue avec les données utilisateur ou rejetée avec une erreur
   */
  const login = async (credentials) => {
    try {
      // Ici, vous devriez faire un appel API pour authentifier l'utilisateur
      // et récupérer un JWT valide

      // Exemple (à remplacer par votre code d'API):
      // const response = await api.post('/auth/login', credentials);
      // const { token } = response.data;

      // Simulation pour l'exemple:
      const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6InVzZXIiLCJleHAiOjE2NzA5Mjg5MzB9.tU_wk5cVuaWxtkXimIxLvN5O9-5X0wvIrMU2iLqZQb8'

      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, mockToken)

      const decoded = jwtDecode(mockToken)
      setUser(decoded)

      return decoded
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  }

  /**
   * Déconnecte l'utilisateur actuel
   */
  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
    setUser(null)
  }

  /**
   * Rafraîchit le token d'authentification
   * @returns {Promise<boolean>} True si le refresh a réussi, false sinon
   */
  const refreshToken = async () => {
    try {
      // Appel à l'API pour rafraîchir le token (à implémenter selon votre backend)
      // const response = await api.post('/auth/refresh-token');
      // const { token } = response.data;

      // Simulation pour l'exemple
      const mockNewToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6InVzZXIiLCJleHAiOjE2ODA5Mjg5MzB9.WQ9MG8sYxkv_uRBVA1Z8hjDyDZA6UZ8HtfKyj-8CcY4'

      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, mockNewToken)

      const decoded = jwtDecode(mockNewToken)
      setUser(decoded)

      return true
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error)
      logout()
      return false
    }
  }

  // Mémoriser la valeur du contexte pour éviter des rendus inutiles
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      logout,
      refreshToken,
    }),
    [user, isAuthenticated, isAdmin, loading]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
