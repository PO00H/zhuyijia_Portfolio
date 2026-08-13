import { IframeLightbox } from './components/code/IframeLightbox';
import { LightboxProvider } from './components/code/LightboxContext';
import { DotGridBackground } from './components/ui/dot-grid-background';
import { AssetLab } from './features/asset-lab/AssetLab';
import { AsciiLab } from './features/ascii-lab/AsciiLab';
import { PixelMaterialLab } from './features/pixel-material-lab/PixelMaterialLab';
import { ArchivePage } from './sections/archive/ArchivePage';
import { PortfolioHome } from './sections/portfolio/PortfolioHome';
import './App.css';

function App() {
  const pathname = window.location.pathname;
  const isLocalAssetLab = import.meta.env.DEV && (pathname === '/asset-lab' || pathname === '/asset-lab/');
  const isLocalAsciiLab = import.meta.env.DEV && (pathname === '/ascii-lab' || pathname === '/ascii-lab/');
  const isLocalPixelLab = import.meta.env.DEV && (pathname === '/pixel-lab' || pathname === '/pixel-lab/');
  const isArchive = pathname === '/archive' || pathname === '/archive/';

  if (isLocalAssetLab) {
    return <AssetLab />;
  }

  if (isLocalAsciiLab) {
    return <AsciiLab />;
  }

  if (isLocalPixelLab) {
    return <PixelMaterialLab />;
  }

  if (isArchive) {
    return (
      <div className="relative min-h-screen bg-[#090A09]">
        <DotGridBackground containerClassName="bg-[#090A09]" />
        <div className="relative z-10">
          <ArchivePage />
        </div>
      </div>
    );
  }

  return (
    <LightboxProvider>
      <IframeLightbox />
      <div className="relative min-h-screen bg-[#090A09]">
        <DotGridBackground containerClassName="bg-[#090A09]" />
        <div className="relative z-10">
          <PortfolioHome />
        </div>
      </div>
    </LightboxProvider>
  );
}

export default App;
