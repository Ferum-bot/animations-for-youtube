export const asset = (name: string): string => `assets/009-cassandra-scylladb/p01/${name}`;

// These colours belong to the photographed source pages, not the channel theme.
export const sources = {
  apache: {
    url: 'https://cwiki.apache.org/confluence/spaces/INCUBATOR2/pages/120720730/Cassandra',
    label: 'APACHE INCUBATOR · CASSANDRA PROPOSAL',
    image: 'apache-proposal.png', width: 1000, height: 455, background: '#1e2125',
  },
  facebook: {
    url: 'https://engineering.fb.com/2008/08/25/core-infra/cassandra-a-structured-storage-system-on-a-p2p-network/',
    label: 'FACEBOOK ENGINEERING · 25.08.2008',
    image: 'facebook-excerpt.png', width: 840, height: 440, background: '#ffffff',
    header: {image: 'facebook-title.png', height: 162},
  },
  dynamo: {
    url: 'https://www.amazon.science/publications/dynamo-amazons-highly-available-key-value-store',
    label: 'AMAZON · DYNAMO · SOSP 2007',
    image: 'dynamo-page.png', width: 1237, height: 640, background: '#ffffff',
  },
} as const;

export type DocumentId = keyof typeof sources;

export const authors = [
  {name: 'Avinash Lakshman', surname: 'Lakshman', image: 'avinash-lakshman.jpg',
    spokenMs: 118800, position: '55% 30%',
    source: 'https://www.lemondeinformatique.fr/actualites/lire-silicon-valley-2015-stockage-distribue-et-virtualise-chez-hedvig-61568.html'},
  {name: 'Prashant Malik', surname: 'Malik', image: 'prashant-malik.jpeg',
    spokenMs: 119500, position: '50% 15%',
    source: 'https://www.tykhe.ventures/team/'},
] as const;

export const inboxSource = {
  url: 'https://web.archive.org/web/20080829234751/http://www.insidefacebook.com/2008/06/19/facebook-launches-inbox-search-screenshot/',
  label: 'INSIDE FACEBOOK · 19.06.2008',
  image: 'inbox-2008.png',
} as const;
