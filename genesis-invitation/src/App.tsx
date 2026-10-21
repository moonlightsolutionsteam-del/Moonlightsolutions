import { useEffect, useState } from 'react';
import Actions from './components/Actions';
import GiftIntro from './components/GiftIntro';
import Hero from './components/Hero';
import Members from './components/Members';
import MusicToggle from './components/MusicToggle';
import Notice from './components/Notice';
import People from './components/People';
import Timeline from './components/Timeline';
import { footer } from './data/invitation';

export default function App() {
  const [opened, setOpened] = useState(false);

  // No scrolling until the gift is opened.
  useEffect(() => {
    document.documentElement.style.overflow = opened ? '' : 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, [opened]);

  return (
    <>
      <GiftIntro onOpen={() => setOpened(true)} />
      <MusicToggle />
      <Hero play={opened} />
      <main>
        <Notice />
        <People />
        <Timeline />
        <Members />
        <Actions />
      </main>
      <footer className="bg-wine text-champagne text-center text-base px-4 pt-6" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
        {footer}
      </footer>
    </>
  );
}
