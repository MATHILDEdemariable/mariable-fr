import React, { useEffect, useState } from 'react';
import ProTutorialModal, { PRO_TUTORIAL_EVENT, PRO_HELP_EVENT, PRO_TUTORIAL_SEEN_KEY } from './ProTutorialModal';
import { ProblemModal } from '@/components/support/ProblemModal';

export const openProTutorial = () => window.dispatchEvent(new Event(PRO_TUTORIAL_EVENT));
export const openProHelp = () => window.dispatchEvent(new Event(PRO_HELP_EVENT));

/** Monté une fois dans l'espace pro : tutoriel (auto à la 1re visite) + aide Mathilde/Calendly. */
const ProSupportHost: React.FC = () => {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(PRO_TUTORIAL_SEEN_KEY)) setTutorialOpen(true);
    const handleTutorial = () => setTutorialOpen(true);
    const handleHelp = () => setHelpOpen(true);
    window.addEventListener(PRO_TUTORIAL_EVENT, handleTutorial);
    window.addEventListener(PRO_HELP_EVENT, handleHelp);
    return () => {
      window.removeEventListener(PRO_TUTORIAL_EVENT, handleTutorial);
      window.removeEventListener(PRO_HELP_EVENT, handleHelp);
    };
  }, []);

  return (
    <>
      <ProTutorialModal open={tutorialOpen} onOpenChange={setTutorialOpen} />
      <ProblemModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} showCalendly />
    </>
  );
};

export default ProSupportHost;
