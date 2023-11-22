// Déclaration de variables
const readlineSync = require('readline-sync');
const fs = require('fs');
var Prenom, Nom, NumTel = "", Email = "", Addresse = "", DateNaissance = "", Langue = "", Genre = "";

// Fonction générant la VCARD à partir des infos renseignées par l'utilisateur
function GenerateurVCARD(Prenom = "PrenomInconnu", Nom = "NomInconnu", NumTel, Email, Addresse, DateNaissance, Langue, Genre, nomFichier) {
    
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
        // Écrit la VCARD dans le fichier
        fs.writeFileSync(nomFichier, ContenuVCard);
        console.log(`VCard générée et sauvegardée dans ${nomFichier}`);
    } else {
        // Afficher la VCARD dans la console
        console.log(ContenuVCard);
    }

    return ContenuVCard;
}

var ChoixOption = 10;
while (ChoixOption !== 0 && ChoixOption !== 9) {
    console.log("Liste des options :\n0. Generer VCARD\n1. Prenom\n2. Nom\n3. Numero de telephone\n4. Email\n5. Genre\n6. Date de naissance\n7. Langue\n8. Adresse\n9. Generation Automatique\n");
    ChoixOption = parseInt(readlineSync.question("Veuillez entrer le nombre correspondant a l'option qui vous interesse : "));
    switch (ChoixOption) {
        case 0:
            var nomFichier = readlineSync.question("Entrez le nom du fichier pour sauvegarder la VCard : ");
            var VCardData = GenerateurVCARD(Prenom, Nom, NumTel, Email, Addresse, DateNaissance, Langue, Genre, nomFichier);
            console.log(VCardData);
            break;
        case 1:
            Prenom = readlineSync.question("Entrez le prenom de l'enseignant : ");
            break;
        case 2:
            Nom = readlineSync.question("Entrez le nom de l'enseignant : ");
            break;
        case 3:
            NumTel = readlineSync.question("Entrez le numero de telephone : ");
            break;
        case 4:
            Email = readlineSync.question("Entrez l'email de l'enseignant : ");
            break;
        case 5:
            Addresse = readlineSync.question("Entrez l'adresse de l'enseignant : ");
            break;
        case 6:
            DateNaissance = readlineSync.question("Entrez la date de naissance : ");
            break;
        case 7:
            Langue = readlineSync.question("Entrez la langue dans laquelle parle l'enseignant : ");
            break;
        case 8:
            Genre = readlineSync.question("Entrez le genre (M/F/Autre) de l'enseignant : ");
            break;
        case 9:
            console.log("Une VCARD par defaut va etre generee");
            var nomFichier;
            var VCardDataDefaut = GenerateurVCARD(Prenom = "Ines", Nom = "DI LORETO", NumTel = "0325718007", Email = "ines.di_loreto@utt.fr", Addresse = "Bureau F212", DateNaissance = "", Langue = "Francais", Genre = "F", nomFichier = "VCARD_DILORETO");
            console.log(VCardDataDefaut);
            break;
            default:
            console.log("Option non reconnue");
            break;
    }
}