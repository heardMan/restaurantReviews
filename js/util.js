

  
  /**
   * Change Attribution link Aria Labels
   */
  const modifyAttributionLinksARIA = () => {
    const links = document.querySelectorAll('.leaflet-control-attribution a');
    const lastLink = document.querySelectorAll('.leaflet-control-attribution as')[0];
    
    links.forEach(link => {
      link.setAttribute('aria-label', `Map Attribution Link ${link.textContent}`);
    })
    if(lastLink !== undefined)
    lastLink.setAttribute('aria-label', `Map Attribution Link ${lastLink.textContent}`);
  }