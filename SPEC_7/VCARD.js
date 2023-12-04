const fs = require('fs');
const readline = require('readline');
// Création d'une interface de lecture
const interfaceLecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Création des variables liées aux attributs utilisés dans une VCARD
var Prenom, Nom, NumTel = "", Email = "", Addresse = "", DateNaissance = "", Langue = "", Genre = "";
const cheminRepertoire = './';

// Liste des actions disponibles à l'utilisateur
var ChoixOption;
console.log("Liste des options :\n0. Générer VCARD\n1. Prénom\n2. Nom\n3. Numéro de téléphone\n4. Email\n5. Genre\n6. Date de naissance\n7. Langue\n8. Adresse\n9. Génération Automatique\n10. Rappel des options\n11. Arrêter de générer des V-CARDs\n");

// Variable VCARD correspondant aux return de la fonction ci-dessous. Permet de visualiser dans le terminal le contenu d'une VCARD
var VCARD;

// Fonction générant une VCARD à partir des attributs sélectionnés par l'utilisateur
function GenerateurVCARD(Prenom = "PrenomInconnu", Nom = "NomInconnu", NumTel, Email, Addresse, DateNaissance, Langue, Genre, nomFichier, cheminRepertoire) {
    var ContenuVCard = "BEGIN:VCARD\r\n";
    ContenuVCard += "VERSION:4.0\r\n";
    // Avant d'ajouter chaque attribut à la VCARD, on vérifie s'il a été initialisé.
    if (Prenom !== "PrenomInconnu" && Nom !== "NomInconnu") {
        ContenuVCard += "FN: " + Prenom + " " + Nom + "\r\n";
    } else if (Prenom !== "PrenomInconnu" || Nom !== "NomInconnu") {
        ContenuVCard += "N: " + Nom + "; " + Prenom + "\r\n";
    }
    if (Genre !== "") {
        ContenuVCard += "GENDER: " + Genre + "\r\n";
    }
    if (Langue !== "") {
        ContenuVCard += "LANG: " + Langue + "\r\n";
    }
    if (DateNaissance !== "") {
        ContenuVCard += "BDAY: " + DateNaissance + "\r\n";
    }
    if (NumTel !== "") {
        ContenuVCard += "TEL: " + NumTel + "\r\n";
    }
    if (Email !== "") {
        ContenuVCard += "EMAIL: " + Email + "\r\n";
    }
    if (Addresse !== "") {
        ContenuVCard += "ADR: " + Addresse + "\r\n";
    }
    ContenuVCard += "END:VCARD\r\n";
    // On écrit dans le nom du fichier le contenu de la VCARD s'il existe à un emplacement désigné
    if (nomFichier) {
        fs.writeFileSync(cheminRepertoire + nomFichier, ContenuVCard, 'utf8', (erreur) => {
            // En cas de problème, un message d'erreur sera envoyé.
            if (erreur) {
                console.error(`Erreur lors de la création du fichier ${nomFichier} :`, erreur);
                return;
            }
            // En cas de succès, un message sera de validation sera envoyé.
            else {console.log(`Le fichier ${nomFichier} a été créé avec succès.`);}
        });
        console.log(`VCard générée et sauvegardée dans un fichier qui s'appelle ${nomFichier}`);
    }
    return ContenuVCard;
}

// Fonction permettant à l'utilisateur de sélectionner l'option qu'il souhaite parmi une liste
function demanderOption() {
    interfaceLecture.question("Veuillez entrer le nombre correspondant a l'option qui vous intéresse : ", (choix) => {
        ChoixOption = parseInt(choix);
        traiterOption();
    });
}

// Fonction permettant d'exécuter l'option sélectionnée par l'utilisateur.
function traiterOption() {
    switch (ChoixOption) {
        case 0:
            interfaceLecture.question("Entrez le nom du fichier pour sauvegarder la VCard : ", (nomFichier) => {
                VCARD = GenerateurVCARD(Prenom, Nom, NumTel, Email, Addresse, DateNaissance, Langue, Genre, nomFichier, cheminRepertoire);
                console.log(VCARD);
                demanderOption();
            });
            break;
        case 1:
            interfaceLecture.question("Entrez le prénom de l'enseignant : ", (prenom) => {
                Prenom = prenom;
                demanderOption();
            });
            break;
        case 2:
            interfaceLecture.question("Entrez le nom de l'enseignant : ", (nom) => {
                Nom = nom;
                demanderOption();
            });
            break;
        case 3:
            interfaceLecture.question("Entrez le numéro de téléphone : ", (tel) => {
                NumTel = tel;
                demanderOption();
            });
            break;
        case 4:
            interfaceLecture.question("Entrez l'email de l'enseignant : ", (email) => {
                Email = email;
                demanderOption();
            });
            break;
        case 5:
            interfaceLecture.question("Entrez l'adresse de l'enseignant : ", (adresse) => {
                Addresse = adresse;
                demanderOption();
            });
            break;
        case 6:
            interfaceLecture.question("Entrez la date de naissance : ", (naissance) => {
                DateNaissance = naissance;
                demanderOption();
            });
            break;
        case 7:
            interfaceLecture.question("Entrez la langue dans laquelle parle l'enseignant : ", (langue) => {
                Langue = langue;
                demanderOption();
            });
            break;
        case 8:
            interfaceLecture.question("Entrez le genre (M/F/Autre) de l'enseignant : ", (genre) => {
                Genre = genre;
                demanderOption();
            });
            break;
        case 9:
            console.log("Une VCARD par défaut va être générée");
            VCARD = GenerateurVCARD("Ines", "DI LORETO", "0325718007", "ines.di_loreto@utt.fr", "Bureau F212", "", "Francais", "F", "VCARD_DILORETO", cheminRepertoire);
            console.log(VCARD);
            demanderOption();
            break;
        case 10:
            console.log("Liste des options :\n0. Générer VCARD\n1. Prénom\n2. Nom\n3. Numéro de téléphone\n4. Email\n5. Genre\n6. Date de naissance\n7. Langue\n8. Adresse\n9. Génération Automatique\n10. Rappel des options\n");
            demanderOption();
            break;
        case 11:
            console.log("Fin du programme.");
            // Arrête le programme et ferme l'interface
            interfaceLecture.close();
            process.exit();
        default:
            console.log("Option non reconnue");
            demanderOption();
            break;
    }
}
// Initialise la demande d'options
demanderOption();