const Header = () => {
  return (
    <header className="bg-black/60 backdrop-blur-md border-b border-border sticky top-0 z-30 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo y nombre */}
            <img src="/tennis-icon.png" alt="Logo TennAI" className="w-16 h-14 object-contain" />
            <div className="mr-2">
              <div className="text-2xl font-bold text-foreground">TennAI</div>
              <div className="text-xs text-muted-foreground">la ia a tu alcance</div>
            </div>
            <div className="flex gap-7">
              <button className="text-base text-muted-foreground hover:text-atp-blue font-medium bg-transparent border-none p-0 m-0 transition-colors duration-200 rounded hover:bg-muted/60">Información</button>
              <button className="text-base text-muted-foreground hover:text-atp-blue font-medium bg-transparent border-none p-0 m-0 transition-colors duration-200 rounded hover:bg-muted/60">Predecir</button>
              <button className="text-base text-muted-foreground hover:text-atp-blue font-medium bg-transparent border-none p-0 m-0 transition-colors duration-200 rounded hover:bg-muted/60">Jugadores</button>
            </div>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;