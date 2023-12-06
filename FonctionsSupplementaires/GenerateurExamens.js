// PROGRAMME HORS PROJET BIEN QUE FONCTIONNEL, M'A PERMIS D'AVANCER MA PARTIE INDEPENDAMMENT DES AUTRES SPECS
const fs = require('fs').promises;
const readline = require('readline');
const path = require('path');

// Crée une interface de lecture pour l'utilisateur
const interfaceLecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Cette fonction va générer aléatoirement un examen parmi toutes les données de questions (ListTotQ.txt)
async function copierLignesAleatoires(indiceExamen) {
    try {
        // Lit le contenu du fichier 'ListTotQ.txt'. Il contient toutes les données de questions. Son format .txt permet de ne pas le comptabiliser en tant que .gift (poserait problème pour les autres SPECs)
        const cheminFichierSource = path.join('./', 'ListTotQ.txt');
        const contenuSource = await fs.readFile(cheminFichierSource, 'utf8');

        // Divise le contenu de 'ListTotQ.txt' par ligne
        const lignes = contenuSource.split('\n');

        // Mélange les lignes du fichier 
        const indicesMelanges = [...Array(lignes.length).keys()].sort(() => Math.random() - 0.5);

        // Génère un nombre aléatoire entre 15 et 20 (nombre de questions possibles d'un examen)
        var entierAleatoire = Math.floor(Math.random() * (20 - 15 + 1)) + 15;
        
        // Sélectionne le nombre de lignes du fichier mélangé correspondant au nombre généré 
        const indicesSelectionnes = indicesMelanges.slice(0, entierAleatoire);
        
        // Organise dans une structure le contenu qui sera écrit dans un nouveau fichier
        const contenuNouveauFichier = indicesSelectionnes.map(index => lignes[index]).join('\n');

        // Détermine le nom du nouveau fichier 'examenX.gift' en fonction de la valeur de 'indiceExamen'
        const nomNouveauFichier = `examen${indiceExamen}.gift`;
        // Détermine le chemin dans lequel sera créé le fichier
        const cheminNouveauFichier = path.join('./', nomNouveauFichier);
        // Écrit le contenu dans le nouveau fichier
        await fs.writeFile(cheminNouveauFichier, contenuNouveauFichier, 'utf8');
        //Indique à l'utilisateur si l'opération a fonctionné ou non
        console.log(`Copie réussie vers ${nomNouveauFichier}`);
    } catch (erreur) {
        console.error("Une erreur s'est produite :", erreur);
    }
}

// Demande à l'utilisateur le nombre de fichiers qu'il souhaite créer
interfaceLecture.question("Veuillez indiquer le nombre de fichiers à créer : ", async (choix) => {
    const nbFichiers = parseInt(choix);

    // Appelle la fonction N fois (N étant le nombre sélectionné par l'utilisateur)
    for (let indiceExamen = 1; indiceExamen <= nbFichiers; indiceExamen++) {
        await copierLignesAleatoires(indiceExamen);
    }

    // Ferme l'interface de lecture et met fin au programme
    interfaceLecture.close();
});