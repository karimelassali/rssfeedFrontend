export default function handler(req, res) {
  const data = {
    data: [
      {
        id: 1,
        source: "https://www.ansa.it/valledaosta/notizie/valledaosta_rss.xml",
        title: "In Valle d'Aosta inflazione cresce dello 0,7% su base annua",
        link: "https://www.ansa.it/valledaosta/notizie/2025/01/16/in-valle-daosta-inflazione-cresce-dello-07-su-base-annua_82602307-38cc-440b-87da-0cc7d245d5d5.html",
        description: "Nel dicembre scorso l'indice dei prezzi al consumo per l'intera collettività nazionale (Nic) relativo al Comune di Aosta ha registrato un +0,9% rispetto a novembre 2024 e un +0,7% rispetto allo stesso mese dell'anno scorso. Nel confronto con il mese precedente, gli incrementi maggiori riguardano abitazione, acqua, elettricità e combustibili (+2%), servizi ricettivi e di ristorazione (+4,1%), bevande alcoliche e tabacchi (+2,3%). In diminuzione comunicazioni (-6,4%), e mobili, articoli e servizi per la casa (-0,9).     Riproduzione riservata © Copyright Riproduzione riservata  Copyright Digival",
        pubDate: "2025-01-16T11:44:44.000000Z",
        isPublished: 0,
        created_at: "2025-01-16T12:14:38.000000Z",
        updated_at: "2025-01-16T12:14:38.000000Z"
      }
    ]
  };

  res.status(200).json(data);
}