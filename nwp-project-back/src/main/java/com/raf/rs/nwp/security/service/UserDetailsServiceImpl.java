package com.raf.rs.nwp.security.service;

import com.raf.rs.nwp.mapper.UserMapper;
import com.raf.rs.nwp.model.User;
import com.raf.rs.nwp.repository.UserRepository;
import com.raf.rs.nwp.security.dto.UserAuthDetails;
import com.raf.rs.nwp.security.model.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

        UserAuthDetails details = userMapper.mapToUserAuthDetails(user);

        return new SecurityUser(details);
    }

}
