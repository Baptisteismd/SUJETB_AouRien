const fs = require('fs').promises;
const { compile } = require('vega-lite');
const { create, write } = require('vega-lite');
const path = require('path');
const readline = require('readline');

// Crée une interface de lecture pour permettre à l'utilisateur d'interagir dans le terminal
const interfaceLecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction permettant à l'utilisateur de choisir le nom du fichier qu'il souhaite représenter graphiquement
function demanderNomFichier() {
    interfaceLecture.question("Veuillez entrer le nom du fichier dont vous souhaitez visualiser la structure : \n", (choix) => {
        NomFichier = String(choix);
        analyserFichier();
    });
}

// Vérifie s'il est cohérent d'analyser le fichier désigné par l'utilisateur
async function analyserFichier() {
    try {
        // Vérifie si le fichier existe dans le répertoire de travail
        await fs.access(NomFichier, fs.constants.F_OK);
        console.log(`${NomFichier} existe dans le répertoire de travail et va être étudié.`);
        // Paramètres permettant de lire tous les fichiers .gift dans un répertoire précis
        const dossierAExplorer = './';
        const extensionFichier = 'gift';
        await etudeStructFichier(dossierAExplorer, extensionFichier, String(NomFichier));
    } catch (err) {
        console.error(`${NomFichier} n'existe pas dans le répertoire de travail.`);
    } 
}

// Fonction permettant de lire tous les fichiers d'une extension spécifique (dans notre cas .gift) dans un dossier désigné
async function etudeStructFichier(dossier, extension, NomFichier) {
    try {
        const fichiers = await fs.readdir(dossier);
        // Filtre les fichiers par extension
        const fichiersFiltres = fichiers.filter(fichier => path.extname(fichier).toLowerCase() === `.${extension}`.toLowerCase());

        // Compteur du nombre de questions
        let CompteurQuestion = 0;
        // Compteur du nombre de questions de type QCM pour 1 fichier
        let CompteurQCM = 0;
        // Compteur du nombre de questions de type Fill in the Blank pour 1 fichier
        let CompteurFillInBlank = 0;
        // Compteur du nombre de questions de type Matching pour 1 fichier
        let CompteurMatchQ = 0;   
        // Compteur du nombre de questions de type Essay pour 1 fichier   
        let CompteurEssay = 0;
        // Compteur du nombre de questions de type à pourcentage pour 1 fichier
        let CompteurRepPourcent = 0;
        // Compteur du nombre de questions à réponses partielles pour 1 fichier
        let CompteurQRepPart = 0;
        // Compteur du nombre de questions non prises en charge pour 1 fichier (vérifie s'il y a une erreur)
        let CompteurInconnu = 0;

        // Boucle permettant de lire chaque fichier possédant la bonne extension
        for (const fichier of fichiersFiltres) {
            const cheminFichier = path.join(dossier, fichier);
            const contenu = await fs.readFile(cheminFichier, 'utf8');
            // Sépare le contenu du fichier étudié par ligne
            const lignes = contenu.split('\n');
            
            // Vérifie pour chaque fichier s'il correspond au nom du fichier désigné par l'utilisateur
            if (fichier == NomFichier){
                // Incrémente les compteurs pour chaque type de question
                for (const ligne of lignes) {
                    CompteurQuestion++;
                    if (ligne.toLowerCase().includes('->')) {
                        CompteurMatchQ++;
                    }
                    else if (ligne.toLowerCase().includes('%')) {
                        CompteurRepPourcent++;
                    }
                    else if (ligne.toLowerCase().includes('{}')) {
                        CompteurEssay++;
                    }
                    else if (ligne.toLowerCase().includes('~=')) {
                        CompteurQRepPart++;
                    }
                    else if (!ligne.toLowerCase().includes('~') && ligne.toLowerCase().includes('=')) {
                        CompteurFillInBlank++;
                    }
                    else if (ligne.toLowerCase().includes('~') && ligne.toLowerCase().includes('=')) {
                        CompteurQCM++;
                    }
                    else {
                        CompteurInconnu++;
                    }
                } 
            }
            
        }
        // Affiche les valeurs du fichier qui intéresse l'utilisateur
        console.log("Votre fichier appelé " + NomFichier + " va être étudié");
        console.log("Votre fichier est composé de " + CompteurQuestion + " questions : \n" + CompteurQCM + " de type QCM\n" + CompteurFillInBlank + " questions de type 'Fill in the blank'\n" + CompteurMatchQ + " questions de type 'Matching Questions'\n" + CompteurEssay + " questions de type 'Essay'\n" + CompteurRepPourcent + " questions de type 'Pourcentages'\n" + CompteurQRepPart + " questions de type 'Réponses partielles'")
        // Crée un objet qui sera étudié lors de la création du graph
        let Compteurs = {CompteurQCM, CompteurFillInBlank, CompteurMatchQ, CompteurEssay, CompteurRepPourcent, CompteurQRepPart}
        demanderNomGraphique(Compteurs);
    } catch (erreur) {
        console.error("Erreur de lecture du dossier:", erreur);
    }

}

// Fonction pour demander le nom du graphique
function demanderNomGraphique(Compteurs) {
    interfaceLecture.question("\nIndiquez le nom de votre graph : ", (choix) => {
        NomGraph = String(choix);
        creerGraph(NomGraph, Compteurs);
    });
}

// Fonction générant le graphique dans un fichier
async function creerGraph(NomGraph,Compteurs) {
    try {
        // Définit les données pour alimenter notre histogramme (informations contenues dans l'objet 'Compteurs')
        const data = {
            valeurs: [
                { type: 'QCM', count: Compteurs.CompteurQCM },
                { type: 'Fill in the blank', count: Compteurs.CompteurFillInBlank },
                { type: 'Matching Questions', count: Compteurs.CompteurMatchQ },
                { type: 'Essay', count: Compteurs.CompteurEssay },
                { type: 'Pourcentages', count: Compteurs.CompteurRepPourcent },
                { type: 'Réponses partielles', count: Compteurs.CompteurQRepPart },
            ]
        };

        // Spécifie l'utilisation de Vega-Lite
        const structure = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "mark": "bar",
            "encoding": {
                // Caractérise les axes x et y de l'histogramme
                "x": {"field": "type", "type": "nominal", "title": "Type de question"},
                "y": {"field": "count", "type": "quantitative", "title": "Nombre de questions"}
            }
        };

        // Compile les spécifications de Vega-Lite
        const specifications = compile({ ...structure, data}).spec;

        // Crée le fichier HTML correspondant à la demande de l'utilisateur
        const histogramme = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
                        <script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
                        <script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
                    </head>
                    <body>
                        <div id="vis"></div>
                        <script>
                            // Utilisation de vegaEmbed pour afficher le graphique
                            vegaEmbed('#vis', ${JSON.stringify(specifications)}, { "config": { "view": { "stroke": "transparent" } } });
                        </script>
                    </body>
                </html>
            `;
        // Sauvegarde l'histogramme dans un fichier en extension .html
        await fs.writeFile(`${NomGraph}.html`, histogramme);
        console.log(`Le fichier graphique ${NomGraph}.html a été créé avec succès.`);
    }catch (err) {
        console.error(`${NomFichier} n'existe pas dans le répertoire de travail.`);
    } 
    // Ferme l'interface de lecture
    finally {
        interfaceLecture.close();
    }
}

// Initialise le programme
demanderNomFichier();