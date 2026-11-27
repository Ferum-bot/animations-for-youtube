export const scenarios = [
  {at: 9280, label: 'Права пережили отзыв'},
  {at: 10620, label: 'Рассылка не учитывает права'},
  {at: 12380, label: 'Проверка обычного API пропущена'},
] as const;

type Publication = {
  readonly id: string; readonly publisher: string; readonly date: string;
  readonly title: readonly string[]; readonly url: string; readonly scenario: 0 | 1 | 2;
  readonly mention: readonly [number, number];
};

export const publications: readonly Publication[] = [
  {id:'gitlab',publisher:'GitLab',date:'12.02.2025',scenario:0,mention:[2840,3570],
    title:['ActionCable does not invalidate tokens','after revocation'],
    url:'https://docs.gitlab.com/releases/patches/patch-release-gitlab-17-8-2-released/#actioncable-does-not-invalidate-tokens-after-revocation'},
  {id:'mattermost',publisher:'Mattermost · CVE-2026-3433',date:'12.06.2026',scenario:1,mention:[3570,4880],
    title:['Mattermost fails to scope role_updated','websocket events to authorized team','and channel members'],
    url:'https://www.cve.org/CVERecord?id=CVE-2026-3433'},
  {id:'argo',publisher:'Argo CD',date:'24.07.2024',scenario:0,mention:[4880,5520],
    title:['The Argo CD web terminal session does not','handle the revocation of user permissions','properly.'],
    url:'https://github.com/argoproj/argo-cd/security/advisories/GHSA-v8wx-v5jq-qhhw'},
  {id:'jupyter',publisher:'Jupyter Server',date:'10.09.2026',scenario:2,mention:[5520,6500],
    title:['Gateway WebSocket handler bypasses','kernel execute authorization'],
    url:'https://github.com/jupyter-server/jupyter_server/security/advisories/GHSA-354v-3q48-cv69'},
];
