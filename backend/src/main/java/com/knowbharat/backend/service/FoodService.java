package com.knowbharat.backend.service;

import com.knowbharat.backend.entity.Food;
import com.knowbharat.backend.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    public List<Food> getAllFoods() { return foodRepository.findAll();
    }

    public List<Food> getFoodsByState(int stateid) { return foodRepository.findByStateId(stateid);
    }
}
