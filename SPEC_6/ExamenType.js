const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Crée une interface de lecture pour que l'utilisateur puisse interagir avec le terminal
const interfaceLecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Nom du fichier que l'on cherche à étudier
var NomFichier;

// Fonction permettant à l'utilisateur de choisir le nom du fichier qu'il souhaite étudier
function demanderNomFichier() {
    // L'utilisateur sélectionne le nom du fichier qu'il recherche grâce à l'interface de lecture
    interfaceLecture.question("Veuillez entrer le nom du fichier que vous souhaitez comparer à un examen type : \n", (choix) => {
        NomFichier = String(choix);
        analyserFichier();
    });
}

// Fonction vérifiant s'il est cohérent de rechercher le fichier indiqué par l'utilisateur
async function analyserFichier() {
    try {
        // Vérifie si le fichier existe dans le répertoire de travail
        await fs.access(NomFichier, fs.constants.F_OK);
        console.log(`${NomFichier} existe dans le répertoire de travail et va être étudié.`);
        // Paramètres pour uniquement lire les fichiers à l'extension .gift d'un répertoire précis
        const dossierAExplorer = './';
        const extensionFichier = 'gift';
        comparerFichiersDExtension(dossierAExplorer, extensionFichier, String(NomFichier));
    } catch (err) {
        console.error(`${NomFichier} n'existe pas dans le répertoire de travail.`);
    } 
    // Ferme l'interface de lecture lorsque la fonction a fini son exécution
    finally {
        interfaceLecture.close();
    }
}

