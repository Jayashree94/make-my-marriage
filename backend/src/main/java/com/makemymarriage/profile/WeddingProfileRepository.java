package com.makemymarriage.profile;

import com.makemymarriage.auth.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeddingProfileRepository extends JpaRepository<WeddingProfileEntity, Long> {
    Optional<WeddingProfileEntity> findByUser(UserEntity user);
}
