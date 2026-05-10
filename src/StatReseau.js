import './StatReseau.css';

function StatReseau({ lignes }) {
    // Nombre total de lignes
    const totalLignes = lignes.length;

    // Nombre total d'arrêts (somme des arrets)
    const totalArrets = lignes.reduce((somme, ligne) => somme + ligne.arrets, 0);

    // Ligne avec le plus d'arrêts
    const ligneMaxArrets = lignes.reduce((max, ligne) =>
        ligne.arrets > max.arrets ? ligne : max
    );

    return (
        <div className="stat-reseau">
            <h2>Statistiques du Réseau</h2>
            <p>Total de lignes : {totalLignes}</p>
            <p>Total d'arrêts : {totalArrets}</p>
            <p>
                Ligne avec le plus d'arrêts : {ligneMaxArrets.numero} ({ligneMaxArrets.arrets} arrêts)
            </p>
        </div>
    );
}

export default StatReseau;
