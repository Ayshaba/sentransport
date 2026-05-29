import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import LigneBus from './LigneBus';
import Footer from './Footer';
import Recherche from './Recherche';
import DetailLigne from './DetailLigne';
import Carte from './Carte';

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  // Fonction séparée pour charger les données
  function chargerLignes() {
    setChargement(true);
    setErreur(null);

    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  }

  // Charger au démarrage
  useEffect(() => {
    chargerLignes();
  }, []);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  function handleClickLigne(ligne) {
    // Si déjà sélectionnée, on désélectionne
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
      return;
    }

    // Sinon, on va chercher les détails depuis l’API
    fetch(`http://localhost:5000/lignes/${ligne.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLigneSelectionnee(data); // data contient les détails (listeArrets, etc.)
      })
      .catch(error => {
        setErreur(error.message);
      });
  }


  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
          {/* Bouton Recharger même en cas de chargement */}
          <button onClick={chargerLignes} className="btn-recharger">
            Recharger
          </button>
        </main>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
          </div>
          {/* Bouton Recharger en cas d’erreur */}
          <button onClick={chargerLignes} className="btn-recharger">
            Recharger
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <div className="zone-recherche">
          <Recherche valeur={recherche} onChange={setRecherche} />
          <button onClick={() => setRecherche("")} className="btn-effacer">
            Effacer
          </button>
          {/* Bouton Recharger dans l’écran normal */}
          <button onClick={chargerLignes} className="btn-recharger">
            Recharger
          </button>
        </div>

        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne
          {lignesFiltrees.length > 1 ? 's' : ''} trouvée
          {lignesFiltrees.length > 1 ? 's' : ''}
        </p>

        {lignesFiltrees.length === 0 ? (
          <p className="aucune-ligne">Aucune ligne trouvée</p>
        ) : (
          lignesFiltrees.map(ligne => (
            <LigneBus
              key={ligne.id}
              numero={ligne.numero}
              depart={ligne.depart}
              arrivee={ligne.arrivee}
              arrets={ligne.arrets}
              estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
              onClick={() => handleClickLigne(ligne)}
            />
          ))
        )}

        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
        <Carte />
      </main>
      <Footer />
    </div>
  );
}

export default App;
