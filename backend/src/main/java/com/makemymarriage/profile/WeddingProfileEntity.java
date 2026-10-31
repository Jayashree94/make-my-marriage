package com.makemymarriage.profile;

import com.makemymarriage.auth.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(
    name = "wedding_profiles",
    uniqueConstraints = @UniqueConstraint(name = "uk_wedding_profiles_user", columnNames = "user_id")
)
public class WeddingProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "profile_json", nullable = false, columnDefinition = "TEXT")
    private String profileJson;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public WeddingProfileEntity() {
    }

    public WeddingProfileEntity(UserEntity user, String profileJson) {
        this.user = user;
        this.profileJson = profileJson;
    }

    public Long getId() {
        return id;
    }

    public UserEntity getUser() {
        return user;
    }

    public String getProfileJson() {
        return profileJson;
    }

    public void setProfileJson(String profileJson) {
        this.profileJson = profileJson;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
