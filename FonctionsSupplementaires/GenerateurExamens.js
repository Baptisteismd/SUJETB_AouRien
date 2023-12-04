// PROGRAMME HORS PROJET, M'A PERMIS D'AVANCER MA PARTIE INDEPENDAMMENT DES AUTRES
const fs = require('fs').promises;
const readline = require('readline');
const path = require('path');

// Crée une interface de lecture
const interfaceLecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Cette fonction va générer aléatoirement un examen parmi toutes les données de questions 
async function copierLignesAleatoires(indiceExamen) {
    try {
        // Lit le contenu du fichier 'ListTotQ.txt'. Il contient toutes les données de questions. Son format .txt permet de ne
        const cheminFichierSource = path.join('./', 'ListTotQ.txt');
        const contenuSource = await fs.readFile(cheminFichierSource, 'utf8');

        // Divise le contenu de 'ListTotQ.txt' en lignes
        const lignes = contenuSource.split('\n');

        // Mélange les indices des lignes
        const indicesMelanges = [...Array(lignes.length).keys()].sort(() => Math.random() - 0.5);

        // Crée un nombre aléatoire entre 15 et 20 (nombres de questions d'un examen)
        var entierAleatoire = Math.floor(Math.random() * (20 - 15 + 1)) + 15;
        // Sélectionne le nombre d'indices correspondants au nombre dans le fichier mélangé
        const indicesSelectionnes = indicesMelanges.slice(0, entierAleatoire);

        // Organise dans une structure le contenu qui sera écrit dans un nouveau fichier
        const contenuNouveauFichier = indicesSelectionnes.map(index => lignes[index]).join('\n');

        // Détermine le nom du nouveau fichier 'examenX.gift' en fonction de son numéro d'indice
        const nomNouveauFichier = `examen${indiceExamen}.gift`;
        const cheminNouveauFichier = path.join('./', nomNouveauFichier);

        // Écrit le contenu dans le nouveau fichier
        await fs.writeFile(cheminNouveauFichier, contenuNouveauFichier, 'utf8');

        console.log(`Copie réussie vers ${nomNouveauFichier}`);
    } catch (erreur) {
        console.error("Une erreur s'est produite :", erreur);
    }
}

// Indique le nombre de fichiers que l'on souhaite créer
interfaceLecture.question("Veuillez indiquer le nombre de fichiers à créer : ", async (choix) => {
    const nbFichiers = parseInt(choix);

    // Appelle la fonction pour copier les lignes aléatoires
    for (let indiceExamen = 1; indiceExamen <= nbFichiers; indiceExamen++) {
        await copierLignesAleatoires(indiceExamen);
    }

    // Ferme l'interface de lecture et arrête le programme
    interfaceLecture.close();
    process.exit();
});