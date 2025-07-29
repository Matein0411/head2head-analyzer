const Footer = () => {
  const footerSections = [
    {
      title: "ATP TOUR",
      links: ["About", "Careers", "Contact Us", "Media Accreditation", "Press Releases"]
    },
    {
      title: "PLAYERS & RANKINGS",
      links: ["ATP Rankings", "Race to Milan", "Prize Money Leaders", "ATP Awards"]
    },
    {
      title: "TOURNAMENTS",
      links: ["ATP Masters 1000", "ATP 500", "ATP 250", "Challenger Tour", "ITF Futures"]
    },
    {
      title: "STATS & ANALYSIS", 
      links: ["ATP Stats", "Match Stats", "Head 2 Head", "Live Scores", "Order of Play"]
    }
  ];

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button className="text-muted-foreground hover:text-atp-blue transition-colors text-sm">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="text-xl font-bold text-foreground">ATP TOUR</div>
              <div className="text-xs text-muted-foreground">It all adds up</div>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <button className="hover:text-atp-blue transition-colors">Privacy Policy</button>
              <button className="hover:text-atp-blue transition-colors">Terms of Use</button>
              <button className="hover:text-atp-blue transition-colors">Cookie Policy</button>
              <button className="hover:text-atp-blue transition-colors">Accessibility</button>
            </div>
          </div>
          
          <div className="text-center mt-6 text-sm text-muted-foreground">
            © 2024 ATP Tour, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;