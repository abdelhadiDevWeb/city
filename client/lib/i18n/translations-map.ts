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

