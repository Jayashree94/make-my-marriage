package com.makemymarriage.tenancy;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MarriageRepository extends JpaRepository<Marriage, Long> {
}
