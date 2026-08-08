import { ContactPanel } from '../components/archive/ContactPanel';
import { GameplayLab } from '../components/archive/GameplayLab';
import { Hero } from '../components/archive/Hero';
import { SelectedGames } from '../components/archive/SelectedGames';
import { ToolsSystems } from '../components/archive/ToolsSystems';
import { WorldsVisual } from '../components/archive/WorldsVisual';

export function HomePage() {
  return (
    <div className="archive-home">
      <Hero />
      <SelectedGames />
      <GameplayLab />
      <WorldsVisual />
      <ToolsSystems />
      <ContactPanel />
    </div>
  );
}
