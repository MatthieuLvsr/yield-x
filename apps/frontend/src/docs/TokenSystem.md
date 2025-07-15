# Système de Gestion des Tokens et Décimales

## Vue d'ensemble

Ce système permet d'afficher correctement les montants des positions utilisateur dans le bon token (USDC, SOL, etc.) avec le bon nombre de décimales, au lieu d'afficher tout en USD.

## Fonctionnalités

### 1. Mapping des Tokens
- **TOKEN_SYMBOLS**: Mappage des adresses de tokens vers leurs symboles
- **TOKEN_DECIMALS_MAP**: Nombre de décimales pour chaque token
- Support pour USDC (6 décimales), SOL (9 décimales), ETH (18 décimales), etc.

### 2. Enrichissement des Données
- **EnrichedUserDeposit**: Interface étendue qui inclut :
  - `tokenSymbol`: Symbole du token (ex: "USDC", "SOL")
  - `tokenDecimals`: Nombre de décimales du token
  - `formattedAmount`: Montant formaté avec le symbole du token
  - `formattedYieldAmount`: Yield formaté avec le symbole du token
  - `strategy`: Informations de la stratégie associée

### 3. Fonctions Utilitaires
- **getTokenSymbolFromAddress()**: Convertit une adresse en symbole
- **getTokenDecimals()**: Retourne le nombre de décimales
- **formatTokenAmount()**: Formate un montant avec le bon nombre de décimales
- **enrichDepositsWithStrategyInfo()**: Enrichit les dépôts avec les infos de stratégie

## Usage

### Dans un composant React
```tsx
import { useUserDeposits } from '@/hooks/useUserDeposits';

const MyComponent = () => {
  const { enrichedDeposits } = useUserDeposits();

  return (
    <div>
      {enrichedDeposits.map(deposit => (
        <div key={deposit.publicKey}>
          <p>Token: {deposit.tokenSymbol}</p>
          <p>Montant: {deposit.formattedAmount}</p>
          <p>Yield: {deposit.formattedYieldAmount}</p>
          <p>Stratégie: {deposit.strategy?.name}</p>
        </div>
      ))}
    </div>
  );
};
```

### Ajout d'un nouveau token
```typescript
// Dans depositUtils.ts
export const TOKEN_DECIMALS_MAP: Record<string, number> = {
  'USDC': 6,
  'SOL': 9,
  'NEW_TOKEN': 8, // Ajouter ici
  // ...
};

export const TOKEN_SYMBOLS: Record<string, string> = {
  'AddressOfNewToken': 'NEW_TOKEN', // Ajouter ici
  // ...
};
```

## Composants Mis à Jour

### 1. useUserDeposits Hook
- Enrichit automatiquement les dépôts avec les informations de stratégie
- Retourne `enrichedDeposits` en plus de `deposits`
- Calcule des statistiques par token

### 2. Composants UI
- **UserDepositCard**: Affiche maintenant les montants avec le bon token
- **UserDepositListItem**: Idem
- **UserDepositTable**: Idem
- **ModernPortfolioSection**: Utilise les données enrichies

### 3. Hook de Pagination
- **useUserDepositsPagination**: Supporte maintenant `EnrichedUserDeposit`
- Filtrage par token amélioré

## Exemples d'Affichage

### Avant (USD)
```
Deposited: $1,000.00
Current Yield: $125.75
```

### Après (Token correct)
```
Deposited: 1,000.50 USDC
Current Yield: 125.75 USDC
```

## Gestion des Erreurs

- **Adresse inconnue**: Retourne "UNKNOWN" comme symbole
- **Token non configuré**: Utilise 9 décimales par défaut
- **Stratégie non trouvée**: Affiche quand même le token basé sur l'adresse

## Tests

Un script de test est disponible dans `src/test/tokenSystemTest.ts` pour vérifier :
- Conversion des adresses
- Formatage des montants
- Enrichissement des données
- Statistiques par token

## Migration

### Composants existants
Les composants existants peuvent continuer à utiliser `UserDeposit` mais devraient migrer vers `EnrichedUserDeposit` pour bénéficier du nouveau système.

### Données mock
Les données mock sont automatiquement enrichies au même titre que les données réelles.

## Performance

- **Calcul paresseux**: Les données sont enrichies seulement quand nécessaire
- **Mémoire**: Évite les recalculs répétés grâce au `useMemo`
- **Optimisation**: Le système ne recalcule que si les stratégies ou dépôts changent
