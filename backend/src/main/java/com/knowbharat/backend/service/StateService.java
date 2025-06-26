package com.knowbharat.backend.service;

import com.knowbharat.backend.entity.State;
import com.knowbharat.backend.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateService {
    @Autowired
    private StateRepository stateRepository;

    public List<State> getAllStates() {
        return stateRepository.findAll();
    }

    public State getStateByName(String name) {
        return stateRepository.findByName(name);
    }
}
