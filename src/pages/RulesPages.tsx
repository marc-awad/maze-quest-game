import { useState } from "react"
import type { ReactNode } from "react"
import {
  ChevronDown,
  ChevronUp,
  Home,
  MapPin,
  Target,
  Square,
  Key,
  Sword,
  Flame,
  Heart,
  Shield,
  Lock,
  Skull,
  Footprints,
  Zap,
  Trophy,
  Clock,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Types pour les composants
interface AccordionSectionProps {
  title: string
  icon?: LucideIcon
  children: ReactNode
  defaultOpen?: boolean
}

interface LegendItemProps {
  icon: LucideIcon
  color: string
  label: string
  description: string
}

interface TutorialStepProps {
  number: number
  title: string
  description: string
}

// Composant Accordion pour sections pliables
function AccordionSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-indigo-600" size={24} />}
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="text-gray-400" size={24} />
        ) : (
          <ChevronDown className="text-gray-400" size={24} />
        )}
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  )
}

// Composant pour afficher une tuile dans la légende
function LegendItem({
  icon: Icon,
  color,
  label,
  description,
}: LegendItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-colors">
      <div
        className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <h4 className="font-bold text-gray-800 mb-1">{label}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

// Composant pour les étapes du tutoriel
function TutorialStep({ number, title, description }: TutorialStepProps) {
  return (
    <div className="flex gap-4 mb-6 last:mb-0">
      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

export default function RulesPage() {
  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            📖 Règles & Tutoriel
          </h1>
          <p className="text-white opacity-90 text-lg mb-6">
            Tout ce que vous devez savoir pour maîtriser MazeQuest
          </p>
          <button
            onClick={handleGoHome}
            className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <Home size={20} />
            Retour à l'accueil
          </button>
        </div>

        {/* Section : Comment jouer (étape par étape) */}
        <AccordionSection
          title="Comment jouer - Guide pas à pas"
          icon={Footprints}
          defaultOpen={true}
        >
          <div className="space-y-2">
            <TutorialStep
              number={1}
              title="Entrez votre pseudo"
              description="Sur la page d'accueil, entrez votre pseudo pour identifier vos scores dans le classement."
            />
            <TutorialStep
              number={2}
              title="Choisissez un niveau"
              description="Sélectionnez un niveau en fonction de sa difficulté. Chaque niveau a une taille de grille et des défis différents."
            />
            <TutorialStep
              number={3}
              title="Explorez le labyrinthe"
              description="Cliquez sur les tuiles adjacentes pour les révéler. Vous ne pouvez révéler que les tuiles qui touchent une tuile déjà découverte."
            />
            <TutorialStep
              number={4}
              title="Collectez des objets"
              description="Ramassez des clés, des armes et d'autres objets en vous déplaçant sur leurs tuiles. Ils apparaissent dans votre inventaire."
            />
            <TutorialStep
              number={5}
              title="Combattez les ennemis"
              description="Affrontez les monstres en combat au tour par tour. Utilisez vos armes pour infliger des dégâts et vos HP pour survivre."
            />
            <TutorialStep
              number={6}
              title="Atteignez la sortie"
              description="Trouvez et atteignez la tuile de sortie (🚪) pour terminer le niveau et enregistrer votre score !"
            />
          </div>
        </AccordionSection>

        {/* Section : Mécaniques de base */}
        <AccordionSection title="Mécaniques de base" icon={MapPin}>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">
                🔍 Révélation des tuiles
              </h4>
              <p>
                Les tuiles commencent cachées (grises). Vous ne pouvez révéler
                qu'une tuile <strong>adjacente</strong> à votre position
                actuelle ou à une tuile déjà révélée. Les tuiles adjacentes sont
                celles qui touchent directement (haut, bas, gauche, droite).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">
                👤 Déplacement du joueur
              </h4>
              <p>
                Votre personnage (👤) se déplace automatiquement sur une tuile
                lorsque vous cliquez dessus. Vous pouvez aussi utiliser les{" "}
                <strong>flèches directionnelles</strong> de votre clavier pour
                vous déplacer.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">
                ❤️ Points de vie (HP)
              </h4>
              <p>
                Votre santé est affichée en haut de l'écran. Elle diminue lors
                des combats et au contact d'obstacles. Si vos HP tombent à 0,
                c'est Game Over !
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">🎒 Inventaire</h4>
              <p>
                Les objets collectés (clés, armes, items) apparaissent dans
                votre inventaire en haut de l'écran. Ils sont utilisés
                automatiquement quand nécessaire.
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Section : Système de combat */}
        <AccordionSection title="Système de combat" icon={Sword}>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">
                ⚔️ Déclenchement d'un combat
              </h4>
              <p>
                Lorsque vous révélez une tuile avec un monstre (☠️) et que vous
                possédez une arme, un combat se déclenche automatiquement. Sans
                arme, vous ne pouvez pas passer sur cette tuile.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">
                🎯 Combat au tour par tour
              </h4>
              <p className="mb-3">Le combat fonctionne en tours successifs :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Vous attaquez en premier, infligeant des dégâts basés sur
                  votre arme
                </li>
                <li>L'ennemi riposte avec sa propre attaque</li>
                <li>
                  Le combat continue jusqu'à ce que l'un de vous tombe à 0 HP
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">🗡️ Types d'armes</h4>
              <div className="grid gap-3 mt-3">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <strong>Épée (Sword):</strong> 15 dégâts par attaque
                </div>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <strong>Hache (Axe):</strong> 20 dégâts par attaque
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <strong>Dague (Dagger):</strong> 10 dégâts par attaque
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">
                👹 Ennemis vaincus
              </h4>
              <p>
                Une fois un ennemi vaincu, vous pouvez librement passer sur sa
                tuile. Vos HP restants après le combat sont conservés pour la
                suite du niveau.
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Section : Clés et portes */}
        <AccordionSection title="Clés, portes et obstacles" icon={Key}>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">🗝️ Clés</h4>
              <p>
                Les clés sont identifiées par leur couleur (rouge, bleue, verte,
                jaune...). Ramassez-les en passant sur leur tuile.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">🚪 Portes</h4>
              <p>
                Les portes bloquent le passage jusqu'à ce que vous possédiez la
                clé de la couleur correspondante. Une fois la clé utilisée, la
                porte reste ouverte.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">🔥 Obstacles</h4>
              <p className="mb-3">
                Différents types d'obstacles peuvent vous ralentir ou vous
                blesser :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Pièges:</strong> infligent des dégâts à votre passage
                </li>
                <li>
                  <strong>Fontaines:</strong> peuvent restaurer vos HP
                </li>
                <li>
                  <strong>Autres items:</strong> effets variables selon le
                  niveau
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">🧱 Murs</h4>
              <p>
                Les murs sont infranchissables. Vous devez trouver un chemin
                alternatif pour contourner les zones bloquées.
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Section : Légende des tuiles */}
        <AccordionSection title="Légende des tuiles" icon={Square}>
          <div className="grid md:grid-cols-2 gap-4">
            <LegendItem
              icon={MapPin}
              color="bg-green-500"
              label="Départ (S)"
              description="Votre position de départ. Révélée automatiquement au début du niveau."
            />
            <LegendItem
              icon={Target}
              color="bg-blue-500"
              label="Sortie (E)"
              description="La tuile objectif. Atteignez-la pour terminer le niveau avec succès !"
            />
            <LegendItem
              icon={Square}
              color="bg-gray-400"
              label="Mur (W)"
              description="Obstacle infranchissable. Vous ne pouvez pas passer à travers."
            />
            <LegendItem
              icon={Footprints}
              color="bg-yellow-500"
              label="Chemin (P)"
              description="Tuile praticable. Vous pouvez vous déplacer librement dessus."
            />
            <LegendItem
              icon={Key}
              color="bg-purple-500"
              label="Clé (K:color)"
              description="Clé de couleur nécessaire pour ouvrir les portes correspondantes."
            />
            <LegendItem
              icon={Lock}
              color="bg-indigo-500"
              label="Porte (D:color)"
              description="Porte verrouillée. Nécessite la clé de la couleur correspondante."
            />
            <LegendItem
              icon={Sword}
              color="bg-red-500"
              label="Arme (W:type)"
              description="Arme à ramasser. Indispensable pour combattre les monstres."
            />
            <LegendItem
              icon={Skull}
              color="bg-orange-600"
              label="Monstre (M:type)"
              description="Ennemi hostile. Combat obligatoire si vous avez une arme."
            />
            <LegendItem
              icon={Flame}
              color="bg-orange-500"
              label="Obstacle (I:type)"
              description="Piège, fontaine ou autre obstacle avec effets variés."
            />
            <LegendItem
              icon={Heart}
              color="bg-pink-500"
              label="Points de vie"
              description="Votre santé actuelle. Ne laissez pas tomber à zéro !"
            />
          </div>
        </AccordionSection>

        {/* Section : Système de score */}
        <AccordionSection title="Système de score" icon={Trophy}>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              Votre score final dépend de plusieurs facteurs :
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-green-600" />
                  <h4 className="font-bold text-green-800">Points bonus</h4>
                </div>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>✓ Tuiles révélées efficacement</li>
                  <li>✓ HP restants élevés</li>
                  <li>✓ Ennemis vaincus</li>
                  <li>✓ Complétion rapide</li>
                </ul>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-red-600" />
                  <h4 className="font-bold text-red-800">Pénalités</h4>
                </div>
                <ul className="text-sm space-y-1 text-red-700">
                  <li>✗ Trop de déplacements</li>
                  <li>✗ Temps excessif</li>
                  <li>✗ HP perdus</li>
                  <li>✗ Tuiles non explorées</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-indigo-600" />
                <h4 className="font-bold text-indigo-800">
                  Conseils pour un meilleur score
                </h4>
              </div>
              <ul className="list-disc list-inside space-y-2 text-indigo-700 ml-2">
                <li>Planifiez votre chemin pour minimiser les déplacements</li>
                <li>
                  Collectez les armes rapidement pour combattre efficacement
                </li>
                <li>Évitez les pièges et obstacles autant que possible</li>
                <li>Terminez le niveau le plus vite possible</li>
                <li>
                  Explorez toutes les tuiles pour maximiser les points
                  d'exploration
                </li>
              </ul>
            </div>
          </div>
        </AccordionSection>

        {/* Section : Astuces */}
        <AccordionSection title="Astuces et stratégies" icon={Zap}>
          <div className="space-y-3 text-gray-700">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <strong>💡 Astuce 1:</strong> Explorez méthodiquement en révélant
              les tuiles adjacentes avant de vous aventurer plus loin.
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <strong>💡 Astuce 2:</strong> Ramassez toujours une arme avant de
              révéler des zones inconnues où des monstres pourraient se cacher.
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <strong>💡 Astuce 3:</strong> Notez mentalement l'emplacement des
              portes pour savoir quelles clés chercher en priorité.
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <strong>💡 Astuce 4:</strong> Surveillez toujours votre barre de
              vie. Mieux vaut éviter un combat si vos HP sont trop bas.
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <strong>💡 Astuce 5:</strong> Les ennemis ont des statistiques
              différentes. Observez leurs HP pour choisir vos combats
              stratégiquement.
            </div>
          </div>
        </AccordionSection>

        {/* Pied de page */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Prêt à jouer ? 🎮
            </h3>
            <p className="text-gray-600 mb-4">
              Maintenant que vous connaissez toutes les règles, il est temps de
              vous lancer dans l'aventure !
            </p>
            <button
              onClick={handleGoHome}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold transition-colors inline-flex items-center gap-2 text-lg"
            >
              <Home size={22} />
              Commencer à jouer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
