const fs = require('fs');
const readline = require('readline');

const interfaceLecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var Prenom, Nom, NumTel = "", Email = "", Addresse = "", DateNaissance = "", Langue = "", Genre = "";
const cheminRepertoire = './';
var arreter = 0;

function GenerateurVCARD(Prenom = "PrenomInconnu", Nom = "NomInconnu", NumTel, Email, Addresse, DateNaissance, Langue, Genre, nomFichier, cheminRepertoire) {
    var ContenuVCard = "BEGIN:VCARD\r\n";
    ContenuVCard += "VERSION:4.0\r\n";
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

    if (nomFichier) {
        fs.writeFileSync(cheminRepertoire + nomFichier, ContenuVCard, 'utf8', (erreur) => {
            if (erreur) {
                console.error(`Erreur lors de la création du fichier ${nomFichier} :`, erreur);
                return;
            }
            console.log(`Le fichier ${nomFichier} a été créé avec succès.`);
        });
        console.log(`VCard générée et sauvegardée dans un fichier qui s'appelle ${nomFichier}`);
    }
    return ContenuVCard;
}

var ChoixOption;
console.log("Liste des options :\n0. Generer VCARD\n1. Prenom\n2. Nom\n3. Numero de telephone\n4. Email\n5. Genre\n6. Date de naissance\n7. Langue\n8. Adresse\n9. Generation Automatique\n10. Rappel des options\n11. Arreter de générer des V-CARDs\n");

function demanderOption() {
    interfaceLecture.question("Veuillez entrer le nombre correspondant a l'option qui vous interesse : ", (choix) => {
        ChoixOption = parseInt(choix);
        traiterOption();
    });
}

function traiterOption() {
    switch (ChoixOption) {
        case 0:
            interfaceLecture.question("Entrez le nom du fichier pour sauvegarder la VCard : ", (nomFichier) => {
                GenerateurVCARD(Prenom, Nom, NumTel, Email, Addresse, DateNaissance, Langue, Genre, nomFichier, cheminRepertoire);
                demanderOption();
            });
            break;
        case 1:
            interfaceLecture.question("Entrez le prenom de l'enseignant : ", (prenom) => {
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
            interfaceLecture.question("Entrez le numero de telephone : ", (tel) => {
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
            console.log("Une VCARD par defaut va etre generee");
            GenerateurVCARD("Ines", "DI LORETO", "0325718007", "ines.di_loreto@utt.fr", "Bureau F212", "", "Francais", "F", "VCARD_DILORETO", cheminRepertoire);
            demanderOption();
            break;
        case 10:
            console.log("Liste des options :\n0. Generer VCARD\n1. Prenom\n2. Nom\n3. Numero de telephone\n4. Email\n5. Genre\n6. Date de naissance\n7. Langue\n8. Adresse\n9. Generation Automatique\n10. Rappel des options\n");
            demanderOption();
            break;
        case 11:
            console.log("Fin du programme.");
            process.exit();
            break;
        default:
            console.log("Option non reconnue");
            demanderOption();
            break;
    }
}
demanderOption();