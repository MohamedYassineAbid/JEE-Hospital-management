package ma.fss.security.service;


import ma.fss.security.entities.AppRole;
import ma.fss.security.entities.AppUser;

//Interface => declarer les signatures des méthodes pour les traitements des utilisateurs et ses roles
public interface SecurityService {
    AppUser saveNewUser(String username, String password, String verifyPassword);//permet d'ajouter un nv user
    //pour le creer on aura besoin des 3 param ^
    AppRole saveNewRole(String roleName, String description);//creer une role
    void addRoleToUser(String username, String roleName);//associer le role a un user
    AppUser loadUserByUsername(String username);//chercher un utilisateur
    void removeRoleFromUser(String username, String roleName);// supprimer un role d'une user

}
