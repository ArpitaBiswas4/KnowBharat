package com.knowbharat.backend.repository;

import com.knowbharat.backend.entity.TouristPlace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TouristPlaceRepository extends JpaRepository<TouristPlace, Long> {
    List<TouristPlace> findByStateId(Long stateId);
}
