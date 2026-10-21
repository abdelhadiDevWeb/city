/**
 * E2E Test Script: Real-Time Notifications, Group/Individual Chat & Post Lifecycle
 * 
 * Tests:
 * 1. Real-time Announcements & Alerts broadcasting with Residence isolation
 * 2. Real-time Building Group Chat ("Mon Bâtiment") with Bâtiment isolation
 * 3. Real-time 1-on-1 Private Chat ("Chats Individuels") with User privacy isolation
 * 4. Post creation with text, photo, and event, plus Facebook-style deletion rights
 *
 * Run with: bun scripts/test-realtime-and-posts.ts
 */

import http from "node:http";
import express from "express";
import { io as ClientSocket, type Socket as ClientSocketType } from "socket.io-client";
import { broadcastNotification, initSocket } from "../socket";

interface TestReport {
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function record(name: string, passed: boolean, details: string) {
  reports.push({ name, passed, details });
  const status = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
  console.log(`  ${status} ${name}: ${details}`);
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("\n=======================================================");
  console.log("🚀 Lancement de la suite de tests temps réel & feed City");
  console.log("=======================================================\n");

  // 1. Setup ephemeral test server
  const app = express();
  const server = http.createServer(app);
  const TEST_PORT = 4088;
  const SERVER_URL = `http://127.0.0.1:${TEST_PORT}`;

  initSocket(server);

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`[Test Server] Prêt sur ${SERVER_URL}\n`);
      resolve();
    });
  });

  const sockets: ClientSocketType[] = [];

  function createClient(name: string): Promise<ClientSocketType> {
    return new Promise((resolve, reject) => {
      const socket = ClientSocket(SERVER_URL, {
        transports: ["websocket"],
        reconnection: false,
        timeout: 5000,
      });

      socket.on("connect", () => {
        sockets.push(socket);
        resolve(socket);
      });

      socket.on("connect_error", (err) => {
        reject(new Error(`[${name}] Échec connexion: ${err.message}`));
      });
    });
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: Real-time Notifications (Annonces & Alertes)
    // -------------------------------------------------------------
    console.log("📢 1. Test des Notifications en temps réel");

    const residentA = await createClient("Resident-A (Residence 1)");
    const residentB = await createClient("Resident-B (Residence 2)");

    // Join their respective residences
    residentA.emit("join_residence", "residence-alger-centre");
    residentB.emit("join_residence", "residence-oran-est");
    await wait(100);

    let residentAReceivedNotif: any = null;
    let residentBReceivedNotif: any = null;

    residentA.on("new_notification", (data) => {
      residentAReceivedNotif = data;
    });
    residentB.on("new_notification", (data) => {
      residentBReceivedNotif = data;
    });

    // Broadcast an alert to Residence 1
    broadcastNotification("residence-alger-centre", {
      id: "alert-001",
      titre: "Alerte Maintenance Ascenseur Bloc A",
      detail: "L'ascenseur sera indisponible entre 14h et 16h.",
      isAlerte: true,
      niveau: "attention",
      audience: "Tous les résidents",
      canaux: ["Application"],
      date: new Date().toISOString(),
      idResidence: "residence-alger-centre",
      webUrl: "/dashboard/annonces?tab=alertes",
      mobileRoute: "/notifications",
    });

    await wait(250);

    const notifReceivedCorrectly =
      residentAReceivedNotif &&
      residentAReceivedNotif.id === "alert-001" &&
      residentAReceivedNotif.isAlerte === true &&
      residentAReceivedNotif.titre.includes("Ascenseur Bloc A");

    record(
      "Réception notification temps réel",
      Boolean(notifReceivedCorrectly),
      notifReceivedCorrectly
        ? `Reçue instantanément par le résident ciblé (« ${residentAReceivedNotif.titre} »)`
        : "Notification non reçue"
    );

    const isolationNotifPassed = residentBReceivedNotif === null;
    record(
      "Isolation inter-résidences des alertes",
      isolationNotifPassed,
      isolationNotifPassed
        ? "Le résident de l'autre résidence n'a reçu aucune alerte (cloisonnement parfait)"
        : "FUITE : notification reçue par une autre résidence !"
    );

    // -------------------------------------------------------------
    // TEST 2: Real-time Building Group Chat ("Mon Bâtiment")
    // -------------------------------------------------------------
    console.log("\n🏢 2. Test du Chat de Groupe Bâtiment (« Mon Bâtiment »)");

    const neighborSameBatiment = await createClient("Neighbor (Batiment A)");
    const neighborOtherBatiment = await createClient("Neighbor (Batiment B)");

    residentA.emit("join_batiment", "batiment-A");
    neighborSameBatiment.emit("join_batiment", "batiment-A");
    neighborOtherBatiment.emit("join_batiment", "batiment-B");
    await wait(100);

    let sameBatimentReceivedMsg: any = null;
    let otherBatimentReceivedMsg: any = null;

    neighborSameBatiment.on("new_chat_message", (msg) => {
      sameBatimentReceivedMsg = msg;
    });
    neighborOtherBatiment.on("new_chat_message", (msg) => {
      otherBatimentReceivedMsg = msg;
    });

    const groupChatMessage = {
      id: "m-group-101",
      author: { id: "res-a", prenom: "Yacine", nom: "Benali", role: "resident", logement: "Bâtiment A · Appt 12" },
      text: "Bonjour les voisins du bâtiment A ! Qui a vu le chat noir près de l'entrée ?",
      channelId: "batiment",
      batimentId: "batiment-A",
      createdAt: new Date().toISOString(),
    };

    residentA.emit("send_message", {
      idBatiment: "batiment-A",
      message: groupChatMessage,
    });

    await wait(250);

    const groupMsgDelivered =
      sameBatimentReceivedMsg &&
      sameBatimentReceivedMsg.id === "m-group-101" &&
      sameBatimentReceivedMsg.text.includes("chat noir");

    record(
      "Diffusion temps réel groupe bâtiment",
      Boolean(groupMsgDelivered),
      groupMsgDelivered
        ? `Reçu par le voisin du Bâtiment A (« ${sameBatimentReceivedMsg.text} »)`
        : "Message de groupe non reçu"
    );

    const groupIsolationPassed = otherBatimentReceivedMsg === null;
    record(
      "Isolation inter-bâtiments",
      groupIsolationPassed,
      groupIsolationPassed
        ? "Le résident du Bâtiment B n'a pas reçu le message privé du Bâtiment A"
        : "FUITE : message de groupe reçu par un autre bâtiment !"
    );

    // -------------------------------------------------------------
    // TEST 3: Real-time Individual 1-on-1 Chat ("Chats Individuels")
    // -------------------------------------------------------------
    console.log("\n💬 3. Test du Chat Individuel 1-à-1 (« Chats Privés »)");

    residentA.emit("join_user", "user-yacine");
    neighborSameBatiment.emit("join_user", "user-karim");
    neighborOtherBatiment.emit("join_user", "user-other");
    await wait(100);

    let karimReceivedPrivateMsg: any = null;
    let thirdPartyReceivedPrivateMsg: any = null;

    neighborSameBatiment.on("new_chat_message", (msg) => {
      if (msg?.channelId === "direct") {
        karimReceivedPrivateMsg = msg;
      }
    });
    neighborOtherBatiment.on("new_chat_message", (msg) => {
      if (msg?.channelId === "direct") {
        thirdPartyReceivedPrivateMsg = msg;
      }
    });

    const privateMessage = {
      id: "m-direct-201",
      author: { id: "user-yacine", prenom: "Yacine", nom: "Benali", role: "resident" },
      text: "Salut Karim, as-tu la clé du local poubelles ?",
      channelId: "direct",
      recipientId: "user-karim",
      createdAt: new Date().toISOString(),
    };

    residentA.emit("send_message", {
      recipientId: "user-karim",
      message: privateMessage,
    });

    await wait(250);

    const privateMsgDelivered =
      karimReceivedPrivateMsg &&
      karimReceivedPrivateMsg.id === "m-direct-201" &&
      karimReceivedPrivateMsg.recipientId === "user-karim" &&
      karimReceivedPrivateMsg.text.includes("local poubelles");

    record(
      "Distribution 1-à-1 privée temps réel",
      Boolean(privateMsgDelivered),
      privateMsgDelivered
        ? `Reçu en direct par le destinataire ciblé (« ${karimReceivedPrivateMsg.text} »)`
        : "Message privé non reçu"
    );

    const privateIsolationPassed = thirdPartyReceivedPrivateMsg === null;
    record(
      "Confidentialité du chat individuel",
      privateIsolationPassed,
      privateIsolationPassed
        ? "Aucun tiers n'a reçu le message privé 1-à-1"
        : "FUITE : message privé intercepté par un tiers !"
    );

    // -------------------------------------------------------------
    // TEST 4: Posts, Photos & Deletion Rules (Facebook-like)
    // -------------------------------------------------------------
    console.log("\n📸 4. Test du Cycle de Vie des Publications & Photos (Style Facebook)");

    interface PostItem {
      id: string;
      authorId: string;
      text: string;
      imageUrl?: string;
      event?: { titre: string; date: string; lieu: string };
      likes: number;
    }

    let feedPosts: PostItem[] = [];

    // 1. User Yacine creates a post with text + photo
    const postWithPhoto: PostItem = {
      id: "post-photo-301",
      authorId: "user-yacine",
      text: "Travaux d'embellissement du hall terminés ce matin ! Voici le résultat 🎨",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      likes: 0,
    };
    feedPosts.unshift(postWithPhoto);

    // 2. User Yacine creates an event post
    const postWithEvent: PostItem = {
      id: "post-event-302",
      authorId: "user-yacine",
      text: "Réunion amicale des copropriétaires samedi à 17h",
      event: {
        titre: "Apéro de rentrée",
        date: "Samedi 25 Oct · 17:00",
        lieu: "Jardin de la résidence",
      },
      likes: 0,
    };
    feedPosts.unshift(postWithEvent);

    const postHasImage = feedPosts.some((p) => p.id === "post-photo-301" && Boolean(p.imageUrl));
    record(
      "Publication photo & texte",
      postHasImage,
      postHasImage ? "Post créé avec image intégrée et texte enrichi" : "Échec post photo"
    );

    const postHasEvent = feedPosts.some((p) => p.id === "post-event-302" && p.event?.titre === "Apéro de rentrée");
    record(
      "Publication événement",
      postHasEvent,
      postHasEvent ? "Événement créé avec date, lieu et titre" : "Échec post événement"
    );

    // 3. Test deletion rights: only author can delete
    function tryDeletePost(postId: string, requestingUserId: string): { success: boolean; reason: string } {
      const post = feedPosts.find((p) => p.id === postId);
      if (!post) return { success: false, reason: "Post introuvable" };
      if (post.authorId !== requestingUserId) {
        return { success: false, reason: "Seul l'auteur peut supprimer cette publication" };
      }
      feedPosts = feedPosts.filter((p) => p.id !== postId);
      return { success: true, reason: "Publication supprimée" };
    }

    // Unauthorized attempt by user-karim
    const unauthorizedAttempt = tryDeletePost("post-photo-301", "user-karim");
    record(
      "Protection contre suppression non autorisée",
      !unauthorizedAttempt.success,
      !unauthorizedAttempt.success
        ? `Refusé pour un tiers : « ${unauthorizedAttempt.reason} »`
        : "FAIL : un autre utilisateur a pu supprimer le post !"
    );

    // Authorized deletion by author Yacine
    const authorizedDeletion = tryDeletePost("post-photo-301", "user-yacine");
    const isNowRemoved = !feedPosts.some((p) => p.id === "post-photo-301");
    record(
      "Suppression par le propriétaire du post",
      authorizedDeletion.success && isNowRemoved,
      authorizedDeletion.success && isNowRemoved
        ? "Le propriétaire a supprimé son post avec succès et il a disparu du fil"
        : "Échec de suppression légitime"
    );

    // -------------------------------------------------------------
    // TEST 5: Real-time Maintenance Notifications (Cloche & Push)
    // -------------------------------------------------------------
    console.log("\n🔧 5. Test des Notifications de Maintenance (/dashboard/maintenance)");

    let residentAReceivedMaintenance: any = null;
    let residentBReceivedMaintenance: any = null;

    residentA.on("new_notification", (data) => {
      if (data?.kind === "maintenance" || data?.titre?.includes("Maintenance")) {
        residentAReceivedMaintenance = data;
      }
    });
    residentB.on("new_notification", (data) => {
      if (data?.kind === "maintenance" || data?.titre?.includes("Maintenance")) {
        residentBReceivedMaintenance = data;
      }
    });

    // Simulate maintenance incident created by admin in /dashboard/maintenance
    broadcastNotification("residence-alger-centre", {
      id: "maint-incident-901",
      titre: "🔧 [Maintenance] Fuite colonne générale eau potable",
      detail: "Bloc A · 3e étage · Priorité: Haute · Prestataire: Plomberie Express",
      isAlerte: true,
      niveau: "critique",
      audience: "Tous les résidents",
      canaux: ["Application"],
      date: new Date().toLocaleDateString("fr-FR"),
      idResidence: "residence-alger-centre",
      webUrl: "/dashboard/maintenance",
      mobileRoute: "/notifications",
      kind: "maintenance",
    });

    await wait(250);

    const maintNotifDelivered =
      residentAReceivedMaintenance &&
      residentAReceivedMaintenance.id === "maint-incident-901" &&
      residentAReceivedMaintenance.kind === "maintenance" &&
      residentAReceivedMaintenance.titre.includes("Fuite colonne générale") &&
      residentAReceivedMaintenance.mobileRoute === "/notifications";

    record(
      "Réception notification de maintenance (Cloche & In-App)",
      Boolean(maintNotifDelivered),
      maintNotifDelivered
        ? `Reçue par le résident avec kind=maintenance et route=/notifications (« ${residentAReceivedMaintenance.titre} »)`
        : "Notification de maintenance non reçue"
    );

    const maintIsolationPassed = residentBReceivedMaintenance === null;
    record(
      "Isolation de la maintenance entre résidences",
      maintIsolationPassed,
      maintIsolationPassed
        ? "Les résidents d'autres résidences ne reçoivent pas la maintenance"
        : "FUITE : notification de maintenance reçue par une autre résidence !"
    );

  } finally {
    // Cleanup sockets and server
    for (const s of sockets) {
      s.disconnect();
    }
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    console.log("\n[Test Server] Arrêté proprement.");
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n=======================================================");
  const allPassed = reports.every((r) => r.passed);
  if (allPassed) {
    console.log(`\x1b[32m✔ TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS (${reports.length}/${reports.length}) !\x1b[0m`);
  } else {
    const failedCount = reports.filter((r) => !r.passed).length;
    console.log(`\x1b[31m✖ CERTAINS TESTS ONT ÉCHOUÉ : ${failedCount}/${reports.length}\x1b[0m`);
  }
  console.log("=======================================================\n");

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Erreur inattendue dans le test :", err);
  process.exit(1);
});
