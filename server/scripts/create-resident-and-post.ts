// Script to create a new resident and publish a post based on existing users/residence data.
// Usage: bun run scripts/create-resident-and-post.ts [prenom] [nom] [email] [password]

import { connectMongo, disconnectMongo } from "../db/mongoose";
import { User } from "../models/User";
import { Residence } from "../models/Residence";
import { Batiment } from "../models/Batiment";
import { Appartement } from "../models/Appartement";
import { Annonce } from "../models/Annonce";
import { hashPassword } from "../services/auth.service";
import { isLoginEmailTaken } from "../services/account.service";

async function main() {
  console.log("=================================================");
  console.log("🏢 City - Create Resident & Post Script");
  console.log("=================================================\n");

  await connectMongo();

  try {
    // 1. Fetch existing users and residence context
    const existingUser = await User.findOne().sort({ createdAt: -1 });

    let idResidence = existingUser?.idResidence;
    let idBatiment = existingUser?.idBatiment;

    // Fallback if no user has residence set
    if (!idResidence) {
      const residence = await Residence.findOne();
      if (!residence) {
        console.error("❌ Erreur : Aucune résidence trouvée dans la base de données. Créez d'abord une résidence.");
        process.exitCode = 1;
        return;
      }
      idResidence = residence._id;
    }

    if (!idBatiment) {
      const batiment = await Batiment.findOne({ idResidence });
      if (!batiment) {
        console.error("❌ Erreur : Aucun bâtiment trouvé pour cette résidence.");
        process.exitCode = 1;
        return;
      }
      idBatiment = batiment._id;
    }

    const [residenceDoc, batimentDoc] = await Promise.all([
      Residence.findById(idResidence),
      Batiment.findById(idBatiment),
    ]);

    console.log(`📍 Résidence trouvée : ${residenceDoc?.nom || idResidence} (${residenceDoc?.localisation || "Alger"})`);
    console.log(`🏢 Bâtiment trouvé  : ${batimentDoc?.nom || idBatiment} (Étages : ${batimentDoc?.etages || 5})`);
    if (existingUser) {
      console.log(`👤 Résident de référence existant : ${existingUser.prenom} ${existingUser.nom} (${existingUser.email})`);
    }

    // 2. Determine new resident details
    const args = process.argv.slice(2);
    const prenom = args[0] || "Yacine";
    const nom = args[1] || "Benali";
    let baseEmail = (args[2] || `${prenom.toLowerCase()}.${nom.toLowerCase()}@city.dz`).toLowerCase();
    const rawPassword = args[3] || "Password123!";

    // Ensure unique email if run multiple times
    let email = baseEmail;
    let emailCounter = 1;
    while (await isLoginEmailTaken(email)) {
      emailCounter++;
      const [namePart, domain] = baseEmail.split("@");
      email = `${namePart}${emailCounter}@${domain}`;
    }

    // Generate unique 18-digit Algerian NIN (e.g. 1990 + random 14 digits)
    let nin = "";
    let ninTaken = true;
    while (ninTaken) {
      const randomDigits = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
      nin = `1990${randomDigits}`;
      ninTaken = Boolean(await User.exists({ nin }));
    }

    // Generate unique phone number
    const telephone = `0555${Math.floor(100000 + Math.random() * 900000)}`;

    // 3. Find or create an apartment for the new resident
    const allFlats = await Appartement.find({ idBatiment });
    let appartementDoc = allFlats.find((f) => !f.idProprietaire);

    if (!appartementDoc) {
      const flatNum = allFlats.length + 1;
      const flatName = `A${flatNum < 10 ? "0" + flatNum : flatNum}`;
      const flatFloor = Math.min(flatNum % (batimentDoc?.etages || 5), batimentDoc?.etages || 1);

      appartementDoc = await Appartement.create({
        idBatiment,
        nom: flatName,
        etage: flatFloor,
      });
      console.log(`🏠 Nouvel appartement créé : ${appartementDoc.nom} (Étage ${appartementDoc.etage})`);
    } else {
      console.log(`🏠 Appartement vacant réutilisé : ${appartementDoc.nom} (Étage ${appartementDoc.etage})`);
    }

    // 4. Create the new Resident
    const motDePasseHash = await hashPassword(rawPassword);
    const newUser = await User.create({
      prenom,
      nom,
      email,
      telephone,
      nin,
      motDePasseHash,
      idResidence,
      idBatiment,
      idAppartement: appartementDoc._id,
      pushTokens: [],
    });

    // Link owner to apartment
    appartementDoc.idProprietaire = newUser._id;
    await appartementDoc.save();

    console.log("\n✅ Nouveau Résident créé avec succès !");
    console.log(`   - ID         : ${newUser._id}`);
    console.log(`   - Nom        : ${newUser.prenom} ${newUser.nom}`);
    console.log(`   - Email      : ${newUser.email}`);
    console.log(`   - Téléphone  : ${newUser.telephone}`);
    console.log(`   - NIN        : ${newUser.nin}`);
    console.log(`   - Logement   : Bât. ${batimentDoc?.nom || "A"}, Apt. ${appartementDoc.nom} (Étage ${appartementDoc.etage})`);
    console.log(`   - Mot de passe de connexion : ${rawPassword}`);

    // 5. Create a new Post / Annonce for this residence
    const today = new Date().toLocaleDateString("fr-FR");
    const postTitle = `Bienvenue à ${newUser.prenom} ${newUser.nom} dans la résidence !`;
    const postContent = `Nous souhaitons la bienvenue à ${newUser.prenom} ${newUser.nom} qui vient d'emménager au bâtiment ${batimentDoc?.nom || "A9"} (Appt ${appartementDoc.nom}). N'hésitez pas à lui souhaiter la bienvenue via la discussion de la résidence ! 🎉`;

    const newPost = await Annonce.create({
      idResidence,
      titre: postTitle,
      contenu: postContent,
      audience: "Tous les résidents",
      canaux: ["Application", "Affichage"],
      date: today,
      isAlerte: false,
      epinglee: false,
    });

    console.log("\n📢 Nouveau Post / Annonce publié avec succès !");
    console.log(`   - ID         : ${newPost._id}`);
    console.log(`   - Titre      : ${newPost.titre}`);
    console.log(`   - Date       : ${newPost.date}`);
    console.log(`   - Audience   : ${newPost.audience}`);
    console.log(`   - Contenu    : "${newPost.contenu}"`);

    console.log("\n=================================================");
    console.log("🚀 Opération terminée avec succès !");
    console.log("Vous pouvez maintenant :");
    console.log(`1. Vous connecter à l'application mobile (city-app) avec :`);
    console.log(`   Email    : ${newUser.email}`);
    console.log(`   Password : ${rawPassword}`);
    console.log(`2. Consulter la publication sur le fil d'actualité ou dans le tableau de bord admin.`);
    console.log("=================================================\n");
  } catch (error) {
    console.error("❌ Erreur pendant l'exécution du script :", error);
    process.exitCode = 1;
  } finally {
    await disconnectMongo();
  }
}

void main();
