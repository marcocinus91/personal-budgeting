# 💰 Personal Budgeting App

Un'applicazione mobile completa per la gestione del budget personale, sviluppata con React Native ed Expo. Traccia le tue entrate e uscite, visualizza statistiche dettagliate e imposta obiettivi di risparmio.

## ✨ Caratteristiche Principali

- 📊 **Dashboard Interattiva**: Visualizza un riepilogo mensile con grafici delle spese per categoria
- 💸 **Gestione Transazioni**: Aggiungi, modifica ed elimina entrate e uscite
- 🎯 **Obiettivi di Risparmio**: Definisci e monitora i tuoi obiettivi finanziari
- 📈 **Statistiche Dettagliate**: Analizza le tue spese con grafici e percentuali
- 🏷️ **Categorie Predefinite**: Sistema di categorizzazione completo (affitto, cibo, trasporti, ecc.)
- 🎨 **Tema Personalizzabile**: Supporto per tema chiaro e scuro
- 💾 **Database Locale**: Tutti i dati sono salvati localmente su SQLite
- 📱 **Cross-Platform**: Funziona su iOS, Android e Web

## 🏗️ Architettura

### Stack Tecnologico

```
- React Native 0.81.5
- Expo SDK ~54.0
- TypeScript 5.9 (strict mode)
- Expo Router 6.0 (File-based routing)
- SQLite (expo-sqlite)
- Zustand 5.0 (State management)
- date-fns 4.1 (Date utilities)
- react-native-chart-kit (Visualizzazioni)
```

### Struttura del Progetto

```
personal-budgeting/
├── app/                          # Expo Router - File-based routing
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Dashboard
│   │   ├── transactions.tsx     # Lista transazioni
│   │   ├── goals.tsx            # Obiettivi di risparmio
│   │   ├── add.tsx              # Aggiunta rapida transazione
│   │   └── settings.tsx         # Impostazioni
│   ├── goal/                     # Stack navigazione obiettivi
│   │   ├── [id].tsx             # Dettaglio obiettivo
│   │   └── new.tsx              # Nuovo obiettivo
│   ├── transaction/              # Stack navigazione transazioni
│   │   └── [id].tsx             # Dettaglio/modifica transazione
│   └── _layout.tsx               # Root layout
│
├── src/
│   ├── components/               # Componenti UI
│   │   ├── dashboard/           # Componenti dashboard
│   │   │   ├── ExpenseChart.tsx           # Grafico spese
│   │   │   ├── MonthlySummaryCard.tsx    # Riepilogo mensile
│   │   │   ├── RecentTransactions.tsx    # Transazioni recenti
│   │   │   └── SavingsOverview.tsx       # Panoramica risparmi
│   │   ├── goals/               # Componenti obiettivi
│   │   │   ├── GoalCard.tsx
│   │   │   └── GoalForm.tsx
│   │   ├── transactions/        # Componenti transazioni
│   │   │   ├── FilterBar.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   └── TransactionListItem.tsx
│   │   └── ui/                  # Componenti UI riusabili
│   │       ├── AmountInput.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── CategoryPicker.tsx
│   │       ├── EmptyState.tsx
│   │       └── ProgressBar.tsx
│   │
│   ├── db/                       # Database layer
│   │   ├── client.ts            # SQLite client
│   │   ├── migrations.ts        # Schema migrations
│   │   ├── transactions.ts      # Transaction queries
│   │   ├── goals.ts             # Goals queries
│   │   └── categories.ts        # Category queries
│   │
│   ├── store/                    # State management (Zustand)
│   │   ├── useTransactionStore.ts
│   │   └── useGoalStore.ts
│   │
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── currency.ts          # Formattazione valuta
│   │   └── date.ts              # Utility date
│   │
│   ├── theme/                    # Sistema temi
│   │   ├── colors.ts
│   │   └── ThemeContext.tsx
│   │
│   └── constants/                # Costanti applicazione
│       ├── categories.ts        # Categorie predefinite
│       ├── colors.ts
│       └── layout.ts
│
├── assets/                       # Risorse statiche
├── index.ts                      # Entry point
├── app.json                      # Configurazione Expo
├── package.json
└── tsconfig.json
```

## 🗄️ Schema Database

### Tabella `categories`

```sql
- id: INTEGER PRIMARY KEY
- name: TEXT (nome categoria)
- type: TEXT ('income' | 'expense')
- icon: TEXT (nome icona Ionicons)
- sort_order: INTEGER
- is_default: INTEGER (categoria predefinita)
```

### Tabella `transactions`

