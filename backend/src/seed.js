// backend/src/seed.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const db     = require('./config/db');
const User   = require('./models/User');
const Plante = require('./models/Plante');
const Photo  = require('./models/Photo');

async function seed() {
  try {
    // 1. UTILISATEURS
    const saltRounds      = parseInt(process.env.SALT_ROUNDS, 10) || 10;
    const adminPwd        = process.env.SEED_ADMIN_PASSWORD;
    const utilisateurPwd  = process.env.SEED_USER_PASSWORD;

    const adminHash = await bcrypt.hash(adminPwd, saltRounds);
    const userHash  = await bcrypt.hash(utilisateurPwd, saltRounds);

    // recréer les comptes
    await User.create({ nom: 'admin',       mot_de_passe: adminHash, role: 'admin' });
    await User.create({ nom: 'utilisateur', mot_de_passe: userHash, role: 'user' });
    console.log('→ Utilisateurs créés');

    // 2. PLANTES
    const plantes = [
      {
        nom_scientifique:   'Adansonia digitata',
        famille:            'Bombacaceae',
        nom_vernaculaire:   'Baobab',
        endemique:       1,
        regions:            'DIANA, SAVA',
        vertus:             'antioxydante, nutritive',
        usages:             'infusion, pâte',
        parties_utilisees:  'fruits, écorce',
        mode_preparation:   'infusion des fruits; pâte d’écorce',
        contre_indications: 'aucune connue',
        remarques:          'hydrate la peau',
        bibliographie:      'Étude botanique 2020'
      },
      {
        nom_scientifique:   'Helianthus annuus',
        famille:            'Asteraceae',
        nom_vernaculaire:   'Tournesol',
        endemique:       0,
        regions:            'DIANA, ATSINANANA',
        vertus:             'anti-inflammatoire',
        usages:             'cataplasme, huile',
        parties_utilisees:  'graines, fleurs',
        mode_preparation:   'huile pressée à froid',
        contre_indications: 'peut irriter peau sensible',
        remarques:          'riche en vitamine E',
        bibliographie:      'Journal Phyto 2019'
      },
      {
        nom_scientifique:   'Pelargonium graveolens',
        famille:            'Geraniaceae',
        nom_vernaculaire:   'Géranium',
        endemique:       1,
        regions:            'SAVA',
        vertus:             'cicatrisante, antiseptique',
        usages:             'huile essentielle, infusion',
        parties_utilisees:  'feuilles, fleurs',
        mode_preparation:   'distillation à la vapeur',
        contre_indications: 'photosensibilisant',
        remarques:          'odeur apaisante',
        bibliographie:      'PharmaTrad 2021'
      },
      {
        nom_scientifique:   'Rubus idaeus',
        famille:            'Rosaceae',
        nom_vernaculaire:   'Framboisier',
        endemique:       0,
        regions:            'DIANA',
        vertus:             'tonique, astringent',
        usages:             'tisane',
        parties_utilisees:  'feuilles',
        mode_preparation:   'infusion 10 min',
        contre_indications: 'aucune connue',
        remarques:          'bonne pour femmes enceintes',
        bibliographie:      'Herbes & Santé 2018'
      },
      {
        nom_scientifique:   'Solanum lycopersicum',
        famille:            'Solanaceae',
        nom_vernaculaire:   'Tomate',
        endemique:       0,
        regions:            'ATSINANANA, ANALANJIROFO',
        vertus:             'antioxydante',
        usages:             'cataplasme',
        parties_utilisees:  'fruits',
        mode_preparation:   'purée crue',
        contre_indications: 'peau sensible',
        remarques:          'rafraîchit',
        bibliographie:      'Cosmétologie 2022'
      }
    ];

    const photosMap = {
      'Baobab':     ['baobab1.jpg','baobab2.jpg'],
      'Tournesol':  ['tournesol1.png','tournesol2.png','tournesol3.png','tournesol4.png'],
      'Géranium':   ['geranium1.png','geranium2.png','geranium3.png'],
      'Framboisier':['framboisier1.png'],
      'Tomate':     []
    };

    for (const p of plantes) {
      const { id } = await Plante.create(p);
      for (const fname of photosMap[p.nom_vernaculaire]) {
        await Photo.create({ filename: fname, plante_id: id });
      }
    }
    console.log('→ Plantes et photos créées');
  } catch (err) {
    console.error(err);
  } finally {
    db.close();
  }
}

seed();
