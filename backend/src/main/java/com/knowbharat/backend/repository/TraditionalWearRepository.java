package com.knowbharat.backend.repository;

import com.knowbharat.backend.entity.TraditionalWear;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TraditionalWearRepository extends JpaRepository<TraditionalWear, Long> {
    Optional<TraditionalWear> findByStateId(Long stateId);
}
