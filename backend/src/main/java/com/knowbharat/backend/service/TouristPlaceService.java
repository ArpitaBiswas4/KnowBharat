package com.knowbharat.backend.service;

import com.knowbharat.backend.entity.TouristPlace;
import com.knowbharat.backend.repository.TouristPlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TouristPlaceService {

    @Autowired
    private TouristPlaceRepository touristPlaceRepository;

    public List<TouristPlace> getAllTouristPlaces() {
        return touristPlaceRepository.findAll();
    }

    public Optional<TouristPlace> getTouristPlaceById(Long id) {
        return touristPlaceRepository.findById(id);
    }

    public List<TouristPlace> getTouristPlacesByStateId(Long stateId) {
        return touristPlaceRepository.findByStateId(stateId);
    }
}