```sql
- id: INTEGER PRIMARY KEY
- type: TEXT ('income' | 'expense')
- amount: REAL (> 0)
- category_id: INTEGER (FK → categories.id)
- date: TEXT (formato ISO)
- note: TEXT (opzionale)
- created_at: TEXT
- updated_at: TEXT
```

### Tabella `savings_goals`

```sql
- id: INTEGER PRIMARY KEY
- name: TEXT
- target_amount: REAL (> 0)
- current_amount: REAL (>= 0)
- deadline: TEXT (opzionale)
- color: TEXT (opzionale)
- is_completed: INTEGER (0 | 1)
- created_at: TEXT
- updated_at: TEXT
```

## 🚀 Setup Locale

### Prerequisiti

- Node.js >= 18
- npm o yarn
- Expo CLI
- iOS Simulator (per sviluppo iOS su Mac)
- Android Studio (per sviluppo Android)

### Installazione

```bash
# Clona il repository
git clone <repository-url>
cd personal-budgeting

# Installa le dipendenze
npm install

# Avvia il progetto
npm start
```

### Comandi Disponibili

```bash
npm start          # Avvia Expo Dev Server
npm run android    # Avvia su Android
npm run ios        # Avvia su iOS
npm run web        # Avvia su Web
```

## 📱 Funzionalità Dettagliate

### Dashboard

- Riepilogo mensile con totale entrate, uscite e saldo
- Grafico a torta delle spese per categoria
- Lista delle ultime transazioni
- Panoramica degli obiettivi di risparmio attivi
- Pull-to-refresh per aggiornare i dati

### Gestione Transazioni

- Aggiunta rapida tramite tab dedicata
- Modifica e cancellazione transazioni esistenti
- Filtri per tipo, categoria e periodo
- Ricerca e ordinamento
- Note personalizzate per ogni transazione

### Obiettivi di Risparmio

- Creazione obiettivi con importo target e scadenza
- Progress bar visiva per ogni obiettivo
- Colori personalizzabili
- Tracking della percentuale di completamento
- Notifiche di raggiungimento obiettivo

### Categorie

Categorie predefinite per **Entrate**:

- Stipendio
- Freelance
- Investimenti
- Regalo
- Altro

Categorie predefinite per **Uscite**:

- Affitto
- Cibo
- Trasporti
- Svago
- Salute
- Abbigliamento
- Bollette
- Istruzione
- Altro

## 🎨 Sistema di Temi

L'app supporta automaticamente temi chiaro e scuro tramite `ThemeContext`, adattandosi alle preferenze di sistema dell'utente con `userInterfaceStyle: "automatic"`.

## 🔒 Privacy e Sicurezza

- **100% locale**: Tutti i dati sono salvati localmente sul dispositivo
- **Nessun tracking**: Nessuna raccolta dati o analytics
- **Offline-first**: Funziona completamente offline
- **SQLite con WAL**: Prestazioni ottimali e sicurezza dei dati

## 🧪 Best Practices Implementate

- ✅ **TypeScript Strict Mode**: Type safety completo
- ✅ **Componenti Riusabili**: Architettura modulare e manutenibile
- ✅ **State Management Centralizzato**: Zustand per gestione stato globale
- ✅ **Database Layer Separato**: Logica DB isolata nei moduli `db/*`
- ✅ **File-based Routing**: Expo Router per navigazione intuitiva
- ✅ **Indexed Database**: Indici su colonne frequentemente interrogate
- ✅ **Foreign Keys**: Integrità referenziale nel database
- ✅ **Constants Management**: Valori hardcoded centralizzati
- ✅ **Utility Functions**: Helper riusabili per date e currency

## 📊 Performance

- **SQLite WAL Mode**: Letture concorrenti senza blocchi
- **Lazy Loading**: Caricamento dati on-demand
- **Memoizzazione**: Ottimizzazione re-render con React hooks
- **Indexed Queries**: Query veloci su date, tipo e categoria
- **Zustand**: State management performante e minimale

## 🛠️ Sviluppo Futuro

Possibili miglioramenti:

- [ ] Export dati in CSV/Excel
- [ ] Backup e restore cloud (opzionale)
- [ ] Budget mensili per categoria
- [ ] Report annuali e confronti
- [ ] Widget per home screen
- [ ] Notifiche push per scadenze
- [ ] Supporto multi-valuta
- [ ] Categorie personalizzate
- [ ] Ricorrenze automatiche
- [ ] Allegati e ricevute

## 📄 Licenza

Questo progetto è un'applicazione personale.

## 👨‍💻 Sviluppo

Sviluppato con ❤️ utilizzando React Native ed Expo.

---

**Versione**: 1.0.0  
**Ultima Modifica**: Febbraio 2026
