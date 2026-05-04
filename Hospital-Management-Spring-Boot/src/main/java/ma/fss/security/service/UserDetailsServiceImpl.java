package ma.fss.security.service;

import lombok.AllArgsConstructor;
import ma.fss.security.entities.AppUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private SecurityService securityService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser appUser = securityService.loadUserByEmail(email);
        if (appUser == null) throw new UsernameNotFoundException("User not found with email: " + email);

        Collection<GrantedAuthority> authorities = appUser.getAppRoles()
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList());

        return new User(appUser.getEmail(), appUser.getPassword(), authorities);
    }
}
