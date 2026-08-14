import { IframeLightbox } from './components/code/IframeLightbox';
import { LightboxProvider } from './components/code/LightboxContext';
import { CrtShell } from './components/crt/CrtShell';
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
      <>
        <ArchivePage />
        <CrtShell />
      </>
    );
  }

  return (
    <LightboxProvider>
      <IframeLightbox />
      <PortfolioHome />
      <CrtShell />
    </LightboxProvider>
  );
}

export default App;
