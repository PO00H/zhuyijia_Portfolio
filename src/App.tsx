import { CustomCursor } from './components/CustomCursor';
import { IframeLightbox } from './components/code/IframeLightbox';
import { LightboxProvider } from './components/code/LightboxContext';
import { DotGridBackground } from './components/ui/dot-grid-background';
import { AssetLab } from './features/asset-lab/AssetLab';
import { ArchivePage } from './sections/archive/ArchivePage';
import { PortfolioHome } from './sections/portfolio/PortfolioHome';
import './App.css';

function App() {
  const isLocalAssetLab = import.meta.env.DEV && window.location.pathname === '/asset-lab';
  const isArchive = window.location.pathname === '/archive' || window.location.pathname === '/archive/';

  if (isLocalAssetLab) {
    return <AssetLab />;
  }

  if (isArchive) {
    return (
      <>
        <CustomCursor />
        <div className="relative min-h-screen bg-[#D1D1CB]">
          <DotGridBackground containerClassName="bg-[#D1D1CB]" />
          <div className="relative z-10">
            <ArchivePage />
          </div>
        </div>
      </>
    );
  }

  return (
    <LightboxProvider>
      <CustomCursor />
      <IframeLightbox />
      <div className="relative min-h-screen bg-[#D1D1CB]">
        <DotGridBackground containerClassName="bg-[#D1D1CB]" />
        <div className="relative z-10">
          <PortfolioHome />
        </div>
      </div>
    </LightboxProvider>
  );
}

export default App;
