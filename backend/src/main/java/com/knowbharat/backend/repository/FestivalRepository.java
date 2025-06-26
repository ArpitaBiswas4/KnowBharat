package com.knowbharat.backend.repository;

import com.knowbharat.backend.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FestivalRepository extends JpaRepository<Festival, Long> {
    List<Festival> findByStateId(Long stateId);
}
