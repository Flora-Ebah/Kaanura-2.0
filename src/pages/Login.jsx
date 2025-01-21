import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat sm:bg-[url('/background.png')] bg-[url('/5-1.png')]">
      <div className="w-full max-w-[1000px] grid md:grid-cols-2 gap-8 bg-[#1A1A1A]/80 rounded-2xl p-8">
        {/* Image section - visible uniquement sur desktop */}
        <div className="hidden md:flex items-center justify-center">
          <img 
            src="/3.png" 
            alt="Kanuura Produits" 
            className="w-full h-full max-w-md rounded-2xl object-cover"
          />
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-[#222] rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Connexion</h2>
          <form id="loginForm" className="space-y-4" method="POST">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 bg-[#333] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                name="email"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2 bg-[#333] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                name="password"
              />
              <a href="/forgot-password" className="text-xs text-gray-400 hover:text-orange-500 mt-1 block text-right">
                Mot de passe oublié ?
              </a>
            </div>

            <button 
              className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              type="submit"
            >
              Se connecter
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
              Vous n'avez pas encore de compte ?{' '}
              <a href="/sign-up" className="text-orange-500 hover:text-orange-400">
                Créer un compte gratuitement
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 