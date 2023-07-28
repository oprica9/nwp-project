package com.raf.rs.nwp.security.config;

import com.raf.rs.nwp.security.filter.ExceptionHandlingFilter;
import com.raf.rs.nwp.security.filter.JWTAuthenticationFilter;
import com.raf.rs.nwp.security.filter.JWTAuthorizationFilter;
import com.raf.rs.nwp.security.filter.RestAuthenticationEntryPoint;
import com.raf.rs.nwp.security.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource()));

        http.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        new AntPathRequestMatcher("/h2-console/**"))
                .permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/users/create", "POST")).hasAuthority("can_create_users")
                .requestMatchers(
                        new AntPathRequestMatcher("/api/users", "GET"),
                        new AntPathRequestMatcher("/api/users/*", "GET")
                ).hasAuthority("can_read_users")
                .requestMatchers(new AntPathRequestMatcher("/api/users/*", "PUT")).hasAuthority("can_update_users")
                .requestMatchers(new AntPathRequestMatcher("/api/users/*", "DELETE")).hasAuthority("can_delete_users")
                .requestMatchers(new AntPathRequestMatcher("/api/permissions", "GET")).hasAnyAuthority("can_update_users", "can_create_users")
                .anyRequest().authenticated()
        );

        http.exceptionHandling(httpSecurityExceptionHandlingConfigurer -> {
            httpSecurityExceptionHandlingConfigurer.accessDeniedPage("/403");
            httpSecurityExceptionHandlingConfigurer.authenticationEntryPoint(restAuthenticationEntryPoint);
        });

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                .addFilterBefore(new ExceptionHandlingFilter(), JWTAuthenticationFilter.class)
                .addFilterBefore(new JWTAuthenticationFilter(jwtUtils, authenticationManager), UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(new JWTAuthorizationFilter(jwtUtils), JWTAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200","http://localhost:8080"));
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
