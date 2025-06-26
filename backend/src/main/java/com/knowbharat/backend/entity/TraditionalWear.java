package com.knowbharat.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity (name = "traditional_wears")
@Data // Generates getters, setters, toString, equals, and hashcode
@NoArgsConstructor // Generates a no-args constructor
@AllArgsConstructor // Generates a constructor with all fields
public class TraditionalWear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "state_id", nullable = false)
    private State state;

    private String menWear;
    private String womenWear;
    private String imageUrl;
}
