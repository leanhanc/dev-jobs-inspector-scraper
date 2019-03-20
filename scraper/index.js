const adverts = require('../controllers/AdvertsController')();

/* adverts.save({
  description:
    'Nos orientamos a profesionales con amplia experiencia en puestos de Arquitecto de Aplicaciones.\nValoramos conocimientos en SOA, amplia experiencia en desarrollo de aplicaciones Java.\nIncorporaremos a importante empresa en zona Microcentro.\nOfrecemos puesto efectivo en nuestro cliente.\nFlexibilidad horaria, prepaga primer nivel, cobertura Gym, estudios universitarios, inglés, días adicionales por vacaciones, entre otros.',
  location: 'Capital Federal',
  site: 'Computrabajo',
  title: 'Desarrollador WEB (PART-TIME)',
  url:
    'https://www.bumeran.com.ar/empleos/desarrollador-web-part-time-troop-software-factory-1113102948.html?indiceAviso=1',
  publisher: 'Progres S.A.'
});
 */

adverts.findAll().then(res => console.log(res));

module.exports = adverts;
