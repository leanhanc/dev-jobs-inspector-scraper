const LAUNCH_OPTIONS = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  defaultViewport: { width: 1024, height: 780 },
  headless: process.env.NODE_ENV === 'production' ? true : false,
  ignoreHTTPSErrors: true,
  timeout: 50000
};

const SEARCH_FOR = [
  'Android',
  'Angular',
  'Backend',
  'Desarrollador C',
  'Junior Developer',
  'Cordova',
  'DevOps',
  'Ionic',
  'iOS',
  'Frontend',
  'Full-Stack',
  'Java',
  'Javascript',
  'Laravel',
  'MySQL',
  'MS SQL Server',
  'Desarrollador .Net',
  'Node',
  'Php',
  'PostgreSQL',
  'Python',
  'React',
  'React Native',
  'Senior Developer',
  'Spring',
  'Swift',
  'Vue JS'
];

const ZONAJOBS_URL = 'https://www.zonajobs.com.ar';

module.exports = { LAUNCH_OPTIONS, SEARCH_FOR, ZONAJOBS_URL };
