export type Locale = "fr" | "ar" | "en";

export interface Translations {
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    all: string;
    exportCsv: string;
    print: string;
    status: string;
    actions: string;
    loading: string;
    noData: string;
    success: string;
    error: string;
    close: string;
    back: string;
    details: string;
    call: string;
    email: string;
    refresh: string;
    manage: string;
    open: string;
    confirm: string;
    total: string;
    active: string;
    inactive: string;
    date: string;
    phone: string;
    amount: string;
    unitDzd: string;
  };
  roles: {
    super_admin: string;
    admin: string;
    sub_admin: string;
    resident: string;
  };
  nav: {
    dashboard: string;
    residences: string;
    residents: string;
    finances: string;
    maintenance: string;
    personnel: string;
    annonces: string;
    assemblees: string;
    documents: string;
    abonnements: string;
    statistiques: string;
    rapports: string;
    configuration: string;
    profil: string;
    logout: string;
    quickAction: string;
    searchPlaceholder: string;
    notifications: string;
    noNotifications: string;
  };
  dashboard: {
    superAdminBadge: string;
    superAdminTitle: string;
    superAdminSubtitle: string;
    adminBadge: string;
    subAdminBadge: string;
    buildingScope: string;
    treasuryAvailable: string;
    recoveryRate: string;
    unpaidCharges: string;
    openIncidents: string;
    totalResidents: string;
    occupiedApartments: string;
    modulesHubTitle: string;
    modulesHubSubtitle: string;
    workspacesTitle: string;
    recentPayments: string;
    recentIncidents: string;
    quickExports: string;
  };
  finances: {
    title: string;
    subtitle: string;
    tabs: {
      impayes: string;
      journal: string;
      depenses: string;
      factures: string;
      budget: string;
    };
    encaisserPaiement: string;
    genererCharges: string;
    quittanceRecu: string;
    miseEnDemeure: string;
    sommation15Jours: string;
    moisRetard: string;
    dernierReglement: string;
    modesPaiement: {
      edahabia: string;
      cib: string;
      baridimob: string;
      virement: string;
      especes: string;
      cheque: string;
    };
  };
  residences: {
    title: string;
    subtitle: string;
    batiments: string;
    etages: string;
    appartements: string;
    sousAdminDelegue: string;
    nonDelegue: string;
    quotaBatiments: string;
    ajouterBatiment: string;
    nommerSousAdmin: string;
  };
  residents: {
    title: string;
    subtitle: string;
    ajouterResident: string;
    logement: string;
    proprietaire: string;
    cleTemporaire: string;
    statutPaiement: string;
    aJour: string;
    impaye: string;
  };
  maintenance: {
    title: string;
    subtitle: string;
    signalerIncident: string;
    pannesEquipement: string;
    historique: string;
    priorites: {
      haute: string;
      moyenne: string;
      basse: string;
    };
    prestataire: string;
    prendreEnCharge: string;
    cloturer: string;
    preuvePhoto: string;
  };
  assemblees: {
    title: string;
    subtitle: string;
    prochaineSession: string;
    quorumTantiemes: string;
    resolutions: string;
    modeProjection: string;
    pvCertifie: string;
    voterPour: string;
    voterContre: string;
    abstention: string;
  };
  annonces: {
    title: string;
    subtitle: string;
    publierAnnonce: string;
    diffuserAlerte: string;
    alertesUrgentes: string;
    avisPublies: string;
    niveaux: {
      critique: string;
      attention: string;
      info: string;
    };
  };
  documents: {
    title: string;
    subtitle: string;
    contratsPrestataires: string;
    coffreFort: string;
    montantAnnuel: string;
    echeance: string;
    statutsContrat: {
      actif: string;
      expireBientot: string;
      expire: string;
    };
  };
  configuration: {
    title: string;
    subtitle: string;
    typesCharges: string;
    typesIncidents: string;
    modesPaiement: string;
    delaiIntervention: string;
  };
}
