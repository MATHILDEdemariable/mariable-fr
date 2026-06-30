import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('common');
  return (
    <footer className="py-8 bg-white text-wedding-black" role="contentinfo" aria-label="Footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo et description à gauche */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link to="/admin/dashboard" className="w-10 h-10 bg-wedding-black rounded-full flex items-center justify-center hover:bg-wedding-black/80 transition-colors" aria-label="Administration">
                <span className="text-white font-serif text-lg">M</span>
              </Link>
            </div>
            <p className="mb-4 text-wedding-black/70 text-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-wedding-black hover:text-wedding-black/70 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Planifier mon mariage */}
          <div>
            <h3 className="font-serif text-base mb-3">{t('footer.section.plan')}</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/dashboard" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.dashboard')}</Link></li>
              <li><Link to="/checklist-mariage" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.checklist')}</Link></li>
              <li><Link to="/selection" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.findVendor')}</Link></li>
              <li><Link to="/professionnelsmariable" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.selection')}</Link></li>
              <li><Link to="/mon-jour-m" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.coordination')}</Link></li>
              <li><Link to="/guide-jour-j" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.guideJourJ')}</Link></li>
              <li><Link to="/guide-debutant" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.guideBeginner')}</Link></li>
              <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.budget')}</Link></li>
            </ul>
          </div>

          {/* Découvrir */}
          <div>
            <h3 className="font-serif text-base mb-3">{t('footer.section.discover')}</h3>
            <ul className="space-y-1 text-sm">
              
              <li><Link to="/conseilsmariage" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.advice')}</Link></li>
              <li><Link to="/outils-planning-mariage" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.planning')}</Link></li>
              <li><Link to="/coordination-jour-j" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.jourJ')}</Link></li>
              <li><Link to="/guidepersonnalise" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.customGuide')}</Link></li>
            </ul>
          </div>

          {/* Mariages par région */}
          <div>
            <h3 className="font-serif text-base mb-3">{t('footer.section.regions')}</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/mariage-provence" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.provence')}</Link></li>
              <li><Link to="/mariage-paris" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.paris')}</Link></li>
              <li><Link to="/mariage-auvergne-rhone-alpes" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.rhoneAlpes')}</Link></li>
              <li><Link to="/mariage-nouvelle-aquitaine" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.aquitaine')}</Link></li>
              <li><Link to="/mariage-bretagne" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.bretagne')}</Link></li>
              <li><Link to="/mariage-normandie" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.normandie')}</Link></li>
              <li><Link to="/mariage-occitanie" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.occitanie')}</Link></li>
              <li><Link to="/mariage-pays-de-la-loire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.paysLoire')}</Link></li>
              <li><Link to="/mariage-centre-val-de-loire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.centreValLoire')}</Link></li>
              <li><Link to="/mariage-hauts-de-france" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.hautsFrance')}</Link></li>
              <li><Link to="/mariage-bourgogne-franche-comte" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.bourgogne')}</Link></li>
              <li><Link to="/mariage-grand-est" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.grandEst')}</Link></li>
              <li><Link to="/mariage-corse" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.corse')}</Link></li>
              <li><Link to="/professionnelsmariable" className="text-wedding-black/70 hover:text-wedding-black transition-colors font-medium">{t('footer.links.allRegions')}</Link></li>
            </ul>
          </div>


          {/* À Propos */}
          <div>
            <h3 className="font-serif text-base mb-3">{t('footer.section.about')}</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.history')}</Link></li>
              <li><Link to="/about/charte" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.charter')}</Link></li>
              <li><Link to="/contact" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.contact')}</Link></li>
              <li><Link to="/contact/faq" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.faq')}</Link></li>
              <li><Link to="/comparatif" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.compare')}</Link></li>
              <li><Link to="/partenariat" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.professionals')}</Link></li>
              <li><Link to="/partenariat" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.partnership')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-wedding-black/70 mb-3 md:mb-0 text-center md:text-left">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-4 text-xs">
            <Link to="/contact" className="text-wedding-black/70 hover:text-wedding-black transition-colors">{t('footer.links.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
