import React, { useState } from 'react';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
    };

    if (data.password !== data.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      // 1. Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 2. Attendre que l'authentification soit terminée
      const user = userCredential.user;

      // 3. Créer le document utilisateur dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        type_user: 'user',
        createdAt: new Date().toISOString(),
      });

      // 4. Rediriger vers la page de connexion
      navigate('/login');
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (err.code === 'auth/weak-password') {
        setError('Le mot de passe doit contenir au moins 6 caractères');
      } else {
        setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat sm:bg-[url('/background-2.png')] bg-[url('/5-1.png')]">
      <div className="w-full max-w-[1000px] grid md:grid-cols-2 gap-8 bg-[#1A1A1A]/80 rounded-2xl p-8">
        {/* Image section - visible uniquement sur desktop */}
        <div className="hidden md:flex items-center justify-center">
          <img 
            src="/4-1.png" 
            alt="Kanuura Produits" 
            className="w-full h-full max-w-md rounded-2xl object-cover"
          />
        </div>

        {/* Formulaire d'inscription */}
        <div className="bg-[#222] rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Inscription</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Prénom</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-[#333] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  name="firstName"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nom</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-[#333] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  name="lastName"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 bg-[#333] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                name="email"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Numéro de téléphone</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">+221</span>
                <input 
                  type="tel"
                  required
                  pattern="[0-9]{9}"
                  placeholder="77 XXX XX XX"
                  className="w-full pl-14 pr-4 py-2 bg-[#333] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  name="phone"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Format: 77 XXX XX XX</p>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Mot de passe</label>
              <input 
                type="password" 
                required
                minLength="8"
                className="w-full px-4 py-2 bg-[#333] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                name="password"
              />
              <p className="text-xs text-gray-400 mt-1">Minimum 8 caractères</p>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Confirmer le mot de passe</label>
              <input 
                type="password" 
                required
                minLength="8"
                className="w-full px-4 py-2 bg-[#333] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                name="confirmPassword"
              />
            </div>

            <button 
              className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Créer un compte'}
            </button>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#222] text-gray-400">ou continuez avec</span>
              </div>
            </div>

            {/* Boutons de connexion sociale */}
            <div className="grid grid-cols-3 gap-4">
              <button type="button" className="flex items-center justify-center p-2 border border-gray-600 rounded-lg hover:bg-[#333]">
                <img src="/icons8-google-48.png" alt="Google" className="w-5 h-5" />
              </button>
              <button type="button" className="flex items-center justify-center p-2 border border-gray-600 rounded-lg hover:bg-[#333]">
                <img src="/icons8-instagram-48.png" alt="Instagram" className="w-5 h-5" />
              </button>
              <button type="button" className="flex items-center justify-center p-2 border border-gray-600 rounded-lg hover:bg-[#333]">
                <img src="/icons8-facebook-48.png" alt="Facebook" className="w-5 h-5" />
              </button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-6">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="text-orange-500 hover:text-orange-400">
                Se connecter
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 