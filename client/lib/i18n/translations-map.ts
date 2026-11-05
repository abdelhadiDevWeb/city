// Auto-complete comprehensive translations map for City SaaS (FR / AR / EN)
import type { Locale } from "./types";

export interface TranslationEntry {
  fr: string;
  ar: string;
  en: string;
}

export const TRANSLATIONS_MAP: Record<string, TranslationEntry> = {
  // === ACTIONS & BUTTONS ===
  "enregistrer": { fr: "Enregistrer", ar: "حفظ", en: "Save" },
  "annuler": { fr: "Annuler", ar: "إلغاء", en: "Cancel" },
  "supprimer": { fr: "Supprimer", ar: "حذف", en: "Delete" },
  "modifier": { fr: "Modifier", ar: "تعديل", en: "Edit" },
  "ajouter": { fr: "Ajouter", ar: "إضافة", en: "Add" },
  "rechercher": { fr: "Rechercher", ar: "بحث", en: "Search" },
  "rechercher...": { fr: "Rechercher...", ar: "بحث...", en: "Search..." },
  "filtrer": { fr: "Filtrer", ar: "تصفية", en: "Filter" },
  "tous": { fr: "Tous", ar: "الكل", en: "All" },
  "tout": { fr: "Tout", ar: "الكل", en: "All" },
  "fermer": { fr: "Fermer", ar: "إغلاق", en: "Close" },
  "retour": { fr: "Retour", ar: "رجوع", en: "Back" },
  "détails": { fr: "Détails", ar: "تفاصيل", en: "Details" },
  "appeler": { fr: "Appeler", ar: "اتصال", en: "Call" },
  "email": { fr: "Email", ar: "بريد إلكتروني", en: "Email" },
  "actualiser": { fr: "Actualiser", ar: "تحديث", en: "Refresh" },
  "confirmer": { fr: "Confirmer", ar: "تأكيد", en: "Confirm" },
  "terminé": { fr: "Terminé", ar: "تم", en: "Done" },
  "copier": { fr: "Copier", ar: "نسخ", en: "Copy" },
  "copié !": { fr: "Copié !", ar: "تم النسخ!", en: "Copied!" },
  "générer": { fr: "Générer", ar: "توليد", en: "Generate" },
  "générer automatiquement": { fr: "Générer automatiquement", ar: "توليد تلقائي", en: "Generate automatically" },
  "quittance": { fr: "Quittance", ar: "وصل مخالصة", en: "Receipt" },
  "nommer": { fr: "Nommer", ar: "تعيين", en: "Assign" },
  "clôturer": { fr: "Clôturer", ar: "إغلاق", en: "Close" },
  "prendre en charge": { fr: "Prendre en charge", ar: "تكفل بالطلب", en: "Take Charge" },
  "assigner tâche": { fr: "Assigner Tâche", ar: "إسناد مهمة", en: "Assign Task" },
  "renvoyer": { fr: "Renvoyer", ar: "إعادة إرسال", en: "Resend" },
  "voter": { fr: "Voter", ar: "تصويت", en: "Vote" },
  "gérer →": { fr: "Gérer →", ar: "إدارة ←", en: "Manage →" },
  "partager whatsapp": { fr: "Partager WhatsApp", ar: "مشاركة عبر واتساب", en: "Share via WhatsApp" },
  "envoyer via whatsapp": { fr: "Envoyer via WhatsApp", ar: "إرسال عبر واتساب", en: "Send via WhatsApp" },
  "imprimer la quittance": { fr: "Imprimer la Quittance", ar: "طباعة الوصل", en: "Print Receipt" },
  "imprimer / pdf": { fr: "Imprimer / PDF", ar: "طباعة / PDF", en: "Print / PDF" },
  "excel / csv": { fr: "Excel / CSV", ar: "إكسيل / CSV", en: "Excel / CSV" },
  "exporter csv": { fr: "Exporter CSV", ar: "تصدير CSV", en: "Export CSV" },
  "exporter les données": { fr: "Exporter les données", ar: "تصدير البيانات", en: "Export Data" },

  // === TABLE HEADERS (EXACT MATCHES) ===
  "actions": { fr: "Actions", ar: "الإجراءات", en: "Actions" },
  "action": { fr: "Action", ar: "الإجراء", en: "Action" },
  "action rapide": { fr: "Action Rapide", ar: "إجراء سريع", en: "Quick Action" },
  "bâtiment / bloc": { fr: "Bâtiment / Bloc", ar: "العمارة / الكتلة", en: "Building / Block" },
  "capacité logements": { fr: "Capacité Logements", ar: "سعة الشقق", en: "Apartments Capacity" },
  "taux d'occupation": { fr: "Taux d'occupation", ar: "نسبة الإشغال", en: "Occupancy Rate" },
  "sous-admin responsable": { fr: "Sous-Admin Responsable", ar: "المسؤول المفوّض", en: "Assigned Sub-Admin" },
  "résident": { fr: "Résident", ar: "الساكن", en: "Resident" },
  "résidents & cotisations": { fr: "Résidents & Cotisations", ar: "الساكنون والاشتراكات", en: "Residents & Dues" },
  "nin": { fr: "NIN", ar: "رقم التعريف الوطني (NIN)", en: "National ID (NIN)" },
  "téléphone": { fr: "Téléphone", ar: "الهاتف", en: "Phone" },
  "bâtiment": { fr: "Bâtiment", ar: "العمارة", en: "Building" },
  "bâtiments": { fr: "Bâtiments", ar: "العمارات", en: "Buildings" },
  "appartement": { fr: "Appartement", ar: "الشقة", en: "Apartment" },
  "appartements": { fr: "Appartements", ar: "الشقق", en: "Apartments" },
  "logement": { fr: "Logement", ar: "الشقة / السكن", en: "Housing" },
  "logement & bâtiment": { fr: "Logement & Bâtiment", ar: "الشقة والعمارة", en: "Apartment & Building" },
  "cotisations & charges": { fr: "Cotisations & Charges", ar: "الاشتراكات والأعباء", en: "Dues & Charges" },
  "statut": { fr: "Statut", ar: "الحالة", en: "Status" },
  "ajouté le": { fr: "Ajouté le", ar: "تاريخ الإضافة", en: "Date Added" },
  "créé le": { fr: "Créé le", ar: "تاريخ الإنشاء", en: "Date Created" },
  "généré le": { fr: "Généré le", ar: "تاريخ الإنشاء", en: "Generated on" },
  "clôturée le": { fr: "Clôturée le", ar: "تاريخ الإغلاق", en: "Closed on" },
  "signalé le": { fr: "Signalé le", ar: "تاريخ البلاغ", en: "Reported on" },
  "mois impayés": { fr: "Mois impayés", ar: "أشهر التأخير", en: "Unpaid Months" },
  "dernier règlement": { fr: "Dernier règlement", ar: "آخر تسديد", en: "Last Payment" },
  "total dû": { fr: "Total dû", ar: "إجمالي المستحق", en: "Total Due" },
  "date": { fr: "Date", ar: "التاريخ", en: "Date" },
  "date début": { fr: "Date Début", ar: "تاريخ البدء", en: "Start Date" },
  "date fin": { fr: "Date Fin", ar: "تاريخ الانتهاء", en: "End Date" },
  "date & lieu": { fr: "Date & Lieu", ar: "التاريخ والمكان", en: "Date & Location" },
  "mode": { fr: "Mode", ar: "طريقة الدفع", en: "Payment Mode" },
  "mode de paiement": { fr: "Mode de paiement", ar: "طريقة الدفع", en: "Payment Method" },
  "modes de paiement": { fr: "Modes de paiement", ar: "طرق الدفع المعتمدة", en: "Payment Methods" },
  "référence": { fr: "Référence", ar: "المرجع", en: "Reference" },
  "montant": { fr: "Montant", ar: "المبلغ", en: "Amount" },
  "montant annuel": { fr: "Montant annuel", ar: "المبلغ السنوي", en: "Annual Amount" },
  "montant mensuel": { fr: "Montant mensuel", ar: "المبلغ الشهري", en: "Monthly Amount" },
  "catégorie": { fr: "Catégorie", ar: "الفئة", en: "Category" },
  "fournisseur": { fr: "Fournisseur", ar: "المورد / المزوّد", en: "Supplier / Vendor" },
  "description": { fr: "Description", ar: "الوصف", en: "Description" },
  "payé par": { fr: "Payé par", ar: "سُدد بواسطة", en: "Paid by" },
  "par": { fr: "Par", ar: "بواسطة", en: "By" },
  "organisme / service": { fr: "Organisme / Service", ar: "الهيئة / الخدمة", en: "Entity / Service" },
  "référence facture": { fr: "Référence Facture", ar: "مرجع الفاتورة", en: "Invoice Reference" },
  "période": { fr: "Période", ar: "الفترة", en: "Period" },
  "date échéance": { fr: "Date Échéance", ar: "تاريخ الاستحقاق", en: "Due Date" },
  "échéance": { fr: "Échéance", ar: "تاريخ الاستحقاق", en: "Due Date" },
  "montant dû": { fr: "Montant Dû", ar: "المبلغ المستحق", en: "Amount Due" },
  "statut paiement": { fr: "Statut Paiement", ar: "حالة الدفع", en: "Payment Status" },
  "poste budgétaire": { fr: "Poste Budgétaire", ar: "بند الميزانية", en: "Budget Item" },
  "poste de charge": { fr: "Poste de Charge", ar: "بند الأعباء", en: "Expense Item" },
  "budget prévisionnel": { fr: "Budget Prévisionnel", ar: "الميزانية التقديرية", en: "Projected Budget" },
  "réalisé à ce jour": { fr: "Réalisé à ce jour", ar: "المنفذ حتى اليوم", en: "Realized to Date" },
  "écart & réalisation": { fr: "Écart & Réalisation", ar: "الفارق ونسبة الإنجاز", en: "Variance & Realization" },
  "voté n": { fr: "Voté N", ar: "المعتمد لسنة N", en: "Approved Year N" },
  "réalisé n": { fr: "Réalisé N", ar: "المنفذ لسنة N", en: "Realized Year N" },
  "conso (%)": { fr: "Conso (%)", ar: "الاستهلاك (%)", en: "Consumption (%)" },
  "écart (dzd)": { fr: "Écart (DZD)", ar: "الفارق (د.ج)", en: "Variance (DZD)" },
  "prévisionnel n+1": { fr: "Prévisionnel N+1", ar: "التقديري لسنة N+1", en: "Projected Year N+1" },
  "justification & motivation": { fr: "Justification & Motivation", ar: "التبرير والأسباب", en: "Justification & Motivation" },
  "incident": { fr: "Incident", ar: "العطل / الحادث", en: "Incident" },
  "incident & preuve visuelle": { fr: "Incident & Preuve Visuelle", ar: "العطل والإثبات المصور", en: "Incident & Visual Proof" },
  "localisation": { fr: "Localisation", ar: "الموقع", en: "Location" },
  "date signalement": { fr: "Date Signalement", ar: "تاريخ الإبلاغ", en: "Report Date" },
  "priorité": { fr: "Priorité", ar: "الأولوية", en: "Priority" },
  "prestataire / assigné": { fr: "Prestataire / Assigné", ar: "المكلّف / المزوّد", en: "Assignee / Contractor" },
  "prestataire": { fr: "Prestataire", ar: "المزوّد / الشريك", en: "Contractor" },
  "titre & contenu": { fr: "Titre & Contenu", ar: "العنوان والمحتوى", en: "Title & Content" },
  "audience": { fr: "Audience", ar: "الجمهور المستهدف", en: "Audience" },
  "audience visée": { fr: "Audience Visée", ar: "الفئة المستهدفة", en: "Target Audience" },
  "canaux": { fr: "Canaux", ar: "قنوات النشر", en: "Channels" },
  "alerte & description": { fr: "Alerte & Description", ar: "التنبيه والوصف", en: "Alert & Description" },
  "gravité": { fr: "Gravité", ar: "درجة الخطورة", en: "Severity" },
  "session d'assemblée générale": { fr: "Session d'Assemblée Générale", ar: "جلسة الجمعية العامة", en: "General Assembly Session" },
  "quorum tantièmes": { fr: "Quorum Tantièmes", ar: "نصاب الحصص الشائعة", en: "Quorum Shares" },
  "votes / résolutions": { fr: "Votes / Résolutions", ar: "التصويت والقرارات", en: "Votes / Resolutions" },
  "résolution & ordre du jour": { fr: "Résolution & Ordre du Jour", ar: "القرار وجدول الأعمال", en: "Resolution & Agenda" },
  "résultat du vote": { fr: "Résultat du Vote", ar: "نتيجة التصويت", en: "Vote Result" },
  "majorité requise": { fr: "Majorité Requise", ar: "الأغلبية المطلوبة", en: "Required Majority" },
  "employé / prestataire": { fr: "Employé / Prestataire", ar: "الموظف / الشريك", en: "Employee / Contractor" },
  "rôle / métier": { fr: "Rôle / Métier", ar: "المهمة / المهنة", en: "Role / Trade" },
  "rôle": { fr: "Rôle", ar: "الدور", en: "Role" },
  "contact": { fr: "Contact", ar: "الاتصال", en: "Contact" },
  "affectation bâtiment": { fr: "Affectation Bâtiment", ar: "التعيين في العمارة", en: "Building Assignment" },
  "tâche": { fr: "Tâche", ar: "المهمة", en: "Task" },
  "assignée à": { fr: "Assignée à", ar: "معينة إلى", en: "Assigned to" },
  "document": { fr: "Document", ar: "الوثيقة", en: "Document" },
  "objet du contrat": { fr: "Objet du contrat", ar: "موضوع العقد", en: "Contract Subject" },
  "taille": { fr: "Taille", ar: "الحجم", en: "Size" },
  "format": { fr: "Format", ar: "الصيغة", en: "Format" },
  "rapport": { fr: "Rapport", ar: "التقرير", en: "Report" },
  "abonnement": { fr: "Abonnement", ar: "الاشتراك", en: "Subscription" },
  "formule": { fr: "Formule", ar: "الباقة", en: "Plan" },
  "prix": { fr: "Prix", ar: "السعر", en: "Price" },
  "admin responsable": { fr: "Admin Responsable", ar: "المدير المسؤول", en: "Responsible Admin" },
  "gestionnaire": { fr: "Gestionnaire", ar: "المسير", en: "Manager" },
  "répartition des tantièmes": { fr: "Répartition des Tantièmes", ar: "توزيع الحصص الشائعة", en: "Shares Distribution" },
  "étage": { fr: "Étage", ar: "الطابق", en: "Floor" },
  "étages": { fr: "Étages", ar: "طوابق", en: "Floors" },

  // === PERIOD TOOLBAR LABELS & PRESETS ===
  "période comptable": { fr: "Période comptable", ar: "الفترة المحاسبية", en: "Accounting Period" },
  "période comptable :": { fr: "Période comptable :", ar: "الفترة المحاسبية :", en: "Accounting Period:" },
  "période du registre": { fr: "Période du registre", ar: "فترة السجل", en: "Register Period" },
  "période du registre :": { fr: "Période du registre :", ar: "فترة السجل :", en: "Register Period:" },
  "période de communication": { fr: "Période de communication", ar: "فترة التواصل", en: "Communication Period" },
  "période de communication :": { fr: "Période de communication :", ar: "فترة التواصل :", en: "Communication Period:" },
  "période de maintenance": { fr: "Période de maintenance", ar: "فترة الصيانة", en: "Maintenance Period" },
  "période de maintenance :": { fr: "Période de maintenance :", ar: "فترة الصيانة :", en: "Maintenance Period:" },
  "période des assemblées": { fr: "Période des Assemblées", ar: "فترة الجمعيات", en: "Assembly Period" },
  "période des assemblées :": { fr: "Période des Assemblées :", ar: "فترة الجمعيات :", en: "Assembly Period:" },
  "période des contrats": { fr: "Période des Contrats", ar: "فترة العقود", en: "Contracts Period" },
  "période des contrats :": { fr: "Période des Contrats :", ar: "فترة العقود :", en: "Contracts Period:" },
  "ce mois": { fr: "Ce mois", ar: "هذا الشهر", en: "This month" },
  "trimestre": { fr: "Trimestre", ar: "هذا الفصل", en: "Quarter" },
  "année": { fr: "Année", ar: "هذه السنة", en: "This year" },

  // === STATUS & BADGES ===
  "actif": { fr: "Actif", ar: "نشط", en: "Active" },
  "inactif": { fr: "Inactif", ar: "غير نشط", en: "Inactive" },
  "compte actif": { fr: "Compte actif", ar: "حساب نشط", en: "Active account" },
  "compte inactif": { fr: "Compte inactif", ar: "حساب معطل", en: "Inactive account" },
  "nouveau": { fr: "Nouveau", ar: "جديد", en: "New" },
  "en cours": { fr: "En cours", ar: "قيد المعالجة", en: "In progress" },
  "clôturé": { fr: "Clôturé", ar: "مغلق", en: "Closed" },
  "payé": { fr: "Payé", ar: "مسدد", en: "Paid" },
  "payée": { fr: "Payée", ar: "مسددة", en: "Paid" },
  "en attente": { fr: "En attente", ar: "قيد الانتظار", en: "Pending" },
  "impayé": { fr: "Impayé", ar: "غير مسدد", en: "Unpaid" },
  "à jour": { fr: "À jour", ar: "مستوفى", en: "Up to date" },
  "à jour (payé)": { fr: "À jour (Payé)", ar: "مستوفى (مسدد)", en: "Up to date (Paid)" },
  "propriétaire": { fr: "Propriétaire", ar: "مالك", en: "Owner" },
  "locataire": { fr: "Locataire", ar: "مستأجر", en: "Tenant" },
  "occupant / propriétaire": { fr: "Occupant / Propriétaire", ar: "الشاغل / المالك", en: "Occupant / Owner" },
  "non assigné": { fr: "Non assigné", ar: "غير معين", en: "Unassigned" },
  "non délégué": { fr: "Non délégué", ar: "غير مفوّض", en: "Not delegated" },
  "occupés": { fr: "occupés", ar: "مشغولة", en: "occupied" },
  "max": { fr: "max", ar: "أقصى", en: "max" },
  "haute": { fr: "Haute", ar: "عالية", en: "High" },
  "moyenne": { fr: "Moyenne", ar: "متوسطة", en: "Medium" },
  "basse": { fr: "Basse", ar: "منخفضة", en: "Low" },
  "urgente": { fr: "Urgente", ar: "عاجلة جداً", en: "Urgent" },
  "critique": { fr: "Critique", ar: "حرج", en: "Critical" },
  "attention": { fr: "Attention", ar: "تنبيه", en: "Warning" },
  "information": { fr: "Information", ar: "معلومة", en: "Information" },
  "application": { fr: "Application", ar: "التطبيق", en: "Application" },
  "affichage": { fr: "Affichage", ar: "لوحة الإعلانات", en: "Display Board" },
  "planifiée": { fr: "Planifiée", ar: "مجدولة", en: "Scheduled" },
  "expiré": { fr: "Expiré", ar: "منتهي", en: "Expired" },
  "expirés": { fr: "Expirés", ar: "منتهية", en: "Expired" },
  "expire bientôt": { fr: "Expire bientôt", ar: "ينتهي قريباً", en: "Expiring soon" },

  // === FILTER OPTIONS ===
  "tous les résidents": { fr: "Tous les résidents", ar: "جميع الساكنين", en: "All residents" },
  "à jour (cotisations payées)": { fr: "À jour (Cotisations payées)", ar: "مستوفى (مسدد بالكامل)", en: "Up to date (Paid)" },
  "cotisations impayées": { fr: "Cotisations impayées", ar: "اشتراكات متأخرة", en: "Unpaid dues" },
  "tous les impayés": { fr: "Tous les impayés", ar: "جميع المتأخرات", en: "All unpaid" },
  "critique (3+ mois)": { fr: "Critique (3+ mois)", ar: "حرج (3 أشهر فأكثر)", en: "Critical (3+ months)" },
  "récent (1-2 mois)": { fr: "Récent (1-2 mois)", ar: "حديث (1-2 شهر)", en: "Recent (1-2 months)" },
  "tous les paiements": { fr: "Tous les paiements", ar: "جميع المدفوعات", en: "All payments" },
  "edahabia / cib": { fr: "Edahabia / CIB", ar: "البطاقة الذهبية / CIB", en: "Edahabia / CIB" },
  "espèces / ccp / chèque": { fr: "Espèces / CCP / Chèque", ar: "نقداً / بريد / صك", en: "Cash / Postal / Check" },
  "espèces / ccp": { fr: "Espèces / CCP", ar: "نقداً / حساب بريدي", en: "Cash / CCP" },
  "tous les contrats": { fr: "Tous les contrats", ar: "جميع العقود", en: "All contracts" },
  "tous les documents": { fr: "Tous les documents", ar: "جميع الوثائق", en: "All documents" },
  "toutes les résidences": { fr: "Toutes les résidences", ar: "جميع الإقامات", en: "All residences" },

  // === TABS ===
  "impayés & recouvrement": { fr: "Impayés & Recouvrement", ar: "المتأخرات والتحصيل", en: "Unpaid & Recovery" },
  "journal des paiements": { fr: "Journal des Paiements", ar: "سجل المدفوعات", en: "Payment Journal" },
  "dépenses résidence": { fr: "Dépenses Résidence", ar: "مصاريف الإقامة", en: "Residence Expenses" },
  "factures services & sonelgaz": { fr: "Factures Services & Sonelgaz", ar: "فواتير الخدمات وسونلغاز", en: "Utility & Service Bills" },
  "budget & bilan annuel": { fr: "Budget & Bilan Annuel", ar: "الميزانية والتقرير السنوي", en: "Budget & Annual Report" },
  "bâtiments & blocs": { fr: "Bâtiments & Blocs", ar: "العمارات والكتل", en: "Buildings & Blocks" },
  "sous-admins (gestionnaires)": { fr: "Sous-Admins (Gestionnaires)", ar: "المسؤولون المفوّضون", en: "Sub-Admins (Managers)" },
  "abonnements sous-admins": { fr: "Abonnements Sous-Admins", ar: "اشتراكات المفوّضين", en: "Sub-Admin Subscriptions" },
  "ma résidence": { fr: "Ma Résidence", ar: "إقامتي", en: "My Residence" },
  "incidents actifs": { fr: "Incidents actifs", ar: "الأعطال الجارية", en: "Active Incidents" },
  "pannes d'équipement": { fr: "Pannes d'équipement", ar: "أعطال التجهيزات", en: "Equipment Failures" },
  "historique": { fr: "Historique", ar: "السجل التاريخي", en: "History" },
  "annonces publiées": { fr: "Annonces publiées", ar: "الإعلانات المنشورة", en: "Published Announcements" },
  "alertes d'urgence": { fr: "Alertes d'urgence", ar: "تنبيهات الطوارئ", en: "Emergency Alerts" },
  "sessions d'ag & convocations": { fr: "Sessions d'AG & Convocations", ar: "جلسات الجمعية والاستدعاءات", en: "GA Sessions & Notices" },
  "votes des résolutions": { fr: "Votes des Résolutions", ar: "التصويت على القرارات", en: "Resolutions Voting" },
  "personnel & employés": { fr: "Personnel & Employés", ar: "الموظفون والعمال", en: "Staff & Employees" },
  "tâches opérationnelles": { fr: "Tâches Opérationnelles", ar: "المهام الميدانية", en: "Operational Tasks" },
  "contrats prestataires": { fr: "Contrats prestataires", ar: "عقود الشركاء", en: "Contractor Contracts" },
  "coffre-fort & documents": { fr: "Coffre-fort & Documents", ar: "الخزينة والوثائق", en: "Vault & Documents" },

  // === KPI CARDS ===
  "trésorerie disponible": { fr: "Trésorerie Disponible", ar: "السيولة المتاحة في الصندوق", en: "Available Treasury" },
  "taux de recouvrement": { fr: "Taux de Recouvrement", ar: "نسبة التحصيل", en: "Recovery Rate" },
  "total créances & impayés": { fr: "Total Créances & Impayés", ar: "إجمالي الديون والمتأخرات", en: "Total Debt & Unpaid" },
  "impayés cumulés": { fr: "Impayés Cumulés", ar: "المتأخرات المتراكمة", en: "Accumulated Unpaid" },
  "pannes en cours": { fr: "Pannes en Cours", ar: "الأعطال الجارية", en: "Active Breakdowns" },
  "résidents enregistrés": { fr: "Résidents Enregistrés", ar: "الساكنون المسجلون", en: "Registered Residents" },
  "appartements occupés": { fr: "Appartements Occupés", ar: "الشقق المشغولة", en: "Occupied Apartments" },
  "interventions clôturées": { fr: "Interventions clôturées", ar: "التدخلات المنجزة", en: "Closed Interventions" },
  "disponibilité équipements": { fr: "Disponibilité équipements", ar: "جاهزية التجهيزات", en: "Equipment Availability" },
  "prochaine ag planifiée": { fr: "Prochaine AG Planifiée", ar: "الجمعية العامة القادمة", en: "Next Planned GA" },
  "quorum des tantièmes": { fr: "Quorum des Tantièmes", ar: "نصاب الحصص الشائعة", en: "Shares Quorum" },
  "résolutions adoptées": { fr: "Résolutions Adoptées", ar: "القرارات المعتمدة", en: "Adopted Resolutions" },
  "feuille d'émargement": { fr: "Feuille d'émargement", ar: "ورقة الحضور والتوقيع", en: "Attendance Sheet" },
  "contrats actifs": { fr: "Contrats Actifs", ar: "العقود السارية", en: "Active Contracts" },
  "budget annuel engagé": { fr: "Budget Annuel Engagé", ar: "الميزانية السنوية الملتزم بها", en: "Committed Annual Budget" },
  "échéances & renouvellements": { fr: "Échéances & Renouvellements", ar: "المواعيد والتجديد", en: "Due Dates & Renewals" },
  "coffre-fort numérique": { fr: "Coffre-fort Numérique", ar: "الخزينة الرقمية الموثقة", en: "Digital Vault" },

  // === FLOATING & EMERGENCY BUTTONS ===
  "urgences 24/7": { fr: "Urgences 24/7", ar: "طوارئ 24/7", en: "Emergency 24/7" },
  "numéros d'urgence & astreinte 24h/24": { fr: "Numéros d'urgence & astreinte 24h/24", ar: "أرقام الطوارئ والمداومة 24/24", en: "Emergency numbers 24/7" },

  // === QUITTANCE MODAL ===
  "quittance de cotisation & charges": { fr: "Quittance de Cotisation & Charges", ar: "وصل مخالصة الاشتراكات والأعباء", en: "Receipt for Dues & Charges" },
  "reçu d'encaissement officiel pour le copropriétaire ou locataire.": {
    fr: "Reçu d'encaissement officiel pour le copropriétaire ou locataire.",
    ar: "وصل تسديد رسمي معتمد للمالك أو المستأجر.",
    en: "Official receipt of payment for owner or tenant."
  },
  "acquitté": { fr: "ACQUITTÉ", ar: "تم التسديد (مخالصة)", en: "PAID IN FULL" },
  "réf :": { fr: "Réf :", ar: "المرجع :", en: "Ref:" },
  "copropriétaire / résident": { fr: "Copropriétaire / Résident", ar: "المالك الشريك / الساكن", en: "Co-owner / Resident" },
  "logement assigné": { fr: "Logement Assigné", ar: "الشقة المخصصة", en: "Assigned Apartment" },
  "charges communes & entretien": { fr: "Charges communes & entretien", ar: "الأعباء المشتركة والصيانة العامة", en: "Common charges & maintenance" },
  "désignation": { fr: "Désignation", ar: "البيان", en: "Description" },
  "date d'encaissement": { fr: "Date d'encaissement", ar: "تاريخ القبض", en: "Payment Date" },
  "montant réglé": { fr: "Montant Réglé", ar: "المبلغ المسدد", en: "Amount Paid" },
  "charges de copropriété": { fr: "Charges de Copropriété", ar: "أعباء الملكية المشتركة", en: "Condominium Charges" },
  "encaissé par :": { fr: "Encaissé par :", ar: "قُبض من قِبل :", en: "Received by:" },
  "administration du syndic": { fr: "Administration du Syndic", ar: "إدارة الوكيل العقاري", en: "Syndic Administration" },
  "document officiel tenant lieu de reçu de paiement.": {
    fr: "Document officiel tenant lieu de reçu de paiement.",
    ar: "وثيقة رسمية تقوم مقام وصل مخالصة قانوني.",
    en: "Official document serving as proof of payment."
  },

  // === RECOVERY / MISE EN DEMEURE MODAL ===
  "recouvrement & relance officielle": { fr: "Recouvrement & Relance Officielle", ar: "التحصيل والإعذار الرسمي", en: "Recovery & Official Notice" },
  "génération de relance amiable, avertissement ou mise en demeure officielle avec sommation de payer.": {
    fr: "Génération de relance amiable, avertissement ou mise en demeure officielle avec sommation de payer.",
    ar: "إصدار تذكير ودي، إنذار رسمي أو إعذار قانوني مع تكليف بالوفاء.",
    en: "Generation of friendly reminder, warning or official legal notice with order to pay."
  },
  "1. rappel amiable": { fr: "1. Rappel Amiable", ar: "1. تذكير ودي", en: "1. Friendly Reminder" },
  "2. avertissement": { fr: "2. Avertissement", ar: "2. إنذار رسمي", en: "2. Formal Warning" },
  "3. mise en demeure (15j)": { fr: "3. Mise en Demeure (15j)", ar: "3. إعذار قانوني (15 يوماً)", en: "3. Legal Notice (15 days)" },

  // === RESIDENT MODAL & FORMS ===
  "ajouter un résident": { fr: "Ajouter un résident", ar: "إضافة ساكن جديد", en: "Add a resident" },
  "informations du résident": { fr: "INFORMATIONS DU RÉSIDENT", ar: "معلومات الساكن", en: "RESIDENT INFORMATION" },
  "accès à l'application mobile": { fr: "ACCÈS À L'APPLICATION MOBILE", ar: "الوصول إلى تطبيق الهاتف", en: "MOBILE APP ACCESS" },
  "résidence": { fr: "Résidence", ar: "الإقامة", en: "Residence" },
  "nom / numéro de l'appartement": { fr: "Nom / numéro de l'appartement", ar: "رقم أو اسم الشقة", en: "Apartment number / name" },
  "prénom": { fr: "Prénom", ar: "الاسم", en: "First name" },
  "nom": { fr: "Nom", ar: "اللقب", en: "Last name" },
  "mot de passe initial": { fr: "Mot de passe initial", ar: "كلمة المرور الأولية", en: "Initial password" },
  "ajouter le résident": { fr: "Ajouter le résident", ar: "إضافة الساكن", en: "Add Resident" },
  "enregistrement...": { fr: "Enregistrement...", ar: "جارٍ الحفظ...", en: "Saving..." },
  "entrez ou générez un mot de passe": { fr: "Entrez ou générez un mot de passe", ar: "أدخل أو ولد كلمة مرور", en: "Enter or generate a password" },

  // === ACCESS CREATED MODAL ===
  "accès résident créé !": { fr: "Accès résident créé !", ar: "تم إنشاء حساب الساكن بنجاح!", en: "Resident access created!" },
  "le compte du résident est prêt. transmettez-lui ces identifiants pour qu'il puisse se connecter à l'application mobile.": {
    fr: "Le compte du résident est prêt. Transmettez-lui ces identifiants pour qu'il puisse se connecter à l'application mobile.",
    ar: "تم تجهيز حساب الساكن بنجاح. أرسل له هذه البيانات لتسجيل الدخول إلى تطبيق الهاتف.",
    en: "The resident account is ready. Send them these credentials to sign in to the mobile app."
  },
  "email de connexion": { fr: "EMAIL DE CONNEXION", ar: "البريد الإلكتروني لتسجيل الدخول", en: "LOGIN EMAIL" },
  "copier les identifiants (whatsapp / sms)": { fr: "Copier les identifiants (WhatsApp / SMS)", ar: "نسخ بيانات الدخول (واتساب / رسالة)", en: "Copy credentials (WhatsApp / SMS)" },

  // === RESIDENCE MODAL & ACTIONS ===
  "ajouter un bâtiment": { fr: "Ajouter un bâtiment", ar: "إضافة عمارة جديدة", en: "Add building" },
  "nouvelle résidence": { fr: "Nouvelle Résidence", ar: "إقامة جديدة", en: "New Residence" },
  "modifier bâtiment": { fr: "Modifier Bâtiment", ar: "تعديل العمارة", en: "Edit Building" },
  "supprimer bâtiment": { fr: "Supprimer Bâtiment", ar: "حذف العمارة", en: "Delete Building" },
  "modifier résident": { fr: "Modifier résident", ar: "تعديل بيانات الساكن", en: "Edit resident" },
  "supprimer résident": { fr: "Supprimer résident", ar: "حذف الساكن", en: "Delete resident" },
  "supprimer paiement": { fr: "Supprimer paiement", ar: "حذف الدفعة", en: "Delete payment" },
  "enregistrer paiement": { fr: "Enregistrer Paiement", ar: "تسجيل دفعة جديدة", en: "Record Payment" },
  "générer les charges": { fr: "Générer les Appels de Charges", ar: "إصدار أعباء الشهر", en: "Generate Dues Calls" },
  "convoquer une ag": { fr: "Convoquer une AG", ar: "الدعوة لجمعية عامة", en: "Convene GA" },
  "nouvelle résolution": { fr: "Nouvelle Résolution", ar: "قرار جديد", en: "New Resolution" },
  "pv d'ag officiel": { fr: "PV d'AG Officiel", ar: "محضر الجمعية العامة الرسمي", en: "Official GA Minutes" },
  "nouveau contrat prestataire": { fr: "Nouveau Contrat Prestataire", ar: "عقد شريك جديد", en: "New Contractor Agreement" },
  "signaler un incident": { fr: "Signaler un incident", ar: "الإبلاغ عن عطل", en: "Report an incident" },
  "nouvelle annonce": { fr: "Nouvelle Annonce", ar: "إعلان جديد", en: "New Announcement" },
  "diffuser alerte": { fr: "Diffuser Alerte", ar: "نشر تنبيه عاجل", en: "Broadcast Alert" },

  // === FLOATING / OVERVIEW TEXTS ===
  "syndic de copropriété · espace administrateur général": {
    fr: "SYNDIC DE COPROPRIÉTÉ · ESPACE ADMINISTRATEUR GÉNÉRAL",
    ar: "الوكيل العقاري وإدارة الإقامة · لوحة التحكم العامة",
    en: "CONDOMINIUM SYNDIC · GENERAL ADMINISTRATOR SPACE"
  },
  "hub des 10 modules de gestion résidence": {
    fr: "Hub des 10 Modules de Gestion Résidence",
    ar: "مركز الوحدات العشر لإدارة الإقامة",
    en: "10-Module Residence Management Hub"
  },
  "supervision globale et accès direct à l'ensemble des pages du syndic": {
    fr: "Supervision globale et accès direct à l'ensemble des pages du Syndic",
    ar: "إشراف شامل ووصول مباشر لجميع صفحات ومهام الوكيل العقاري",
    en: "Global supervision and direct access to all syndic pages"
  },
  "ruban d'alertes intelligentes du syndic": {
    fr: "RUBAN D'ALERTES INTELLIGENTES DU SYNDIC",
    ar: "شريط التنبيهات الذكية للوكيل العقاري",
    en: "SYNDIC SMART ALERTS BANNER"
  },
  "replier": { fr: "Replier", ar: "طي الشريط", en: "Collapse" },
  "masquer le ruban pour cette session": { fr: "Masquer le ruban pour cette session", ar: "إخفاء الشريط لهذه الجلسة", en: "Hide banner for this session" },
  "accéder à l'ag & votes": { fr: "Accéder à l'AG & Votes", ar: "الانتقال إلى الجمعية العامة والتصويت", en: "Access GA & Votes" },

  // === EMPTY STATES ===
  "aucun élément à afficher.": { fr: "Aucun élément à afficher.", ar: "لا توجد عناصر لعرضها.", en: "No items to display." },
  "aucun résultat trouvé": { fr: "Aucun résultat trouvé", ar: "لم يتم العثور على أي نتيجة", en: "No results found" },
  "aucun contrat de prestataire ne correspond aux critères sélectionnés.": {
    fr: "Aucun contrat de prestataire ne correspond aux critères sélectionnés.",
    ar: "لا يوجد أي عقد شريك يطابق المعايير المحددة.",
    en: "No contractor agreements match the selected criteria."
  },
  "aucun incident ou panne enregistrée pour cette période.": {
    fr: "Aucun incident ou panne enregistrée pour cette période.",
    ar: "لا توجد أي أعطال مسجلة خلال هذه الفترة.",
    en: "No incidents or breakdowns recorded for this period."
  },

  // === LOGIN PAGE ===
  "sign in": { fr: "Se connecter", ar: "تسجيل الدخول", en: "Sign in" },
  "enter your details to access your account.": {
    fr: "Saisissez vos identifiants pour accéder à votre espace.",
    ar: "أدخل بياناتك للوصول إلى حسابك.",
    en: "Enter your details to access your account."
  },
  "email address": { fr: "Adresse email", ar: "البريد الإلكتروني", en: "Email address" },
  "password": { fr: "Mot de passe", ar: "كلمة المرور", en: "Password" },
  "enter your password": { fr: "Entrez votre mot de passe", ar: "أدخل كلمة المرور", en: "Enter your password" },
  "signing in...": { fr: "Connexion en cours...", ar: "جارٍ تسجيل الدخول...", en: "Signing in..." },
  "build a better city, together.": {
    fr: "Bâtissons une gestion immobilière d'excellence, ensemble.",
    ar: "معاً نبني مدناً وإقامات راقية ومتكاملة.",
    en: "Build a better city, together."
  },
  "one secure place to manage everything that keeps the city moving.": {
    fr: "Une plateforme unifiée et sécurisée pour gérer l'ensemble de votre copropriété.",
    ar: "منصة آمنة وموحدة لإدارة العقارات، الاشتراكات، والصيانة باحترافية.",
    en: "One secure place to manage everything that keeps the city moving."
  },
  "all rights reserved.": { fr: "Tous droits réservés.", ar: "جميع الحقوق محفوظة.", en: "All rights reserved." },

  // === ROLES ===
  "super admin": { fr: "Super Admin", ar: "مشرف عام", en: "Super Admin" },
  "admin": { fr: "Admin", ar: "مدير الإقامة", en: "Admin" },
  "sub admin": { fr: "Sous-Admin", ar: "مسؤول مفوّض", en: "Sub Admin" },
  "sous admin": { fr: "Sous-Admin", ar: "مسؤول مفوّض", en: "Sub Admin" },
  "sous-admin": { fr: "Sous-Admin", ar: "مسؤول مفوّض", en: "Sub Admin" },

  // === QUICK ACTIONS IN HEADER ===
  "ajouter une résidence": { fr: "Ajouter une résidence", ar: "إضافة إقامة جديدة", en: "Add Residence" },
  "attribuer un abonnement": { fr: "Attribuer un abonnement", ar: "منح اشتراك", en: "Assign Subscription" },
  "nouveau super admin": { fr: "Nouveau Super Admin", ar: "مشرف عام جديد", en: "New Super Admin" },
  "nouveau bâtiment": { fr: "Nouveau bâtiment", ar: "عمارة جديدة", en: "New Building" },
  "encaisser un paiement": { fr: "Encaisser un paiement", ar: "قبض دفعة", en: "Collect Payment" },
  "publier une annonce": { fr: "Publier une annonce", ar: "نشر إعلان", en: "Publish Announcement" },

  // === COMMAND PALETTE & NAVIGATION ===
  "navigation": { fr: "Navigation", ar: "التنقل", en: "Navigation" },
  "actions rapides": { fr: "Actions Rapides", ar: "إجراءات سريعة", en: "Quick Actions" },
  "copropriétaires & lots": { fr: "Copropriétaires & Lots", ar: "الملاك الشركاء والحصص", en: "Co-owners & Lots" },
  "tableau de bord": { fr: "Tableau de bord", ar: "لوحة التحكم", en: "Dashboard" },
  "vue d'ensemble et indicateurs clés": { fr: "Vue d'ensemble et indicateurs clés", ar: "نظرة عامة والمؤشرات الرئيسية", en: "Overview and key indicators" },
  "numéros d'urgence 24h/24": { fr: "Numéros d'urgence 24h/24", ar: "أرقام الطوارئ 24/24", en: "Emergency Numbers 24/7" },
  "rechercher une page, un résident, un appartement ou une action...": {
    fr: "Rechercher une page, un résident, un appartement ou une action...",
    ar: "ابحث عن صفحة، ساكن، شقة أو إجراء...",
    en: "Search for a page, resident, apartment, or action..."
  },
  "essayez avec un autre mot-clé (ex: « finances », « ascenseur », « amrani »...)": {
    fr: "Essayez avec un autre mot-clé (ex: « finances », « ascenseur », « amrani »...)",
    ar: "جرب كلمة بحث أخرى (مثال: « المالية »، « المصعد »، « عمراني »...)",
    en: "Try another keyword (e.g. \"finances\", \"elevator\", \"amrani\"...)"
  },
  "échap": { fr: "Échap", ar: "خروج", en: "Esc" },
  "naviguer": { fr: "Naviguer", ar: "تنقل", en: "Navigate" },
  "ouvrir": { fr: "Ouvrir", ar: "فتح", en: "Open" },

  // === RESIDENCES & MANAGEMENT ===
  "ajouter résidence": { fr: "Ajouter Résidence", ar: "إضافة إقامة", en: "Add Residence" },
  "créer les résidences et leurs bâtiments, puis nommez l'admin responsable de chaque résidence et le sub admin de chaque bâtiment.": {
    fr: "Créez les résidences et leurs bâtiments, puis nommez l'Admin responsable de chaque résidence et le Sub Admin de chaque bâtiment.",
    ar: "أنشئ الإقامات وعماراتها، ثم عيّن المدير المسؤول عن كل إقامة والمسؤول المفوّض لكل عمارة.",
    en: "Create residences and buildings, then assign the responsible Admin for each residence and Sub Admin for each building."
  },
  "créer la première résidence": { fr: "Créer la première résidence", ar: "إنشاء أول إقامة", en: "Create first residence" },
  "aucune résidence pour le moment": { fr: "Aucune résidence pour le moment", ar: "لا توجد أي إقامة حالياً", en: "No residences yet" },
  "commencez par créer une résidence. vous pourrez ensuite y ajouter des bâtiments et nommer les responsables.": {
    fr: "Commencez par créer une résidence. Vous pourrez ensuite y ajouter des bâtiments et nommer les responsables.",
    ar: "ابدأ بإنشاء إقامة. ستتمكن بعدها من إضافة العمارات وتعيين المسؤولين.",
    en: "Start by creating a residence. You can then add buildings and appoint managers."
  },
  "filtrer résidences...": { fr: "Filtrer résidences...", ar: "تصفية الإقامات...", en: "Filter residences..." },
  "sans admin": { fr: "Sans admin", ar: "بدون مدير", en: "Without admin" },
  "créer l'admin": { fr: "Créer l'admin", ar: "تعيين المدير", en: "Create Admin" },
  "modifier compte": { fr: "Modifier compte", ar: "تعديل الحساب", en: "Edit account" },
  "supprimer compte": { fr: "Supprimer compte", ar: "حذف الحساب", en: "Delete account" },
  "nom de la résidence": { fr: "Nom de la résidence", ar: "اسم الإقامة", en: "Residence name" },
  "localisation / adresse": { fr: "Localisation / adresse", ar: "الموقع / العنوان", en: "Location / address" },
  "nombre d'étages": { fr: "Nombre d'étages", ar: "عدد الطوابق", en: "Number of floors" },
  "nombre de logements": { fr: "Nombre de logements", ar: "عدد الشقق", en: "Number of units" },
  "nom du bâtiment": { fr: "Nom du bâtiment", ar: "اسم العمارة", en: "Building name" },

  // === ABONNEMENTS (SUBSCRIPTIONS) ===
  "gestion abonnements (plateforme)": { fr: "Gestion Abonnements (Plateforme)", ar: "إدارة الاشتراكات (المنصة)", en: "Subscription Management (Platform)" },
  "contrôlez les abonnements et paiements des administrateurs et sous-administrateurs de l'ensemble des résidences.": {
    fr: "Contrôlez les abonnements et paiements des Administrateurs et Sous-Administrateurs de l'ensemble des résidences.",
    ar: "متابعة وإدارة اشتراكات ومدفوعات المديرين والمسؤولين المفوّضين في كافة الإقامات.",
    en: "Manage subscriptions and payments for Admins and Sub-Admins across all residences."
  },
  "nouvelle formule": { fr: "Nouvelle formule", ar: "باقة جديدة", en: "New Plan" },
  "nouvelle formule d'abonnement": { fr: "Nouvelle formule d'abonnement", ar: "باقة اشتراك جديدة", en: "New Subscription Plan" },
  "créer la formule": { fr: "Créer la formule", ar: "إنشاء الباقة", en: "Create Plan" },
  "nom de la formule": { fr: "Nom de la formule", ar: "اسم الباقة", en: "Plan Name" },
  "cible de la formule": { fr: "Cible de la formule", ar: "الفئة المستهدفة للباقة", en: "Plan Target" },
  "durée standard (mois)": { fr: "Durée standard (mois)", ar: "المدة القياسية (بالأشهر)", en: "Standard duration (months)" },
  "durée standard : 12 mois (1 an) avec options de paiement flexibles.": {
    fr: "Durée standard : 12 mois (1 an) avec options de paiement flexibles.",
    ar: "المدة القياسية: 12 شهراً (سنة) مع خيارات دفع مرنة.",
    en: "Standard duration: 12 months (1 year) with flexible payment options."
  },
  "administrateur (résidence entière)": { fr: "Administrateur (Résidence entière)", ar: "مدير (كامل الإقامة)", en: "Administrator (Whole residence)" },
  "sous-administrateur (bâtiment)": { fr: "Sous-Administrateur (Bâtiment)", ar: "مسؤول مفوّض (عمارة)", en: "Sub-Admin (Building)" },
  "tous les admins": { fr: "Tous les admins", ar: "جميع المديرين", en: "All Admins" },
  "accès actif (payé)": { fr: "Accès Actif (Payé)", ar: "حساب نشط (مسدد)", en: "Active Access (Paid)" },
  "accès bloqué (impayé)": { fr: "Accès Bloqué (Impayé)", ar: "حساب محجوب (غير مسدد)", en: "Blocked Access (Unpaid)" },
  "tous les sous-admins": { fr: "Tous les sous-admins", ar: "جميع المسؤولين المفوّضين", en: "All Sub-Admins" },
  "période souscriptions": { fr: "Période souscriptions", ar: "فترة الاشتراكات", en: "Subscription Period" },
  "période souscriptions :": { fr: "Période souscriptions :", ar: "فترة الاشتراكات :", en: "Subscription Period:" },
  "supprimer la formule ?": { fr: "Supprimer la formule ?", ar: "حذف الباقة؟", en: "Delete plan?" },
  "supprimer la souscription ?": { fr: "Supprimer la souscription ?", ar: "حذف الاشتراك؟", en: "Delete subscription?" },
  "supprimer définitivement": { fr: "Supprimer définitivement", ar: "حذف نهائي", en: "Delete permanently" },
  "mise à jour...": { fr: "Mise à jour...", ar: "جارٍ التحديث...", en: "Updating..." },
  "aucune formule enregistrée. créez la première pour commencer à abonner des admins ou sous-admins.": {
    fr: "Aucune formule enregistrée. Créez la première pour commencer à abonner des admins ou sous-admins.",
    ar: "لا توجد أي باقة مسجلة. أنشئ الأولى للبدء في تفعيل اشتراكات المديرين والمفوّضين.",
    en: "No plans recorded. Create the first one to start subscribing admins or sub-admins."
  },
  "aucun administrateur ne correspond aux critères sélectionnés.": {
    fr: "Aucun administrateur ne correspond aux critères sélectionnés.",
    ar: "لا يوجد أي مدير يطابق المعايير المحددة.",
    en: "No administrators match the selected criteria."
  },
  "aucun sous-administrateur ne correspond aux critères sélectionnés.": {
    fr: "Aucun sous-administrateur ne correspond aux critères sélectionnés.",
    ar: "لا يوجد أي مسؤول مفوّض يطابق المعايير المحددة.",
    en: "No sub-administrators match the selected criteria."
  },
  "12 caractères minimum. transmettez-le à la personne de façon sécurisée.": {
    fr: "12 caractères minimum. Transmettez-le à la personne de façon sécurisée.",
    ar: "12 حرفاً على الأقل. أرسله للمعني بطريقة آمنة.",
    en: "12 characters minimum. Send it securely to the recipient."
  },

  // === MESSAGES & ERRORS ===
  "could not reach the server. please try again.": {
    fr: "Impossible de joindre le serveur. Veuillez réessayer.",
    ar: "تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
    en: "Could not reach the server. Please try again."
  },
  "please enter a valid email and password.": {
    fr: "Veuillez entrer une adresse email et un mot de passe valides.",
    ar: "يرجى إدخال بريد إلكتروني وكلمة مرور صحيحة.",
    en: "Please enter a valid email and password."
  },
  "too many attempts. please wait a minute and try again.": {
    fr: "Trop de tentatives. Veuillez patienter une minute et réessayer.",
    ar: "محاولات كثيرة جداً. يرجى الانتظار دقيقة ثم المحاولة مجدداً.",
    en: "Too many attempts. Please wait a minute and try again."
  },
  "certains champs sont invalides.": {
    fr: "Certains champs sont invalides.",
    ar: "بعض الحقول غير صالحة.",
    en: "Some fields are invalid."
  },
  "action réservée au super admin.": {
    fr: "Action réservée au Super Admin.",
    ar: "هذا الإجراء مخصص للمشرف العام فقط.",
    en: "Action reserved for Super Admin."
  },
  "trop de requêtes. réessayez dans une minute.": {
    fr: "Trop de requêtes. Réessayez dans une minute.",
    ar: "طلبات كثيرة جداً. يرجى إعادة المحاولة بعد دقيقة.",
    en: "Too many requests. Try again in a minute."
  },
  "serveur injoignable. vérifiez votre connexion.": {
    fr: "Serveur injoignable. Vérifiez votre connexion.",
    ar: "تعذر الوصول إلى الخادم. تحقق من اتصالك بالإنترنت.",
    en: "Server unreachable. Check your connection."
  },

  // === SEARCH PLACEHOLDERS & EMPTY STATES ===
  "abonnements admins": { fr: "Abonnements Admins", ar: "اشتراكات المديرين", en: "Admin Subscriptions" },
  "formules": { fr: "Formules", ar: "باقات الاشتراكات", en: "Subscription Plans" },
  "aucun impayé : tous les logements sont à jour de leurs cotisations.": {
    fr: "Aucun impayé : tous les logements sont à jour de leurs cotisations.",
    ar: "لا توجد أي متأخرات : جميع الشقق مسددة لاشتراكاتها بانتظام.",
    en: "No unpaid dues: all units are up to date with their fees."
  },
  "aucun bâtiment ne correspond à votre recherche.": {
    fr: "Aucun bâtiment ne correspond à votre recherche.",
    ar: "لا توجد أي عمارة تطابق معايير البحث.",
    en: "No buildings match your search."
  },
  "rechercher un bâtiment ou sous-admin...": {
    fr: "Rechercher un bâtiment ou sous-admin...",
    ar: "البحث عن عمارة أو مسؤول مفوّض...",
    en: "Search building or sub-admin..."
  },
  "rechercher contrat, prestataire...": {
    fr: "Rechercher contrat, prestataire...",
    ar: "البحث عن عقد، شريك...",
    en: "Search contract, contractor..."
  },
  "rechercher document, catégorie...": {
    fr: "Rechercher document, catégorie...",
    ar: "البحث عن وثيقة، فئة...",
    en: "Search document, category..."
  },
  "modifier incident": { fr: "Modifier incident", ar: "تعديل العطل", en: "Edit incident" },
  "supprimer incident": { fr: "Supprimer incident", ar: "حذف العطل", en: "Delete incident" },
  "modifier tâche": { fr: "Modifier tâche", ar: "تعديل المهمة", en: "Edit task" },
  "supprimer tâche": { fr: "Supprimer tâche", ar: "حذف المهمة", en: "Delete task" },

  // === BATCH AUDIT ADDITIONS ===
  "direction plateforme saas": {
    fr: "Direction Plateforme SaaS",
    ar: "إدارة منصة SaaS",
    en: "SaaS Platform Management"
  },
  "supervision 360° du parc multi-résidences, des formules d'abonnement annuelles (1 an standard avec paiement flexible), des copropriétaires, du personnel et de la comptabilité générale.": {
    fr: "Supervision 360° du parc multi-résidences, des formules d'abonnement annuelles (1 an standard avec paiement flexible), des copropriétaires, du personnel et de la comptabilité générale.",
    ar: "إشراف شامل 360° على مجمعات الإقامات، باقات الاشتراكات السنوية (سنة قياسية بدفع مرن)، الملاك المشتركين، الموظفين والمحاسبة العامة.",
    en: "360° supervision of multi-residence properties, annual subscription plans (1 year standard with flexible payment), co-owners, staff, and general accounting."
  },
  "connecté en tant que": {
    fr: "Connecté en tant que",
    ar: "متصل بصفتك",
    en: "Signed in as"
  },
  "accès maître plateforme actif": {
    fr: "Accès Maître Plateforme Actif",
    ar: "صلاحية الوصول الرئيسية للمنصة نشطة",
    en: "Platform Master Access Active"
  },
  "rapports consolidés": {
    fr: "Rapports Consolidés",
    ar: "تقارير موحدة",
    en: "Consolidated Reports"
  },
  "formules & tarifs": {
    fr: "Formules & Tarifs",
    ar: "الباقات والأسعار",
    en: "Plans & Pricing"
  },
  "résidences & bâtiments": {
    fr: "Résidences & Bâtiments",
    ar: "الإقامات والعمارات",
    en: "Residences & Buildings"
  },
  "responsables & syndics": {
    fr: "Responsables & Syndics",
    ar: "المسؤولون والوكلاء",
    en: "Managers & Syndics"
  },
  "abonnements actifs (1 an)": {
    fr: "Abonnements Actifs (1 an)",
    ar: "الاشتراكات النشطة (سنة واحدة)",
    en: "Active Subscriptions (1 yr)"
  },
  "revenus consolidés plateforme": {
    fr: "Revenus Consolidés Plateforme",
    ar: "الإيرادات الموحدة للمنصة",
    en: "Consolidated Platform Revenue"
  },
  "création des complexes, plafonds de bâtiments et affectation des administrateurs principaux.": {
    fr: "Création des complexes, plafonds de bâtiments et affectation des administrateurs principaux.",
    ar: "إنشاء المجمعات، تحديد سقف العمارات وتعيين المديرين الرئيسيين.",
    en: "Creation of complexes, building ceilings, and assignment of primary administrators."
  },
  "validation des paiements annuels (1 an standard, flexible), formules admin et sous-admin.": {
    fr: "Validation des paiements annuels (1 an standard, flexible), formules admin et sous-admin.",
    ar: "تأكيد الدفعات السنوية (سنة قياسية، مرنة)، باقات المديرين والمديرين المفوضين.",
    en: "Validation of annual payments (1-year standard, flexible), admin and sub-admin plans."
  },
  "annuaire global de tous les résidents inscrits, propriétaires, clés temporaires et affectations.": {
    fr: "Annuaire global de tous les résidents inscrits, propriétaires, clés temporaires et affectations.",
    ar: "الدليل الشامل لكافة السكان المسجلين، الملاك، المفاتيح المؤقتة والتخصيصات.",
    en: "Global directory of all registered residents, owners, temporary keys, and assignments."
  },
  "supervision des gardiens, concierges, techniciens de maintenance et registre des tâches globales.": {
    fr: "Supervision des gardiens, concierges, techniciens de maintenance et registre des tâches globales.",
    ar: "الإشراف على الحراس، البوابين، عمال الصيانة وسجل المهام العامة.",
    en: "Supervision of guards, concierges, maintenance technicians, and global task registry."
  },
  "supervision des votes en ligne des copropriétaires, suivi du quorum des tantièmes et certification pv.": {
    fr: "Supervision des votes en ligne des copropriétaires, suivi du quorum des tantièmes et certification pv.",
    ar: "متابعة تصويت الملاك عن بُعد، مراقبة نصاب الحصص وتوثيق المحاضر رسمياً.",
    en: "Supervision of co-owners online voting, quorum tracking, and certified minutes."
  },
  "évolution mensuelle du parc, projection de croissance, répartition géographique des résidences.": {
    fr: "Évolution mensuelle du parc, projection de croissance, répartition géographique des résidences.",
    ar: "التطور الشهري للمجمعات، توقعات النمو والتوزيع الجغرافي للإقامات.",
    en: "Monthly portfolio growth, projections, and geographic distribution of residences."
  },
  "téléchargement consolidé des journaux financiers, bilans annuels et registre complet des copropriétaires.": {
    fr: "Téléchargement consolidé des journaux financiers, bilans annuels et registre complet des copropriétaires.",
    ar: "تحميل موحد للدفاتر المالية، الحصائل السنوية والسجل الكامل للملاك.",
    en: "Consolidated download of financial journals, annual balance sheets, and co-owners register."
  },
  "gestion des comptes maîtres plateforme, journaux d'audit de sécurité et clés de chiffrement.": {
    fr: "Gestion des comptes maîtres plateforme, journaux d'audit de sécurité et clés de chiffrement.",
    ar: "إدارة الحسابات الرئيسية للمنصة، سجلات التدقيق الأمني ومفاتيح التشفير.",
    en: "Management of platform master accounts, security audit logs, and encryption keys."
  },
  "dernières résidences créées & statut administrateur": {
    fr: "Dernières résidences créées & Statut Administrateur",
    ar: "آخر الإقامات المنشأة وحالة المسؤول",
    en: "Latest Created Residences & Admin Status"
  },
  "tout gérer": {
    fr: "Tout gérer",
    ar: "إدارة الكل",
    en: "Manage All"
  },
  "standard 1 an :": {
    fr: "Standard 1 An :",
    ar: "معيار سنة واحدة :",
    en: "Standard 1 Year:"
  },
  "les contrats d'abonnement durent 12 mois avec paiement flexible (cib, edahabia, virement ou chèque).": {
    fr: "Les contrats d'abonnement durent 12 mois avec paiement flexible (CIB, Edahabia, virement ou chèque).",
    ar: "عقود الاشتراك تدوم 12 شهراً مع طرق دفع مرنة (CIB، الذهبية، تحويل بنكي أو شيك).",
    en: "Subscription contracts last 12 months with flexible payment (CIB, Edahabia, bank transfer, or cheque)."
  },
  "valider les abonnements en attente": {
    fr: "Valider les abonnements en attente",
    ar: "تأكيد الاشتراكات المعلقة",
    en: "Validate pending subscriptions"
  },
  "gouvernance & assemblées générales (ag)": {
    fr: "Gouvernance & Assemblées Générales (AG)",
    ar: "الحوكمة والجمعيات العامة",
    en: "Governance & General Assemblies (GA)"
  },
  "suivi des sessions ordinaires & extraordinaires dans les résidences": {
    fr: "Suivi des sessions ordinaires & extraordinaires dans les résidences",
    ar: "متابعة الجلسات العادية والاستثنائية في الإقامات",
    en: "Monitoring ordinary & extraordinary sessions across residences"
  },
  "consulter l'ag": {
    fr: "Consulter l'AG",
    ar: "الاطلاع على الجمعية العامة",
    en: "View General Assembly"
  },
  "session actuelle": {
    fr: "Session actuelle",
    ar: "الجلسة الحالية",
    en: "Current Session"
  },
  "assemblée générale ordinaire annuelle (2026)": {
    fr: "Assemblée Générale Ordinaire Annuelle (2026)",
    ar: "الجمعية العامة العادية السنوية (2026)",
    en: "Annual Ordinary General Assembly (2026)"
  },
  "hall d'honneur & salle polyvalente": {
    fr: "Hall d'honneur & Salle polyvalente",
    ar: "البهو الشرفي والقاعة متعددة النشاطات",
    en: "Main Hall & Multipurpose Room"
  },
  "résolutions & délibérations": {
    fr: "Résolutions & Délibérations",
    ar: "القرارات والمداولات",
    en: "Resolutions & Deliberations"
  },
  "8 résolutions soumises au vote des copropriétaires (approbation des comptes, budget prévisionnel n+1, travaux digicode, fonds de travaux).": {
    fr: "8 résolutions soumises au vote des copropriétaires (approbation des comptes, budget prévisionnel N+1, travaux digicode, fonds de travaux).",
    ar: "8 قرارات معروضة لتصويت الملاك المشتركين (اعتماد الحسابات، الميزانية التقديرية ن+1، أعمال الدخول الرقمي، صندوق الأشغال).",
    en: "8 resolutions submitted to co-owner vote (approval of accounts, N+1 estimated budget, digicode works, reserve fund)."
  },
  "pv d'ag certifié conforme": {
    fr: "PV d'AG Certifié Conforme",
    ar: "محضر الجمعية العامة معتمد ومطابق",
    en: "Certified Conforming GA Minutes"
  },
  "mode vidéoprojection": {
    fr: "Mode Vidéoprojection",
    ar: "وضع العرض المرئي",
    en: "Video Projection Mode"
  },
  "extraction comptable consolidée": {
    fr: "Extraction comptable consolidée",
    ar: "استخراج محاسبي موحد",
    en: "Consolidated Accounting Extract"
  },
  "exportez instantanément les données complètes de la plateforme par période personnalisée : journal des règlements, balances financières, effectifs et listing exhaustif des copropriétaires.": {
    fr: "Exportez instantanément les données complètes de la plateforme par période personnalisée : journal des règlements, balances financières, effectifs et listing exhaustif des copropriétaires.",
    ar: "قم بتصدير البيانات الكاملة للمنصة فوراً حسب فترة مخصصة: دفتر المدفوعات، الأرصدة المالية، القوى العاملة والقائمة الشاملة للملاك.",
    en: "Instantly export full platform data by custom period: payment journal, financial balances, staff, and comprehensive co-owners list."
  },
  "journal financier global (.csv)": {
    fr: "Journal Financier Global (.CSV)",
    ar: "دفتر اليومية المالي الشامل (.CSV)",
    en: "Global Financial Journal (.CSV)"
  },
  "registre national des résidents": {
    fr: "Registre National des Résidents",
    ar: "السجل الوطني للمقيمين",
    en: "National Residents Registry"
  },
  "responsable de bâtiment · périmètre délégué": {
    fr: "Responsable de Bâtiment · Périmètre Délégué",
    ar: "مسؤول العمارة · النطاق المفوّض",
    en: "Building Manager · Delegated Scope"
  },
  "encaisser un résident": {
    fr: "Encaisser un Résident",
    ar: "تحصيل من ساكن",
    en: "Collect from Resident"
  },
  "encaisser paiement": {
    fr: "Encaisser Paiement",
    ar: "تحصيل دفعة",
    en: "Collect Payment"
  },
  "bâtiments & sous-admins": {
    fr: "Bâtiments & Sous-Admins",
    ar: "العمارات والمديرون المفوضون",
    en: "Buildings & Sub-Admins"
  },
  "signaler incident": {
    fr: "Signaler Incident",
    ar: "التبليغ عن عطل",
    en: "Report Incident"
  },
  "signaler panne bloc": {
    fr: "Signaler Panne Bloc",
    ar: "التبليغ عن عطل بالعمارة",
    en: "Report Block Breakdown"
  },
  "exporter registre": {
    fr: "Exporter Registre",
    ar: "تصدير السجل",
    en: "Export Registry"
  },
  "assemblées (ag)": {
    fr: "Assemblées (AG)",
    ar: "الجمعيات العامة",
    en: "General Assemblies (GA)"
  },
  "recouvrement charges": {
    fr: "Recouvrement Charges",
    ar: "تحصيل الأعباء",
    en: "Charges Recovery"
  },
  "recouvrement bâtiment": {
    fr: "Recouvrement Bâtiment",
    ar: "تحصيل العمارة",
    en: "Building Recovery"
  },
  "urgences & pannes": {
    fr: "Urgences & Pannes",
    ar: "طوارئ وأعطال",
    en: "Emergencies & Breakdowns"
  },
  "caisse active": {
    fr: "Caisse active",
    ar: "صندوق نشط",
    en: "Active Cashbox"
  },
  "attribués": {
    fr: "Attribués",
    ar: "مخصصة",
    en: "Assigned"
  },
  "lots": {
    fr: "Lots",
    ar: "حصص",
    en: "Lots"
  },
  "signalements": {
    fr: "Signalements",
    ar: "بلاغات",
    en: "Reports"
  },
  "panne(s)": {
    fr: "Panne(s)",
    ar: "أعطال",
    en: "Breakdowns"
  },
  "panne(s) équipement": {
    fr: "Panne(s) équipement",
    ar: "أعطال الأجهزة",
    en: "Equipment Breakdowns"
  },
  "panne(s) ascenseur/bloc": {
    fr: "Panne(s) ascenseur/bloc",
    ar: "أعطال المصعد/الكتلة",
    en: "Elevator/Block Breakdowns"
  },
  "interventions": {
    fr: "Interventions",
    ar: "تدخلات",
    en: "Interventions"
  },
  "personnel mobilisé": {
    fr: "Personnel Mobilisé",
    ar: "عمال متأهبون",
    en: "Mobilized Staff"
  },
  "nettoyage & sécurité": {
    fr: "Nettoyage & Sécurité",
    ar: "نظافة وأمن",
    en: "Cleaning & Security"
  },
  "suivi actif": {
    fr: "Suivi actif",
    ar: "متابعة نشطة",
    en: "Active Follow-up"
  },
  "occupation bloc": {
    fr: "Occupation Bloc",
    ar: "إشغال الكتلة",
    en: "Block Occupancy"
  },
  "journal des règlements du bâtiment": {
    fr: "Journal des Règlements du Bâtiment",
    ar: "دفتر مدفوعات العمارة",
    en: "Building Payments Journal"
  },
  "derniers encaissements enregistrés": {
    fr: "Derniers encaissements enregistrés",
    ar: "آخر عمليات التحصيل المسجلة",
    en: "Latest Recorded Collections"
  },
  "aucun paiement récent dans ce bâtiment.": {
    fr: "Aucun paiement récent dans ce bâtiment.",
    ar: "لا توجد مدفوعات حديثة في هذه العمارة.",
    en: "No recent payments in this building."
  },
  "statut de paiement du bâtiment": {
    fr: "Statut de Paiement du Bâtiment",
    ar: "حالة السداد في العمارة",
    en: "Building Payment Status"
  },
  "aucun logement répertorié dans ce bâtiment.": {
    fr: "Aucun logement répertorié dans ce bâtiment.",
    ar: "لا توجد أي شقة مسجلة في هذه العمارة.",
    en: "No units listed in this building."
  },
  "appartements à jour de cotisation": {
    fr: "Appartements à jour de cotisation",
    ar: "شقق مسددة للاشتراكات بانتظام",
    en: "Apartments up to date with fees"
  },
  "appartements avec impayés de charges": {
    fr: "Appartements avec impayés de charges",
    ar: "شقق عليها متأخرات في الأعباء",
    en: "Apartments with overdue charges"
  },
  "appartements vacants ou sans occupant": {
    fr: "Appartements vacants ou sans occupant",
    ar: "شقق شاغرة أو دون ساكن",
    en: "Vacant or unoccupied apartments"
  },
  "consulter le registre complet": {
    fr: "Consulter le registre complet",
    ar: "عرض السجل الكامل",
    en: "View full registry"
  },
  "journal financier consolidé": {
    fr: "Journal Financier Consolidé",
    ar: "دفتر اليومية المالي الموحد",
    en: "Consolidated Financial Journal"
  },
  "télécharger le relevé": {
    fr: "Télécharger le relevé",
    ar: "تحميل الكشف",
    en: "Download statement"
  },
  "relevé officiel des cotisations et charges de la résidence": {
    fr: "Relevé officiel des cotisations et charges de la résidence",
    ar: "الكشف الرسمي لاشتراكات وأعباء الإقامة",
    en: "Official statement of dues and charges for the residence"
  },
  "total cotisations perçues": {
    fr: "Total cotisations perçues",
    ar: "إجمالي الاشتراكات المحصلة",
    en: "Total dues collected"
  },
  "charges payées": {
    fr: "Charges payées",
    ar: "الأعباء المسددة",
    en: "Paid charges"
  },
  "balance nette": {
    fr: "Balance nette",
    ar: "الرصيد الصافي",
    en: "Net balance"
  },
  "derniers règlements reçus": {
    fr: "Derniers règlements reçus",
    ar: "آخر المدفوعات المستلمة",
    en: "Latest received payments"
  },
  "aucun règlement récent pour cette résidence.": {
    fr: "Aucun règlement récent pour cette résidence.",
    ar: "لا توجد مدفوعات حديثة لهذه الإقامة.",
    en: "No recent payments for this residence."
  },
  "capacité des blocs dans": {
    fr: "Capacité des blocs dans",
    ar: "سعة الكتل في",
    en: "Block capacity in"
  },
  "capacité des résidents dans": {
    fr: "Capacité des résidents dans",
    ar: "سعة السكان في",
    en: "Resident capacity in"
  },
  "quota de bâtiments de": {
    fr: "Quota de bâtiments de",
    ar: "حصة عمارات",
    en: "Building quota of"
  },
  "capacité maximale de résidents": {
    fr: "Capacité maximale de résidents",
    ar: "الحد الأقصى لسعة السكان",
    en: "Maximum resident capacity"
  },
  "logements par étage (aide)": {
    fr: "Logements par étage (aide)",
    ar: "شقق في كل طابق (مساعدة)",
    en: "Flats per floor (help)"
  },
  "capacité maximale d'appartements": {
    fr: "Capacité maximale d'appartements",
    ar: "الحد الأقصى لسعة الشقق",
    en: "Maximum apartment capacity"
  },
  "calcul estimé :": {
    fr: "Calcul estimé :",
    ar: "الحساب التقديري :",
    en: "Estimated calculation:"
  },
  "nouvel admin (syndic de résidence)": {
    fr: "Nouvel Admin (Syndic de Résidence)",
    ar: "مدير جديد (وكيل الإقامة)",
    en: "New Admin (Residence Syndic)"
  },
  "nouveau sous-admin (gestionnaire de bloc)": {
    fr: "Nouveau Sous-Admin (Gestionnaire de bloc)",
    ar: "مدير مفوض جديد (مسير العمارة)",
    en: "New Sub-Admin (Block Manager)"
  },
  "responsable de la résidence": {
    fr: "Responsable de la résidence",
    ar: "المسؤول عن الإقامة",
    en: "Residence manager"
  },
  "responsable du bâtiment": {
    fr: "Responsable du bâtiment",
    ar: "المسؤول عن العمارة",
    en: "Building manager"
  },
  "il pourra se connecter dès qu'un abonnement payé sera en cours.": {
    fr: "Il pourra se connecter dès qu'un abonnement payé sera en cours.",
    ar: "سيتمكن من تسجيل الدخول بمجرد تفعيل اشتراك سارٍ.",
    en: "They will be able to log in as soon as an active paid subscription is in effect."
  },
  "créée le": {
    fr: "Créée le",
    ar: "أُنشئت في",
    en: "Created on"
  },
  "avec propriétaire": {
    fr: "Avec propriétaire",
    ar: "مع مالك",
    en: "With owner"
  },
  "sans propriétaire": {
    fr: "Sans propriétaire",
    ar: "بدون مالك",
    en: "Without owner"
  },
  "créer le sub admin": {
    fr: "Créer le Sub Admin",
    ar: "إنشاء مدير مفوض",
    en: "Create Sub-Admin"
  },
  "voir résidents": {
    fr: "Voir Résidents",
    ar: "عرض السكان",
    en: "View Residents"
  },
  "fermer détails": {
    fr: "Fermer Détails",
    ar: "إغلاق التفاصيل",
    en: "Close Details"
  },
  "quota atteint": {
    fr: "Quota atteint",
    ar: "تم بلوغ الحصة",
    en: "Quota reached"
  },
  "aucun bâtiment. ajoutez le premier bâtiment de cette résidence.": {
    fr: "Aucun bâtiment. Ajoutez le premier bâtiment de cette résidence.",
    ar: "لا توجد عمارات. أضف أول عمارة لهذه الإقامة.",
    en: "No buildings. Add the first building for this residence."
  },
  "aucun appartement n'a encore été créé dans ce bâtiment.": {
    fr: "Aucun appartement n'a encore été créé dans ce bâtiment.",
    ar: "لم يتم إنشاء أي شقة في هذه العمارة بعد.",
    en: "No apartment has been created in this building yet."
  },
  "statut cotisation": {
    fr: "Statut Cotisation",
    ar: "حالة الاشتراك",
    en: "Dues Status"
  },
  "résident / propriétaire": {
    fr: "Résident / Propriétaire",
    ar: "الساكن / المالك",
    en: "Resident / Owner"
  },
  "aucun admin n'est encore responsable de cette résidence.": {
    fr: "Aucun admin n'est encore responsable de cette résidence.",
    ar: "لا يوجد مدير مسؤول عن هذه الإقامة بعد.",
    en: "No admin is assigned to this residence yet."
  },
  "le résident peut maintenant ouvrir l'application mobile city sur android / ios, saisir cet email et ce mot de passe, et accéder à son espace.": {
    fr: "Le résident peut maintenant ouvrir l'application mobile City sur Android / iOS, saisir cet email et ce mot de passe, et accéder à son espace.",
    ar: "يمكن للساكن الآن فتح تطبيق الهاتف City على Android / iOS، وإدخال البريد الإلكتروني وكلمة المرور هذه للدخول إلى حسابه.",
    en: "The resident can now open the City mobile app on Android / iOS, enter this email and password, and access their space."
  },
  "ce mot de passe permettra au résident de se connecter sur l'application mobile. il pourra le changer après sa première connexion.": {
    fr: "Ce mot de passe permettra au résident de se connecter sur l'application mobile. Il pourra le changer après sa première connexion.",
    ar: "ستمكن كلمة المرور هذه الساكن من الدخول إلى تطبيق الهاتف. ويمكنه تغييرها بعد أول تسجيل دخول.",
    en: "This password will allow the resident to connect on the mobile app. They can change it after first login."
  },
  "toutes les alertes": {
    fr: "Toutes les alertes",
    ar: "كل التنبيهات",
    en: "All alerts"
  },
  "info": {
    fr: "Info",
    ar: "معلومات",
    en: "Info"
  },
  "rechercher une alerte...": {
    fr: "Rechercher une alerte...",
    ar: "بحث عن تنبيه...",
    en: "Search alert..."
  },
  "diffusion prioritaire d'urgence": {
    fr: "Diffusion prioritaire d'urgence",
    ar: "بث طارئ ذو أولوية قصوى",
    en: "High-priority emergency broadcast"
  },
  "les alertes sont diffusées en push haute priorité avec sonnerie et bandeau d'urgence visible sur l'application.": {
    fr: "Les alertes sont diffusées en push haute priorité avec sonnerie et bandeau d'urgence visible sur l'application.",
    ar: "يتم بث التنبيهات كإشعارات عاجلة مع رنين وشريط طوارئ يظهر على التطبيق.",
    en: "Alerts are broadcast as high-priority push notifications with sound and an emergency banner visible on the app."
  },
  "nouvelle alerte": {
    fr: "Nouvelle Alerte",
    ar: "تنبيه جديد",
    en: "New Alert"
  },
  "aucune alerte d'urgence enregistrée.": {
    fr: "Aucune alerte d'urgence enregistrée.",
    ar: "لا توجد تنبيهات طوارئ مسجلة.",
    en: "No emergency alerts recorded."
  },
  "rechercher une annonce par titre, contenu...": {
    fr: "Rechercher une annonce par titre, contenu...",
    ar: "بحث في الإعلانات بالعنوان أو المحتوى...",
    en: "Search announcement by title, content..."
  },
  "aucune annonce publiée pour le moment.": {
    fr: "Aucune annonce publiée pour le moment.",
    ar: "لا توجد إعلانات منشورة حالياً.",
    en: "No announcements published yet."
  },
  "administrateurs": {
    fr: "Administrateurs",
    ar: "مديرون",
    en: "Administrators"
  },
  "sous-administrateurs": {
    fr: "Sous-administrateurs",
    ar: "مديرون مفوضون",
    en: "Sub-administrators"
  },
  "sous-admin (bâtiment)": {
    fr: "Sous-Admin (Bâtiment)",
    ar: "مدير مفوض (عمارة)",
    en: "Sub-Admin (Building)"
  },
  "admin (résidence)": {
    fr: "Admin (Résidence)",
    ar: "مدير (إقامة)",
    en: "Admin (Residence)"
  },
  "standard 1 an": {
    fr: "Standard 1 An",
    ar: "معيار سنة واحدة",
    en: "Standard 1 Year"
  },
  "souscriptions": {
    fr: "Souscriptions",
    ar: "اشتراكات",
    en: "Subscriptions"
  },
  "attribuer": {
    fr: "Attribuer",
    ar: "تخصيص",
    en: "Assign"
  },
  "aucun abonnement": {
    fr: "Aucun abonnement",
    ar: "لا يوجد اشتراك",
    en: "No subscription"
  },
  "à venir": {
    fr: "À venir",
    ar: "قادم",
    en: "Upcoming"
  },
  "total général budgétaire": {
    fr: "Total Général Budgétaire",
    ar: "المجموع العام للميزانية",
    en: "General Budget Total"
  },
  "équilibre budgétaire préconisé": {
    fr: "Équilibre budgétaire préconisé",
    ar: "التوازن المالي الموصى به",
    en: "Recommended budget balance"
  },
  "document officiel d'ag": {
    fr: "Document Officiel d'AG",
    ar: "وثيقة رسمية للجمعية العامة",
    en: "Official GA Document"
  },
  "bilan financier & compte de gestion de l'exercice": {
    fr: "Bilan Financier & Compte de Gestion de l'Exercice",
    ar: "الحصيلة المالية وحساب التسيير للسنة المالية",
    en: "Financial Balance Sheet & Fiscal Year Management Account"
  },
  "rapport certifié pour approbation des comptes par l'assemblée générale des copropriétaires": {
    fr: "Rapport certifié pour approbation des comptes par l'Assemblée Générale des copropriétaires",
    ar: "تقرير مصادق عليه لاعتماد الحسابات من قبل الجمعية العامة للملاك المشتركين",
    en: "Certified report for approval of accounts by the General Assembly of co-owners"
  },
  "imprimer le bilan officiel pour l'ag": {
    fr: "Imprimer le bilan officiel pour l'AG",
    ar: "طباعة الحصيلة الرسمية للجمعية العامة",
    en: "Print official balance sheet for GA"
  },
  "produits de l'exercice (recettes)": {
    fr: "Produits de l'exercice (Recettes)",
    ar: "إيرادات السنة المالية (المداخيل)",
    en: "Fiscal Year Revenue (Receipts)"
  },
  "cotisations ordinaires encaissées": {
    fr: "Cotisations ordinaires encaissées",
    ar: "الاشتراكات العادية المحصلة",
    en: "Collected ordinary dues"
  },
  "créances à recouvrer (impayés)": {
    fr: "Créances à recouvrer (Impayés)",
    ar: "مستحقات قيد التحصيل (ديون متأخرة)",
    en: "Receivables to collect (Unpaid dues)"
  },
  "fonds de roulement initial": {
    fr: "Fonds de roulement initial",
    ar: "صندوق السيولة التشغيلي الأولي",
    en: "Initial working capital fund"
  },
  "total produits d'appels": {
    fr: "Total produits d'appels",
    ar: "إجمالي إيرادات الاشتراكات",
    en: "Total call revenue"
  },
  "charges réelles acquittées (dépenses)": {
    fr: "Charges réelles acquittées (Dépenses)",
    ar: "الأعباء الفعلية المسددة (المصاريف)",
    en: "Actual paid charges (Expenses)"
  },
  "charges courantes d'exploitation payées": {
    fr: "Charges courantes d'exploitation payées",
    ar: "أعباء الاستغلال الجارية المسددة",
    en: "Paid current operating expenses"
  },
  "factures engagées restant à régler": {
    fr: "Factures engagées restant à régler",
    ar: "فواتير ملزمة قيد التسديد",
    en: "Pending committed invoices"
  },
  "dotation fonds de réserve travaux (10%)": {
    fr: "Dotation fonds de réserve travaux (10%)",
    ar: "مخصص صندوق احتياطي الأشغال (10%)",
    en: "Works reserve fund allocation (10%)"
  },
  "total dépenses engagées": {
    fr: "Total dépenses engagées",
    ar: "إجمالي المصاريف الملتزم بها",
    en: "Total committed expenses"
  },
  "résultat comptable net de l'exercice :": {
    fr: "Résultat comptable net de l'exercice :",
    ar: "النتيجة المحاسبية الصافية للسنة المالية :",
    en: "Net accounting result of the fiscal year:"
  },
  "trésorerie positive à reporter à nouveau ou à affecter au fonds travaux sur décision de l'ag.": {
    fr: "Trésorerie positive à reporter à nouveau ou à affecter au fonds travaux sur décision de l'AG.",
    ar: "سيولة إيجابية تُرَحّل أو تُخصص لصندوق الأشغال بقرار من الجمعية العامة.",
    en: "Positive treasury to be carried forward or allocated to the works fund upon GA decision."
  },
  "déficit d'exploitation nécessitant un appel exceptionnel de régularisation lors de l'ag.": {
    fr: "Déficit d'exploitation nécessitant un appel exceptionnel de régularisation lors de l'AG.",
    ar: "عجز استغلال يتطلب دعوة استثنائية لتسوية الحسابات أثناء الجمعية العامة.",
    en: "Operating deficit requiring an exceptional regularisation call during the GA."
  },
  "taux de recouvrement effectif :": {
    fr: "Taux de recouvrement effectif :",
    ar: "نسبة التحصيل الفعلية :",
    en: "Effective recovery rate:"
  },
  "pour le syndic de copropriété": {
    fr: "Pour le Syndic de copropriété",
    ar: "عن وكيل الملكية المشتركة",
    en: "For the Property Syndic"
  },
  "certifié sincère et conforme aux registres de la résidence": {
    fr: "Certifié sincère et conforme aux registres de la résidence",
    ar: "مشهود بصدقه ومطابقته لسجلات الإقامة",
    en: "Certified true and accurate to residence registers"
  },
  "signature & cachet syndic": {
    fr: "Signature & Cachet Syndic",
    ar: "توقيع وخاتم الوكيل",
    en: "Syndic Signature & Stamp"
  },
  "pour le conseil syndical": {
    fr: "Pour le Conseil Syndical",
    ar: "عن مجلس وكلاء الملاك المشتركين",
    en: "For the Syndic Council"
  },
  "visa d'approbation pour soumission à l'ag": {
    fr: "Visa d'approbation pour soumission à l'AG",
    ar: "تأشيرة الموافقة لتقديمها للجمعية العامة",
    en: "Approval visa for submission to GA"
  },
  "signature président conseil": {
    fr: "Signature Président Conseil",
    ar: "توقيع رئيس المجلس",
    en: "Council President Signature"
  },
  "pièces": {
    fr: "Pièces",
    ar: "وثائق",
    en: "Items"
  },
  "archives officielles certifiées conformes": {
    fr: "Archives officielles certifiées conformes",
    ar: "أرشيف رسمي معتمد ومطابق",
    en: "Certified official conforming archives"
  },
  "nouveau type de charge": {
    fr: "Nouveau Type de Charge",
    ar: "نوع عبء جديد",
    en: "New Charge Type"
  },
  "nouveau type d'incident": {
    fr: "Nouveau Type d'Incident",
    ar: "نوع عطل جديد",
    en: "New Incident Type"
  },
  "nouveau mode de paiement": {
    fr: "Nouveau Mode de Paiement",
    ar: "طريقة دفع جديدة",
    en: "New Payment Method"
  },
  "super admins": {
    fr: "Super Admins",
    ar: "المديرون العامون",
    en: "Super Admins"
  },
  "sub admins": {
    fr: "Sub Admins",
    ar: "المديرون المفوضون",
    en: "Sub Admins"
  },
  "revenus encaissés": {
    fr: "Revenus encaissés",
    ar: "الإيرادات المحصلة",
    en: "Collected Revenue"
  },
  "nouveaux abonnements": {
    fr: "Nouveaux abonnements",
    ar: "اشتراكات جديدة",
    en: "New Subscriptions"
  },
  "comptes admin / sub admin": {
    fr: "Comptes Admin / Sub Admin",
    ar: "حسابات المديرين والمديرين المفوضين",
    en: "Admin / Sub-Admin Accounts"
  },
  "actualiser les statistiques": {
    fr: "Actualiser les statistiques",
    ar: "تحديث الإحصائيات",
    en: "Refresh Statistics"
  },
  "standard 1 an (accès complet)": {
    fr: "Standard 1 An (Accès complet)",
    ar: "معيار سنة واحدة (وصول كامل)",
    en: "Standard 1 Year (Full Access)"
  },
  "pro 1 an (multi-bâtiments)": {
    fr: "Pro 1 An (Multi-bâtiments)",
    ar: "احترافي سنة واحدة (مباني متعددة)",
    en: "Pro 1 Year (Multi-buildings)"
  },
  "sous-admin 1 an (par bâtiment)": {
    fr: "Sous-Admin 1 An (Par bâtiment)",
    ar: "مدير مفوض سنة واحدة (لكل عمارة)",
    en: "Sub-Admin 1 Year (Per building)"
  },
  "mensuel (essai 30j)": {
    fr: "Mensuel (Essai 30j)",
    ar: "شهري (تجربة 30 يوماً)",
    en: "Monthly (30d trial)"
  },
  "propriétaire occupant": {
    fr: "Propriétaire occupant",
    ar: "مالك ساكن",
    en: "Owner-occupant"
  },
  "gestionnaire délégué": {
    fr: "Gestionnaire délégué",
    ar: "مسير مفوّض",
    en: "Delegated Manager"
  },
  "urgent (sécurité)": {
    fr: "Urgent (Sécurité)",
    ar: "عاجل (أمن)",
    en: "Urgent (Security)"
  },
  "bloquant": {
    fr: "Bloquant",
    ar: "معطل تماماً",
    en: "Blocking"
  },
  "mineur": {
    fr: "Mineur",
    ar: "بسيط",
    en: "Minor"
  },
  "proche limite": {
    fr: "Proche limite",
    ar: "قريب من الحد",
    en: "Near limit"
  },
  "complet": {
    fr: "Complet",
    ar: "مكتمل",
    en: "Full"
  },

  // === EXHAUSTIVE LIVE AUDIT FIXES ===
  "abonnements & formules": {
    fr: "Abonnements & Formules",
    ar: "الاشتراكات والباقات",
    en: "Subscriptions & Plans"
  },
  "copropriétaires & résidents": {
    fr: "Copropriétaires & Résidents",
    ar: "الملاك المشتركون والمقيمون",
    en: "Co-owners & Residents"
  },
  "personnel & intervenants": {
    fr: "Personnel & Intervenants",
    ar: "الموظفون والعمال",
    en: "Staff & Contractors"
  },
  "assemblées générales (ag)": {
    fr: "Assemblées Générales (AG)",
    ar: "الجمعيات العامة",
    en: "General Assemblies (GA)"
  },
  "statistiques & croissance": {
    fr: "Statistiques & Croissance",
    ar: "الإحصائيات والنمو",
    en: "Statistics & Growth"
  },
  "rapports & exports saas": {
    fr: "Rapports & Exports SaaS",
    ar: "التقارير والتصدير SaaS",
    en: "Reports & SaaS Exports"
  },
  "équipe super admin & accès": {
    fr: "Équipe Super Admin & Accès",
    ar: "فريق الإدارة العامة والصلاحيات",
    en: "Super Admin Team & Access"
  },
  "profil super admin & sécurité": {
    fr: "Profil Super Admin & Sécurité",
    ar: "ملف المشرف العام والأمان",
    en: "Super Admin Profile & Security"
  },
  "formules d'abonnements (1 an standard)": {
    fr: "Formules d'abonnements (1 an standard)",
    ar: "باقات الاشتراكات (معيار سنة واحدة)",
    en: "Subscription Plans (1 Year Standard)"
  },
  "durée standard 1 an · paiement flexible": {
    fr: "Durée standard 1 an · Paiement flexible",
    ar: "مدة قياسية سنة واحدة · دفع مرن",
    en: "Standard 1 year term · Flexible payment"
  },
  "comptabilité saas à jour": {
    fr: "Comptabilité SaaS à jour",
    ar: "محاسبة المنصة محينة",
    en: "SaaS accounting up to date"
  },
  "bâtiments gérés": {
    fr: "bâtiments gérés",
    ar: "عمارات مدارة",
    en: "managed buildings"
  },
  "souscriptions actives": {
    fr: "souscriptions actives",
    ar: "اشتراكات نشطة",
    en: "active subscriptions"
  },
  "logements occupés": {
    fr: "logements occupés",
    ar: "شقق مشغولة",
    en: "occupied units"
  },
  "+100% rétention": {
    fr: "+100% rétention",
    ar: "+100% نسبة الاستبقاء",
    en: "+100% retention"
  },
  "session 2026": {
    fr: "Session 2026",
    ar: "جلسة 2026",
    en: "2026 Session"
  },
  "quorum 74.5% tantièmes atteint": {
    fr: "Quorum 74.5% tantièmes atteint",
    ar: "تم بلوغ نصاب 74.5% من الحصص",
    en: "74.5% share quorum reached"
  },
  "chiffre d'affaires & métriques saas": {
    fr: "Chiffre d'affaires & métriques SaaS",
    ar: "رقم الأعمال ومؤشرات المنصة",
    en: "Revenue & SaaS metrics"
  },
  "exports csv & print": {
    fr: "Exports CSV & Print",
    ar: "تصدير CSV وطباعة",
    en: "CSV Exports & Print"
  },
  "périodes personnalisables": {
    fr: "Périodes personnalisables",
    ar: "فترات قابلة للتخصيص",
    en: "Customizable periods"
  },
  "super admin(s)": {
    fr: "Super Admin(s)",
    ar: "مشرفون عامون",
    en: "Super Admin(s)"
  },
  "droits d'accès totaux": {
    fr: "Droits d'accès totaux",
    ar: "صلاحيات وصول كاملة",
    en: "Total access rights"
  },
  "gérer": {
    fr: "Gérer",
    ar: "إدارة",
    en: "Manage"
  },
  "administrateur": {
    fr: "Administrateur",
    ar: "المدير",
    en: "Administrator"
  },
  "sous-administrateur": {
    fr: "Sous-administrateur",
    ar: "المسؤول المفوّض",
    en: "Sub-administrator"
  },
  "mon bâtiment & lots": {
    fr: "Mon Bâtiment & Lots",
    ar: "عمارتي والشقق",
    en: "My Building & Lots"
  },
  "mes résidents & contacts": {
    fr: "Mes Résidents & Contacts",
    ar: "سكاني وجهات الاتصال",
    en: "My Residents & Contacts"
  },
  "paiements & cotisations": {
    fr: "Paiements & Cotisations",
    ar: "المدفوعات والاشتراكات",
    en: "Payments & Fees"
  },
  "incidents & pannes bloc": {
    fr: "Incidents & Pannes Bloc",
    ar: "أعطال ومشاكل العمارة",
    en: "Block Incidents & Breakdowns"
  },
  "personnel & entretien bloc": {
    fr: "Personnel & Entretien Bloc",
    ar: "عمال وصيانة العمارة",
    en: "Block Staff & Maintenance"
  },
  "alertes & rapports bloc": {
    fr: "Alertes & Rapports Bloc",
    ar: "تنبيهات وتقارير العمارة",
    en: "Block Alerts & Reports"
  },
  "gestion des appartements, étages et répartition des tantièmes de votre bâtiment.": {
    fr: "Gestion des appartements, étages et répartition des tantièmes de votre bâtiment.",
    ar: "إدارة الشقق والطوابق وتوزيع الحصص الشائعة لعمارك.",
    en: "Manage apartments, floors, and share quotas for your building."
  },
  "annuaire nominatif des occupants de votre bloc, coordonnées téléphoniques et clés temporaires.": {
    fr: "Annuaire nominatif des occupants de votre bloc, coordonnées téléphoniques et clés temporaires.",
    ar: "دليل أسماء شاغلي عمارتك وأرقام الهواتف والمفاتيح المؤقتة.",
    en: "Directory of your block occupants, contact numbers, and temporary keys."
  },
  "enregistrement des paiements des résidents, suivi de qui a payé et qui est en retard.": {
    fr: "Enregistrement des paiements des résidents, suivi de qui a payé et qui est en retard.",
    ar: "تسجيل مدفوعات السكان ومتابعة من سدد ومن هو متأخر.",
    en: "Recording resident payments, tracking who has paid and who is overdue."
  },
  "signalement des pannes d'ascenseur, éclairage, interphone et plomberie de votre bâtiment.": {
    fr: "Signalement des pannes d'ascenseur, éclairage, interphone et plomberie de votre bâtiment.",
    ar: "التبليغ عن أعطال المصعد والإنارة وجهاز الاتصال الداخلي والسباكة.",
    en: "Reporting elevator, lighting, intercom, and plumbing breakdowns for your building."
  },
  "suivi des agents d'entretien, techniciens et prestataires intervenant sur votre bâtiment.": {
    fr: "Suivi des agents d'entretien, techniciens et prestataires intervenant sur votre bâtiment.",
    ar: "متابعة عمال النظافة والفنيين والمتعاقدين المتدخلين في عمارتك.",
    en: "Monitoring cleaners, technicians, and contractors working on your building."
  },
  "diffusion d'avis aux résidents de votre bloc et export du journal de caisse du bâtiment.": {
    fr: "Diffusion d'avis aux résidents de votre bloc et export du journal de caisse du bâtiment.",
    ar: "نشر التنبيهات لسكان عمارتك وتصدير دفتر الخزينة للعمارة.",
    en: "Broadcasting notices to block residents and exporting the building cash journal."
  },
  "résidents & logements": {
    fr: "Résidents & Logements",
    ar: "السكان والشقق",
    en: "Residents & Units"
  },
  "finances & règlements": {
    fr: "Finances & Règlements",
    ar: "المالية والمدفوعات",
    en: "Finances & Payments"
  },
  "maintenance & pannes": {
    fr: "Maintenance & Pannes",
    ar: "الصيانة والأعطال",
    en: "Maintenance & Breakdowns"
  },
  "personnel & tâches": {
    fr: "Personnel & Tâches",
    ar: "الموظفون والمهام",
    en: "Staff & Tasks"
  },
  "annonces & alertes": {
    fr: "Annonces & Alertes",
    ar: "الإعلانات والتنبيهات",
    en: "Announcements & Alerts"
  },
  "documents & contrats": {
    fr: "Documents & Contrats",
    ar: "الوثائق والعقود",
    en: "Documents & Contracts"
  },
  "rapports & exports": {
    fr: "Rapports & Exports",
    ar: "التقارير والتصدير",
    en: "Reports & Exports"
  },
  "configuration & types": {
    fr: "Configuration & Types",
    ar: "الإعدادات والأنواع",
    en: "Configuration & Types"
  },
  "gestion des blocs, étages, tantièmes et nomination des responsables de bâtiment.": {
    fr: "Gestion des blocs, étages, tantièmes et nomination des responsables de bâtiment.",
    ar: "إدارة الكتل والطوابق والحصص وتعيين مسؤولي العمارات.",
    en: "Manage blocks, floors, shares, and nominate building managers."
  },
  "annuaire des copropriétaires, fiches logements, mots de passe temporaires et affectations.": {
    fr: "Annuaire des copropriétaires, fiches logements, mots de passe temporaires et affectations.",
    ar: "دليل الملاك وبطاقات الشقق وكلمات المرور المؤقتة والتخصيصات.",
    en: "Co-owners directory, unit sheets, temporary passwords, and allocations."
  },
  "journal de caisse, encaissement des charges, quittances whatsapp et relances d'impayés.": {
    fr: "Journal de caisse, encaissement des charges, quittances WhatsApp et relances d'impayés.",
    ar: "دفتر الخزينة وتحصيل الاشتراكات والوصولات عبر واتساب والتذكير بالمتأخرات.",
    en: "Cash journal, dues collection, WhatsApp receipts, and overdue reminders."
  },
  "suivi des pannes d'ascenseurs, interventions techniques avec photos et clôture des tickets.": {
    fr: "Suivi des pannes d'ascenseurs, interventions techniques avec photos et clôture des tickets.",
    ar: "متابعة أعطال المصاعد والتدخلات التقنية مع الصور وإغلاق التذاكر.",
    en: "Tracking elevator breakdowns, technical interventions with photos, and closing tickets."
  },
  "convocations, vote en ligne par tantièmes, mode projection vidéoprojecteur et pv certifié.": {
    fr: "Convocations, vote en ligne par tantièmes, mode projection vidéoprojecteur et PV certifié.",
    ar: "الدعوات والتصويت الإلكتروني بالحصص ووضع العرض المرئي والمحاضر المعتمدة.",
    en: "Meeting notices, online voting by shares, projector display mode, and certified minutes."
  },
  "planning des concierges, agents d'entretien, gardiens de nuit et affectation des tâches.": {
    fr: "Planning des concierges, agents d'entretien, gardiens de nuit et affectation des tâches.",
    ar: "جدول البوابين وعمال النظافة والحراس الليليين وتوزيع المهام.",
    en: "Schedules for concierges, cleaners, night guards, and task assignments."
  },
  "diffusion d'avis aux copropriétaires et alertes d'urgence avec notification instantanée.": {
    fr: "Diffusion d'avis aux copropriétaires et alertes d'urgence avec notification instantanée.",
    ar: "نشر إشعارات للملاك المشتركين وتنبيهات طوارئ بإشعارات فورية.",
    en: "Broadcasting notices to co-owners and emergency alerts with instant notifications."
  },
  "coffre-fort numérique, contrats d'ascenseur, assurance de copropriété et devis.": {
    fr: "Coffre-fort numérique, contrats d'ascenseur, assurance de copropriété et devis.",
    ar: "خزينة رقمية وعقود المصاعد والتأمين وعروض الأسعار.",
    en: "Digital vault, elevator contracts, co-ownership insurance, and quotes."
  },
  "génération de bilans comptables, journaux financiers et registres par période paramétrable.": {
    fr: "Génération de bilans comptables, journaux financiers et registres par période paramétrable.",
    ar: "إصدار الميزانيات المحاسبية والدفاتر المالية والسجلات لفترات مخصصة.",
    en: "Generating balance sheets, financial journals, and registers by customizable period."
  },
  "modes de paiement acceptés (cib, baridimob), barèmes mensuels et délais sla d'intervention.": {
    fr: "Modes de paiement acceptés (CIB, BaridiMob), barèmes mensuels et délais SLA d'intervention.",
    ar: "طرق الدفع المقبولة (CIB، بريدي موب) والجداول الشهرية والمهل الزمنية.",
    en: "Accepted payment methods (CIB, BaridiMob), monthly scales, and response SLAs."
  },
  "ago 2026": {
    fr: "AGO 2026",
    ar: "الجمعية العامة 2026",
    en: "AGM 2026"
  },
  "quorum 74.5% tantièmes": {
    fr: "Quorum 74.5% tantièmes",
    ar: "نصاب 74.5% من الحصص",
    en: "74.5% share quorum"
  },
  "recouvré": {
    fr: "recouvré",
    ar: "محصّل",
    en: "recovered"
  },
  "sans sous-admin": {
    fr: "sans sous-admin",
    ar: "بدون مسؤول مفوّض",
    en: "without sub-admin"
  },
  "tous délégués": {
    fr: "Tous délégués",
    ar: "الكل مفوض",
    en: "All assigned"
  },
  "en poste": {
    fr: "en poste",
    ar: "في الخدمة",
    en: "on duty"
  },
  "tâches à faire": {
    fr: "tâches à faire",
    ar: "مهام للإنجاز",
    en: "tasks to do"
  },
  "alertes actives": {
    fr: "alertes actives",
    ar: "تنبيهات نشطة",
    en: "active alerts"
  },
  "diffusées": {
    fr: "diffusées",
    ar: "منشورة",
    en: "broadcasted"
  },
  "pièces archivées": {
    fr: "pièces archivées",
    ar: "وثائق مؤرشفة",
    en: "archived items"
  },
  "bilan n vs n+1": {
    fr: "Bilan N vs N+1",
    ar: "مقارنة ن مقابل ن+1",
    en: "Balance N vs N+1"
  },
  "formats csv & print": {
    fr: "Formats CSV & Print",
    ar: "تنسيق CSV وطباعة",
    en: "CSV & Print formats"
  },
  "types charges": {
    fr: "types charges",
    ar: "أنواع أعباء",
    en: "charge types"
  },
  "barèmes & cib": {
    fr: "Barèmes & CIB",
    ar: "التعريفات وCIB",
    en: "Tariffs & CIB"
  },
  "6 modules délégués": {
    fr: "6 modules délégués",
    ar: "6 وحدات مفوضة",
    en: "6 delegated modules"
  },
  "missions assignées": {
    fr: "Missions assignées",
    ar: "مهام موكلة",
    en: "Assigned tasks"
  },
  "diffusions & exports": {
    fr: "Diffusions & Exports",
    ar: "النشرات والتصدير",
    en: "Broadcasts & Exports"
  },
  "points d'attention": {
    fr: "points d'attention",
    ar: "نقاط تتطلب المتابعة",
    en: "points of attention"
  },
  "point(s) d'attention": {
    fr: "point(s) d'attention",
    ar: "نقطة/نقاط تتطلب المتابعة",
    en: "point(s) of attention"
  },
  "structure organisationnelle : résidence → bâtiments → gestionnaires → appartements": {
    fr: "Structure organisationnelle : Résidence → Bâtiments → Gestionnaires → Appartements",
    ar: "الهيكل التنظيمي : الإقامة ← العمارات ← المسيرون ← الشقق",
    en: "Organizational structure: Residence → Buildings → Managers → Units"
  },
  "aucune résidence ne vous est encore attribuée. contactez le super admin.": {
    fr: "Aucune résidence ne vous est encore attribuée. Contactez le Super Admin.",
    ar: "لم يتم تخصيص أي إقامة لك بعد. يرجى التواصل مع المشرف العام.",
    en: "No residence is assigned to you yet. Please contact the Super Admin."
  },
  "accès non autorisé": {
    fr: "Accès non autorisé",
    ar: "وصول غير مصرح به",
    en: "Unauthorized Access"
  },
  "retour au tableau de bord": {
    fr: "Retour au tableau de bord",
    ar: "العودة إلى لوحة التحكم",
    en: "Back to Dashboard"
  },
  "créez les résidences et leurs bâtiments, puis nommez l'admin responsable de chaque résidence et le sub admin de chaque bâtiment.": {
    fr: "Créez les résidences et leurs bâtiments, puis nommez l'Admin responsable de chaque résidence et le Sub Admin de chaque bâtiment.",
    ar: "أنشئ الإقامات وعماراتها، ثم عيّن المدير المسؤول عن كل إقامة والمسؤول المفوّض لكل عمارة.",
    en: "Create residences and their buildings, then nominate the Admin for each residence and the Sub-Admin for each building."
  },
  "modifier résidence": {
    fr: "Modifier Résidence",
    ar: "تعديل الإقامة",
    en: "Edit Residence"
  },
  "supprimer résidence": {
    fr: "Supprimer Résidence",
    ar: "حذف الإقامة",
    en: "Delete Residence"
  },
  "admin responsable de la résidence": {
    fr: "Admin responsable de la résidence",
    ar: "المدير المسؤول عن الإقامة",
    en: "Admin responsible for the residence"
  },
  "sub admin responsable": {
    fr: "Sub Admin responsable",
    ar: "المسؤول المفوّض",
    en: "Responsible Sub-Admin"
  },
  "max bâtiments autorisés": {
    fr: "Max bâtiments autorisés",
    ar: "الحد الأقصى للعمارات المسموحة",
    en: "Max authorized buildings"
  },
  "max résidents autorisés": {
    fr: "Max résidents autorisés",
    ar: "الحد الأقصى للسكان المسموح به",
    en: "Max authorized residents"
  },
  "nom, localisation et quotas autorisés.": {
    fr: "Nom, localisation et quotas autorisés.",
    ar: "الاسم والموقع والحصص المسموحة.",
    en: "Name, location, and authorized quotas."
  },
  "créer la résidence": {
    fr: "Créer la résidence",
    ar: "إنشاء الإقامة",
    en: "Create residence"
  },
  "gestion globale des résidents et propriétaires de toutes les résidences.": {
    fr: "Gestion globale des résidents et propriétaires de toutes les résidences.",
    ar: "الإدارة الشاملة للمقيمين والملاك في كافة الإقامات.",
    en: "Global management of residents and co-owners across all residences."
  },
  "filtrer par résidence :": {
    fr: "Filtrer par résidence :",
    ar: "تصفية حسب الإقامة :",
    en: "Filter by residence:"
  },
  "filtrer par résidence": {
    fr: "Filtrer par résidence",
    ar: "تصفية حسب الإقامة",
    en: "Filter by residence"
  },
  "le résident est enregistré comme propriétaire et reçoit un accès à l'application mobile.": {
    fr: "Le résident est enregistré comme propriétaire et reçoit un accès à l'application mobile.",
    ar: "يتم تسجيل الساكن كمالك ويحصل على حساب للوصول إلى تطبيق الهاتف.",
    en: "The resident is registered as an owner and receives mobile app access."
  },
  "appartements libres dans ce bâtiment :": {
    fr: "Appartements libres dans ce bâtiment :",
    ar: "الشقق الشاغرة في هذه العمارة :",
    en: "Vacant apartments in this building:"
  },
  "un nom nouveau crée l'appartement.": {
    fr: "Un nom nouveau crée l'appartement.",
    ar: "كتابة اسم جديد ينشئ الشقة تلقائياً.",
    en: "A new name creates the apartment."
  },
  "l'appartement sera créé dans ce bâtiment à l'étage choisi.": {
    fr: "L'appartement sera créé dans ce bâtiment à l'étage choisi.",
    ar: "سيتم إنشاء الشقة في هذه العمارة في الطابق المحدد.",
    en: "The apartment will be created in this building on the chosen floor."
  },
  "8 à 15 chiffres, + facultatif": {
    fr: "8 à 15 chiffres, + facultatif",
    ar: "من 8 إلى 15 رقماً، علامة + اختيارية",
    en: "8 to 15 digits, + optional"
  },
  "encaissé :": {
    fr: "Encaissé :",
    ar: "المحصّل :",
    en: "Collected:"
  },
  "encaissé": {
    fr: "Encaissé",
    ar: "المحصّل",
    en: "Collected"
  },
  "appels :": {
    fr: "Appels :",
    ar: "المطالبات :",
    en: "Calls:"
  },
  "appels": {
    fr: "Appels",
    ar: "المطالبات",
    en: "Calls"
  },
  "solde actif": {
    fr: "Solde actif",
    ar: "رصيد إيجابي",
    en: "Active balance"
  },
  "bon niveau": {
    fr: "Bon niveau",
    ar: "مستوى جيد",
    en: "Good level"
  },
  "à surveiller": {
    fr: "À surveiller",
    ar: "يتطلب متابعة",
    en: "To monitor"
  },
  "retards constatés": {
    fr: "retards constatés",
    ar: "متأخرات مسجلة",
    en: "delays recorded"
  },
  "critiques": {
    fr: "critiques",
    ar: "حرجة",
    en: "critical"
  },
  "factures à payer": {
    fr: "factures à payer",
    ar: "فواتير قيد التسديد",
    en: "invoices to pay"
  },
  "aucun incident actif.": {
    fr: "Aucun incident actif.",
    ar: "لا توجد أي أعطال نشطة حالياً.",
    en: "No active incidents."
  },
  "assemblées générales & votes en ligne": {
    fr: "Assemblées Générales & Votes en Ligne",
    ar: "الجمعيات العامة والتصويت الإلكتروني",
    en: "General Assemblies & Online Voting"
  },
  "convocations des copropriétaires, calcul du quorum en tantièmes, vote des résolutions et pv certifié": {
    fr: "Convocations des copropriétaires, calcul du quorum en tantièmes, vote des résolutions et PV certifié",
    ar: "استدعاء الملاك وحساب نصاب الحصص الشائعة والتصويت على القرارات والمحاضر المعتمدة.",
    en: "Co-owner notices, quorum calculation in shares, resolution votes, and certified minutes."
  },
  "tantièmes": {
    fr: "Tantièmes",
    ar: "حصص شائعة",
    en: "Shares"
  },
  "quorum réuni": {
    fr: "Quorum Réuni",
    ar: "النصاب مكتمل",
    en: "Quorum Met"
  },
  "quorum non atteint": {
    fr: "Quorum Non Atteint",
    ar: "النصاب غير مكتمل",
    en: "Quorum Not Met"
  },
  "quorum légal réuni (art. 24)": {
    fr: "Quorum légal réuni (Art. 24)",
    ar: "اكتمل النصاب القانوني (المادة 24)",
    en: "Legal quorum reached (Art. 24)"
  },
  "quorum insuffisant (2e convocation)": {
    fr: "Quorum insuffisant (2e convocation)",
    ar: "نصاب غير كافٍ (دعوة ثانية)",
    en: "Insufficient quorum (2nd notice)"
  },
  "36 copropriétaires": {
    fr: "36 Copropriétaires",
    ar: "36 مالكاً مشتركاً",
    en: "36 Co-owners"
  },
  "présents en séance ou avec procuration": {
    fr: "Présents en séance ou avec procuration",
    ar: "حاضرون في الجلسة أو بوكالة",
    en: "Present in session or by proxy"
  },
  "résolution(s) en cours de délibération": {
    fr: "résolution(s) en cours de délibération",
    ar: "قرارات قيد التداول",
    en: "resolutions under deliberation"
  },
  "city syndic projection": {
    fr: "CITY SYNDIC PROJECTION",
    ar: "نظام العرض المرئي - سيتي سنديك",
    en: "CITY SYNDIC PROJECTION"
  },
  "séance en direct": {
    fr: "SÉANCE EN DIRECT",
    ar: "جلسة مباشرة",
    en: "LIVE SESSION"
  },
  "quorum constaté": {
    fr: "Quorum Constaté",
    ar: "النصاب المسجل",
    en: "Observed Quorum"
  },
  "quitter (échap)": {
    fr: "Quitter (Échap)",
    ar: "خروج (Esc)",
    en: "Exit (Esc)"
  },
  "votes pour": {
    fr: "VOTES POUR",
    ar: "الأصوات المؤيدة",
    en: "VOTES IN FAVOR"
  },
  "votes contre": {
    fr: "VOTES CONTRE",
    ar: "الأصوات المعارضة",
    en: "VOTES AGAINST"
  },
  "abstention": {
    fr: "ABSTENTION",
    ar: "امتناع",
    en: "ABSTENTION"
  },
  "copropriétaire(s)": {
    fr: "copropriétaire(s)",
    ar: "مالك(ون)",
    en: "co-owner(s)"
  },
  "résolution précédente": {
    fr: "Résolution Précédente",
    ar: "القرار السابق",
    en: "Previous Resolution"
  },
  "résolution suivante": {
    fr: "Résolution Suivante",
    ar: "القرار التالي",
    en: "Next Resolution"
  },
  "+ pour": {
    fr: "+ POUR",
    ar: "+ نعم (موافق)",
    en: "+ FOR"
  },
  "+ contre": {
    fr: "+ CONTRE",
    ar: "+ لا (معارض)",
    en: "+ AGAINST"
  },
  "+ abstention": {
    fr: "+ ABSTENTION",
    ar: "+ ممتنع",
    en: "+ ABSTAIN"
  },
  "comptabiliser un vote en direct (+25 tantièmes) :": {
    fr: "Comptabiliser un vote en direct (+25 tantièmes) :",
    ar: "تسجيل تصويت مباشر (+25 حصة) :",
    en: "Record live vote (+25 shares):"
  },
  "résolution": {
    fr: "Résolution",
    ar: "القرار",
    en: "Resolution"
  },
  "sur": {
    fr: "sur",
    ar: "من",
    en: "of"
  },
  "équipe de la résidence, horaires et suivi des tâches assignées": {
    fr: "Équipe de la résidence, horaires et suivi des tâches assignées",
    ar: "فريق الإقامة والمواعيد ومتابعة المهام الموكلة.",
    en: "Residence team, schedules, and assigned tasks tracking."
  },
  "nouvel employé": {
    fr: "Nouvel Employé",
    ar: "موظف جديد",
    en: "New Employee"
  },
  "nouvelle tâche": {
    fr: "Nouvelle Tâche",
    ar: "مهمة جديدة",
    en: "New Task"
  },
  "période des interventions": {
    fr: "Période des interventions",
    ar: "فترة التدخلات",
    en: "Interventions Period"
  },
  "tâches": {
    fr: "Tâches",
    ar: "مهام",
    en: "Tasks"
  },
  "personnel": {
    fr: "Personnel",
    ar: "الموظفون",
    en: "Staff"
  },
  "lieu": {
    fr: "Lieu",
    ar: "المكان",
    en: "Location"
  },
  "aucune tâche en cours.": {
    fr: "Aucune tâche en cours.",
    ar: "لا توجد أي مهام جارية حالياً.",
    en: "No ongoing tasks."
  },
  "contrats prestataires en vigueur": {
    fr: "Contrats prestataires en vigueur",
    ar: "عقود المتعاقدين السارية",
    en: "Contractor contracts in effect"
  },
  "engagements contractuels annuels": {
    fr: "Engagements contractuels annuels",
    ar: "الالتزامات التعاقدية السنوية",
    en: "Annual contractual commitments"
  },
  "contrat(s) expirant sous 60 jours ou échus": {
    fr: "Contrat(s) expirant sous 60 jours ou échus",
    ar: "عقود تنتهي خلال 60 يوماً أو منتهية",
    en: "Contract(s) expiring within 60 days or expired"
  },
  "actifs": {
    fr: "Actifs",
    ar: "نشطة",
    en: "Active"
  },
  "règlements": {
    fr: "Règlements",
    ar: "اللوائح",
    en: "Regulations"
  },
  "abonnement en cours": {
    fr: "Abonnement en cours",
    ar: "الاشتراك الحالي",
    en: "Current subscription"
  },
  "paiement": {
    fr: "Paiement",
    ar: "الدفع",
    en: "Payment"
  },
  "cible": {
    fr: "Cible",
    ar: "المستهدف",
    en: "Target"
  },
  "durée": {
    fr: "Durée",
    ar: "المدة",
    en: "Duration"
  },
  "1 an": {
    fr: "1 an",
    ar: "سنة واحدة",
    en: "1 year"
  },
  "modifier la formule": {
    fr: "Modifier la formule",
    ar: "تعديل الباقة",
    en: "Edit plan"
  },
  "supprimer la formule": {
    fr: "Supprimer la formule",
    ar: "حذف الباقة",
    en: "Delete plan"
  },
  "non attribuée": {
    fr: "Non attribuée",
    ar: "غير مخصصة",
    en: "Not assigned"
  },
  "statistiques": {
    fr: "Statistiques",
    ar: "الإحصائيات",
    en: "Statistics"
  },
  "vue d'ensemble de la plateforme, calculée en temps réel depuis la base de données.": {
    fr: "Vue d'ensemble de la plateforme, calculée en temps réel depuis la base de données.",
    ar: "نظرة شاملة على المنصة، محسوبة آنياً من قاعدة البيانات.",
    en: "Platform overview, computed in real time from the database."
  },
  "croissance de la plateforme (12 derniers mois, cumul)": {
    fr: "Croissance de la plateforme (12 derniers mois, cumul)",
    ar: "نمو المنصة (آخر 12 شهراً، تراكمي)",
    en: "Platform growth (last 12 months, cumulative)"
  },
  "revenus des abonnements payés, par mois de début (dzd)": {
    fr: "Revenus des abonnements payés, par mois de début (DZD)",
    ar: "مداخيل الاشتراكات المسددة شهرياً (د.ج)",
    en: "Paid subscription revenues by start month (DZD)"
  },
  "abonnements par mois de début": {
    fr: "Abonnements par mois de début",
    ar: "الاشتراكات حسب شهر البدء",
    en: "Subscriptions by start month"
  },
  "statut de paiement des abonnements": {
    fr: "Statut de paiement des abonnements",
    ar: "حالة سداد الاشتراكات",
    en: "Subscription payment status"
  },
  "comptes par rôle": {
    fr: "Comptes par rôle",
    ar: "الحسابات حسب الرتبة",
    en: "Accounts by role"
  },
  "occupation des appartements": {
    fr: "Occupation des appartements",
    ar: "إشغال الشقق",
    en: "Apartment occupancy"
  },
  "bâtiments par résidence": {
    fr: "Bâtiments par résidence",
    ar: "العمارات لكل إقامة",
    en: "Buildings per residence"
  },
  "abonnements par formule": {
    fr: "Abonnements par formule",
    ar: "الاشتراكات حسب الباقة",
    en: "Subscriptions by plan"
  },
  "utilisateurs": {
    fr: "Utilisateurs",
    ar: "المستخدمون",
    en: "Users"
  },
  "abonnements actifs": {
    fr: "Abonnements actifs",
    ar: "الاشتراكات النشطة",
    en: "Active subscriptions"
  },
  "en attente de paiement": {
    fr: "En attente de paiement",
    ar: "في انتظار الدفع",
    en: "Pending payment"
  },
  "0 abonnement(s) non payé(s)": {
    fr: "0 abonnement(s) non payé(s)",
    ar: "0 اشتراكات غير مسددة",
    en: "0 unpaid subscription(s)"
  },
  "abonnement(s) non payé(s)": {
    fr: "abonnement(s) non payé(s)",
    ar: "اشتراك(ات) غير مسددة",
    en: "unpaid subscription(s)"
  },
  "payés": {
    fr: "Payés",
    ar: "مسددة",
    en: "Paid"
  },
  "non payés": {
    fr: "Non payés",
    ar: "غير مسددة",
    en: "Unpaid"
  },
  "admins": {
    fr: "Admins",
    ar: "المديرون",
    en: "Admins"
  },
  "admins & sub admins": {
    fr: "Admins & Sub Admins",
    ar: "المديرون والمديرون المفوضون",
    en: "Admins & Sub-Admins"
  },
  "générez les états consolidés de l'ensemble de la plateforme saas en pdf ou excel.": {
    fr: "Générez les états consolidés de l'ensemble de la plateforme SaaS en PDF ou Excel.",
    ar: "إصدار التقارير الموحدة لكامل المنصة بصيغة PDF أو Excel.",
    en: "Generate consolidated platform reports in PDF or Excel."
  },
  "générez les rapports d'activité, charges et recouvrement de votre bâtiment.": {
    fr: "Générez les rapports d'activité, charges et recouvrement de votre bâtiment.",
    ar: "إصدار تقارير النشاط والأعباء والتحصيل لعمارتك.",
    en: "Generate activity, fees, and collection reports for your building."
  },
  "générez les états financiers, administratifs et opérationnels de votre résidence.": {
    fr: "Générez les états financiers, administratifs et opérationnels de votre résidence.",
    ar: "إصدار التقارير المالية والإدارية والتشغيلية لإقامتك.",
    en: "Generate financial, administrative, and operational reports for your residence."
  },
  "rapports disponibles": {
    fr: "Rapports disponibles",
    ar: "التقارير المتاحة",
    en: "Available reports"
  },
  "exports récents": {
    fr: "Exports récents",
    ar: "التصديرات الأخيرة",
    en: "Recent exports"
  },
  "plateforme": {
    fr: "Plateforme",
    ar: "المنصة",
    en: "Platform"
  },
  "finances saas": {
    fr: "Finances SaaS",
    ar: "مالية المنصة",
    en: "SaaS Finances"
  },
  "résidents": {
    fr: "Résidents",
    ar: "المقيمون",
    en: "Residents"
  },
  "sous-admins": {
    fr: "Sous-Admins",
    ar: "المديرون المفوضون",
    en: "Sub-Admins"
  },
  "audit global des résidences & quotas": {
    fr: "Audit Global des Résidences & Quotas",
    ar: "التدقيق الشامل للإقامات والحصص",
    en: "Global Residence & Quota Audit"
  },
  "inventaire national consolidé de toutes les résidences, quotas bâtiments et admins affectés.": {
    fr: "Inventaire national consolidé de toutes les résidences, quotas bâtiments et admins affectés.",
    ar: "الجرد الوطني الموحد لكافة الإقامات وحصص العمارات والمديرين المعينين.",
    en: "National consolidated inventory of all residences, building quotas, and assigned admins."
  },
  "trésorerie & abonnements plateforme": {
    fr: "Trésorerie & Abonnements Plateforme",
    ar: "السيولة واشتراكات المنصة",
    en: "Platform Treasury & Subscriptions"
  },
  "bilan global des souscriptions actives, impayées et revenus encaissés par formule saas.": {
    fr: "Bilan global des souscriptions actives, impayées et revenus encaissés par formule SaaS.",
    ar: "الحصيلة الشاملة للاشتراكات النشطة والمتأخرة والإيرادات المحصلة حسب الباقة.",
    en: "Global balance sheet of active/unpaid subscriptions and collected revenues by SaaS plan."
  },
  "suivi des licences sous-admins & blocs": {
    fr: "Suivi des Licences Sous-Admins & Blocs",
    ar: "متابعة تراخيص مسؤولي العمارات",
    en: "Sub-Admin & Block License Tracking"
  },
  "tous les sous-admins par bâtiment et statut de validation de leur abonnement de gestion.": {
    fr: "Tous les sous-admins par bâtiment et statut de validation de leur abonnement de gestion.",
    ar: "كافة مسؤولي العمارات وحالة اعتماد اشتراك التسيير الخاص بهم.",
    en: "All sub-admins by building and validation status of their management subscription."
  },
  "recouvrement de la résidence": {
    fr: "Recouvrement de la Résidence",
    ar: "تحصيل الإقامة",
    en: "Residence Recovery"
  },
  "charges attendues, encaissées et impayées ventilées par bâtiment.": {
    fr: "Charges attendues, encaissées et impayées ventilées par bâtiment.",
    ar: "الأعباء المتوقعة والمحصلة والمتأخرة مفصلة حسب العمارة.",
    en: "Expected, collected, and unpaid fees broken down by building."
  },
  "état des impayés résidence": {
    fr: "État des impayés Résidence",
    ar: "كشف متأخرات الإقامة",
    en: "Residence Overdue Dues Status"
  },
  "liste des logements en retard de cotisation avec ancienneté de la dette.": {
    fr: "Liste des logements en retard de cotisation avec ancienneté de la dette.",
    ar: "قائمة الشقق المتأخرة عن سداد الاشتراكات مع أقدمية الدين.",
    en: "List of units with overdue fees along with debt aging."
  },
  "journal des dépenses & factures": {
    fr: "Journal des dépenses & factures",
    ar: "دفتر النفقات والفواتير",
    en: "Expenses & Invoices Journal"
  },
  "toutes les dépenses de la copropriété par catégorie et par prestataire.": {
    fr: "Toutes les dépenses de la copropriété par catégorie et par prestataire.",
    ar: "كافة نفقات الملكية المشتركة حسب الفئة ومقدم الخدمة.",
    en: "All co-ownership expenses categorized by type and contractor."
  },
  "mon profil": {
    fr: "Mon profil",
    ar: "ملفي الشخصي",
    en: "My profile"
  },
  "informations de votre compte et rôle sur la plateforme.": {
    fr: "Informations de votre compte et rôle sur la plateforme.",
    ar: "معلومات حسابك ورتبتك على المنصة.",
    en: "Account information and platform role."
  },
  "membre depuis": {
    fr: "Membre depuis",
    ar: "عضو منذ",
    en: "Member since"
  },
  "les super admins ont un accès complet à la plateforme.": {
    fr: "Les Super Admins ont un accès complet à la plateforme.",
    ar: "يمتلك المشرفون العامون صلاحيات وصول كاملة للمنصة.",
    en: "Super Admins have full access to the platform."
  },
  "vous": {
    fr: "Vous",
    ar: "أنت",
    en: "You"
  },
  "types de charges": {
    fr: "Types de charges",
    ar: "أنواع الأعباء",
    en: "Charge Types"
  },
  "types d'incidents": {
    fr: "Types d'incidents",
    ar: "أنواع الأعطال",
    en: "Incident Types"
  },
  "type de charge": {
    fr: "Type de charge",
    ar: "نوع العبء",
    en: "Charge Type"
  },
  "appliqué à": {
    fr: "Appliqué à",
    ar: "مطبق على",
    en: "Applied to"
  },
  "aucun type de charge configuré.": {
    fr: "Aucun type de charge configuré.",
    ar: "لم يتم ضبط أي نوع من الأعباء بعد.",
    en: "No charge type configured."
  },
  "aucun type d'incident configuré.": {
    fr: "Aucun type d'incident configuré.",
    ar: "لم يتم ضبط أي نوع من الأعطال بعد.",
    en: "No incident type configured."
  },

  // === SYNDIC DETAILED DASHBOARD FIXES ===
  "bâtiments & sous-admins délégués": {
    fr: "Bâtiments & Sous-Admins Délégués",
    ar: "العمارات والمسؤولون المفوّضون",
    en: "Buildings & Delegated Sub-Admins"
  },
  "nomination et suivi des responsables par bloc": {
    fr: "Nomination et suivi des responsables par bloc",
    ar: "تعيين ومتابعة المسؤولين لكل عمارة",
    en: "Nomination and monitoring of managers per block"
  },
  "logements": {
    fr: "Logements",
    ar: "الشقق",
    en: "Units"
  },
  "sous-admin délégué": {
    fr: "Sous-Admin Délégué",
    ar: "المسؤول المفوّض",
    en: "Delegated Sub-Admin"
  },
  "apts": {
    fr: "apts",
    ar: "شقق",
    en: "apts"
  },
  "accéder aux tableaux détaillés des blocs et appartements": {
    fr: "Accéder aux tableaux détaillés des blocs et appartements",
    ar: "الاطلاع على الجداول التفصيلية للكتل والشقق",
    en: "Access detailed tables of blocks and apartments"
  },
  "finances & derniers règlements": {
    fr: "Finances & Derniers Règlements",
    ar: "المالية وآخر المدفوعات",
    en: "Finances & Latest Payments"
  },
  "recouvrement des charges et cotisations": {
    fr: "Recouvrement des charges et cotisations",
    ar: "تحصيل الأعباء والاشتراكات",
    en: "Collection of dues and fees"
  },
  "dépenses": {
    fr: "Dépenses",
    ar: "المصاريف",
    en: "Expenses"
  },
  "factures serv.": {
    fr: "Factures Serv.",
    ar: "فواتير الخدمات",
    en: "Service Invoices"
  },
  "derniers règlements enregistrés": {
    fr: "Derniers règlements enregistrés",
    ar: "آخر عمليات التسديد المسجلة",
    en: "Latest recorded payments"
  },
  "aucun paiement enregistré pour l'instant.": {
    fr: "Aucun paiement enregistré pour l'instant.",
    ar: "لا توجد أي دفعة مسجلة حالياً.",
    en: "No payments recorded yet."
  },
  "consulter l'historique complet": {
    fr: "Consulter l'historique complet",
    ar: "الاطلاع على السجل الكامل",
    en: "View full history"
  },
  "encaissements": {
    fr: "encaissements",
    ar: "عمليات تحصيل",
    en: "collections"
  },
  "gouvernance & assemblée générale": {
    fr: "Gouvernance & Assemblée Générale",
    ar: "الحوكمة والجمعية العامة",
    en: "Governance & General Assembly"
  },
  "délibérations, votes des copropriétaires & quorum": {
    fr: "Délibérations, votes des copropriétaires & quorum",
    ar: "المداولات، تصويت الملاك المشتركين والنصاب القانوني",
    en: "Deliberations, co-owner votes & quorum"
  },
  "prochaine session": {
    fr: "Prochaine Session",
    ar: "الجلسة القادمة",
    en: "Next Session"
  },
  "novembre": {
    fr: "Novembre",
    ar: "نوفمبر",
    en: "November"
  },
  "hall d'honneur & salle polyvalente - bloc a": {
    fr: "Hall d'Honneur & Salle Polyvalente - Bloc A",
    ar: "البهو الشرفي والقاعة متعددة النشاطات - العمارة A",
    en: "Main Hall & Multipurpose Room - Block A"
  },
  "quorum des tantièmes atteint": {
    fr: "Quorum des tantièmes atteint",
    ar: "تم بلوغ نصاب الحصص الشائعة",
    en: "Share quorum reached"
  },
  "procès-verbal (pv) certifié conforme": {
    fr: "Procès-verbal (PV) certifié conforme",
    ar: "محضر الجمعية العامة معتمد ومطابق",
    en: "Certified conforming minutes (PV)"
  },
  "accéder aux résolutions et résultats de vote": {
    fr: "Accéder aux résolutions et résultats de vote",
    ar: "الاطلاع على القرارات ونتائج التصويت",
    en: "Access resolutions and voting results"
  },
  "maintenance & équipements": {
    fr: "Maintenance & Équipements",
    ar: "الصيانة والتجهيزات",
    en: "Maintenance & Equipment"
  },
  "incidents en cours et pannes matérielles": {
    fr: "Incidents en cours et pannes matérielles",
    ar: "الأعطال الجارية ومشاكل التجهيزات",
    en: "Ongoing incidents and hardware breakdowns"
  },
  "incidents": {
    fr: "Incidents",
    ar: "الأعطال",
    en: "Incidents"
  },
  "déclarés": {
    fr: "déclarés",
    ar: "مسجلة",
    en: "reported"
  },
  "pannes": {
    fr: "Pannes",
    ar: "أعطال الأجهزة",
    en: "Breakdowns"
  },
  "réglés": {
    fr: "réglés",
    ar: "تم حلها",
    en: "resolved"
  },
  "incidents & urgences récentes": {
    fr: "Incidents & urgences récentes",
    ar: "الأعطال والطوارئ الأخيرة",
    en: "Recent incidents & emergencies"
  },
  "aucun incident actif dans la résidence. tout fonctionne normalement.": {
    fr: "Aucun incident actif dans la résidence. Tout fonctionne normalement.",
    ar: "لا توجد أي أعطال نشطة في الإقامة. كل المرافق تعمل بشكل طبيعي.",
    en: "No active incidents in the residence. Everything is operating normally."
  },
  "prestataire :": {
    fr: "Prestataire :",
    ar: "مقدم الخدمة :",
    en: "Contractor:"
  },
  "ouvrir le registre des interventions": {
    fr: "Ouvrir le registre des interventions",
    ar: "فتح سجل التدخلات",
    en: "Open interventions registry"
  },
  "voir toutes les alertes": {
    fr: "Voir toutes les alertes",
    ar: "عرض كل التنبيهات",
    en: "View all alerts"
  },
  "aucun résident inscrit pour le moment.": {
    fr: "Aucun résident inscrit pour le moment.",
    ar: "لا يوجد أي ساكن مسجل حالياً.",
    en: "No residents registered yet."
  },
  "annuaire complet": {
    fr: "Annuaire complet",
    ar: "الدليل الشامل",
    en: "Complete Directory"
  },
  "agents en service": {
    fr: "Agents en service",
    ar: "العمال المناوبون",
    en: "On-duty staff"
  },
  "aucune tâche assignée pour le moment.": {
    fr: "Aucune tâche assignée pour le moment.",
    ar: "لا توجد أي مهام موكلة حالياً.",
    en: "No tasks assigned yet."
  },
  "assigné à": {
    fr: "Assigné à",
    ar: "معين إلى",
    en: "Assigned to"
  },
  "plan de travail": {
    fr: "Plan de travail",
    ar: "جدول العمل",
    en: "Work plan"
  },
  "à faire": {
    fr: "à faire",
    ar: "قيد الإنجاز",
    en: "to do"
  },
  "contrats prestataires clés": {
    fr: "Contrats Prestataires Clés",
    ar: "عقود المتعاقدين الرئيسية",
    en: "Key Contractor Contracts"
  },
  "ascenseurs, gardiennage, sécurité & nettoyage": {
    fr: "Ascenseurs, gardiennage, sécurité & nettoyage",
    ar: "المصاعد، الحراسة، الأمن والنظافة",
    en: "Elevators, concierge, security & cleaning"
  },
  "aucun contrat prestataire archivé.": {
    fr: "Aucun contrat prestataire archivé.",
    ar: "لا توجد عقود متعاقدين مؤرشفة.",
    en: "No contractor contracts archived."
  },
  "échéance :": {
    fr: "Échéance :",
    ar: "تاريخ الانتهاء :",
    en: "Expires:"
  },
  "accéder aux documents & archives": {
    fr: "Accéder aux documents & archives",
    ar: "الاطلاع على الوثائق والأرشيف",
    en: "Access documents & archives"
  },
  "modes de règlement & paramètres": {
    fr: "Modes de Règlement & Paramètres",
    ar: "طرق الدفع والإعدادات",
    en: "Payment Methods & Settings"
  },
  "canaux de paiement et barèmes de charges": {
    fr: "Canaux de paiement et barèmes de charges",
    ar: "قنوات الدفع وجداول الأعباء",
    en: "Payment channels and dues scales"
  },
  "canaux de paiement acceptés": {
    fr: "Canaux de paiement acceptés",
    ar: "قنوات الدفع المعتمدة",
    en: "Accepted payment channels"
  },
  "modes standard activés : cib, edahabia, baridimob, virement, espèces": {
    fr: "Modes standard activés : CIB, Edahabia, BaridiMob, Virement, Espèces",
    ar: "الطرق القياسية المفعلة : CIB، الذهبية، بريدي موب، تحويل بنكي، نقداً",
    en: "Standard active methods: CIB, Edahabia, BaridiMob, Bank transfer, Cash"
  },
  "rapports & exports rapides": {
    fr: "Rapports & Exports Rapides",
    ar: "تقارير وتصدير سريع",
    en: "Quick Reports & Exports"
  },
  "bilan financier (csv)": {
    fr: "Bilan Financier (CSV)",
    ar: "الحصيلة المالية (CSV)",
    en: "Financial Balance (CSV)"
  },
  "annuaire copropriétaires": {
    fr: "Annuaire Copropriétaires",
    ar: "دليل الملاك المشتركين",
    en: "Co-owners Directory"
  },
  "modifier les types de charges et délais sla": {
    fr: "Modifier les types de charges et délais SLA",
    ar: "تعديل أنواع الأعباء وآجال التدخل SLA",
    en: "Edit charge types and SLA response times"
  },
  "carte edahabia (algérie poste)": {
    fr: "Carte Edahabia (Algérie Poste)",
    ar: "البطاقة الذهبية (بريد الجزائر)",
    en: "Edahabia Card (Algeria Post)"
  },
  "carte cib (banques algériennes)": {
    fr: "Carte CIB (Banques algériennes)",
    ar: "بطاقة CIB (البنوك الجزائرية)",
    en: "CIB Card (Algerian Banks)"
  },
  "virement bancaire / ccp": {
    fr: "Virement bancaire / CCP",
    ar: "تحويل بنكي / CCP",
    en: "Bank Transfer / CCP"
  },
  "paiement en espèces au bureau du syndic": {
    fr: "Paiement en espèces au bureau du syndic",
    ar: "الدفع نقداً في مكتب وكيل العمارة",
    en: "Cash payment at syndic office"
  },

  // === DEEP SECONDARY KEYS FIXES ===
  "mode vidéoprojection →": {
    fr: "Mode Vidéoprojection →",
    ar: "وضع العرض المرئي ←",
    en: "Video Projection Mode →"
  },
  "signaler un problème": {
    fr: "Signaler un problème",
    ar: "الإبلاغ عن مشكلة",
    en: "Report an issue"
  },
  "signaler un problème →": {
    fr: "Signaler un problème →",
    ar: "الإبلاغ عن مشكلة ←",
    en: "Report an issue →"
  },
  "incidents & pannes du": {
    fr: "Incidents & Pannes du",
    ar: "أعطال ومشاكل",
    en: "Incidents & Breakdowns of"
  },
  "ascenseur, éclairage du hall, pompes et parties communes": {
    fr: "Ascenseur, éclairage du hall, pompes et parties communes",
    ar: "المصعد، إنارة البهو، المضخات والأجزاء المشتركة",
    en: "Elevator, hall lighting, pumps and common areas"
  },
  "aucun incident ouvert sur ce bâtiment. équipements opérationnels.": {
    fr: "Aucun incident ouvert sur ce bâtiment. Équipements opérationnels.",
    ar: "لا توجد أي أعطال نشطة في هذا المبنى. جميع التجهيزات تعمل بصورة جيدة.",
    en: "No open incidents in this building. Equipment is fully operational."
  },
  "emplacement": {
    fr: "Emplacement",
    ar: "الموقع",
    en: "Location"
  },
  "prestataire / intervenant": {
    fr: "Prestataire / Intervenant",
    ar: "مقدم الخدمة / المتدخل",
    en: "Contractor / Worker"
  },
  "équipement(s) sous surveillance technique": {
    fr: "équipement(s) sous surveillance technique",
    ar: "تجهيزات تحت المراقبة التقنية",
    en: "equipment under technical monitoring"
  },
  "ouvrir le registre de maintenance": {
    fr: "Ouvrir le registre de maintenance",
    ar: "فتح سجل الصيانة",
    en: "Open maintenance log"
  },
  "pièce": {
    fr: "pièce",
    ar: "وثيقة",
    en: "document"
  },
  "apt": {
    fr: "Apt",
    ar: "شقة",
    en: "Apt"
  },
  "espèces": {
    fr: "Espèces",
    ar: "نقداً",
    en: "Cash"
  },
  "especes": {
    fr: "Espèces",
    ar: "نقداً",
    en: "Cash"
  },
  "virement": {
    fr: "Virement",
    ar: "تحويل بنكي",
    en: "Bank Transfer"
  },
  "chèque": {
    fr: "Chèque",
    ar: "شيك",
    en: "Check"
  },
  "cheque": {
    fr: "Chèque",
    ar: "شيك",
    en: "Check"
  },
  "carte": {
    fr: "Carte",
    ar: "بطاقة",
    en: "Card"
  },
  "bloc": {
    fr: "Bloc",
    ar: "العمارة",
    en: "Block"
  },
  "bloc a": {
    fr: "Bloc A",
    ar: "العمارة A",
    en: "Block A"
  },
  "bloc b": {
    fr: "Bloc B",
    ar: "العمارة B",
    en: "Block B"
  },
  "bloc c": {
    fr: "Bloc C",
    ar: "العمارة C",
    en: "Block C"
  },
  "bloc d": {
    fr: "Bloc D",
    ar: "العمارة D",
    en: "Block D"
  },
  "bloc t": {
    fr: "Bloc T",
    ar: "العمارة T",
    en: "Block T"
  },
  "serrure porte principale bloc t coincée": {
    fr: "Serrure porte principale Bloc T coincée",
    ar: "قفل الباب الرئيسي للعمارة T معطل",
    en: "Block T main door lock jammed"
  },
  "entrée principale bloc t": {
    fr: "Entrée principale Bloc T",
    ar: "المدخل الرئيسي للعمارة T",
    en: "Main entrance Block T"
  },
  "interphone en panne bloc b": {
    fr: "Interphone en panne Bloc B",
    ar: "الإنترفون معطل في العمارة B",
    en: "Intercom broken in Block B"
  },
  "hall bloc b": {
    fr: "Hall Bloc B",
    ar: "بهو العمارة B",
    en: "Hallway Block B"
  },
  "fuite d'eau colonne bloc t": {
    fr: "Fuite d'eau colonne Bloc T",
    ar: "تسرب مياه في عمود العمارة T",
    en: "Water leak in Block T column"
  },
  "cage d'escalier 2e étage": {
    fr: "Cage d'escalier 2e étage",
    ar: "بيت السلالم الطابق الثاني",
    en: "Stairwell 2nd floor"
  },
  "intervention : serrure porte principale bloc t coincée": {
    fr: "Intervention : Serrure porte principale Bloc T coincée",
    ar: "تدخل : قفل الباب الرئيسي للعمارة T معطل",
    en: "Intervention: Block T main door lock jammed"
  },
  "vérification des extincteurs bloc t": {
    fr: "Vérification des extincteurs Bloc T",
    ar: "فحص طفايات الحريق العمارة T",
    en: "Fire extinguishers check Block T"
  },
  "vérification des éclairages bloc b": {
    fr: "Vérification des éclairages Bloc B",
    ar: "فحص الإنارة العمارة B",
    en: "Lighting inspection Block B"
  },
  "bloc t paliers 1 à 4": {
    fr: "Bloc T Paliers 1 à 4",
    ar: "العمارة T الطوابق 1 إلى 4",
    en: "Block T landings 1 to 4"
  },
  "bloc b escaliers": {
    fr: "Bloc B Escaliers",
    ar: "العمارة B السلالم",
    en: "Block B stairs"
  },
  "équipe entretien": {
    fr: "Équipe Entretien",
    ar: "فريق الصيانة",
    en: "Maintenance Team"
  },
  "coupure d'eau temporaire": {
    fr: "Coupure d'eau temporaire",
    ar: "انقطاع مؤقت للمياه",
    en: "Temporary water outage"
  },
  "coupure générale programmée par la seaal de 14h à 18h pour réparations sur le réseau principal.": {
    fr: "Coupure générale programmée par la SEAAL de 14h à 18h pour réparations sur le réseau principal.",
    ar: "انقطاع عام مبرمج من طرف سيال من 14:00 إلى 18:00 لإجراء تصليحات على الشبكة الرئيسية.",
    en: "General water outage scheduled by SEAAL from 2:00 PM to 6:00 PM for main network repairs."
  },
  "mourad gardien": {
    fr: "Mourad Gardien",
    ar: "مراد الحارس",
    en: "Mourad Guard"
  },
  "sarl électricité générale": {
    fr: "SARL Électricité générale",
    ar: "ش.ذ.م.م كهرباء عامة",
    en: "General Electricity LLC"
  },
  "sarl plomberie express": {
    fr: "SARL Plomberie Express",
    ar: "ش.ذ.م.م ترصيص سريع",
    en: "Plumbing Express LLC"
  },

  // === HERO & TOP BAR KEYS FIXES ===
  "appartements au total": {
    fr: "appartements au total",
    ar: "شقة إجمالاً",
    en: "apartments in total"
  },
  "responsable connecté :": {
    fr: "Responsable connecté :",
    ar: "المسؤول المتصل :",
    en: "Logged in manager:"
  },
  "nouveau résident": {
    fr: "Nouveau Résident",
    ar: "ساكن جديد",
    en: "New Resident"
  },
  "impayés :": {
    fr: "Impayés :",
    ar: "المتأخرات :",
    en: "Unpaid dues:"
  },
  "occupation": {
    fr: "Occupation",
    ar: "نسبة الإشغال",
    en: "Occupancy"
  },
  "contrats": {
    fr: "contrats",
    ar: "عقود",
    en: "contracts"
  },
  "contrat": {
    fr: "contrat",
    ar: "عقد",
    en: "contract"
  },
  "1 an standard · payé": {
    fr: "1 an standard · Payé",
    ar: "سنة واحدة قياسي · مدفوع",
    en: "1 year standard · Paid"
  },
};

// Fast lookup helper
export function translateText(str: string, locale: Locale): string {
  if (!str || typeof str !== "string") return str || "";
  const trimmed = str.trim();
  const lower = trimmed.toLowerCase();

  // 1. Direct lowercase match
  const entry = TRANSLATIONS_MAP[lower];
  if (entry) {
    return entry[locale] || entry.fr || str;
  }

  // 2. Exact match with colon or punctuation
  const withoutColon = lower.replace(/[\s:]+$/, "");
  const entryWithoutColon = TRANSLATIONS_MAP[withoutColon];
  if (entryWithoutColon) {
    const hasColon = trimmed.endsWith(":") || trimmed.endsWith(" :") || trimmed.includes(":");
    const translated = entryWithoutColon[locale] || entryWithoutColon.fr || str;
    return hasColon ? `${translated} :` : translated;
  }

  // 3. Fallback to original
  return str;
}

