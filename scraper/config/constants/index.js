const LAUNCH_OPTIONS = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  defaultViewport: { width: 1024, height: 780 },
  headless: process.env.NODE_ENV === 'production' ? true : false,
  headles: true,
  ignoreHTTPSErrors: true,
  timeout: 50000
};

const SEARCH_FOR = [
  /*
  'Android',
  'AWS',
  'Angular',
  'Backend',
  'Cobol',
  'DevOps',
  'Dev Ops',
  'iOS',
  'Frontend',
  'Full Stack',
  'Java',
  'Javascript',
  'Laravel',
  'Mongo DB',
  'Microsoft .NET',
  'Node',
  'Php',
  'PL/SQL',
  'Python',
  'React',
  */
  'React Native',
  'SQL',
  'Vue JS'
];

const BUMERAN_URL = 'https://www.bumeran.com.ar';
const COMPUTRABAJO_URL = 'https://www.computrabajo.com.ar';
const ZONAJOBS_URL = 'https://www.zonajobs.com.ar';

module.exports = {
  LAUNCH_OPTIONS,
  SEARCH_FOR,
  BUMERAN_URL,
  COMPUTRABAJO_URL,
  ZONAJOBS_URL
};
