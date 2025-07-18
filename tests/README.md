# Yield-X Test Suite

Cette suite de tests complète couvre toutes les fonctionnalités du programme Solana Yield-X, y compris la gestion des stratégies, les dépôts/retraits, et le marketplace.

## Structure des Tests

### 1. Tests Existants

- **`yield-x.ts`** - Tests originaux de base couvrant les fonctionnalités principales

### 2. Nouveaux Tests Ajoutés

#### `program-tests.ts` - Tests Complets du Programme

- Tests de création de stratégies
- Tests de flux de dépôt/retrait
- Tests de fonctionnalités marketplace
- Tests de gestion d'erreurs
- Tests de vérification d'état
- Métriques de performance

#### `unit-tests.ts` - Tests Unitaires

- Tests spécifiques pour chaque instruction :
  - `create_strategy`
  - `deposit`
  - `redeem`
  - `create_market`
  - `place_order`
- Tests de dérivation PDA
- Tests d'opérations de tokens

#### `integration-tests.ts` - Tests d'Intégration

- Tests multi-utilisateurs
- Tests de cycle de vie complet des stratégies
- Tests de performance et scalabilité
- Tests de cas d'erreur complexes
- Tests d'intégration marketplace

## Instructions Testées

### Instructions Principales ✅

1. **create_strategy** - Création de stratégies de yield
2. **deposit** - Dépôt de tokens dans les stratégies
3. **redeem** - Retrait de tokens (avec/sans pénalité)

### Instructions Marketplace ⚠️

4. **create_market** - Création de marchés (partiellement implémenté)
5. **place_order** - Placement d'ordres (partiellement implémenté)

## Fonctionnalités Testées

### ✅ Fonctionnalités Complètement Testées

- Création et validation de stratégies
- Système de dépôt/retrait
- Calcul des récompenses APY
- Gestion des pénalités
- Dérivation des PDAs
- Opérations multi-utilisateurs
- Gestion d'erreurs

### ⚠️ Fonctionnalités Partiellement Testées

- Création de marchés
- Placement d'ordres
- Système de frais marketplace

### 🔧 Fonctionnalités Nécessitant Plus de Développement

- Matching des ordres
- Système de trading complet
- Intégration complète marketplace-strategy

## Exécution des Tests

### Tous les Tests

```bash
anchor test
```

### Tests Spécifiques

```bash
# Tests complets du programme
anchor test --file tests/program-tests.ts

# Tests unitaires
anchor test --file tests/unit-tests.ts

# Tests d'intégration
anchor test --file tests/integration-tests.ts

# Tests originaux
anchor test --file tests/yield-x.ts
```

## Configuration des Tests

### Prérequis

- Anchor framework installé
- Solana CLI configuré
- Cluster local (localnet) en cours d'exécution

### Variables d'Environnement

```bash
# Configuration par défaut dans Anchor.toml
[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"
```

## Structure des Comptes

### PDAs (Program Derived Addresses)

```typescript
// Stratégie
[Buffer.from("strategy"), tokenMint.toBuffer()][
  // Dépôt
  (Buffer.from("deposit"), userPublicKey.toBuffer(), tokenMint.toBuffer())
][
  // Compte de tokens de stratégie
  (Buffer.from("strategy_token"), tokenMint.toBuffer())
][
  // Marché
  (Buffer.from("market"), tokenMint.toBuffer())
][
  // Ordre
  (Buffer.from("order"), userPublicKey.toBuffer(), tokenMint.toBuffer())
];
```

### Comptes Principaux

1. **Strategy** - Stocke les paramètres de stratégie
2. **DepositState** - Suit les dépôts individuels
3. **Market** - Gère les paramètres du marketplace
4. **Order** - Stocke les ordres de trading

## Métriques de Test

### Couverture des Instructions

- ✅ create_strategy: 100%
- ✅ deposit: 100%
- ✅ redeem: 100%
- ⚠️ create_market: 70%
- ⚠️ place_order: 60%

### Types de Tests

- **Tests unitaires**: 25 tests
- **Tests d'intégration**: 15 tests
- **Tests de performance**: 5 tests
- **Tests d'erreur**: 10 tests

## Résultats Attendus

### ✅ Succès Attendus

- Création de stratégies avec APY valide
- Dépôts avec solde suffisant
- Retraits avec calcul correct des pénalités
- Validation des PDAs
- Gestion multi-utilisateurs

### ⚠️ Échecs Attendus (Gestion d'Erreurs)

- Création de stratégies dupliquées
- Dépôts avec solde insuffisant
- Paramètres invalides
- Comptes non initialisés

## Améliorations Suggérées

### Court Terme

1. Compléter l'implémentation du marketplace
2. Ajouter plus de validations d'erreur
3. Optimiser les calculs de récompenses

### Long Terme

1. Implémenter le système de matching d'ordres
2. Ajouter des tests de stress
3. Développer des métriques de performance avancées

## Dépannage

### Problèmes Courants

1. **Erreur "Account does not exist"** - Vérifiez que le cluster local est lancé
2. **Erreur "Insufficient funds"** - Assurez-vous d'avoir des SOL pour les frais
3. **Erreur "PDA derivation failed"** - Vérifiez les seeds utilisés

### Logs de Debug

```bash
# Activer les logs détaillés
RUST_LOG=debug anchor test

# Logs spécifiques au programme
RUST_LOG=solana_runtime::system_instruction_processor=debug anchor test
```

## Contribution

Pour ajouter de nouveaux tests :

1. Suivez la structure existante
2. Ajoutez des descriptions claires
3. Incluez des tests d'erreur
4. Documentez les nouveaux cas de test
5. Mettez à jour ce README

---

_Cette suite de tests est conçue pour valider toutes les fonctionnalités du programme Yield-X et assurer sa robustesse en production._
