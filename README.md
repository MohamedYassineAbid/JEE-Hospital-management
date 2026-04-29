

## 📖 1. Sujet et Objectifs
L’objectif principal de ce projet consiste à concevoir et réaliser une application web dynamique avec le framework **Spring Boot** complétée par un front-end **Angular** qui permet la gestion complète d’un hôpital. Les données métier (Patients, Médecins, Rendez-vous, Consultations) sont stockées de façon sécurisée et relationnelle dans une base de données **MySQL**.

## 🏗️ 2. Architecture Technique
Le système se compose d'une conception distribuée et moderne :
1. **La couche Client (Frontend)** : Construite en TypeScript avec le framework **Angular 17**, remplaçant l'ancien rendu coté serveur (Thymeleaf) par une Single Page Application (SPA) dynamique, réactive et stylisée via Bootstrap 5.
2. **La couche Web (Controllers REST)** : Gère les requêtes HTTP (GET, POST, PUT, DELETE) produisant et consommant du JSON.
3. **La couche Métier (Service)** : Isole la logique métier (assignation de médecins, de rendez-vous) des autres couches.
4. **La couche DAO (Data Access Object)** : Basée sur Spring Data JPA, Hibernate et JDBC pour l'accès aux données.
5. **La couche Sécurité** : Basée sur Spring Security (adaptée pour des flux Stateless API).

---

## 🔑 3. Dictionnaire des Concepts et Annotations
S'inspirant du rapport d'origine, voici les mots-clés techniques fondamentaux faisant tourner ce socle :

| Concept / Annotation | Explication Technique |
| :--- | :--- |
| **Inversion de Contrôle (IoC) & Injection de Dépendance** | Mécanisme Spring permettant de découpler les dépendances (ex: injecter un repository dans un service sans l'instancier avec `new`). |
| **ORM (Object-Relational Mapping)** | Gère l’accès aux données en transformant nos objets Java en tuples relationnels SQL (Assuré par Hibernate qui implémente JPA). |
| **Spring Data JPA** | Module de Spring facilitant l'implémentation de la couche DAO en éliminant le code "Boilerplate". |
| **`@Entity` / `@Id`** | Déclare une classe Java en tant que table persistente dans la base de données. |
| **Lombok (`@Data`)** | Permet de générer automatiquement à la compilation les getters, setters, et constructeurs pour alléger le code Java. |
| **`@RestController`** | Annotation marquant une classe Web exposant des points d'accès API (Retournant du JSON natif). |

---

## 🗂️ 4. Les Entités et Leurs Relations (JPA)
L'application orchestre quatre associations principales modélisant le processus hospitalier mondial, exploitant activement les associations `@OneToMany`, `@ManyToOne`, et `@OneToOne` :

- **`Patient`** : Entité principale. Possède un identifiant, un nom, une date de naissance, un profil médical (malade ou non) et des coordonnées.
- **`Medecin`** : Représente le corps médical, défini par une spécialité précise et une adresse email de contact.
- **`RendezVous`** : La table pivot. Relie un `Patient` et un `Medecin` à une date donnée. Adopte le statut via une énumération (PENDING, DONE, CANCELED).
- **`Consultation`** : Représente le rapport médical textuel découlant d'un événement `RendezVous` terminé en succès.

---

## ⚙️ 5. La Couche DAO : Repositories
La couche DAO s'exprime très simplement grâce à **Spring Data**. 
Dans le package `repositories`, pour chaque entité, nous avons déclaré une interface héritant de `JpaRepository<Entity, IdType>`. 
Cela nous offre nativement toutes les méthodes essentielles (`save()`, `findAll()`, `findById()`, `deleteById()`), ainsi que des accès facilités à la **Pagination** (via `PageRequest`).

---

## 🛡️ 6. Authentification et Sécurité
Le package sécurité gère nativement la protection du système :
- **Configuration CORS** : Une classe `CorsConfig` a été injectée pour autoriser les flux réseau complexes provenant spécifiquement du client Angular (`http://localhost:4200`).
- **Désactivation CSRF** : Faisant la transition d'un modèle MVC classique à un modèle API Stateless orienté flux front-end, nous reléguons la gestion de session directe à un modèle ouvert JSON (prêt pour JWT à l'avenir).
- L'encodeur de mots de passe original (`BCryptPasswordEncoder`) de `WebSecurityConfigurerAdapter` est toujours instanciable si une protection administrateur avancée (via JSON Web Tokens par exemple) est à nouveau activée.

---

## 💻 7. Architecture Frontend (Angular SPA)
Le dossier `/hospital-frontend` regroupe l'application client.
- **Les Modèles (Interfaces)** : Des formats stricts recopiés du Backend pour assurer l'intégrité de la donnée.
- **Le Service API** : Fichier central où HttpClient gère l'envoi asynchrone (via RxJS `Observables`) à Spring Boot.
- **Moteur de Vues** : Chaque interface métier (Patients, Consultations) a son composant isolé avec son HTML et TypeScipt, ses grilles Bootstrap natives, et ses Modales d'ajout ou d'édition pilotées par `ReactiveFormsModule`.

---

## 🚀 8. Déploiement et Exécution (Docker)
L'application est entièrement conteneurisée.
Le fichier de configuration principal est `docker-compose.yml`.

### Lancer tout l'environnement d'une seule commande :
Assurez-vous d'avoir Docker et Docker-compose installés sur votre machine. Depuis la racine du projet :
```bash
docker-compose up -d
```

### Ce qui est démarré automatiquement :
1. **db** : Serveur MySQL natif initialisé avec une base vierge `PATIENT` sur le port `3302`.
2. **backend** : Exécute Spring Boot via Maven, se branche à MySQL, tourne sur un serveur Tomcat interne port `8086`.
3. **frontend** : Compile le package Angular, sert le client visuel final écoutant sur le port `4200`.

L'interface est alors accessible à l'adresse suivante : **http://localhost:4200**
