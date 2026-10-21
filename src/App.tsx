import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AudioPlayerBar } from './components/common/AudioPlayerBar';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Artists } from './pages/Artists';
import { ArtistProfile } from './pages/ArtistProfile';
import { ArtForms } from './pages/ArtForms';
import { ArtFormDetail } from './pages/ArtFormDetail';
import { Learn } from './pages/Learn';
import { Experiences } from './pages/Experiences';
import { About } from './pages/About';
import { JoinArtist } from './pages/JoinArtist';
import { Login } from './pages/Login';
import { LearnerDashboard } from './pages/LearnerDashboard';
import { ArtistDashboard } from './pages/ArtistDashboard';
import { AdminPortal } from './pages/AdminPortal';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching logic
  const renderRoute = () => {
    // Strip both search query and hash from pathName to prevent fallthrough to Home
    const pathName = currentPath.split('?')[0].split('#')[0];
    const searchStr = currentPath.includes('?') ? currentPath.split('?')[1].split('#')[0] : '';
    const hash = currentPath.includes('#') ? currentPath.split('#')[1] : '';
    const searchParams = new URLSearchParams(searchStr);
    const tabParam = searchParams.get('tab') || searchParams.get('section') || hash;

    // 1. Artist Detail: /artists/:id
    if (pathName.startsWith('/artists/') && pathName !== '/artists') {
      const artistId = pathName.split('/artists/')[1];
      return <ArtistProfile artistId={artistId} onNavigate={navigate} initialTab={tabParam || undefined} />;
    }

    // 2. Art Form Detail: /art-forms/:slug
    if (pathName.startsWith('/art-forms/') && pathName !== '/art-forms') {
      const slug = pathName.split('/art-forms/')[1];
      return <ArtFormDetail slug={slug} onNavigate={navigate} />;
    }

    // 3. Static Pages
    switch (pathName) {
      case '/discover':
        return <Discover onNavigate={navigate} initialRegion={searchParams.get('region') || ''} />;
      case '/artists':
        return <Artists onNavigate={navigate} />;
      case '/art-forms':
        return <ArtForms onNavigate={navigate} />;
      case '/learn':
        return <Learn onNavigate={navigate} />;
      case '/experiences':
        return <Experiences onNavigate={navigate} />;
      case '/about':
        return <About onNavigate={navigate} />;
      case '/join-artist':
        return <JoinArtist onNavigate={navigate} />;
      case '/login':
        return <Login onNavigate={navigate} />;
      case '/dashboard/learner':
        return <LearnerDashboard onNavigate={navigate} />;
      case '/dashboard/artist':
        return <ArtistDashboard onNavigate={navigate} />;
      case '/admin':
        return <AdminPortal onNavigate={navigate} initialTab={tabParam || undefined} />;
      case '/':
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1C1B19] paper-texture">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      
      <main className="flex-1">
        {renderRoute()}
      </main>

      <Footer onNavigate={navigate} />
      <AudioPlayerBar />
    </div>
  );
};
