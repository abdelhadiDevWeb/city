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
  }
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