// Fonction permettant de lire tous les fichiers d'une extension spécifique (dans notre cas .gift) d'un dossier
async function comparerFichiersDExtension(dossier, extension, NomFichier) {
    // Compteur du nombre total de fichiers (servira pour calculer le nombre moyen de chaque type de question)
    let nbFichiers = 0;
    // Compteur du nombre total de lignes des fichiers (et donc le nombre total de questions)
    let totalLignes = 0;
    // Compteur des question à multiples choix {~RepFausse~RepFausse[...]=RepVraie~RepFausse[...]}
    let totalCompteurQCM = 0;
    // Compteur des question du type "Fill In the Blank" {= RepBonne = RepBonne [...] = RepBonne}
    let totalCompteurFillInBlank = 0;    
    // Compteur des question du type "Matching Questions" { Element = item -> match RepElement [...]}
    let totalCompteurMatchQ = 0;        
    // Compteur des question du type "Essay" {}
    let totalCompteurEssay = 0;
    // Compteur des question du type QCM à réponses en pourcentages {~%Pourcentage%Rep,~%Pourcentage%Rep, [...], ~%Pourcentage%Rep }
    let totalCompteurRepPourcent = 0;
    // Compteur des question à réponses partielles {~RepPartielle1   ~RepPartielle2  ~=BonneRep  [...] ~RepPartielleN}
    let totalCompteurQRepPart = 0;
    // Questions inconnues (permet de vérifier si toutes les questions sont catégorisées et vérifie donc s'il y a des erreurs)
    let totalCompteurInconnu = 0;
    try {
        // Lit le contenu du dossier désigné
        const fichiers = await fs.readdir(dossier);
        // Filtre les fichiers par extension
        const fichiersFiltres = fichiers.filter(fichier => path.extname(fichier).toLowerCase() === `.${extension}`.toLowerCase());

        // Boucle permettant de lire chaque fichier possédant la bonne extension (.gift)
        for (const fichier of fichiersFiltres) {
            const cheminFichier = path.join(dossier, fichier);
            const contenu = await fs.readFile(cheminFichier, 'utf8');

            // Divise le contenu du fichier en lignes
            const lignes = contenu.split('\n');
            nbFichiers += 1;
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
            // Compteur du nombre de questions non prises en charge pour 1 fichier
            let CompteurInconnu = 0;
            // Incrémente les compteurs selon les types de questions
            for (const ligne of lignes) {
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
            // Les compteurs totaux vont s'imcrémenter à la fin de chaque fichier étudié
            totalLignes += lignes.length;
            totalCompteurQCM += CompteurQCM;
            totalCompteurFillInBlank += CompteurFillInBlank;    
            totalCompteurMatchQ += CompteurMatchQ;        
            totalCompteurEssay += CompteurEssay;
            totalCompteurRepPourcent += CompteurRepPourcent;
            totalCompteurQRepPart += CompteurQRepPart;
            totalCompteurInconnu += CompteurInconnu;
            // Vérifie pour chaque fichier s'il correspond au nom de fichier désigné par l'utilisateur
            if (fichier == NomFichier){
                // Lorsque c'est le cas, on enregistre toutes les caractéristiques du fichier
                var memoNbQ = lignes.length;
                var memoQCM = CompteurQCM;
                var memoFillInBlank = CompteurFillInBlank; 
                var memoMatchQ = CompteurMatchQ;
                var memoEssay = CompteurEssay;
                var memoRepPourcent = CompteurRepPourcent;
                var memoRepPart = CompteurQRepPart;
            }
            // Bouts de codes vérifiant permettant de définir la source d'une potentielle erreur
            /*
            // Affiche les résultats des compteurs et vérifie leurs cohérences
            console.log(`\n${fichier}:`)
            console.log(`Nombre de lignes dans ${fichier}: ${lignes.length}`);
            console.log(`Nombre de QCM dans ${fichier}: ${CompteurQCM}`);
            console.log(`Nombre de "Fill in the blank" dans ${fichier}: ${CompteurFillInBlank}`);
            console.log(`Nombre de "Matching Questions" dans ${fichier}: ${CompteurMatchQ}`);
            console.log(`Nombre de questions "Essay" dans ${fichier}: ${CompteurEssay}`);
            console.log(`Nombre de questions à pourcentages dans ${fichier}: ${CompteurRepPourcent}`);
            console.log(`Nombre de questions à réponses partielles dans ${fichier}: ${CompteurQRepPart}`);
            */
        }
        /*
        // Affiche les totaux après avoir lu tous les fichiers de l'extension souhaitée
        console.log(`\nNombre total de questions : ${totalLignes}`);
        console.log(`Nombre total de QCM : ${totalCompteurQCM}`);
        console.log(`Nombre total de "Fill in the blank" : ${totalCompteurFillInBlank}`);
        console.log(`Nombre total de "Matching Questions" : ${totalCompteurMatchQ}`);
        console.log(`Nombre total de questions "Essay" : ${totalCompteurEssay}`);
        console.log(`Nombre total de questions à pourcentages : ${totalCompteurRepPourcent}`);
        console.log(`Nombre total de questions à réponses partielles : ${totalCompteurQRepPart}`);
        console.log(`Nombre total de questions inconnues : ${totalCompteurInconnu}\n`);
        */
    } catch (erreur) {
        console.error("Erreur de lecture du dossier:", erreur);
    }
    /*
    // Dernier test vérifiant la cohérence des résultats
    compteurGlobal = totalCompteurQCM+totalCompteurFillInBlank+totalCompteurMatchQ+totalCompteurEssay+totalCompteurRepPourcent+totalCompteurQRepPart;
    console.log("Compteur Global : " + compteurGlobal + " ----" + " Nombre total de questions : " + totalLignes);
    console.log("Il y a " + nbFichiers + " fichiers .gift");
    */
    // Détermine le nombre moyen (arrondi à l'entier inférieur) de chaque type de question
    var nbQCM = Math.floor(totalCompteurQCM / nbFichiers);
    var nbFill = Math.floor(totalCompteurFillInBlank / nbFichiers);
    var nbMatch = Math.floor(totalCompteurMatchQ / nbFichiers);
    var nbEssay = Math.floor(totalCompteurEssay / nbFichiers);
    var nbPourcent = Math.floor(totalCompteurRepPourcent / nbFichiers);
    var nbRepPart = Math.floor(totalCompteurQRepPart / nbFichiers);
    var nbTotQ = nbQCM +nbFill +nbMatch +nbEssay +nbPourcent +nbRepPart ;
    console.log("\nNous allons analyser la structure d'un examen typique aux incertitudes près.");
    console.log("Un examen de " + nbTotQ +" questions est en moyenne composé de : \n" + nbQCM + " de type QCM\n" + nbFill + " questions de type 'Fill in the blank'\n" + nbMatch + " questions de type 'Matching Questions'\n" + nbEssay + " questions de type 'Essay'\n" + nbPourcent + " questions de type 'Pourcentages'\n" + nbRepPart + " questions de type 'Réponses partielles'\n");
    // Affiche les valeurs du fichier qui intéresse l'utilisateur
    console.log("Maintenant, votre fichier appelé " + NomFichier + " va être étudié");
    console.log("Votre fichier est composé de " + memoNbQ + " questions : \n" + memoQCM + " de type QCM\n" + memoFillInBlank + " questions de type 'Fill in the blank'\n" + memoMatchQ + " questions de type 'Matching Questions'\n" + memoEssay + " questions de type 'Essay'\n" + memoRepPourcent + " questions de type 'Pourcentages'\n" + memoRepPart + " questions de type 'Réponses partielles'\n");
    // Etudie les différences entre le nb d'un certain types de questions d'un exam moyen et de celui sélectionné
    var diffNbQ = memoNbQ - nbTotQ;
    var diffQCM = memoQCM - nbQCM; 
    var diffFillInBlank = memoFillInBlank - nbFill; 
    var diffMatchQ = memoMatchQ - nbMatch; 
    var diffEssay = memoEssay - nbEssay; 
    var diffRepPourcent = memoRepPourcent - nbPourcent;  
    var diffRepPart = memoRepPart - nbRepPart;
    console.log("En le comparant à l'examen moyen, le vôtre a :");
    // Condition permettant de rendre cohérent les résultats affichés à l'utilisateur
    if (diffNbQ>0){
        console.log(diffNbQ + " question(s) de plus");
    }
    else if (diffNbQ<0){
        console.log(-diffNbQ + " question(s) de moins");
    }
    else{console.log("Le même nombre total de questions");}

    if (diffQCM>0){
        console.log(diffQCM + " question(s) de plus de type 'QCM'");
    }
    else if (diffQCM<0){
        console.log(-diffQCM + " question(s) de moins de type 'QCM'");
    }
    else{console.log("Autant de questions de type 'QCM'");}

    if (diffFillInBlank>0){
        console.log(diffFillInBlank + " question(s) de plus du type 'Fill in the blank'");
    }
    else if (diffFillInBlank<0){
        console.log(-diffFillInBlank + " question(s) de moins du type 'Fill in the blank'");
    }
    else{console.log("Autant de questions du type 'Fill in the blank'");}

    if (diffMatchQ>0){
        console.log(diffMatchQ + " question(s) de plus du type 'Matching Questions'");
    }
    else if (diffMatchQ<0){
        console.log(-diffMatchQ + " question(s) de moins du type 'Matching Questions'");
    }
    else{console.log("Autant de questions du type 'Matching Questions'");}

    if (diffEssay>0){
        console.log(diffEssay + " question(s) de plus du type 'Essay'");
    }
    else if (diffEssay<0){
        console.log(-diffEssay + " question(s) de moins du type 'Essay'");
    }
    else{console.log("Autant de questions du type 'Essay'");}

    if (diffRepPourcent>0){
        console.log(diffRepPourcent + " question(s) de plus au(x) résultat(s) donné(s) en pourcentage");
    }
    else if (diffRepPourcent<0){
        console.log(-diffRepPourcent + " question(s) de moins au(x) résultat(s) donné(s) en pourcentage");
    }
    else{console.log("Autant de questions aux résultats donnés en pourcentage");}

    if (diffRepPart>0){
        console.log(diffRepPart + " question(s) de plus de type 'à réponses partielles'");
    }
    else if (diffRepPart<0){
        console.log(-diffRepPart + " question(s) de moins de type 'à réponses partielles'");
    }
    else{console.log("Autant de questions de type 'à réponses partielles'");}
}
// Initialise la demande d'options
demanderNomFichier();