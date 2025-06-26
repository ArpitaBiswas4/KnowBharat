package com.knowbharat.backend.repository;

import com.knowbharat.backend.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends JpaRepository<State, Integer> {
    State findByName(String name);
}
